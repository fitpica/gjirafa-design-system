# Alert

A persistent message inside the page that explains a state or problem and stays until the cause is gone or the user dismisses it.

**Use when:**
- A message that must stay visible while the user works: a failed publish, validation summary, locked entry, missing permission.
- A problem the user has to fix or a state they need to know about before acting (e.g. "This entry is scheduled; edits go live at 18:00").
- System-wide notices across the top of the app (maintenance, expiring licence): use --banner.
- Short inline hints under a field or in a form section: use --compact.

**Don't use when:**
- A short confirmation that something just worked ("Article published") → use toast
- A question the user must answer before continuing → use modal
- An error tied to a single form field → use input with gds-input--error and its helper text
- A status label on a row or card → use badge

**Example: Publish failed (inserted after the action, with retry)**
```html
<div class="gds-alert gds-alert--error gds-alert--accent" role="alert">
  <span class="gds-alert__icon" aria-hidden="true"><i data-lucide="alert-circle" width="24" height="24"></i></span>
  <div class="gds-alert__body">
    <div class="gds-alert__content">
      <p class="gds-alert__title">The article could not be published</p>
      <p class="gds-alert__desc">Two required fields are empty: SEO title and cover image.</p>
    </div>
    <div class="gds-alert__actions">
      <button type="button" class="gds-btn gds-btn--primary gds-btn--sm"><span class="gds-btn__label">Show fields</span></button>
      <button type="button" class="gds-btn gds-btn--secondary gds-btn--sm"><span class="gds-btn__label">Save as draft</span></button>
    </div>
  </div>
  <button type="button" class="gds-alert__close" aria-label="Dismiss"><i data-lucide="x" width="16" height="16"></i></button>
</div>
```

**Example: Entry locked (present on load, no live role)**
```html
<div class="gds-alert gds-alert--warning">
  <span class="gds-alert__icon" aria-hidden="true"><i data-lucide="alert-triangle" width="24" height="24"></i></span>
  <div class="gds-alert__body">
    <div class="gds-alert__content">
      <p class="gds-alert__title">Another editor is working on this entry</p>
      <p class="gds-alert__desc">You can read it, but your changes cannot be saved until they close it.</p>
    </div>
    <a class="gds-alert__link" href="/entries/4821/history">View edit history <span class="gds-alert__link-icon" aria-hidden="true"><i data-lucide="arrow-right" width="16" height="16"></i></span></a>
  </div>
</div>
```

**Example: Compact field hint**
```html
<div class="gds-alert gds-alert--info gds-alert--compact">
  <span class="gds-alert__icon" aria-hidden="true"><i data-lucide="info" width="16" height="16"></i></span>
  <div class="gds-alert__body">
    <div class="gds-alert__content">
      <p class="gds-alert__desc">The slug cannot be changed after the entry is published.</p>
    </div>
  </div>
</div>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-alert` | div | yes | top level | Wrapper. Flex row: icon, body, close. Base styles are the info colours. Attributes: `role` ("alert" for errors, "status" for others, only when the alert is inserted after a user action (see rules). No role when it is part of the page on load.). |
| `gds-alert__icon` | span | no | `gds-alert` | Icon slot (24px, 16px in --compact). Holds a Lucide icon that matches the variant. Coloured by the variant. Attributes: `aria-hidden` ("true": the text carries the meaning.). |
| `gds-alert__body` | div | yes | `gds-alert` | Column that holds content, link and actions. Takes the remaining width. |
| `gds-alert__content` | div | yes | `gds-alert__body` | Stacks title and description. |
| `gds-alert__title` | p \| h2 \| h3 \| h4 | no | `gds-alert__content` | Short headline (14px medium). Use a heading tag when the alert starts a section of the page. |
| `gds-alert__desc` | p | no | `gds-alert__content` | Explanation (14px regular). Use title, description or both; one of them is needed. |
| `gds-alert__link` | a \| button | no | `gds-alert__body` | Text link below the content ("Read more", "View errors"). Use <button type="button"> when it does not navigate. |
| `gds-alert__link-icon` | span | no | `gds-alert__link` | Trailing icon in the link (16px), e.g. external-link or arrow-right. Attributes: `aria-hidden` ("true"). |
| `gds-alert__actions` | div | no | `gds-alert__body` | Row of buttons (gds-btn --sm) below the content. |
| `gds-alert__close` | button | no | `gds-alert` | Dismiss button (32px), last child of the alert. Contains a Lucide x icon. Attributes: `type` (button), `aria-label` (e.g. "Dismiss" or "Close"). |
| `gds-alert__progress` | div | no | `gds-alert` | Time bar at the bottom of a --toast alert. Width set by product JS. Needs position: relative on the alert (known issue). Attributes: `aria-hidden` ("true"). |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-alert--info` | `gds-alert` | variant (default) | Purple. Neutral information. |
| `gds-alert--success` | `gds-alert` | variant | Green. Something worked or is ready. |
| `gds-alert--warning` | `gds-alert` | variant | Orange. Something needs attention soon. |
| `gds-alert--error` | `gds-alert` | variant | Red. Something failed or is blocked. |
| `gds-alert--minimal` | `gds-alert` | layout | Description only, smaller padding (12px), items centred. Leave out the title. |
| `gds-alert--compact` | `gds-alert` | size | Smallest form for inline hints: 8/12px padding, 16px icon, 12px text. |
| `gds-alert--accent` | `gds-alert` | style | 4px coloured left border in the variant colour. |
| `gds-alert--banner` | `gds-alert` | layout | Full width, no radius, no left/right border. For the top of the app or a page. |
| `gds-alert--toast` | `gds-alert` | style | Floating card: white background, shadow, max 400px, slide-in animation, coloured left border per variant. For rich notifications with title and actions. |
| `gds-alert--dismissing` | `gds-alert` | state | Fades and slides out. Add with JS, then remove the element after the transition. |

**States:**
- **dismissing**: Add gds-alert--dismissing, wait for the transition (normal duration), then remove the element and move focus to a sensible place if the close button had focus.

**Accessibility:**
- Live role only for alerts added after a user action: role="alert" (assertive) for errors, role="status" (polite) for the rest. A live region must not be on alerts that are present on page load.
- Icon is decorative (aria-hidden="true"); the title or description says what happened. Colour is never the only signal.
- __close is a <button type="button"> with an aria-label. After dismiss, move focus to the next logical element (product JS).
- Do not auto-hide an inline alert. Only --toast alerts may time out, and they pause on hover and focus (product JS).
- In --compact the close button shrinks to 16px, below the 24px minimum target: do not use __close there.

**Rules:**
- An alert inserted after a user action has role="alert" (error) or role="status" (info, success, warning). An alert present on page load has no live role. *Why:* Screen readers announce new messages only through a live role; a role on static content makes them announce it on every load. (Accessible by default)
- .gds-alert__close is a <button type="button"> with an aria-label. *Why:* The button shows only an x icon, so it has no name without aria-label. (Accessible by default · auto-checkable)
- .gds-alert__icon has aria-hidden="true" and the alert has a __title or __desc with text. *Why:* The meaning lives in the text, not in the icon or colour. (Accessible by default · auto-checkable)
- An alert has exactly one variant (--info, --success, --warning, --error). Write --info explicitly even though it is the default look. *Why:* Two variants give an undefined colour; an explicit class makes intent readable. (Obvious over documented · auto-checkable)
- Icons: info → info, success → check, warning → alert-triangle, error → alert-circle. *Why:* Same icon for the same meaning everywhere, as in the docs. (Reuse before you create · auto-checkable)
- Short "it worked" confirmations use gds-toast, not an inline alert or gds-alert--toast. *Why:* Alerts are for messages that must stay; a confirmation that stays clutters the page. (Reuse before you create)
- .gds-alert__progress is used only inside a .gds-alert--toast, which needs position: relative (inline style or the toast container). *Why:* The bar is absolutely positioned; without a positioned alert it sticks to another element. (Obvious over documented · auto-checkable)
- Do not put .gds-alert__close inside a .gds-alert--compact. *Why:* Compact shrinks the button to 16px, below the 24px minimum target size. (Accessible by default · auto-checkable)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- .gds-alert__progress is position: absolute but .gds-alert has no position: relative (only inside .gds-toast-container). Docs add style="position:relative" by hand. *Planned fix:* Add position: relative to .gds-alert--toast.
- Two toast implementations: .gds-alert--toast (400px, title, actions, progress bar) and .gds-toast (490px, single line, timer ring), with different shadows and radii. *Planned fix:* v3: one toast component with an optional title/actions slot.
- Naming: alert uses --error while toast, badge and button use --critical. *Planned fix:* v3: rename to --critical (keep --error as an alias for one release).
- Alert info is purple while badge --info is blue. *Planned fix:* Decide one info colour for all components.
- --compact sets __close to 16×16px, below the WCAG 2.2 24px target size. *Planned fix:* Keep a 24px hit area (padding or min-size) in compact.
- __link is inline-flex; inside __desc the docs need style="display:inline". *Planned fix:* Add an inline link variant, or make the link display: inline when inside __desc.
- __close focus ring borrows --input-focus-* tokens. *Planned fix:* Use a shared focus-ring token.
- Docs side panel example uses old alert markup (class on <i>, no __body). *Planned fix:* Update the docs example to the anatomy here.

*Generated from `components/alert.json`. Edit that file, then run `npm run brand`.*
