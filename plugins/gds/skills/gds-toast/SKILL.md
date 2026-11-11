---
name: gds-toast
description: "GDS Toast contract: exact markup, anatomy, modifiers, accessibility and rules for gds-toast*. A short, single-line floating message that confirms something just happened and goes away on its own. Load before writing or editing toast markup with GDS."
---

# Toast

A short, single-line floating message that confirms something just happened and goes away on its own.

**Use when:**
- Confirming an action the user just took: "Article published", "Entry deleted", "Link copied".
- Offering one quick follow-up such as Undo or View.
- Background events that do not need action now ("Draft auto-saved").

**Don't use when:**
- An error the user must read or fix (failed publish, validation) → use alert (inline, persistent)
- A message longer than one short sentence, or with a title → use alert
- A decision the user must make → use modal
- The only way to reach an important action → use a button in the page; the toast can repeat it

**Example: Article published (with action)**
```html
<div class="gds-toast-container gds-toast-container--top-right" role="status" aria-live="polite" aria-label="Notifications">
  <div class="gds-toast gds-toast--success">
    <div class="gds-toast__icon" aria-hidden="true"><i data-lucide="check" width="24" height="24"></i></div>
    <div class="gds-toast__body">
      <span class="gds-toast__text">Article published</span>
      <button type="button" class="gds-toast__action">View</button>
    </div>
  </div>
</div>
```

**Example: Entry deleted (undo + countdown)**
```html
<div class="gds-toast-container gds-toast-container--bottom-right" role="status" aria-live="polite" aria-label="Notifications">
  <div class="gds-toast gds-toast--info">
    <div class="gds-toast__icon" aria-hidden="true"><i data-lucide="info" width="24" height="24"></i></div>
    <div class="gds-toast__body">
      <span class="gds-toast__text">Entry moved to trash</span>
      <button type="button" class="gds-toast__action">Undo</button>
      <div class="gds-toast__timer" role="timer" aria-label="Closes in 10 seconds">
        <span>10</span>
        <svg class="gds-toast__timer-ring" viewBox="0 0 29 29" aria-hidden="true"><circle cx="14.5" cy="14.5" r="12.5"></circle></svg>
      </div>
    </div>
  </div>
</div>
```

**Example: Background failure (critical)**
```html
<div class="gds-toast-container gds-toast-container--top-right" role="status" aria-live="polite" aria-label="Notifications">
  <div class="gds-toast gds-toast--critical" role="alert">
    <div class="gds-toast__icon" aria-hidden="true"><i data-lucide="x-circle" width="24" height="24"></i></div>
    <div class="gds-toast__body">
      <span class="gds-toast__text">Auto-save failed</span>
      <button type="button" class="gds-toast__action">Retry</button>
    </div>
  </div>
</div>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-toast-container` | div | no | top level | Fixed stack at a screen edge. Put it in the page once (empty) so it can act as a live region; toasts are added inside it. Needs one position modifier. Attributes: `role` ("status"), `aria-live` ("polite"), `aria-label` (e.g. "Notifications"). |
| `gds-toast` | div | yes | top level | The toast. Flex row: icon block, body. Usually inside gds-toast-container. Attributes: `role` ("alert" only on --critical toasts; others rely on the container's role="status".). |
| `gds-toast__icon` | div | yes | `gds-toast` | Solid colour block on the left with a white 24px Lucide icon. Colour comes from the variant. Attributes: `aria-hidden` ("true"). |
| `gds-toast__body` | div | yes | `gds-toast` | Row with text, action and timer. |
| `gds-toast__text` | span | yes | `gds-toast__body` | The message. One line; longer text is cut with an ellipsis. |
| `gds-toast__action` | button | no | `gds-toast__body` | One text button (Undo, View, Retry). Attributes: `type` (button). |
| `gds-toast__timer` | div | no | `gds-toast__body` | Round countdown badge (26px). Contains a <span> with the seconds left and the __timer-ring SVG. Product JS updates both. Attributes: `role` ("timer"), `aria-label` (e.g. "Closes in 5 seconds"). |
| `gds-toast__timer-ring` | svg | no | `gds-toast__timer` | Progress ring: <svg viewBox="0 0 29 29"> with one <circle cx="14.5" cy="14.5" r="12.5">. JS sets stroke-dasharray/offset (circumference ≈ 78.5). Attributes: `aria-hidden` ("true"). |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-toast--info` | `gds-toast` | variant (default) | Purple icon block and ring. Neutral events. |
| `gds-toast--success` | `gds-toast` | variant | Green. Action completed. |
| `gds-toast--warning` | `gds-toast` | variant | Orange. Completed, but with something to note. |
| `gds-toast--critical` | `gds-toast` | variant | Red. Something failed in the background; keep it short and offer Retry. |
| `gds-toast--dismissing` | `gds-toast` | state | Fades and slides out. Add with JS, then remove the element after the transition. |
| `gds-toast-container--top-right` | `-container` | layout | 24px from the top and right edges. |
| `gds-toast-container--top-left` | `-container` | layout | 24px from the top and left edges. |
| `gds-toast-container--top-center` | `-container` | layout | Top, centred. |
| `gds-toast-container--bottom-right` | `-container` | layout | 24px from the bottom and right edges. |
| `gds-toast-container--bottom-left` | `-container` | layout | 24px from the bottom and left edges. |
| `gds-toast-container--bottom-center` | `-container` | layout | Bottom, centred. |

**States:**
- **counting down**: Product JS updates the timer <span> text, its aria-label and the ring circle stroke-dashoffset each second.
- **dismissing**: Add gds-toast--dismissing, wait for the transition (normal duration), then remove the element.

**Accessibility:**
- The container is in the DOM before any toast is added, with role="status" and aria-live="polite", so new toasts are announced.
- --critical toasts get role="alert" so they are announced at once.
- Auto-dismiss timing is product JS: at least 5 seconds, longer with an action, and the timer pauses on hover and on focus inside the toast.
- The action is a real <button>. Moving focus into a toast is never automatic; keyboard users must be able to reach it (e.g. a shortcut or it stays until focus leaves).
- The icon is decorative; the text carries the meaning.
- Timer: role="timer" with an aria-label; the ring SVG is aria-hidden.

**Rules:**
- Toasts live inside a .gds-toast-container with role="status" and aria-live="polite" that exists before toasts are added. --critical toasts add role="alert". *Why:* A live region only announces content added after it exists. (Accessible by default · auto-checkable)
- .gds-toast-container has exactly one position modifier. Default choice: --top-right. *Why:* Without one the fixed container has no offsets and lands in an arbitrary spot. (Obvious over documented · auto-checkable)
- Toast text is one short sentence (about 60 characters or less), with no title and no links inside the text. *Why:* __text never wraps; longer text is cut with an ellipsis and cannot be read. (Obvious over documented)
- An auto-dismissing toast stays at least 5 seconds (10 with an action) and pauses on hover and focus. *Why:* People need time to read and to reach the action (WCAG 2.2.1). (Accessible by default)
- .gds-toast__action is a <button type="button">; at most one per toast. *Why:* It must be reachable with the keyboard, and one action keeps the toast quick to read. (Accessible by default · auto-checkable)
- .gds-toast__timer has role="timer" and an aria-label; .gds-toast__timer-ring has aria-hidden="true". *Why:* The number alone has no context for screen readers, and the ring is decoration. (Accessible by default · auto-checkable)
- .gds-toast__icon has aria-hidden="true"; icons: info → info, success → check, warning → alert-triangle, critical → x-circle. *Why:* The meaning is in the text; same icon for the same meaning, as in the docs. (Accessible by default · auto-checkable)
- A toast has exactly one variant class. Write --info explicitly. *Why:* Two variants give an undefined colour. (Obvious over documented · auto-checkable)
- Errors the user has to fix are shown as an inline alert, not a toast. *Why:* Toasts disappear; an error that vanishes leaves the user without a way to fix it. (Reuse before you create)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- .gds-toast-container is defined twice: in _alert.scss (max-width 400px) and _toast.scss (max-width 490px). The toast file wins only because it loads later. *Planned fix:* Define the container once, in _toast.scss.
- The docs never show __timer / __timer-ring markup. The ring geometry exists only as a JS constant (r = 12.5) and the ring is offset to sit over the border. brand.md puts the timer outside __body, but __body's right padding suggests inside. *Planned fix:* Document the SVG markup (viewBox, circle) in the docs, or replace the SVG with a CSS-only ring (conic-gradient + a registered custom property).
- There is no close element. A toast without a timer (docs: "Action without timer") cannot be dismissed. *Planned fix:* Add .gds-toast__close (24px+ icon button).
- White icon on the warning block (orange-500) is 2.5:1, below the 3:1 non-text contrast minimum. Info 3.5:1, critical 3.6:1, success 4.0:1 pass. *Planned fix:* Use a darker orange for --toast-warning-bg or a dark icon on warning.
- __text is nowrap with ellipsis; longer messages are cut with no way to read them. *Planned fix:* Allow up to two lines (line-clamp) and keep the full text available.
- .gds-toast:hover changes the background, which suggests the whole toast is clickable. It is not. *Planned fix:* Remove the hover background.
- Naming: toast uses --critical, alert uses --error. Toast info is purple, badge info is blue. *Planned fix:* Align variant names and the info colour across components.

*Generated from `components/toast.json`. Edit that file, then run `npm run brand`.*
