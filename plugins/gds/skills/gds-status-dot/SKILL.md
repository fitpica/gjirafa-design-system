---
name: gds-status-dot
description: "GDS Status dot contract: exact markup, anatomy, modifiers, accessibility and rules for gds-status-dot*. A small coloured dot that shows someone's presence (online, away, busy, offline), always next to text or with a label. Load before writing or editing status dot markup with GDS."
---

# Status dot

A small coloured dot that shows someone's presence (online, away, busy, offline), always next to text or with a label.

**Use when:**
- Showing whether a person is online, away, busy or offline in a list of users or collaborators.
- Live presence of editors on an entry (who is editing now).

**Don't use when:**
- The status of content (Published, Draft, Scheduled) → use badge with .gds-badge__dot
- Online status on a photo avatar → use avatar (.gds-avatar__status) for online; see knownIssues for other states
- A count → use pill

**Example: Editors currently on an entry**
```html
<span class="gds-status-dot gds-status-dot--online" aria-hidden="true"></span>
<span>Arta Berisha · Editing now</span>
<span class="gds-status-dot gds-status-dot--away" aria-hidden="true"></span>
<span>Dren Hoxha · Away</span>
```

**Example: Dot without visible text**
```html
<span class="gds-status-dot gds-status-dot--busy gds-status-dot--lg gds-status-dot--ring" role="img" aria-label="Busy"></span>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-status-dot` | span | yes | top level | The dot. Empty element; 8px gray (offline) by default. Place it before a text label. Attributes: `aria-hidden` ("true" when the status is written in text next to it), `role` ("img" when there is no text next to it), `aria-label` (With role="img": the status, e.g. "Away"). |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-status-dot--sm` | `gds-status-dot` | size | 6px. Dense lists and small avatars. |
| `gds-status-dot--md` | `gds-status-dot` | size (default) | 8px. Same as the base size. |
| `gds-status-dot--lg` | `gds-status-dot` | size | 10px. |
| `gds-status-dot--xl` | `gds-status-dot` | size | 12px. Large avatars and profile headers. |
| `gds-status-dot--online` | `gds-status-dot` | variant | Green. Active now. |
| `gds-status-dot--offline` | `gds-status-dot` | variant (default) | Gray. Not active. Same as the base colour. |
| `gds-status-dot--busy` | `gds-status-dot` | variant | Red. Do not disturb. |
| `gds-status-dot--away` | `gds-status-dot` | variant | Orange. Idle or away. |
| `gds-status-dot--info` | `gds-status-dot` | variant | Blue. Not a presence state; use only for a custom state you name in text. |
| `gds-status-dot--purple` | `gds-status-dot` | variant | Purple. Not a presence state; use only for a custom state you name in text. |
| `gds-status-dot--ring` | `gds-status-dot` | style | Adds a white ring (outside the dot) so it stays visible on photos and coloured backgrounds. |

**Accessibility:**
- A dot is colour only. Write the status in text next to it (and hide the dot with aria-hidden="true"), or give it role="img" and aria-label.
- aria-label on a plain <span> is ignored by most screen readers; it needs role="img".
- Offline and away dots are below 3:1 against white (see knownIssues), so text next to them matters even more.

**Rules:**
- Every .gds-status-dot either has aria-hidden="true" with the status written next to it, or has role="img" and an aria-label. *Why:* Colour alone does not reach colour-blind or screen-reader users. (Accessible by default · auto-checkable)
- A status dot has exactly one state class, even for offline. *Why:* Writing the state makes the markup readable and avoids two colours fighting. (Obvious over documented · auto-checkable)
- Use status dots for people's presence. For content or process status use a badge with a dot. *Why:* Badges carry a label and the agreed content-status colours; dots do not. (Reuse before you create)
- Add gds-status-dot--ring when the dot sits on a photo, avatar or coloured surface. *Why:* Without the ring the dot blends into the image. (Obvious over documented)
- A status dot is never a <button> or <a> and never the only content of one. *Why:* At 6–12px it is far too small to hit and has no focus style. (Accessible by default · auto-checkable)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- Offline (neutral-80) is about 3:1 and away (orange-500) about 2.5:1 against white, below the 3:1 needed for meaningful graphics. *Planned fix:* Darken the offline and away tokens, or always require text (rule status-dot-labelled).
- info and purple are not presence states, so the set mixes presence and decoration. *Planned fix:* v3: keep online/away/busy/offline; move other colours to badge dots.
- Avatars have their own .gds-avatar__status that is always green; a status-dot cannot be placed in the avatar corner without custom CSS. *Planned fix:* Allow .gds-status-dot--ring inside .gds-avatar in the status position and deprecate __status.
- brand.md calls away "yellow"; the token is orange-500. *Planned fix:* Update brand.md.

*Generated from `components/status-dot.json`. Edit that file, then run `npm run brand`.*
