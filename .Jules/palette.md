## 2024-05-24 - Accessibility improvements for clipboard copy icon button
**Learning:** Found an icon-only button for "Copy to clipboard" lacking an aria-label which hurts accessibility. Also, standard toast notifications might fail in Telegram Mini Apps, so we should provide inline visual feedback (like swapping icons). I need to ensure fallback copying works with a robust temporary textarea.
**Action:** Always add aria-labels to icon-only buttons, use an inline Check icon for success feedback instead of relying on toasts, and implement a robust clipboard copy with fallback.
