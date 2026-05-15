# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

For SEO, content strategy, copywriting, or marketing decisions, also read **`.agents/product-marketing.md`** — it captures the content pillars, voice/tone, non-negotiables (RECO ethics, no fabricated data, no eviction content), recipes for adding new pages, and anti-patterns to refuse. The seo-audit, programmatic-seo, ai-seo, and content-strategy skills auto-load that file.

## What this is

FastLease.ca — a single-page Toronto condo leasing landing site for Property.ca Inc. Brokerage, plus auto-generated `/neighborhoods/<slug>`, `/case-studies/<slug>`, and `/tenants` pages. Bootstrapped from create-t3-app (Next.js 15 App Router, React 19, TS, Tailwind v4, tRPC, Prisma, NextAuth scaffold, Framer Motion). Package manager is **pnpm**.

## Commands

```bash
pnpm dev            # next dev --turbo
pnpm build          # production build
pnpm typecheck      # tsc --noEmit
pnpm check          # biome lint + format check (NOT eslint)
pnpm check:write    # biome lint + format with safe fixes
pnpm db:push        # sync Prisma schema to DB (dev)
pnpm db:generate    # prisma migrate dev (creates + applies migration)
pnpm db:studio      # browse data
./start-database.sh # spin up local Postgres in docker/podman from .env DATABASE_URL
```

`postinstall` runs `prisma generate`. The generated client is emitted to `./generated/prisma` (not `node_modules`), and both `tsconfig.json` and `biome.jsonc` exclude that directory — don't import from there directly, import via `@prisma/client`.

No test runner is configured.

## Architecture

### The page is one orchestrated funnel

`src/app/page.tsx` is a single `"use client"` component that composes ~16 section components from `src/app/_components/sections/`. The whole page is built around lifting two pieces of state up:

- **`modal`** — the `FormModal` (open/closed + `"timeline" | "call"` mode). Every CTA in every section calls one of `openForm` / `openFormWith(prefill)` / `openCall`, which are passed down as props. `FormModal`, `StickyCTA`, `ExitIntent` are the surfaces; the rest are triggers.
- **`calcCtx`** — neighborhood + bedrooms currently selected in `RentWidget`. `Problem` reads it to personalize its copy. If you add a section that depends on the user's inputs, plumb it through `calcCtx`, not its own state.

Every form ultimately calls a mutation on the `lead` tRPC router (`src/server/api/routers/lead.ts`), which writes to the single `Lead` table. There are three lead kinds (`ESTIMATE`, `CALL`, `TENANT_SHORTLIST`) — all denormalized into one row with an estimate snapshot + attribution columns. Email notifications go through Resend if `RESEND_API_KEY` + `LEAD_NOTIFY_EMAIL` are set; otherwise silently no-op.

### Content lives in `src/lib/`, not a CMS

These files are the source of truth — editing them is how you add content:

- `src/lib/leases.ts` — `LEASES` (recent comps), `NEIGHBORHOODS`, `BEDROOM_TYPES`, `NEIGHBORHOOD_MULT`. Adding a lease here surfaces it on the homepage, the relevant `/neighborhoods/<slug>` page, `/tenants`, and the FormModal "Comparable recent leases" panel.
- `src/lib/neighborhoods.ts` — optional per-neighborhood `BLURBS`. A `/neighborhoods/<slug>` route auto-generates for every entry in `NEIGHBORHOODS`.
- `src/lib/case-studies.ts` — `RAW` array; slug derived from title; `/case-studies/<slug>` builds statically.
- `src/lib/faqs.ts` — `HOMEPAGE_FAQS` feeds both the FAQ section and the homepage `FAQPage` JSON-LD.
- `src/lib/estimator.ts` — the model behind the "21-day" claim. `BASE_OFFSETS` (per bedroom type) + `NEIGHBORHOOD_MULT` from leases.ts + seasonal adjustment + over-asking penalty produce `{ days, rentLow, rentHigh, listDate, leaseBy }`. The output is clamped to `[7, 21]` days — that ceiling is load-bearing for the landing page's promise.

### Attribution and analytics are wired in by default

- `src/lib/referral.ts` captures `?ref=` and UTM params on first visit, persists in localStorage, and is attached to every lead's `attribution` field. Don't bypass — call sites should pass `getAttribution()` to mutations.
- `src/lib/analytics.ts` exports a `track(event, props)` that no-ops when PostHog is unconfigured, so it's always safe to add. Three events are mapped to Meta/Google conversion events: `lead_submitted` → Meta `Lead` + Google `event`, `call_booked` → Meta `Schedule`, `form_started` → Meta `InitiateCheckout`. If you add a conversion-worthy event, update the mapping in `_components/providers/Analytics.tsx`.

### Env vars and feature flags

`src/env.js` is the single source of truth (built on `@t3-oss/env-nextjs`). Only `DATABASE_URL` and the two `AUTH_DISCORD_*` vars are required to boot — everything else is optional, and each unset key silently disables the corresponding feature (Cal.com booking, SMS button, Loom embed, RECO license display, Resend notifications, PostHog/Meta/GAds). When adding a third-party integration, follow this pattern: optional env var + silent fallback.

### SEO

- Per-route `generateMetadata` in each page.
- `LocalBusiness` JSON-LD always rendered from root `layout.tsx`.
- `FAQPage` JSON-LD on homepage + each `/neighborhoods/<slug>`; `Article` JSON-LD on each `/case-studies/<slug>` and neighborhood page.
- `src/app/sitemap.ts` and `src/app/robots.ts` generate dynamically — they iterate the same arrays in `src/lib/`, so new content auto-appears.

### T3 scaffold remnants

`Post`, `User`, `Account`, `Session`, `VerificationToken` models, the Discord auth provider, `src/server/auth/`, `protectedProcedure`, and `src/app/_components/post.tsx` are leftover from `create-t3-app` and unused by the live funnel. Don't build new features on the auth scaffolding without confirming with the user — the site is currently designed as fully public, lead-capture only.

### Conventions

- Path alias: `~/*` → `./src/*`.
- TypeScript is strict with `noUncheckedIndexedAccess` (array access yields `T | undefined`) and `verbatimModuleSyntax` (use `import type` for type-only imports).
- Biome enforces sorted Tailwind classes inside `clsx` / `cva` / `cn`. Run `pnpm check:write` before committing if you're touching markup.
- Section components live in `src/app/_components/sections/` and are PascalCase named after their visual section. They are mostly client components and accept callback props from `page.tsx` — they should not own modal state themselves.
