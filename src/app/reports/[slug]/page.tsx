import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import { InlineCTA, PageShell } from "~/app/_components/PageShell";
import { Reveal } from "~/app/_components/ui/Reveal";
import { findReport, REPORTS, statsForPeriod } from "~/lib/reports";
import { articleSchema, SITE } from "~/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
	return REPORTS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const report = findReport(slug);
	if (!report) return {};
	return {
		title: `${report.title} | FastLease`,
		description: report.summary,
		alternates: { canonical: `${SITE.url}/reports/${report.slug}` },
		openGraph: {
			title: report.title,
			description: report.summary,
			url: `${SITE.url}/reports/${report.slug}`,
			type: "article",
		},
	};
}

export default async function Page({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const report = findReport(slug);
	if (!report) notFound();

	const stats = statsForPeriod(report);
	const url = `${SITE.url}/reports/${report.slug}`;

	return (
		<PageShell>
			<Script
				id={`ld-report-${report.slug}`}
				strategy="afterInteractive"
				type="application/ld+json"
			>
				{JSON.stringify(
					articleSchema({
						title: report.title,
						description: report.summary,
						url,
						datePublished: report.datePublished,
					}),
				)}
			</Script>

			<section className="section-pad pt-[clamp(80px,8vw,140px)]">
				<div className="wrap max-w-[68ch]">
					<Reveal className="mb-5 flex items-center gap-3 text-[11px] text-ink-mute uppercase tracking-[0.14em]">
						<Link
							className="underline decoration-hair underline-offset-[3px] hover:text-ink"
							href="/"
						>
							FastLease
						</Link>
						<span className="text-ink-faint">·</span>
						<Link
							className="underline decoration-hair underline-offset-[3px] hover:text-ink"
							href="/reports"
						>
							Reports
						</Link>
						<span className="text-ink-faint">·</span>
						<span className="text-ink">
							{report.quarter} {report.year}
						</span>
					</Reveal>
					<Reveal
						as="h1"
						className="max-w-[22ch] font-medium text-[clamp(36px,5.4vw,60px)] leading-[1.04] tracking-[-0.03em]"
					>
						{report.title}.
					</Reveal>
					<Reveal
						as="p"
						className="mt-5 text-[18px] text-ink-soft leading-[1.55]"
					>
						{report.summary}
					</Reveal>
					<Reveal className="mt-6 flex items-center gap-3 text-[12px] text-ink-mute">
						<span>By Sasha Bastani, Broker</span>
						<span className="text-ink-faint">·</span>
						<span>
							Published{" "}
							{new Date(report.datePublished).toLocaleDateString("en-CA", {
								month: "long",
								day: "numeric",
								year: "numeric",
							})}
						</span>
					</Reveal>
				</div>
			</section>

			<section className="section-pad">
				<div className="wrap max-w-[68ch]">
					<Reveal className="mb-7 flex items-center gap-4">
						<span className="num text-[12px] text-ink-mute uppercase tracking-[0.14em]">
							01
						</span>
						<span className="h-[1px] flex-1 bg-hair" />
						<span className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.14em]">
							Headline numbers
						</span>
					</Reveal>

					{stats.count === 0 ? (
						<Reveal as="p" className="text-[16px] text-ink-soft">
							No leases recorded in the {report.periodLabel} window. Report will
							populate as transactions are added.
						</Reveal>
					) : (
						<div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
							<Stat label="Leases signed" value={`${stats.count}`} />
							<Stat
								label="Median days to lease"
								unit="days"
								value={`${stats.medianDays}`}
							/>
							<Stat
								label="Average days to lease"
								unit="days"
								value={`${stats.avgDays}`}
							/>
							<Stat
								label="% of asking achieved"
								value={`${stats.pctOfAsking}%`}
							/>
							<Stat
								label="Within 1% of asking"
								value={`${stats.pctWithinOnePct}%`}
							/>
							<Stat label="Above asking" value={`${stats.pctOverAsking}%`} />
						</div>
					)}
				</div>
			</section>

			{stats.byNeighborhood.length > 0 && (
				<section className="section-pad">
					<div className="wrap max-w-[68ch]">
						<Reveal className="mb-7 flex items-center gap-4">
							<span className="num text-[12px] text-ink-mute uppercase tracking-[0.14em]">
								02
							</span>
							<span className="h-[1px] flex-1 bg-hair" />
							<span className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.14em]">
								By neighborhood
							</span>
						</Reveal>
						<div className="overflow-x-auto">
							<table className="w-full min-w-[480px] border-collapse text-left">
								<thead>
									<tr className="border-hair-strong border-b text-[11px] text-ink-mute uppercase tracking-[0.12em]">
										<th className="py-4 pr-4 font-medium">Neighborhood</th>
										<th className="py-4 pr-4 font-medium">Leases</th>
										<th className="py-4 pr-4 font-medium">Avg days</th>
										<th className="py-4 font-medium">Avg leased rent</th>
									</tr>
								</thead>
								<tbody>
									{stats.byNeighborhood.map((n) => (
										<tr className="border-hair border-b" key={n.neighborhood}>
											<td className="py-4 pr-4 text-[14px]">
												{n.neighborhood}
											</td>
											<td className="num py-4 pr-4 text-[14px]">{n.count}</td>
											<td className="num py-4 pr-4 text-[14px]">{n.avgDays}</td>
											<td className="num py-4 text-[14px]">
												${n.avgRent.toLocaleString()}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</section>
			)}

			{stats.byBedroom.length > 0 && (
				<section className="section-pad">
					<div className="wrap max-w-[68ch]">
						<Reveal className="mb-7 flex items-center gap-4">
							<span className="num text-[12px] text-ink-mute uppercase tracking-[0.14em]">
								03
							</span>
							<span className="h-[1px] flex-1 bg-hair" />
							<span className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.14em]">
								By unit type
							</span>
						</Reveal>
						<div className="overflow-x-auto">
							<table className="w-full min-w-[480px] border-collapse text-left">
								<thead>
									<tr className="border-hair-strong border-b text-[11px] text-ink-mute uppercase tracking-[0.12em]">
										<th className="py-4 pr-4 font-medium">Bedroom</th>
										<th className="py-4 pr-4 font-medium">Leases</th>
										<th className="py-4 pr-4 font-medium">Avg days</th>
										<th className="py-4 font-medium">Avg leased rent</th>
									</tr>
								</thead>
								<tbody>
									{stats.byBedroom.map((b) => (
										<tr className="border-hair border-b" key={b.bedroom}>
											<td className="py-4 pr-4 text-[14px]">{b.bedroom}</td>
											<td className="num py-4 pr-4 text-[14px]">{b.count}</td>
											<td className="num py-4 pr-4 text-[14px]">{b.avgDays}</td>
											<td className="num py-4 text-[14px]">
												${b.avgRent.toLocaleString()}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</section>
			)}

			<section className="section-pad">
				<div className="wrap max-w-[68ch]">
					<Reveal className="mb-7 flex items-center gap-4">
						<span className="num text-[12px] text-ink-mute uppercase tracking-[0.14em]">
							04
						</span>
						<span className="h-[1px] flex-1 bg-hair" />
						<span className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.14em]">
							Methodology
						</span>
					</Reveal>
					<Reveal
						as="p"
						className="mb-4 text-[16px] text-ink-soft leading-[1.7]"
					>
						All figures in this report are drawn from FastLease&apos;s own
						signed-lease records for the {report.periodLabel} window. &quot;Days
						to lease&quot; is measured from list date to signed-lease date, not
						to occupancy date. &quot;% of asking achieved&quot; is the ratio of
						the final signed rent to the original list price, averaged across
						the period&apos;s transactions.
					</Reveal>
					<Reveal
						as="p"
						className="mb-4 text-[16px] text-ink-soft leading-[1.7]"
					>
						The dataset reflects engagements where FastLease was the listing
						brokerage. It is not a market-wide aggregation — broader Toronto
						rental statistics published by the Toronto Regional Real Estate
						Board (TRREB) and the Canada Mortgage and Housing Corporation (CMHC)
						include all transactions across all brokerages and are the right
						reference for market-wide questions.
					</Reveal>
					<Reveal as="p" className="text-[16px] text-ink-soft leading-[1.7]">
						Per-neighborhood figures are reported only where there is at least
						one lease in the period. Cells with no recent transactions are
						omitted rather than imputed from prior quarters.
					</Reveal>
				</div>
			</section>

			<InlineCTA
				buttonLabel="Run my estimate"
				eyebrow="Get a 21-day plan"
				headline="Get a 21-day plan, calibrated against this quarter's comparables."
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
