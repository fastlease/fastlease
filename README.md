# FastLease.ca

21-day Toronto condo leasing site for Property.ca Inc. Brokerage.

Stack: Next.js 15 App Router · React 19 · TypeScript · Tailwind v4 · tRPC · Prisma · Framer Motion.

---

## Quick start

```bash
pnpm install
cp .env.example .env  # then fill in DATABASE_URL + optional keys below
pnpm db:push          # apply Prisma schema to your DB
pnpm dev
```

## Environment variables

Only `DATABASE_URL` and the two `AUTH_DISCORD_*` vars are required to boot. Every other key unlocks a feature — leave it unset and the feature stays silent. See `src/env.js` for the source of truth.

### Required

| Var | What it does |
|---|---|
| `DATABASE_URL` | Postgres connection. Powers Lead capture. |
| `AUTH_DISCORD_ID` / `AUTH_DISCORD_SECRET` | NextAuth scaffolding (kept from T3 init; remove if not used). |

### Operator identity (public-facing)

| Var | What it does |
|---|---|
| `NEXT_PUBLIC_RECO_LICENSE_NUMBER` | Renders RECO license number in Operator section, linked to RECO's public registrant search. |
| `NEXT_PUBLIC_LOOM_VIDEO_ID` | Embeds the Loom intro in the Operator section. Otherwise a placeholder card renders. |

### Funnel / conversion

| Var | What it does |
|---|---|
| `NEXT_PUBLIC_CAL_USERNAME` | Renders Cal.com inline calendar inside the call modal. Without it, the manual time-window form is used. |
| `NEXT_PUBLIC_CAL_EVENT` | Cal.com event slug (default: `15min`). |
| `NEXT_PUBLIC_SMS_NUMBER` | Adds a "Text Sasha" button to the mobile sticky CTA. E.164 format. |

### Lead notifications

| Var | What it does |
|---|---|
| `RESEND_API_KEY` | API key for [resend.com](https://resend.com). Lead router posts a notification email to `LEAD_NOTIFY_EMAIL`. |
| `LEAD_NOTIFY_EMAIL` | Where lead notifications get sent. |

### Analytics & retargeting

| Var | What it does |
|---|---|
| `NEXT_PUBLIC_POSTHOG_KEY` | Loads PostHog client; events from `src/lib/analytics.ts` start flowing. |
| `NEXT_PUBLIC_POSTHOG_HOST` | Optional region override (default `https://us.i.posthog.com`). |
| `NEXT_PUBLIC_META_PIXEL_ID` | Loads Meta Pixel + PageView, maps `lead_submitted` → Meta `Lead`. |
| `NEXT_PUBLIC_GADS_ID` | Loads Google `gtag` with the supplied measurement ID. |

### Misc

| Var | What it does |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for OpenGraph + sitemap. Default `https://fastlease.ca`. |

---

## Funnel surfaces

| Surface | File | When it fires |
|---|---|---|
| Hero CTA | `src/app/_components/sections/Hero.tsx` | Always visible. |
| Inline rent estimator | `src/app/_components/sections/RentWidget.tsx` | Above the fold equivalent. |
| Form modal (4 steps) | `src/app/_components/sections/FormModal.tsx` | Triggered from any CTA. Email-gated reveal at step 3. |
| Sticky CTA (mobile) | `src/app/_components/sections/StickyCTA.tsx` | Mobile only, after 700px scroll. |
| Exit intent | `src/app/_components/sections/ExitIntent.tsx` | Desktop only, once per session, after 600px scroll, on mouseleave-top. |
| Tenant shortlist | `src/app/tenants/page.tsx` | Standalone `/tenants` page for renter-side traffic. |

Every form writes to the `Lead` table via `src/server/api/routers/lead.ts`.

---

## Adding content

### A new neighborhood

1. Add the name to `NEIGHBORHOODS` in `src/lib/leases.ts`.
2. (Optional) Add a tailored blurb in `src/lib/neighborhoods.ts` (`BLURBS` map).
3. Static page generates automatically at `/neighborhoods/<slug>`.

### A new case study

Append an entry to `RAW` in `src/lib/case-studies.ts`. Slug is generated from the title; static page builds at `/case-studies/<slug>`.

### A new lease comparable

Append to `LEASES` in `src/lib/leases.ts`. Auto-surfaces on the homepage, neighborhood page (filtered), `/tenants`, and the FormModal "Comparable recent leases" panel.

### A new FAQ

Edit `HOMEPAGE_FAQS` in `src/lib/faqs.ts`. The homepage component reads from there; FAQ JSON-LD updates automatically.

---

## Analytics events

Defined in `src/lib/analytics.ts`. Add new events to the `Events` enum; call `track(Events.X, props)` from any client component. Calls are no-ops when PostHog is unconfigured, so always safe to add.

Conversion events mapped to ad platforms:
- `lead_submitted` → Meta `Lead`, Google `event`
- `call_booked` → Meta `Schedule`
- `form_started` → Meta `InitiateCheckout`

---

## Referrals

URL param `?ref=CODE` is captured on first visit and persisted in localStorage (`src/lib/referral.ts`). Every Lead row stores `referralCode`, `utmSource`, `utmMedium`, `utmCampaign`, and `landingPath`.

To create a referral code, insert a `Referral` row manually (`pnpm db:studio`) with `code`, `ownerEmail`, `ownerName`. Each Lead that submits with that code auto-increments `uses` and updates `lastUsedAt`.

---

## SEO

- Per-route metadata in each page file's `generateMetadata`.
- `LocalBusiness` JSON-LD in root layout (always present).
- `FAQPage` JSON-LD on homepage from `HOMEPAGE_FAQS`.
- `FAQPage` + `Article` JSON-LD on each `/neighborhoods/<slug>` page.
- `Article` JSON-LD on each `/case-studies/<slug>` page.
- `sitemap.xml` and `robots.txt` generated by `src/app/sitemap.ts` and `src/app/robots.ts`.

---

## Database

```bash
pnpm db:push        # dev: sync schema directly
pnpm db:generate    # create + apply a migration
pnpm db:studio      # prisma studio
```

Models:
- `Lead` — every form submission (estimate, call, tenant shortlist).
- `Referral` — landlord referral codes.
- `User`, `Account`, `Session`, `VerificationToken`, `Post` — kept from T3 scaffold.

---

## Scripts

```bash
pnpm dev            # next dev --turbo
pnpm build          # production build
pnpm typecheck      # tsc --noEmit
pnpm check          # biome lint
pnpm db:studio      # browse data
```
