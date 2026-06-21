
## 2023-10-25 - [Inline Copy Feedback in Mini Apps]
**Learning:** System-level toast notifications or alert boxes can be unreliable or intrusive inside embedded webviews like Telegram Mini Apps. Additionally, `navigator.clipboard` APIs frequently fail in insecure contexts without strict HTTPS or specific permissions, necessitating a robust fallback mechanism for simple actions like copying a link.
**Action:** Always provide inline visual feedback directly on the element (e.g., swapping a Copy icon to a Check icon for 2 seconds) and ensure a `document.execCommand('copy')` fallback using an off-screen `<textarea>` is available whenever copying to the clipboard. Wait to log generic a11y labels in the future.
