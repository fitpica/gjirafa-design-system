import {
  computePosition,
  autoUpdate,
  offset as offsetMiddleware,
  flip as flipMiddleware,
  shift as shiftMiddleware,
  arrow as arrowMiddleware,
  type Middleware,
  type Placement,
} from '@floating-ui/dom';

import { trapFocus, focusFirst } from './focus';
import { onEscape, onOutsideClick } from './dismiss';
import type { PopoverCloseReason, PopoverInstance, PopoverOptions, PopoverRole } from './types';

/** Surface class hook — mirrors .gds-dropdown--open / .gds-calendar-popover--open. */
const OPEN_CLASS = 'gds-popover--open';
/** Viewport safe-edge padding (px) for collision shifting. */
const VIEWPORT_PADDING = 8;
/** Fallback gap (px) if the --popover-offset token can't be read. */
const DEFAULT_OFFSET = 8;
/** Safety net (ms) if `transitionend` never fires (e.g. display swaps). */
const DETACH_FALLBACK_MS = 1000;

/** Valid `aria-haspopup` token values. */
const HASPOPUP_ROLES = new Set<PopoverRole>(['menu', 'listbox', 'grid', 'dialog']);

let idCounter = 0;

function readOffsetToken(): number {
  if (typeof getComputedStyle === 'undefined' || typeof document === 'undefined') {
    return DEFAULT_OFFSET;
  }
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--popover-offset')
    .trim();
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : DEFAULT_OFFSET;
}

/**
 * Create a reusable, framework-agnostic popover behavior over a trigger and a
 * floating surface. Handles positioning (Floating UI: flip/shift/autoUpdate),
 * portal-to-body, open/close, outside-click + Escape dismiss, focus management,
 * and ARIA wiring. Returns a handle: { open, close, toggle, update, destroy }.
 *
 * The visual surface is the CSS `.gds-popover` shell from @gjirafa/design-system.
 */
export function createPopover(
  trigger: HTMLElement,
  content: HTMLElement,
  options: PopoverOptions = {},
): PopoverInstance {
  const {
    placement = 'bottom-start',
    strategy = 'fixed',
    flip = true,
    shift = true,
    role = 'dialog',
    modal = false,
    arrow = null,
    returnFocus = true,
    autoUpdate: useAutoUpdate = true,
    initialFocus = 'first',
    onOpen,
    onClose,
  } = options;

  const offsetPx = options.offset ?? readOffsetToken();
  const dismissOutside = options.dismiss?.outsideClick !== false;
  const dismissEsc = options.dismiss?.escapeKey !== false;

  let open = false;
  let cleanupAutoUpdate: (() => void) | null = null;
  let cleanupEsc: (() => void) | null = null;
  let cleanupOutside: (() => void) | null = null;
  let cleanupTrap: (() => void) | null = null;
  let inertedSiblings: HTMLElement[] = [];

  // --- Static ARIA wiring (idempotent) ---
  if (!content.id) content.id = `gds-popover-${++idCounter}`;
  content.setAttribute('role', role);
  if (modal) content.setAttribute('aria-modal', 'true');
  trigger.setAttribute('aria-haspopup', HASPOPUP_ROLES.has(role) ? role : 'true');
  trigger.setAttribute('aria-controls', content.id);
  trigger.setAttribute('aria-expanded', 'false');

  function buildMiddleware(): Middleware[] {
    const mw: Middleware[] = [offsetMiddleware(offsetPx)];
    if (flip) mw.push(flipMiddleware({ padding: VIEWPORT_PADDING }));
    if (shift) mw.push(shiftMiddleware({ padding: VIEWPORT_PADDING }));
    if (arrow) mw.push(arrowMiddleware({ element: arrow }));
    return mw;
  }

  function position(): void {
    void computePosition(trigger, content, {
      placement: placement as Placement,
      strategy,
      middleware: buildMiddleware(),
    }).then(({ x, y, placement: resolved, middlewareData }) => {
      Object.assign(content.style, {
        position: strategy,
        left: `${x}px`,
        top: `${y}px`,
      });
      content.dataset.placement = resolved;

      if (arrow && middlewareData.arrow) {
        const { x: ax, y: ay } = middlewareData.arrow;
        Object.assign(arrow.style, {
          left: ax != null ? `${ax}px` : '',
          top: ay != null ? `${ay}px` : '',
        });
      }
    });
  }

  function applyInert(): void {
    inertedSiblings = (Array.from(document.body.children) as HTMLElement[]).filter(
      (el) => el !== content,
    );
    for (const el of inertedSiblings) {
      el.setAttribute('aria-hidden', 'true');
      el.inert = true;
    }
  }

  function clearInert(): void {
    for (const el of inertedSiblings) {
      el.removeAttribute('aria-hidden');
      el.inert = false;
    }
    inertedSiblings = [];
  }

  function detach(): void {
    if (content.parentNode) content.parentNode.removeChild(content);
    content.style.visibility = ''; // restore CSS-controlled visibility
  }

  function doOpen(): void {
    if (open) return;
    open = true;

    // Portal to body so a fixed-strategy surface escapes overflow:hidden ancestors.
    document.body.appendChild(content);
    // Make the surface focusable immediately. `.gds-popover` is visibility:hidden
    // in CSS, and `visibility` is in the transition — so at the instant --open is
    // added it still computes as hidden (transition t=0) and silently rejects
    // focus(). Setting it inline beats that; the opacity transition still fades in.
    content.style.visibility = 'visible';
    position();
    if (useAutoUpdate) {
      cleanupAutoUpdate = autoUpdate(trigger, content, position);
    }

    // Force a reflow so the opacity fade-in animates from the closed state.
    void content.offsetHeight;
    content.classList.add(OPEN_CLASS);
    trigger.setAttribute('aria-expanded', 'true');

    if (modal) {
      applyInert();
      cleanupTrap = trapFocus(content);
    }
    if (initialFocus instanceof HTMLElement) initialFocus.focus();
    else if (initialFocus === 'first') focusFirst(content);

    if (dismissEsc) cleanupEsc = onEscape(() => close('escape'));
    if (dismissOutside) {
      cleanupOutside = onOutsideClick([content, trigger], () => close('outside-click'));
    }

    onOpen?.();
  }

  function close(reason: PopoverCloseReason = 'api'): void {
    if (!open) return;
    open = false;

    content.classList.remove(OPEN_CLASS);
    cleanupAutoUpdate?.();
    cleanupAutoUpdate = null;
    cleanupEsc?.();
    cleanupEsc = null;
    cleanupOutside?.();
    cleanupOutside = null;
    cleanupTrap?.();
    cleanupTrap = null;
    if (modal) clearInert();

    trigger.setAttribute('aria-expanded', 'false');

    // Detach after the fade-out; detach immediately if there's no transition
    // (reduced motion / no CSS loaded).
    const duration = Number.parseFloat(getComputedStyle(content).transitionDuration || '0');
    if (duration > 0) {
      let done = false;
      const finish = (): void => {
        if (done) return;
        done = true;
        content.removeEventListener('transitionend', onEnd);
        detach();
      };
      const onEnd = (e: TransitionEvent): void => {
        if (e.target === content && e.propertyName === 'opacity') finish();
      };
      content.addEventListener('transitionend', onEnd);
      setTimeout(finish, DETACH_FALLBACK_MS);
    } else {
      detach();
    }

    if (returnFocus !== false) {
      const target = returnFocus instanceof HTMLElement ? returnFocus : trigger;
      target.focus();
    }

    onClose?.(reason);
  }

  function toggle(): void {
    if (open) close('api');
    else doOpen();
  }

  function destroy(): void {
    if (open) close('api');
    detach();
    trigger.removeAttribute('aria-haspopup');
    trigger.removeAttribute('aria-controls');
    trigger.removeAttribute('aria-expanded');
  }

  return {
    open: doOpen,
    close,
    toggle,
    update: position,
    destroy,
    get isOpen() {
      return open;
    },
  };
}
