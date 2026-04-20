# Gjirafa Helpdesk — GDS Migration Guide

> Replace custom AI-generated UI with GDS components.
> Import `gjirafa-ds.css` + `helpdesk-theme.css`, add `data-theme="helpdesk"` to `<body>`.

---

## Quick Setup

```html
<!-- 1. GDS stylesheet -->
<link rel="stylesheet" href="node_modules/gjirafa-ds/dist/gjirafa-ds.css" />

<!-- 2. Helpdesk theme (after GDS) -->
<link rel="stylesheet" href="helpdesk-theme.css" />

<!-- 3. Your app-specific styles (sidebar, conversation, layout) -->
<link rel="stylesheet" href="helpdesk-app.css" />

<!-- 4. Activate theme -->
<body data-theme="helpdesk">
```

---

## Component Migration Map

### Buttons

| Current | Replace with | Notes |
|---------|-------------|-------|
| Custom primary button | `<button class="gds-btn gds-btn--primary">` | Auto green via theme |
| Custom secondary/outline button | `<button class="gds-btn gds-btn--secondary">` | Green border via theme |
| Custom danger/red button | `<button class="gds-btn gds-btn--danger">` | |
| Custom ghost button | `<button class="gds-btn gds-btn--ghost">` | |
| Custom icon button | `<button class="gds-btn gds-btn--ghost gds-btn--icon">` | Add `aria-label` |
| Disabled state | Add `disabled` attribute | GDS handles opacity + cursor |

**Sizes:** `gds-btn--xs`, `gds-btn--sm`, (default md), `gds-btn--lg`, `gds-btn--xl`

---

### Product Filter Tabs (Te gjitha, gjirafa50, travel, esim, girafamall)

```html
<nav class="gds-tabs gds-tabs--filled" aria-label="Product filter">
  <button class="gds-tab gds-tab--active">Te gjitha</button>
  <button class="gds-tab">gjirafa50</button>
  <button class="gds-tab">travel</button>
  <button class="gds-tab">esim</button>
  <button class="gds-tab">girafamall</button>
</nav>
```

Active tab automatically uses green from theme. No custom CSS needed.

---

### Product Tag Badges (gjirafa50, starlink, esim, girafamall, travel)

Use `gds-chip` with custom background from `--hd-color-tag-*` tokens:

```html
<span class="gds-chip hd-tag-gjirafa50">gjirafa50</span>
<span class="gds-chip hd-tag-travel">travel</span>
<span class="gds-chip hd-tag-esim">esim</span>
<span class="gds-chip hd-tag-girafamall">girafamall</span>
<span class="gds-chip hd-tag-starlink">starlink</span>
```

Add to `helpdesk-app.css`:
```css
.hd-tag-gjirafa50  { background: var(--hd-color-tag-gjirafa50);  color: #fff; }
.hd-tag-travel     { background: var(--hd-color-tag-travel);     color: #fff; }
.hd-tag-esim       { background: var(--hd-color-tag-esim);       color: #fff; }
.hd-tag-girafamall { background: var(--hd-color-tag-girafamall); color: #fff; }
.hd-tag-starlink   { background: var(--hd-color-tag-starlink);   color: #fff; }
```

---

### SLA Badges

Use `gds-badge` with semantic variants:

```html
<!-- On track -->
<span class="gds-badge gds-badge--positive"><i data-lucide="clock" width="12" height="12"></i> 3h 45m left</span>

<!-- At risk (<1h remaining) -->
<span class="gds-badge gds-badge--warning"><i data-lucide="alert-triangle" width="12" height="12"></i> 45m left</span>

<!-- Breached -->
<span class="gds-badge gds-badge--critical"><i data-lucide="alert-circle" width="12" height="12"></i> Overdue 2h 15m</span>

<!-- No SLA -->
<span class="gds-badge gds-badge--neutral">No SLA</span>
```

Replace current "+97h 53m" / "Breached" with human-readable labels.

---

### Agent Badge

```html
<span class="gds-badge gds-badge--neutral">
  <i data-lucide="user" width="12" height="12"></i> Mergca
</span>
```

For unassigned: `<span class="gds-badge gds-badge--neutral">Unassigned</span>`

---

### AI Badge

```html
<span class="gds-badge hd-badge-ai">AI Replied</span>
```

Add to `helpdesk-app.css`:
```css
.hd-badge-ai { background: var(--hd-color-ai); color: #fff; }
```

---

### Avatars + Status

```html
<!-- Customer avatar with online status -->
<div class="gds-avatar gds-avatar--32">
  <img class="gds-avatar__img" src="photo.jpg" alt="Fiton Kadriu" />
  <span class="gds-status-dot gds-status-dot--online gds-status-dot--sm"></span>
</div>

<!-- Agent avatar at sidebar bottom -->
<div class="gds-avatar-name">
  <div class="gds-avatar gds-avatar--32">
    <span class="gds-avatar__text">FK</span>
    <span class="gds-status-dot gds-status-dot--online gds-status-dot--sm"></span>
  </div>
  <div class="gds-avatar-name__text">
    <span class="gds-avatar-name__primary">Fiton Kadriu</span>
    <span class="gds-avatar-name__secondary">Online</span>
  </div>
</div>
```

---

### Search Input

```html
<div class="gds-input gds-input--sm">
  <i data-lucide="search" width="16" height="16" class="gds-input__prefix-icon"></i>
  <input type="text" class="gds-input__field" placeholder="Kerko... XK" />
</div>
```

---

### Checkboxes (Bulk Select)

```html
<label class="gds-checkbox gds-checkbox--sm">
  <input type="checkbox" class="gds-checkbox__input" />
  <span class="gds-checkbox__control"></span>
</label>
```

Green checkmark via theme automatically.

---

### Dropdown (Sort, Filters)

```html
<div class="gds-dropdown">
  <button class="gds-btn gds-btn--secondary gds-btn--sm gds-dropdown__trigger">
    <span class="gds-btn__label">Sort by</span>
    <i data-lucide="chevron-down" width="16" height="16"></i>
  </button>
  <div class="gds-dropdown__menu">
    <button class="gds-dropdown__item gds-dropdown__item--selected">SLA urgency</button>
    <button class="gds-dropdown__item">Newest first</button>
    <button class="gds-dropdown__item">Oldest first</button>
  </div>
</div>
```

---

### Modals

```html
<div class="gds-modal-overlay">
  <div class="gds-modal gds-modal--md">
    <div class="gds-modal__header">
      <h2 class="gds-modal__title">Assign Ticket</h2>
      <button class="gds-modal__close" aria-label="Close">
        <i data-lucide="x" width="20" height="20"></i>
      </button>
    </div>
    <div class="gds-modal__body">...</div>
    <div class="gds-modal__footer">
      <button class="gds-btn gds-btn--secondary">Cancel</button>
      <button class="gds-btn gds-btn--primary">Assign</button>
    </div>
  </div>
</div>
```

---

### Alerts / Notifications

```html
<div class="gds-alert gds-alert--critical">
  <i data-lucide="alert-circle" class="gds-alert__icon"></i>
  <div class="gds-alert__content">
    <div class="gds-alert__title">SLA Breached</div>
    <div class="gds-alert__desc">Ticket #1234 has exceeded response time.</div>
  </div>
</div>
```

---

### Toasts

```html
<div class="gds-toast gds-toast--success">
  <i data-lucide="check-circle" class="gds-toast__icon"></i>
  <div class="gds-toast__content">Ticket resolved successfully</div>
</div>
```

---

### Toggle (Settings)

```html
<label class="gds-toggle">
  <input type="checkbox" class="gds-toggle__input" />
  <span class="gds-toggle__track"></span>
  <span class="gds-toggle__label">Auto-assign tickets</span>
</label>
```

---

### Data Tables (Ticket lists, reports)

```html
<div class="gds-table">
  <table class="gds-table__table">
    <thead class="gds-table__head">
      <tr class="gds-table__row">
        <th class="gds-table__cell gds-table__cell--checkbox">
          <label class="gds-checkbox gds-checkbox--sm">...</label>
        </th>
        <th class="gds-table__cell">Ticket</th>
        <th class="gds-table__cell">Customer</th>
        <th class="gds-table__cell">Status</th>
        <th class="gds-table__cell">SLA</th>
      </tr>
    </thead>
    <tbody class="gds-table__body">
      <tr class="gds-table__row">
        <td class="gds-table__cell gds-table__cell--checkbox">
          <label class="gds-checkbox gds-checkbox--sm">...</label>
        </td>
        <td class="gds-table__cell">#1234</td>
        <td class="gds-table__cell">
          <div class="gds-avatar-name">
            <div class="gds-avatar gds-avatar--24">
              <img class="gds-avatar__img" src="photo.jpg" alt="" />
            </div>
            <div class="gds-avatar-name__text">
              <span class="gds-avatar-name__primary">Faton Berisha</span>
            </div>
          </div>
        </td>
        <td class="gds-table__cell">
          <span class="gds-badge gds-badge--warning">At Risk</span>
        </td>
        <td class="gds-table__cell">
          <span class="gds-badge gds-badge--critical">Overdue 2h</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## Custom Components (NOT in GDS — build in helpdesk-app.css)

These are product-specific. Use GDS tokens for consistency but build the layout yourselves.

### 1. Sidebar Layout

```css
.hd-sidebar {
  width: var(--hd-sidebar-width);
  background: var(--hd-color-surface-sidebar);
  border-right: 1px solid var(--gds-color-border-default);
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
}

.hd-sidebar__section-label {
  font-size: var(--gds-font-size-caption);
  font-weight: var(--gds-font-weight-semibold);
  color: var(--gds-color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: var(--gds-space-8) var(--gds-space-16);
}

.hd-sidebar__item {
  display: flex;
  align-items: center;
  gap: var(--gds-space-8);
  height: 40px;
  padding: 0 var(--gds-space-16);
  font-size: var(--gds-font-size-body-sm);
  color: var(--gds-color-text-primary);
  cursor: pointer;
  transition: background 150ms ease-in-out;
  border-left: 3px solid transparent;
}

.hd-sidebar__item:hover {
  background: var(--hd-color-hover-bg);
}

.hd-sidebar__item--active {
  background: var(--hd-color-selected-bg);
  border-left-color: var(--hd-color-selected-border);
  font-weight: var(--gds-font-weight-medium);
}

.hd-sidebar__count {
  margin-left: auto;
  font-size: var(--gds-font-size-caption);
  color: var(--gds-color-text-secondary);
}

.hd-sidebar__count--urgent {
  background: var(--gds-color-error);
  color: #fff;
  border-radius: var(--gds-radius-full);
  padding: 2px 8px;
  font-size: 11px;
  font-weight: var(--gds-font-weight-semibold);
}
```

### 2. Conversation Row

```css
.hd-conversation {
  display: flex;
  flex-direction: column;
  gap: var(--gds-space-4);
  padding: var(--gds-space-12) var(--gds-space-16);
  border-bottom: 1px solid var(--gds-color-border-subtle);
  cursor: pointer;
  transition: background 150ms ease-in-out;
  border-left: 3px solid transparent;
}

.hd-conversation:hover {
  background: var(--hd-color-hover-bg);
}

.hd-conversation--selected {
  background: var(--hd-color-selected-bg);
  border-left-color: var(--hd-color-selected-border);
}

.hd-conversation__header {
  display: flex;
  align-items: center;
  gap: var(--gds-space-8);
}

.hd-conversation__name {
  font-size: var(--gds-font-size-body-sm);
  font-weight: var(--gds-font-weight-semibold);
  color: var(--gds-color-text-primary);
  flex: 1;
  min-width: 0;
  /* FIX: allow full name display */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hd-conversation__time {
  font-size: var(--gds-font-size-caption);
  color: var(--gds-color-text-secondary);
  flex-shrink: 0;
}

.hd-conversation__subject {
  font-size: var(--gds-font-size-body-sm);
  color: var(--gds-color-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hd-conversation__badges {
  display: flex;
  align-items: center;
  gap: var(--gds-space-8);
  flex-wrap: wrap;
}

.hd-conversation__message-count {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: var(--gds-space-4);
  font-size: var(--gds-font-size-caption);
  color: var(--gds-color-text-secondary);
}
```

### 3. Metrics Bar

```css
.hd-metrics-bar {
  display: flex;
  align-items: center;
  gap: var(--gds-space-16);
  padding: var(--gds-space-8) var(--gds-space-16);
  font-size: 13px;
  border-bottom: 1px solid var(--gds-color-border-default);
  background: var(--gds-color-bg-primary);
}

.hd-metrics-bar__item {
  display: flex;
  align-items: center;
  gap: var(--gds-space-4);
}

.hd-metrics-bar__label {
  color: var(--gds-color-text-secondary);
  font-weight: var(--gds-font-weight-regular);
}

.hd-metrics-bar__value {
  color: var(--gds-color-text-primary);
  font-weight: var(--gds-font-weight-semibold);
}

.hd-metrics-bar__divider {
  width: 1px;
  height: 16px;
  background: var(--gds-color-border-default);
}
```

### 4. Bulk Action Bar

```css
.hd-bulk-bar {
  display: flex;
  align-items: center;
  gap: var(--gds-space-12);
  padding: var(--gds-space-8) var(--gds-space-16);
  background: #263238;
  color: #fff;
  position: sticky;
  top: 0;
  z-index: var(--gds-z-sticky);
}

.hd-bulk-bar__count {
  font-size: var(--gds-font-size-body-sm);
  font-weight: var(--gds-font-weight-medium);
}

/* Use gds-btn--ghost with white text override */
.hd-bulk-bar .gds-btn--ghost {
  color: #fff;
}
```

### 5. Empty State

```css
.hd-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--gds-space-48) var(--gds-space-24);
  text-align: center;
}

.hd-empty-state__icon {
  width: 80px;
  height: 80px;
  margin-bottom: var(--gds-space-16);
}

.hd-empty-state__title {
  font-size: 18px;
  font-weight: var(--gds-font-weight-bold);
  color: var(--gds-color-text-primary);
  margin-bottom: var(--gds-space-8);
}

.hd-empty-state__desc {
  font-size: var(--gds-font-size-body-sm);
  color: var(--gds-color-text-tertiary);
}
```

---

## Token Mapping Cheat Sheet

| Their spec token | GDS equivalent |
|-----------------|---------------|
| `--color-primary` | `--gds-color-action-primary` |
| `--color-primary-dark` | `--gds-color-action-primary-hover` |
| `--color-text-primary` | `--gds-color-text-primary` |
| `--color-text-secondary` | `--gds-color-text-secondary` |
| `--color-text-disabled` | `--gds-color-text-disabled` |
| `--color-border` | `--gds-color-border-default` |
| `--color-border-light` | `--gds-color-border-subtle` |
| `--color-bg-page` | `--gds-color-bg-secondary` |
| `--color-bg-surface` | `--gds-color-bg-primary` |
| `--color-bg-hover` | `--gds-color-bg-secondary` |
| `--color-error` | `--gds-color-error` |
| `--color-success` | `--gds-color-success` |
| `--color-warning` | `--gds-color-warning` |
| `--space-xs` (4px) | `--gds-space-4` |
| `--space-sm` (8px) | `--gds-space-8` |
| `--space-md` (12px) | `--gds-space-12` |
| `--space-lg` (16px) | `--gds-space-16` |
| `--space-xl` (24px) | `--gds-space-24` |
| `--space-2xl` (32px) | `--gds-space-32` |
| `--radius-sm` (4px) | `--gds-radius-sm` |
| `--radius-md` (8px) | `--gds-radius-md` |
| `--radius-lg` (12px) | `--gds-radius-lg` |
| `--radius-full` (16px) | `--gds-radius-full` |
| `--radius-circle` (50%) | `--gds-radius-full` |
| `--shadow-sm` | `--gds-shadow-sm` |
| `--shadow-md` | `--gds-shadow-md` |
| `--text-page-title` | Use `gds-u-text-title-md` utility |
| `--text-body` | Use `gds-u-text-body-md` utility |
| `--text-caption` | Use `gds-u-text-caption` utility |

---

## Accessibility Checklist (GDS handles most of this)

- [x] Focus rings — GDS provides 2px green outline via theme
- [x] Disabled states — GDS applies opacity + cursor
- [x] Touch targets — GDS buttons meet 44px minimum
- [x] Screen reader labels — use `aria-label` on icon buttons
- [ ] Color contrast on product tags — verify 4.5:1 ratio on each `--hd-color-tag-*`
- [ ] `prefers-reduced-motion` — add to `helpdesk-app.css`
- [ ] Keyboard navigation — implement tab order: sidebar > list > detail

---

## Migration Priority

### Phase 1 — Foundation (Day 1)
1. Add `gjirafa-ds.css` + `helpdesk-theme.css`
2. Replace all custom buttons with `gds-btn`
3. Replace all custom inputs with `gds-input`
4. Replace all custom checkboxes with `gds-checkbox`

### Phase 2 — Components (Day 2-3)
5. Replace filter tabs with `gds-tabs--filled`
6. Replace product tags with `gds-chip` + `hd-tag-*`
7. Replace SLA badges with `gds-badge` + semantic variants
8. Replace agent/AI badges with `gds-badge`
9. Replace avatars with `gds-avatar` + `gds-status-dot`

### Phase 3 — Layout (Day 4-5)
10. Apply `hd-sidebar` styles using GDS tokens
11. Apply `hd-conversation` row styles
12. Apply `hd-metrics-bar` styles
13. Add bulk action bar
14. Add empty state component

### Phase 4 — Polish (Day 6-7)
15. Add sort dropdown with `gds-dropdown`
16. Implement `prefers-reduced-motion`
17. Accessibility audit
18. Remove all old custom CSS
