# Button

Triggers an action: text buttons, icon-only buttons and joined button groups.

**Use when:**
- Running an action on the current page: Save, Publish, Delete, Create entry.
- Opening a dialog, menu or panel.
- An icon-only action in a dense toolbar or table row, when the icon is widely understood (more, close, edit).

**Don't use when:**
- Going to another page or URL → use a link (<a href>); if it must look like a button, put .gds-btn on the <a>
- Switching a setting on or off → use toggle
- Filtering a list by one or more values → use chip (gds-chip--selectable) or filter-badge
- Choosing between views inside one panel → use tabs

**Example: Entry editor header actions**
```html
<button type="button" class="gds-btn gds-btn--secondary gds-btn--md">
  <span class="gds-btn__label">Save draft</span>
</button>
<button type="button" class="gds-btn gds-btn--primary gds-btn--md">
  <span class="gds-btn__icon"><i data-lucide="send"></i></span>
  <span class="gds-btn__label">Publish</span>
</button>
<button type="button" class="gds-btn-icon gds-btn-icon--ghost gds-btn-icon--md" aria-label="More actions">
  <i data-lucide="ellipsis-vertical"></i>
</button>
```

**Example: Loading while publishing**
```html
<button type="button" class="gds-btn gds-btn--primary gds-btn--md gds-btn--loading" aria-busy="true">
  <i data-lucide="loader-circle" class="gds-btn__spinner" aria-hidden="true"></i>
  <span class="gds-btn__label">Publishing</span>
</button>
```

**Example: Schedule navigation group**
```html
<div class="gds-btn-group" role="group" aria-label="Schedule navigation">
  <button type="button" class="gds-btn gds-btn--secondary gds-btn--sm"><span class="gds-btn__label">Previous week</span></button>
  <button type="button" class="gds-btn gds-btn--secondary gds-btn--sm"><span class="gds-btn__label">Today</span></button>
  <button type="button" class="gds-btn gds-btn--secondary gds-btn--sm"><span class="gds-btn__label">Next week</span></button>
</div>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-btn-group` | div | no | top level | Joins adjacent .gds-btn elements into one bar with shared borders. Only direct .gds-btn children are joined. Attributes: `role` (group), `aria-label` (What the buttons control, e.g. "Date range"). |
| `gds-btn` | button \| a | yes | top level | Text button. Needs one size and one variant modifier: the base class has no height, padding or colour. Can sit alone or inside .gds-btn-group. Attributes: `type` ("button" unless it submits a form (on <button>)), `href` (Required when the element is an <a>). |
| `gds-btn__spinner` | i \| svg | no | `gds-btn` | Loading spinner: <i data-lucide="loader-circle" class="gds-btn__spinner"></i>. Only with gds-btn--loading. Centred over the hidden label. Attributes: `aria-hidden` (true). |
| `gds-btn__icon` | span | no, repeats | `gds-btn` | Icon slot before or after the label. Wraps one Lucide icon; the size modifier sets the icon size. Decorative: the label carries the meaning. |
| `gds-btn__label` | span | yes | `gds-btn` | The button text. Loading hides only this element, so all text must be inside it. |
| `gds-btn-icon` | button \| a | no | top level | Square icon-only button, used instead of .gds-btn. Contains one Lucide icon directly (no __icon wrapper). Needs one size and one variant modifier. Attributes: `type` ("button" unless it submits a form (on <button>)), `aria-label` (Required: the action, e.g. "More actions"). |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-btn--primary` | `gds-btn` | variant | Filled brand colour. The main action of a view. |
| `gds-btn--secondary` | `gds-btn` | variant | White with a border. Supporting actions. |
| `gds-btn--ghost` | `gds-btn` | variant | No background or border until hover. Low-emphasis actions in toolbars and cards. |
| `gds-btn--critical` | `gds-btn` | variant | Red fill. Destructive actions (delete, remove, revoke). |
| `gds-btn--positive` | `gds-btn` | variant | Green fill. Confirming a positive outcome (approve, mark as done). |
| `gds-btn--xs` | `gds-btn` | size | 24px high, 12px icon. |
| `gds-btn--sm` | `gds-btn` | size | 28px high, 14px icon. Toolbars, table rows, cards. |
| `gds-btn--md` | `gds-btn` | size | 36px high, 16px icon. Forms, page headers, dialogs. |
| `gds-btn--lg` | `gds-btn` | size | 44px high, 18px icon. |
| `gds-btn--xl` | `gds-btn` | size | 52px high, 20px icon. Landing or onboarding screens only. |
| `gds-btn--pill` | `gds-btn` | style | Fully rounded corners. |
| `gds-btn--full` | `gds-btn` | width | Takes the full width of its container. |
| `gds-btn--loading` | `gds-btn` | state | Hides the label (keeps the width) and shows .gds-btn__spinner. Add aria-busy="true". Does not block clicks on its own. |
| `gds-btn--disabled` | `gds-btn` | state | Disabled look for elements that cannot take the disabled attribute (<a>). On <button>, use the disabled attribute instead. |
| `gds-btn-icon--primary` | `-icon` | variant | Filled brand colour. |
| `gds-btn-icon--secondary` | `-icon` | variant | White with a border. |
| `gds-btn-icon--ghost` | `-icon` | variant | Transparent until hover. The usual choice in toolbars, table rows and dialog headers. |
| `gds-btn-icon--critical` | `-icon` | variant | Red fill. Destructive actions. |
| `gds-btn-icon--positive` | `-icon` | variant | Green fill. |
| `gds-btn-icon--xs` | `-icon` | size | 24px square, 12px icon. |
| `gds-btn-icon--sm` | `-icon` | size | 28px square, 14px icon. |
| `gds-btn-icon--md` | `-icon` | size | 36px square, 16px icon. |
| `gds-btn-icon--lg` | `-icon` | size | 44px square, 18px icon. |
| `gds-btn-icon--xl` | `-icon` | size | 52px square, 20px icon. |
| `gds-btn-icon--circle` | `-icon` | style | Round instead of square. |

**States:**
- **hover**: Native :hover. Skipped when the button is disabled.
- **active**: Native :active: darker fill and a slight press (scale).
- **focus**: Native :focus-visible shows a two-ring focus outline.
- **disabled**: disabled attribute on <button>. On <a>: gds-btn--disabled + aria-disabled="true" + remove href. .gds-btn-icon supports the attribute only.
- **loading**: gds-btn--loading + .gds-btn__spinner + aria-busy="true". Ignore clicks in JS while loading.

**Accessibility:**
- Use <button> for actions and <a href> for navigation, whatever it looks like.
- Every .gds-btn-icon needs an aria-label that names the action.
- Use the native disabled attribute on <button>; the class alone leaves it clickable and focusable.
- While loading, keep the label in the DOM (it stays the accessible name) and set aria-busy="true".
- Give .gds-btn-group role="group" and an aria-label. If the group works as a toggle, set aria-pressed on each button.

**Rules:**
- Every .gds-btn and .gds-btn-icon has exactly one size and one variant modifier. *Why:* The base class has no height, padding or colours, so a bare button renders as an unstyled box. (Obvious over documented · auto-checkable)
- Every .gds-btn-icon has an aria-label (or aria-labelledby). *Why:* An icon alone has no text, so screen readers announce just "button". (Accessible by default · auto-checkable)
- All text inside .gds-btn sits in .gds-btn__label; icons sit in .gds-btn__icon. *Why:* Loading hides only the label element, and the icon size comes from the __icon wrapper. (Obvious over documented · auto-checkable)
- A disabled <button> uses the disabled attribute. gds-btn--disabled is only for <a>, together with aria-disabled="true". *Why:* The class only changes the look; the button would still be focusable and clickable. (Accessible by default · auto-checkable)
- A gds-btn--loading button has aria-busy="true" and contains .gds-btn__spinner. *Why:* Without aria-busy, screen-reader users get no sign that something is happening; without the spinner the button just looks empty. (Accessible by default · auto-checkable)
- A <button class="gds-btn"> or <button class="gds-btn-icon"> inside a form has type="button" unless it submits the form. *Why:* A button in a form submits it by default, which surprises people when the button only opens a menu. (Obvious over documented · auto-checkable)
- At most one gds-btn--primary per view or dialog. *Why:* One clear main action; two primaries compete and slow the decision. (Obvious over documented)
- Use gds-btn--critical only for actions that delete or remove something, and gds-btn--positive only to confirm a good outcome. *Why:* Red and green carry meaning; using them for emphasis teaches people to ignore them. (Obvious over documented)
- Navigation uses <a href class="gds-btn ...">; actions use <button>. *Why:* Links and buttons behave differently for keyboards, new tabs and screen readers. (Accessible by default)
- A .gds-btn-group contains only .gds-btn elements of one size. *Why:* The group only joins direct .gds-btn children and sets corner radius per size; icon buttons or mixed sizes break the joined edges. (Reuse before you create · auto-checkable)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- Docs use gds-btn--icon-left, gds-btn--icon-right and gds-btn--icon-only, and the SCSS header lists --icon-left/--icon-right, but none of these classes exist in the CSS. *Planned fix:* Remove them from docs and the header comment. The gap already spaces icon and label; icon-only buttons use .gds-btn-icon.
- A bare .gds-btn or .gds-btn-icon has no size and no colours. brand.md says md is the default and shows buttons without a size class, which is wrong. *Planned fix:* v3: make md + secondary the default. Until then, fix brand.md.
- gds-btn--loading does not block clicks or hover, and a .gds-btn__icon stays visible next to the spinner. *Planned fix:* Add pointer-events: none and hide .gds-btn__icon while loading.
- On secondary and ghost, the loading colour (neutral-60) makes the spinner about 2.1:1 against white, below the 3:1 needed for non-text graphics. *Planned fix:* Use --gds-color-text-secondary for the spinner on light buttons.
- .gds-btn-icon has no disabled class and its variant hovers only check :disabled, so an <a class="gds-btn-icon"> cannot look disabled. *Planned fix:* Add [aria-disabled="true"] styling shared by both button types.
- .gds-btn-group only styles direct .gds-btn children; a .gds-btn-icon inside keeps its own radius and doubles borders. *Planned fix:* Extend the group selectors to .gds-btn-icon.
- There is no selected style for a button inside .gds-btn-group, yet docs show Day/Week/Month groups that read as a toggle. *Planned fix:* Add a pressed style driven by aria-pressed="true", or point toggles to tabs.
- Docs token table lists --btn-critical-bg as red-600; the SCSS uses red-700. *Planned fix:* Regenerate the docs token table from the SCSS.

*Generated from `components/button.json`. Edit that file, then run `npm run brand`.*
