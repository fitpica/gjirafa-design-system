---
name: gds-modal
description: "GDS Modal contract: exact markup, anatomy, modifiers, accessibility and rules for gds-modal*. A centred dialog over a dimmed page that blocks everything else until the user confirms, decides or cancels. Load before writing or editing modal markup with GDS."
---

# Modal

A centred dialog over a dimmed page that blocks everything else until the user confirms, decides or cancels.

**Use when:**
- A decision that must be made before going on: "Publish now?", "Discard changes?".
- Irreversible or destructive actions (delete entry, unpublish, remove user): use --destructive.
- Short, focused tasks with a few fields (rename a tag, merge tags) that make sense without seeing the page.

**Don't use when:**
- Editing entry details while the list or page stays in view → use sidepanel
- Long forms or many sections → use sidepanel (--lg) or a full page
- Telling the user something happened → use toast
- A persistent problem on the page → use alert
- A confirmation started from inside a side panel → use a confirmation inside the panel (modal z-index is below the panel, known issue)

**Example: Publish confirmation**
```html
<div class="gds-modal-overlay gds-modal-overlay--open">
  <div class="gds-modal gds-modal--sm" role="dialog" aria-modal="true" aria-labelledby="publish-title" aria-describedby="publish-desc">
    <button type="button" class="gds-btn-icon gds-btn-icon--ghost gds-btn-icon--sm gds-btn-icon--circle gds-modal__close" aria-label="Close"><i data-lucide="x"></i></button>
    <div class="gds-modal__inner">
      <div class="gds-modal__header">
        <h2 class="gds-modal__title" id="publish-title">Publish article?</h2>
        <p class="gds-modal__desc" id="publish-desc">"Election night: live results" will be visible on the website and in the app right away.</p>
      </div>
      <div class="gds-modal__footer">
        <button type="button" class="gds-btn gds-btn--ghost gds-btn--md"><span class="gds-btn__label">Cancel</span></button>
        <button type="button" class="gds-btn gds-btn--primary gds-btn--md"><span class="gds-btn__label">Publish now</span></button>
      </div>
    </div>
  </div>
</div>
```

**Example: Delete entry (destructive)**
```html
<div class="gds-modal-overlay gds-modal-overlay--open">
  <div class="gds-modal gds-modal--sm gds-modal--destructive" role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-desc">
    <button type="button" class="gds-btn-icon gds-btn-icon--ghost gds-btn-icon--sm gds-btn-icon--circle gds-modal__close" aria-label="Close"><i data-lucide="x"></i></button>
    <div class="gds-modal__inner">
      <div class="gds-modal__header">
        <h2 class="gds-modal__title" id="delete-title">Delete this entry?</h2>
        <p class="gds-modal__desc" id="delete-desc">"Summer festival guide" and its 3 translations will be deleted. This cannot be undone.</p>
      </div>
      <div class="gds-modal__footer">
        <button type="button" class="gds-btn gds-btn--ghost gds-btn--md"><span class="gds-btn__label">Cancel</span></button>
        <button type="button" class="gds-btn gds-btn--primary gds-btn--md"><span class="gds-btn__label">Delete entry</span></button>
      </div>
    </div>
  </div>
</div>
```

**Example: Rename tag (short form)**
```html
<div class="gds-modal-overlay gds-modal-overlay--open">
  <div class="gds-modal gds-modal--sm" role="dialog" aria-modal="true" aria-labelledby="rename-title">
    <button type="button" class="gds-btn-icon gds-btn-icon--ghost gds-btn-icon--sm gds-btn-icon--circle gds-modal__close" aria-label="Close"><i data-lucide="x"></i></button>
    <div class="gds-modal__inner">
      <div class="gds-modal__header">
        <h2 class="gds-modal__title" id="rename-title">Rename tag</h2>
      </div>
      <div class="gds-modal__body">
        <div class="gds-input gds-input--md">
          <label class="gds-input__label" for="tag-name">Tag name</label>
          <div class="gds-input__wrap"><input type="text" class="gds-input__field" id="tag-name" value="Elections 2026" /></div>
        </div>
      </div>
      <div class="gds-modal__footer">
        <button type="button" class="gds-btn gds-btn--ghost gds-btn--md"><span class="gds-btn__label">Cancel</span></button>
        <button type="button" class="gds-btn gds-btn--primary gds-btn--md"><span class="gds-btn__label">Save</span></button>
      </div>
    </div>
  </div>
</div>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-modal-overlay` | div | yes | top level | Fixed full-screen backdrop that centres the modal. Hidden (opacity 0, visibility hidden) until --open. Product JS may close on backdrop click, except for destructive modals. |
| `gds-modal` | div | yes | `gds-modal-overlay` | The dialog box: white, 640px (md) or 456px (sm), max height viewport minus 64px each side. Full-screen below 640px. Attributes: `role` ("dialog", or "alertdialog" for --destructive), `aria-modal` ("true"), `aria-labelledby` (id of .gds-modal__title), `aria-describedby` (id of .gds-modal__desc (required for alertdialog)). |
| `gds-modal__close` | button | no | `gds-modal` | Close button, top-right, first child of the modal. Combine with gds-btn-icon gds-btn-icon--ghost gds-btn-icon--sm gds-btn-icon--circle and a Lucide x icon. Attributes: `type` (button), `aria-label` ("Close"). |
| `gds-modal__inner` | div | yes | `gds-modal` | Scroll container with side padding. Header and footer stick to its top and bottom. |
| `gds-modal__header` | div | yes | `gds-modal__inner` | Sticky header with title and description. |
| `gds-modal__title` | h2 | yes | `gds-modal__header` | Dialog title (16px medium). Give it an id for aria-labelledby. Attributes: `id` (referenced by aria-labelledby). |
| `gds-modal__desc` | p | no | `gds-modal__header` | Supporting text (14px). For destructive modals, say what will be lost. Give it an id for aria-describedby. |
| `gds-modal__body` | div | no | `gds-modal__inner` | Content: text, form fields (gds-input, gds-dropdown, gds-checkbox…). Column with 20px gap. |
| `gds-modal__footer` | div | no | `gds-modal__inner` | Sticky footer with actions, right-aligned: secondary/ghost first, primary last. |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-modal-overlay--open` | `-overlay` | state | Shows the overlay and animates the modal in (fade + scale). |
| `gds-modal--sm` | `gds-modal` | size | 456px. Confirmations and one or two fields. |
| `gds-modal--md` | `gds-modal` | size (default) | 640px. Short forms. |
| `gds-modal--destructive` | `gds-modal` | variant | Turns the .gds-btn--primary in the footer red (critical colours). For irreversible actions. |
| `gds-modal__header--scrolled` | `__header` | state | Divider under the header. Product JS adds it when the body is scrolled away from the top. |
| `gds-modal__footer--scrolled` | `__footer` | state | Divider above the footer. Product JS adds it while there is more content below. |
| `gds-modal__footer--split` | `__footer` | layout | First action left, the rest right (e.g. "Back" left, "Cancel / Next" right). |

**States:**
- **closed**: gds-modal-overlay without --open (stays in the DOM, invisible and hidden from assistive tech by visibility: hidden), or not rendered.
- **open**: Add gds-modal-overlay--open; then move focus into the modal.
- **scrolled**: Toggle __header--scrolled when __inner scrollTop > 0 and __footer--scrolled while it is not scrolled to the end.

**Accessibility:**
- role="dialog" (or "alertdialog" for destructive), aria-modal="true" and aria-labelledby on .gds-modal, the element that contains the content.
- Destructive modals: role="alertdialog" with aria-describedby on the consequence text.
- The close button has aria-label="Close".
- Product JS: on open move focus into the modal (first field, or Cancel in a destructive modal), keep Tab inside it, close on Escape, make the page behind inert, and return focus to the trigger on close.
- Lock page scroll while open (product JS).

**Rules:**
- .gds-modal has role="dialog" or "alertdialog", aria-modal="true" and aria-labelledby pointing to the id of .gds-modal__title. *Why:* Screen readers then announce a dialog with its title and treat the page behind as unavailable. (Accessible by default · auto-checkable)
- .gds-modal__close is a <button type="button"> with aria-label. *Why:* It shows only an x icon. (Accessible by default · auto-checkable)
- A .gds-modal--destructive uses role="alertdialog" and aria-describedby pointing to .gds-modal__desc, which says what will be lost. *Why:* The consequence is read out together with the title. (Accessible by default · auto-checkable)
- In a destructive modal the confirm button names the action ("Delete entry", "Unpublish"), never "OK" or "Yes". Initial focus goes to Cancel; the backdrop does not close it. *Why:* People confirm by habit; a specific label and a safe default prevent accidents. (Obvious over documented)
- In a .gds-modal--destructive, the confirm button is .gds-btn--primary (the modifier makes it red). Do not add a second primary. *Why:* The modifier only recolours .gds-btn--primary inside the footer. (Reuse before you create · auto-checkable)
- The footer has at most one .gds-btn--primary, placed last. Cancel uses .gds-btn--ghost. *Why:* One clear main action, same order in every dialog. (Obvious over documented · auto-checkable)
- Product JS: on open move focus into the modal (first field, or Cancel in a destructive modal), keep Tab inside it, close on Escape, make the page behind inert, and return focus to the trigger on close. *Why:* Without it keyboard and screen reader users can reach the page behind or get lost after closing. (Accessible by default)
- Use --sm for confirmations, --md (default) for short forms. Anything longer goes in a side panel or a page. *Why:* A modal hides the context; long tasks in it are hard to check and easy to lose. (Obvious over documented)
- Toggle __header--scrolled and __footer--scrolled from the scroll position of __inner. *Why:* Shows that content continues under the sticky header or footer. (Obvious over documented)
- Do not open a modal from inside an open side panel. *Why:* The modal overlay (z-index 1000) renders behind the side panel (1020). (Obvious over documented)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- z-index: modal overlay is 1000, side panel is 1020. A modal opened from a side panel (delete, discard changes) appears behind it. *Planned fix:* Raise --modal-z-index above --sidepanel-z-index (e.g. a $z-modal token at 1025).
- --destructive re-implements critical button colours on .gds-btn--primary instead of using .gds-btn--critical. *Planned fix:* v3: drop --destructive; footer uses .gds-btn--critical.
- Docs put role="dialog" and aria-modal on the overlay, and the close buttons have no aria-label. *Planned fix:* Move the role to .gds-modal and add aria-label="Close" in the docs.
- __header--scrolled / __footer--scrolled need JS to work. *Planned fix:* CSS scroll-driven animation or scroll shadows.
- Mobile rule uses width: 100% !important and max-height: 100vh (mobile browser bars can cover the footer). *Planned fix:* Drop !important; use 100dvh.
- --modal-scroll-shadow token is defined but not used. *Planned fix:* Remove it or use it for the scroll dividers.

*Generated from `components/modal.json`. Edit that file, then run `npm run brand`.*
