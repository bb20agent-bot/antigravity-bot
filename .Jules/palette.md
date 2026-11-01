## 2026-11-01 - Clipboard Fallback in Mini Apps
**Learning:** Telegram Mini Apps often lack standard clipboard permissions. Relying solely on navigator.clipboard.writeText fails silently. Providing explicit visual feedback via inline state (e.g., swapping a Copy icon to a Check icon) is critical because system toasts are unreliable.
**Action:** Implemented a reusable CopyButton using document.execCommand fallback and dynamic aria-labels.
