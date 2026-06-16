# @gjirafa/ds-vue

Vue 3 components for the Gjirafa Design System. Thin wrappers over
[`@gjirafa/ds-core`](../ds-core) — all behavior (date math, keyboard grid,
popover, ARIA) lives in the core; these components only render the GDS markup
and bridge it to a Vue-friendly API. **No date logic is duplicated in Vue.**

> Phase 1 ships `GdsDatePicker`. Vue 2 is intentionally **not** supported —
> Vue 2 teams consume the CSS layer + `@gjirafa/ds-core` directly.

## Install

```sh
npm install @gjirafa/ds-vue @gjirafa/ds-core vue
```

Import the CSS once (from `@gjirafa/design-system`) at your app entry:

```ts
import '@gjirafa/design-system/dist/gjirafa-ds.css';
```

## `GdsDatePicker`

### Date-only

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { GdsDatePicker } from '@gjirafa/ds-vue';

const value = ref<Date | null>(null);
</script>

<template>
  <GdsDatePicker
    v-model="value"
    label="Pick a date"
    placeholder="Select a date"
    locale="en-GB"
    :week-starts-on="1"
    :disabled-weekdays="[0, 6]"
  />
</template>
```

### Date + time

```vue
<GdsDatePicker
  v-model="value"
  mode="datetime"
  label="Publish at"
  :minute-step="5"
  :default-time="{ hours: 9, minutes: 0 }"
/>
```

### Time-only

```vue
<GdsDatePicker v-model="value" mode="time" label="Reminder time" :minute-step="15" />
```

### Advanced — presets (product-provided)

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { GdsDatePicker, type DatePickerPreset } from '@gjirafa/ds-vue';

const value = ref<Date | null>(null);
const firstUpload = new Date('2026-06-01T09:00');

// Presets are provided by your product — never hardcoded in the component.
const presets: DatePickerPreset[] = [
  { label: '1 day from first upload', value: (c) => addDays(c.baseDate!, 1) },
  { label: '30 days from first upload', value: (c) => addDays(c.baseDate!, 30) },
  { label: '90 days from first upload', value: (c) => addDays(c.baseDate!, 90) },
];

function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
</script>

<template>
  <GdsDatePicker v-model="value" mode="datetime" :base-date="firstUpload" :presets="presets" />
</template>
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `modelValue` (`v-model`) | `Date \| string \| null` | `null` | Accepts a `Date`/parseable string; **emits `Date \| null`**. |
| `mode` | `'date' \| 'datetime' \| 'time'` | `'date'` | |
| `presets` | `DatePickerPreset[]` | – | Renders the advanced layout (date / datetime). |
| `baseDate` | `Date \| string` | – | Reference for preset resolvers. |
| `minDate` / `maxDate` | `Date \| string` | – | → core `min` / `max`. |
| `disabledDates` | `Array<Date\|string> \| (d) => boolean` | – | |
| `disabledWeekdays` | `number[]` | – | `0`=Sun … `6`=Sat. |
| `weekStartsOn` | `0`–`6` | `0` | |
| `minuteStep` | `number` | `1` | datetime / time. |
| `defaultTime` | `{ hours, minutes }` | `00:00` | datetime / time. |
| `locale` | `string` | navigator | |
| `format` | `(d: Date) => string` | locale default | |
| `placement` | `PopoverPlacement` | `'bottom-start'` | |
| `closeOnSelect` | `boolean` | mode-dependent | |
| `showToday` | `boolean` | `true` | "Today" (or "Now" in time mode). |
| `clearable` | `boolean` | `true` | → core `showClear`. |
| `compact` | `boolean` | `false` | 32px day cells. |
| `disabled` | `boolean` | `false` | Input attribute. |
| `readonly` | `boolean` | `true` | Input attribute (selection is via the calendar). |
| `placeholder` / `label` / `name` / `inputId` | `string` | – | Input shell. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | `.gds-input--{size}`. |

## Events

| Event | Payload | When |
| --- | --- | --- |
| `update:modelValue` | `Date \| null` | Value changes (selection / time / preset / clear). |
| `change` | `Date \| null` | Alongside `update:modelValue`. |
| `open` / `close` | – | Popover open / close. |
| `clear` | – | Value cleared (Clear action or exposed `clear()`). |

## Exposed methods

`open()`, `close()`, `clear()`, `getValue(): Date | null` — via a template ref.

## Notes & limitations

- **Prop reactivity:** `modelValue` updates via `setValue` (no rebuild). Changing
  any other option (`mode`, `presets`, `min/maxDate`, …) **rebuilds** the
  controller (value preserved, re-opens if open), since `@gjirafa/ds-core` has no
  in-place option-update API yet. Mutating a `presets`/`disabledDates` array
  in place won't trigger this — pass a **new array reference**.
- **SSR:** the controller initializes on client mount only; the server renders
  just the input shell.
- 12-hour time format is not supported yet (core limitation).
