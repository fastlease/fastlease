import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { NEIGHBORHOOD_META, findNeighborhood } from "~/lib/neighborhoods";
import { LEASES } from "~/lib/leases";
import { SITE, articleSchema, faqSchema } from "~/lib/seo";
import { NeighborhoodClient } from "./Client";

export const dynamicParams = false;

export function generateStaticParams() {
	return NEIGHBORHOOD_META.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
	params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	const { slug } = await params;
	const n = findNeighborhood(slug);
	if (!n) return {};
	const title = `${n.name} condo leasing — 21-day timeline | FastLease`;
	const description = `Suggested rent, days-to-lease, and recent comparables for ${n.name} condos. Operated by Property.ca Inc. Brokerage.`;
	return {
		title,
		description,
		alternates: { canonical: `${SITE.url}/neighborhoods/${n.slug}` },
		openGraph: { title, description, url: `${SITE.url}/neighborhoods/${n.slug}` },
	};
}

export default async function Page({
	params,
}: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const n = findNeighborhood(slug);
	if (!n) notFound();

	const leases = LEASES.filter((l) => l.n === n.name);
	const faq = [
		{ q: `How long does a typical ${n.name} condo take to lease?`, a: `Recent FastLease comparables in ${n.name} averaged ${n.avgDays ?? "under 21"} days.` },
		{ q: `What do ${n.name} units typically lease for?`, a: n.avgRent ? `Recent comparables average $${n.avgRent.toLocaleString()}/month, varying by bedroom count and unit features.` : "Pricing depends on bedroom count and unit features — use the estimator on this page." },
		{ q: `What happens if my ${n.name} unit doesn't lease in 21 days?`, a: "Our fee drops by 21%. Real risk reversal, not industry-standard contingent payment." },
	];

	return (
		<div className="min-h-screen bg-paper text-ink">
			<Script id={`ld-faq-${n.slug}`} type="application/ld+json" strategy="afterInteractive">
				{JSON.stringify(faqSchema(faq))}
			</Script>
			<Script id={`ld-article-${n.slug}`} type="application/ld+json" strategy="afterInteractive">
				{JSON.stringify(articleSchema({
					title: `${n.name} condo leasing — 21-day timeline`,
					description: n.blurb,
					url: `${SITE.url}/neighborhoods/${n.slug}`,
					datePublished: "2026-01-01",
				}))}
			</Script>

			<NeighborhoodClient
				name={n.name}
				slug={n.slug}
				blurb={n.blurb}
				avgDays={n.avgDays}
				avgRent={n.avgRent}
				leases={leases}
				faq={faq}
			/>
		</div>
	);
}
