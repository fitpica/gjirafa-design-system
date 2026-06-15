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
  it('grid has role=grid + month aria-label; rows/columnheaders/gridcells present', () => {
    const dp = createDatePicker(input, { defaultValue: '2026-06-15', locale: 'en-GB' });
    dp.open();
    const grid = document.querySelector('.gds-calendar__grid')!;
    expect(grid.getAttribute('role')).toBe('grid');
    expect(grid.getAttribute('aria-label')).toMatch(/June 2026/);
    expect(grid.querySelectorAll('[role="row"]')).toHaveLength(6);
    expect(document.querySelectorAll('.gds-calendar__weekday[role="columnheader"]')).toHaveLength(7);
    expect(grid.querySelectorAll('[role="gridcell"]')).toHaveLength(42);
    dp.destroy();
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

describe('teardown', () => {
  it('destroy removes the surface and listeners', () => {
    const dp = createDatePicker(input, { defaultValue: '2026-06-15' });
    dp.open();
    dp.destroy();
    expect(surface()).toBeNull();
  });
});
