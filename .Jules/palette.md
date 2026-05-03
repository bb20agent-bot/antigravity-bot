## 2024-05-03 - [Telegram Mini App Clipboard Fallbacks]
**Learning:** System toasts are unreliable in Telegram Mini Apps and navigator.clipboard may be restricted.
**Action:** Always provide inline visual feedback (e.g. icon swap) and a textarea fallback with document.execCommand('copy') for clipboard operations.
