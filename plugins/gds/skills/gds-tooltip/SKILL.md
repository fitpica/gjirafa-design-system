---
name: gds-tooltip
description: "GDS Tooltip contract: exact markup, anatomy, modifiers, accessibility and rules for gds-tooltip*. A small dark label that appears on hover or keyboard focus of a control, CSS only. Load before writing or editing tooltip markup with GDS."
---

# Tooltip

A small dark label that appears on hover or keyboard focus of a control, CSS only.

**Use when:**
- Naming an icon-only button in a toolbar (Bold, Insert image, Preview).
- A short, non-essential hint about what a control does ("Saves your draft locally").
- Showing the keyboard shortcut of an action (Save · ⌘S).

**Don't use when:**
- Content with links or buttons, or anything people need to read carefully → use popover
- Information needed to complete the task (format rules, errors) → use input helper text or alert
- A list of actions → use menu
- Truncated table text that people need to read → use wider column, wrapping, or a detail view

**Example: Icon-only toolbar button**
```html
<span class="gds-tooltip">
  <button type="button" class="gds-btn-icon gds-btn-icon--ghost gds-btn-icon--md" aria-label="Insert image" aria-describedby="tip-insert-image"><i data-lucide="image-plus"></i></button>
  <span id="tip-insert-image" class="gds-tooltip__bubble gds-tooltip__bubble--bottom" role="tooltip">Insert image from the media library</span>
</span>
```

**Example: With keyboard shortcut**
```html
<span class="gds-tooltip">
  <button type="button" class="gds-btn gds-btn--secondary gds-btn--sm" aria-describedby="tip-save-draft" aria-keyshortcuts="Meta+S"><span class="gds-btn__label">Save draft</span></button>
  <span id="tip-save-draft" class="gds-tooltip__bubble" role="tooltip">Save draft<kbd class="gds-tooltip__kbd">⌘S</kbd></span>
</span>
```

**Example: Longer hint (multiline)**
```html
<span class="gds-tooltip">
  <button type="button" class="gds-btn-icon gds-btn-icon--ghost gds-btn-icon--sm" aria-label="About canonical URL" aria-describedby="tip-canonical"><i data-lucide="info"></i></button>
  <span id="tip-canonical" class="gds-tooltip__bubble gds-tooltip__bubble--right gds-tooltip__bubble--md gds-tooltip__bubble--multiline" role="tooltip">Tells search engines which URL is the original when the same article is published in several places.</span>
</span>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-tooltip` | span | yes | top level | Inline wrapper (position: relative, inline-flex) around the trigger and the bubble. The trigger is a focusable element (button, link) placed first; the bubble shows on :hover or :focus-within. |
| `gds-tooltip__bubble` | span | yes | `gds-tooltip` | The label. Must be the last child of the wrapper. Dark surface, 12px text, no line wrap by default, arrow drawn with ::after. Above the trigger when no placement modifier is set. Attributes: `role` (tooltip), `id` (Unique; referenced by aria-describedby on the trigger). |
| `gds-tooltip__kbd` | kbd | no | `gds-tooltip__bubble` | Keyboard shortcut chip after the label text (e.g. ⌘S). |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-tooltip__bubble--top` | `__bubble` | layout (default) | Above the trigger. |
| `gds-tooltip__bubble--bottom` | `__bubble` | layout | Below the trigger. |
| `gds-tooltip__bubble--left` | `__bubble` | layout | Left of the trigger. |
| `gds-tooltip__bubble--right` | `__bubble` | layout | Right of the trigger. |
| `gds-tooltip__bubble--sm` | `__bubble` | size (default) | Max width 240px (short label). |
| `gds-tooltip__bubble--md` | `__bubble` | size | Max width 290px (one sentence). Use with --multiline. |
| `gds-tooltip__bubble--lg` | `__bubble` | size | Max width 380px (two short sentences). Use with --multiline. |
| `gds-tooltip__bubble--multiline` | `__bubble` | content | Lets text wrap at the max width (default is one line, no wrap). |
| `gds-tooltip__bubble--interactive` | `__bubble` | content | Turns pointer events back on so links inside can be clicked. Avoid: see rules and known issues. |

**States:**
- **hidden**: Default. opacity 0 + visibility hidden.
- **visible**: Native :hover or :focus-within on .gds-tooltip, after --tooltip-delay-show (no delay with reduced motion).
- **forced open**: Add is-open to .gds-tooltip (docs and JS-controlled tooltips). is-open is a shared global class, so it is not listed as a modifier here (see known issues).

**Accessibility:**
- Bubble: role="tooltip" and a unique id. Trigger: aria-describedby="<bubble id>".
- The trigger must be focusable so keyboard users get the tooltip on focus (:focus-within).
- An icon-only trigger needs its own aria-label; the tooltip describes, it does not name.
- Never put the only copy of important information in a tooltip: touch screens have no hover.
- The bubble ignores the pointer by default and closes when focus or pointer leaves; it cannot be dismissed with Escape (CSS only).

**Rules:**
- The bubble has role="tooltip" and an id; the trigger inside the same wrapper has aria-describedby with that id. *Why:* Without the link, screen reader users never hear the tooltip. (Accessible by default · auto-checkable)
- The first child of .gds-tooltip is a focusable element (button, a[href], input). *Why:* The bubble shows on :focus-within; a span or icon trigger never gets focus, so keyboard users never see it. (Accessible by default · auto-checkable)
- An icon-only trigger has its own aria-label, even with a tooltip. *Why:* aria-describedby adds a description, not a name; the button would be announced as just "button". (Accessible by default · auto-checkable)
- The bubble is the last child of .gds-tooltip. *Why:* The show selector uses the child combinator and the stacking assumes the bubble comes after the trigger. (Obvious over documented · auto-checkable)
- No links or buttons inside the bubble; do not use --interactive. Use a popover for interactive content. *Why:* role="tooltip" must not contain controls, and a hover-only surface is hard to reach with keyboard, touch and screen readers. (Accessible by default · auto-checkable)
- Keep tooltip text to one short phrase. Longer text needs --multiline (and --md or --lg); more than two sentences belongs in a popover or on the page. *Why:* Without --multiline the text does not wrap and runs past the bubble; long tooltips disappear before people finish reading. (Obvious over documented)
- Tooltips hold only extra help. Labels, errors and rules people need go in visible text. *Why:* Touch screens cannot hover, and the tooltip is hidden by default. (Accessible by default)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- WCAG 1.4.13 (content on hover or focus): the CSS-only bubble cannot be dismissed with Escape, and with pointer-events: none it closes when the pointer moves onto it. *Planned fix:* Add a tooltip mode to the ds-core controller (Escape to close, hoverable bubble), and keep the CSS version for simple labels.
- --interactive puts links inside an element with role="tooltip", which ARIA does not allow, and the docs show it as a supported pattern. *Planned fix:* Deprecate --interactive; point to popover.
- Placement is pure CSS: no flip near the viewport edges, only the width is clamped. Bubbles near the top or a scrolling container edge get cut off. *Planned fix:* Use createPopover() with role "tooltip" for flip / shift, or CSS anchor positioning later.
- The size modifiers only set max-width, but the default white-space: nowrap means they have no visible effect without --multiline. *Planned fix:* v3: wrap by default; drop --multiline.
- is-open (forced open) breaks the BEM naming rule and is also used by the table action-cell dropdown, so it cannot belong to one contract. *Planned fix:* v3: gds-tooltip--open.
- Placement uses physical left / right, so --left and --right do not flip in right-to-left layouts. *Planned fix:* Use logical properties (inset-inline-start / end) and name the modifiers --start / --end.

*Generated from `components/tooltip.json`. Edit that file, then run `npm run brand`.*
