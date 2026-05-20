## 2024-05-18 - Reliable Copy Feedback in Embedded WebViews
**Learning:** System-level toast notifications or basic clipboard writes can be unreliable in embedded WebViews like Telegram Mini Apps.
**Action:** When implementing copy-to-clipboard functionality, always provide a fallback mechanism using `document.execCommand('copy')` with a temporary dynamically created `textarea` element. Additionally, explicitly provide inline visual feedback (e.g., swapping a Copy icon to a Check icon) and dynamically update `aria-label` attributes to communicate success.
