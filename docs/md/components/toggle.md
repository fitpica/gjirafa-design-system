# Toggle

An on/off switch for a setting that takes effect immediately.

**Use when:**
- A setting that applies the moment it is flipped, with no Save button (e.g. Email notifications, Auto-publish).
- Turning a feature or a single item on and off in a list (e.g. enable a plugin, show a section on the homepage).

**Don't use when:**
- A choice that is submitted later with a form button → use checkbox
- Picking several options from a list → use checkbox
- Picking one of two or more named options (e.g. Public / Private) → use radio or tabs--filled
- An action that runs once (e.g. Publish now) → use button

**Example: Setting with label**
```html
<label class="gds-toggle gds-toggle--md">
  <input type="checkbox" role="switch" class="gds-toggle__input" checked />
  <span class="gds-toggle__track"><span class="gds-toggle__knob"></span></span>
  <span class="gds-toggle__label">Email me when an article is published</span>
</label>
```

**Example: In a list row (no visible label)**
```html
<label class="gds-toggle gds-toggle--sm">
  <input type="checkbox" role="switch" class="gds-toggle__input" aria-label="Show Breaking news section on homepage" />
  <span class="gds-toggle__track"><span class="gds-toggle__knob"></span></span>
</label>
```

**Example: Disabled**
```html
<label class="gds-toggle gds-toggle--md gds-toggle--disabled">
  <input type="checkbox" role="switch" class="gds-toggle__input" disabled />
  <span class="gds-toggle__track"><span class="gds-toggle__knob"></span></span>
  <span class="gds-toggle__label">Auto-translate (Pro plan)</span>
</label>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-toggle` | label | yes | top level | Wrapper. A <label>, so clicking the text flips the switch. |
| `gds-toggle__input` | input | yes | `gds-toggle` | Native checkbox with the switch role, visually hidden but focusable. Its :checked state drives the visual. Must come before the track (CSS uses ~). Attributes: `type` (checkbox), `role` (switch), `aria-label` (Required when there is no visible label), `aria-describedby` (Optional: id of help text outside the toggle). |
| `gds-toggle__track` | span | yes | `gds-toggle` | The pill-shaped track. Grey when off, primary colour when on. |
| `gds-toggle__knob` | span | yes | `gds-toggle__track` | The round knob. Slides right when on. |
| `gds-toggle__label` | span | no | `gds-toggle` | Visible label text, after the track. Name the setting, not the state ("Email notifications", not "On"). |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-toggle--sm` | `gds-toggle` | size | 32×16 track, 12px label. Use in dense lists and table rows. |
| `gds-toggle--md` | `gds-toggle` | size (default) | 40×20 track, 14px label. Use in forms and settings. |
| `gds-toggle--lg` | `gds-toggle` | size | 48×24 track, 16px label. |
| `gds-toggle--on` | `gds-toggle` | state | Forces the on look. Prefer the native checked attribute, which works without this class. |
| `gds-toggle--disabled` | `gds-toggle` | state | Disabled look. Also set the disabled attribute on the input. |

**States:**
- **on**: checked attribute on .gds-toggle__input (CSS reads :checked). role="switch" makes screen readers say on/off.
- **disabled**: gds-toggle--disabled + disabled attribute on the input.
- **focus**: Native :focus-visible on the input shows a ring around the track.
- **hover**: Native :hover on the wrapper darkens the track.

**Accessibility:**
- Use the native checkbox with role="switch": keyboard (Space) and screen readers work, and the checked state is announced as on/off. Do not add aria-checked; the native checked state is enough.
- Without visible text, give the input an aria-label that names the setting.
- The change applies immediately: if it can fail, tell the user (toast) and flip it back.
- For disabled, set the disabled attribute, not only the class.

**Rules:**
- Every .gds-toggle contains <input type="checkbox" role="switch" class="gds-toggle__input"> before .gds-toggle__track. *Why:* The visual state comes from the input through the ~ selector, and role="switch" makes it announced as on/off instead of checked. (Accessible by default · auto-checkable)
- A toggle without .gds-toggle__label has an aria-label on the input. *Why:* Otherwise it is announced as an unnamed switch. (Accessible by default · auto-checkable)
- Use a toggle only when flipping it applies the change right away; inside a form that is submitted with a button, use a checkbox. *Why:* A switch looks like a light switch: people expect the effect now. Mixing the two makes people unsure whether they must save. (Obvious over documented)
- The label names the setting and does not change with the state (not "On"/"Off"). *Why:* The switch already shows the state; a changing label makes it unclear what the switch controls. (Obvious over documented)
- gds-toggle--disabled always comes with the disabled attribute on the input. *Why:* The class only changes the look; without the attribute the switch still works from the keyboard. (Accessible by default · auto-checkable)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- The docs say to use role="switch", but none of the docs markup has it; they also advise aria-checked, which is redundant on a native checkbox. *Planned fix:* Add role="switch" to every docs example and drop the aria-checked advice.
- On can be shown two ways (native checked or gds-toggle--on), and they behave differently when disabled: with :checked the track stays primary (only dimmed) and still changes colour on hover; with --on alone it turns grey. *Planned fix:* v3: drive the look only from the native state, add .gds-toggle__input:disabled styles that win over :checked, and keep --on for docs previews.
- Disabled is class-only; a native disabled input without the class still looks enabled. *Planned fix:* v3: style from .gds-toggle__input:disabled ~ .gds-toggle__track.
- Only a native checkbox is supported. A <button aria-pressed> has no styles (the focus ring and on state need the input). *Planned fix:* Keep the checkbox pattern; if a button version is needed, add [aria-checked="true"] styles on the wrapper.
- The knob slide uses translateX, which goes the wrong way in right-to-left layouts. *Planned fix:* Use a logical property or flip the transform under [dir="rtl"].

*Generated from `components/toggle.json`. Edit that file, then run `npm run brand`.*
