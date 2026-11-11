---
name: gds-chip
description: "GDS Chip contract: exact markup, anatomy, modifiers, accessibility and rules for gds-chip*. A compact token for a tag, a selected value or a toggleable filter, optionally removable, alone, in a group or inside a tag field. Load before writing or editing chip markup with GDS."
---

# Chip

A compact token for a tag, a selected value or a toggleable filter, optionally removable, alone, in a group or inside a tag field.

**Use when:**
- Showing tags, categories or people attached to an entry, with an optional remove button.
- Quick filters above a list that people switch on and off (selectable chips).
- Entering several values in one field: tags, recipients, keywords (chip input).

**Don't use when:**
- A read-only status such as Published or Draft → use badge
- A count on its own → use pill
- Opening a filter panel with a count of active filters → use filter-badge
- A main action → use button

**Example: Tags field on an article**
```html
<label for="article-tags">Tags</label>
<div class="gds-chip-input">
  <span class="gds-chip gds-chip--sm">
    <span class="gds-chip__label">Politics</span>
    <button type="button" class="gds-chip__close" aria-label="Remove Politics"><i data-lucide="x"></i></button>
  </span>
  <span class="gds-chip gds-chip--sm">
    <span class="gds-chip__label">Elections 2027</span>
    <button type="button" class="gds-chip__close" aria-label="Remove Elections 2027"><i data-lucide="x"></i></button>
  </span>
  <input id="article-tags" type="text" class="gds-chip-input__field" placeholder="Add tag" />
</div>
```

**Example: Quick filters above the entries list**
```html
<div class="gds-chip-group gds-chip-group--rounded" role="group" aria-label="Filter by content type">
  <button type="button" class="gds-chip gds-chip--selectable gds-chip--rounded gds-chip--active" aria-pressed="true">
    <span class="gds-chip__icon"><i data-lucide="check"></i></span>
    <span class="gds-chip__label">Articles</span>
  </button>
  <button type="button" class="gds-chip gds-chip--selectable gds-chip--rounded" aria-pressed="false">
    <span class="gds-chip__label">Videos</span>
  </button>
  <button type="button" class="gds-chip gds-chip--selectable gds-chip--rounded" aria-pressed="false">
    <span class="gds-chip__label">Galleries</span>
  </button>
  <button type="button" class="gds-chip-group__counter">+4 more</button>
</div>
```

**Example: Assigned reviewer**
```html
<span class="gds-chip gds-chip--rounded gds-chip--neutral">
  <span class="gds-avatar"><img class="gds-avatar__img" src="/avatars/lirie-gashi.jpg" alt="" /></span>
  <span class="gds-chip__label">Lirie Gashi</span>
  <button type="button" class="gds-chip__close" aria-label="Remove Lirie Gashi"><i data-lucide="x"></i></button>
</span>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-chip-group` | div | no | top level | Wrapping row of chips with even spacing. Can end with a +N counter. |
| `gds-chip-input` | div | no | top level | Field that looks like an input and holds chips followed by a text field. Clicking it should focus the field (JS). |
| `gds-chip` | span \| button | yes | top level | The chip. A <span> for static or removable chips; a <button> only with gds-chip--selectable. Medium size by default. Can hold a .gds-avatar (sized automatically) before the label. Attributes: `type` ("button" (selectable chips only)), `aria-pressed` ("true" / "false" on selectable chips, matching gds-chip--active). |
| `gds-chip__icon` | span | no | `gds-chip` | Leading Lucide icon (e.g. tag, check). Decorative. |
| `gds-chip__label` | span | yes | `gds-chip` | The text. Truncates with an ellipsis. |
| `gds-chip__close` | button | no | `gds-chip` | Remove button after the label: <i data-lucide="x"></i>. Only on <span> chips, never inside a <button> chip. Attributes: `type` (button), `aria-label` (Required: "Remove <label>", e.g. "Remove Politics"). |
| `gds-chip-group__counter` | button | no | `gds-chip-group` | "+N more" at the end of a group. A button that reveals the hidden chips. Attributes: `type` (button). |
| `gds-chip-input__field` | input | yes | `gds-chip-input` | Borderless text field after the chips. Attributes: `type` (text), `aria-label` (Required unless a <label for> points at it, e.g. "Add tag"). |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-chip--sm` | `gds-chip` | size | Small. Use inside .gds-chip-input and dense table cells. |
| `gds-chip--lg` | `gds-chip` | size | Large. Medium is the base size (there is no --md class). |
| `gds-chip--neutral` | `gds-chip` | variant | Gray instead of the default blue. |
| `gds-chip--success` | `gds-chip` | variant | Green. |
| `gds-chip--warning` | `gds-chip` | variant | Orange. |
| `gds-chip--error` | `gds-chip` | variant | Red. |
| `gds-chip--rounded` | `gds-chip` | style | Fully rounded (pill shape) instead of small corners. |
| `gds-chip--outline` | `gds-chip` | style | Border and transparent background. Works with the colour variants. |
| `gds-chip--selectable` | `gds-chip` | style | Toggleable filter chip: gray with a border, pointer cursor and focus ring. Put it on a <button>. |
| `gds-chip--active` | `gds-chip` | state | Selected (brand fill, white text). Only works together with gds-chip--selectable. Set aria-pressed="true" too. Requires `gds-chip--selectable`. |
| `gds-chip--disabled` | `gds-chip` | state | Faded and ignores the mouse. Also set disabled on the button(s) inside, or on the chip if it is a button. |
| `gds-chip-group--rounded` | `-group` | style | Makes the +N counter fully rounded. Add it when the chips use gds-chip--rounded. |

**States:**
- **hover**: Native :hover darkens the background (on every chip, see knownIssues).
- **focus**: Selectable chips show a focus ring on :focus-visible. The close button uses the browser default.
- **selected**: gds-chip--selectable + gds-chip--active + aria-pressed="true".
- **disabled**: gds-chip--disabled + disabled attribute on the chip button or the close button.
- **field focus**: Native :focus-within on .gds-chip-input changes its border colour.

**Accessibility:**
- The close button is a real <button type="button"> with aria-label "Remove <label>"; "Remove" alone is ambiguous in a list of chips.
- Selectable chips are <button> with aria-pressed reflecting the selected state.
- Never put a close button inside a <button> chip or other button: nested interactive elements break keyboard and screen readers.
- The chip input field needs an accessible name, and the container should move focus to the field when clicked.
- After removing a chip, move focus to the next chip's close button or to the field, so keyboard users are not lost.

**Rules:**
- Every .gds-chip__close is a <button type="button"> with an aria-label that names the chip. *Why:* An icon-only x is announced as "button"; with several chips people cannot tell which one it removes. (Accessible by default · auto-checkable)
- A gds-chip--selectable is a <button> with aria-pressed, "true" exactly when gds-chip--active is present. *Why:* The selected state must not be visual only. (Accessible by default · auto-checkable)
- A chip without gds-chip--selectable is a <span>, not a <button> or <a>. Removing happens on .gds-chip__close. *Why:* Only selectable chips have focus styles; a clickable static chip has no visible focus. (Accessible by default · auto-checkable)
- A .gds-chip__close is never inside a <button> (a selectable chip, a dropdown trigger or any other). *Why:* Buttons inside buttons are invalid HTML and cannot be reached reliably by keyboard. (Accessible by default · auto-checkable)
- Every .gds-chip-input__field has an aria-label or a <label for>. *Why:* A placeholder is not a label and disappears once people type. (Accessible by default · auto-checkable)
- With gds-chip--disabled, buttons inside the chip (or the chip itself, if it is a button) have the disabled attribute. *Why:* The class only blocks the mouse; keyboard users could still remove or toggle it. (Accessible by default · auto-checkable)
- Chips inside .gds-chip-input use gds-chip--sm. *Why:* Medium chips make the field taller than a regular input. (Reuse before you create · auto-checkable)
- Use the default blue for user tags and selected values; use success, warning and error only when the value itself has that meaning. *Why:* Colour suggests a status; random colours make tags look like warnings. (Obvious over documented)
- When the chips in a .gds-chip-group use gds-chip--rounded, the group has gds-chip-group--rounded. *Why:* Otherwise the +N counter has square corners next to round chips. (Obvious over documented · auto-checkable)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- The SCSS header lists gds-chip--md and gds-chip--avatar, which do not exist. Medium is the base size and avatar chips are a plain .gds-avatar inside .gds-chip. *Planned fix:* Update the header comment.
- Every chip gets a hover background, including static <span> chips, so read-only tags look clickable. *Planned fix:* Apply hover only to selectable chips and to the close button.
- gds-chip--active does nothing without gds-chip--selectable. *Planned fix:* v3: drive the selected look from aria-pressed="true" on selectable chips and drop --active.
- gds-chip--disabled uses pointer-events: none only; the close button stays focusable and works by keyboard. *Planned fix:* Require the disabled attribute and style the chip from :disabled / :has(:disabled).
- The rule .gds-chip--rounded .gds-chip-group__counter targets a counter inside a chip, which never happens. Docs also omit gds-chip-group--rounded, so the docs counter is square next to rounded chips. *Planned fix:* Remove the dead selector and fix the docs example.
- The close button is 12–16px with a 6–10px icon, below the 24px minimum target size (WCAG 2.2, 2.5.8). *Planned fix:* Keep the visual size but add an invisible 24px hit area (padding or ::before).
- .gds-chip-input shows focus only as a border colour change and the field removes its outline; other inputs show a focus ring. *Planned fix:* Add the input focus ring on :focus-within.
- In the docs dropdown example, chips inside the <button> trigger use <span role="button"> close controls, which nests interactive elements. *Planned fix:* Move the tags out of the trigger, or make the chips non-removable there.
- The selectable focus ring and the chip input borrow input tokens (--input-focus-ring, --input-border) with fallbacks instead of chip tokens. *Planned fix:* Add chip focus tokens, or a shared focus token used by all components.

*Generated from `components/chip.json`. Edit that file, then run `npm run brand`.*
