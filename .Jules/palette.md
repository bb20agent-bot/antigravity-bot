## 2025-05-15 - [Telegram Mini App Clipboard Feedback]
**Learning:** Telegram Mini Apps (TMA) do not consistently provide system-level OS toasts or haptic feedback for clipboard actions (like `navigator.clipboard.writeText`), meaning users may not realize a link was copied.
**Action:** Always implement explicit, inline visual feedback (e.g., temporarily swapping a "Copy" icon with a "Check" icon) and update ARIA labels when performing clipboard operations in TMAs.
