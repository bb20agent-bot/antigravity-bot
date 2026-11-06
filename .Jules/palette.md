## 2024-05-24 - [Title]
**Learning:** [UX/a11y insight]
**Action:** [How to apply next time]
## 2024-05-24 - Bottom Navigation Keyboard Accessibility
**Learning:** Telegram Mini App bottom navigation components implemented with custom icon buttons lack semantic meaning for screen readers and focus visibility for keyboard users.
**Action:** Always map generic descriptive labels to `aria-label` and apply explicit `focus-visible` states (e.g. `focus-visible:ring-2`) to all interactive elements, even those primarily designed for touch interfaces.
