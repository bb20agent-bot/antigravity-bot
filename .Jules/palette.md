## 2026-03-25 - Missing ARIA Labels on Icon-Only Navigation Buttons
**Learning:** Generic wrapper components used for icon-only buttons (like `NavItem` in this app's bottom navigation) frequently miss `aria-label` attributes because the parent wrapper abstracts away the underlying `<button>`. This creates an invisible trap for screen readers across the entire app's primary navigation.
**Action:** When creating or modifying reusable button wrappers (especially icon-only ones), always expose an `ariaLabel` prop and aggressively verify its usage across all primary navigation instances.
