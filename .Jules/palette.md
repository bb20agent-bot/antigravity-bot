## 2025-04-06 - Fandom Link Copy Inline Feedback
**Learning:** In Telegram Mini Apps, system-level OS toasts or haptic feedback for clipboard actions (like `navigator.clipboard.writeText`) are not consistently available to users, making it unclear whether a copy action actually succeeded.
**Action:** Always implement explicit, inline visual feedback. For example, temporarily swap out a "Copy" icon with a "Check" icon for a brief duration (e.g. 2 seconds) and ensure ARIA labels exist to communicate the action correctly.
