# Avatar

A photo, initials or icon that represents a person or an organisation, alone, stacked in a group or paired with a name.

**Use when:**
- Showing who wrote, edited or owns an entry or asset.
- Listing collaborators on an item (avatar group).
- A user or author cell in a table, paired with the name (avatar name).
- Representing an organisation, site or publication (square shape).

**Don't use when:**
- A removable person token in a field or filter → use chip with a .gds-avatar inside
- A presence indicator without a picture → use status-dot
- A thumbnail of an image or video asset → use a plain <img> in a card or table cell

**Example: Author cell in an entries table**
```html
<div class="gds-avatar-name gds-avatar-name--sm">
  <div class="gds-avatar gds-avatar--32">
    <img class="gds-avatar__img" src="/avatars/arta-berisha.jpg" alt="" />
  </div>
  <div class="gds-avatar-name__info">
    <span class="gds-avatar-name__label">Arta Berisha</span>
    <span class="gds-avatar-name__subtitle">Senior editor</span>
  </div>
</div>
```

**Example: Collaborators on an article**
```html
<div class="gds-avatar-group" role="group" aria-label="Collaborators: 6 people">
  <span class="gds-avatar-group__counter">+3</span>
  <div class="gds-avatar gds-avatar--32">
    <img class="gds-avatar__img" src="/avatars/dren-hoxha.jpg" alt="Dren Hoxha" />
  </div>
  <div class="gds-avatar gds-avatar--32" role="img" aria-label="Lirie Gashi">
    <span class="gds-avatar__text" aria-hidden="true">LG</span>
  </div>
  <div class="gds-avatar gds-avatar--32">
    <img class="gds-avatar__img" src="/avatars/arta-berisha.jpg" alt="Arta Berisha" />
  </div>
</div>
```

**Example: Publication with online editor**
```html
<div class="gds-avatar gds-avatar--40 gds-avatar--square" role="img" aria-label="City Desk">
  <span class="gds-avatar__icon"><i data-lucide="building-2"></i></span>
</div>
<div class="gds-avatar gds-avatar--40">
  <img class="gds-avatar__img" src="/avatars/dren-hoxha.jpg" alt="Dren Hoxha" />
  <span class="gds-avatar__status" role="img" aria-label="Online"></span>
</div>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-avatar-group` | div | no | top level | Overlapping stack of avatars. Uses row-reverse: the first child in the DOM appears on the right, in front. Attributes: `role` (group), `aria-label` (Who is shown, e.g. "Collaborators: 7 people"). |
| `gds-avatar-group__counter` | span | no | `gds-avatar-group` | "+N" for people not shown. Must be the FIRST child of the group so it appears last (on the right). Fixed at 32px. |
| `gds-avatar-name` | div | no | top level | Avatar + name pair. Contains one .gds-avatar followed by .gds-avatar-name__info. |
| `gds-avatar` | div \| span | yes | top level | The avatar circle or square. 32px circle by default. Contains exactly one of __img, __text or __icon, plus an optional __status. Can sit alone, in .gds-avatar-group, in .gds-avatar-name or in a chip. Attributes: `role` ("img" when it shows initials or an icon and no name is visible next to it), `aria-label` (The full name of the person or organisation). |
| `gds-avatar__img` | img | no | `gds-avatar` | Photo or logo, cropped to fill. Attributes: `alt` (Required. The name when the avatar stands alone; alt="" when the name is visible next to it). |
| `gds-avatar__text` | span | no | `gds-avatar` | Initials (one or two letters). Shown in upper case. Attributes: `aria-hidden` ("true"; the name comes from the avatar's aria-label or the visible name). |
| `gds-avatar__icon` | span | no | `gds-avatar` | Fallback icon when there is no photo or name: <i data-lucide="user"></i> for people, "building-2" for organisations. Size follows the avatar size. |
| `gds-avatar__status` | span | no | `gds-avatar` | Small green "online" dot in the bottom-right corner, with a white ring. Only one colour exists. Attributes: `role` (img), `aria-label` ("Online"). |
| `gds-avatar-name__info` | div | yes | `gds-avatar-name` | Text column next to the avatar. |
| `gds-avatar-name__label` | span | yes | `gds-avatar-name__info` | The name. Truncates with an ellipsis. |
| `gds-avatar-name__subtitle` | span | no | `gds-avatar-name__info` | Second line: role, email or team. Truncates with an ellipsis. |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-avatar--16` | `gds-avatar` | size | 16px. Inline in text or very dense lists. |
| `gds-avatar--20` | `gds-avatar` | size | 20px. |
| `gds-avatar--24` | `gds-avatar` | size | 24px. Table cells and compact lists. |
| `gds-avatar--32` | `gds-avatar` | size (default) | 32px. Same as the base size. |
| `gds-avatar--40` | `gds-avatar` | size | 40px. Comments, cards, panel headers. |
| `gds-avatar--48` | `gds-avatar` | size | 48px. |
| `gds-avatar--64` | `gds-avatar` | size | 64px. Profile headers. |
| `gds-avatar--circle` | `gds-avatar` | style (default) | Round. For people. Same as the base shape. |
| `gds-avatar--square` | `gds-avatar` | style | Rounded square. For organisations, sites and publications. |
| `gds-avatar-name--sm` | `-name` | size | Smaller name and subtitle text. Pair with a 32px avatar. |
| `gds-avatar-name--xs` | `-name` | size | Smallest text (both lines the same size). Pair with a 24px avatar. |
| `gds-avatar-name--soft` | `-name` | style | Muted name and subtitle colours, for secondary mentions. |

**Accessibility:**
- Every .gds-avatar__img has alt. Use alt="" when the name is already visible next to it (avatar name, table cell), so it is not read twice.
- An initials or icon avatar with no visible name gets role="img" and aria-label with the full name; initials alone mean nothing to a screen reader.
- Status is not shown by colour alone: give .gds-avatar__status role="img" and aria-label="Online", or say it in text nearby.
- In a group, each avatar needs a name (alt or aria-label) and the group an aria-label with the total count.
- The group's DOM order is the reverse of what people see; keep groups non-interactive or see knownIssues.

**Rules:**
- Every .gds-avatar__img has an alt attribute (empty when the name is visible next to it). *Why:* Without alt, screen readers read the file name. (Accessible by default · auto-checkable)
- An avatar with initials or an icon and no visible name next to it has role="img" and aria-label with the full name. *Why:* "FK" or a generic person icon does not tell anyone who it is. (Accessible by default · auto-checkable)
- .gds-avatar__status has role="img" and aria-label, or the status is written in nearby text. *Why:* A green dot is colour only. aria-label on a plain span is ignored, so it needs the img role. (Accessible by default · auto-checkable)
- Circle for people, square for organisations, sites and publications. *Why:* The shape tells people at a glance whether it is a person or an entity. (Obvious over documented)
- .gds-avatar__text holds one or two letters. *Why:* More letters do not fit the circle at small sizes. (Obvious over documented · auto-checkable)
- .gds-avatar-group__counter is the first child of .gds-avatar-group. *Why:* The group uses row-reverse, so the first child appears last; anywhere else the counter lands in the middle of the stack. (Obvious over documented · auto-checkable)
- All avatars in a .gds-avatar-group use the same size. *Why:* The overlap and the counter are tuned for one size; mixed sizes look broken. (Reuse before you create · auto-checkable)
- To show an avatar with a name, use .gds-avatar-name, not a custom flex row. *Why:* It already handles spacing, truncation and type sizes. (Reuse before you create)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- .gds-avatar-group uses flex-direction: row-reverse, so screen readers and keyboard focus go through the avatars in the opposite order to what people see, and the counter must come first in the DOM. *Planned fix:* v3: normal order, negative margin-left and z-index stacking.
- .gds-avatar-group__counter is fixed at 32px. Docs patch other sizes with inline styles, and gds-avatar--24 on the counter loses to the counter rule. *Planned fix:* Add group size modifiers (e.g. gds-avatar-group--24) that size both the avatars and the counter.
- .gds-avatar__status is always green (online) and duplicates status-dot, which has busy, away and offline. *Planned fix:* Allow a .gds-status-dot--ring inside .gds-avatar in the status position, and deprecate __status.
- gds-avatar-name--soft subtitle (neutral-80 on white) is about 3:1, below the 4.5:1 needed for small text. *Planned fix:* Use neutral-300 or the text-secondary token for the soft subtitle.
- At 16px, the icon size token is also 16px, so the fallback icon fills the whole avatar with no padding. *Planned fix:* Set --avatar-icon-16 to 10–12px.

*Generated from `components/avatar.json`. Edit that file, then run `npm run brand`.*
