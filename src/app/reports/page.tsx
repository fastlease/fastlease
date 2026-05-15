import type { Metadata } from "next";
import Link from "next/link";
import { InlineCTA, PageShell } from "~/app/_components/PageShell";
import { Reveal } from "~/app/_components/ui/Reveal";
import { REPORTS } from "~/lib/reports";
import { SITE } from "~/lib/seo";

const TITLE = "Toronto condo leasing reports";
const SUMMARY =
	"Quarterly reports on FastLease's own lease activity across Toronto core neighborhoods. Median days-to-lease, percentage of asking, per-neighborhood breakdowns — calibrated against actual signed transactions, not list-side aggregations.";

export const metadata: Metadata = {
	title: `${TITLE} | FastLease`,
	description: SUMMARY,
	alternates: { canonical: `${SITE.url}/reports` },
	openGraph: {
		title: TITLE,
		description: SUMMARY,
		url: `${SITE.url}/reports`,
	},
};

export default function Page() {
	return (
		<PageShell>
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
						<span>Reports</span>
					</Reveal>
					<Reveal
						as="h1"
						className="max-w-[22ch] font-medium text-[clamp(36px,5.4vw,60px)] leading-[1.04] tracking-[-0.03em]"
					>
						{TITLE}.
					</Reveal>
					<Reveal
						as="p"
						className="mt-5 max-w-[60ch] text-[18px] text-ink-soft leading-[1.55]"
					>
						{SUMMARY}
					</Reveal>
				</div>
			</section>

			<section className="section-pad">
				<div className="wrap">
					<div className="flex flex-col">
						{REPORTS.map((r) => (
							<Reveal
								className="grid grid-cols-[140px_1fr_auto] gap-6 border-hair border-t py-7 last:border-b max-md:grid-cols-1"
								key={r.slug}
							>
								<div>
									<div className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.12em]">
										{r.quarter} {r.year}
									</div>
									<div className="num mt-1 font-medium text-[28px] text-accent tracking-[-0.025em]">
										{r.periodLabel.split(" ")[0]}
									</div>
								</div>
								<div>
									<h2 className="mb-2 font-medium text-[22px] tracking-[-0.015em]">
										{r.title}
									</h2>
									<p className="max-w-[60ch] text-[15px] text-ink-soft leading-[1.6]">
										{r.summary}
									</p>
								</div>
								<div className="flex items-center">
									<Link
										className="inline-flex h-10 items-center rounded-full border border-hair-strong px-4 text-[13px] transition-colors hover:border-ink"
										href={`/reports/${r.slug}`}
									>
										Read report →
									</Link>
								</div>
							</Reveal>
						))}
					</div>
				</div>
			</section>

			<InlineCTA
				buttonLabel="Run my estimate"
				eyebrow="Get a 21-day plan"
				headline="Get a 21-day plan for your unit, with real comparables."
			/>
		</PageShell>
	);
}
