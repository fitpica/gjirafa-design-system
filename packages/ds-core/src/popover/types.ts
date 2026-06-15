/** Placement of the floating surface relative to its trigger. */
export type PopoverPlacement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'left-start'
  | 'left-end'
  | 'right-start'
  | 'right-end';

/** ARIA role applied to the surface; also drives `aria-haspopup` on the trigger. */
export type PopoverRole = 'dialog' | 'listbox' | 'menu' | 'grid' | 'tooltip';

/** Why a popover closed — passed to `onClose`. */
export type PopoverCloseReason = 'escape' | 'outside-click' | 'api' | 'trigger';

export interface PopoverDismissOptions {
  /** Close when a pointerdown occurs outside both trigger and surface. Default: true. */
  outsideClick?: boolean;
  /** Close on Escape (topmost layer first). Default: true. */
  escapeKey?: boolean;
}

export interface PopoverOptions {
  /** Preferred placement. Default: `'bottom-start'`. */
  placement?: PopoverPlacement;
  /** Gap in px between trigger and surface. Default: the `--popover-offset` token, or 8. */
  offset?: number;
  /** Positioning strategy. `'fixed'` (default) portals to body and escapes `overflow:hidden` ancestors. */
  strategy?: 'absolute' | 'fixed';
  /** Flip to the opposite side when there's no room. Default: true. */
  flip?: boolean;
  /** Shift along the axis to stay in the viewport. Default: true. */
  shift?: boolean;
  /** Surface ARIA role. Default: `'dialog'`. */
  role?: PopoverRole;
  /** Modal behavior: trap focus + `inert`/`aria-hidden` the background. Default: false. */
  modal?: boolean;
  /** Optional arrow element (a `.gds-popover__arrow`) to position via the arrow middleware. */
  arrow?: HTMLElement | null;
  /** Dismiss behaviors. Both default to true. */
  dismiss?: PopoverDismissOptions;
  /** Where focus goes on close. `true` → the trigger (default); an element → that element; `false` → no move. */
  returnFocus?: boolean | HTMLElement;
  /** Reposition on scroll/resize/zoom/font-load (Floating UI autoUpdate). Default: true. */
  autoUpdate?: boolean;
  /** Initial focus target on open. `'first'` (default) focuses the first focusable; `'none'` leaves focus; or pass an element. */
  initialFocus?: HTMLElement | 'first' | 'none';
  /** Called after the surface opens. */
  onOpen?: () => void;
  /** Called after the surface closes, with the reason. */
  onClose?: (reason: PopoverCloseReason) => void;
}

export interface PopoverInstance {
  /** Open the surface (portal, position, show, wire dismiss + focus). */
  open(): void;
  /** Close the surface and return focus. */
  close(reason?: PopoverCloseReason): void;
  /** Toggle open/closed. */
  toggle(): void;
  /** Force a position recompute. */
  update(): void;
  /** Tear down all listeners, autoUpdate, and the portal node. */
  destroy(): void;
  /** Whether the surface is currently open. */
  readonly isOpen: boolean;
}
