## 2024-05-24 - Icon-only Navigation Accessibility
**Learning:** Icon-only navigation buttons (like `NavItem` in the bottom bar) are completely opaque to screen readers without ARIA labels. Additionally, keyboard users need clear focus indicators to know which tab they are currently focusing on, especially on custom elements like bottom navigation bars.
**Action:** Always add `aria-label` to icon-only interactive elements and ensure `focus-visible` styles (e.g., `focus-visible:outline-none focus-visible:ring-2`) are applied for keyboard accessibility.
