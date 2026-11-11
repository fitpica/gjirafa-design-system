# Card

A container that groups related content and actions, with optional media, header, body and footer.

**Use when:**
- Grouping one object's summary and actions on a dashboard (e.g. an article, a report, a video).
- A grid of items people open, with --interactive (e.g. a media library).
- Picking one option from a few rich choices, with --selected (e.g. a plan or layout picker).

**Don't use when:**
- Many items with the same fields that people compare or sort → use table
- A message that needs attention (success, error, warning) → use alert or toast
- Content that blocks the page until the user acts → use modal
- Only adding space or a border around a section of a form → use a plain layout container, no card

**Example: Article summary with actions**
```html
<article class="gds-card">
  <div class="gds-card__header">
    <h3 class="gds-card__title">Weekly traffic report</h3>
    <p class="gds-card__subtitle">Updated today at 09:00</p>
  </div>
  <div class="gds-card__body">
    <p class="gds-text-body-sm">Page views are up 12% on last week. Sports and Politics drove most of the growth.</p>
  </div>
  <div class="gds-card__footer">
    <button class="gds-btn gds-btn--secondary gds-btn--sm"><span class="gds-btn__label">Dismiss</span></button>
    <button class="gds-btn gds-btn--primary gds-btn--sm"><span class="gds-btn__label">Open report</span></button>
  </div>
</article>
```

**Example: Interactive media card (whole card is a link)**
```html
<a href="/videos/4821" class="gds-card gds-card--interactive">
  <img class="gds-card__media" src="/thumbs/4821.jpg" alt="" />
  <div class="gds-card__header">
    <h3 class="gds-card__title">Election night highlights</h3>
    <p class="gds-card__subtitle">Video · 4:12 · 2 hours ago</p>
  </div>
</a>
```

**Example: Selected option in a layout picker**
```html
<div role="radiogroup" aria-label="Homepage layout">
  <div class="gds-card gds-card--interactive gds-card--selected gds-card--padded-sm" role="radio" aria-checked="true" tabindex="0">
    <div class="gds-card__header">
      <h3 class="gds-card__title">Hero + grid</h3>
      <p class="gds-card__subtitle">One lead story, six below</p>
    </div>
  </div>
  <div class="gds-card gds-card--interactive gds-card--padded-sm" role="radio" aria-checked="false" tabindex="-1">
    <div class="gds-card__header">
      <h3 class="gds-card__title">River</h3>
      <p class="gds-card__subtitle">Newest stories in one column</p>
    </div>
  </div>
</div>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-card` | article \| div \| a | yes | top level | Wrapper. <article> for a self-contained item, <div> for a panel, <a href> when the whole card opens something (with --interactive). Attributes: `href` (Only on <a>, when the whole card is a link). |
| `gds-card__media` | img \| video \| div | no | `gds-card` | Full-bleed image or video at the top, no padding. Put it first. Attributes: `alt` (On <img>: describe the image, or alt="" if the title already says it all). |
| `gds-card__header` | div \| header | no | `gds-card` | Title and subtitle. Draws a separator below when something follows. |
| `gds-card__title` | h2 \| h3 \| h4 | yes | `gds-card__header` | Card heading. Pick the level that fits the page outline, not the look. |
| `gds-card__subtitle` | p | no | `gds-card__header` | Secondary line under the title (12px, text-secondary). |
| `gds-card__body` | div | no | `gds-card` | Main content. Grows to fill the card height. |
| `gds-card__footer` | div \| footer | no | `gds-card` | Action row, right-aligned. Draws a separator above when something precedes it. |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-card--elevated` | `gds-card` | variant | No border, stronger shadow. Use for cards that float above a grey page. |
| `gds-card--flat` | `gds-card` | variant | No border, no shadow, background only. Use for nested or quiet panels. |
| `gds-card--interactive` | `gds-card` | style | Pointer cursor, lift and shadow on hover, focus ring on :focus-visible. Use on an <a href> (or a focusable element that opens something). |
| `gds-card--padded-none` | `gds-card` | size | 0 padding in header, body and footer. |
| `gds-card--padded-sm` | `gds-card` | size | 12px padding. |
| `gds-card--padded-lg` | `gds-card` | size | 24px padding. Without a padding class the card uses 16px. |
| `gds-card--selected` | `gds-card` | state | Inset ring in the focus colour to show the chosen card in a picker. Pair it with a real selected state (aria-checked, aria-pressed or a checked radio). |
| `gds-card--disabled` | `gds-card` | state | Dimmed, blocks pointer events and cancels the interactive hover. Does not block the keyboard: also remove href or set aria-disabled and tabindex="-1". |

**States:**
- **hover**: Native :hover on gds-card--interactive (lift + shadow). Turned off by prefers-reduced-motion.
- **focus**: Native :focus-visible on gds-card--interactive draws a 2px focus ring.
- **selected**: gds-card--selected + aria-checked/aria-pressed or a checked radio inside.
- **disabled**: gds-card--disabled + no href (or aria-disabled="true" and tabindex="-1").

**Accessibility:**
- An interactive card is one link or button. Do not put other buttons or links inside it.
- The card title is a real heading, so people can jump between cards with a screen reader.
- --selected and --disabled are only visual: expose the same state with an attribute.
- Give images alt text, or alt="" when they only repeat the title.

**Rules:**
- .gds-card__title is an <h2>–<h4>, never a <div> or <span>. *Why:* Screen reader users move through a card grid by headings. (Accessible by default · auto-checkable)
- A .gds-card--interactive card contains no <button>, <a> or form control. *Why:* A clickable inside a clickable is a nested interactive element: keyboard and screen readers cannot reach it reliably, and clicks fire twice. (Accessible by default · auto-checkable)
- .gds-card--interactive is on an <a href>, a <button>, or an element with tabindex="0" and a role. *Why:* Hover alone is not an interaction; keyboard users need to reach and open the card. (Accessible by default · auto-checkable)
- .gds-card--selected comes with aria-checked="true", aria-pressed="true", or a checked radio inside the card. *Why:* The ring only shows the choice to sighted users. (Accessible by default · auto-checkable)
- Footer actions use gds-btn, at most one primary, with the primary on the right. *Why:* Same action order as modals and forms across the product. (Reuse before you create)
- Do not build a list of many same-shaped records out of cards; use a table. *Why:* Tables can be scanned, sorted and selected in bulk; card grids cannot. (Reuse before you create)

**Do not use** (exist in the CSS for docs only):
- `is-hover-preview`: Docs and screenshot tests only: freezes the hover look of --interactive.
- `is-focus-preview`: Docs and screenshot tests only: freezes the focus ring of --interactive.

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- Subtitle colour is now text-secondary (6.96:1, was 2.96:1 and failed AA). Older screenshots, Figma and brand.md may still show the lighter grey. *Planned fix:* Update Figma and brand.md to text-secondary; keep the contrast note in the token file.
- A card with header and footer but no body draws two separators (header border-bottom + footer border-top), a 2px line. *Planned fix:* Draw only one: e.g. .gds-card__header + .gds-card__footer { border-top: 0; }.
- An <a class="gds-card gds-card--interactive"> keeps link underline and colour; the docs fix it with inline style="display:block;text-decoration:none". *Planned fix:* Add text-decoration: none; color: inherit; to .gds-card--interactive and drop the inline styles from the docs.
- --disabled only blocks the mouse (pointer-events: none). A disabled link card can still be focused and opened with Enter. *Planned fix:* Document removing href / tabindex="-1"; v3: also style [aria-disabled="true"].
- --selected uses the same colour and width as the focus ring, so a selected card looks focused and focus on it is hard to see. *Planned fix:* Give selected its own token (e.g. border-brand + check icon) different from border-focus.

*Generated from `components/card.json`. Edit that file, then run `npm run brand`.*
