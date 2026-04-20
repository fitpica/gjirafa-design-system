# Gjirafa Helpdesk — Custom Component Specs

> Components that GDS does NOT provide. Build these in your app using GDS tokens.
> Prefix all custom classes with `hd-` to avoid collisions with `gds-`.

---

## 1. App Layout

```
+-------------------------------------------------------------------+
| Metrics Bar (hd-metrics-bar)                    | Fiton Kadriu    |
+------+-----------------+---------------------------------+---------+
| Icon | Sidebar         | Conversation List               | Detail  |
| Bar  | (hd-sidebar)    | (hd-conversation-list)          | Panel   |
| 48px | 240px           | 360px                           | fluid   |
+------+-----------------+---------------------------------+---------+
```

```html
<div class="hd-app">
  <header class="hd-metrics-bar">...</header>
  <div class="hd-app__body">
    <aside class="hd-icon-bar">...</aside>
    <aside class="hd-sidebar">...</aside>
    <section class="hd-conversation-list">...</section>
    <main class="hd-detail-panel">...</main>
  </div>
</div>
```

```css
.hd-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: var(--hd-max-content-width);
}

.hd-app__body {
  display: flex;
  flex: 1;
  overflow: hidden;
}
```

---

## 2. Icon Bar (far left, 48px)

The vertical icon strip seen in screenshots (chat, analytics, KB, tickets, contacts).

```html
<aside class="hd-icon-bar">
  <div class="hd-icon-bar__logo">
    <div class="gds-avatar gds-avatar--32" style="background: var(--gds-color-action-primary)">
      <span class="gds-avatar__text" style="color:#fff">A</span>
    </div>
  </div>
  <nav class="hd-icon-bar__nav">
    <button class="hd-icon-bar__item hd-icon-bar__item--active" aria-label="Conversations">
      <i data-lucide="message-square" width="20" height="20"></i>
    </button>
    <button class="hd-icon-bar__item" aria-label="Analytics">
      <i data-lucide="bar-chart-2" width="20" height="20"></i>
    </button>
    <button class="hd-icon-bar__item" aria-label="Knowledge Base">
      <i data-lucide="book-open" width="20" height="20"></i>
    </button>
    <button class="hd-icon-bar__item" aria-label="Tickets">
      <i data-lucide="clipboard-list" width="20" height="20"></i>
    </button>
    <button class="hd-icon-bar__item" aria-label="Contacts">
      <i data-lucide="users" width="20" height="20"></i>
    </button>
  </nav>
  <div class="hd-icon-bar__footer">
    <button class="hd-icon-bar__item" aria-label="Profile">
      <div class="gds-avatar gds-avatar--24">
        <span class="gds-avatar__text">FK</span>
      </div>
    </button>
    <button class="hd-icon-bar__item" aria-label="Logout">
      <i data-lucide="log-out" width="20" height="20"></i>
    </button>
  </div>
</aside>
```

```css
.hd-icon-bar {
  width: 48px;
  background: var(--gds-color-action-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--gds-space-8) 0;
  flex-shrink: 0;
}

.hd-icon-bar__nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--gds-space-4);
  padding-top: var(--gds-space-16);
}

.hd-icon-bar__item {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--gds-radius-md);
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: background 150ms ease-in-out;
}

.hd-icon-bar__item:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.hd-icon-bar__item--active {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.hd-icon-bar__footer {
  display: flex;
  flex-direction: column;
  gap: var(--gds-space-4);
}
```

---

## 3. Sidebar

```html
<aside class="hd-sidebar">
  <!-- Search -->
  <div class="hd-sidebar__search">
    <div class="gds-input gds-input--sm">
      <i data-lucide="search" width="16" height="16" class="gds-input__prefix-icon"></i>
      <input type="text" class="gds-input__field" placeholder="Kerko... XK" />
    </div>
  </div>

  <!-- Puna ime -->
  <div class="hd-sidebar__section">
    <div class="hd-sidebar__section-label">Puna ime</div>
    <button class="hd-sidebar__item hd-sidebar__item--active">
      <i data-lucide="inbox" width="18" height="18"></i>
      <span>Te hapura</span>
    </button>
    <button class="hd-sidebar__item">
      <i data-lucide="clock" width="18" height="18"></i>
      <span>Ne pritje</span>
    </button>
    <button class="hd-sidebar__item">
      <i data-lucide="arrow-right-circle" width="18" height="18"></i>
      <span>Te shtyra</span>
    </button>
    <button class="hd-sidebar__item">
      <i data-lucide="check-circle" width="18" height="18"></i>
      <span>Zgjidhur sot</span>
    </button>
  </div>

  <!-- Ekipi -->
  <div class="hd-sidebar__section">
    <div class="hd-sidebar__section-label">Ekipi</div>
    <button class="hd-sidebar__item">
      <i data-lucide="user-x" width="18" height="18"></i>
      <span>Pa caktuar</span>
      <span class="hd-sidebar__count">5</span>
    </button>
    <button class="hd-sidebar__item">
      <i data-lucide="globe" width="18" height="18"></i>
      <span>Te gjitha te hapura</span>
      <span class="hd-sidebar__count">519</span>
    </button>
    <button class="hd-sidebar__item">
      <i data-lucide="alert-triangle" width="18" height="18"></i>
      <span>Te vonuara</span>
      <span class="hd-sidebar__count hd-sidebar__count--urgent">10</span>
    </button>
    <button class="hd-sidebar__item">
      <i data-lucide="arrow-up-circle" width="18" height="18"></i>
      <span>Te eskaluara</span>
      <span class="hd-sidebar__count hd-sidebar__count--urgent">7</span>
    </button>
  </div>

  <!-- Filtrat -->
  <div class="hd-sidebar__section">
    <div class="hd-sidebar__section-label">Filtrat</div>
    <button class="hd-sidebar__item">
      <i data-lucide="package" width="18" height="18"></i>
      <span>Sipas produktit</span>
      <i data-lucide="chevron-right" width="16" height="16" class="hd-sidebar__chevron"></i>
    </button>
    <button class="hd-sidebar__item">
      <i data-lucide="radio" width="18" height="18"></i>
      <span>Sipas kanalit</span>
      <i data-lucide="chevron-right" width="16" height="16" class="hd-sidebar__chevron"></i>
    </button>
    <button class="hd-sidebar__item">
      <i data-lucide="bar-chart" width="18" height="18"></i>
      <span>Sipas prioritetit</span>
      <i data-lucide="chevron-right" width="16" height="16" class="hd-sidebar__chevron"></i>
    </button>
  </div>

  <!-- Arkivi -->
  <div class="hd-sidebar__section">
    <div class="hd-sidebar__section-label">Arkivi</div>
    <button class="hd-sidebar__item">
      <i data-lucide="archive" width="18" height="18"></i>
      <span>Shko te Arkivi</span>
      <i data-lucide="arrow-right" width="16" height="16"></i>
    </button>
  </div>

  <!-- Agent status (pinned bottom) -->
  <div class="hd-sidebar__agent">
    <div class="gds-avatar-name">
      <div class="gds-avatar gds-avatar--32">
        <span class="gds-avatar__text">FK</span>
        <span class="gds-status-dot gds-status-dot--online gds-status-dot--sm"></span>
      </div>
      <div class="gds-avatar-name__text">
        <span class="gds-avatar-name__primary">Fiton Kadriu</span>
        <span class="gds-avatar-name__secondary" style="color: var(--hd-color-status-online)">Online</span>
      </div>
    </div>
  </div>
</aside>
```

---

## 4. Conversation List

```html
<section class="hd-conversation-list">
  <!-- Header -->
  <div class="hd-conversation-list__header">
    <h2 class="hd-conversation-list__title">Pa caktuar <span class="hd-conversation-list__count">(5)</span></h2>
  </div>

  <!-- Product filter tabs — GDS component -->
  <div class="hd-conversation-list__filters">
    <nav class="gds-tabs gds-tabs--filled gds-tabs--sm" aria-label="Product filter">
      <button class="gds-tab gds-tab--active">Te gjitha</button>
      <button class="gds-tab">gjirafa50</button>
      <button class="gds-tab">travel</button>
      <button class="gds-tab">esim</button>
      <button class="gds-tab">girafamall</button>
    </nav>
  </div>

  <!-- Sort (NEW) -->
  <div class="hd-conversation-list__sort">
    <div class="gds-dropdown">
      <button class="gds-btn gds-btn--ghost gds-btn--xs gds-dropdown__trigger">
        Sort: SLA urgency <i data-lucide="chevron-down" width="14" height="14"></i>
      </button>
    </div>
  </div>

  <!-- Conversation rows -->
  <div class="hd-conversation-list__body">

    <article class="hd-conversation hd-conversation--unread">
      <div class="hd-conversation__header">
        <span class="gds-status-dot gds-status-dot--online gds-status-dot--xs"></span>
        <span class="hd-conversation__channel">
          <i data-lucide="globe" width="14" height="14"></i>
        </span>
        <span class="hd-conversation__name">QA Shared</span>
        <span class="hd-conversation__time" title="Apr 6, 2026 at 09:15">4 days</span>
      </div>
      <div class="hd-conversation__subject">QA: Shared user gjirafa50</div>
      <div class="hd-conversation__badges">
        <span class="gds-chip hd-tag-gjirafa50">gjirafa50</span>
        <span class="gds-badge gds-badge--critical">
          <i data-lucide="alert-circle" width="10" height="10"></i> Overdue 97h
        </span>
        <span class="hd-conversation__message-count">
          <i data-lucide="message-circle" width="14" height="14"></i> 1
        </span>
      </div>
    </article>

    <article class="hd-conversation hd-conversation--breached">
      <div class="hd-conversation__header">
        <span class="hd-conversation__channel">
          <i data-lucide="globe" width="14" height="14"></i>
        </span>
        <span class="hd-conversation__name">Faton Berisha</span>
        <span class="hd-conversation__time" title="Apr 5, 2026 at 14:32">5 days</span>
      </div>
      <div class="hd-conversation__subject">Ju: asd</div>
      <div class="hd-conversation__badges">
        <span class="gds-chip hd-tag-starlink">starlink</span>
        <span class="gds-badge hd-badge-ai">AI</span>
        <span class="gds-badge gds-badge--critical">
          <i data-lucide="alert-circle" width="10" height="10"></i> Breached
        </span>
        <span class="hd-conversation__message-count">
          <i data-lucide="message-circle" width="14" height="14"></i> 12
        </span>
      </div>
    </article>

  </div>
</section>
```

```css
.hd-conversation-list {
  width: var(--hd-conversation-list-width);
  border-right: 1px solid var(--gds-color-border-default);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex-shrink: 0;
}

.hd-conversation-list__header {
  padding: var(--gds-space-16);
  border-bottom: 1px solid var(--gds-color-border-subtle);
}

.hd-conversation-list__title {
  font-size: var(--gds-font-size-body-lg);
  font-weight: var(--gds-font-weight-bold);
  color: var(--gds-color-text-primary);
}

.hd-conversation-list__count {
  font-weight: var(--gds-font-weight-regular);
  color: var(--gds-color-text-secondary);
}

.hd-conversation-list__filters {
  padding: var(--gds-space-8) var(--gds-space-16);
}

.hd-conversation-list__body {
  flex: 1;
  overflow-y: auto;
}

/* Breached indicator — left red border */
.hd-conversation--breached {
  border-left-color: var(--gds-color-error);
}
```

---

## 5. Detail Panel (Empty State → Dashboard)

When no conversation is selected, show a useful dashboard instead of just text.

```html
<main class="hd-detail-panel hd-detail-panel--empty">
  <div class="hd-dashboard">
    <div class="hd-dashboard__stats">
      <div class="hd-dashboard__stat">
        <span class="hd-dashboard__stat-value">519</span>
        <span class="hd-dashboard__stat-label">Open tickets</span>
      </div>
      <div class="hd-dashboard__stat">
        <span class="hd-dashboard__stat-value">0m 0s</span>
        <span class="hd-dashboard__stat-label">Avg response</span>
      </div>
      <div class="hd-dashboard__stat hd-dashboard__stat--danger">
        <span class="hd-dashboard__stat-value">17</span>
        <span class="hd-dashboard__stat-label">SLA breached</span>
      </div>
    </div>

    <h3>Most Urgent</h3>
    <!-- Use gds-table for the quick-access list -->
    <div class="gds-table gds-table--compact">
      ...
    </div>
  </div>
</main>
```

---

## 6. Metrics Bar

```html
<header class="hd-metrics-bar">
  <div class="hd-metrics-bar__item">
    <span class="hd-metrics-bar__label">Today:</span>
    <span class="hd-metrics-bar__value">0 resolved</span>
  </div>
  <div class="hd-metrics-bar__divider"></div>
  <div class="hd-metrics-bar__item">
    <span class="hd-metrics-bar__label">Avg:</span>
    <span class="hd-metrics-bar__value">0m 0s</span>
  </div>
  <div class="hd-metrics-bar__divider"></div>
  <div class="hd-metrics-bar__item">
    <span class="hd-metrics-bar__label">CSAT:</span>
    <span class="hd-metrics-bar__value">N/A</span>  <!-- FIX: was "—" -->
  </div>
  <div class="hd-metrics-bar__divider"></div>
  <div class="hd-metrics-bar__item">
    <span class="hd-metrics-bar__label">SLA:</span>
    <span class="hd-metrics-bar__value hd-metrics-bar__value--success">100%</span>
  </div>
  <div style="flex:1"></div>
  <span class="hd-metrics-bar__user">Fiton Kadriu</span>
</header>
```

```css
.hd-metrics-bar__value--success { color: var(--gds-color-success); }
.hd-metrics-bar__value--warning { color: var(--gds-color-warning); }
.hd-metrics-bar__value--danger  { color: var(--gds-color-error); }
```

---

## Summary: What Comes From Where

| Layer | Source | Class prefix |
|-------|--------|-------------|
| Tokens (colors, spacing, type, shadows) | GDS | `--gds-*` |
| Theme overrides (green brand) | `helpdesk-theme.css` | `--gds-*` overrides + `--hd-*` |
| Primitive components (btn, input, badge, chip, avatar, table, tabs, modal, alert, toast, checkbox, toggle, dropdown) | GDS | `gds-*` |
| Product layout (sidebar, conversation list, detail panel, metrics bar, icon bar) | Helpdesk app | `hd-*` |
| Product-specific styles (tag colors, AI badge, SLA tiers) | Helpdesk app | `hd-*` |
