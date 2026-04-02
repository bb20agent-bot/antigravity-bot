## 2024-04-02 - Added `aria-label` to icon-only NavItem buttons
**Learning:** Icon-only navigation buttons in custom app layouts (like `src/App.tsx` and `user/UserApp.tsx`) lack accessibility out-of-the-box. Screen readers will just announce them as "button" unless provided an `aria-label`.
**Action:** Adding an optional `ariaLabel` prop to the generic `NavItem` component and passing relevant names (e.g., "Home", "Live", "My Office", etc.) so visually impaired users know what tab they are clicking on.
