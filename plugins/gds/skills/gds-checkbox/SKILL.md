---
name: gds-checkbox
description: "GDS Checkbox contract: exact markup, anatomy, modifiers, accessibility and rules for gds-checkbox*. Lets people turn one option on or off, or pick several options from a list. Load before writing or editing checkbox markup with GDS."
---

# Checkbox

Lets people turn one option on or off, or pick several options from a list.

**Use when:**
- Selecting rows in a table.
- Choosing any number of options from a short list.
- Agreeing to something before submitting a form.

**Don't use when:**
- A setting that takes effect immediately → use toggle
- Exactly one choice from a list → use radio

**Example: With label**
```html
<label class="gds-checkbox gds-checkbox--md">
  <input type="checkbox" class="gds-checkbox__input" />
  <span class="gds-checkbox__control"><i data-lucide="check"></i></span>
  <span class="gds-checkbox__label">Send me updates</span>
</label>
```

**Example: In a table cell (no visible label)**
```html
<label class="gds-checkbox gds-checkbox--sm">
  <input type="checkbox" class="gds-checkbox__input" checked aria-label="Select Winter travel guide" />
  <span class="gds-checkbox__control"><i data-lucide="check"></i></span>
</label>
```

**Example: Mixed (select all, some rows selected)**
```html
<label class="gds-checkbox gds-checkbox--sm gds-checkbox--mixed">
  <input type="checkbox" class="gds-checkbox__input" aria-label="Select all" />
  <span class="gds-checkbox__control"><i data-lucide="minus"></i></span>
</label>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-checkbox` | label | yes | top level | Wrapper. A <label>, so clicking the text toggles the box. |
| `gds-checkbox__input` | input | yes | `gds-checkbox` | Native checkbox, visually hidden but focusable. Its :checked state drives the visual. Attributes: `type` (checkbox), `aria-label` (Required when there is no visible label (e.g. in table cells)). |
| `gds-checkbox__control` | span | yes | `gds-checkbox` | The visible box. Must come after the input (CSS uses the ~ sibling selector). Contains the icon: <i data-lucide="check"></i>, or "minus" for mixed. |
| `gds-checkbox__label` | span | no | `gds-checkbox` | Visible label text. |
| `gds-checkbox__helper` | span | no | `gds-checkbox` | Helper text under the label. |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-checkbox--sm` | `gds-checkbox` | size | 16px box. Use in tables. |
| `gds-checkbox--md` | `gds-checkbox` | size (default) | 20px box. Use in forms. |
| `gds-checkbox--lg` | `gds-checkbox` | size | 24px box. |
| `gds-checkbox--checked` | `gds-checkbox` | state | Forces the checked look. Prefer the native checked attribute, which works without this class. |
| `gds-checkbox--mixed` | `gds-checkbox` | state | Indeterminate (some, not all, selected). Use the minus icon and set input.indeterminate = true in JS. |
| `gds-checkbox--disabled` | `gds-checkbox` | state | Disabled look. Also set the disabled attribute on the input. |

**States:**
- **checked**: checked attribute on .gds-checkbox__input (CSS reads :checked).
- **mixed**: gds-checkbox--mixed + minus icon + input.indeterminate = true.
- **disabled**: gds-checkbox--disabled + disabled attribute on the input.
- **focus**: Native :focus-visible on the input shows a ring on the control.

**Accessibility:**
- Keep the native input: it is what keyboards and screen readers use.
- Without visible text, give the input an aria-label ("Select all", "Select <row name>").
- For disabled, set the disabled attribute, not only the class.

**Rules:**
- Every .gds-checkbox contains an <input type="checkbox" class="gds-checkbox__input"> before .gds-checkbox__control. *Why:* The visual state comes from the input through the ~ selector; without it the box never changes. (Accessible by default · auto-checkable)
- A checkbox without .gds-checkbox__label has an aria-label on the input. *Why:* Otherwise it is announced as an unnamed checkbox. (Accessible by default · auto-checkable)
- The control contains the Lucide check icon (or minus for mixed). Do not draw your own SVG. *Why:* Both AI tests drew their own tick because the guide showed <svg>...</svg>. (Reuse before you create · auto-checkable)
- Checkboxes in table cells use gds-checkbox--sm. *Why:* Matches the 16px icon grid of table rows. (Reuse before you create · auto-checkable)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- Checked can be shown two ways (native checked or gds-checkbox--checked), which can disagree. *Planned fix:* v3: drive the look only from the native state; keep --checked for docs previews.

*Generated from `components/checkbox.json`. Edit that file, then run `npm run brand`.*
