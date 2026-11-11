---
name: gds-visually-hidden
description: "GDS Visually hidden contract: exact markup, anatomy, modifiers, accessibility and rules for gds-visually-hidden*. Hides text visually while keeping it for screen readers. Load before writing or editing visually hidden markup with GDS."
---

# Visually hidden

Hides text visually while keeping it for screen readers.

**Use when:**
- A table caption you don't want to show.
- Extra context for screen readers, e.g. "(opens in a new tab)" or the meaning behind a coloured count.

**Don't use when:**
- Hiding content from everyone → use the hidden attribute
- Labelling an icon-only button → use aria-label on the button

**Example: Hidden table caption**
```html
<span class="gds-visually-hidden">Sorted by last updated, newest first</span>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-visually-hidden` | span \| caption | yes | top level | Any element whose text should be read but not seen. |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|

**Accessibility:**
- Never put focusable elements inside it.

**Rules:**
- Do not put links, buttons or inputs inside gds-visually-hidden. *Why:* Keyboard users would focus something they cannot see. (Accessible by default · auto-checkable)

*Generated from `components/visually-hidden.json`. Edit that file, then run `npm run brand`.*
