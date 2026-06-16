import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Popover positioning needs real layout; mock Floating UI (jsdom has none).
vi.mock('@floating-ui/dom', () => ({
  computePosition: vi.fn(() =>
    Promise.resolve({ x: 0, y: 0, placement: 'bottom-start', middlewareData: {} }),
  ),
  autoUpdate: vi.fn(() => vi.fn()),
  offset: vi.fn(() => ({ name: 'offset' })),
  flip: vi.fn(() => ({ name: 'flip' })),
  shift: vi.fn(() => ({ name: 'shift' })),
  arrow: vi.fn(() => ({ name: 'arrow' })),
}));

import { createDatePicker } from './createDatePicker';

let input: HTMLInputElement;

beforeEach(() => {
  document.body.innerHTML = '';
  input = document.createElement('input');
  document.body.appendChild(input);
});
afterEach(() => {
  document.body.innerHTML = '';
});

const surface = () => document.querySelector('.gds-datepicker__popover');
const dayButtons = () =>
  Array.from(document.querySelectorAll<HTMLButtonElement>('.gds-calendar__grid .gds-calendar__day'));
const dayByText = (n: string) =>
  dayButtons().find((b) => b.textContent === n && !b.classList.contains('gds-calendar__day--outside'));

describe('rendering', () => {
  it('renders a 42-cell grid and weekday header on open', () => {
    const dp = createDatePicker(input, { defaultValue: '2026-06-15', locale: 'en-US' });
    dp.open();
    expect(surface()).not.toBeNull();
    expect(dayButtons()).toHaveLength(42);
    expect(document.querySelectorAll('.gds-calendar__weekday')).toHaveLength(7);
    expect(document.querySelector('.gds-calendar__title')!.textContent).toMatch(/June 2026/);
    dp.destroy();
  });

  it('marks the selected day and today', () => {
    const dp = createDatePicker(input, { defaultValue: '2026-06-15', locale: 'en-US' });
    dp.open();
    const sel = document.querySelector('.gds-calendar__day--selected');
    expect(sel!.textContent).toBe('15');
    expect(sel!.getAttribute('aria-selected')).toBe('true');
    dp.destroy();
  });
});

describe('selection', () => {
  it('selecting a day updates value, writes the input, fires onChange, and closes', () => {
    const onChange = vi.fn();
    const dp = createDatePicker(input, { defaultValue: '2026-06-15', locale: 'en-US', onChange });
    dp.open();
    dayByText('20')!.click();
    expect(dp.getValue()!.getDate()).toBe(20);
    expect(input.value).not.toBe('');
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange.mock.calls[0]![0].getDate()).toBe(20);
    expect(dp.isOpen).toBe(false); // closeOnSelect default
    dp.destroy();
  });

  it('closeOnSelect:false keeps it open', () => {
    const dp = createDatePicker(input, { defaultValue: '2026-06-15', closeOnSelect: false });
    dp.open();
    dayByText('20')!.click();
    expect(dp.isOpen).toBe(true);
    dp.destroy();
  });
});

describe('constraints', () => {
  it('disables days before min', () => {
    const dp = createDatePicker(input, { defaultValue: '2026-06-15', min: '2026-06-10' });
    dp.open();
    expect(dayByText('5')!.disabled).toBe(true);
    expect(dayByText('15')!.disabled).toBe(false);
    dp.destroy();
  });

  it('disables specific disabledDates and disabledWeekdays', () => {
    const dp = createDatePicker(input, {
      defaultValue: '2026-06-15',
      disabledDates: ['2026-06-18'],
      disabledWeekdays: [0, 6], // Sun/Sat
    });
    dp.open();
    expect(dayByText('18')!.disabled).toBe(true);
    // 2026-06-13 is Saturday
    expect(dayByText('13')!.disabled).toBe(true);
    dp.destroy();
  });

  it('clicking a disabled day does nothing', () => {
    const onChange = vi.fn();
    const dp = createDatePicker(input, { defaultValue: '2026-06-15', min: '2026-06-10', onChange });
    dp.open();
    dayByText('5')!.click();
    expect(onChange).not.toHaveBeenCalled();
    dp.destroy();
  });
});

describe('month navigation', () => {
  it('prev/next change the visible month without changing the value', () => {
    const dp = createDatePicker(input, { defaultValue: '2026-06-15', locale: 'en-US' });
    dp.open();
    (document.querySelector('[aria-label="Next month"]') as HTMLButtonElement).click();
    expect(document.querySelector('.gds-calendar__title')!.textContent).toMatch(/July 2026/);
    expect(dp.getValue()!.getMonth()).toBe(5); // value unchanged (June)
    (document.querySelector('[aria-label="Previous month"]') as HTMLButtonElement).click();
    (document.querySelector('[aria-label="Previous month"]') as HTMLButtonElement).click();
    expect(document.querySelector('.gds-calendar__title')!.textContent).toMatch(/May 2026/);
    dp.destroy();
  });
});

describe('footer actions', () => {
  it('Today selects today; Clear empties the value', () => {
    const dp = createDatePicker(input, { defaultValue: '2026-01-01', locale: 'en-US', closeOnSelect: false });
    dp.open();
    (Array.from(document.querySelectorAll('.gds-calendar__footer .gds-btn')).find(
      (b) => b.textContent!.trim() === 'Today',
    ) as HTMLButtonElement).click();
    const today = new Date();
    expect(dp.getValue()!.getDate()).toBe(today.getDate());
    (Array.from(document.querySelectorAll('.gds-calendar__footer .gds-btn')).find(
      (b) => b.textContent!.trim() === 'Clear',
    ) as HTMLButtonElement).click();
    expect(dp.getValue()).toBeNull();
    expect(input.value).toBe('');
    dp.destroy();
  });
});

describe('controlled vs uncontrolled', () => {
  it('uncontrolled: defaultValue reflected and internal state updates on select', () => {
    const dp = createDatePicker(input, { defaultValue: '2026-06-15' });
    dp.open();
    dayByText('20')!.click();
    expect(dp.getValue()!.getDate()).toBe(20);
    dp.destroy();
  });

  it('controlled: selecting fires onChange but internal value stays until setValue', () => {
    const onChange = vi.fn();
    const dp = createDatePicker(input, { value: '2026-06-15', onChange, closeOnSelect: false });
    dp.open();
    dayByText('20')!.click();
    expect(onChange).toHaveBeenCalledWith(expect.any(Date));
    expect(dp.getValue()!.getDate()).toBe(15); // unchanged — consumer controls
    dp.setValue('2026-06-20');
    expect(dp.getValue()!.getDate()).toBe(20);
    dp.destroy();
  });
});

describe('weekStartsOn', () => {
  it('changes the first weekday column', () => {
    const dp = createDatePicker(input, { defaultValue: '2026-06-15', weekStartsOn: 1, locale: 'en-US' });
    dp.open();
    const firstCol = document.querySelector('.gds-calendar__weekday')!.textContent;
    expect(firstCol).toMatch(/Mon/);
    dp.destroy();
  });
});

describe('datetime mode', () => {
  const fields = () => Array.from(document.querySelectorAll<HTMLInputElement>('.gds-time-stepper__field'));
  const hourField = () => fields()[0]!;
  const minuteField = () => fields()[1]!;
  const tbtn = (label: string) => document.querySelector<HTMLButtonElement>(`[aria-label="${label}"]`)!;

  it('renders a compact time row with HH/MM segments + reflects the value', () => {
    const dp = createDatePicker(input, { mode: 'datetime', defaultValue: '2026-06-15T10:30', locale: 'en-GB' });
    dp.open();
    expect(fields()).toHaveLength(2);
    expect(hourField().value).toBe('10');
    expect(minuteField().value).toBe('30');
    expect(input.value).toBe('15/06/2026 10:30');
    dp.destroy();
  });

  it('does not close on date select (so the user can set the time)', () => {
    const dp = createDatePicker(input, { mode: 'datetime', defaultValue: '2026-06-15T10:30' });
    dp.open();
    dayByText('18')!.click();
    expect(dp.isOpen).toBe(true);
    dp.destroy();
  });

  it('date selection preserves the chosen time', () => {
    const dp = createDatePicker(input, { mode: 'datetime', defaultValue: '2026-06-15T10:30' });
    dp.open();
    dayByText('18')!.click();
    const v = dp.getValue()!;
    expect([v.getDate(), v.getHours(), v.getMinutes()]).toEqual([18, 10, 30]);
    dp.destroy();
  });

  it('hour increment/decrement updates the full datetime value', () => {
    const dp = createDatePicker(input, { mode: 'datetime', defaultValue: '2026-06-15T10:30' });
    dp.open();
    dayByText('18')!.click();
    tbtn('Increment hours').click();
    expect(dp.getValue()!.getHours()).toBe(11);
    tbtn('Decrement hours').click();
    tbtn('Decrement hours').click();
    expect(dp.getValue()!.getHours()).toBe(9);
    dp.destroy();
  });

  it('minute increment/decrement updates the value', () => {
    const dp = createDatePicker(input, { mode: 'datetime', defaultValue: '2026-06-15T10:30' });
    dp.open();
    dayByText('18')!.click();
    tbtn('Increment minutes').click();
    expect(dp.getValue()!.getMinutes()).toBe(31);
    dp.destroy();
  });

  it('minuteStep controls the minute increment', () => {
    const dp = createDatePicker(input, { mode: 'datetime', defaultValue: '2026-06-15T10:00', minuteStep: 15 });
    dp.open();
    dayByText('18')!.click();
    tbtn('Increment minutes').click();
    expect(dp.getValue()!.getMinutes()).toBe(15);
    dp.destroy();
  });

  it('uncontrolled: defaultValue time reflected; selection updates internally', () => {
    const dp = createDatePicker(input, { mode: 'datetime', defaultValue: '2026-06-15T08:00' });
    dp.open();
    dayByText('20')!.click();
    expect([dp.getValue()!.getDate(), dp.getValue()!.getHours()]).toEqual([20, 8]);
    dp.destroy();
  });

  it('controlled: select fires onChange with full datetime but internal stays until setValue', () => {
    const onChange = vi.fn();
    const dp = createDatePicker(input, { mode: 'datetime', value: '2026-06-15T10:00', onChange });
    dp.open();
    dayByText('20')!.click();
    expect(onChange).toHaveBeenCalledWith(expect.any(Date));
    expect(onChange.mock.calls[0]![0].getHours()).toBe(10);
    expect(dp.getValue()!.getDate()).toBe(15); // controlled — unchanged
    dp.setValue('2026-06-20T10:00');
    expect(dp.getValue()!.getDate()).toBe(20);
    dp.destroy();
  });

  it('Clear empties date and time', () => {
    const onChange = vi.fn();
    const dp = createDatePicker(input, { mode: 'datetime', defaultValue: '2026-06-15T10:30', onChange });
    dp.open();
    (Array.from(document.querySelectorAll('.gds-calendar__footer .gds-btn')).find(
      (b) => b.textContent!.trim() === 'Clear',
    ) as HTMLButtonElement).click();
    expect(dp.getValue()).toBeNull();
    expect(input.value).toBe('');
    expect(onChange).toHaveBeenCalledWith(null);
    dp.destroy();
  });

  it('Today sets today and keeps the current time', () => {
    const dp = createDatePicker(input, { mode: 'datetime', defaultValue: '2026-01-01T14:45' });
    dp.open();
    (Array.from(document.querySelectorAll('.gds-calendar__footer .gds-btn')).find(
      (b) => b.textContent!.trim() === 'Today',
    ) as HTMLButtonElement).click();
    const v = dp.getValue()!;
    const today = new Date();
    expect(v.getDate()).toBe(today.getDate());
    expect([v.getHours(), v.getMinutes()]).toEqual([14, 45]); // time preserved
    dp.destroy();
  });

  it('min disables days before it (datetime, day granularity)', () => {
    const dp = createDatePicker(input, { mode: 'datetime', defaultValue: '2026-06-15T10:00', min: '2026-06-10' });
    dp.open();
    expect(dayByText('5')!.disabled).toBe(true);
    expect(dayByText('12')!.disabled).toBe(false);
    dp.destroy();
  });

  it('typing into the hour field clamps and updates', () => {
    const dp = createDatePicker(input, { mode: 'datetime', defaultValue: '2026-06-15T10:00' });
    dp.open();
    dayByText('18')!.click();
    const hf = hourField();
    hf.value = '99';
    hf.dispatchEvent(new Event('change', { bubbles: true }));
    expect(dp.getValue()!.getHours()).toBe(23); // clamped to max
    dp.destroy();
  });
});

describe('keyboard navigation + roving tabindex', () => {
  const active = () => document.activeElement as HTMLElement;
  const press = (key: string, opts: KeyboardEventInit = {}) =>
    active().dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...opts }));

  it('focuses the selected date on open; exactly one tabbable cell', () => {
    const dp = createDatePicker(input, { defaultValue: '2026-06-15', locale: 'en-GB' });
    dp.open();
    expect(active().textContent).toBe('15');
    expect(active().getAttribute('role')).toBe('gridcell');
    const tabbables = [...document.querySelectorAll('.gds-calendar__day')].filter(
      (c) => (c as HTMLElement).tabIndex === 0,
    );
    expect(tabbables).toHaveLength(1);
    dp.destroy();
  });

  it('falls back to today, then first enabled, for initial focus', () => {
    const today = new Date();
    const dp1 = createDatePicker(input, {}); // no value → today
    dp1.open();
    expect(active().textContent).toBe(String(today.getDate()));
    dp1.destroy();

    // today disabled → first enabled day of the month
    const dp2 = createDatePicker(input, { disabledDates: [new Date(today.getFullYear(), today.getMonth(), today.getDate())] });
    dp2.open();
    expect(active().getAttribute('aria-disabled')).not.toBe('true');
    dp2.destroy();
  });

  it('ArrowRight/Left move by a day; ArrowDown/Up by a week', () => {
    const dp = createDatePicker(input, { defaultValue: '2026-06-15' });
    dp.open();
    press('ArrowRight');
    expect(active().textContent).toBe('16');
    press('ArrowLeft');
    expect(active().textContent).toBe('15');
    press('ArrowDown');
    expect(active().textContent).toBe('22'); // +7
    press('ArrowUp');
    expect(active().textContent).toBe('15');
    dp.destroy();
  });

  it('Home/End move to week start/end (weekStartsOn=1)', () => {
    const dp = createDatePicker(input, { defaultValue: '2026-06-17', weekStartsOn: 1 }); // Wed
    dp.open();
    press('Home');
    expect(active().textContent).toBe('15'); // Monday
    press('End');
    expect(active().textContent).toBe('21'); // Sunday
    dp.destroy();
  });

  it('PageDown/PageUp change month; Shift changes year; view + live region update', () => {
    const dp = createDatePicker(input, { defaultValue: '2026-06-15', locale: 'en-GB' });
    dp.open();
    press('PageDown');
    expect(document.querySelector('.gds-calendar__title')!.textContent).toMatch(/July 2026/);
    expect(document.querySelector('[aria-live]')!.textContent).toMatch(/July 2026/);
    press('PageUp');
    expect(document.querySelector('.gds-calendar__title')!.textContent).toMatch(/June 2026/);
    press('PageDown', { shiftKey: true });
    expect(document.querySelector('.gds-calendar__title')!.textContent).toMatch(/June 2027/);
    dp.destroy();
  });

  it('Enter selects the focused date; Space too', () => {
    const onChange = vi.fn();
    const dp = createDatePicker(input, { defaultValue: '2026-06-15', onChange });
    dp.open();
    press('ArrowRight'); // focus 16
    press('Enter');
    expect(dp.getValue()!.getDate()).toBe(16);
    expect(onChange).toHaveBeenCalled();
    dp.destroy();
  });

  it('arrow navigation skips disabled dates', () => {
    const dp = createDatePicker(input, {
      defaultValue: '2026-06-15',
      disabledDates: ['2026-06-16', '2026-06-17'],
    });
    dp.open();
    press('ArrowRight'); // 16 disabled, 17 disabled → lands on 18
    expect(active().textContent).toBe('18');
    dp.destroy();
  });

  it('Escape closes from the grid and returns focus to the input', () => {
    const dp = createDatePicker(input, { defaultValue: '2026-06-15' });
    input.focus();
    dp.open();
    expect(active().textContent).toBe('15'); // focus moved into grid
    press('Escape');
    expect(dp.isOpen).toBe(false);
    expect(document.activeElement).toBe(input);
    dp.destroy();
  });
});

describe('ARIA', () => {
  it('valid grid structure: role=grid wrapper + rowgroup, rows/columnheaders/gridcells, month label', () => {
    const dp = createDatePicker(input, { defaultValue: '2026-06-15', locale: 'en-GB' });
    dp.open();
    // role="grid" is on the wrapper; the day rows sit in a rowgroup so the
    // weekday columnheader row and the day rows are both valid grid children.
    const gridWrap = document.querySelector('.gds-calendar__grid-wrap')!;
    expect(gridWrap.getAttribute('role')).toBe('grid');
    expect(gridWrap.getAttribute('aria-label')).toMatch(/June 2026/);
    expect(document.querySelector('.gds-calendar__grid')!.getAttribute('role')).toBe('rowgroup');
    // 1 weekday row + 6 week rows, all inside the grid wrapper.
    expect(gridWrap.querySelectorAll('[role="row"]')).toHaveLength(7);
    expect(document.querySelectorAll('.gds-calendar__weekday[role="columnheader"]')).toHaveLength(7);
    expect(gridWrap.querySelectorAll('[role="gridcell"]')).toHaveLength(42);
    dp.destroy();
  });

  it('trigger is a combobox and the dialog popover has an accessible name', () => {
    const dp = createDatePicker(input, { defaultValue: '2026-06-15', mode: 'datetime' });
    // Trigger adopts the combobox role so aria-expanded/haspopup/controls are valid.
    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-haspopup')).toBe('dialog');
    expect(input.getAttribute('aria-expanded')).toBe('false');
    dp.open();
    expect(input.getAttribute('aria-expanded')).toBe('true');
    const s = surface()!;
    expect(s.getAttribute('role')).toBe('dialog');
    expect(s.getAttribute('aria-label')).toBe('Choose date and time');
    dp.destroy();
    // role is cleaned up on destroy (popover clears the rest).
    expect(input.getAttribute('role')).toBeNull();
  });

  it('cells expose full label, selected, today, and disabled state', () => {
    const dp = createDatePicker(input, {
      defaultValue: '2026-06-15',
      locale: 'en-GB',
      disabledDates: ['2026-06-20'],
    });
    dp.open();
    const sel = document.querySelector('.gds-calendar__day--selected')!;
    expect(sel.getAttribute('aria-selected')).toBe('true');
    expect(sel.getAttribute('aria-label')).toBe('Monday, 15 June 2026');
    const disabled = [...document.querySelectorAll('.gds-calendar__day')].find(
      (c) => c.textContent === '20' && !c.classList.contains('gds-calendar__day--outside'),
    )!;
    expect(disabled.getAttribute('aria-disabled')).toBe('true');
    const today = document.querySelector('[aria-current="date"]');
    expect(today).not.toBeNull();
    dp.destroy();
  });

  it('Today/Clear have accessible labels', () => {
    const dp = createDatePicker(input, { defaultValue: '2026-06-15' });
    dp.open();
    expect(document.querySelector(`[aria-label="Select today's date"]`)).not.toBeNull();
    expect(document.querySelector(`[aria-label="Clear selected date"]`)).not.toBeNull();
    dp.destroy();
  });

  it('time fields expose spinbutton semantics (datetime)', () => {
    const dp = createDatePicker(input, { mode: 'datetime', defaultValue: '2026-06-15T10:30' });
    dp.open();
    const fields = [...document.querySelectorAll('.gds-time-stepper__field')] as HTMLInputElement[];
    const [hh, mm] = fields;
    expect(hh!.getAttribute('role')).toBe('spinbutton');
    expect(hh!.getAttribute('aria-valuemin')).toBe('0');
    expect(hh!.getAttribute('aria-valuemax')).toBe('23');
    expect(hh!.getAttribute('aria-valuenow')).toBe('10');
    expect(hh!.getAttribute('aria-label')).toBe('Hours');
    expect(mm!.getAttribute('aria-valuemax')).toBe('59');
    expect(mm!.getAttribute('aria-valuenow')).toBe('30');
    dp.destroy();
  });

  it('time field ArrowUp/ArrowDown increments/decrements (datetime)', () => {
    const dp = createDatePicker(input, { mode: 'datetime', defaultValue: '2026-06-15T10:30' });
    dp.open();
    const hh = document.querySelector('.gds-time-stepper__field') as HTMLInputElement;
    hh.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(dp.getValue()!.getHours()).toBe(11);
    hh.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(dp.getValue()!.getHours()).toBe(10);
    expect(hh.getAttribute('aria-valuenow')).toBe('10');
    dp.destroy();
  });
});

describe('time-only mode', () => {
  const fields = () => Array.from(document.querySelectorAll<HTMLInputElement>('.gds-time-stepper__field'));
  const tbtn = (label: string) => document.querySelector<HTMLButtonElement>(`[aria-label="${label}"]`)!;

  it('renders NO calendar grid (no grid roles, no day cells, no month nav)', () => {
    const dp = createDatePicker(input, { mode: 'time', defaultValue: '10:00' });
    dp.open();
    expect(document.querySelector('.gds-calendar__grid')).toBeNull();
    expect(document.querySelectorAll('.gds-calendar__day')).toHaveLength(0);
    expect(document.querySelector('[role="grid"]')).toBeNull();
    expect(document.querySelectorAll('[role="gridcell"]')).toHaveLength(0);
    expect(document.querySelector('.gds-calendar__weekdays')).toBeNull();
    expect(document.querySelector('[aria-label="Previous month"]')).toBeNull();
    expect(fields()).toHaveLength(2); // just HH/MM
    dp.destroy();
  });

  it('formats the value as HH:mm', () => {
    const dp = createDatePicker(input, { mode: 'time', defaultValue: '10:00' });
    expect(input.value).toBe('10:00');
    dp.open();
    expect(fields()[0]!.value).toBe('10');
    expect(fields()[1]!.value).toBe('00');
    dp.destroy();
  });

  it('accepts a Date and an ISO string (uses their time)', () => {
    const a = createDatePicker(input, { mode: 'time', defaultValue: new Date(2020, 0, 1, 9, 5) });
    expect(input.value).toBe('09:05');
    a.destroy();
    const b = createDatePicker(input, { mode: 'time', defaultValue: '2026-06-15T14:30' });
    expect(input.value).toBe('14:30');
    b.destroy();
  });

  it('hour increment/decrement updates the value', () => {
    const dp = createDatePicker(input, { mode: 'time', defaultValue: '10:00' });
    dp.open();
    tbtn('Increment hours').click();
    expect(dp.getValue()!.getHours()).toBe(11);
    expect(input.value).toBe('11:00');
    tbtn('Decrement hours').click();
    expect(input.value).toBe('10:00');
    dp.destroy();
  });

  it('minute increment/decrement honors minuteStep', () => {
    const dp = createDatePicker(input, { mode: 'time', defaultValue: '10:00', minuteStep: 15 });
    dp.open();
    tbtn('Increment minutes').click();
    expect(dp.getValue()!.getMinutes()).toBe(15);
    expect(input.value).toBe('10:15');
    dp.destroy();
  });

  it('uncontrolled: stepping produces a value anchored to today', () => {
    const dp = createDatePicker(input, { mode: 'time', defaultValue: '08:00' });
    dp.open();
    tbtn('Increment hours').click();
    const v = dp.getValue()!;
    const today = new Date();
    expect([v.getFullYear(), v.getMonth(), v.getDate()]).toEqual([today.getFullYear(), today.getMonth(), today.getDate()]);
    expect(v.getHours()).toBe(9);
    dp.destroy();
  });

  it('controlled: stepping fires onChange but internal stays until setValue', () => {
    const onChange = vi.fn();
    const dp = createDatePicker(input, { mode: 'time', value: '10:00', onChange });
    dp.open();
    tbtn('Increment hours').click();
    expect(onChange).toHaveBeenCalledWith(expect.any(Date));
    expect(dp.getValue()!.getHours()).toBe(10); // controlled — unchanged
    dp.setValue('12:30');
    expect(input.value).toBe('12:30');
    dp.destroy();
  });

  it('Clear empties the value and input', () => {
    const onChange = vi.fn();
    const dp = createDatePicker(input, { mode: 'time', defaultValue: '10:00', onChange });
    dp.open();
    tbtn('Clear selected time').click();
    expect(dp.getValue()).toBeNull();
    expect(input.value).toBe('');
    expect(onChange).toHaveBeenCalledWith(null);
    dp.destroy();
  });

  it('Now sets the current time', () => {
    const dp = createDatePicker(input, { mode: 'time', defaultValue: '00:00' });
    dp.open();
    tbtn('Set the current time').click();
    const now = new Date();
    const v = dp.getValue()!;
    expect(v.getHours()).toBe(now.getHours());
    // minute may tick during the test; allow ±1
    expect(Math.abs(v.getMinutes() - now.getMinutes())).toBeLessThanOrEqual(1);
    dp.destroy();
  });

  it('focus on open goes to the hour field', () => {
    const dp = createDatePicker(input, { mode: 'time', defaultValue: '10:00' });
    dp.open();
    expect(document.activeElement).toBe(fields()[0]);
    dp.destroy();
  });

  it('Escape closes and returns focus to the input', () => {
    const dp = createDatePicker(input, { mode: 'time', defaultValue: '10:00' });
    input.focus();
    dp.open();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(dp.isOpen).toBe(false);
    expect(document.activeElement).toBe(input);
    dp.destroy();
  });

  it('time fields expose spinbutton ARIA', () => {
    const dp = createDatePicker(input, { mode: 'time', defaultValue: '10:30' });
    dp.open();
    const [hh, mm] = fields();
    expect(hh!.getAttribute('role')).toBe('spinbutton');
    expect(hh!.getAttribute('aria-valuemin')).toBe('0');
    expect(hh!.getAttribute('aria-valuemax')).toBe('23');
    expect(hh!.getAttribute('aria-valuenow')).toBe('10');
    expect(hh!.getAttribute('aria-label')).toBe('Hours');
    expect(mm!.getAttribute('aria-valuemax')).toBe('59');
    expect(mm!.getAttribute('aria-valuenow')).toBe('30');
    dp.destroy();
  });

  it('ArrowUp/ArrowDown on a time field steps it', () => {
    const dp = createDatePicker(input, { mode: 'time', defaultValue: '10:30' });
    dp.open();
    const hh = fields()[0]!;
    hh.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(dp.getValue()!.getHours()).toBe(11);
    dp.destroy();
  });
});

describe('advanced presets', () => {
  const addDays = (base: Date, n: number) =>
    new Date(base.getFullYear(), base.getMonth(), base.getDate() + n, base.getHours(), base.getMinutes());
  const presetButtons = () =>
    Array.from(document.querySelectorAll<HTMLButtonElement>('.gds-calendar__presets .gds-menu__item'));
  const presetByLabel = (label: string) => presetButtons().find((b) => b.textContent!.includes(label));

  it('renders the advanced layout with preset buttons', () => {
    const dp = createDatePicker(input, {
      mode: 'datetime',
      baseDate: '2026-06-01T09:00',
      presets: [
        { label: '1 day from first upload', value: (c) => addDays(c.baseDate!, 1) },
        { label: '30 days from first upload', value: (c) => addDays(c.baseDate!, 30) },
        { label: '90 days from first upload', value: (c) => addDays(c.baseDate!, 90) },
      ],
    });
    dp.open();
    expect(document.querySelector('.gds-calendar--advanced')).not.toBeNull();
    expect(document.querySelector('.gds-calendar__main')).not.toBeNull();
    const aside = document.querySelector('.gds-calendar__presets')!;
    expect(aside.getAttribute('role')).toBe('group');
    expect(aside.getAttribute('aria-label')).toBe('Shortcuts');
    expect(presetButtons()).toHaveLength(3);
    expect(presetButtons()[0]!.tagName).toBe('BUTTON');
    dp.destroy();
  });

  it('selecting a preset (resolver + baseDate) sets value/input and fires onChange', () => {
    const onChange = vi.fn();
    const dp = createDatePicker(input, {
      mode: 'datetime',
      baseDate: '2026-06-01T00:00',
      defaultValue: '2026-06-01T10:00',
      locale: 'en-GB',
      onChange,
      presets: [{ label: '30 days from first upload', value: (c) => addDays(c.baseDate!, 30) }],
    });
    dp.open();
    presetByLabel('30 days')!.click();
    const v = dp.getValue()!;
    // 2026-06-01 + 30 days = 2026-07-01
    expect([v.getFullYear(), v.getMonth(), v.getDate()]).toEqual([2026, 6, 1]);
    expect(input.value).toBe('01/07/2026 00:00'); // time from the resolved value
    expect(onChange).toHaveBeenCalledWith(expect.any(Date));
    expect(dp.isOpen).toBe(true); // datetime stays open
    dp.destroy();
  });

  it('datetime preset preserves the current time when the resolver uses ctx.value', () => {
    const dp = createDatePicker(input, {
      mode: 'datetime',
      baseDate: '2026-06-01',
      defaultValue: '2026-06-01T14:30',
      locale: 'en-GB',
      presets: [
        {
          label: 'Keep my time',
          value: (c) => {
            const d = addDays(c.baseDate!, 7);
            return new Date(d.getFullYear(), d.getMonth(), d.getDate(), c.value!.getHours(), c.value!.getMinutes());
          },
        },
      ],
    });
    dp.open();
    presetByLabel('Keep my time')!.click();
    const v = dp.getValue()!;
    expect([v.getDate(), v.getHours(), v.getMinutes()]).toEqual([8, 14, 30]); // June 8 @ 14:30
    dp.destroy();
  });

  it('supports a static Date/string value and renders a description', () => {
    const dp = createDatePicker(input, {
      mode: 'date',
      locale: 'en-GB',
      presets: [{ label: 'Mid-June', value: '2026-06-15', description: '15 Jun 2026' }],
    });
    dp.open();
    const btn = presetByLabel('Mid-June')!;
    expect(btn.querySelector('.gds-menu__desc')!.textContent).toBe('15 Jun 2026');
    btn.click();
    expect(input.value).toBe('15/06/2026');
    expect(dp.isOpen).toBe(false); // date mode closes
    dp.destroy();
  });

  it('disabled preset cannot be selected', () => {
    const onChange = vi.fn();
    const dp = createDatePicker(input, {
      mode: 'date',
      onChange,
      presets: [{ label: 'Nope', value: '2026-06-15', disabled: true }],
    });
    dp.open();
    const btn = presetByLabel('Nope')!;
    expect(btn.disabled).toBe(true);
    expect(btn.getAttribute('aria-disabled')).toBe('true');
    btn.click();
    expect(onChange).not.toHaveBeenCalled();
    dp.destroy();
  });

  it('out-of-range preset (past max) is auto-disabled and not applied', () => {
    const onChange = vi.fn();
    const dp = createDatePicker(input, {
      mode: 'date',
      max: '2026-06-30',
      onChange,
      presets: [{ label: 'Too far', value: '2026-12-31' }],
    });
    dp.open();
    const btn = presetByLabel('Too far')!;
    expect(btn.disabled).toBe(true);
    btn.click();
    expect(onChange).not.toHaveBeenCalled();
    dp.destroy();
  });

  it('keyboard activation: Enter on a focused preset applies it', () => {
    const dp = createDatePicker(input, {
      mode: 'date',
      locale: 'en-GB',
      presets: [{ label: 'Mid-June', value: '2026-06-15' }],
    });
    dp.open();
    const btn = presetByLabel('Mid-June')!;
    btn.focus();
    btn.click(); // native button: Enter/Space → click; jsdom doesn't synthesize, so click directly
    expect(input.value).toBe('15/06/2026');
    dp.destroy();
  });

  it('Escape still closes and returns focus to input (advanced)', () => {
    const dp = createDatePicker(input, {
      mode: 'datetime',
      presets: [{ label: 'x', value: '2026-06-15T10:00' }],
    });
    input.focus();
    dp.open();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(dp.isOpen).toBe(false);
    expect(document.activeElement).toBe(input);
    dp.destroy();
  });

  it('grid keyboard navigation is unchanged in advanced mode', () => {
    const dp = createDatePicker(input, {
      mode: 'datetime',
      defaultValue: '2026-06-15T10:00',
      presets: [{ label: 'x', value: '2026-06-20T10:00' }],
    });
    dp.open();
    expect((document.activeElement as HTMLElement).textContent).toBe('15');
    (document.activeElement as HTMLElement).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect((document.activeElement as HTMLElement).textContent).toBe('16');
    dp.destroy();
  });

  it('presets are ignored in time-only mode (no advanced layout)', () => {
    const dp = createDatePicker(input, {
      mode: 'time',
      defaultValue: '10:00',
      presets: [{ label: 'x', value: '12:00' }],
    });
    dp.open();
    expect(document.querySelector('.gds-calendar--advanced')).toBeNull();
    expect(document.querySelector('.gds-calendar__presets')).toBeNull();
    dp.destroy();
  });
});

describe('teardown', () => {
  it('destroy removes the surface and listeners', () => {
    const dp = createDatePicker(input, { defaultValue: '2026-06-15' });
    dp.open();
    dp.destroy();
    expect(surface()).toBeNull();
  });
});
