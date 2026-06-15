import { describe, it, expect } from 'vitest';
import {
  startOfDay,
  isSameDay,
  addMonths,
  addDays,
  toDate,
  formatISO,
  buildMonthMatrix,
  isDateDisabled,
  getWeekdayLabels,
  getMonthLabel,
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
