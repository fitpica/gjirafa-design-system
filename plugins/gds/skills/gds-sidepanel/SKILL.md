---
name: gds-sidepanel
description: "GDS Side panel contract: exact markup, anatomy, modifiers, accessibility and rules for gds-sidepanel*. A full-height panel that slides in from the right over a dimmed page, for editing or viewing details while the underlying list stays visible. Load before writing or editing side panel markup with GDS."
---

# Side panel

A full-height panel that slides in from the right over a dimmed page, for editing or viewing details while the underlying list stays visible.

**Use when:**
- Editing the details of an item picked from a list (entry metadata, SEO fields, tag settings) while the list stays visible behind.
- Viewing details of a row without leaving the page (author profile, asset info, version history).
- Forms that are too long for a modal but do not need their own page.
- Settings or filters that apply to the page behind (--default, 300px).

**Don't use when:**
- A yes/no decision or confirmation → use modal
- Destructive confirmation started from the panel → use an inline confirmation inside the panel (a modal would open behind it, known issue)
- The main editing task of a page (writing the article body) → use a full page
- A short message → use toast or alert

**Example: Edit entry details**
```html
<div class="gds-sidepanel-overlay gds-sidepanel-overlay--open">
  <div class="gds-sidepanel" role="dialog" aria-modal="true" aria-labelledby="entry-panel-title">
    <div class="gds-sidepanel__topbar">
      <span class="gds-sidepanel__topbar-title">Summer festival guide</span>
      <button type="button" class="gds-btn-icon gds-btn-icon--ghost gds-btn-icon--xs" aria-label="Close"><i data-lucide="x"></i></button>
    </div>
    <div class="gds-sidepanel__content">
      <div class="gds-sidepanel__header">
        <h2 class="gds-sidepanel__title" id="entry-panel-title">Edit details</h2>
        <p class="gds-sidepanel__desc">Changes are saved to the draft. Publish to make them live.</p>
      </div>
      <div class="gds-sidepanel__body">
        <div class="gds-input gds-input--md">
          <label class="gds-input__label" for="entry-title">Title</label>
          <div class="gds-input__wrap"><input type="text" class="gds-input__field" id="entry-title" value="Summer festival guide" /></div>
        </div>
        <div class="gds-input gds-input--md">
          <label class="gds-input__label" for="entry-slug">Slug</label>
          <div class="gds-input__wrap"><input type="text" class="gds-input__field" id="entry-slug" value="summer-festival-guide" /></div>
          <span class="gds-input__helper">Used in the article URL.</span>
        </div>
      </div>
      <div class="gds-sidepanel__footer">
        <button type="button" class="gds-btn gds-btn--ghost gds-btn--md"><span class="gds-btn__label">Cancel</span></button>
        <button type="button" class="gds-btn gds-btn--primary gds-btn--md"><span class="gds-btn__label">Save</span></button>
      </div>
    </div>
  </div>
</div>
```

**Example: Asset details (large, split footer, no header)**
```html
<div class="gds-sidepanel-overlay gds-sidepanel-overlay--open">
  <aside class="gds-sidepanel gds-sidepanel--lg" role="dialog" aria-modal="true" aria-labelledby="asset-panel-title">
    <div class="gds-sidepanel__topbar">
      <span class="gds-sidepanel__topbar-title" id="asset-panel-title">stadium-night.jpg</span>
      <button type="button" class="gds-btn-icon gds-btn-icon--ghost gds-btn-icon--xs" aria-label="Close"><i data-lucide="x"></i></button>
    </div>
    <div class="gds-sidepanel__content">
      <div class="gds-sidepanel__body">
        <div class="gds-input gds-input--md">
          <label class="gds-input__label" for="asset-alt">Alt text</label>
          <div class="gds-input__wrap"><input type="text" class="gds-input__field" id="asset-alt" value="Fans in the stadium at night" /></div>
        </div>
      </div>
      <div class="gds-sidepanel__footer gds-sidepanel__footer--split">
        <button type="button" class="gds-btn gds-btn--ghost gds-btn--md"><span class="gds-btn__label">Replace file</span></button>
        <button type="button" class="gds-btn gds-btn--primary gds-btn--md"><span class="gds-btn__label">Save</span></button>
      </div>
    </div>
  </aside>
</div>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-sidepanel-overlay` | div | yes | top level | Fixed full-screen backdrop; aligns the panel to the right. Hidden until --open. Product JS may close on backdrop click when there are no unsaved changes. |
| `gds-sidepanel` | div \| aside | yes | `gds-sidepanel-overlay` | The panel: full height, white, rounded left corners, slides in from the right. 500px unless a size modifier is set. Full width below 640px (and below its own width for --lg/--xl). Attributes: `role` ("dialog"), `aria-modal` ("true"), `aria-labelledby` (id of .gds-sidepanel__title (or of __topbar-title when there is no header)). |
| `gds-sidepanel__topbar` | div | yes | `gds-sidepanel` | 40px bar with a bottom border: __topbar-title on the left, close button on the right. The close button is a gds-btn-icon gds-btn-icon--ghost gds-btn-icon--xs with aria-label="Close" (no element class of its own). |
| `gds-sidepanel__topbar-title` | span | yes | `gds-sidepanel__topbar` | Small title (14px medium, one line, ellipsis). Names the object being viewed or edited, e.g. the entry title. |
| `gds-sidepanel__content` | div | yes | `gds-sidepanel` | Scroll container (left padding only; children add right padding). Holds header, body and footer. |
| `gds-sidepanel__header` | div | no | `gds-sidepanel__content` | Sticky header with the task title and description. |
| `gds-sidepanel__title` | h2 | no | `gds-sidepanel__header` | Task title (16px medium). Give it an id for aria-labelledby. Attributes: `id` (referenced by aria-labelledby). |
| `gds-sidepanel__desc` | p | no | `gds-sidepanel__header` | Supporting text (14px). |
| `gds-sidepanel__body` | div | yes | `gds-sidepanel__content` | Content: fields, lists, details. Column with 20px gap. |
| `gds-sidepanel__footer` | div | no | `gds-sidepanel__content` | Sticky footer with actions, right-aligned: ghost first, primary last. Must be inside __content (it relies on its left padding). |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-sidepanel-overlay--open` | `-overlay` | state | Shows the overlay and slides the panel in. |
| `gds-sidepanel--default` | `gds-sidepanel` | size | 300px. Despite the name it is NOT the default; use for narrow filters or settings. |
| `gds-sidepanel--normal` | `gds-sidepanel` | size (default) | 500px. Same as no modifier. Most edit forms. |
| `gds-sidepanel--lg` | `gds-sidepanel` | size | 850px. Rich details: media, previews, two-column forms. |
| `gds-sidepanel--xl` | `gds-sidepanel` | size | 1170px. Near full-screen work (comparing versions). |
| `gds-sidepanel__header--scrolled` | `__header` | state | Divider under the header. Product JS adds it when __content is scrolled. |
| `gds-sidepanel__footer--scrolled` | `__footer` | state | Divider above the footer. Product JS adds it while there is more content below. |
| `gds-sidepanel__footer--split` | `__footer` | layout | First action left, the rest right (e.g. "Delete" left, "Cancel / Save" right). |

**States:**
- **closed**: gds-sidepanel-overlay without --open (invisible and hidden from assistive tech by visibility: hidden), or not rendered.
- **open**: Add gds-sidepanel-overlay--open; then move focus into the panel.
- **scrolled**: Toggle __header--scrolled when __content scrollTop > 0 and __footer--scrolled while it is not scrolled to the end.

**Accessibility:**
- role="dialog", aria-modal="true" and aria-labelledby on .gds-sidepanel. The overlay blocks the page, so the panel is modal.
- The topbar close button is an icon button with aria-label="Close".
- Product JS: on open move focus to the first field (or the panel title), keep Tab inside the panel, close on Escape, make the page behind inert, and return focus to the trigger on close.
- If there are unsaved changes, ask before closing (product JS); do not lose input on Escape or backdrop click.

**Rules:**
- .gds-sidepanel has role="dialog", aria-modal="true" and aria-labelledby pointing to the panel title. *Why:* Screen readers announce a dialog with its name and ignore the page behind. (Accessible by default · auto-checkable)
- The close button in .gds-sidepanel__topbar is a <button type="button"> with aria-label. *Why:* It shows only an x icon. (Accessible by default · auto-checkable)
- .gds-sidepanel__footer is inside .gds-sidepanel__content. *Why:* The footer has only right padding; outside __content it touches the left edge and does not stick. (Obvious over documented · auto-checkable)
- Leave the size as default (--normal, 500px) for edit forms; --lg/--xl only for media or side-by-side content; --default (300px) only for filters or settings. *Why:* Wider panels hide more of the list the user wants to keep in view. (Obvious over documented)
- __topbar-title names the object ("Summer festival guide"); __title names the task ("Edit details"). If you show only one, label the dialog with it. *Why:* Two similar titles stacked read as a repeat; distinct roles make each useful. (Obvious over documented)
- The footer has at most one .gds-btn--primary, placed last. Cancel uses .gds-btn--ghost. *Why:* One clear main action, same order as in modals. (Obvious over documented · auto-checkable)
- Product JS: on open move focus to the first field (or the panel title), keep Tab inside the panel, close on Escape, make the page behind inert, and return focus to the trigger on close. *Why:* Without it keyboard and screen reader users can reach the page behind or get lost after closing. (Accessible by default)
- Do not open a modal from inside the panel; confirm inside the panel instead. *Why:* The modal (z-index 1000) renders behind the panel (1020). (Obvious over documented)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- --default is 300px, but the real default (no modifier) is 500px (= --normal). *Planned fix:* v3: sizes sm 300 / md 500 / lg 850 / xl 1170, md default; keep old names as aliases for one release.
- Footer placement differs: the SCSS comment and live docs put __footer inside __content; the docs "Show code" puts it after __content, where it has no left padding. *Planned fix:* Fix the docs snippet, or give the footer full padding so both work.
- No close element class (modal has __close); docs use gds-btn-icon--xs without aria-label, while the modal uses --sm --circle. *Planned fix:* Add .gds-sidepanel__close and use the same button style as the modal.
- Two titles (__topbar-title and __title) with no guidance; docs examples use different text in each. *Planned fix:* Agree on their roles (see rule sidepanel-titles) or drop one.
- z-index 1020 is above the modal (1000), so modals opened from a panel are hidden. *Planned fix:* Modal above side panel in the z-index scale.
- Docs put role="dialog" on the overlay instead of the panel. *Planned fix:* Move role/aria-modal/aria-labelledby to .gds-sidepanel in the docs.
- Always modal (backdrop blocks the list); there is no docked, non-modal variant for editing while still using the list. *Planned fix:* v3: optional non-modal panel without overlay.
- height: 100vh can be covered by mobile browser bars; width: 100% !important on mobile. *Planned fix:* Use 100dvh; drop !important.
- --sidepanel-footer-padding and --sidepanel-scroll-shadow tokens are defined but not used. *Planned fix:* Remove them or use them.

*Generated from `components/sidepanel.json`. Edit that file, then run `npm run brand`.*
