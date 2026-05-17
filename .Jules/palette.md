## 2024-06-25 - Focus Visible States
**Learning:** By adding explicit `focus-visible` styling using Tailwind classes (`focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]`), we drastically improve keyboard navigation usability on generic components (like Button) without degrading the visual experience for mouse users (who do not trigger `focus-visible`).
**Action:** Always include a `focus-visible` ring on interactable elements to conform to WCAG contrast and navigability requirements.
