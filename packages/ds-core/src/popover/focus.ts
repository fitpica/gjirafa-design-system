// Focus helpers — re-authored from the docs-only trapFocus logic so they ship
// in the package (the docs/index.html version is not published).

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(',');

/** All tabbable elements inside `root`, in DOM order (hidden ones excluded). */
export function getFocusable(root: HTMLElement): HTMLElement[] {
  const nodes = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
  return nodes.filter(
    (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true',
  );
}

/** Move focus to the first focusable element in `root` (or `root` itself). */
export function focusFirst(root: HTMLElement): void {
  const focusable = getFocusable(root);
  const target = focusable[0] ?? root;
  if (target === root && !root.hasAttribute('tabindex')) {
    root.setAttribute('tabindex', '-1');
  }
  target.focus();
}

/**
 * Trap Tab / Shift+Tab focus inside `container`. Returns a cleanup function.
 * Use for modal-style popovers; non-modal menus/listboxes should use roving
 * focus instead of a hard trap.
 */
export function trapFocus(container: HTMLElement): () => void {
  function onKeydown(e: KeyboardEvent): void {
    if (e.key !== 'Tab') return;
    const focusable = getFocusable(container);
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    const active = document.activeElement;

    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  container.addEventListener('keydown', onKeydown);
  return () => container.removeEventListener('keydown', onKeydown);
}
