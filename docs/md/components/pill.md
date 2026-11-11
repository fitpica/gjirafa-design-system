# Pill (number count)

A small circle with a number: unread counts, items in a tab, or the number of a step.

**Use when:**
- Showing how many items are waiting: unread notifications, comments to review, failed uploads.
- A count next to a tab or menu label (Drafts 4).
- Numbering the steps of a short flow.

**Don't use when:**
- Words, statuses or labels (Published, On track) → use badge
- A count inside a badge or filter → use badge (gds-badge__count) or filter-badge
- A percentage change → use pct-badge
- Presence without a number → use status-dot

**Example: Unread notifications on the header bell**
```html
<button type="button" class="gds-btn-icon gds-btn-icon--ghost gds-btn-icon--md" aria-label="Notifications, 3 unread">
  <i data-lucide="bell"></i>
</button>
<span class="gds-pill gds-pill--sm gds-pill--dark gds-pill--critical" aria-hidden="true">3</span>
```

**Example: Count next to a list label**
```html
<span>Waiting for review</span>
<span class="gds-pill gds-pill--md gds-pill--warning">12</span>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-pill` | span | yes | top level | The circle. Its text is the number (one or two characters). Fixed width per size: longer text is clipped. Attributes: `aria-hidden` ("true" when nearby text already says the count; otherwise add visually hidden context, e.g. "3 unread notifications"). |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-pill--sm` | `gds-pill` | size | 16px. Next to icons (notification bell) and small labels. |
| `gds-pill--md` | `gds-pill` | size (default) | 20px. Tabs and menu items. Same as the base size. |
| `gds-pill--lg` | `gds-pill` | size | 24px. Step numbers. |
| `gds-pill--neutral` | `gds-pill` | variant (default) | Gray. Passive counts. Same as the base colour. |
| `gds-pill--critical` | `gds-pill` | variant | Red. Counts that need action: errors, failed items, urgent notifications. |
| `gds-pill--positive` | `gds-pill` | variant | Green. Completed steps or successful items. |
| `gds-pill--warning` | `gds-pill` | variant | Orange. Counts that need attention soon (items expiring, pending review). |
| `gds-pill--purple` | `gds-pill` | variant | Purple. Category counts with no status meaning. |
| `gds-pill--blank` | `gds-pill` | variant | No background, gray number. Upcoming steps. |
| `gds-pill--dark` | `gds-pill` | style | Solid fill with white text instead of the light tint. Combine with a tone (alone it is dark gray). Do not combine with --blank: dark overrides it. |

**Accessibility:**
- A number alone means nothing to a screen reader: either the visible label next to it says what is counted, or add visually hidden text such as "3 unread notifications".
- When the count changes live (new notifications), announce the change in a polite live region elsewhere, not on every pill.
- Do not show meaning by colour alone: the label or the step text must say it too.
- Light tones meet text contrast except warning (just under 4.5:1); dark tones do not (see knownIssues).

**Rules:**
- A .gds-pill contains a number of one or two characters (e.g. 3, 12, 9+). Never words. *Why:* The width is fixed, so longer text is cut off; words belong in a badge. (Reuse before you create · auto-checkable)
- Every pill sits next to text that says what is counted, or contains visually hidden text that does. *Why:* "3" alone does not tell anyone what there are three of. (Accessible by default)
- A .gds-pill is never a <button> or <a>; make the parent tab, menu item or button clickable instead. *Why:* Pills have no hover or focus styles, and a 16–24px target is too small. (Accessible by default · auto-checkable)
- A pill has at most one tone class; gds-pill--dark is not combined with gds-pill--blank. *Why:* Two tones give an undefined colour, and dark silently overrides blank. (Obvious over documented · auto-checkable)
- Use gds-pill--dark for counts that ask for action (unread, errors); use the light style for passive totals. *Why:* The solid fill pulls the eye; keep it for things people should act on. (Obvious over documented)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- Width is fixed per size and overflow is hidden, so three or more characters (100, 99+) are clipped. *Planned fix:* Use min-width plus horizontal padding instead of a fixed width.
- White text on the dark tones is below 4.5:1: warning about 2.5:1, purple and critical about 3.5:1, positive about 4:1. *Planned fix:* Use the 700 shades for dark backgrounds, or dark text on warning.
- Light warning (orange-700 on orange-50) is about 4.35:1, just under 4.5:1 for small text. *Planned fix:* Use orange-900 text, as the warning chip does.
- gds-pill--dark and gds-pill--blank have the same specificity and dark comes later, so blank + dark renders as dark gray. *Planned fix:* Scope --dark rules to exclude --blank, or document the pair as invalid (rule pill-one-tone).
- The name collides with gds-btn--pill and "pill shape" chips, which mean rounded corners, while this component is a number count. brand.md even shows text like "On Track" in a pill, which gets clipped. *Planned fix:* v3: rename to gds-count. Now: fix the brand.md example.

*Generated from `components/pill.json`. Edit that file, then run `npm run brand`.*
