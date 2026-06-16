import { h } from 'vue';
import type { VNode } from 'vue';

/**
 * Inline Lucide-style icons rendered as VNodes. Geometry only — no sizing or
 * colour: size comes from `.gds-input__icon` and colour from `currentColor`
 * (both token-driven in the GDS CSS layer), so nothing here is hardcoded.
 */
function icon(children: VNode[]): VNode {
  return h(
    'svg',
    {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '1.5',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'aria-hidden': 'true',
    },
    children,
  );
}

/** Calendar glyph — used for `date` and `datetime` modes. */
export function calendarIcon(): VNode {
  return icon([
    h('rect', { x: '3', y: '4', width: '18', height: '18', rx: '2' }),
    h('line', { x1: '16', y1: '2', x2: '16', y2: '6' }),
    h('line', { x1: '8', y1: '2', x2: '8', y2: '6' }),
    h('line', { x1: '3', y1: '10', x2: '21', y2: '10' }),
  ]);
}

/** Clock glyph — used for `time` mode. */
export function clockIcon(): VNode {
  return icon([h('circle', { cx: '12', cy: '12', r: '9' }), h('path', { d: 'M12 7v5l3 2' })]);
}
