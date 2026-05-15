/**
 * SEO / JSON-LD helpers. Pure functions — no React.
 * Inline these via <script type="application/ld+json"> in page components.
 */

export const SITE = {
	name: "FastLease",
	legalName: "FastLease — operated by Property.ca Inc. Brokerage",
	url: "https://fastlease.ca",
	telephone: "+1-416-000-0000",
	description: "21-day Toronto condo leasing. Featured on property.ca and condos.ca. Or 21% off the fee.",
} as const;

export function localBusinessSchema() {
	return {
		"@context": "https://schema.org",
		"@type": "RealEstateAgent",
		name: SITE.name,
		legalName: SITE.legalName,
		url: SITE.url,
		telephone: SITE.telephone,
		description: SITE.description,
		areaServed: { "@type": "City", name: "Toronto" },
		parentOrganization: {
			"@type": "Organization",
			name: "Property.ca Inc. Brokerage",
			url: "https://property.ca",
		},
	};
}

export function faqSchema(items: { q: string; a: string }[]) {
	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: items.map((i) => ({
			"@type": "Question",
			name: i.q,
			acceptedAnswer: { "@type": "Answer", text: i.a },
		})),
	};
}

export function articleSchema(o: {
	title: string;
	description: string;
	url: string;
	datePublished: string;
	author?: string;
}) {
	return {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: o.title,
		description: o.description,
		mainEntityOfPage: o.url,
		datePublished: o.datePublished,
		author: { "@type": "Person", name: o.author ?? "Sasha Bastani" },
		publisher: {
			"@type": "Organization",
			name: SITE.name,
		},
	};
}

export function slugify(s: string) {
	return s
		.toLowerCase()
		.replace(/&/g, "and")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}
