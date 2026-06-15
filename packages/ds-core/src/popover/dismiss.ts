// Dismiss helpers: a layered Escape stack (topmost layer closes first) and an
// outside-pointerdown detector. Neither exists in the CSS package today.

// --- Layered Escape ---------------------------------------------------------
// A last-opened stack so a popover opened over a modal closes the popover
// first, improving on the hardcoded modal-before-sidepanel order in the docs.

const escLayers: Array<() => void> = [];
let escBound = false;

function onGlobalKeydown(e: KeyboardEvent): void {
  if (e.key !== 'Escape' || escLayers.length === 0) return;
  const top = escLayers[escLayers.length - 1]!;
  // Stop other Escape handlers (e.g. an underlying modal) from also firing.
  e.stopPropagation();
  top();
}

/** Register an Escape handler on the topmost layer. Returns a cleanup function. */
export function onEscape(handler: () => void): () => void {
  if (!escBound) {
    // Capture phase so the topmost layer wins before bubbling handlers.
    document.addEventListener('keydown', onGlobalKeydown, true);
    escBound = true;
  }
  escLayers.push(handler);
  return () => {
    const i = escLayers.indexOf(handler);
    if (i !== -1) escLayers.splice(i, 1);
  };
}

// --- Outside pointerdown ----------------------------------------------------

/**
 * Call `handler` on a pointerdown outside ALL `nodes` (e.g. [surface, trigger]).
 * Because the trigger is included, the click that opened the popover never
 * closes it. Returns a cleanup function.
 */
export function onOutsideClick(nodes: HTMLElement[], handler: () => void): () => void {
  function onPointerDown(e: Event): void {
    const target = e.target as Node | null;
    if (target && nodes.some((n) => n === target || n.contains(target))) return;
    handler();
  }
  // Capture phase, bound now: it will not receive the in-flight event that
  // triggered open(), so no deferral is needed.
  document.addEventListener('pointerdown', onPointerDown, true);
  return () => document.removeEventListener('pointerdown', onPointerDown, true);
}
