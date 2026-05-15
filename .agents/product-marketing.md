# FastLease — SEO & Content Strategy Guide

This file is product-marketing context for any AI agent working on FastLease.ca content, SEO, or copywriting. It is auto-loaded by the `seo-audit`, `programmatic-seo`, `ai-seo`, and `content-strategy` skills (which check `.agents/product-marketing.md` before asking the user questions). If you are a different agent: read this before writing copy, suggesting content, or proposing SEO changes.

The codebase-level instructions live in `/CLAUDE.md`. This file complements them with the marketing-specific judgment calls.

---

## Business at a glance

**FastLease.ca** is a Toronto residential condo leasing brokerage with a single, contractually binding promise: if a qualified tenant isn't signed by day 21, the brokerage fee automatically drops 21% (from one month's rent to 79% of one month). The 21-day clock is the brand — every content decision should ladder back to it.

**Operator:** Sasha Bastani, Broker. FastLease is a service offering of **Property.ca Inc. Brokerage**, which owns and operates **property.ca** and **condos.ca**. Combined, those two portals see 1M+ monthly registered Toronto-area users. This distribution is the moat — it is *not* a typical independent-realtor situation, and any strategy that frames it that way is wrong.

**Target ICP:** Toronto condo owners with a current or upcoming vacancy. Two sub-segments:
1. Investor-landlords — own one or more units explicitly for yield. Care about days-to-lease and % of asking.
2. Accidental-landlords — own a unit they used to live in, now relocated. Care about peace of mind and avoiding a screening disaster.

**Conversion goal of every content piece:** drive the reader to "Get my 21-day plan" (the form modal). Not newsletter signups, not whitepaper downloads — direct lead capture.

**Operator contact:** contact@fastlease.ca · +1 (647) 835-6368.

---

## Non-negotiables (do not violate without explicit user approval)

1. **No fake data in production.** No fictional phone numbers, no fabricated addresses, no invented case studies, no invented testimonials. The single previous fictional `+1-416-000-0000` placeholder in schema and `+1-416-555-0121` in the footer were both correctness bugs — never reintroduce that pattern. The brokerage is governed by RECO (Real Estate Council of Ontario) — false advertising creates regulatory exposure beyond normal marketing risk.

2. **No content that attracts wrong-fit leads.** FastLease is leasing-only. Specifically refuse:
   - Eviction guides (N4, N12, N13)
   - Renoviction content (Rental Renovation Licence Bylaw etc.)
   - LTB dispute / arrears guides
   - "How to evict a bad tenant" anything
   These attract landlords who need a different service than FastLease offers, and waste the funnel.

3. **No named competitor comparisons.** Comparing against "the standard Toronto brokerage model" (category, generic) is fine and lives at `/vs/standard-toronto-brokerage`. Naming specific brokerages (Royal York, Multidoor, Gerst, etc.) by brand creates RECO and defamation exposure with no SEO upside.

4. **No marketing copy that softens the 21-day promise.** "Up to 21 days" is wrong; the contract specifies 21 days. "Around 14 days" averages are fine to cite as observed results, but the *promise* is 21 with the 21% reduction at day 22. Don't dilute it.

5. **No `"use client"` on top-level page components unless absolutely required.** Server-rendered pages get crawled and indexed; client-rendered ones lose the SSR streaming win and slow LCP. The homepage already has this problem (it's `"use client"` at `src/app/page.tsx`). Don't replicate it for new pages — use the `PageShell` pattern (server page + client island wrapper).

6. **No fabricated statistics.** Specific numbers (days-to-lease, % of asking, distribution audience size) must come from a verifiable source. FastLease's own data is fine to cite. TRREB and CMHC public data is fine to cite with date attribution. AI-confabulated "industry benchmarks" are not fine.

---

## Content pillars (own these three; avoid the rest)

### Pillar 1 — Speed-to-lease economics
The 21-day promise, days-on-market math, the dollar cost of vacancy, the economic case for pricing precision over fee discounting. Every page in this pillar should make the case that the fee is small relative to vacancy cost.

### Pillar 2 — Toronto micro-market data
Per-neighborhood, per-bedroom lease outcomes. This is FastLease's proprietary moat: competitors have listings; FastLease has *outcomes* (days, % of asking, comparables by bedroom × neighborhood). Highest-defensibility content in the entire strategy.

Source-of-truth: `src/lib/leases.ts` (`LEASES` array). All matrix pages, neighborhood pages, and quarterly reports derive from this. Adding a row here automatically generates pages.

### Pillar 3 — Fee economics for landlords
What a Toronto leasing fee buys, ROI vs DIY landlording, the cost math on bad screening. This pillar's purpose is to defuse commission objections at the consideration stage.

### Pillars to NOT build
- Eviction / LTB / tenant disputes (wrong-fit leads, see non-negotiable #2)
- Property management (different product than FastLease)
- Tenant-side content (the existing `/tenants` page is sufficient; don't expand)
- Buying / selling content (FastLease is leasing-only)
- Generic real-estate-blog content ("5 tips for landlords") — Google's helpful-content system demotes this

---

## Content priority order

When asked "what should we write next?", the priority order is:

1. **A new case study** — `src/lib/case-studies.ts`. Real, signed, with the actual week-by-week narrative from Sasha. These are the highest-converting AI-citable assets. Aim for 1/month.
2. **A new lease in `LEASES`** — adds proof, refreshes per-neighborhood `dateModified`, expands the matrix pages if a new (neighborhood, bedroom) cell becomes covered.
3. **A new glossary post** — `src/lib/glossary.ts`. Mid-funnel research traffic. Aim for 1/month.
4. **A new quarterly report** — `src/lib/reports.ts`. Once per quarter. Auto-aggregates from `LEASES`.
5. **A new building profile** (not yet built) — `/buildings/<slug>`. Highest moat per programmatic-seo audit, but data-heavy. Recommend only when `LEASES` has 30+ entries.

---

## Adding new content — recipes

### Recipe 1: Add a new lease comp
File: `src/lib/leases.ts`. Append to `LEASES`:
```ts
{ n: "King West", u: "1BR", listed: 2700, leased: 2725, days: 12, signed: "Jun 2026" }
```
Effects:
- Homepage proof refreshes
- Neighborhood page for "King West" auto-updates `avgDays`, `avgRent`, `dateModified`
- Matrix page `/leasing/king-west/1br` shows the new row in comparables table
- Sitemap `lastModified` advances
- Next quarterly report (`/reports/q?-2026-...`) includes it if signed in that quarter

### Recipe 2: Add a case study
File: `src/lib/case-studies.ts`. Append to `RAW`:
```ts
{
  title: "Liberty Village 2BR — listed May 4, signed May 17",
  summary: "Two-paragraph narrative summary.",
  neighborhood: "Liberty Village",
  unitType: "2BR",
  listed: 3450, leased: 3500, daysToLease: 13, signedDate: "May 2026",
  weeks: [
    { label: "Week 1", day: 3, headline: "...", body: "..." },
    // 2-3 more weeks
  ],
}
```
**Critical:** the `weeks` narrative must be real. Get the actual showings count, application count, signing decision from Sasha. **Do not fabricate. RECO ethics issue.**

### Recipe 3: Add a glossary post
File: `src/lib/glossary.ts`. Append to `GLOSSARY_POSTS`. Required fields: `slug`, `title`, `summary`, `datePublished`, `dateModified`, `readingMinutes`, `sections[]`, `faq[]`.

Structure for sections:
- Lead with the definition/short answer in the first paragraph (no heading) — this is the snippet AI extracts
- 4–7 H2 sections, each with 1–3 paragraphs
- Each paragraph one clear idea; aim 40–80 words
- End with FAQ (4–6 Q&As) — these become FAQPage JSON-LD

Voice: declarative, specific, no marketing fluff. See the three existing posts as the calibration target.

### Recipe 4: Add a quarterly report
File: `src/lib/reports.ts`. Append to `REPORTS`:
```ts
{
  slug: "q2-2026-toronto-condo-leasing",
  title: "Q2 2026 Toronto Condo Leasing Report",
  quarter: "Q2", year: 2026,
  periodLabel: "April–June 2026",
  rangeStart: "Apr 2026", rangeEnd: "Jun 2026",
  summary: "...",
  datePublished: "2026-07-15",
}
```
The page auto-aggregates from `LEASES` based on `rangeStart`/`rangeEnd`. Methodology section is hard-coded in the template and doesn't need editing.

### Recipe 5: Add a new "vs" comparison page
Path: `src/app/vs/<slug>/page.tsx`. Follow the pattern in `/vs/standard-toronto-brokerage`. **Do not name specific competitor brokerages.** Compare against categories or industry-typical models only.

### Recipe 6: Add a new neighborhood
File: `src/lib/leases.ts`. Add to `NEIGHBORHOODS`, add a multiplier to `NEIGHBORHOOD_MULT`, optionally add a blurb to `BLURBS` in `src/lib/neighborhoods.ts`. The neighborhood page auto-generates. If any rows are added to `LEASES` for this neighborhood, matrix pages auto-generate.

---

## SEO conventions in this codebase

### Schema markup (JSON-LD)
All helpers are in `src/lib/seo.ts`:
- `localBusinessSchema()` — emitted in `src/app/layout.tsx`, every page. Includes Toronto `PostalAddress`, telephone, parent organization (Property.ca Inc. Brokerage).
- `serviceOfferSchema()` — emitted in `layout.tsx`. Describes the 21-day Service with two Offer price tiers (1 month / 79% of 1 month).
- `articleSchema({ title, description, url, datePublished, dateModified?, author? })` — every neighborhood, case study, glossary, comparison, and report page. Default author is "Sasha Bastani" with `worksFor: Property.ca Inc. Brokerage`.
- `faqSchema(items)` — every page with a FAQ section. Required for AI snippet extraction.

When adding a new page type, always emit at minimum: `articleSchema` and `faqSchema` (if FAQs exist). Use `parseMonthYear()` + `toIsoDate()` to derive real `dateModified` from data rather than hardcoding.

### Sitemap
`src/app/sitemap.ts` auto-aggregates from `LEASES`, `NEIGHBORHOOD_META`, `CASE_STUDIES`, `MATRIX_CELLS`, `GLOSSARY_POSTS`, `REPORTS`. New content added to those source-of-truth arrays appears in the sitemap at the next build. Do not hardcode URLs in the sitemap.

### robots.ts
Allows everything except `/api/`. Critically: **AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Bingbot) are not blocked.** Do not add blocks for them — citation by AI search is part of the strategy.

### Canonical URLs
Every page sets `alternates.canonical` in its `generateMetadata`. The homepage canonical is `env.NEXT_PUBLIC_SITE_URL`. Sub-pages use `${SITE.url}/<path>`. Never use relative canonicals.

### Machine-readable files
- `public/llms.txt` — agent-facing brand summary per [llmstxt.org](https://llmstxt.org). Update if the 21-day mechanics or operator change.
- `public/pricing.md` — structured pricing tiers, parseable by AI buying agents. Update if the fee structure changes.

These two files are load-bearing for AI search visibility. Treat them as production assets, not READMEs.

---

## Voice & tone

The existing FAQ (`src/lib/faqs.ts`) and case study (`src/lib/case-studies.ts`) are the calibration target. Specifically:

- **Declarative, not promotional.** "Your fee drops 21%" not "We promise to do our absolute best to lease your unit as fast as humanly possible."
- **Specific, not abstract.** "5-layer screening: credit, income-to-rent ratio, employment verification, two prior-landlord references by phone, document authentication" not "rigorous screening process."
- **Contrarian where accurate.** "A no-pets clause in an Ontario lease is unenforceable" not "consult your lawyer about pet policies." When you know something most people don't, say it directly.
- **No corporate hedging.** Avoid "leverage," "synergy," "best-in-class," "industry-leading," "world-class," "robust." Don't write "in today's market" or "in this competitive landscape."
- **Plain typography for ideas.** Use em-dashes for compound clauses. Use parentheticals sparingly. Use short paragraphs (40–80 words). Don't bullet-point what is clearly a sentence.
- **First-person voice is fine for Sasha-bylined posts.** "We" refers to FastLease. "I" should only appear if the post is explicitly first-person from Sasha.

A useful smell test: does the sentence read like something a smart broker would say at coffee, or like something a marketing team wrote? Aim for the first.

---

## Fact-checking required

Any of these claims need a verifiable source before publishing:

- **TRREB days-on-market statistics.** Use most recent quarterly release; cite by quarter. Old averages mislead.
- **Toronto Rent Increase Guideline percentages.** Government of Ontario publishes annually. 2025 was 2.5%; 2026 may differ.
- **Residential Tenancies Act section numbers.** Cross-check at ontario.ca/laws/statute/06r17. Specific sections cited in the glossary (s. 14 no-pets, s. 22 quiet enjoyment, etc.) should be verified before any major copy refresh.
- **Form 2229E mandatory-since date.** April 30, 2018, per Government of Ontario.
- **Property.ca + condos.ca monthly audience.** Sasha should provide the current verified number. The "1M+ monthly registered Toronto-area users" figure is what's currently used; update if the verified number changes materially.

Claims that **do not** need external verification:
- FastLease's own lease outcome data (drawn from `LEASES`)
- The mechanics of the FastLease 21-day-or-21% offer (it's a contractual term, not a market statistic)
- The five-layer screening process (it's FastLease's own procedure)

---

## AI-search optimization rules

Per the Princeton GEO research (2024) and current AI Overviews observations:

1. **Lead every section with a direct answer.** AI extracts the first 40–80 words of a section as the snippet. Don't bury the answer in paragraph three.
2. **Statistics with provenance beat statistics without.** "Toronto condos averaged ~24 DOM in 2025 (TRREB)" beats "Toronto condos take a while to lease."
3. **Tables beat prose for comparisons.** AI parses structured comparisons more accurately. Use `<table>` for any "X vs Y" content.
4. **One direct H1 per page, query-shaped.** "How long should a Toronto condo take to lease?" matches a real search query. "Speed of leasing in Toronto" doesn't.
5. **Author + dateModified visible on the page.** Not just in schema. Visible byline + visible "Updated [date]" line.
6. **Keyword stuffing actively reduces AI visibility.** Princeton GEO measured −10%. Write for clarity, not for keyword density.
7. **`llms.txt` and `pricing.md` must stay current.** They are AI-agent entry points; stale data here is worse than no data.

---

## Anti-patterns to refuse

If a user (or a strategy document) asks you to do any of these for FastLease, decline and explain:

| Anti-pattern | Why refuse |
|---|---|
| Add fictional case studies | RECO ethics, false advertising risk |
| Add fake reviews or `AggregateRating` | Schema fraud — Google penalizes; RECO penalizes harder |
| Add a `Property Management Company` secondary category to Google Business Profile | Misrepresents service category, GBP suspension risk |
| Write renoviction or N13 content | Attracts wrong-fit leads |
| Compare against named competitor brokerages | RECO ethics + defamation exposure |
| Buy citations on Foursquare/Houzz/Yellow Pages-style directories | Deprecated SEO signal, not worth budget |
| Block AI crawlers in robots.txt | Removes citation opportunities |
| Soften the 21-day promise ("up to 21 days", "around 21 days") | Contradicts the contract |
| Set `lastModified: new Date()` in sitemap | Google ignores fake-frequent updates; use real content dates |
| Hardcode a phone number in JSON-LD without checking it matches GBP | NAP mismatch hurts local SEO |
| "Top X" listicle posts | Generic content, helpful-content system demotes |

---

## Build & verify checklist (before claiming SEO/content work is done)

```bash
pnpm build          # must compile and statically generate
pnpm check          # biome lint+format (project has pre-existing errors; only block on new ones from your edits)
```

For substantive content additions:
- [ ] `pnpm build` shows the new route(s) in the static-pages output
- [ ] New URL appears in `pnpm dev` then `curl localhost:3000/sitemap.xml | grep <new-slug>`
- [ ] JSON-LD validates at [Google Rich Results Test](https://search.google.com/test/rich-results) (manual; ask user to run)
- [ ] Visible byline + visible `Updated` date on the page
- [ ] No fabricated stats in body copy
- [ ] At least one internal link to the new page from a parent context (homepage / neighborhood / index)

Pre-existing typecheck failures live in `public/scripts/*.js`, `src/lib/estimator.ts`, and `src/lib/referral.ts`. Do not "fix" them unless asked — they are unrelated to SEO/content work and may be intentional dev-state.

---

## When in doubt

- **Pull from `src/lib/leases.ts`, not from imagination.**
- **Read the existing FAQ for voice.**
- **Re-read the 21-day promise — does this content support it?**
- **Ask Sasha for primary sources rather than guess.**
