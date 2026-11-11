# Radio

Lets people pick exactly one option from a short, visible list.

**Use when:**
- Exactly one choice from 2 to about 6 options that people should see side by side (e.g. Visibility: Public / Unlisted / Private).
- The options need a short explanation each (use __helper).

**Don't use when:**
- Any number of options can be chosen → use checkbox
- A single on/off setting → use toggle (immediate) or checkbox (submitted later)
- More than about 6 options, or the list is long → use dropdown
- Switching between views of the same content → use tabs

**Example: Article visibility**
```html
<fieldset>
  <legend>Visibility</legend>
  <label class="gds-radio gds-radio--md">
    <input type="radio" class="gds-radio__input" name="visibility" value="public" checked />
    <span class="gds-radio__control"><span class="gds-radio__dot"></span></span>
    <span class="gds-radio__label">Public<span class="gds-radio__helper">Anyone can find and read it</span></span>
  </label>
  <label class="gds-radio gds-radio--md">
    <input type="radio" class="gds-radio__input" name="visibility" value="unlisted" />
    <span class="gds-radio__control"><span class="gds-radio__dot"></span></span>
    <span class="gds-radio__label">Unlisted<span class="gds-radio__helper">Only people with the link</span></span>
  </label>
  <label class="gds-radio gds-radio--md">
    <input type="radio" class="gds-radio__input" name="visibility" value="private" />
    <span class="gds-radio__control"><span class="gds-radio__dot"></span></span>
    <span class="gds-radio__label">Private<span class="gds-radio__helper">Only editors of this site</span></span>
  </label>
</fieldset>
```

**Example: Compact group with a disabled option**
```html
<div role="radiogroup" aria-labelledby="img-size-label">
  <span id="img-size-label">Image size</span>
  <label class="gds-radio gds-radio--sm">
    <input type="radio" class="gds-radio__input" name="img-size" value="original" checked />
    <span class="gds-radio__control"><span class="gds-radio__dot"></span></span>
    <span class="gds-radio__label">Original</span>
  </label>
  <label class="gds-radio gds-radio--sm">
    <input type="radio" class="gds-radio__input" name="img-size" value="wide" />
    <span class="gds-radio__control"><span class="gds-radio__dot"></span></span>
    <span class="gds-radio__label">Wide</span>
  </label>
  <label class="gds-radio gds-radio--sm gds-radio--disabled">
    <input type="radio" class="gds-radio__input" name="img-size" value="full" disabled />
    <span class="gds-radio__control"><span class="gds-radio__dot"></span></span>
    <span class="gds-radio__label">Full bleed (needs a 2000px image)</span>
  </label>
</div>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-radio` | label | yes, repeats | top level | One option. A <label>, so clicking the text selects it. Put all options of a group in a <fieldset> with a <legend> (or role="radiogroup" with aria-labelledby); GDS has no class for the group. |
| `gds-radio__input` | input | yes | `gds-radio` | Native radio, visually hidden but focusable. Its :checked state drives the visual. Must come before the control (CSS uses ~). Attributes: `type` (radio), `name` (Same value for every option in the group), `value` (The option's value). |
| `gds-radio__control` | span | yes | `gds-radio` | The visible circle. |
| `gds-radio__dot` | span | yes | `gds-radio__control` | Inner dot, shown when checked. Without it the checked radio is a filled circle with no dot. |
| `gds-radio__label` | span | no | `gds-radio` | Visible label text. Stacks its children in a column, so the helper goes inside it. |
| `gds-radio__helper` | span | no | `gds-radio__label` | Helper line under the label text (12px, text-secondary). Put it inside __label. |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-radio--sm` | `gds-radio` | size | 16px circle, 12px label. Use in dense panels and tables. |
| `gds-radio--md` | `gds-radio` | size (default) | 20px circle, 14px label. Use in forms. |
| `gds-radio--lg` | `gds-radio` | size | 24px circle, 16px label. |
| `gds-radio--checked` | `gds-radio` | state | Forces the checked look. Prefer the native checked attribute, which works without this class. |
| `gds-radio--disabled` | `gds-radio` | state | Disabled look. Also set the disabled attribute on the input. |

**States:**
- **checked**: checked attribute on one .gds-radio__input of the group (CSS reads :checked).
- **disabled**: gds-radio--disabled + disabled attribute on the input (or on the <fieldset> for the whole group).
- **focus**: Native :focus-visible on the input shows a ring on the control.
- **hover**: Native :hover on the wrapper darkens the circle border.

**Accessibility:**
- Keep the native input: browsers then give arrow-key movement inside the group for free.
- All options in a group share one name, so only one can be checked.
- Wrap the group in <fieldset> + <legend> (or role="radiogroup" + aria-labelledby) so the question is read with each option.
- Helper text inside __label becomes part of the option's name; keep it short.

**Rules:**
- Every .gds-radio contains <input type="radio" class="gds-radio__input"> before .gds-radio__control. *Why:* The visual state comes from the input through the ~ selector; without it the circle never changes. (Accessible by default · auto-checkable)
- Every radio input has a name, and the options of one group share it. *Why:* Without a shared name each radio acts alone: several can be checked and arrow keys do not move between them. (Accessible by default · auto-checkable)
- A group of .gds-radio sits in a <fieldset> with a <legend>, or in an element with role="radiogroup" and an accessible name. *Why:* Screen readers read the question ("Visibility") with each option. (Accessible by default · auto-checkable)
- Exactly one option in a group is checked by default, unless having no answer is meaningful. *Why:* A radio group cannot be cleared once picked; start from a sensible default. (Obvious over documented)
- A group has at least 2 options; for a single yes/no use a checkbox or toggle. *Why:* A single radio cannot be turned off. (Obvious over documented · auto-checkable)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- Disabled + checked looks different depending on how checked is set: with the native :checked the circle stays primary blue and still changes colour on hover; with --checked alone it turns grey. *Planned fix:* v3: drive the look only from the native state and add .gds-radio__input:disabled styles that win over :checked.
- Disabled is class-only; a native disabled input (or disabled fieldset) without the class still looks enabled. *Planned fix:* v3: style from .gds-radio__input:disabled ~ .gds-radio__control and the label.
- __helper sits inside __label here (the label is a flex column), but the checkbox contract places __helper next to __label. The CSS is the same for both. *Planned fix:* Pick one structure (inside __label) and align the checkbox contract and docs.
- There is no class for the group (spacing, legend style). Each product builds its own wrapper. *Planned fix:* Add .gds-radio-group (and reuse it for checkbox groups) with gap and legend styles.
- __helper keeps text-secondary when the option is disabled, while the label turns text-disabled. *Planned fix:* Dim the helper in .gds-radio--disabled too.

*Generated from `components/radio.json`. Edit that file, then run `npm run brand`.*
