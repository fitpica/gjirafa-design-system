---
name: gds-skeleton
description: "GDS Skeleton contract: exact markup, anatomy, modifiers, accessibility and rules for gds-skeleton*. Grey shimmering shapes that stand in for content while it loads, so the layout does not jump. Load before writing or editing skeleton markup with GDS."
---

# Skeleton

Grey shimmering shapes that stand in for content while it loads, so the layout does not jump.

**Use when:**
- First load of a page or card whose layout is known (article list, profile header, dashboard card).
- Loading takes long enough to notice (about 300ms or more).

**Don't use when:**
- A table is loading → use table with gds-table--loading and gds-table__skeleton
- An action the user just triggered (save, upload, publish) → use button loading state or a spinner
- The layout of the result is unknown or loading is very short → use spinner, or nothing
- There is no data (not loading) → use empty state

**Example: Article list item loading**
```html
<div aria-busy="true">
  <span class="gds-sr-only">Loading articles</span>
  <div class="gds-skeleton-group gds-skeleton-group--row" aria-hidden="true">
    <div class="gds-skeleton gds-skeleton--avatar-lg"></div>
    <div class="gds-skeleton-group">
      <div class="gds-skeleton gds-skeleton--text gds-skeleton--text-xl gds-skeleton--w-50"></div>
      <div class="gds-skeleton gds-skeleton--text"></div>
      <div class="gds-skeleton gds-skeleton--text gds-skeleton--w-75"></div>
    </div>
  </div>
</div>
```

**Example: Card with image loading**
```html
<article class="gds-card" aria-busy="true">
  <span class="gds-sr-only">Loading video</span>
  <div class="gds-card__body">
    <div class="gds-skeleton-group" aria-hidden="true">
      <div class="gds-skeleton gds-skeleton--rect"></div>
      <div class="gds-skeleton gds-skeleton--text gds-skeleton--text-lg gds-skeleton--w-75"></div>
      <div class="gds-skeleton gds-skeleton--text gds-skeleton--w-25"></div>
    </div>
  </div>
</article>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-skeleton-group` | div | no | top level | Stacks skeletons in a column (or a row with --row) with the standard gap. Hide it from screen readers. Attributes: `aria-hidden` (true). |
| `gds-skeleton` | div \| span | yes, repeats | top level | One placeholder shape. Full width, rectangle by default. Use a shape modifier to say what it stands for. Attributes: `aria-hidden` (true (unless its group already has it)). |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-skeleton--text` | `gds-skeleton` | variant | A line of text: pill radius, body-sm height. |
| `gds-skeleton--rect` | `gds-skeleton` | variant (default) | Rectangle for an image or hero. Same as the bare class; write it for clarity. |
| `gds-skeleton--circle` | `gds-skeleton` | variant | Circle, avatar-md size unless you set width and height. |
| `gds-skeleton--row` | `gds-skeleton` | variant | Full-width bar at data-table row height. |
| `gds-skeleton--avatar-sm` | `gds-skeleton` | variant | Circle at avatar sm size. |
| `gds-skeleton--avatar-md` | `gds-skeleton` | variant | Circle at avatar md size. |
| `gds-skeleton--avatar-lg` | `gds-skeleton` | variant | Circle at avatar lg size. |
| `gds-skeleton--avatar-xl` | `gds-skeleton` | variant | Circle at avatar xl size. |
| `gds-skeleton--text-sm` | `gds-skeleton` | size | Text line height for small text. Sets only the height: add --text for the pill shape. Requires `gds-skeleton--text`. |
| `gds-skeleton--text-md` | `gds-skeleton` | size (default) | Body-sm line height (same as --text alone). Requires `gds-skeleton--text`. |
| `gds-skeleton--text-lg` | `gds-skeleton` | size | Large text line height. Requires `gds-skeleton--text`. |
| `gds-skeleton--text-xl` | `gds-skeleton` | size | Heading line height. Requires `gds-skeleton--text`. |
| `gds-skeleton--text-2xl` | `gds-skeleton` | size | Large heading line height. Requires `gds-skeleton--text`. |
| `gds-skeleton--w-25` | `gds-skeleton` | width | 25% width. |
| `gds-skeleton--w-50` | `gds-skeleton` | width | 50% width. |
| `gds-skeleton--w-75` | `gds-skeleton` | width | 75% width. Use on the last line of a paragraph. |
| `gds-skeleton-group--row` | `-group` | layout | Lays skeletons out in a row, vertically centred (e.g. avatar next to text lines). |

**States:**
- **loading**: Skeletons are shown; the region they sit in has aria-busy="true".
- **loaded**: Replace the skeletons with the real content and set aria-busy="false" (or remove it).
- **reduced motion**: prefers-reduced-motion stops the shimmer and shows a static, dimmed shape. Automatic.

**Accessibility:**
- Skeletons are decorative: aria-hidden="true" on the group or on each skeleton.
- Set aria-busy="true" on the region that is loading, and give it a short text for screen readers (e.g. <span class="gds-sr-only">Loading articles</span>).
- When loading ends, remove aria-busy so the new content is read.

**Rules:**
- Every .gds-skeleton has aria-hidden="true" itself or on an ancestor. *Why:* Otherwise screen readers find empty, meaningless elements. (Accessible by default · auto-checkable)
- Skeletons sit inside an element with aria-busy="true" that also contains loading text for screen readers. *Why:* Screen reader users must know the page is loading, not empty. (Accessible by default · auto-checkable)
- The skeleton copies the shape of the content it replaces: same number of lines, avatar size, image ratio. *Why:* The page should not jump when content arrives. (Obvious over documented)
- Do not use .gds-skeleton inside .gds-table; use gds-table--loading and gds-table__skeleton. *Why:* The table has its own loading pattern sized to its cells. (Reuse before you create · auto-checkable)
- A --text-sm/md/lg/xl/2xl line also has --text. *Why:* The size classes set only the height; without --text the line has square corners. (Obvious over documented · auto-checkable)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- --text-sm/lg/xl/2xl set only the height. Alone they give a square-cornered bar; the docs use --text-xl without --text. *Planned fix:* Move the pill radius into each --text-* class (or document the pair) and fix the docs examples.
- --row says it matches .gds-data-table rows, a class that no longer exists; the table also has its own gds-table__skeleton. *Planned fix:* Point --row at the gds-table row height, or remove it in favour of gds-table__skeleton.
- --rect is identical to the bare class, and --circle overlaps the --avatar-* presets. *Planned fix:* v3: keep one way: e.g. --circle + avatar size tokens, and drop --rect or make it the documented default.
- No helper for the screen-reader loading text; every product must remember aria-busy and an sr-only label. *Planned fix:* Document the pattern in the docs page and show it in every example.

*Generated from `components/skeleton.json`. Edit that file, then run `npm run brand`.*
