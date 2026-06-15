import { describe, it, expect } from 'vitest';
import {
  startOfDay,
  isSameDay,
  addMonths,
  addDays,
  toDate,
  toDateTime,
  formatISO,
  buildMonthMatrix,
  isDateDisabled,
  getWeekdayLabels,
  getMonthLabel,
  setTime,
  stepHour,
  stepMinute,
  clampInt,
  formatDateTime,
  formatTimeValue,
  toTime,
  startOfWeek,
  endOfWeek,
  addMonthsClampDay,
  addYearsClampDay,
  formatFullDate,
  firstEnabledInMonth,
  nextEnabled,
} from './dateUtils';

describe('toDate', () => {
  it('parses YYYY-MM-DD as a local date (no UTC shift)', () => {
    const d = toDate('2026-06-15')!;
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(5); // June
    expect(d.getDate()).toBe(15);
  });
  it('normalizes a Date to start-of-day', () => {
    const d = toDate(new Date(2026, 5, 15, 13, 45))!;
    expect(d.getHours()).toBe(0);
    expect(d.getMinutes()).toBe(0);
  });
  it('returns null for null/invalid', () => {
    expect(toDate(null)).toBeNull();
    expect(toDate('nonsense')).toBeNull();
  });
});

describe('basic helpers', () => {
  it('isSameDay ignores time', () => {
    expect(isSameDay(new Date(2026, 5, 15, 9), new Date(2026, 5, 15, 23))).toBe(true);
    expect(isSameDay(new Date(2026, 5, 15), new Date(2026, 5, 16))).toBe(false);
  });
  it('addMonths returns the first of the target month', () => {
    const d = addMonths(new Date(2026, 5, 15), 1);
    expect(d.getMonth()).toBe(6);
    expect(d.getDate()).toBe(1);
  });
  it('addDays crosses month boundaries', () => {
    const d = addDays(new Date(2026, 5, 30), 2);
    expect(d.getMonth()).toBe(6);
    expect(d.getDate()).toBe(2);
  });
  it('formatISO pads', () => {
    expect(formatISO(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
  it('startOfDay zeros time', () => {
    expect(startOfDay(new Date(2026, 5, 15, 8, 30)).getHours()).toBe(0);
  });
});

describe('buildMonthMatrix', () => {
  it('returns 42 cells (6 weeks)', () => {
    expect(buildMonthMatrix(2026, 5, 0)).toHaveLength(42);
  });
  it('Sunday-start June 2026 begins with May 31', () => {
    const cells = buildMonthMatrix(2026, 5, 0); // June, weekStartsOn=0
    expect(cells[0]!.getMonth()).toBe(4); // May
    expect(cells[0]!.getDate()).toBe(31);
    expect(cells[1]!.getDate()).toBe(1); // June 1
  });
  it('Monday-start June 2026 begins with June 1', () => {
    const cells = buildMonthMatrix(2026, 5, 1); // weekStartsOn=1
    expect(cells[0]!.getMonth()).toBe(5);
    expect(cells[0]!.getDate()).toBe(1);
  });
});

describe('isDateDisabled', () => {
  const base = new Date(2026, 5, 15);
  it('respects min/max (inclusive)', () => {
    expect(isDateDisabled(new Date(2026, 5, 10), { min: base })).toBe(true);
    expect(isDateDisabled(base, { min: base })).toBe(false);
    expect(isDateDisabled(new Date(2026, 5, 20), { max: base })).toBe(true);
  });
  it('respects disabledWeekdays', () => {
    // 2026-06-13 is a Saturday (6), 2026-06-15 is Monday (1)
    expect(isDateDisabled(new Date(2026, 5, 13), { disabledWeekdays: [6, 0] })).toBe(true);
    expect(isDateDisabled(new Date(2026, 5, 15), { disabledWeekdays: [6, 0] })).toBe(false);
  });
  it('respects a disabledDates array and predicate', () => {
    expect(isDateDisabled(base, { disabledDates: [new Date(2026, 5, 15)] })).toBe(true);
    expect(isDateDisabled(base, { disabledDates: (d) => d.getDate() === 15 })).toBe(true);
    expect(isDateDisabled(new Date(2026, 5, 16), { disabledDates: (d) => d.getDate() === 15 })).toBe(false);
  });
});

describe('time helpers (datetime)', () => {
  it('toDateTime preserves time from a string and a Date', () => {
    const a = toDateTime('2026-06-15T10:30')!;
    expect([a.getHours(), a.getMinutes()]).toEqual([10, 30]);
    const b = toDateTime('2026-06-15')!; // no time → 00:00
    expect([b.getHours(), b.getMinutes()]).toEqual([0, 0]);
    const c = toDateTime(new Date(2026, 5, 15, 9, 5))!;
    expect([c.getHours(), c.getMinutes()]).toEqual([9, 5]);
  });
  it('setTime keeps the day, sets h/m', () => {
    const d = setTime(new Date(2026, 5, 15), 14, 45);
    expect([d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()]).toEqual([
      2026, 5, 15, 14, 45,
    ]);
  });
  it('stepHour wraps 0–23', () => {
    expect(stepHour(23, 1)).toBe(0);
    expect(stepHour(0, -1)).toBe(23);
    expect(stepHour(10, 2)).toBe(12);
  });
  it('stepMinute wraps 0–59 with minuteStep (no hour carry)', () => {
    expect(stepMinute(0, 1, 15)).toBe(15);
    expect(stepMinute(45, 1, 15)).toBe(0); // 60 → wrap to 0, no carry
    expect(stepMinute(0, -1, 5)).toBe(55);
    expect(stepMinute(30, 1)).toBe(31); // default step 1
  });
  it('clampInt clamps and truncates', () => {
    expect(clampInt(99, 23)).toBe(23);
    expect(clampInt(-5, 59)).toBe(0);
    expect(clampInt(7.9, 59)).toBe(7);
    expect(clampInt(NaN, 59)).toBe(0);
  });
  it('formatDateTime outputs "DD/MM/YYYY HH:mm" (en-GB)', () => {
    expect(formatDateTime(new Date(2026, 5, 15, 10, 0), 'en-GB')).toBe('15/06/2026 10:00');
    expect(formatDateTime(new Date(2026, 5, 15, 9, 5), 'en-GB')).toBe('15/06/2026 09:05');
  });
  it('formatTimeValue outputs "HH:mm"', () => {
    expect(formatTimeValue(new Date(2026, 5, 15, 10, 0))).toBe('10:00');
    expect(formatTimeValue(new Date(2026, 5, 15, 9, 5))).toBe('09:05');
  });
  it('toTime parses "HH:mm" / Date / null, anchored to today', () => {
    const today = new Date();
    const a = toTime('14:30')!;
    expect([a.getHours(), a.getMinutes()]).toEqual([14, 30]);
    expect([a.getFullYear(), a.getMonth(), a.getDate()]).toEqual([today.getFullYear(), today.getMonth(), today.getDate()]);
    const b = toTime(new Date(2020, 0, 1, 9, 5))!;
    expect([b.getHours(), b.getMinutes()]).toEqual([9, 5]);
    expect(toTime(null)).toBeNull();
    // clamps out-of-range
    const c = toTime('99:99')!;
    expect([c.getHours(), c.getMinutes()]).toEqual([23, 59]);
  });
});

describe('navigation helpers (keyboard)', () => {
  it('startOfWeek / endOfWeek honor weekStartsOn', () => {
    const wed = new Date(2026, 5, 17); // Wed 17 June 2026
    expect(startOfWeek(wed, 0).getDate()).toBe(14); // Sun
    expect(endOfWeek(wed, 0).getDate()).toBe(20); // Sat
    expect(startOfWeek(wed, 1).getDate()).toBe(15); // Mon
    expect(endOfWeek(wed, 1).getDate()).toBe(21); // Sun
  });
  it('addMonthsClampDay clamps the day to the target month length', () => {
    const jan31 = new Date(2026, 0, 31);
    const feb = addMonthsClampDay(jan31, 1);
    expect([feb.getMonth(), feb.getDate()]).toEqual([1, 28]); // Feb 28 2026
    const keep = addMonthsClampDay(new Date(2026, 5, 15), 1);
    expect([keep.getMonth(), keep.getDate()]).toEqual([6, 15]); // Jul 15
  });
  it('addYearsClampDay clamps Feb 29 → Feb 28', () => {
    const leap = new Date(2024, 1, 29);
    const next = addYearsClampDay(leap, 1);
    expect([next.getFullYear(), next.getMonth(), next.getDate()]).toEqual([2025, 1, 28]);
  });
  it('formatFullDate gives a full accessible label', () => {
    expect(formatFullDate(new Date(2026, 5, 15), 'en-GB')).toBe('Monday, 15 June 2026');
  });
  it('firstEnabledInMonth skips disabled leading days', () => {
    const d = firstEnabledInMonth(2026, 5, { min: new Date(2026, 5, 10) })!;
    expect(d.getDate()).toBe(10);
    expect(firstEnabledInMonth(2026, 5, { disabledDates: () => true })).toBeNull();
  });
  it('nextEnabled scans in the given direction', () => {
    // disable June 16–18; from the 16th going forward → 19th
    const opts = { disabledDates: [new Date(2026, 5, 16), new Date(2026, 5, 17), new Date(2026, 5, 18)] };
    expect(nextEnabled(new Date(2026, 5, 16), 1, opts)!.getDate()).toBe(19);
    expect(nextEnabled(new Date(2026, 5, 16), -1, opts)!.getDate()).toBe(15);
  });
});

describe('locale labels', () => {
  it('weekday labels honor weekStartsOn order', () => {
    const sun = getWeekdayLabels(0, 'en-US');
    const mon = getWeekdayLabels(1, 'en-US');
    expect(sun).toHaveLength(7);
    expect(mon[0]).toBe(sun[1]); // Monday-start[0] === Sunday-start[1]
  });
  it('month label includes year', () => {
    expect(getMonthLabel(2026, 5, 'en-US')).toMatch(/2026/);
  });
});
