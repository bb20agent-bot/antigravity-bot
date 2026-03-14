## 2024-05-24 - Navigation Bar Accessibility & Tooltips
**Learning:** Icon-only navigation bars are common in mobile/web hybrid apps but often lack context for screen readers and sighted users who might not recognize every icon.
**Action:** Always add `aria-label` (for screen readers) and `title` (as a native tooltip for sighted users on hover) to icon-only buttons, along with explicit `focus-visible` styles for keyboard navigation.
