# Workspace Instructions for GitHub Copilot

**Bucks2Bar** is a financial dashboard for tracking monthly income and expenses with real-time visualization. It is a static web application built with vanilla HTML, CSS, and JavaScript. Use the existing Bootstrap CDN only as included, and avoid adding build tooling or frameworks unless explicitly requested.

## Project Overview

- **Purpose**: Monthly income/expense tracker with bar chart visualization
- **Tech Stack**: Vanilla JS, Bootstrap 5.3.2 CDN, Chart.js 4.4.0, plain HTML/CSS
- **Key Files**:
  - `index.html` — Two-tab interface: Data entry (12 months) and Chart view
  - `script.js` — All application logic: validation, calculations, chart updates, download functionality
  - Inline styles use CSS custom properties (`:root`) for theme consistency

## Architecture & Data Flow

### Input → Validation → Calculation → Visualization

1. **Username Validation** (`validateUsername()`)
   - Pattern: min 5 chars + 1 uppercase + 1 number + 1 special character
   - Applied on form submit; shows inline error if invalid

2. **Month Input Collection** (`buildMonthRows()`)
   - Creates 12 dynamic month cards (Jan–Dec), each with income/expense inputs
   - IDs follow pattern: `income-{index}`, `expense-{index}` (0–11)
   - All numeric inputs: `type="number"`, `min="0"`, `step="0.01"`

3. **Value Collection & Normalization** (`getNumericValue()`, `collectValues()`)
   - Safely parses all inputs; treats invalid/negative as 0
   - Returns array of 12 objects: `{income, expense}`
   - Called on any input change via event listeners

4. **Totals Calculation** (`updateTotals()`)
   - Sums income and expense across all months
   - Formats using `formatCurrency()` (USD locale, 2 decimals)
   - Updates `#total-income` and `#total-expense` text content

5. **Chart Update** (`updateChart()`)
   - First call: creates Chart.js bar chart with glossy gradients
   - Subsequent calls: updates data and re-renders
   - Tooltips and Y-axis labels show currency formatting
   - Gradients use RGBA for layered color depth effect

### Event Binding

- `bindInputEvents()` attaches listeners to all income/expense inputs
- On input change: calls `updateData()` → recalculates totals & chart
- Username form: custom validation + alert on success

## Style and Implementation Guidance

- **Vanilla JS**: No frameworks. Create reusable utility functions (e.g., `formatCurrency()`, `getNumericValue()`).
- **HTML**: Semantic, accessible markup. Use `aria-label`, `aria-describedby` for form context.
- **CSS**: Use `:root` custom properties (`--bg`, `--card`, `--accent-green`, `--accent-red`). Keep scoped to this app; use Bootstrap utilities for layout.
- **Naming Conventions**:
  - Input IDs: `{type}-{index}` (e.g., `income-0`, `expense-5`)
  - CSS Classes: card, pill-badge, chart-3d, download-btn (all lowercase, hyphenated)
  - Functions: camelCase, action-first (e.g., `updateChart()`, `bindInputEvents()`)
- **UI Elements**: All buttons must be pink (`--download-btn` gradient).
- **Responsive**: Use Bootstrap grid (col-12 col-md-*). Test on mobile & desktop.

## What to Avoid

- Do not rewrite into React, Vue, Angular, or another framework unless explicitly asked.
- Do not upgrade or change CDN dependencies without clear user direction.
- Do not add build systems, bundlers, or transpilation unless requested.
- Do not use global variables; prefer module pattern or IIFE for scope.
- Do not hardcode magic numbers; use named constants (e.g., `const MONTH_COUNT = 12`).

## Common Extension Patterns

### Adding a New Input or Data Field
1. Add ID pattern to month row (e.g., `savings-{index}`)
2. Update `collectValues()` to extract the new field
3. Update `updateTotals()` or chart if needed
4. Bind event listener in `bindInputEvents()`

### Adding a New Calculation or Metric
1. Create utility function (e.g., `calculateNetIncome()`)
2. Call from `updateData()` after `updateTotals()` and `updateChart()`
3. Update DOM text content (e.g., `document.getElementById('net-income').textContent = ...`)

### Adding a New Chart Type or View
1. Create a new canvas element in a new tab (e.g., `id="pie-chart"`)
2. Add tab button and tab-pane in HTML
3. Create chart instance in `updateChart()` or a new function
4. Include in the `updateData()` call sequence

### Modifying Chart Appearance
1. Gradients defined in `updateChart()` using `ctx.createLinearGradient()`
2. Colors: income green gradient, expense red gradient
3. Chart.js config: `borderRadius`, `barThickness`, legend, tooltip callbacks all in options

## When Asking Follow-Up Questions

If a requested change affects more than this single page or introduces new architecture, ask whether the preference applies to the entire app or a specific component.

## Example Prompts to Use with This Workspace

- "Add a quarterly totals view with a pie chart breakdown by quarter."
- "Add data persistence—save user data to localStorage and restore on page load."
- "Refactor `updateData()` to support debouncing so chart updates are less frequent."
- "Add a date range filter to show only Q1, Q2, etc."
- "Change the chart to a line graph showing cumulative income vs. expenses over the year."
- "Add export to CSV functionality for the monthly data."
