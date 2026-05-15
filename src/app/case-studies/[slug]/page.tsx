import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CASE_STUDIES, findCaseStudy } from "~/lib/case-studies";
import { SITE, articleSchema } from "~/lib/seo";
import { Nav } from "~/app/_components/sections/Nav";
import { Footer } from "~/app/_components/sections/Footer";
import { Reveal } from "~/app/_components/ui/Reveal";
import { CaseStudyCTA } from "./CTA";

export const dynamicParams = false;

export function generateStaticParams() {
	return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
	params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
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
}: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const c = findCaseStudy(slug);
	if (!c) notFound();

	return (
		<div className="min-h-screen bg-paper text-ink">
			<Script id={`ld-cs-${c.slug}`} type="application/ld+json" strategy="afterInteractive">
				{JSON.stringify(articleSchema({
					title: c.title,
					description: c.summary,
					url: `${SITE.url}/case-studies/${c.slug}`,
					datePublished: c.signedDate,
				}))}
			</Script>

			<Nav />
			<main>
				<section className="section-pad pt-[clamp(80px,8vw,140px)]">
					<div className="wrap">
						<Reveal className="flex items-center gap-3 mb-5 text-[11px] uppercase tracking-[0.14em] text-ink-mute">
							<Link href="/" className="hover:text-ink underline decoration-hair underline-offset-[3px]">FastLease</Link>
							<span className="text-ink-faint">·</span>
							<span>Case studies</span>
						</Reveal>
						<Reveal as="h1" className="text-[clamp(36px,5vw,60px)] font-medium tracking-[-0.03em] leading-[1.05] max-w-[22ch]">
							{c.title}
						</Reveal>
						<Reveal as="p" className="text-[18px] text-ink-soft mt-5 max-w-[60ch] leading-[1.55]">
							{c.summary}
						</Reveal>

						<Reveal className="mt-10 grid grid-cols-4 max-md:grid-cols-2 gap-3">
							<Stat label="Listed" value={`$${c.listed.toLocaleString()}`} />
							<Stat label="Leased" value={`$${c.leased.toLocaleString()}`} />
							<Stat label="Δ vs. ask" value={`${c.leased - c.listed >= 0 ? "+" : "−"}$${Math.abs(c.leased - c.listed)}`} />
							<Stat label="Days to lease" value={`${c.daysToLease}`} unit="days" />
						</Reveal>
					</div>
				</section>

				<section className="section-pad">
					<div className="wrap">
						<Reveal className="flex items-center gap-4 mb-7">
							<span className="num text-[12px] tracking-[0.14em] text-ink-mute uppercase">01</span>
							<span className="flex-1 h-[1px] bg-hair" />
							<span className="text-[11px] font-medium tracking-[0.14em] text-ink-mute uppercase">Timeline</span>
						</Reveal>
						<div className="flex flex-col">
							{c.weeks.map((w, i) => (
								<Reveal key={w.day} className="grid grid-cols-[120px_1fr] max-md:grid-cols-1 gap-6 py-7 border-t border-hair last:border-b">
									<div>
										<div className="text-[11px] uppercase tracking-[0.12em] text-ink-mute font-medium">{w.label}</div>
										<div className="text-[32px] font-medium tracking-[-0.025em] num text-accent mt-1">Day {w.day}</div>
									</div>
									<div>
										<h3 className="text-[20px] font-medium tracking-[-0.01em] mb-2">{w.headline}</h3>
										<p className="text-[15px] text-ink-soft leading-[1.6] max-w-[60ch]">{w.body}</p>
									</div>
								</Reveal>
							))}
						</div>
					</div>
				</section>

				<CaseStudyCTA neighborhood={c.neighborhood} unitType={c.unitType} />

				<section className="section-pad">
					<div className="wrap">
						<Reveal className="text-[11px] uppercase tracking-[0.14em] text-ink-mute mb-3">Other case studies</Reveal>
						<div className="flex flex-wrap gap-2">
							{CASE_STUDIES.filter((o) => o.slug !== c.slug).map((o) => (
								<Link
									key={o.slug}
									href={`/case-studies/${o.slug}`}
									className="text-[13px] px-3.5 h-9 inline-flex items-center border border-hair-strong rounded-full hover:border-ink transition-colors"
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

function Stat({ label, value, unit }: { label: string; value: string; unit?: string }) {
	return (
		<div className="p-5 bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] border border-hair rounded-[14px]">
			<div className="text-[11px] uppercase tracking-[0.12em] text-ink-mute font-medium mb-2">{label}</div>
			<div className="text-[28px] font-medium tracking-[-0.025em] leading-none num">
				{value}
				{unit && <span className="text-[13px] text-ink-faint font-normal ml-1.5">{unit}</span>}
			</div>
		</div>
	);
}
