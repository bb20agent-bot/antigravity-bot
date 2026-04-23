
## 2024-05-18 - [App Navigation Accessibility Pattern]
**Learning:** The primary bottom navigation and top interactive profile `div` in the main `UserApp` lacked standard ARIA labels, semantic `role` attributes, and `focus-visible` styling, making them entirely inaccessible to screen readers and keyboard users despite their central role in navigating the app.
**Action:** When auditing or implementing app-like navigation menus and custom interactive `div` elements, always prioritize adding appropriate `aria-label`s, `role="button"` (if not using `<button>`), `tabIndex={0}`, keyboard event handlers (`onKeyDown`), and robust `focus-visible` states to ensure foundational keyboard and screen reader accessibility.
