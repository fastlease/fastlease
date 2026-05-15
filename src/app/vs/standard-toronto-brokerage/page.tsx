import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { InlineCTA, PageShell } from "~/app/_components/PageShell";
import { Reveal } from "~/app/_components/ui/Reveal";
import { articleSchema, faqSchema, SITE } from "~/lib/seo";

const URL = `${SITE.url}/vs/standard-toronto-brokerage`;
const TITLE = "FastLease vs the standard Toronto brokerage model";
const SUMMARY =
	"Toronto landlords typically hire a leasing agent on a best-effort contingent fee. FastLease puts the timeline itself on the contract. Here's a structured comparison of what each model actually promises.";

const ROWS: { dim: string; standard: string; fastlease: string }[] = [
	{
		dim: "Fee model",
		standard:
			"One month rent on signed lease. Industry-standard contingent payment — you pay if it leases, when it leases.",
		fastlease:
			"Same one month rent if signed by day 21. Automatic 21% reduction to 79% of one month if signed on day 22 or later. In writing.",
	},
	{
		dim: "Timeline commitment",
		standard:
			"Best effort. No date is on the contract. Average condo days-on-market in Toronto sits around 24–28 days.",
		fastlease:
			"21 days. Specified in the listing agreement. The clock is the only number that affects your invoice.",
	},
	{
		dim: "Distribution",
		standard:
			"MLS + Realtor.ca + the agent's personal channels. Featured placements on consumer portals usually cost extra or aren't available.",
		fastlease:
			"Featured placement on property.ca and condos.ca from day one (combined 1M+ monthly registered Toronto-area users — these are sister sites under the same brokerage). Plus MLS, Realtor.ca, Zumper, Kijiji, and nine other platforms.",
	},
	{
		dim: "Tenant screening",
		standard:
			"Credit check + employment verification is the typical two-layer baseline. Reference calls are inconsistent.",
		fastlease:
			"Five layers: credit (with Beacon score), income-to-rent ratio, employment verification with pay stubs, two prior-landlord references contacted by phone, and document authentication. Applicants who clear four of five are not accepted.",
	},
	{
		dim: "Photography",
		standard:
			"Often agent-supplied with a phone, or charged as a separate line item.",
		fastlease:
			"Professional photography included. Day 2 of the engagement. No separate fee, ever.",
	},
	{
		dim: "Reporting cadence",
		standard: "Variable. Many agents only report on offers, not on showings.",
		fastlease:
			"Weekly written report. Showings, applications, screening outcomes — never a forwarded list of every email.",
	},
	{
		dim: "Application review",
		standard: "Agent typically presents the application they recommend.",
		fastlease:
			"Every application is presented to the owner with the full screening summary. The owner approves, every time.",
	},
	{
		dim: "Above-asking risk handling",
		standard:
			"The listing agent decides whether to list above their own recommendation. The owner finds out by watching showings dry up.",
		fastlease:
			"If the owner chooses to list more than 5% above the recommended range, the 21-day guarantee is suspended for that listing. Disclosed in writing before sign. The rest of the engagement continues unchanged.",
	},
	{
		dim: "Walk-away clause",
		standard:
			"Typical contracts include cancellation language, but the agent's incentive remains 'lease at any price' since the fee is paid only on signed lease.",
		fastlease:
			"No early-termination fee. No late-listing surcharge. No 'premium placement' upsell. If we don't sign, you don't pay.",
	},
];

const FAQ = [
	{
		q: "Isn't a standard broker also unpaid until the unit leases?",
		a: "Yes — every Toronto brokerage works on contingent payment. That's how the industry is structured. What FastLease adds on top is the 21-day date itself. Contingent payment puts the agent's fee at risk if there's no tenant. The 21-day clock puts the fee at risk if there's no tenant by a specific day. Different mechanism, different incentive.",
	},
	{
		q: "What's the catch with the 21% reduction?",
		a: "There is none for owners who list at or near the recommended price range. The only exception, written into the contract before you sign: if you choose to list more than 5% above FastLease's recommended price, the 21-day guarantee is suspended for that listing. Everything else continues as normal — same marketing, same screening, same reporting.",
	},
	{
		q: "Are FastLease's distribution channels really different from a standard brokerage?",
		a: "Yes. FastLease is operated by Property.ca Inc. Brokerage — the firm that owns property.ca and condos.ca. Those two portals together see more than one million monthly registered Toronto-area users. A typical brokerage lists on MLS and Realtor.ca, and may pay a third-party portal for promoted placement. FastLease has built-in featured placement on the two largest Toronto-specific consumer rental portals from day one, at no extra cost.",
	},
	{
		q: "What if my unit takes longer than 21 days for reasons outside the agent's control?",
		a: "The reduction is automatic regardless of cause — that's the point. The only contractual exclusion is the over-asking clause above. Other delays (a tenant pulling out of a signed lease, a building-mandated delay) are dealt with case by case but don't restart the clock without your written agreement.",
	},
	{
		q: "How does this compare to a full property manager like Royal York or Multidoor?",
		a: "Property managers and leasing brokers solve different problems. A property manager takes over ongoing operations (rent collection, maintenance dispatch, lease renewals) for a monthly percentage of rent. FastLease is leasing-only — a one-time engagement that ends when the lease is signed. If you want hands-off ongoing management after the lease starts, you'd hire a property manager separately. If you want the unit leased fast and well, FastLease is the tighter scope.",
	},
];

export const metadata: Metadata = {
	title: `${TITLE} | FastLease`,
	description: SUMMARY,
	alternates: { canonical: URL },
	openGraph: {
		title: TITLE,
		description: SUMMARY,
		url: URL,
		type: "article",
	},
};

export default function Page() {
	return (
		<PageShell>
			<Script
				id="ld-vs-article"
				strategy="afterInteractive"
				type="application/ld+json"
			>
				{JSON.stringify(
					articleSchema({
						title: TITLE,
						description: SUMMARY,
						url: URL,
						datePublished: "2026-05-01",
					}),
				)}
			</Script>
			<Script
				id="ld-vs-faq"
				strategy="afterInteractive"
				type="application/ld+json"
			>
				{JSON.stringify(faqSchema(FAQ))}
			</Script>

			<section className="section-pad pt-[clamp(80px,8vw,140px)]">
				<div className="wrap">
					<Reveal className="mb-5 flex items-center gap-3 text-[11px] text-ink-mute uppercase tracking-[0.14em]">
						<Link
							className="underline decoration-hair underline-offset-[3px] hover:text-ink"
							href="/"
						>
							FastLease
						</Link>
						<span className="text-ink-faint">·</span>
						<span>Comparisons</span>
					</Reveal>
					<Reveal
						as="h1"
						className="max-w-[22ch] font-medium text-[clamp(38px,5.4vw,64px)] leading-[1.04] tracking-[-0.03em]"
					>
						{TITLE}.
					</Reveal>
					<Reveal
						as="p"
						className="mt-6 max-w-[60ch] text-[18px] text-ink-soft leading-[1.55]"
					>
						The question isn&apos;t whether one is cheaper. Every Toronto
						leasing brokerage charges roughly one month&apos;s rent, contingent
						on a signed lease. The question is what gets put at risk if the unit
						doesn&apos;t lease quickly — and which side carries that risk.
					</Reveal>
				</div>
			</section>

			<section className="section-pad">
				<div className="wrap">
					<Reveal className="mb-7 flex items-center gap-4">
						<span className="num text-[12px] text-ink-mute uppercase tracking-[0.14em]">
							01
						</span>
						<span className="h-[1px] flex-1 bg-hair" />
						<span className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.14em]">
							Side by side
						</span>
					</Reveal>

					<div className="overflow-x-auto">
						<table className="w-full min-w-[720px] border-collapse text-left">
							<thead>
								<tr className="border-hair-strong border-b text-[11px] text-ink-mute uppercase tracking-[0.12em]">
									<th className="w-[180px] py-4 pr-4 font-medium">Dimension</th>
									<th className="w-[40%] py-4 pr-4 font-medium">
										Standard Toronto brokerage
									</th>
									<th className="w-[40%] py-4 font-medium">FastLease</th>
								</tr>
							</thead>
							<tbody>
								{ROWS.map((r) => (
									<tr className="border-hair border-b align-top" key={r.dim}>
										<td className="py-5 pr-4 font-medium text-[14px] tracking-[-0.005em]">
											{r.dim}
										</td>
										<td className="py-5 pr-4 text-[14px] text-ink-soft leading-[1.55]">
											{r.standard}
										</td>
										<td className="py-5 text-[14px] text-ink leading-[1.55]">
											{r.fastlease}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</section>

			<section className="section-pad">
				<div className="wrap max-w-[68ch]">
					<Reveal className="mb-7 flex items-center gap-4">
						<span className="num text-[12px] text-ink-mute uppercase tracking-[0.14em]">
							02
						</span>
						<span className="h-[1px] flex-1 bg-hair" />
						<span className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.14em]">
							What this means
						</span>
					</Reveal>
					<Reveal
						as="h2"
						className="font-medium text-[28px] leading-[1.15] tracking-[-0.02em]"
					>
						The 21-day clock is the only structural change.
					</Reveal>
					<Reveal
						as="p"
						className="mt-5 text-[16px] text-ink-soft leading-[1.65]"
					>
						Everything else on the right column is operational — better
						distribution, more screening layers, weekly reports, no upsells.
						Those are good. But they&apos;re things any disciplined brokerage
						could match.
					</Reveal>
					<Reveal
						as="p"
						className="mt-4 text-[16px] text-ink-soft leading-[1.65]"
					>
						The structural difference is the date. In the standard contingent
						model, the brokerage is paid only if the unit leases — but
						there&apos;s no penalty for taking 40 days instead of 14. The
						agent&apos;s incentive is to lease the unit at any price, not to
						lease it on time. The 21-day clock puts the fee itself at risk for
						missing a date, not just for missing a tenant. To FastLease&apos;s
						knowledge, no other Toronto brokerage writes that into the contract.
					</Reveal>
					<Reveal
						as="p"
						className="mt-4 text-[16px] text-ink-soft leading-[1.65]"
					>
						That&apos;s the comparison. The rest is execution.
					</Reveal>
				</div>
			</section>

			<section className="section-pad">
				<div className="wrap max-w-[68ch]">
					<Reveal className="mb-7 flex items-center gap-4">
						<span className="num text-[12px] text-ink-mute uppercase tracking-[0.14em]">
							03
						</span>
						<span className="h-[1px] flex-1 bg-hair" />
						<span className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.14em]">
							Common questions
						</span>
					</Reveal>
					<div className="flex flex-col">
						{FAQ.map((f) => (
							<Reveal
								className="grid grid-cols-[1fr] gap-3 border-hair border-t py-7 last:border-b"
								key={f.q}
							>
								<h3 className="font-medium text-[18px] tracking-[-0.01em]">
									{f.q}
								</h3>
								<p className="text-[15px] text-ink-soft leading-[1.65]">
									{f.a}
								</p>
							</Reveal>
						))}
					</div>
				</div>
			</section>

			<InlineCTA
				buttonLabel="Run my estimate"
				eyebrow="See the 21-day plan for your unit"
				headline="Get a 21-day plan with comparables for your building."
			/>
		</PageShell>
	);
}
