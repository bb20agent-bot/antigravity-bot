## 2024-04-08 - Inline Clipboard Feedback in Telegram Mini Apps
**Learning:** Telegram Mini Apps often lack consistent access to system-level OS toasts or haptic feedback for clipboard actions (like `navigator.clipboard.writeText`), leaving users without confirmation that an action succeeded.
**Action:** Always implement explicit, inline visual feedback (e.g., temporarily swapping a "Copy" icon with a "Check" icon) and ensure ARIA labels are present when performing clipboard operations to provide a reliable and accessible user experience.
