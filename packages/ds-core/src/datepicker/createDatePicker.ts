import { createPopover } from '../popover/createPopover';
import type { PopoverInstance } from '../popover/types';
import type { DatePickerInstance, DatePickerOptions, DatePickerPreset, PresetContext, Weekday } from './types';
import {
  addDays,
  addMonths,
  addMonthsClampDay,
  addYearsClampDay,
  buildMonthMatrix,
  clampInt,
  defaultFormat,
  endOfWeek,
  firstEnabledInMonth,
  formatDateTime,
  formatTimeValue,
  formatFullDate,
  getMonthLabel,
  getWeekdayLabels,
  isDateDisabled,
  isSameDay,
  isSameMonth,
  nextEnabled,
  pad2Time,
  setTime,
  startOfDay,
  startOfWeek,
  stepHour,
  stepMinute,
  toDate,
  toDateTime,
  toTime,
} from './dateUtils';

const SVG_NS = 'http://www.w3.org/2000/svg';
const CHEVRON: Record<'left' | 'right' | 'up' | 'down', string> = {
  left: 'M15 18l-6-6 6-6',
  right: 'M9 18l6-6-6-6',
  up: 'M18 15l-6-6-6 6',
  down: 'M6 9l6 6 6-6',
};

let idCounter = 0;

function chevron(dir: 'left' | 'right' | 'up' | 'down'): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.5');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', CHEVRON[dir]);
  svg.appendChild(path);
  return svg;
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  attrs?: Record<string, string>,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (attrs) for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  return node;
}

/**
 * Functional DatePicker. Wires a trigger input to a Floating-UI popover
 * containing a rendered `.gds-calendar`, with single-date selection, month
 * navigation, min/max, disabled dates/weekdays, weekStartsOn, Today/Clear,
 * controlled/uncontrolled value, and value write-back.
 *
 * mode 'date' (default) — date only.
 * mode 'datetime' — adds a compact time row below the grid (bordered HH/MM
 *   segments + ▲/▼). Picking a day preserves the chosen time; ±stepping the
 *   time updates the full datetime value. 24h only this phase.
 *
 * Out of scope: time-only, presets, full keyboard-grid roving nav.
 */
export function createDatePicker(
  input: HTMLInputElement,
  options: DatePickerOptions = {},
): DatePickerInstance {
  const {
    mode = 'date',
    minuteStep = 1,
    onChange,
    weekStartsOn = 0,
    locale = typeof navigator !== 'undefined' ? navigator.language || 'en' : 'en',
    placement = 'bottom-start',
    showToday = true,
    showClear = true,
    compact = false,
    onOpen,
    onClose,
  } = options;

  const isTime = mode === 'time';
  const isDateTime = mode === 'datetime';
  const hasTime = isDateTime || isTime; // shows the HH/MM time control
  const hasGrid = !isTime; // shows the calendar grid
  // datetime stays open after picking a day so the user can also set the time.
  const closeOnSelect = options.closeOnSelect ?? !hasTime;
  const defaultTime = options.defaultTime ?? { hours: 0, minutes: 0 };

  // Presets (product-provided) — only in grid modes; render the advanced layout.
  const baseDate = toDateTime(options.baseDate);
  const presets = hasGrid ? (options.presets ?? []) : [];
  const advanced = presets.length > 0;

  const controlled = options.value !== undefined;
  const parseValue = (v: Date | string | null | undefined): Date | null =>
    isTime ? toTime(v) : isDateTime ? toDateTime(v) : toDate(v);

  const min = toDate(options.min);
  const max = toDate(options.max);
  const disabledWeekdays = options.disabledWeekdays ?? null;
  const disabledDates = Array.isArray(options.disabledDates)
    ? options.disabledDates.map((d) => toDate(d)).filter((d): d is Date => d !== null)
    : (options.disabledDates ?? null);
  const format =
    options.format ??
    (isTime
      ? (d: Date) => formatTimeValue(d)
      : isDateTime
        ? (d: Date) => formatDateTime(d, locale)
        : (d: Date) => defaultFormat(d, locale));

  const disableOpts = { min, max, disabledDates, disabledWeekdays };

  // --- State ---
  let selected: Date | null = parseValue(controlled ? options.value : options.defaultValue);
  let timeH = selected ? selected.getHours() : defaultTime.hours;
  let timeM = selected ? selected.getMinutes() : defaultTime.minutes;
  const initialView = selected ?? startOfDay(new Date());
  let viewYear = initialView.getFullYear();
  let viewMonth = initialView.getMonth();
  // Roving-tabindex focus position within the grid (distinct from `selected`).
  let focusedDate: Date = startOfDay(selected ?? new Date());

  // --- DOM: surface > calendar (header, weekdays, grid, [time], [footer]) ---
  // Advanced (presets): calendar parts live in __main; presets render in an aside.
  const surface = el('div', 'gds-popover gds-datepicker__popover');
  // The popover is exposed as role="dialog" (by createPopover); give it an
  // accessible name so AT announces it (axe: aria-dialog-name).
  surface.setAttribute('aria-label', isTime ? 'Choose time' : isDateTime ? 'Choose date and time' : 'Choose date');
  const calendar = el(
    'div',
    `gds-calendar${compact ? ' gds-calendar--compact' : ''}${advanced ? ' gds-calendar--advanced' : ''}`,
  );
  surface.appendChild(calendar);
  // Where the calendar parts (header/grid/time/footer) get appended.
  const main = advanced ? el('div', 'gds-calendar__main') : calendar;

  const header = el('div', 'gds-calendar__header');
  const prevBtn = el('button', 'gds-btn-icon gds-btn-icon--ghost gds-btn-icon--sm gds-calendar__nav', {
    type: 'button',
    'aria-label': 'Previous month',
  });
  prevBtn.appendChild(chevron('left'));
  const title = el('h2', 'gds-calendar__title');
  const nextBtn = el('button', 'gds-btn-icon gds-btn-icon--ghost gds-btn-icon--sm gds-calendar__nav', {
    type: 'button',
    'aria-label': 'Next month',
  });
  nextBtn.appendChild(chevron('right'));
  header.append(prevBtn, title, nextBtn);

  const weekdaysRow = el('div', 'gds-calendar__weekdays', { role: 'row' });
  for (const label of getWeekdayLabels(weekStartsOn as Weekday, locale)) {
    const cell = el('span', 'gds-calendar__weekday', { role: 'columnheader' });
    cell.textContent = label;
    weekdaysRow.appendChild(cell);
  }

  // ARIA grid: the role="grid" lives on a wrapper so the weekday row
  // (columnheaders) and the day rows are both valid grid children — the day
  // rows sit in a rowgroup (axe: aria-required-parent). The wrapper is
  // `display: contents`, so layout is unchanged.
  const gridWrap = el('div', 'gds-calendar__grid-wrap', { role: 'grid' });
  const grid = el('div', 'gds-calendar__grid', { role: 'rowgroup' });
  grid.id = `gds-dp-grid-${++idCounter}`;

  // Visually-hidden polite live region — announces month changes to AT.
  const liveRegion = el('div', 'gds-sr-only', { 'aria-live': 'polite', 'aria-atomic': 'true' });

  // Time-only mode renders no calendar — only the time control + footer below.
  if (hasGrid) {
    gridWrap.append(weekdaysRow, grid);
    main.append(header, gridWrap, liveRegion);
  }

  // --- Time row (datetime + time modes): bordered HH / MM segment spinners ---
  // datetime: "Time" label + stepper, below the grid with a divider.
  // time-only: stepper only (no label), bare (no divider) — it is the whole panel.
  let hourField: HTMLInputElement | null = null;
  let minuteField: HTMLInputElement | null = null;

  if (hasTime) {
    const timeRow = el('div', `gds-calendar__time${isTime ? ' gds-calendar__time--bare' : ''}`);
    const label = el('span', 'gds-calendar__time-label');
    label.textContent = 'Time';
    const stepper = el('div', 'gds-time-stepper');

    const makeUnit = (which: 'Hours' | 'Minutes', maxVal: number): HTMLInputElement => {
      const unit = el('div', 'gds-time-stepper__unit');
      const field = el('input', 'gds-time-stepper__field', {
        type: 'text',
        inputmode: 'numeric',
        maxlength: '2',
        role: 'spinbutton',
        'aria-label': which,
        'aria-valuemin': '0',
        'aria-valuemax': String(maxVal),
      });
      const spin = el('span', 'gds-time-stepper__spin');
      const up = el('button', 'gds-time-stepper__btn gds-time-stepper__btn--up', {
        type: 'button',
        'aria-label': `Increment ${which.toLowerCase()}`,
      });
      up.appendChild(chevron('up'));
      const down = el('button', 'gds-time-stepper__btn gds-time-stepper__btn--down', {
        type: 'button',
        'aria-label': `Decrement ${which.toLowerCase()}`,
      });
      down.appendChild(chevron('down'));
      spin.append(up, down);
      unit.append(field, spin);

      const isHours = which === 'Hours';
      up.addEventListener('click', () => stepTime(isHours, +1));
      down.addEventListener('click', () => stepTime(isHours, -1));
      field.addEventListener('change', () => {
        const n = clampInt(Number.parseInt(field.value, 10), maxVal);
        if (isHours) timeH = n;
        else timeM = n;
        applyTime();
      });
      field.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          stepTime(isHours, +1);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          stepTime(isHours, -1);
        }
      });
      stepper.appendChild(unit);
      return field;
    };

    hourField = makeUnit('Hours', 23);
    const sep = el('span', 'gds-time-stepper__separator');
    sep.textContent = ':';
    stepper.appendChild(sep);
    minuteField = makeUnit('Minutes', 59);

    if (isTime) timeRow.append(stepper);
    else timeRow.append(label, stepper);
    main.appendChild(timeRow);
  }

  // --- Footer ---
  // date / datetime: "Today" (selects today). time-only: "Today" becomes "Now"
  // (sets the current time). "Clear" clears the value in every mode.
  if (showToday || showClear) {
    const footer = el('div', 'gds-calendar__footer');
    if (showToday) {
      const label = isTime ? 'Now' : 'Today';
      const ariaLabel = isTime ? 'Set the current time' : "Select today's date";
      const todayBtn = el('button', 'gds-btn gds-btn--ghost gds-btn--sm', {
        type: 'button',
        'aria-label': ariaLabel,
      });
      todayBtn.innerHTML = `<span class="gds-btn__label">${label}</span>`;
      todayBtn.addEventListener('click', () => {
        if (isTime) {
          const now = new Date();
          timeH = now.getHours();
          timeM = now.getMinutes();
          applyTime();
        } else {
          selectDate(startOfDay(new Date()));
        }
      });
      footer.appendChild(todayBtn);
    }
    if (showClear) {
      const clearBtn = el('button', 'gds-btn gds-btn--ghost gds-btn--sm', {
        type: 'button',
        'aria-label': isTime ? 'Clear selected time' : 'Clear selected date',
      });
      clearBtn.innerHTML = '<span class="gds-btn__label">Clear</span>';
      clearBtn.addEventListener('click', () => {
        timeH = defaultTime.hours;
        timeM = defaultTime.minutes;
        emit(null);
      });
      footer.appendChild(clearBtn);
    }
    main.appendChild(footer);
  }

  // --- Presets aside (advanced layout) ---
  function presetContext(): PresetContext {
    return { baseDate, value: selected, mode, now: new Date() };
  }
  function resolvePresetValue(p: DatePickerPreset): Date | null {
    const raw = typeof p.value === 'function' ? p.value(presetContext()) : p.value;
    return raw == null ? null : parseValue(raw);
  }
  function presetDisabled(p: DatePickerPreset): boolean {
    const explicit = typeof p.disabled === 'function' ? p.disabled(presetContext()) : !!p.disabled;
    if (explicit) return true;
    const v = resolvePresetValue(p);
    return v == null || isDateDisabled(v, disableOpts);
  }
  function applyPreset(p: DatePickerPreset): void {
    if (presetDisabled(p)) return;
    const v = resolvePresetValue(p);
    if (!v || isDateDisabled(v, disableOpts)) return;
    focusedDate = startOfDay(v);
    viewYear = v.getFullYear();
    viewMonth = v.getMonth();
    emit(v); // syncs timeH/timeM from v, re-renders, updates input + onChange
    if (closeOnSelect) close();
  }

  if (advanced) {
    const aside = el('div', 'gds-calendar__presets', { role: 'group', 'aria-label': 'Shortcuts' });
    const presetsTitle = el('p', 'gds-calendar__presets-title');
    presetsTitle.textContent = 'Shortcuts';
    const menu = el('div', 'gds-menu');
    for (const p of presets) {
      const disabled = presetDisabled(p);
      const rich = !!p.description;
      const item = el('button', `gds-menu__item${rich ? ' gds-menu__item--rich' : ''}`, {
        type: 'button',
      });
      if (rich) {
        const content = el('span', 'gds-menu__content');
        const lbl = el('span', 'gds-menu__label');
        lbl.textContent = p.label;
        const desc = el('span', 'gds-menu__desc');
        desc.textContent = p.description!;
        content.append(lbl, desc);
        item.appendChild(content);
      } else {
        const lbl = el('span', 'gds-menu__label');
        lbl.textContent = p.label;
        item.appendChild(lbl);
      }
      if (disabled) {
        item.classList.add('gds-menu__item--disabled');
        item.disabled = true;
        item.setAttribute('aria-disabled', 'true');
      } else {
        item.addEventListener('click', () => applyPreset(p));
      }
      menu.appendChild(item);
    }
    aside.append(presetsTitle, menu);
    calendar.append(main, aside);
  }

  // --- Rendering ---
  function renderTitle(): void {
    title.textContent = getMonthLabel(viewYear, viewMonth, locale);
  }

  /** Announce the current month to the live region (called on month changes). */
  function announce(): void {
    liveRegion.textContent = getMonthLabel(viewYear, viewMonth, locale);
  }

  function renderGrid(): void {
    grid.replaceChildren();
    gridWrap.setAttribute('aria-label', getMonthLabel(viewYear, viewMonth, locale));
    const today = startOfDay(new Date());
    const cells = buildMonthMatrix(viewYear, viewMonth, weekStartsOn as Weekday);

    // Exactly one tabbable cell: the focused date if it's a visible, enabled day
    // of this month; otherwise the first enabled day in the month.
    const focusInView =
      isSameMonth(focusedDate, new Date(viewYear, viewMonth, 1)) &&
      !isDateDisabled(focusedDate, disableOpts);
    const tabbable: Date | null = focusInView
      ? focusedDate
      : firstEnabledInMonth(viewYear, viewMonth, disableOpts);

    let week: HTMLElement | null = null;
    cells.forEach((date, i) => {
      if (i % 7 === 0) {
        week = el('div', 'gds-calendar__week', { role: 'row' });
        grid.appendChild(week);
      }
      const outside = date.getMonth() !== viewMonth;
      const disabled = isDateDisabled(date, disableOpts);
      const isSelected = selected != null && isSameDay(date, selected);
      const isToday = isSameDay(date, today);

      const classes = ['gds-calendar__day'];
      if (outside) classes.push('gds-calendar__day--outside');
      if (isToday) classes.push('gds-calendar__day--today');
      if (isSelected) classes.push('gds-calendar__day--selected');
      if (disabled) classes.push('gds-calendar__day--disabled');

      const cell = el('button', classes.join(' '), {
        type: 'button',
        role: 'gridcell',
        'aria-label': formatFullDate(date, locale),
      });
      cell.textContent = String(date.getDate());
      cell.dataset.date = String(date.getTime());
      if (isSelected) cell.setAttribute('aria-selected', 'true');
      if (isToday) cell.setAttribute('aria-current', 'date');
      if (disabled) {
        cell.setAttribute('aria-disabled', 'true');
        cell.disabled = true;
        cell.tabIndex = -1;
      } else {
        cell.tabIndex = tabbable && isSameDay(date, tabbable) ? 0 : -1;
      }
      week!.appendChild(cell);
    });
  }

  function renderTime(): void {
    if (hourField) {
      hourField.value = pad2Time(timeH);
      hourField.setAttribute('aria-valuenow', String(timeH));
    }
    if (minuteField) {
      minuteField.value = pad2Time(timeM);
      minuteField.setAttribute('aria-valuenow', String(timeM));
    }
  }

  function render(): void {
    if (hasGrid) {
      renderTitle();
      renderGrid();
    }
    renderTime();
  }

  // --- Value plumbing ---
  function close(): void {
    popover.close();
  }

  /** Build the value for a chosen day, attaching the current time in datetime mode. */
  function composeValue(day: Date): Date {
    return isDateTime ? setTime(day, timeH, timeM) : startOfDay(day);
  }

  /** Push a value out: update internal state (uncontrolled), input, and onChange. */
  function emit(value: Date | null): void {
    if (!controlled) selected = value;
    if (value) {
      timeH = value.getHours();
      timeM = value.getMinutes();
    }
    render();
    input.value = value ? format(value) : '';
    onChange?.(value);
  }

  function selectDate(date: Date): void {
    if (isDateDisabled(date, disableOpts)) return;
    focusedDate = startOfDay(date);
    viewYear = date.getFullYear();
    viewMonth = date.getMonth();
    emit(composeValue(date));
    if (closeOnSelect) close();
  }

  /** Compute where roving focus lands when the picker opens. */
  function computeInitialFocus(): Date {
    const today = startOfDay(new Date());
    if (selected && !isDateDisabled(selected, disableOpts)) return startOfDay(selected);
    if (!isDateDisabled(today, disableOpts)) return today;
    const base = selected ?? today;
    return firstEnabledInMonth(base.getFullYear(), base.getMonth(), disableOpts) ?? today;
  }

  /** Move roving focus to `date`: sync the view, re-render, announce, focus the cell. */
  function moveFocusTo(date: Date): void {
    const monthChanged = !isSameMonth(date, new Date(viewYear, viewMonth, 1));
    focusedDate = startOfDay(date);
    viewYear = focusedDate.getFullYear();
    viewMonth = focusedDate.getMonth();
    render();
    if (monthChanged) announce();
    const cell = grid.querySelector<HTMLElement>(`[data-date="${focusedDate.getTime()}"]`);
    cell?.focus();
  }

  // Keyboard grid navigation (roving tabindex). Disabled days are skipped.
  // Grid-only — not attached in time-only mode (no grid is rendered).
  if (hasGrid) grid.addEventListener('keydown', (e) => {
    const base = focusedDate;
    let target: Date | null = null;
    let dir = 1;
    switch (e.key) {
      case 'ArrowRight': target = addDays(base, 1); dir = 1; break;
      case 'ArrowLeft': target = addDays(base, -1); dir = -1; break;
      case 'ArrowDown': target = addDays(base, 7); dir = 1; break;
      case 'ArrowUp': target = addDays(base, -7); dir = -1; break;
      case 'Home': target = startOfWeek(base, weekStartsOn as Weekday); dir = -1; break;
      case 'End': target = endOfWeek(base, weekStartsOn as Weekday); dir = 1; break;
      case 'PageUp': target = e.shiftKey ? addYearsClampDay(base, -1) : addMonthsClampDay(base, -1); dir = -1; break;
      case 'PageDown': target = e.shiftKey ? addYearsClampDay(base, 1) : addMonthsClampDay(base, 1); dir = 1; break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isDateDisabled(focusedDate, disableOpts)) selectDate(focusedDate);
        return;
      default:
        return;
    }
    e.preventDefault();
    const enabled = nextEnabled(target, dir, disableOpts);
    if (enabled) moveFocusTo(enabled);
  });

  /** Time ±step. Updates the value when a day is already selected; never closes. */
  function stepTime(isHours: boolean, delta: number): void {
    if (isHours) timeH = stepHour(timeH, delta);
    else timeM = stepMinute(timeM, delta, minuteStep);
    applyTime();
  }

  function applyTime(): void {
    if (isTime) {
      // Time-only: no day to wait for — always produce a value (anchored today).
      emit(setTime(startOfDay(new Date()), timeH, timeM));
    } else if (selected) {
      emit(setTime(selected, timeH, timeM));
    } else {
      // datetime with no day chosen yet — just reflect the time in the fields.
      renderTime();
    }
  }

  if (hasGrid) grid.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest<HTMLButtonElement>('.gds-calendar__day');
    if (!target || target.disabled || !target.dataset.date) return;
    selectDate(new Date(Number(target.dataset.date)));
  });

  function shiftMonth(delta: number): void {
    const v = addMonths(new Date(viewYear, viewMonth, 1), delta);
    viewYear = v.getFullYear();
    viewMonth = v.getMonth();
    render();
    announce();
  }
  if (hasGrid) {
    prevBtn.addEventListener('click', () => shiftMonth(-1));
    nextBtn.addEventListener('click', () => shiftMonth(1));
  }

  // --- Popover wiring ---
  render();
  const popover: PopoverInstance = createPopover(input, surface, {
    placement,
    role: 'dialog',
    // We manage initial focus ourselves (the focused day cell), not the popover.
    initialFocus: 'none',
    returnFocus: true,
    onOpen: () => {
      if (isTime) {
        // Time-only: focus the hour field (no grid).
        renderTime();
        hourField?.focus();
      } else {
        focusedDate = computeInitialFocus();
        viewYear = focusedDate.getFullYear();
        viewMonth = focusedDate.getMonth();
        render();
        const cell = grid.querySelector<HTMLElement>(`[data-date="${focusedDate.getTime()}"]`);
        (cell ?? surface).focus();
      }
      onOpen?.();
    },
    onClose: () => onClose?.(),
  });

  // createPopover put aria-haspopup/controls/expanded on the trigger; a plain
  // textbox doesn't permit those, so adopt the combobox role (axe:
  // aria-allowed-attr). Removed again on destroy.
  input.setAttribute('role', 'combobox');

  function onInputActivate(): void {
    if (!popover.isOpen) popover.open();
  }
  input.addEventListener('click', onInputActivate);
  function onInputKeydown(e: KeyboardEvent): void {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onInputActivate();
    }
  }
  input.addEventListener('keydown', onInputKeydown);

  // Initial input value
  input.value = selected ? format(selected) : '';

  return {
    open: () => popover.open(),
    close: () => popover.close(),
    toggle: () => popover.toggle(),
    getValue: () => selected,
    setValue(value) {
      selected = parseValue(value);
      if (selected) {
        timeH = selected.getHours();
        timeM = selected.getMinutes();
      }
      const base = selected ?? startOfDay(new Date());
      viewYear = base.getFullYear();
      viewMonth = base.getMonth();
      render();
      input.value = selected ? format(selected) : '';
    },
    destroy() {
      popover.destroy();
      input.removeAttribute('role');
      input.removeEventListener('click', onInputActivate);
      input.removeEventListener('keydown', onInputKeydown);
      if (surface.parentNode) surface.parentNode.removeChild(surface);
    },
    get isOpen() {
      return popover.isOpen;
    },
  };
}
