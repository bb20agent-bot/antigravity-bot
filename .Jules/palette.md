## 2024-06-10 - [Accessibility] NavItem button missing aria-label
**Learning:** The NavItem component used for the bottom navigation bar is just an icon-only button, and it does not have an aria-label. This is a common accessibility issue for icon-only buttons.
**Action:** Adding an `aria-label` or `title` to the `NavItem` component, and update the usage to pass a descriptive label.
