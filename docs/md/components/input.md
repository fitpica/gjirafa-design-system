# Input

A text field with optional label, icon, prefix/suffix, helper text and character count.

**Use when:**
- Short free text: names, titles, emails, search.
- Multi-line text with gds-input--textarea.

**Don't use when:**
- Choosing from a known list of options → use dropdown
- Picking a date → use calendar

**Example: Search box (no visible label)**
```html
<div class="gds-input gds-input--md">
  <div class="gds-input__wrap">
    <i data-lucide="search" class="gds-input__icon"></i>
    <input type="search" class="gds-input__field" placeholder="Search entries" aria-label="Search entries" />
  </div>
</div>
```

**Example: With label, helper and error**
```html
<div class="gds-input gds-input--md gds-input--error">
  <label class="gds-input__label" for="entry-title">Title <span class="gds-input__required">*</span></label>
  <div class="gds-input__wrap"><input id="entry-title" class="gds-input__field" aria-invalid="true" aria-describedby="entry-title-help" /></div>
  <span class="gds-input__helper" id="entry-title-help">Title is required</span>
</div>
```

**Example: Textarea with count**
```html
<div class="gds-input gds-input--md gds-input--textarea">
  <label class="gds-input__label" for="entry-summary">Summary</label>
  <div class="gds-input__wrap"><textarea id="entry-summary" class="gds-input__field" rows="3"></textarea></div>
  <span class="gds-input__count">0 / 200</span>
</div>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-input` | div | yes | top level | Wrapper that stacks label, field and helper. Always has a size modifier. |
| `gds-input__label` | label | no | `gds-input` | Visible label. Link it with for/id. Attributes: `for` (id of the field). |
| `gds-input__required` | span | no | `gds-input__label` | Required marker "*" inside the label. |
| `gds-input__wrap` | div | yes | `gds-input` | The bordered box. Its height comes from the size modifier. |
| `gds-input__icon` | i \| span | no | `gds-input__wrap` | Leading icon (e.g. search). |
| `gds-input__prefix` | span | no | `gds-input__wrap` | Fixed text before the value (e.g. https://). |
| `gds-input__field` | input \| textarea | yes | `gds-input__wrap` | The native field. Attributes: `id` (matches the label's for), `aria-label` (Required when there is no visible label (e.g. a search box)). |
| `gds-input__suffix` | span | no | `gds-input__wrap` | Fixed text after the value (e.g. .com). |
| `gds-input__helper` | span | no | `gds-input` | Helper or error text under the box. |
| `gds-input__count` | span | no | `gds-input` | Character count, e.g. "0 / 200". |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-input--sm` | `gds-input` | size | 32px high. |
| `gds-input--md` | `gds-input` | size | 40px high. The usual choice. |
| `gds-input--lg` | `gds-input` | size | 48px high. |
| `gds-input--error` | `gds-input` | state | Red border. Put the message in __helper and set aria-invalid="true". |
| `gds-input--warning` | `gds-input` | state | Orange border. |
| `gds-input--success` | `gds-input` | state | Green border. |
| `gds-input--disabled` | `gds-input` | state | Disabled look. Also set disabled on the field. |
| `gds-input--textarea` | `gds-input` | content | Multi-line: the field is a <textarea>. |
| `gds-input--shadow` | `gds-input` | style | Shadow instead of an outline border. |
| `gds-input--full` | `gds-input` | width | Fills the available width. |

**States:**
- **focus**: Native :focus on the field highlights the wrap.
- **error**: gds-input--error + message in __helper + aria-invalid="true" + aria-describedby pointing at the helper.
- **disabled**: gds-input--disabled + disabled on the field.

**Accessibility:**
- Every field has a name: a <label for> or, for search boxes, aria-label.
- Placeholder is not a label.
- Link helper and error text with aria-describedby.

**Rules:**
- Every .gds-input has exactly one of --sm, --md, --lg. *Why:* The height lives on the size class; a bare .gds-input collapses. (Obvious over documented · auto-checkable)
- Every .gds-input__field has a linked <label> or an aria-label. *Why:* An unnamed field is announced as "edit text". (Accessible by default · auto-checkable)
- --error always comes with a text message in __helper. *Why:* A red border alone does not say what is wrong. (Accessible by default · auto-checkable)
- The field sits inside .gds-input__wrap, never directly in .gds-input. *Why:* The border, icon and prefix layout live on the wrap. (Obvious over documented · auto-checkable)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- Older guides called --md the default although a bare .gds-input has no height. *Planned fix:* v3: md height by default.
- gds-input--md renders 42px, not 40px: the wrap sets height 40px in the content-box model and adds a 1px border top and bottom (same for sm 34px and lg 50px). The same content-box model makes the wrap (width 100% + padding + border) about 22px wider than its parent, so it overlaps the next control in a row. *Planned fix:* v3: box-sizing: border-box on .gds-input__wrap so sizes are exactly 32/40/48 px; update the filter-bar control height with it.

*Generated from `components/input.json`. Edit that file, then run `npm run brand`.*
