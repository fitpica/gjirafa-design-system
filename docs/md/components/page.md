# Page layout and page header

The frame of a product screen: page background, padding and spacing, and the header with the page title and its main actions.

**Use when:**
- Every full screen in a product (lists, forms, settings).
- A screen needs a title and one main action such as "New entry".

**Don't use when:**
- Content inside a modal or side panel → use the modal or side panel header
- A small section inside a page → use a card header or gds-page__section

**Example: List page header**
```html
<main class="gds-page">
  <header class="gds-page-header">
    <div class="gds-page-header__text">
      <h1 class="gds-page-header__title">All Entries</h1>
      <p class="gds-page-header__desc">124 entries</p>
    </div>
    <div class="gds-page-header__actions">
      <button type="button" class="gds-btn gds-btn--secondary gds-btn--md"><span class="gds-btn__label">Import</span></button>
      <button type="button" class="gds-btn gds-btn--primary gds-btn--md"><i data-lucide="plus" class="gds-btn__icon"></i><span class="gds-btn__label">New entry</span></button>
    </div>
  </header>
</main>
```

**Example: Narrow form page**
```html
<main class="gds-page gds-page--narrow">
  <header class="gds-page-header">
    <div class="gds-page-header__text">
      <nav class="gds-page-header__breadcrumb" aria-label="Breadcrumb">Entries / Edit</nav>
      <h1 class="gds-page-header__title">Edit entry</h1>
    </div>
  </header>
  <section class="gds-page__section" aria-label="Entry details"></section>
</main>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-page` | main | yes | top level | The page frame: light grey background, padding, vertical gap between its children. White surfaces (table, cards) sit on it. |
| `gds-page-header` | header | no | `gds-page` | Title on the left, actions on the right. Wraps on narrow screens. |
| `gds-page-header__text` | div | yes | `gds-page-header` | Stacks breadcrumb, title and description. |
| `gds-page-header__breadcrumb` | nav | no | `gds-page-header__text` | Optional breadcrumb above the title. Attributes: `aria-label` (Breadcrumb). |
| `gds-page-header__title` | h1 | yes | `gds-page-header__text` | The page title. One <h1> per page. 24px semibold. |
| `gds-page-header__desc` | p | no | `gds-page-header__text` | Optional short description or count, e.g. "124 entries". |
| `gds-page-header__actions` | div | no | `gds-page-header` | Buttons for the page. At most one primary, plus up to two others; put more in a menu. |
| `gds-page__section` | section | no, repeats | `gds-page` | Groups related blocks with a smaller gap, e.g. bulk bar + table + pagination. |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-page--narrow` | `gds-page` | width | Centres the page at 640px max. Use for forms and settings. |

**Accessibility:**
- Use <main> for gds-page and exactly one <h1> (the page title).
- Give a breadcrumb <nav> an aria-label.
- If a section has no visible heading, give it aria-label.

**Rules:**
- A page has exactly one gds-page-header__title and it is an <h1>. *Why:* Screen reader users jump to the h1 to know where they are. (Accessible by default · auto-checkable)
- gds-page-header__actions contains at most one gds-btn--primary. *Why:* One clear main action per screen. (Obvious over documented · auto-checkable)
- Use gds-page, gds-page-header and gds-filter-bar for page layout instead of product CSS. *Why:* These were the most common custom CSS in AI tests; they now exist in GDS. (Reuse before you create)
- Forms and settings pages use gds-page--narrow; lists and tables use the full width. *Why:* Long lines of form fields are hard to scan; tables need the width. (Obvious over documented)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- No docs page yet; only this contract and the AI guide describe it. *Planned fix:* Add a Page patterns page to the docs site.
- gds-page uses min-height: 100%, so the grey background only fills the viewport when html and body have height: 100% (or the app shell gives the page a height). *Planned fix:* Document html, body { height: 100% } in Setup, or use min-height: 100dvh when the page is the whole viewport.

*Generated from `components/page.json`. Edit that file, then run `npm run brand`.*
