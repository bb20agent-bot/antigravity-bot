## 2024-05-14 - Navigation Bar Accessibility
**Learning:** Telegram Mini App bottom navigation bar elements need ARIA labels mapped to explicitly passed props and visible focus rings `focus-visible:ring-2` to support keyboard and screen reader accessibility beyond default touch interactions.
**Action:** Always add semantic `aria-label` and `focus-visible:ring-2` classes to icon-only bottom navigation buttons.
