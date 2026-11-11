---
name: gds-pct-badge
description: "GDS Percentage badge contract: exact markup, anatomy, modifiers, accessibility and rules for gds-pct-badge*. A pill that shows how much a metric changed, with an arrow for the direction and a colour for good or bad. Load before writing or editing percentage badge markup with GDS."
---

# Percentage badge

A pill that shows how much a metric changed, with an arrow for the direction and a colour for good or bad.

**Use when:**
- Next to a metric on a dashboard or stat card to show change against a previous period (e.g. Page views 1.2M, +12.5%).
- In a table column that compares periods (e.g. traffic change per article).

**Don't use when:**
- A status or category (Published, Draft, Sports) → use badge
- A plain count with no comparison → use badge with __count, or plain text
- Something people can click or remove → use chip

**Example: Increase that is good (page views)**
```html
<span class="gds-pct-badge gds-pct-badge--positive">
  <i data-lucide="arrow-up" class="gds-pct-badge__icon" aria-hidden="true"></i>
  <span class="gds-pct-badge__value"><span class="gds-sr-only">Up </span>12.5%</span>
</span>
```

**Example: Increase that is bad (bounce rate)**
```html
<span class="gds-pct-badge gds-pct-badge--critical">
  <i data-lucide="arrow-up" class="gds-pct-badge__icon" aria-hidden="true"></i>
  <span class="gds-pct-badge__value"><span class="gds-sr-only">Up </span>4.2%</span>
</span>
```

**Example: No change**
```html
<span class="gds-pct-badge gds-pct-badge--neutral">
  <span class="gds-pct-badge__value">0%</span>
</span>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-pct-badge` | span | yes | top level | Wrapper pill. Neutral grey unless a tone modifier is set. |
| `gds-pct-badge__icon` | i | no | `gds-pct-badge` | Direction arrow: Lucide arrow-up (increase) or arrow-down (decrease). Decorative. Attributes: `data-lucide` ("arrow-up" or "arrow-down"), `aria-hidden` (true). |
| `gds-pct-badge__value` | span | yes | `gds-pct-badge` | The change, e.g. "12.5%". Add the direction as hidden text for screen readers (gds-sr-only). |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-pct-badge--positive` | `gds-pct-badge` | variant | Green. The change is good. |
| `gds-pct-badge--warning` | `gds-pct-badge` | variant | Orange. The change needs watching. |
| `gds-pct-badge--critical` | `gds-pct-badge` | variant | Red. The change is bad. |
| `gds-pct-badge--neutral` | `gds-pct-badge` | variant (default) | Grey. No change, or the change has no good/bad meaning. Same as the bare class. |

**Accessibility:**
- The arrow and colour are visual only. Put the direction in text: <span class="gds-sr-only">increase of</span> before the value, or write the sign (+12.5% / −3.1%).
- Hide the arrow icon with aria-hidden="true".
- Say what the change compares to near the badge (e.g. "vs last week").

**Rules:**
- The direction is in text (sr-only text or a +/− sign), not only in the arrow. *Why:* Screen readers would read "12.5%" with no idea whether it went up or down. (Accessible by default · auto-checkable)
- Pick the tone by whether the change is good or bad, not by the arrow: bounce rate up is critical, page views up is positive. *Why:* Red and green carry meaning; tying them to the arrow gives wrong signals for metrics where lower is better. (Obvious over documented)
- arrow-up only with a positive change and arrow-down only with a negative one; a 0% change uses no arrow (or minus) and --neutral. *Why:* An arrow that disagrees with the number is misleading. (Obvious over documented)
- A pct-badge has at most one tone modifier. *Why:* Two tones produce an undefined colour. (Obvious over documented · auto-checkable)
- Use pct-badge only for numeric change; statuses and categories use gds-badge. *Why:* One meaning per component keeps dashboards readable. (Reuse before you create · auto-checkable)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- The SCSS header lists --up and --down direction classes that do not exist; direction is set only by the icon. *Planned fix:* Remove them from the comment, or add them and let CSS draw the arrow so the icon cannot disagree.
- There is no size option (fixed 26px high, 14px text), so the badge is too big for dense table rows. *Planned fix:* Add --sm matching gds-badge--sm if tables need it.
- The docs show only the arrow for direction, with no text alternative. *Planned fix:* Add gds-sr-only direction text to the docs examples.

*Generated from `components/pct-badge.json`. Edit that file, then run `npm run brand`.*
