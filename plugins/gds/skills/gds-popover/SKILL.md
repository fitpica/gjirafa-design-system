---
name: gds-popover
description: "GDS Popover contract: exact markup, anatomy, modifiers, accessibility and rules for gds-popover*. A generic floating surface anchored to a trigger, for interactive content such as a small form, a calendar or a menu. Load before writing or editing popover markup with GDS."
---

# Popover

A generic floating surface anchored to a trigger, for interactive content such as a small form, a calendar or a menu.

**Use when:**
- Interactive content that belongs to one control and should not leave the page context (embed code with a Copy button, quick edit of a title, column settings).
- Hosting another component that has to float: the date picker calendar.
- Content that must escape a clipping container (table cell, modal, scrolling panel).

**Don't use when:**
- A short, non-interactive hint on hover or focus → use tooltip
- A list of actions (Edit, Duplicate, Delete) → use menu
- Choosing a value from a list → use dropdown
- A task that needs full attention or a confirmation (Delete article?) → use modal

**Example: Embed code (open)**
```html
<button type="button" class="gds-btn gds-btn--secondary gds-btn--sm" aria-haspopup="dialog" aria-controls="embed-popover" aria-expanded="true"><span class="gds-btn__label">Embed</span></button>
<div id="embed-popover" class="gds-popover gds-popover--open" role="dialog" aria-label="Embed code">
  <div class="gds-popover__content">
    <div class="gds-input gds-input--sm">
      <label class="gds-input__label" for="embed-code">Embed code</label>
      <div class="gds-input__wrap">
        <input id="embed-code" class="gds-input__field" value="&lt;iframe src=&quot;https://vp.gjirafa.net/embed/8f3k2&quot;&gt;&lt;/iframe&gt;" readonly />
      </div>
    </div>
    <button type="button" class="gds-btn gds-btn--secondary gds-btn--sm"><span class="gds-btn__label">Copy code</span></button>
  </div>
</div>
```

**Example: Closed, with arrow**
```html
<button type="button" class="gds-btn gds-btn--ghost gds-btn--sm" aria-haspopup="dialog" aria-controls="seo-popover" aria-expanded="false"><span class="gds-btn__label">SEO preview</span></button>
<div id="seo-popover" class="gds-popover" role="dialog" aria-label="SEO preview">
  <div class="gds-popover__content">
    <p>Kosovo wins the regional cup | Gjirafa News</p>
  </div>
  <div class="gds-popover__arrow" aria-hidden="true"></div>
</div>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-popover` | div | yes | top level | The surface: light background, border, radius, shadow, max-height with scroll. position: fixed by default; the createPopover() controller writes top / left inline. Hidden (opacity + visibility) until --open. Attributes: `id` (Referenced by aria-controls on the trigger), `role` (dialog (default) \| menu \| listbox \| grid, set by the controller from its role option), `aria-label` (Name of the surface, e.g. "Embed code" (or aria-labelledby a heading inside)), `aria-modal` ("true" only in modal mode (controller)). |
| `gds-popover__content` | div | no | `gds-popover` | Padding wrapper (--popover-padding). Leave it out when the content brings its own spacing (e.g. .gds-calendar). |
| `gds-popover__arrow` | div | no | `gds-popover` | Optional decorative diamond pointing at the trigger. The controller positions it (arrow option). Attributes: `aria-hidden` (true). |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-popover--open` | `gds-popover` | state | Visible. Toggled by the controller together with aria-expanded on the trigger. |

**States:**
- **open**: gds-popover--open on the surface + aria-expanded="true" on the trigger (both set by createPopover()).
- **closed**: No --open. The element stays in the DOM (it fades out and Floating UI can measure it).

**Accessibility:**
- Trigger: a <button> with aria-haspopup (matching the role), aria-controls = popover id and aria-expanded. createPopover() sets all three.
- Surface: a role (dialog by default) and an accessible name (aria-label or aria-labelledby).
- Escape and outside click close it; focus moves into the surface on open and back to the trigger on close (controller).
- Modal mode traps focus and makes the background inert; use it only when the popover must be finished before going on.
- Reduced motion: the open / close transition snaps. Forced colours: the border stays visible.

**Rules:**
- The trigger has aria-haspopup, aria-controls pointing to the popover id, and aria-expanded matching gds-popover--open. *Why:* Screen readers announce that the button opens something and whether it is open. (Accessible by default · auto-checkable)
- A .gds-popover with role="dialog" has aria-label or aria-labelledby. *Why:* An unnamed dialog is announced as just "dialog". (Accessible by default · auto-checkable)
- .gds-popover__arrow has aria-hidden="true". *Why:* It is decoration only. (Accessible by default · auto-checkable)
- Position, open and dismiss the popover with createPopover() from @gjirafa/ds-core; do not hand-write top / left. *Why:* The controller handles flip, shift, scroll, portal out of clipping parents, Escape and focus return; the CSS alone puts the surface at the top-left of the viewport. (Reuse before you create)
- Wrap plain content in __content; put components with their own padding (.gds-calendar) directly in .gds-popover. *Why:* Otherwise the padding is doubled. (Obvious over documented · auto-checkable)
- Use a popover for interactive content opened by a click; use a tooltip for short text on hover or focus. *Why:* A popover takes focus and needs a click to open; a tooltip must never hold controls. (Reuse before you create)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- .gds-calendar-popover duplicates this surface (same border, radius, shadow) with its own absolute positioning. *Planned fix:* Rebuild .gds-calendar-popover on .gds-popover (already planned in the popover docs).
- .gds-menu and .gds-dropdown__panel carry their own background, border and shadow. Putting them in a .gds-popover draws two frames. *Planned fix:* v3: menu and dropdown panel take their surface from .gds-popover (or get a flat variant).
- Without the controller the surface is position: fixed with no coordinates, so it shows at the top-left of the viewport. *Planned fix:* Document the controller as required; later add CSS anchor positioning as a fallback.
- The arrow is a rotated square in the surface colour with no border, while the surface has a 1px border. The arrow may look cut off from the frame. Needs a visual check. *Planned fix:* Give the arrow the same border on its two outer sides.
- Open state naming differs across overlays: gds-popover--open, gds-dropdown--open, gds-calendar-popover--open, and is-open on the tooltip and the table action menu. *Planned fix:* v3: one convention for every overlay (e.g. --open on the surface).

*Generated from `components/popover.json`. Edit that file, then run `npm run brand`.*
