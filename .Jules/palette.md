## 2024-05-24 - Add ARIA label to Fandom Link Copy Button
**Learning:** Found an icon-only button without an aria-label, making it inaccessible to screen reader users. The button lacked any visible text, meaning screen readers would read it as a blank button. This is a common pattern in Telegram Mini Apps where space is tight, but accessibility should not be sacrificed.
**Action:** Always add `aria-label` or `title` to icon-only buttons to ensure they are accessible to all users. Add interactive feedback (e.g. changing icon or showing a tooltip) to confirm action.
