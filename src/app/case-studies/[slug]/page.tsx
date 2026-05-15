import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Footer } from "~/app/_components/sections/Footer";
import { Nav } from "~/app/_components/sections/Nav";
import { Reveal } from "~/app/_components/ui/Reveal";
import { CASE_STUDIES, findCaseStudy } from "~/lib/case-studies";
import { articleSchema, SITE, toIsoDate } from "~/lib/seo";
import { CaseStudyCTA } from "./CTA";

export const dynamicParams = false;

export function generateStaticParams() {
	return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const c = findCaseStudy(slug);
	if (!c) return {};
	return {
		title: `${c.title} | FastLease case study`,
		description: c.summary,
		alternates: { canonical: `${SITE.url}/case-studies/${c.slug}` },
		openGraph: {
			title: c.title,
			description: c.summary,
			url: `${SITE.url}/case-studies/${c.slug}`,
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
	const c = findCaseStudy(slug);
	if (!c) notFound();

	return (
		<div className="min-h-screen bg-paper text-ink">
			<Script
				id={`ld-cs-${c.slug}`}
				strategy="afterInteractive"
				type="application/ld+json"
			>
				{JSON.stringify(
					articleSchema({
						title: c.title,
						description: c.summary,
						url: `${SITE.url}/case-studies/${c.slug}`,
						datePublished: toIsoDate(c.signedDate),
					}),
				)}
			</Script>

			<Nav />
			<main>
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
							<span>Case studies</span>
						</Reveal>
						<Reveal
							as="h1"
							className="max-w-[22ch] font-medium text-[clamp(36px,5vw,60px)] leading-[1.05] tracking-[-0.03em]"
						>
							{c.title}
						</Reveal>
						<Reveal
							as="p"
							className="mt-5 max-w-[60ch] text-[18px] text-ink-soft leading-[1.55]"
						>
							{c.summary}
						</Reveal>

						<Reveal className="mt-10 grid grid-cols-4 gap-3 max-md:grid-cols-2">
							<Stat label="Listed" value={`$${c.listed.toLocaleString()}`} />
							<Stat label="Leased" value={`$${c.leased.toLocaleString()}`} />
							<Stat
								label="Δ vs. ask"
								value={`${c.leased - c.listed >= 0 ? "+" : "−"}$${Math.abs(c.leased - c.listed)}`}
							/>
							<Stat
								label="Days to lease"
								unit="days"
								value={`${c.daysToLease}`}
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
								Timeline
							</span>
						</Reveal>
						<div className="flex flex-col">
							{c.weeks.map((w, _i) => (
								<Reveal
									className="grid grid-cols-[120px_1fr] gap-6 border-hair border-t py-7 last:border-b max-md:grid-cols-1"
									key={w.day}
								>
									<div>
										<div className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.12em]">
											{w.label}
										</div>
										<div className="num mt-1 font-medium text-[32px] text-accent tracking-[-0.025em]">
											Day {w.day}
										</div>
									</div>
									<div>
										<h3 className="mb-2 font-medium text-[20px] tracking-[-0.01em]">
											{w.headline}
										</h3>
										<p className="max-w-[60ch] text-[15px] text-ink-soft leading-[1.6]">
											{w.body}
										</p>
									</div>
								</Reveal>
							))}
						</div>
					</div>
				</section>

				<CaseStudyCTA neighborhood={c.neighborhood} unitType={c.unitType} />

				<section className="section-pad">
					<div className="wrap">
						<Reveal className="mb-3 text-[11px] text-ink-mute uppercase tracking-[0.14em]">
							Other case studies
						</Reveal>
						<div className="flex flex-wrap gap-2">
							{CASE_STUDIES.filter((o) => o.slug !== c.slug).map((o) => (
								<Link
									className="inline-flex h-9 items-center rounded-full border border-hair-strong px-3.5 text-[13px] transition-colors hover:border-ink"
									href={`/case-studies/${o.slug}`}
									key={o.slug}
								>
									{o.title}
								</Link>
							))}
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</div>
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
