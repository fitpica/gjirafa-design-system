# Tabs

A row (or column) of tabs that switches between panels of related content on the same page.

**Use when:**
- Splitting one object into views of the same level (e.g. an entry's Content, SEO, Media, History).
- Settings pages with a few sections, with --vertical.
- Switching a view mode of the same data, with --filled (e.g. Grid / List).

**Don't use when:**
- Moving between pages of the app (the URL changes) → use sidebar or navigation links with aria-current
- Steps that must be done in order → use stepper
- Filtering a list by a value → use chip or filter-badge
- More than about 7 sections, or content people need to compare side by side → use a single page with headings

**Example: Entry editor sections**
```html
<div class="gds-tabs" role="tablist" aria-label="Entry sections">
  <button type="button" class="gds-tab gds-tab--active" role="tab" id="tab-content" aria-selected="true" aria-controls="panel-content" tabindex="0"><span class="gds-tab__icon" aria-hidden="true"><i data-lucide="file-text"></i></span><span class="gds-tab__text">Content</span></button>
  <button type="button" class="gds-tab" role="tab" id="tab-seo" aria-selected="false" aria-controls="panel-seo" tabindex="-1"><span class="gds-tab__icon" aria-hidden="true"><i data-lucide="search"></i></span><span class="gds-tab__text">SEO</span></button>
  <button type="button" class="gds-tab" role="tab" id="tab-comments" aria-selected="false" aria-controls="panel-comments" tabindex="-1"><span class="gds-tab__text">Comments</span><span class="gds-tab__badge"><span class="gds-badge gds-badge--sm gds-badge--info"><span class="gds-badge__label">12</span></span></span></button>
  <button type="button" class="gds-tab gds-tab--disabled" role="tab" id="tab-history" aria-selected="false" aria-controls="panel-history" aria-disabled="true" tabindex="-1"><span class="gds-tab__text">History</span></button>
</div>
<div role="tabpanel" id="panel-content" aria-labelledby="tab-content" tabindex="0">…</div>
<div role="tabpanel" id="panel-seo" aria-labelledby="tab-seo" tabindex="0" hidden>…</div>
<div role="tabpanel" id="panel-comments" aria-labelledby="tab-comments" tabindex="0" hidden>…</div>
<div role="tabpanel" id="panel-history" aria-labelledby="tab-history" tabindex="0" hidden>…</div>
```

**Example: Media library view switch (filled, icon only)**
```html
<div class="gds-tabs gds-tabs--filled gds-tabs--sm" role="tablist" aria-label="Media view">
  <button type="button" class="gds-tab gds-tab--icon-only gds-tab--active" role="tab" id="view-grid" aria-label="Grid" aria-selected="true" aria-controls="media-grid" tabindex="0"><span class="gds-tab__icon" aria-hidden="true"><i data-lucide="layout-grid"></i></span></button>
  <button type="button" class="gds-tab gds-tab--icon-only" role="tab" id="view-list" aria-label="List" aria-selected="false" aria-controls="media-list" tabindex="-1"><span class="gds-tab__icon" aria-hidden="true"><i data-lucide="list"></i></span></button>
</div>
<div role="tabpanel" id="media-grid" aria-labelledby="view-grid">…</div>
<div role="tabpanel" id="media-list" aria-labelledby="view-list" hidden>…</div>
```

**Example: Vertical settings tabs with a status dot**
```html
<div class="gds-tabs gds-tabs--vertical" role="tablist" aria-label="Site settings" aria-orientation="vertical" style="width:var(--tab-vertical-width)">
  <button type="button" class="gds-tab gds-tab--active" role="tab" id="set-general" aria-selected="true" aria-controls="set-general-panel" tabindex="0"><span class="gds-tab__icon" aria-hidden="true"><i data-lucide="settings"></i></span><span class="gds-tab__text">General</span></button>
  <button type="button" class="gds-tab" role="tab" id="set-ads" aria-selected="false" aria-controls="set-ads-panel" tabindex="-1"><span class="gds-tab__icon" aria-hidden="true"><i data-lucide="megaphone"></i></span><span class="gds-tab__text">Ads</span><span class="gds-tab__status"></span><span class="gds-sr-only">new</span></button>
</div>
<div role="tabpanel" id="set-general-panel" aria-labelledby="set-general" tabindex="0">…</div>
<div role="tabpanel" id="set-ads-panel" aria-labelledby="set-ads" tabindex="0" hidden>…</div>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-tabs-wrap` | div | no | top level | Optional wrapper around a scrolling .gds-tabs. Shows fade edges when the fade modifiers are set by JS. |
| `gds-tabs` | div | yes | top level | The tab list. Horizontal with a bottom border by default; scrolls sideways when it overflows. Attributes: `role` (tablist), `aria-label` (What the tabs switch between, e.g. "Entry sections"), `aria-orientation` ("vertical" with gds-tabs--vertical). |
| `gds-tab` | button | yes, repeats | `gds-tabs` | One tab. A <button> (the CSS resets its button styles). Attributes: `type` (button), `role` (tab), `id` (Referenced by the panel's aria-labelledby), `aria-selected` ("true" on the active tab, "false" on the others), `aria-controls` (id of the tab panel), `tabindex` (0 on the active tab, -1 on the others (arrow keys move focus)), `aria-label` (Required on --icon-only tabs). |
| `gds-tab__icon` | span | no | `gds-tab` | Leading icon slot. Holds a Lucide <i>. Decorative. Attributes: `aria-hidden` (true). |
| `gds-tab__text` | span | no | `gds-tab` | Tab label. Required unless the tab is --icon-only. |
| `gds-tab__badge` | span | no | `gds-tab` | Slot for a small gds-badge (e.g. a count) after the label. |
| `gds-tab__status` | span | no | `gds-tab` | Red dot that means "something new". Add hidden text for screen readers next to it. |
| `gds-tab__close` | button | no | `gds-tab` | Close button for closable tabs (12px Lucide x). See known issues: a button inside a tab is a nested control. Attributes: `type` (button), `aria-label` ("Close <tab name>"). |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-tabs--filled` | `s` | variant | Segmented look: grey track, the active tab is a filled pill. Good for view switches. |
| `gds-tabs--card` | `s` | variant | Folder-tab look: the active tab joins the panel below. |
| `gds-tabs--vertical` | `s` | layout | Tabs in a column with a left indicator. Set the width (e.g. var(--tab-vertical-width)) and aria-orientation="vertical". |
| `gds-tabs--sm` | `s` | size | Smaller tabs and text. Without it tabs are the normal size. |
| `gds-tab--active` | `gds-tab` | state | The selected tab. Always with aria-selected="true". |
| `gds-tab--disabled` | `gds-tab` | state | Dimmed and blocks the mouse. Also set aria-disabled="true" (keyboard can still reach it). |
| `gds-tab--icon-only` | `gds-tab` | content | Tab with only an icon, no gap. Needs aria-label on the tab. |
| `gds-tabs-wrap--fade-left` | `s-wrap` | state | Shows the left fade. Set by JS when the list is scrolled away from the start. |
| `gds-tabs-wrap--fade-right` | `s-wrap` | state | Shows the right fade. Set by JS when more tabs are hidden on the right. |

**States:**
- **selected**: gds-tab--active + aria-selected="true" + tabindex="0"; its panel is visible, the other panels have the hidden attribute.
- **hover**: Native :hover darkens the label and icon.
- **focus**: Native :focus-visible: thicker indicator in the focus colour (bordered, vertical), inset outline (filled, card).
- **disabled**: gds-tab--disabled + aria-disabled="true".

**Accessibility:**
- Use the WAI-ARIA tabs pattern: role="tablist" on .gds-tabs, role="tab" on each .gds-tab, role="tabpanel" on each panel.
- Each tab has aria-selected and aria-controls; each panel has an id and aria-labelledby pointing back at its tab, plus tabindex="0" when it has no focusable content.
- Keyboard: Tab enters the list on the active tab; Left/Right (Up/Down when vertical) move between tabs; Home/End go to the first/last. The CSS does not do this; the product JS must.
- Hide inactive panels with the hidden attribute so they are not read.
- The status dot is colour only: add <span class="gds-sr-only">new</span> next to it.

**Rules:**
- .gds-tabs has role="tablist" and every .gds-tab has role="tab". *Why:* Without the roles, screen readers announce a row of unrelated buttons and the selected tab is not known. (Accessible by default · auto-checkable)
- Exactly one .gds-tab has gds-tab--active, and it is the only tab with aria-selected="true". *Why:* The class draws the selection, the attribute announces it; they must agree. (Accessible by default · auto-checkable)
- Every .gds-tab has aria-controls pointing to an element with role="tabpanel". *Why:* Links each tab to the content it shows. (Accessible by default · auto-checkable)
- A gds-tab--icon-only tab has an aria-label. *Why:* An icon alone has no accessible name. (Accessible by default · auto-checkable)
- Do not use tabs to link to other pages; use navigation with links and aria-current. *Why:* Tabs switch content in place; pages change the URL and need real links. (Obvious over documented)
- A .gds-tabs has at most one of --filled and --card. *Why:* The two looks override each other. (Obvious over documented · auto-checkable)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- The docs build tabs as <nav> with plain buttons: no role="tablist"/"tab", no aria-selected, no panels. *Planned fix:* Update all docs examples to the ARIA tabs pattern in this contract.
- The closable tab in the docs is a <div class="gds-tab"> with a button inside. As role="tab" this is a nested control, and the div is not focusable. .gds-tab__close also has no :focus-visible style. *Planned fix:* Support Delete to close on the focused tab and make the close button tabindex="-1", or move the close button outside the tab element; add a focus style to __close.
- --active and --disabled are classes only; nothing ties them to aria-selected / aria-disabled. --disabled uses pointer-events: none, so keyboard users can still activate it. *Planned fix:* v3: style from [aria-selected="true"] and [aria-disabled="true"].
- In --vertical the active tab text uses the hover colour (text-primary) while the other variants use action-primary. *Planned fix:* Confirm with design; if not intended, use --tab-color-active in vertical too.
- .gds-tabs-wrap and its fade modifiers are not shown in the docs and need JS that GDS does not ship. *Planned fix:* Add a docs example with the small scroll script, or remove the wrapper.
- --vertical combined with --filled or --card is not designed; the styles mix. *Planned fix:* Document as unsupported, or add a check.

*Generated from `components/tabs.json`. Edit that file, then run `npm run brand`.*
