import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Floating UI needs real layout (jsdom has none), so mock the positioning engine.
// These tests cover the controller's BEHAVIOR — state, ARIA, dismiss, focus,
// teardown. Positioning (flip/shift) is verified in-browser, not here.
vi.mock('@floating-ui/dom', () => ({
  computePosition: vi.fn(() =>
    Promise.resolve({ x: 0, y: 0, placement: 'bottom-start', middlewareData: {} }),
  ),
  autoUpdate: vi.fn(() => vi.fn()),
  offset: vi.fn(() => ({ name: 'offset' })),
  flip: vi.fn(() => ({ name: 'flip' })),
  shift: vi.fn(() => ({ name: 'shift' })),
  arrow: vi.fn(() => ({ name: 'arrow' })),
}));

import { createPopover } from './createPopover';

let trigger: HTMLButtonElement;
let content: HTMLDivElement;

beforeEach(() => {
  document.body.innerHTML = '';
  trigger = document.createElement('button');
  trigger.textContent = 'Open';
  content = document.createElement('div');
  content.className = 'gds-popover';
  content.innerHTML = '<button class="first">A</button><button class="last">B</button>';
  document.body.append(trigger, content);
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ARIA wiring', () => {
  it('wires trigger aria-haspopup/controls/expanded on create', () => {
    const p = createPopover(trigger, content, { role: 'listbox' });
    expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');
    expect(trigger.getAttribute('aria-controls')).toBe(content.id);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(content.getAttribute('role')).toBe('listbox');
    p.destroy();
  });

  it('falls back to aria-haspopup="true" for non-token roles (tooltip)', () => {
    const p = createPopover(trigger, content, { role: 'tooltip' });
    expect(trigger.getAttribute('aria-haspopup')).toBe('true');
    p.destroy();
  });

  it('toggles aria-expanded with open state', () => {
    const p = createPopover(trigger, content);
    p.open();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    p.close();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    p.destroy();
  });
});

describe('open / close lifecycle', () => {
  it('portals content to body and adds the open class', () => {
    const p = createPopover(trigger, content);
    p.open();
    expect(content.parentElement).toBe(document.body);
    expect(content.classList.contains('gds-popover--open')).toBe(true);
    expect(p.isOpen).toBe(true);
    p.destroy();
  });

  it('removes the open class and detaches on close (no transition in jsdom)', () => {
    const p = createPopover(trigger, content);
    p.open();
    p.close();
    expect(content.classList.contains('gds-popover--open')).toBe(false);
    expect(p.isOpen).toBe(false);
    expect(content.parentElement).toBeNull();
    p.destroy();
  });

  it('toggle() flips state', () => {
    const p = createPopover(trigger, content);
    p.toggle();
    expect(p.isOpen).toBe(true);
    p.toggle();
    expect(p.isOpen).toBe(false);
    p.destroy();
  });

  it('fires onOpen and onClose(reason)', () => {
    const onOpen = vi.fn();
    const onClose = vi.fn();
    const p = createPopover(trigger, content, { onOpen, onClose });
    p.open();
    expect(onOpen).toHaveBeenCalledOnce();
    p.close('api');
    expect(onClose).toHaveBeenCalledWith('api');
    p.destroy();
  });
});

describe('focus management', () => {
  it('moves focus to the first focusable on open', () => {
    const p = createPopover(trigger, content);
    p.open();
    expect(document.activeElement).toBe(content.querySelector('.first'));
    p.destroy();
  });

  it('returns focus to the trigger on close', () => {
    const p = createPopover(trigger, content);
    trigger.focus();
    p.open();
    p.close();
    expect(document.activeElement).toBe(trigger);
    p.destroy();
  });

  it('returnFocus:false leaves focus alone', () => {
    const p = createPopover(trigger, content, { returnFocus: false });
    p.open();
    (content.querySelector('.last') as HTMLElement).focus();
    p.close();
    expect(document.activeElement).not.toBe(trigger);
    p.destroy();
  });

  it('initialFocus:"none" does not move focus into the surface', () => {
    const p = createPopover(trigger, content, { initialFocus: 'none' });
    trigger.focus();
    p.open();
    expect(document.activeElement).toBe(trigger);
    p.destroy();
  });
});

describe('dismiss', () => {
  it('Escape closes (reason "escape")', () => {
    const onClose = vi.fn();
    const p = createPopover(trigger, content, { onClose });
    p.open();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(p.isOpen).toBe(false);
    expect(onClose).toHaveBeenCalledWith('escape');
    p.destroy();
  });

  it('Escape stack: topmost popover closes first', () => {
    const c2 = document.createElement('div');
    c2.innerHTML = '<button>x</button>';
    document.body.append(c2);
    const t2 = document.createElement('button');
    document.body.append(t2);

    const p1 = createPopover(trigger, content);
    const p2 = createPopover(t2, c2);
    p1.open();
    p2.open(); // p2 is topmost
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(p2.isOpen).toBe(false);
    expect(p1.isOpen).toBe(true);
    p1.destroy();
    p2.destroy();
  });

  it('outside pointerdown closes (reason "outside-click")', () => {
    const outside = document.createElement('div');
    document.body.append(outside);
    const onClose = vi.fn();
    const p = createPopover(trigger, content, { onClose });
    p.open();
    outside.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(p.isOpen).toBe(false);
    expect(onClose).toHaveBeenCalledWith('outside-click');
    p.destroy();
  });

  it('pointerdown on the trigger does NOT close (trigger is in the safe set)', () => {
    const p = createPopover(trigger, content);
    p.open();
    trigger.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(p.isOpen).toBe(true);
    p.destroy();
  });

  it('pointerdown inside the surface does NOT close', () => {
    const p = createPopover(trigger, content);
    p.open();
    (content.querySelector('.first') as HTMLElement).dispatchEvent(
      new Event('pointerdown', { bubbles: true }),
    );
    expect(p.isOpen).toBe(true);
    p.destroy();
  });

  it('dismiss.escapeKey:false keeps it open on Escape', () => {
    const p = createPopover(trigger, content, { dismiss: { escapeKey: false } });
    p.open();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(p.isOpen).toBe(true);
    p.destroy();
  });
});

describe('modal', () => {
  it('aria-hidden the background siblings on open, clears on close', () => {
    const sibling = document.createElement('main');
    document.body.append(sibling);
    const p = createPopover(trigger, content, { modal: true });
    p.open();
    expect(sibling.getAttribute('aria-hidden')).toBe('true');
    expect(content.getAttribute('aria-modal')).toBe('true');
    p.close();
    expect(sibling.hasAttribute('aria-hidden')).toBe(false);
    p.destroy();
  });
});

describe('teardown', () => {
  it('destroy() closes, detaches, and strips trigger ARIA', () => {
    const p = createPopover(trigger, content);
    p.open();
    p.destroy();
    expect(content.parentElement).toBeNull();
    expect(trigger.hasAttribute('aria-haspopup')).toBe(false);
    expect(trigger.hasAttribute('aria-controls')).toBe(false);
    expect(trigger.hasAttribute('aria-expanded')).toBe(false);
  });

  it('open() is idempotent; close() on a closed popover is a no-op', () => {
    const onOpen = vi.fn();
    const p = createPopover(trigger, content, { onOpen });
    p.open();
    p.open();
    expect(onOpen).toHaveBeenCalledOnce();
    p.close();
    p.close();
    expect(p.isOpen).toBe(false);
    p.destroy();
  });
});
