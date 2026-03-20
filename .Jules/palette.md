## 2023-10-27 - Icon-Only Navigation Accessibility
**Learning:** Found that the primary navigation menu relied entirely on Lucide React icons without any text labels or ARIA labels. Since `NavItem` wraps icons as raw elements, screen readers would skip them entirely or announce non-descriptive elements, making the app unnavigable for visually impaired users.
**Action:** Always pass and apply an explicit `aria-label` to custom navigation wrappers (like `NavItem`) that render icon-only buttons, and ensure the parent `<nav>` has a descriptive `aria-label` as well.
