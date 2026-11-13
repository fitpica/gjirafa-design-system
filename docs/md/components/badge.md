# Badge

A small label that shows the status or category of something.

**Use when:**
- Showing a status in a table cell or card (Published, Draft…).
- Labelling a category or count next to an item.

**Don't use when:**
- Something people can click to filter or remove → use chip or filter-badge
- A percentage change → use pct-badge

**Example: Content statuses**
```html
<span class="gds-badge gds-badge--positive"><span class="gds-badge__dot"></span><span class="gds-badge__label">Published</span></span>
<span class="gds-badge gds-badge--neutral"><span class="gds-badge__dot"></span><span class="gds-badge__label">Draft</span></span>
<span class="gds-badge gds-badge--warning"><span class="gds-badge__dot"></span><span class="gds-badge__label">Scheduled</span></span>
<span class="gds-badge gds-badge--neutral"><span class="gds-badge__dot"></span><span class="gds-badge__label">Archived</span></span>
```

**Example: With icon and count**
```html
<span class="gds-badge gds-badge--neutral"><span class="gds-badge__icon"><i data-lucide="minus-circle" width="12" height="12"></i></span><span class="gds-badge__label">Neutral</span><span class="gds-badge__count">12</span></span>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-badge` | span | yes | top level | Wrapper. |
| `gds-badge__dot` | span | no | `gds-badge` | Coloured dot. Use for statuses. |
| `gds-badge__icon` | span | no | `gds-badge` | Icon slot (Lucide, 12px), instead of the dot. |
| `gds-badge__label` | span | yes | `gds-badge` | The text. |
| `gds-badge__count` | span | no | `gds-badge` | Number after the label. |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-badge--neutral` | `gds-badge` | variant | Gray. |
| `gds-badge--positive` | `gds-badge` | variant | Green. |
| `gds-badge--warning` | `gds-badge` | variant | Orange. |
| `gds-badge--critical` | `gds-badge` | variant | Red. |
| `gds-badge--info` | `gds-badge` | variant | Blue. |
| `gds-badge--purple` | `gds-badge` | variant | Purple. Categories only, no status meaning. |
| `gds-badge--outline` | `gds-badge` | style | Outlined instead of filled. |
| `gds-badge--solid` | `gds-badge` | style | Strong solid fill, for high emphasis. |
| `gds-badge--text` | `gds-badge` | style | Text only, no background. |
| `gds-badge--sm` | `gds-badge` | size | Small. |
| `gds-badge--md` | `gds-badge` | size (default) | Medium. |
| `gds-badge--lg` | `gds-badge` | size | Large. |

**Accessibility:**
- Never show status by colour alone: always include .gds-badge__label text.
- The dot and icon are decorative; the label carries the meaning.

**Rules:**
- Content status mapping: Published → positive, Draft → neutral, Scheduled → warning, Archived → neutral, Edited → info, Unpublished → neutral, Deleted → critical. *Why:* Design decisions (11 and 13 Nov 2026). Scheduled changes state on its own and Edited has unpublished changes, so both draw attention; Draft, Archived and Unpublished need no action; Deleted is a loss. (Reuse before you create · auto-checkable)
- Status badges use the dot + label form. *Why:* Status is not shown by colour alone. (Accessible by default · auto-checkable)
- A badge has exactly one colour variant. *Why:* Two variants on one badge produce an undefined colour. (Obvious over documented · auto-checkable)
- A badge is never a button or link. *Why:* Badges have no hover or focus styles. (Accessible by default · auto-checkable)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- Without a variant class the badge has no defined colour. *Planned fix:* v3: neutral by default, so the variant becomes optional.

*Generated from `components/badge.json`. Edit that file, then run `npm run brand`.*
