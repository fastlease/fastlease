/**
 * SEO / JSON-LD helpers. Pure functions — no React.
 * Inline these via <script type="application/ld+json"> in page components.
 */

export const SITE = {
	name: "FastLease",
	legalName: "FastLease — operated by Property.ca Inc. Brokerage",
	url: "https://fastlease.ca",
	telephone: "+1-647-835-6368",
	description:
		"21-day Toronto condo leasing. Featured on property.ca and condos.ca. Or 21% off the fee.",
} as const;

export function localBusinessSchema() {
	return {
		"@context": "https://schema.org",
		"@type": "RealEstateAgent",
		name: SITE.name,
		legalName: SITE.legalName,
		url: SITE.url,
		...(SITE.telephone ? { telephone: SITE.telephone } : {}),
		description: SITE.description,
		address: {
			"@type": "PostalAddress",
			addressLocality: "Toronto",
			addressRegion: "ON",
			addressCountry: "CA",
		},
		areaServed: { "@type": "City", name: "Toronto" },
		parentOrganization: {
			"@type": "Organization",
			name: "Property.ca Inc. Brokerage",
			url: "https://property.ca",
		},
	};
}

export function serviceOfferSchema() {
	return {
		"@context": "https://schema.org",
		"@type": "Service",
		name: "21-day Toronto condo leasing",
		serviceType: "Residential leasing brokerage",
		provider: {
			"@type": "RealEstateAgent",
			name: SITE.name,
			url: SITE.url,
		},
		areaServed: { "@type": "City", name: "Toronto" },
		description:
			"Toronto condo leasing on a 21-day clock. If the unit isn't signed by day 21, the fee drops 21% — automatically, in writing.",
		offers: [
			{
				"@type": "Offer",
				name: "Standard fee (signed by day 21)",
				priceSpecification: {
					"@type": "UnitPriceSpecification",
					price: "1",
					priceCurrency: "CAD",
					unitText: "month of rent",
					description: "One month's rent, payable on signed lease.",
				},
			},
			{
				"@type": "Offer",
				name: "Discounted fee (signed day 22+)",
				priceSpecification: {
					"@type": "UnitPriceSpecification",
					price: "0.79",
					priceCurrency: "CAD",
					unitText: "month of rent",
					description: "79% of one month's rent, payable on signed lease.",
				},
			},
		],
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
	dateModified?: string;
	author?: string;
}) {
	return {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: o.title,
		description: o.description,
		mainEntityOfPage: o.url,
		datePublished: o.datePublished,
		dateModified: o.dateModified ?? o.datePublished,
		author: {
			"@type": "Person",
			name: o.author ?? "Sasha Bastani",
			jobTitle: "Broker",
			worksFor: {
				"@type": "Organization",
				name: "Property.ca Inc. Brokerage",
				url: "https://property.ca",
			},
		},
		publisher: {
			"@type": "Organization",
			name: SITE.name,
		},
	};
}

/** Parse "Apr 2026" → Date (first day of month). */
export function parseMonthYear(s: string): Date {
	const [mon, yr] = s.split(" ");
	return new Date(`${mon} 1, ${yr}`);
}

/** Date or "MMM YYYY" string → ISO "YYYY-MM-DD". */
export function toIsoDate(d: Date | string): string {
	const date = typeof d === "string" ? parseMonthYear(d) : d;
	return date.toISOString().split("T")[0] ?? "";
}

export function slugify(s: string) {
	return s
		.toLowerCase()
		.replace(/&/g, "and")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}
