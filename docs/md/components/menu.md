# Menu

A list of actions on demand: overflow ("more") menus, context menus, row actions.

**Use when:**
- Actions on one item that do not fit as buttons (Edit, Duplicate, Move to, Archive, Delete on an article row).
- A "more" (ellipsis) button in a toolbar or card.
- Right-click / context actions.

**Don't use when:**
- Choosing a value (status, author, category) → use dropdown
- One or two main actions → use buttons, visible on the page
- Navigation between pages or sections → use sidebar, tabs or links
- A form or other interactive content → use popover

**Example: Article row actions**
```html
<button type="button" class="gds-btn-icon gds-btn-icon--ghost gds-btn-icon--sm" aria-label="Actions for Election results live" aria-haspopup="menu" aria-expanded="true" aria-controls="article-actions"><i data-lucide="more-horizontal"></i></button>
<div id="article-actions" class="gds-menu" role="menu" aria-label="Article actions">
  <button type="button" class="gds-menu__item" role="menuitem" tabindex="-1">
    <span class="gds-menu__icon"><i data-lucide="pencil" width="16" height="16"></i></span>
    <span class="gds-menu__label">Edit</span>
  </button>
  <button type="button" class="gds-menu__item" role="menuitem" tabindex="-1" aria-keyshortcuts="Control+D">
    <span class="gds-menu__icon"><i data-lucide="copy" width="16" height="16"></i></span>
    <span class="gds-menu__label">Duplicate</span>
    <span class="gds-menu__shortcut">Ctrl+D</span>
  </button>
  <button type="button" class="gds-menu__item" role="menuitem" tabindex="-1" aria-haspopup="menu" aria-expanded="false">
    <span class="gds-menu__icon"><i data-lucide="folder" width="16" height="16"></i></span>
    <span class="gds-menu__label">Move to category</span>
    <span class="gds-menu__trailing"><i data-lucide="chevron-right" width="16" height="16"></i></span>
  </button>
  <button type="button" class="gds-menu__item gds-menu__item--disabled" role="menuitem" tabindex="-1" aria-disabled="true">
    <span class="gds-menu__icon"><i data-lucide="send" width="16" height="16"></i></span>
    <span class="gds-menu__label">Push notification</span>
  </button>
  <div class="gds-menu__divider" role="separator"></div>
  <button type="button" class="gds-menu__item gds-menu__item--danger" role="menuitem" tabindex="-1">
    <span class="gds-menu__icon"><i data-lucide="trash-2" width="16" height="16"></i></span>
    <span class="gds-menu__label">Delete</span>
  </button>
</div>
```

**Example: Export menu (grouped, rich items)**
```html
<div class="gds-menu" role="menu" aria-label="Export">
  <div class="gds-menu__group" role="presentation">Export report</div>
  <button type="button" class="gds-menu__item gds-menu__item--rich" role="menuitem" tabindex="-1">
    <span class="gds-menu__icon"><i data-lucide="file-spreadsheet" width="20" height="20"></i></span>
    <span class="gds-menu__content">
      <span class="gds-menu__label">CSV</span>
      <span class="gds-menu__desc">Page views per article, for spreadsheets</span>
    </span>
  </button>
  <button type="button" class="gds-menu__item gds-menu__item--rich" role="menuitem" tabindex="-1">
    <span class="gds-menu__icon"><i data-lucide="file-text" width="20" height="20"></i></span>
    <span class="gds-menu__content">
      <span class="gds-menu__label">PDF</span>
      <span class="gds-menu__desc">Printable summary with charts</span>
    </span>
  </button>
</div>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-menu` | div | yes | top level | The menu surface: background, border, shadow, column of items. Has no open state and no positioning: the product shows / hides it (hidden attribute) and places it next to its trigger. Long menus scroll inside the panel past 360px (or 60% of the screen height): --menu-max-height. Attributes: `role` (menu), `id` (Referenced by aria-controls on the trigger), `aria-label` (e.g. "Article actions" (or aria-labelledby the trigger)). |
| `gds-menu__group` | div | no | `gds-menu` | Small uppercase heading above a set of items. A sibling of the items, not a wrapper. Attributes: `role` (presentation). |
| `gds-menu__item` | button | yes, repeats | `gds-menu` | One action. Full-width <button>. Attributes: `type` (button), `role` (menuitem), `tabindex` (-1 (roving: the focused item gets focus via JS)), `aria-disabled` ("true" with --disabled), `aria-haspopup` ("menu" when it opens a submenu (with __trailing)), `aria-keyshortcuts` (When __shortcut is shown, e.g. "Control+D"). |
| `gds-menu__icon` | span | no | `gds-menu__item` | Leading icon (16px; 20px in --rich). Decorative. |
| `gds-menu__content` | span | no | `gds-menu__item` | Rich items only: stacks __label and __desc. |
| `gds-menu__label` | span | yes | `gds-menu__item` or `gds-menu__content` | Action name. One line, truncated with ellipsis. |
| `gds-menu__desc` | span | no | `gds-menu__content` | Second line in rich items. |
| `gds-menu__shortcut` | span | no | `gds-menu__item` | Keyboard shortcut hint on the right (e.g. Ctrl+D). |
| `gds-menu__trailing` | span | no | `gds-menu__item` | Trailing icon on the right, e.g. chevron-right for a submenu. |
| `gds-menu__divider` | div | no | `gds-menu` | 1px line between groups of items. Attributes: `role` (separator). |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-menu__item--danger` | `__item` | variant | Destructive action (Delete): red text and icon. |
| `gds-menu__item--disabled` | `__item` | state | Not available: faded (opacity), no pointer events. Also set aria-disabled="true". |
| `gds-menu__item--rich` | `__item` | layout | Two-line item: larger icon + __content with __label and __desc. |

**States:**
- **open / closed**: No class. The product toggles the hidden attribute (or wraps the menu in its own positioned layer) and sets aria-expanded on the trigger.
- **hover / focus**: Native :hover and :focus-visible on the item.
- **disabled item**: gds-menu__item--disabled + aria-disabled="true".

**Accessibility:**
- Container role="menu" with a name; items role="menuitem"; dividers role="separator".
- Trigger: <button> with aria-haspopup="menu", aria-expanded and aria-controls.
- Keyboard (product JS): Enter / Space / Arrow Down opens and focuses the first item; arrows move; Home / End jump; Escape closes and returns focus to the trigger.
- Items use roving tabindex (tabindex="-1", focus moved by JS). Disabled items stay focusable with aria-disabled="true" so people can find them.
- Icons are decorative: the label carries the meaning.

**Rules:**
- .gds-menu has role="menu" and an aria-label or aria-labelledby; every .gds-menu__item has role="menuitem". *Why:* Without roles a screen reader reads a pile of buttons with no menu context or arrow-key hint. (Accessible by default · auto-checkable)
- .gds-menu__item is a <button type="button">, never a <div> or <li>. *Why:* The item styles reset a button; other elements are not focusable or clickable by keyboard. (Accessible by default · auto-checkable)
- --disabled items have aria-disabled="true". *Why:* The class only fades the item; the attribute tells assistive tech it is unavailable. (Accessible by default · auto-checkable)
- An item with a chevron-right in __trailing has aria-haspopup="menu" and aria-expanded. *Why:* Announces that the item opens a submenu. (Accessible by default · auto-checkable)
- Use menu for actions, dropdown for choosing values. *Why:* Different semantics (menu vs listbox) and different keyboard models. (Reuse before you create)
- Put --danger items last, after a __divider. *Why:* Separating destructive actions avoids accidental clicks; red text alone is not enough. The action itself should still ask for confirmation (modal) before deleting. (Obvious over documented · auto-checkable)
- Within a menu, give every item an icon or none. *Why:* Mixed items make the labels start at different positions and look broken. (Obvious over documented · auto-checkable)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- No open state and no positioning, unlike gds-dropdown--open and gds-popover--open. Each product invents its own show / hide and placement. *Planned fix:* v3: show menus inside .gds-popover (role "menu" on the controller) and drop the menu's own surface.
- The menu draws its own background, border and shadow, so inside a .gds-popover or the calendar presets column it gets a second frame. *Planned fix:* Add a flat variant, or move the surface to .gds-popover.
- The menu uses the dropdown tokens (--dd-*) and has no component tokens of its own. *Planned fix:* Add _component-menu.scss tokens that alias the dropdown ones.
- --disabled uses opacity 0.4. The calendar dropped opacity for disabled days because it cut contrast to about 1.4:1. *Planned fix:* Use a muted text colour token for disabled items, like the calendar.
- --disabled sets pointer-events: none and the docs use the disabled attribute, which removes the item from keyboard focus. The ARIA menu pattern keeps disabled items focusable. *Planned fix:* Document aria-disabled without the disabled attribute; keep pointer-events: none only for the mouse.
- The focus ring is a box-shadow, which disappears in Windows forced-colours mode. *Planned fix:* Use outline (as the calendar does) or add a forced-colors fallback.
- __group is a sibling label, not a wrapper, so it cannot form an ARIA group; text directly inside role="menu" is not an allowed child. *Planned fix:* v3: add a __section wrapper with role="group" and aria-labelledby pointing to __group.
- text-align: left and margin-left are physical properties, so items do not mirror in right-to-left layouts. *Planned fix:* Use text-align: start and margin-inline-start.

*Generated from `components/menu.json`. Edit that file, then run `npm run brand`.*
