// Pure, dependency-free date helpers for the date-only DatePicker.
// All operations are LOCAL-time and normalized to start-of-day to avoid
// timezone/UTC off-by-one bugs.

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface DisableOptions {
  min?: Date | null;
  max?: Date | null;
  disabledDates?: Array<Date> | ((date: Date) => boolean) | null;
  disabledWeekdays?: number[] | null;
}

/** Midnight (local) of the given date. */
export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Same calendar day (local)? */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

export function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

/** Coerce a Date | 'YYYY-MM-DD' | null|undefined to a local Date (or null). */
export function toDate(value: Date | string | null | undefined): Date | null {
  if (value == null) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : startOfDay(value);
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (m) {
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : startOfDay(parsed);
}

/**
 * Like toDate, but PRESERVES time (for datetime mode). Accepts a Date, or
 * 'YYYY-MM-DD', 'YYYY-MM-DDTHH:mm', or 'YYYY-MM-DD HH:mm'. Missing time → 00:00.
 */
export function toDateTime(value: Date | string | null | undefined): Date | null {
  if (value == null) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : new Date(value.getTime());
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/.exec(value);
  if (m) {
    return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), m[4] ? Number(m[4]) : 0, m[5] ? Number(m[5]) : 0);
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** 'YYYY-MM-DD' (local). */
export function formatISO(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * 42-cell (6-week) matrix of local Dates covering the given month, starting on
 * `weekStartsOn` (0 = Sunday). Includes leading/trailing adjacent-month days.
 */
export function buildMonthMatrix(year: number, month: number, weekStartsOn: Weekday): Date[] {
  const firstOfMonth = new Date(year, month, 1);
  const firstDow = firstOfMonth.getDay();
  const lead = (firstDow - weekStartsOn + 7) % 7;
  const start = new Date(year, month, 1 - lead);
  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) {
    cells.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  }
  return cells;
}

/** Is `date` outside the allowed set (min/max/disabledDates/disabledWeekdays)? */
export function isDateDisabled(date: Date, opts: DisableOptions): boolean {
  const d = startOfDay(date);
  if (opts.min && d.getTime() < startOfDay(opts.min).getTime()) return true;
  if (opts.max && d.getTime() > startOfDay(opts.max).getTime()) return true;
  if (opts.disabledWeekdays && opts.disabledWeekdays.includes(d.getDay())) return true;
  const dd = opts.disabledDates;
  if (typeof dd === 'function') return dd(d);
  if (Array.isArray(dd)) return dd.some((x) => isSameDay(x, d));
  return false;
}

/** Localized month + year label, e.g. "June 2026". */
export function getMonthLabel(year: number, month: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
    new Date(year, month, 1),
  );
}

/**
 * Short weekday labels ordered from `weekStartsOn`, e.g.
 * ['Sun','Mon',…] for weekStartsOn=0.
 */
export function getWeekdayLabels(weekStartsOn: Weekday, locale: string): string[] {
  const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  // 2023-01-01 is a Sunday — a stable anchor for weekday names.
  const sunday = new Date(2023, 0, 1);
  const labels: string[] = [];
  for (let i = 0; i < 7; i++) {
    labels.push(fmt.format(addDays(sunday, (weekStartsOn + i) % 7)));
  }
  return labels;
}

/** Default display formatter — locale short date (e.g. "6/15/2026"). */
export function defaultFormat(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale).format(date);
}

// --- Time helpers (datetime mode) -------------------------------------------

const pad2 = (n: number): string => String(n).padStart(2, '0');

/** New Date with the same Y/M/D as `date` but the given local hours/minutes. */
export function setTime(date: Date, hours: number, minutes: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
}

/** Step hours with 0–23 wrap. */
export function stepHour(hours: number, delta: number): number {
  return (((hours + delta) % 24) + 24) % 24;
}

/**
 * Step minutes by `step` with 0–59 wrap (no hour carry — documented behavior).
 * Clamps `step` to >= 1.
 */
export function stepMinute(minutes: number, delta: number, step = 1): number {
  const s = Math.max(1, Math.trunc(step));
  return (((minutes + delta * s) % 60) + 60) % 60;
}

/** Clamp an arbitrary number into [0, max] integer (for typed field input). */
export function clampInt(n: number, max: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(max, Math.max(0, Math.trunc(n)));
}

/** Default datetime formatter — locale short date + 24h "HH:mm" (e.g. "15/06/2026 10:00"). */
export function formatDateTime(date: Date, locale: string): string {
  return `${defaultFormat(date, locale)} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

/** Zero-padded "HH" / "MM". */
export function pad2Time(n: number): string {
  return pad2(n);
}
