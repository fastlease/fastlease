## 2024-05-15 - Testing Constraints
**Learning:** node_modules is missing from the repository, and dependencies cannot be installed via pnpm/npm due to network restrictions, which prevents running normal test and build commands like `pnpm build`, `pnpm typecheck`, or `npx biome`.
**Action:** Relied on static analysis and visual code inspection rather than execution to verify changes.
