import { createPopover } from '../popover/createPopover';
import type { PopoverInstance } from '../popover/types';
import type { DatePickerInstance, DatePickerOptions, Weekday } from './types';
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

  const isDateTime = mode === 'datetime';
  // datetime stays open after picking a day so the user can also set the time.
  const closeOnSelect = options.closeOnSelect ?? !isDateTime;
  const defaultTime = options.defaultTime ?? { hours: 0, minutes: 0 };

  const controlled = options.value !== undefined;
  const parseValue = (v: Date | string | null | undefined): Date | null =>
    isDateTime ? toDateTime(v) : toDate(v);

  const min = toDate(options.min);
  const max = toDate(options.max);
  const disabledWeekdays = options.disabledWeekdays ?? null;
  const disabledDates = Array.isArray(options.disabledDates)
    ? options.disabledDates.map((d) => toDate(d)).filter((d): d is Date => d !== null)
    : (options.disabledDates ?? null);
  const format =
    options.format ?? (isDateTime ? (d: Date) => formatDateTime(d, locale) : (d: Date) => defaultFormat(d, locale));

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
  const surface = el('div', 'gds-popover gds-datepicker__popover');
  const calendar = el('div', `gds-calendar${compact ? ' gds-calendar--compact' : ''}`);
  surface.appendChild(calendar);

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

  const grid = el('div', 'gds-calendar__grid', { role: 'grid' });
  grid.id = `gds-dp-grid-${++idCounter}`;

  // Visually-hidden polite live region — announces month changes to AT.
  const liveRegion = el('div', 'gds-sr-only', { 'aria-live': 'polite', 'aria-atomic': 'true' });

  calendar.append(header, weekdaysRow, grid, liveRegion);

  // --- Time row (datetime only): label + bordered HH / MM segment spinners ---
  let hourField: HTMLInputElement | null = null;
  let minuteField: HTMLInputElement | null = null;

  if (isDateTime) {
    const timeRow = el('div', 'gds-calendar__time');
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

    timeRow.append(label, stepper);
    calendar.appendChild(timeRow);
  }

  // --- Footer (Today / Clear) ---
  if (showToday || showClear) {
    const footer = el('div', 'gds-calendar__footer');
    if (showToday) {
      const todayBtn = el('button', 'gds-btn gds-btn--ghost gds-btn--sm', {
        type: 'button',
        'aria-label': "Select today's date",
      });
      todayBtn.innerHTML = '<span class="gds-btn__label">Today</span>';
      todayBtn.addEventListener('click', () => selectDate(startOfDay(new Date())));
      footer.appendChild(todayBtn);
    }
    if (showClear) {
      const clearBtn = el('button', 'gds-btn gds-btn--ghost gds-btn--sm', {
        type: 'button',
        'aria-label': 'Clear selected date',
      });
      clearBtn.innerHTML = '<span class="gds-btn__label">Clear</span>';
      clearBtn.addEventListener('click', () => {
        timeH = defaultTime.hours;
        timeM = defaultTime.minutes;
        emit(null);
      });
      footer.appendChild(clearBtn);
    }
    calendar.appendChild(footer);
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
    grid.setAttribute('aria-label', getMonthLabel(viewYear, viewMonth, locale));
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
    renderTitle();
    renderGrid();
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
  grid.addEventListener('keydown', (e) => {
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
    if (selected) {
      emit(setTime(selected, timeH, timeM));
    } else {
      // No date chosen yet — just reflect the time in the fields.
      renderTime();
    }
  }

  grid.addEventListener('click', (e) => {
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
  prevBtn.addEventListener('click', () => shiftMonth(-1));
  nextBtn.addEventListener('click', () => shiftMonth(1));

  // --- Popover wiring ---
  render();
  const popover: PopoverInstance = createPopover(input, surface, {
    placement,
    role: 'dialog',
    // We manage initial focus ourselves (the focused day cell), not the popover.
    initialFocus: 'none',
    returnFocus: true,
    onOpen: () => {
      focusedDate = computeInitialFocus();
      viewYear = focusedDate.getFullYear();
      viewMonth = focusedDate.getMonth();
      render();
      const cell = grid.querySelector<HTMLElement>(`[data-date="${focusedDate.getTime()}"]`);
      (cell ?? surface).focus();
      onOpen?.();
    },
    onClose: () => onClose?.(),
  });

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
      input.removeEventListener('click', onInputActivate);
      input.removeEventListener('keydown', onInputKeydown);
      if (surface.parentNode) surface.parentNode.removeChild(surface);
    },
    get isOpen() {
      return popover.isOpen;
    },
  };
}
