import type { PopoverPlacement } from '../popover/types';
import type { Weekday } from './dateUtils';

export type { Weekday };

export interface DatePickerOptions {
  /** 'date' (default) or 'datetime' (calendar + compact time-below). */
  mode?: 'date' | 'datetime';
  /** datetime only: minute increment for the stepper. Default 1. */
  minuteStep?: number;
  /** datetime only: time format. Only '24h' is supported this phase. */
  timeFormat?: '24h';
  /** datetime only: time applied when none is selected yet. Default 00:00. */
  defaultTime?: { hours: number; minutes: number };

  /** Controlled value. When set, the picker renders from it and selection only
   *  fires onChange — call setValue() (or update this + refresh) to move it. */
  value?: Date | string | null;
  /** Uncontrolled initial value. */
  defaultValue?: Date | string | null;
  /** Fired when the user picks/clears a date. */
  onChange?: (date: Date | null) => void;

  /** Earliest selectable date (inclusive). */
  min?: Date | string;
  /** Latest selectable date (inclusive). */
  max?: Date | string;
  /** Specific disabled dates, or a predicate. */
  disabledDates?: Array<Date | string> | ((date: Date) => boolean);
  /** Disabled weekdays (0 = Sunday … 6 = Saturday). */
  disabledWeekdays?: number[];
  /** First column of the week (0 = Sunday, default). */
  weekStartsOn?: Weekday;

  /** BCP-47 locale for month/weekday names and default formatting. Default: navigator language or 'en'. */
  locale?: string;
  /** Custom display formatter. Default: locale short date. */
  format?: (date: Date) => string;

  /** Popover placement relative to the input. Default 'bottom-start'. */
  placement?: PopoverPlacement;
  /** Close the popover after selecting a date. Default true. */
  closeOnSelect?: boolean;
  /** Show the Today footer action. Default true. */
  showToday?: boolean;
  /** Show the Clear footer action. Default true. */
  showClear?: boolean;
  /** Compact (32px) day cells. Default false (40px). */
  compact?: boolean;

  onOpen?: () => void;
  onClose?: () => void;
}

export interface DatePickerInstance {
  open(): void;
  close(): void;
  toggle(): void;
  /** Current selected date (or null). */
  getValue(): Date | null;
  /** Programmatically set the value (controlled updates, or external set). */
  setValue(value: Date | string | null): void;
  /** Tear down listeners, the popover, and the portal node. */
  destroy(): void;
  readonly isOpen: boolean;
}
