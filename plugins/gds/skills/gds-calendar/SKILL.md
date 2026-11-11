---
name: gds-calendar
description: "GDS Calendar / Date picker contract: exact markup, anatomy, modifiers, accessibility and rules for gds-calendar*, gds-time*, gds-datepicker*. A month grid for picking a date (and optionally a time), shown inline or in a popover under a date field. Load before writing or editing calendar / date picker markup with GDS."
---

# Calendar / Date picker

A month grid for picking a date (and optionally a time), shown inline or in a popover under a date field.

**Use when:**
- Picking one date where the weekday or nearby dates matter (publish date, embargo date, report day).
- Picking a date and time together (scheduled publish).
- Offering product-defined shortcuts next to the grid (advanced layout with presets: "30 days from first upload").

**Don't use when:**
- A date people know by heart and type faster (date of birth) → use input with a date format hint
- A relative period for a report (Last 7 days, This month) → use dropdown with period options
- Showing scheduled content over weeks or months → use a dedicated schedule view, not the picker grid

**Example: Publish date picker (open, November 2026)**
```html
<div class="gds-datepicker">
  <div class="gds-input gds-input--md">
    <label class="gds-input__label" for="publish-date">Publish date</label>
    <div class="gds-input__wrap">
      <input id="publish-date" class="gds-input__field" value="18/11/2026" readonly role="combobox" aria-haspopup="dialog" aria-expanded="true" aria-controls="publish-date-cal" />
      <i data-lucide="calendar" class="gds-input__icon"></i>
    </div>
  </div>
  <div id="publish-date-cal" class="gds-calendar-popover gds-calendar-popover--open" role="dialog" aria-label="Choose publish date">
    <div class="gds-calendar">
      <div class="gds-calendar__header">
        <button type="button" class="gds-btn-icon gds-btn-icon--ghost gds-btn-icon--sm gds-calendar__nav" aria-label="Previous month"><i data-lucide="chevron-left"></i></button>
        <h2 class="gds-calendar__title">November 2026</h2>
        <button type="button" class="gds-btn-icon gds-btn-icon--ghost gds-btn-icon--sm gds-calendar__nav" aria-label="Next month"><i data-lucide="chevron-right"></i></button>
      </div>
      <div class="gds-calendar__grid-wrap" role="grid" aria-label="November 2026">
        <div class="gds-calendar__weekdays" role="row"><span class="gds-calendar__weekday" role="columnheader" aria-label="Monday">Mo</span><span class="gds-calendar__weekday" role="columnheader" aria-label="Tuesday">Tu</span><span class="gds-calendar__weekday" role="columnheader" aria-label="Wednesday">We</span><span class="gds-calendar__weekday" role="columnheader" aria-label="Thursday">Th</span><span class="gds-calendar__weekday" role="columnheader" aria-label="Friday">Fr</span><span class="gds-calendar__weekday" role="columnheader" aria-label="Saturday">Sa</span><span class="gds-calendar__weekday" role="columnheader" aria-label="Sunday">Su</span></div>
        <div class="gds-calendar__grid" role="rowgroup">
          <div class="gds-calendar__week" role="row">
            <button class="gds-calendar__day gds-calendar__day--outside gds-calendar__day--disabled" type="button" role="gridcell" aria-label="Monday, 26 October 2026" tabindex="-1" aria-disabled="true" disabled>26</button>
            <button class="gds-calendar__day gds-calendar__day--outside gds-calendar__day--disabled" type="button" role="gridcell" aria-label="Tuesday, 27 October 2026" tabindex="-1" aria-disabled="true" disabled>27</button>
            <button class="gds-calendar__day gds-calendar__day--outside gds-calendar__day--disabled" type="button" role="gridcell" aria-label="Wednesday, 28 October 2026" tabindex="-1" aria-disabled="true" disabled>28</button>
            <button class="gds-calendar__day gds-calendar__day--outside gds-calendar__day--disabled" type="button" role="gridcell" aria-label="Thursday, 29 October 2026" tabindex="-1" aria-disabled="true" disabled>29</button>
            <button class="gds-calendar__day gds-calendar__day--outside gds-calendar__day--disabled" type="button" role="gridcell" aria-label="Friday, 30 October 2026" tabindex="-1" aria-disabled="true" disabled>30</button>
            <button class="gds-calendar__day gds-calendar__day--outside gds-calendar__day--disabled" type="button" role="gridcell" aria-label="Saturday, 31 October 2026" tabindex="-1" aria-disabled="true" disabled>31</button>
            <button class="gds-calendar__day gds-calendar__day--disabled" type="button" role="gridcell" aria-label="Sunday, 1 November 2026" tabindex="-1" aria-disabled="true" disabled>1</button>
          </div>
          <div class="gds-calendar__week" role="row">
            <button class="gds-calendar__day gds-calendar__day--disabled" type="button" role="gridcell" aria-label="Monday, 2 November 2026" tabindex="-1" aria-disabled="true" disabled>2</button>
            <button class="gds-calendar__day gds-calendar__day--disabled" type="button" role="gridcell" aria-label="Tuesday, 3 November 2026" tabindex="-1" aria-disabled="true" disabled>3</button>
            <button class="gds-calendar__day gds-calendar__day--disabled" type="button" role="gridcell" aria-label="Wednesday, 4 November 2026" tabindex="-1" aria-disabled="true" disabled>4</button>
            <button class="gds-calendar__day gds-calendar__day--disabled" type="button" role="gridcell" aria-label="Thursday, 5 November 2026" tabindex="-1" aria-disabled="true" disabled>5</button>
            <button class="gds-calendar__day gds-calendar__day--disabled" type="button" role="gridcell" aria-label="Friday, 6 November 2026" tabindex="-1" aria-disabled="true" disabled>6</button>
            <button class="gds-calendar__day gds-calendar__day--disabled" type="button" role="gridcell" aria-label="Saturday, 7 November 2026" tabindex="-1" aria-disabled="true" disabled>7</button>
            <button class="gds-calendar__day gds-calendar__day--disabled" type="button" role="gridcell" aria-label="Sunday, 8 November 2026" tabindex="-1" aria-disabled="true" disabled>8</button>
          </div>
          <div class="gds-calendar__week" role="row">
            <button class="gds-calendar__day gds-calendar__day--disabled" type="button" role="gridcell" aria-label="Monday, 9 November 2026" tabindex="-1" aria-disabled="true" disabled>9</button>
            <button class="gds-calendar__day gds-calendar__day--disabled" type="button" role="gridcell" aria-label="Tuesday, 10 November 2026" tabindex="-1" aria-disabled="true" disabled>10</button>
            <button class="gds-calendar__day gds-calendar__day--today" type="button" role="gridcell" aria-label="Wednesday, 11 November 2026" tabindex="-1" aria-current="date">11</button>
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Thursday, 12 November 2026" tabindex="-1">12</button>
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Friday, 13 November 2026" tabindex="-1">13</button>
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Saturday, 14 November 2026" tabindex="-1">14</button>
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Sunday, 15 November 2026" tabindex="-1">15</button>
          </div>
          <div class="gds-calendar__week" role="row">
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Monday, 16 November 2026" tabindex="-1">16</button>
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Tuesday, 17 November 2026" tabindex="-1">17</button>
            <button class="gds-calendar__day gds-calendar__day--selected" type="button" role="gridcell" aria-label="Wednesday, 18 November 2026" tabindex="0" aria-selected="true">18</button>
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Thursday, 19 November 2026" tabindex="-1">19</button>
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Friday, 20 November 2026, 2 articles scheduled" tabindex="-1">20<span class="gds-calendar__day-dot"></span></button>
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Saturday, 21 November 2026" tabindex="-1">21</button>
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Sunday, 22 November 2026" tabindex="-1">22</button>
          </div>
          <div class="gds-calendar__week" role="row">
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Monday, 23 November 2026" tabindex="-1">23</button>
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Tuesday, 24 November 2026" tabindex="-1">24</button>
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Wednesday, 25 November 2026" tabindex="-1">25</button>
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Thursday, 26 November 2026" tabindex="-1">26</button>
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Friday, 27 November 2026" tabindex="-1">27</button>
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Saturday, 28 November 2026" tabindex="-1">28</button>
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Sunday, 29 November 2026" tabindex="-1">29</button>
          </div>
          <div class="gds-calendar__week" role="row">
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Monday, 30 November 2026" tabindex="-1">30</button>
            <button class="gds-calendar__day gds-calendar__day--outside" type="button" role="gridcell" aria-label="Tuesday, 1 December 2026" tabindex="-1">1</button>
            <button class="gds-calendar__day gds-calendar__day--outside" type="button" role="gridcell" aria-label="Wednesday, 2 December 2026" tabindex="-1">2</button>
            <button class="gds-calendar__day gds-calendar__day--outside" type="button" role="gridcell" aria-label="Thursday, 3 December 2026" tabindex="-1">3</button>
            <button class="gds-calendar__day gds-calendar__day--outside" type="button" role="gridcell" aria-label="Friday, 4 December 2026" tabindex="-1">4</button>
            <button class="gds-calendar__day gds-calendar__day--outside" type="button" role="gridcell" aria-label="Saturday, 5 December 2026" tabindex="-1">5</button>
            <button class="gds-calendar__day gds-calendar__day--outside" type="button" role="gridcell" aria-label="Sunday, 6 December 2026" tabindex="-1">6</button>
          </div>
        </div>
      </div>
      <div class="gds-sr-only" aria-live="polite" aria-atomic="true"></div>
      <div class="gds-calendar__footer">
        <button type="button" class="gds-btn gds-btn--ghost gds-btn--sm" aria-label="Select today's date"><span class="gds-btn__label">Today</span></button>
        <button type="button" class="gds-btn gds-btn--ghost gds-btn--sm" aria-label="Clear selected date"><span class="gds-btn__label">Clear</span></button>
      </div>
    </div>
  </div>
</div>
```

**Example: Time only (embargo time)**
```html
<div class="gds-calendar" role="group" aria-label="Embargo time">
  <div class="gds-calendar__time gds-calendar__time--bare">
    <div class="gds-time-stepper">
      <div class="gds-time-stepper__unit">
        <input class="gds-time-stepper__field" type="text" inputmode="numeric" maxlength="2" value="09" role="spinbutton" aria-label="Hours" aria-valuemin="0" aria-valuemax="23" aria-valuenow="9" />
        <span class="gds-time-stepper__spin">
          <button type="button" class="gds-time-stepper__btn gds-time-stepper__btn--up" aria-label="Increment hours"><i data-lucide="chevron-up"></i></button>
          <button type="button" class="gds-time-stepper__btn" aria-label="Decrement hours"><i data-lucide="chevron-down"></i></button>
        </span>
      </div>
      <span class="gds-time-stepper__separator">:</span>
      <div class="gds-time-stepper__unit">
        <input class="gds-time-stepper__field" type="text" inputmode="numeric" maxlength="2" value="30" role="spinbutton" aria-label="Minutes" aria-valuemin="0" aria-valuemax="59" aria-valuenow="30" />
        <span class="gds-time-stepper__spin">
          <button type="button" class="gds-time-stepper__btn gds-time-stepper__btn--up" aria-label="Increment minutes"><i data-lucide="chevron-up"></i></button>
          <button type="button" class="gds-time-stepper__btn" aria-label="Decrement minutes"><i data-lucide="chevron-down"></i></button>
        </span>
      </div>
    </div>
  </div>
  <div class="gds-calendar__footer">
    <button type="button" class="gds-btn gds-btn--ghost gds-btn--sm" aria-label="Set the current time"><span class="gds-btn__label">Now</span></button>
    <button type="button" class="gds-btn gds-btn--ghost gds-btn--sm" aria-label="Clear selected time"><span class="gds-btn__label">Clear</span></button>
  </div>
</div>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-datepicker` | div | no | top level | Wrapper for the CSS-only date picker: position: relative anchor for .gds-calendar-popover, full width. Holds a .gds-input trigger and the popover. Not used when the ds-core createDatePicker() renders the picker (it portals a .gds-popover instead). |
| `gds-calendar-popover` | div | no | `gds-datepicker` | Floating surface under the trigger (bottom-start, absolute). Hidden until --open. The product toggles it and handles collisions. Attributes: `id` (Referenced by aria-controls on the trigger), `role` (dialog), `aria-label` (e.g. "Choose publish date"). |
| `gds-calendar` | div | yes | top level | The calendar body: header → grid → time → footer in a column. Can sit in .gds-calendar-popover, in a .gds-popover, or inline on the page. |
| `gds-calendar__main` | div | no | `gds-calendar` | Advanced layout only: left column that holds header, grid, time and footer next to __presets. |
| `gds-calendar__header` | div | no | `gds-calendar` or `gds-calendar__main` | Row: previous button, title, next button. Present in date and date-time modes; left out in time-only mode. |
| `gds-calendar__nav` | button | yes, repeats | `gds-calendar__header` | Previous / next month. Put it on a .gds-btn-icon gds-btn-icon--ghost gds-btn-icon--sm with a chevron-left / chevron-right icon. Attributes: `type` (button), `aria-label` ("Previous month" / "Next month"). |
| `gds-calendar__title` | h2 \| div | yes | `gds-calendar__header` | Month and year, e.g. "November 2026". Plain text, or __title-select + __title-year. |
| `gds-calendar__title-select` | button | no | `gds-calendar__title` | Month picker affordance ("June" + chevron). Looks like a select; the behaviour is the product's. Attributes: `type` (button), `aria-label` (e.g. "Choose month"). |
| `gds-calendar__title-year` | span | no | `gds-calendar__title` | Year next to __title-select. |
| `gds-calendar__grid-wrap` | div | no | `gds-calendar` or `gds-calendar__main` | Carries role="grid" so the weekday row and the day rows are valid grid children. display: contents, so it does not affect layout. Required whenever the month grid is shown. Attributes: `role` (grid), `aria-label` (Month and year, e.g. "November 2026"). |
| `gds-calendar__weekdays` | div | yes | `gds-calendar__grid-wrap` | Weekday header row, 7 columns. Attributes: `role` (row). |
| `gds-calendar__weekday` | span | yes, repeats | `gds-calendar__weekdays` | Short weekday name (uppercase). 7 of them, in the locale's week order. Attributes: `role` (columnheader), `aria-label` (Full weekday name when the text is abbreviated). |
| `gds-calendar__grid` | div | yes | `gds-calendar__grid-wrap` | 7 × 6 grid of days. Always reserves 6 rows so the popover does not jump between months. Attributes: `role` (rowgroup). |
| `gds-calendar__week` | div | yes, repeats | `gds-calendar__grid` | One week (6 per month). display: contents, so the days stay direct grid items. Attributes: `role` (row). |
| `gds-calendar__day` | button | yes, repeats | `gds-calendar__week` | One day: the day number. 7 per week; adjacent-month days fill the first and last weeks with --outside. Attributes: `type` (button), `role` (gridcell), `aria-label` (Full date, e.g. "Wednesday, 18 November 2026"), `tabindex` (0 on exactly one day (selected, else focused / first enabled), -1 on the rest), `aria-selected` ("true" on the selected day), `aria-current` ("date" on today), `aria-disabled` ("true" (plus disabled) on unavailable days). |
| `gds-calendar__day-dot` | span | no | `gds-calendar__day` | Small dot under the number: the day has events (e.g. scheduled articles). Decorative; say it in the day's aria-label too. |
| `gds-calendar__time` | div | no | `gds-calendar` or `gds-calendar__main` | Time row under the grid (date-time and time-only modes), with a divider on top. |
| `gds-calendar__time-label` | span | no | `gds-calendar__time` | "Time" label before the stepper (date-time mode). |
| `gds-time-stepper` | div | yes | `gds-calendar__time` | HH : MM control: two __unit segments and a __separator. |
| `gds-time-stepper__unit` | div | yes, repeats | `gds-time-stepper` | Bordered segment: number field + spin column. Shows the focus colour on its border when the field is focused. |
| `gds-time-stepper__field` | input | yes | `gds-time-stepper__unit` | Two-digit hour or minute. Arrow Up / Down step the value (product or ds-core JS). Attributes: `type` (text), `inputmode` (numeric), `maxlength` (2), `role` (spinbutton), `aria-label` ("Hours" / "Minutes"), `aria-valuemin` (0), `aria-valuemax` (23 / 59), `aria-valuenow` (Current value). |
| `gds-time-stepper__spin` | span | no | `gds-time-stepper__unit` | Column with the up and down buttons. |
| `gds-time-stepper__btn` | button | yes, repeats | `gds-time-stepper__spin` | Up (first, with --up) or down (second) step button with a chevron icon. Attributes: `type` (button), `aria-label` (e.g. "Increment hours" / "Decrement hours"). |
| `gds-time-stepper__separator` | span | no | `gds-time-stepper` | The ":" between hours and minutes. |
| `gds-calendar__footer` | div | no | `gds-calendar` or `gds-calendar__main` | Bottom row with .gds-btn gds-btn--ghost gds-btn--sm actions (Today / Now, Clear, Apply). Ghost buttons here are recoloured to the action colour. |
| `gds-calendar__presets` | div | no | `gds-calendar` | Advanced layout only: right column with __presets-title and a .gds-menu of shortcuts. Stacks under the calendar below 640px. Attributes: `role` (group), `aria-label` (e.g. "Shortcuts"). |
| `gds-calendar__presets-title` | p | no | `gds-calendar__presets` | Title of the presets column. |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-calendar-popover--open` | `-popover` | state | Shows the popover (fade + slide). Set aria-expanded="true" on the trigger. |
| `gds-calendar-popover--align-end` | `-popover` | layout | Aligns the popover to the end edge of the trigger instead of the start. |
| `gds-calendar--compact` | `gds-calendar` | size | Smaller day cells (re-points --calendar-day-size). |
| `gds-calendar--advanced` | `gds-calendar` | layout | Two columns: __main (calendar) and __presets. Needs both children. |
| `gds-calendar__day--outside` | `__day` | state | Day from the previous / next month. Muted colour. |
| `gds-calendar__day--today` | `__day` | state | Today: inset ring + medium weight (not colour only). Add aria-current="date". |
| `gds-calendar__day--selected` | `__day` | state | Selected day: action-colour fill. Add aria-selected="true". |
| `gds-calendar__day--in-range` | `__day` | state | Day between range start and end: tinted band that bridges the grid gap. |
| `gds-calendar__day--range-start` | `__day` | state | First day of a range: filled disc, band reaches inward. |
| `gds-calendar__day--range-end` | `__day` | state | Last day of a range: filled disc, band reaches inward. |
| `gds-calendar__day--disabled` | `__day` | state | Unavailable day (before min, after max, blocked). Wins over every other state. Also set disabled and aria-disabled="true". |
| `gds-calendar__time--bare` | `__time` | style | No divider and no top padding: for a time-only panel. |
| `gds-time-stepper__btn--up` | `gds-time-stepper__btn` | layout | The up button: adds the divider line under it. The down button has no modifier. |

**States:**
- **open**: gds-calendar-popover--open on the popover + aria-expanded="true" on the trigger (or the ds-core controller adds gds-popover--open).
- **selected**: gds-calendar__day--selected + aria-selected="true" + tabindex="0".
- **today**: gds-calendar__day--today + aria-current="date".
- **disabled day**: gds-calendar__day--disabled + disabled + aria-disabled="true".
- **range**: --range-start, --in-range and --range-end on the days of the range (no ds-core support yet).
- **focused day**: Native :focus ring on the day that has tabindex="0"; arrow keys move it (JS).

**Accessibility:**
- Grid structure: __grid-wrap role="grid" (aria-label = month) > __weekdays role="row" > __weekday role="columnheader", and __grid role="rowgroup" > __week role="row" > __day role="gridcell".
- Days are <button>s with a full-date aria-label. Exactly one day has tabindex="0" (roving tabindex); arrow keys move by day / week, Page Up / Down by month (JS).
- Selected: aria-selected="true". Today: aria-current="date". Disabled: disabled + aria-disabled="true".
- Prev / next buttons need aria-label. Announce month changes in a visually hidden aria-live="polite" region (.gds-sr-only).
- The popover is role="dialog" with an aria-label; the trigger field gets role="combobox", aria-haspopup="dialog", aria-expanded and aria-controls. Escape closes and focus returns to the field.
- Today is shown with a ring + bold number, not colour alone. Forced-colours mode maps states to system colours.
- Time fields are role="spinbutton" with aria-valuemin / max / now and an aria-label.

**Rules:**
- Wrap weekdays and weeks in __grid-wrap role="grid"; every __day sits in a __week role="row" inside __grid role="rowgroup". *Why:* Gridcells outside a row are invalid ARIA, so screen readers lose row and column position. The static docs previews get this wrong; the ds-core output gets it right. (Accessible by default · auto-checkable)
- .gds-calendar__day is a <button type="button"> with role="gridcell" and a full-date aria-label. *Why:* A bare number like "18" says nothing to a screen reader; a button is focusable and clickable. (Accessible by default · auto-checkable)
- --selected has aria-selected="true", --today has aria-current="date", --disabled has disabled and aria-disabled="true". *Why:* The class only changes the look; the attribute is what assistive tech reads. (Accessible by default · auto-checkable)
- Exactly one __day has tabindex="0"; all others have tabindex="-1". *Why:* Tab should enter the grid once and leave it; 42 tab stops make the form unusable by keyboard. (Accessible by default · auto-checkable)
- Each __nav button has an aria-label ("Previous month" / "Next month"). *Why:* They are icon-only buttons. (Accessible by default · auto-checkable)
- Build parts from existing components: __nav on .gds-btn-icon (ghost, sm), footer actions as .gds-btn--ghost --sm, the trigger as .gds-input, presets as .gds-menu. *Why:* The calendar CSS only adds layout; colours, focus and sizes come from those components. (Reuse before you create · auto-checkable)
- When a day has __day-dot, add what it means to the day's aria-label (e.g. ", 2 articles scheduled"). *Why:* The dot is a visual cue only. (Accessible by default)
- Always render 6 full weeks (42 days); fill before and after the month with --outside days. *Why:* Keeps the 7-column grid aligned and the popover height stable when paging months; matches ds-core. (Obvious over documented · auto-checkable)
- For a working picker use createDatePicker() from @gjirafa/ds-core instead of writing open/close, keyboard and date logic again. *Why:* The CSS ships no behaviour; ds-core already handles keyboard, ARIA, positioning and locale. (Reuse before you create)
- Use one floating surface per picker: .gds-calendar-popover (CSS only) or .gds-popover (ds-core), never both. *Why:* Both draw a border, shadow and radius; nesting them doubles the frame. (Obvious over documented · auto-checkable)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- Fails principle 1 (WCAG 2.2, 2.5.8 target size): the time stepper up/down buttons are about 16×16px; the minimum is 24×24px (axe). *Planned fix:* Give .gds-time-stepper buttons a 24px minimum hit area (padding or min-width/min-height), keeping the 16px icon.
- Two popover surfaces exist: .gds-calendar-popover (absolute, inside .gds-datepicker) and the generic .gds-popover that the ds-core date picker actually renders. Same look, two code paths. *Planned fix:* Make .gds-calendar-popover compose .gds-popover (already planned in the popover docs), then deprecate it and .gds-datepicker.
- ds-core createDatePicker() renders classes that are not in the CSS: gds-datepicker__popover and gds-time-stepper__btn--down. *Planned fix:* Remove them from ds-core, or add them to the CSS and this contract.
- The static docs previews put role="grid" on __grid with gridcells as direct children (no __grid-wrap, no __week rows) and the weekday row outside the grid. That is invalid ARIA; only the ds-core output is correct. *Planned fix:* Update the docs previews to the anatomy above (grid-wrap > weekdays + grid > week > day).
- gds-time-stepper lives in _calendar.scss but uses its own prefix, so it reads like a separate component. *Planned fix:* v3: rename to gds-calendar__stepper, or split it into its own component if other screens need a time field.
- Range modifiers (--range-start, --in-range, --range-end) are styled, but ds-core has no range mode yet. Products must write range logic themselves. *Planned fix:* Add range mode to ds-core (listed as an upcoming phase) or mark the range modifiers beta.
- The presets column reuses .gds-menu, which brings its own border, shadow and min-width, so it may show a framed surface inside the calendar surface. *Planned fix:* Add a flat menu variant (no border / shadow) or reset them under .gds-calendar__presets. Check visually first.
- The state preview helpers .is-hover-preview / .is-focus-preview are also defined for __day (docs only, documented as internal in pagination). They break the BEM naming rule. *Planned fix:* v3: one shared preview mechanism (e.g. a data attribute) for all components.

*Generated from `components/calendar.json`. Edit that file, then run `npm run brand`.*
