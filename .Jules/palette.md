## 2024-05-15 - Icon-only Navigation Accessibility
**Learning:** The main bottom navigation relies entirely on icons without visible labels or screen reader context. Furthermore, keyboard users cannot easily determine which tab is focused due to the lack of focus rings.
**Action:** Always add `aria-label` to icon-only navigation items and ensure `focus-visible:ring-2` is applied for clear keyboard focus states without affecting mouse users.
