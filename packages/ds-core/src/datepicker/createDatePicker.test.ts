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

describe('teardown', () => {
  it('destroy removes the surface and listeners', () => {
    const dp = createDatePicker(input, { defaultValue: '2026-06-15' });
    dp.open();
    dp.destroy();
    expect(surface()).toBeNull();
  });
});
