
## 2024-05-21 - Telegram Mini App Clipboard Fallback Pattern
**Learning:** In Telegram Mini Apps, system-level toast notifications and modern async clipboard APIs (`navigator.clipboard.writeText`) are often unreliable due to security contexts or embedded webview restrictions.
**Action:** When implementing copy-to-clipboard functionality, always provide a fallback mechanism using `document.execCommand('copy')` with a temporary `textarea` element. Additionally, provide inline visual feedback (e.g., swapping icons) instead of relying on external toasts, and dynamically update `aria-label` attributes to ensure screen readers announce the success state.
