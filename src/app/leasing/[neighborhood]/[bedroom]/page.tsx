import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import { InlineCTA, PageShell } from "~/app/_components/PageShell";
import { Reveal } from "~/app/_components/ui/Reveal";
import { estimate } from "~/lib/estimator";
import { findCell, MATRIX_CELLS, siblingsByNeighborhood } from "~/lib/matrix";
import {
	articleSchema,
	faqSchema,
	parseMonthYear,
	SITE,
	toIsoDate,
} from "~/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
	return MATRIX_CELLS.map((c) => ({
		neighborhood: c.neighborhoodSlug,
		bedroom: c.bedroomSlug,
	}));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ neighborhood: string; bedroom: string }>;
}): Promise<Metadata> {
	const { neighborhood, bedroom } = await params;
	const cell = findCell(neighborhood, bedroom);
	if (!cell) return {};
	const url = `${SITE.url}/leasing/${cell.neighborhoodSlug}/${cell.bedroomSlug}`;
	const title = `${cell.neighborhood} ${cell.bedroom} leasing — rent estimate + ${cell.avgDays ?? 21}-day timeline`;
	const description = `Recent ${cell.neighborhood} ${cell.bedroom} comparables, days-to-lease, and FastLease's 21-day-or-21%-off pricing model. Operated by Property.ca Inc. Brokerage.`;
	return {
		title,
		description,
		alternates: { canonical: url },
		openGraph: { title, description, url, type: "article" },
	};
}

export default async function Page({
	params,
}: {
	params: Promise<{ neighborhood: string; bedroom: string }>;
}) {
	const { neighborhood, bedroom } = await params;
	const cell = findCell(neighborhood, bedroom);
	if (!cell) notFound();

	const url = `${SITE.url}/leasing/${cell.neighborhoodSlug}/${cell.bedroomSlug}`;
	const est = estimate({
		bedrooms: cell.bedroom,
		neighborhood: cell.neighborhood,
	});

	const latest = cell.comps
		.map((l) => parseMonthYear(l.signed).getTime())
		.reduce((max, t) => (t > max ? t : max), 0);
	const dateModified = latest ? toIsoDate(new Date(latest)) : "2026-01-01";

	const faq = [
		{
			q: `How long does a typical ${cell.neighborhood} ${cell.bedroom} take to lease?`,
			a: `Recent FastLease comparables for ${cell.bedroom} units in ${cell.neighborhood} averaged ${cell.avgDays} days from list to signed lease. The 21-day guarantee means if the unit isn't signed by day 21, the brokerage fee drops 21%.`,
		},
		{
			q: `What's the expected rent for a ${cell.bedroom} in ${cell.neighborhood}?`,
			a: `Based on recent comparables and seasonal adjustments, the suggested range is $${est.rentLow.toLocaleString()}–$${est.rentHigh.toLocaleString()} per month, with $${est.recRent.toLocaleString()} as the centered ask. Pricing precision matters more than headline number — see the recent comparables on this page.`,
		},
		{
			q: `What if my ${cell.neighborhood} ${cell.bedroom} doesn't lease in 21 days?`,
			a: "The brokerage fee drops 21% automatically — from one month rent to 79% of one month. There is no separate notice, no escalation, no walk-away charge. The reduction is written into the listing agreement before you sign.",
		},
		{
			q: `Is this neighborhood-specific data, or generic?`,
			a: `Specific. The ${cell.avgDays}-day average and the $${cell.avgRent?.toLocaleString()} rent figure come from FastLease's own recent ${cell.bedroom} closings in ${cell.neighborhood}. They're updated as new leases are signed.`,
		},
	];

	const siblings = siblingsByNeighborhood(cell.neighborhood).filter(
		(s) => s.bedroomSlug !== cell.bedroomSlug,
	);

	return (
		<PageShell
			initialPrefill={{
				neighborhood: cell.neighborhood,
				bedrooms: cell.bedroom,
			}}
		>
			<Script
				id={`ld-leasing-${cell.neighborhoodSlug}-${cell.bedroomSlug}-article`}
				strategy="afterInteractive"
				type="application/ld+json"
			>
				{JSON.stringify(
					articleSchema({
						title: `${cell.neighborhood} ${cell.bedroom} leasing — rent estimate + 21-day timeline`,
						description: `Recent ${cell.neighborhood} ${cell.bedroom} comparables, average ${cell.avgDays} days to lease, suggested rent $${est.recRent.toLocaleString()}.`,
						url,
						datePublished: "2026-01-01",
						dateModified,
					}),
				)}
			</Script>
			<Script
				id={`ld-leasing-${cell.neighborhoodSlug}-${cell.bedroomSlug}-faq`}
				strategy="afterInteractive"
				type="application/ld+json"
			>
				{JSON.stringify(faqSchema(faq))}
			</Script>

			<section className="section-pad pt-[clamp(80px,8vw,140px)]">
				<div className="wrap">
					<Reveal className="mb-5 flex flex-wrap items-center gap-3 text-[11px] text-ink-mute uppercase tracking-[0.14em]">
						<Link
							className="underline decoration-hair underline-offset-[3px] hover:text-ink"
							href="/"
						>
							FastLease
						</Link>
						<span className="text-ink-faint">·</span>
						<Link
							className="underline decoration-hair underline-offset-[3px] hover:text-ink"
							href={`/neighborhoods/${cell.neighborhoodSlug}`}
						>
							{cell.neighborhood}
						</Link>
						<span className="text-ink-faint">·</span>
						<span className="text-ink">{cell.bedroom}</span>
					</Reveal>
					<Reveal
						as="h1"
						className="max-w-[20ch] font-medium text-[clamp(36px,5.4vw,60px)] leading-[1.04] tracking-[-0.03em]"
					>
						{cell.neighborhood} {cell.bedroom} — leased on a 21-day clock.
					</Reveal>
					<Reveal
						as="p"
						className="mt-5 max-w-[56ch] text-[18px] text-ink-soft leading-[1.55]"
					>
						Recent FastLease comparables, suggested ask, and the
						21-day-or-21%-off pricing model — calibrated for {cell.bedroom}{" "}
						units in {cell.neighborhood}.
					</Reveal>

					<Reveal className="mt-10 grid grid-cols-3 gap-3 max-md:grid-cols-1">
						<Stat
							label="Suggested ask"
							unit="/mo"
							value={`$${est.recRent.toLocaleString()}`}
						/>
						<Stat
							label="Suggested range"
							value={`$${est.rentLow.toLocaleString()}–${est.rentHigh.toLocaleString()}`}
						/>
						<Stat
							label="Avg days to lease"
							unit="days"
							value={`${cell.avgDays}`}
						/>
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
							Recent comparables
						</span>
					</Reveal>
					<div className="overflow-x-auto">
						<table className="w-full min-w-[520px] border-collapse text-left">
							<thead>
								<tr className="border-hair-strong border-b text-[11px] text-ink-mute uppercase tracking-[0.12em]">
									<th className="py-4 pr-4 font-medium">Unit</th>
									<th className="py-4 pr-4 font-medium">Listed</th>
									<th className="py-4 pr-4 font-medium">Leased</th>
									<th className="py-4 pr-4 font-medium">Days</th>
									<th className="py-4 font-medium">Signed</th>
								</tr>
							</thead>
							<tbody>
								{cell.comps.map((l) => (
									<tr
										className="border-hair border-b"
										key={`${l.n}-${l.u}-${l.signed}`}
									>
										<td className="py-4 pr-4 text-[14px]">{l.u}</td>
										<td className="num py-4 pr-4 text-[14px]">
											${l.listed.toLocaleString()}
										</td>
										<td className="num py-4 pr-4 text-[14px]">
											${l.leased.toLocaleString()}
										</td>
										<td className="num py-4 pr-4 text-[14px]">{l.days}</td>
										<td className="py-4 text-[14px] text-ink-soft">
											{l.signed}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</section>

			{siblings.length > 0 && (
				<section className="section-pad">
					<div className="wrap">
						<Reveal className="mb-3 text-[11px] text-ink-mute uppercase tracking-[0.14em]">
							Other bedroom types in {cell.neighborhood}
						</Reveal>
						<div className="flex flex-wrap gap-2">
							{siblings.map((s) => (
								<Link
									className="inline-flex h-9 items-center rounded-full border border-hair-strong px-3.5 text-[13px] transition-colors hover:border-ink"
									href={`/leasing/${s.neighborhoodSlug}/${s.bedroomSlug}`}
									key={`${s.neighborhoodSlug}-${s.bedroomSlug}`}
								>
									{s.bedroom} · {s.avgDays}d avg
								</Link>
							))}
						</div>
					</div>
				</section>
			)}

			<section className="section-pad">
				<div className="wrap max-w-[68ch]">
					<Reveal className="mb-7 flex items-center gap-4">
						<span className="num text-[12px] text-ink-mute uppercase tracking-[0.14em]">
							02
						</span>
						<span className="h-[1px] flex-1 bg-hair" />
						<span className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.14em]">
							FAQ
						</span>
					</Reveal>
					<div className="flex flex-col">
						{faq.map((f) => (
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
				bedrooms={cell.bedroom}
				buttonLabel="Run my estimate"
				eyebrow={`${cell.neighborhood} ${cell.bedroom} plan`}
				headline={`Get a 21-day plan for your ${cell.neighborhood} ${cell.bedroom}.`}
				neighborhood={cell.neighborhood}
			/>
		</PageShell>
	);
}

function Stat({
	label,
	value,
	unit,
}: {
	label: string;
	value: string;
	unit?: string;
}) {
	return (
		<div className="rounded-[14px] border border-hair bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] p-5">
			<div className="mb-2 font-medium text-[11px] text-ink-mute uppercase tracking-[0.12em]">
				{label}
			</div>
			<div className="num font-medium text-[28px] leading-none tracking-[-0.025em]">
				{value}
				{unit && (
					<span className="ml-1.5 font-normal text-[13px] text-ink-faint">
						{unit}
					</span>
				)}
			</div>
		</div>
	);
}
