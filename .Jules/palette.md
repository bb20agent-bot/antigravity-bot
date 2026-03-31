## 2024-03-31 - Core Navigation Accessibility
**Learning:** The application uses an abstracted `NavItem` component for its main bottom navigation and floating action buttons, all of which are icon-only. This pattern completely hides the core navigation from screen readers.
**Action:** Always ensure custom icon-only navigation components accept and apply an `aria-label` prop, and ensure floating action buttons have explicit `aria-label`s describing their action.
