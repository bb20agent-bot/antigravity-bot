
## 2024-05-15 - Fandom Link Copy Button Enhancement
**Learning:** In Telegram Mini Apps (which run in a secure webview but often behave unpredictably with certain native APIs), providing visual feedback when copying text to the clipboard is critical because system-level copy notifications don't consistently appear. A temporary state change (e.g., swapping a Copy icon to a Check icon for 2 seconds) and dynamic `aria-label` attribute changes provide immediate clarity and accessible verification to users.
**Action:** When implementing any clipboard interaction, always include fallback `document.execCommand('copy')` logic for restricted environments, update dynamic ARIA labels upon success, and include inline visual feedback since native toasts cannot be relied upon in embedded webviews.
