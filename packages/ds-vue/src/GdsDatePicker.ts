import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { PropType, VNode } from 'vue';
import { createDatePicker } from '@gjirafa/ds-core';
import type { DatePickerInstance, DatePickerOptions, DatePickerPreset } from '@gjirafa/ds-core';
import { calendarIcon, clockIcon } from './icons';

type Mode = 'date' | 'datetime' | 'time';
type Size = 'sm' | 'md' | 'lg';
type ModelValue = Date | string | null;

let uid = 0;

/**
 * `GdsDatePicker` — a thin Vue 3 wrapper around `createDatePicker` from
 * `@gjirafa/ds-core`. It renders only the GDS input shell (`.gds-input`); the
 * calendar surface is built and portalled to `<body>` by the core controller,
 * so no Calendar markup or date logic is duplicated here.
 *
 * Authored as a render-function component (no SFC) to avoid pulling in the Vue
 * SFC toolchain — see PR #8.
 */
export default defineComponent({
  name: 'GdsDatePicker',
  props: {
    /** v-model. Accepts a Date or parseable string in; emits Date | null out. */
    modelValue: { type: [Date, String] as PropType<ModelValue>, default: null },
    mode: { type: String as PropType<Mode>, default: 'date' },
    /** Product-provided shortcut presets (date / datetime). Renders the advanced layout. */
    presets: { type: Array as PropType<DatePickerPreset[]>, default: undefined },
    baseDate: { type: [Date, String] as PropType<Date | string>, default: undefined },
    minDate: { type: [Date, String] as PropType<Date | string>, default: undefined },
    maxDate: { type: [Date, String] as PropType<Date | string>, default: undefined },
    disabledDates: {
      type: [Array, Function] as PropType<DatePickerOptions['disabledDates']>,
      default: undefined,
    },
    disabledWeekdays: { type: Array as PropType<number[]>, default: undefined },
    weekStartsOn: { type: Number as PropType<DatePickerOptions['weekStartsOn']>, default: undefined },
    minuteStep: { type: Number, default: undefined },
    defaultTime: {
      type: Object as PropType<{ hours: number; minutes: number }>,
      default: undefined,
    },
    locale: { type: String, default: undefined },
    format: { type: Function as PropType<(d: Date) => string>, default: undefined },
    placement: { type: String as PropType<DatePickerOptions['placement']>, default: undefined },
    closeOnSelect: { type: Boolean, default: undefined },
    showToday: { type: Boolean, default: undefined },
    /** Show the Clear footer action. Maps to the core `showClear`. Default true. */
    clearable: { type: Boolean, default: true },
    compact: { type: Boolean, default: false },
    /** Input-level: greys out the field and blocks opening. */
    disabled: { type: Boolean, default: false },
    /** Input-level: prevents typing. Default true (selection is via the calendar). */
    readonly: { type: Boolean, default: true },
    placeholder: { type: String, default: '' },
    label: { type: String, default: '' },
    size: { type: String as PropType<Size>, default: 'md' },
    name: { type: String, default: undefined },
    inputId: { type: String, default: () => `gds-dp-${++uid}` },
  },
  emits: {
    'update:modelValue': (_value: Date | null) => true,
    change: (_value: Date | null) => true,
    open: () => true,
    close: () => true,
    clear: () => true,
  },
  setup(props, { emit, expose }) {
    const inputRef = ref<HTMLInputElement | null>(null);
    let instance: DatePickerInstance | null = null;
    // Reference-identity echo guard: when the core emits a value we store it
    // here; the parent's v-model then writes the *same* object back into the
    // prop, so the modelValue watcher can skip the redundant setValue().
    let lastEmitted: Date | null | undefined;

    function buildOptions(): DatePickerOptions {
      const o: DatePickerOptions = {
        mode: props.mode,
        compact: props.compact,
        showClear: props.clearable,
        onChange(date) {
          lastEmitted = date;
          emit('update:modelValue', date);
          emit('change', date);
          if (date === null) emit('clear');
        },
        onOpen: () => emit('open'),
        onClose: () => emit('close'),
      };
      if (props.presets !== undefined) o.presets = props.presets;
      if (props.baseDate !== undefined) o.baseDate = props.baseDate;
      if (props.minDate !== undefined) o.min = props.minDate;
      if (props.maxDate !== undefined) o.max = props.maxDate;
      if (props.disabledDates !== undefined) o.disabledDates = props.disabledDates;
      if (props.disabledWeekdays !== undefined) o.disabledWeekdays = props.disabledWeekdays;
      if (props.weekStartsOn !== undefined) o.weekStartsOn = props.weekStartsOn;
      if (props.minuteStep !== undefined) o.minuteStep = props.minuteStep;
      if (props.defaultTime !== undefined) o.defaultTime = props.defaultTime;
      if (props.locale !== undefined) o.locale = props.locale;
      if (props.format !== undefined) o.format = props.format;
      if (props.placement !== undefined) o.placement = props.placement;
      if (props.closeOnSelect !== undefined) o.closeOnSelect = props.closeOnSelect;
      if (props.showToday !== undefined) o.showToday = props.showToday;
      return o;
    }

    function mountInstance(value: ModelValue): void {
      if (!inputRef.value) return;
      const opts = buildOptions();
      opts.defaultValue = value;
      instance = createDatePicker(inputRef.value, opts);
    }

    function destroyInstance(): void {
      instance?.destroy();
      instance = null;
    }

    /**
     * ds-core has no option-update API, so any change beyond the value (and the
     * input-only attrs) is applied by tearing the controller down and rebuilding
     * it — preserving the current value and re-opening if it was open. This is
     * the smallest safe approach without touching the core API (see PR #8).
     */
    function recreate(): void {
      const wasOpen = instance?.isOpen ?? false;
      const current = instance?.getValue() ?? props.modelValue ?? null;
      destroyInstance();
      mountInstance(current);
      if (wasOpen) instance?.open();
    }

    onMounted(() => mountInstance(props.modelValue));
    onBeforeUnmount(destroyInstance);

    // Value → setValue (no recreate). Skip our own echoed emit by identity.
    watch(
      () => props.modelValue,
      (v) => {
        if (!instance || v === lastEmitted) return;
        instance.setValue(v ?? null);
      },
    );

    // Disabled is reflected declaratively in the render; also close if open.
    watch(
      () => props.disabled,
      (d) => {
        if (d) instance?.close();
      },
    );

    // Any other option change → coalesced recreate. The getter only re-runs
    // when one of these props changes, so this fires precisely then.
    watch(
      () => [
        props.mode,
        props.presets,
        props.baseDate,
        props.minDate,
        props.maxDate,
        props.disabledDates,
        props.disabledWeekdays,
        props.weekStartsOn,
        props.minuteStep,
        props.defaultTime,
        props.locale,
        props.format,
        props.placement,
        props.closeOnSelect,
        props.showToday,
        props.clearable,
        props.compact,
      ],
      () => {
        if (instance) recreate();
      },
    );

    expose({
      open: () => instance?.open(),
      close: () => instance?.close(),
      getValue: () => instance?.getValue() ?? null,
      clear: () => {
        instance?.setValue(null);
        lastEmitted = null;
        emit('update:modelValue', null);
        emit('change', null);
        emit('clear');
      },
    });

    return (): VNode => {
      const children: VNode[] = [];
      if (props.label) children.push(h('span', { class: 'gds-input__label' }, props.label));
      const glyph = props.mode === 'time' ? clockIcon() : calendarIcon();
      children.push(
        h('span', { class: 'gds-input__wrap' }, [
          h('input', {
            ref: inputRef,
            id: props.inputId,
            name: props.name,
            class: 'gds-input__field',
            placeholder: props.placeholder,
            readonly: props.readonly,
            disabled: props.disabled,
          }),
          h('span', { class: 'gds-input__icon' }, [glyph]),
        ]),
      );
      return h('label', { class: `gds-input gds-input--${props.size}`, for: props.inputId }, children);
    };
  },
});
