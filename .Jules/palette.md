## 2024-03-24 - [Clipboard API Fallback in Telegram Mini Apps]
**Learning:** Telegram Mini Apps often lack a secure context or fully support the Clipboard API, causing navigator.clipboard.writeText to fail or trigger redundant prompts. System-level toast notifications are also unreliable in these embedded webviews.
**Action:** Always provide a fallback to document.execCommand('copy') with a hidden readonly textarea, and use inline visual feedback (e.g. icon swap to Check and dynamic aria-label) rather than global toast notifications.
