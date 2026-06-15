import { createPopover } from '../popover/createPopover';
import type { PopoverInstance } from '../popover/types';
import type { DatePickerInstance, DatePickerOptions, Weekday } from './types';
import {
  addMonths,
  buildMonthMatrix,
  defaultFormat,
  getMonthLabel,
  getWeekdayLabels,
  isDateDisabled,
  isSameDay,
  startOfDay,
  toDate,
} from './dateUtils';

const SVG_NS = 'http://www.w3.org/2000/svg';
const CHEVRON = {
  left: 'M15 18l-6-6 6-6',
  right: 'M9 18l6-6-6-6',
} as const;

let idCounter = 0;

function chevron(dir: 'left' | 'right'): SVGSVGElement {
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
 * Functional date-only DatePicker. Wires a trigger input to a Floating-UI
 * popover containing a rendered `.gds-calendar`, with single-date selection,
 * month navigation, min/max, disabled dates/weekdays, weekStartsOn, Today/Clear,
 * controlled/uncontrolled value, and value write-back to the input.
 *
 * Date mode only — datetime / time / presets / full keyboard-grid nav are later
 * phases. Keyboard baseline here: input opens on Enter/Space/ArrowDown, Esc
 * closes (popover), day/nav/footer are native <button>s (Tab + Enter operable).
 */
export function createDatePicker(
  input: HTMLInputElement,
  options: DatePickerOptions = {},
): DatePickerInstance {
  const {
    onChange,
    weekStartsOn = 0,
    locale = typeof navigator !== 'undefined' ? navigator.language || 'en' : 'en',
    placement = 'bottom-start',
    closeOnSelect = true,
    showToday = true,
    showClear = true,
    compact = false,
    onOpen,
    onClose,
  } = options;

  const controlled = options.value !== undefined;
  const min = toDate(options.min);
  const max = toDate(options.max);
  const disabledWeekdays = options.disabledWeekdays ?? null;
  const disabledDates = Array.isArray(options.disabledDates)
    ? options.disabledDates.map((d) => toDate(d)).filter((d): d is Date => d !== null)
    : (options.disabledDates ?? null);
  const format = options.format ?? ((d: Date) => defaultFormat(d, locale));

  const disableOpts = { min, max, disabledDates, disabledWeekdays };

  // --- State ---
  let selected: Date | null = toDate(controlled ? options.value : options.defaultValue);
  const initialView = selected ?? startOfDay(new Date());
  let viewYear = initialView.getFullYear();
  let viewMonth = initialView.getMonth();

  // --- DOM: surface > calendar (header, weekdays, grid, footer) ---
  const surface = el('div', 'gds-popover gds-datepicker__popover');
  const calendar = el('div', `gds-calendar${compact ? ' gds-calendar--compact' : ''}`);
  surface.appendChild(calendar);

  // Header
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

  // Weekday row (rebuilt only if locale/weekStart change — static here)
  const weekdaysRow = el('div', 'gds-calendar__weekdays', { role: 'row' });
  for (const label of getWeekdayLabels(weekStartsOn as Weekday, locale)) {
    const cell = el('span', 'gds-calendar__weekday', { role: 'columnheader' });
    cell.textContent = label;
    weekdaysRow.appendChild(cell);
  }

  // Grid
  const grid = el('div', 'gds-calendar__grid', { role: 'grid' });
  grid.id = `gds-dp-grid-${++idCounter}`;

  calendar.append(header, weekdaysRow, grid);

  // Footer (Today / Clear)
  let footer: HTMLElement | null = null;
  if (showToday || showClear) {
    footer = el('div', 'gds-calendar__footer');
    if (showToday) {
      const todayBtn = el('button', 'gds-btn gds-btn--ghost gds-btn--sm', { type: 'button' });
      todayBtn.innerHTML = '<span class="gds-btn__label">Today</span>';
      todayBtn.addEventListener('click', () => selectDate(startOfDay(new Date())));
      footer.appendChild(todayBtn);
    }
    if (showClear) {
      const clearBtn = el('button', 'gds-btn gds-btn--ghost gds-btn--sm', { type: 'button' });
      clearBtn.innerHTML = '<span class="gds-btn__label">Clear</span>';
      clearBtn.addEventListener('click', () => commit(null));
      footer.appendChild(clearBtn);
    }
    calendar.appendChild(footer);
  }

  // --- Rendering ---
  function renderTitle(): void {
    title.textContent = getMonthLabel(viewYear, viewMonth, locale);
  }

  function renderGrid(): void {
    grid.replaceChildren();
    const today = startOfDay(new Date());
    const cells = buildMonthMatrix(viewYear, viewMonth, weekStartsOn as Weekday);
    for (const date of cells) {
      const outside = date.getMonth() !== viewMonth;
      const disabled = isDateDisabled(date, disableOpts);
      const isSelected = selected != null && isSameDay(date, selected);
      const isToday = isSameDay(date, today);

      const classes = ['gds-calendar__day'];
      if (outside) classes.push('gds-calendar__day--outside');
      if (isToday) classes.push('gds-calendar__day--today');
      if (isSelected) classes.push('gds-calendar__day--selected');
      if (disabled) classes.push('gds-calendar__day--disabled');

      const cell = el('button', classes.join(' '), { type: 'button', role: 'gridcell' });
      cell.textContent = String(date.getDate());
      cell.dataset.date = String(date.getTime());
      if (isSelected) cell.setAttribute('aria-selected', 'true');
      if (isToday) cell.setAttribute('aria-current', 'date');
      if (disabled) {
        cell.setAttribute('aria-disabled', 'true');
        cell.tabIndex = -1;
        cell.disabled = true;
      }
      grid.appendChild(cell);
    }
  }

  function render(): void {
    renderTitle();
    renderGrid();
  }

  // --- Value + selection ---
  // Hoisted; `popover` (declared below) is assigned before any user-driven call.
  function close(): void {
    popover.close();
  }

  function writeInput(): void {
    input.value = selected ? format(selected) : '';
  }

  function commit(date: Date | null): void {
    if (!controlled) {
      selected = date;
      render();
    }
    writeInput();
    onChange?.(date);
    if (date && closeOnSelect) close();
  }

  function selectDate(date: Date): void {
    if (isDateDisabled(date, disableOpts)) return;
    const d = startOfDay(date);
    viewYear = d.getFullYear();
    viewMonth = d.getMonth();
    commit(d);
  }

  // Day selection via delegation
  grid.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest<HTMLButtonElement>('.gds-calendar__day');
    if (!target || target.disabled || !target.dataset.date) return;
    selectDate(new Date(Number(target.dataset.date)));
  });

  prevBtn.addEventListener('click', () => {
    const v = addMonths(new Date(viewYear, viewMonth, 1), -1);
    viewYear = v.getFullYear();
    viewMonth = v.getMonth();
    render();
  });
  nextBtn.addEventListener('click', () => {
    const v = addMonths(new Date(viewYear, viewMonth, 1), 1);
    viewYear = v.getFullYear();
    viewMonth = v.getMonth();
    render();
  });

  // --- Popover wiring ---
  render();
  const popover: PopoverInstance = createPopover(input, surface, {
    placement,
    role: 'dialog',
    returnFocus: true,
    onOpen: () => {
      // Re-sync the view to the selected month each open.
      const base = selected ?? startOfDay(new Date());
      viewYear = base.getFullYear();
      viewMonth = base.getMonth();
      render();
      onOpen?.();
    },
    onClose: () => onClose?.(),
  });

  // Open the picker from the input (click + minimal keyboard baseline).
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
  writeInput();

  return {
    open: () => popover.open(),
    close: () => popover.close(),
    toggle: () => popover.toggle(),
    getValue: () => selected,
    setValue(value) {
      selected = toDate(value);
      const base = selected ?? startOfDay(new Date());
      viewYear = base.getFullYear();
      viewMonth = base.getMonth();
      render();
      writeInput();
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
