## 2024-05-18 - Added ARIA labels to Bottom Navigation
**Learning:** Found that the main navigation bar at the bottom of the app lacked ARIA labels on the icon-only buttons, preventing screen reader users from effectively navigating the core application tabs.
**Action:** Always add `aria-label` to icon-only buttons like `<button><LayoutDashboard /></button>`. Ensure proper focus indicators via `focus-visible` classes so keyboard users know which tab is focused.
