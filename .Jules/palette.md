## 2026-07-17 - Adding Accessible NavItem Labels
**Learning:** Reusable React components that map to standard HTML elements (like `<button>`) should forward accessibility attributes. When adding `aria-label` capabilities, using an optional prop like `label?: string` combined with `focus-visible:ring-2` provides keyboard users with semantic context and visual focus state without breaking existing references.
**Action:** Always add an optional label prop bound to `aria-label` and apply explicit `focus-visible` utility classes for interactive components without visible text.
