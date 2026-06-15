import { afterEach, describe, expect, it } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import type { VueWrapper } from '@vue/test-utils';
import { nextTick } from 'vue';
import GdsDatePicker from './GdsDatePicker';

// The calendar surface is portalled to <body> by the core controller.
const surfaceCount = (): number => document.body.querySelectorAll('.gds-datepicker__popover').length;
const calendar = (): Element | null => document.body.querySelector('.gds-calendar');
const firstEnabledDay = (): HTMLButtonElement | null =>
  document.body.querySelector('.gds-calendar__grid [data-date]:not([disabled])');

/** Latest payload emitted under `name`, or undefined. */
function lastPayload(wrapper: VueWrapper, name: string): unknown {
  const events = wrapper.emitted(name);
  if (!events || events.length === 0) return undefined;
  const latest = events[events.length - 1];
  return latest ? latest[0] : undefined;
}

async function openOf(wrapper: VueWrapper): Promise<void> {
  await wrapper.find('input').trigger('click');
  await flushPromises();
}

afterEach(() => {
  // Defensive cleanup of any portalled surface left by a failed assertion.
  document.body.querySelectorAll('.gds-datepicker__popover').forEach((n) => n.remove());
});

describe('GdsDatePicker', () => {
  it('mounts and renders the GDS input shell (closed initially)', () => {
    const wrapper = mount(GdsDatePicker, { attachTo: document.body });
    expect(wrapper.find('label.gds-input').exists()).toBe(true);
    expect(wrapper.find('input.gds-input__field').exists()).toBe(true);
    expect(calendar()).toBeNull();
    wrapper.unmount();
  });

  it('reflects the v-model value in the input on init', () => {
    const wrapper = mount(GdsDatePicker, {
      attachTo: document.body,
      props: { modelValue: new Date(2026, 5, 15), locale: 'en-GB' },
    });
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('15/06/2026');
    wrapper.unmount();
  });

  it('updates the input when modelValue prop changes (setValue, no recreate)', async () => {
    const wrapper = mount(GdsDatePicker, {
      attachTo: document.body,
      props: { modelValue: new Date(2026, 5, 15), locale: 'en-GB' },
    });
    await wrapper.setProps({ modelValue: new Date(2026, 6, 20) });
    await nextTick();
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('20/07/2026');
    wrapper.unmount();
  });

  it('date mode: selecting a day emits update:modelValue and change', async () => {
    const wrapper = mount(GdsDatePicker, {
      attachTo: document.body,
      props: { mode: 'date', locale: 'en-GB' },
    });
    await openOf(wrapper);
    const day = firstEnabledDay();
    expect(day).not.toBeNull();
    day?.click();
    await flushPromises();
    expect(lastPayload(wrapper, 'update:modelValue')).toBeInstanceOf(Date);
    expect(wrapper.emitted('change')).toBeTruthy();
    wrapper.unmount();
  });

  it('datetime mode: renders a time row and emits a Date carrying the time', async () => {
    const wrapper = mount(GdsDatePicker, {
      attachTo: document.body,
      props: { mode: 'datetime', defaultTime: { hours: 9, minutes: 30 } },
    });
    await openOf(wrapper);
    expect(document.body.querySelector('.gds-calendar__time')).not.toBeNull();
    firstEnabledDay()?.click();
    await flushPromises();
    const v = lastPayload(wrapper, 'update:modelValue');
    expect(v).toBeInstanceOf(Date);
    expect((v as Date).getHours()).toBe(9);
    expect((v as Date).getMinutes()).toBe(30);
    wrapper.unmount();
  });

  it('time mode: no grid; stepping the hour emits a Date', async () => {
    const wrapper = mount(GdsDatePicker, { attachTo: document.body, props: { mode: 'time' } });
    await openOf(wrapper);
    expect(document.body.querySelector('.gds-calendar__grid')).toBeNull();
    const incHour = document.body.querySelector(
      'button[aria-label="Increment hours"]',
    ) as HTMLButtonElement | null;
    expect(incHour).not.toBeNull();
    incHour?.click();
    await flushPromises();
    expect(lastPayload(wrapper, 'update:modelValue')).toBeInstanceOf(Date);
    wrapper.unmount();
  });

  it('presets: clicking a preset emits the resolved value', async () => {
    const wrapper = mount(GdsDatePicker, {
      attachTo: document.body,
      props: {
        mode: 'date',
        baseDate: new Date(2026, 5, 1),
        presets: [
          {
            label: '+10d',
            value: (c) => {
              const d = new Date(c.baseDate as Date);
              d.setDate(d.getDate() + 10);
              return d;
            },
          },
        ],
      },
    });
    await openOf(wrapper);
    const preset = document.body.querySelector(
      '.gds-calendar__presets button.gds-menu__item',
    ) as HTMLButtonElement | null;
    expect(preset).not.toBeNull();
    preset?.click();
    await flushPromises();
    const v = lastPayload(wrapper, 'update:modelValue');
    expect(v).toBeInstanceOf(Date);
    expect((v as Date).getDate()).toBe(11);
    expect((v as Date).getMonth()).toBe(5);
    wrapper.unmount();
  });

  it('recreates the controller on a non-value prop change, preserving the value', async () => {
    const wrapper = mount(GdsDatePicker, {
      attachTo: document.body,
      props: { mode: 'date', modelValue: new Date(2026, 5, 15), locale: 'en-GB' },
    });
    await wrapper.setProps({ minDate: new Date(2026, 5, 1) });
    await flushPromises();
    // Value preserved across the rebuild...
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('15/06/2026');
    // ...and still functional (opens).
    await openOf(wrapper);
    expect(calendar()).not.toBeNull();
    wrapper.unmount();
  });

  it('emits clear + null when the Clear action is used', async () => {
    const wrapper = mount(GdsDatePicker, {
      attachTo: document.body,
      props: { modelValue: new Date(2026, 5, 15) },
    });
    await openOf(wrapper);
    const clearBtn = [...document.body.querySelectorAll('.gds-calendar__footer button')].find(
      (b) => /clear/i.test(b.getAttribute('aria-label') ?? ''),
    ) as HTMLButtonElement | undefined;
    expect(clearBtn).toBeTruthy();
    clearBtn?.click();
    await flushPromises();
    expect(lastPayload(wrapper, 'update:modelValue')).toBeNull();
    expect(wrapper.emitted('clear')).toBeTruthy();
    wrapper.unmount();
  });

  it('disabled: reflects the disabled attribute on the input', () => {
    const wrapper = mount(GdsDatePicker, { attachTo: document.body, props: { disabled: true } });
    expect((wrapper.find('input').element as HTMLInputElement).disabled).toBe(true);
    wrapper.unmount();
  });

  it('destroys the controller on unmount (removes the portalled surface)', async () => {
    const wrapper = mount(GdsDatePicker, { attachTo: document.body });
    await openOf(wrapper);
    expect(surfaceCount()).toBeGreaterThan(0);
    wrapper.unmount();
    await flushPromises();
    expect(surfaceCount()).toBe(0);
  });
});
