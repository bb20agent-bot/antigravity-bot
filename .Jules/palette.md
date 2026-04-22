
## 2023-10-24 - Telegram Mini App Clipboard Limitations
**Learning:** System-level haptic feedback and toast notifications for clipboard actions are not consistently available or reliable within Telegram Mini Apps. Additionally, `navigator.clipboard` access can fail depending on the secure context or the specific WebView wrapper implementation.
**Action:** When implementing copy-to-clipboard functionality, always include a fallback mechanism using `document.execCommand('copy')` with an invisible `textarea`. Crucially, provide explicit inline visual feedback (e.g., briefly replacing a 'Copy' icon with a 'Check' icon) and dynamically update `aria-label` attributes to communicate success instead of relying on OS-level toasts.
