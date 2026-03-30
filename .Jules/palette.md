## 2025-02-24 - TMA Clipboard Feedback Requirement
**Learning:** In Telegram Mini Apps (TMA), system-level OS toasts or haptic feedback for clipboard actions (like `navigator.clipboard.writeText`) are not consistently available or triggered. Users are left confused if the copy succeeded.
**Action:** Always implement explicit, inline visual feedback within the app's UI (e.g., temporarily swapping a "Copy" icon with a "Check" icon and updating ARIA labels) whenever a user performs a clipboard copy action.
