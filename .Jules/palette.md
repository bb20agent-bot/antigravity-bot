## 2024-05-17 - Accessible Navigation Bar
**Learning:** Icon-only navigation bars are extremely common in Telegram Mini Apps to save space, but they frequently lack accessibility. Adding dynamic `label` props that map to `aria-label` ensures screen readers can announce the navigation destinations clearly, without breaking the compact visual design.
**Action:** When creating or modifying a navigation bar with icon-only buttons, always ensure a `label` or `aria-label` property is included to identify the route or action being taken.
