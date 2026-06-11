# Custom Agents for Bucks2Bar

Custom agents below are specialized for common tasks in this project. Invoke them using `/new-agent @agent-name` or specify them in chat when asking for specific types of work.

---

## @feature-dev

**Purpose**: Add new financial tracking features, calculations, or data visualizations to Bucks2Bar.

**Expertise**:
- Extend the data collection pipeline (add new input fields, validation rules)
- Implement new charts or metrics (e.g., quarterly summaries, net income trends)
- Connect new calculations to the existing `updateData()` flow
- Maintain vanilla JS patterns and Bootstrap styling consistency

**When to use**:
- "Add a savings rate calculator"
- "Create a pie chart showing income vs. expense breakdown"
- "Add year-over-year comparison"

**Constraints**:
- No new frameworks or build tools
- Preserve existing CDN dependencies
- All buttons must use pink gradient styling
- Maintain responsive Bootstrap grid

---

## @refactor

**Purpose**: Improve code structure, eliminate duplication, and enhance maintainability.

**Expertise**:
- Identify and consolidate repeated code patterns
- Extract reusable utility functions
- Optimize event binding and data flow
- Improve variable naming and code organization

**When to use**:
- "Reduce duplication in the chart configuration"
- "Extract a month data manager module"
- "Debounce chart updates for performance"

**Constraints**:
- No API or external dependency changes
- All existing functionality must remain intact
- Keep vanilla JS (no library abstractions)

---

## @accessibility-qa

**Purpose**: Audit and improve accessibility, keyboard navigation, and semantic HTML.

**Expertise**:
- Verify ARIA labels and form descriptions
- Test keyboard navigation and focus management
- Ensure color contrast and semantic structure
- Test with screen reader patterns

**When to use**:
- "Audit accessibility of the data entry form"
- "Add keyboard shortcuts for chart export and tab switching"
- "Ensure all interactive elements are discoverable"

**Constraints**:
- No visual design changes
- Bootstrap components must remain accessible
- Test changes in common screen readers (NVDA, JAWS patterns)

---

## @bug-fix

**Purpose**: Diagnose and fix runtime errors, edge cases, and unexpected behaviors.

**Expertise**:
- Trace data flow to identify calculation errors
- Handle edge cases (invalid inputs, extreme values, timing issues)
- Debug Chart.js rendering issues
- Test currency formatting edge cases

**When to use**:
- "Chart doesn't update when I clear a field"
- "Large numbers are not formatting correctly"
- "Username validation is rejecting valid input"

**Constraints**:
- Only fix reported issues; do not refactor
- Preserve all existing behavior for valid inputs
- Add defensive checks (e.g., `getNumericValue()` pattern)

---

## @docs

**Purpose**: Update project documentation and add helpful inline comments.

**Expertise**:
- Write clear function comments and code block explanations
- Update `README.md` or inline documentation
- Document architectural decisions and data flow
- Create usage examples for complex features

**When to use**:
- "Add JSDoc comments to all functions"
- "Document the chart gradient system"
- "Create a guide for extending the app"

**Constraints**:
- Do not change code logic
- Focus on clarity and maintainability
- Link to existing docs rather than duplicate
