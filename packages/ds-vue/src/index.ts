import type { App } from 'vue';
import GdsDatePicker from './GdsDatePicker';

export { GdsDatePicker };

/** Optional Vue plugin: `app.use(GdsDatePickerPlugin)` registers `<GdsDatePicker>` globally. */
export const GdsDatePickerPlugin = {
  install(app: App): void {
    app.component('GdsDatePicker', GdsDatePicker);
  },
};

// Re-export the core types products need to type `presets` / options.
export type {
  DatePickerPreset,
  PresetContext,
  DatePickerOptions,
  DatePickerInstance,
} from '@gjirafa/ds-core';
