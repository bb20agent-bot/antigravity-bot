
## 2024-06-08 - Added Visual Feedback for Clipboard Copy in Telegram Mini App
**Learning:** Telegram Mini Apps often lack system-level clipboard notification support, making standard `navigator.clipboard.writeText()` without UI feedback confusing for users. Furthermore, relying purely on the `navigator.clipboard` API fails in some embedded webviews, necessitating a fallback using `document.execCommand('copy')` with a temporary textarea (with `readOnly=true` to prevent keyboard popping).
**Action:** Created a reusable `<CopyButton>` component that provides an inline visual success state (swaps icon from `Copy` to `CheckCircle` for 2 seconds) and implements the necessary fallback mechanism. Added appropriate `aria-label` dynamically updated on state change to improve accessibility.
