import type { PopoverPlacement } from '../popover/types';
import type { Weekday } from './dateUtils';

export type { Weekday };

/** Context passed to preset `value` / `disabled` resolver functions. */
export interface PresetContext {
  /** The `baseDate` option (parsed), e.g. a first-upload date. */
  baseDate: Date | null;
  /** The picker's current value. */
  value: Date | null;
  /** Current mode. */
  mode: 'date' | 'datetime' | 'time';
  /** `new Date()` at resolve time. */
  now: Date;
}

/** A product-provided shortcut shown in the advanced (presets) layout. */
export interface DatePickerPreset {
  /** Visible label, e.g. "30 days from first upload". */
  label: string;
  /** Resolved value — a Date, an ISO/'HH:mm' string, or a resolver receiving context. */
  value: Date | string | ((ctx: PresetContext) => Date | string | null);
  /** Optional secondary line under the label. */
  description?: string;
  /** Disable the preset (static or resolver). Out-of-range values are auto-disabled. */
  disabled?: boolean | ((ctx: PresetContext) => boolean);
}

export interface DatePickerOptions {
  /** 'date' (default), 'datetime' (calendar + compact time-below), or 'time' (compact HH/MM only, no calendar). */
  mode?: 'date' | 'datetime' | 'time';

  /** Product-provided shortcut presets (date + datetime modes). Renders the advanced layout. */
  presets?: DatePickerPreset[];
  /** Reference date for preset resolvers (e.g. firstUploadDate). */
  baseDate?: Date | string;
  /** datetime/time: minute increment for the stepper. Default 1. */
  minuteStep?: number;
  /** datetime/time: time format. Only '24h' is supported this phase. */
  timeFormat?: '24h';
  /** datetime/time: time applied when none is selected yet. Default 00:00. */
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
