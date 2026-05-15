import type { MetadataRoute } from "next";
import { NEIGHBORHOOD_META } from "~/lib/neighborhoods";
import { CASE_STUDIES } from "~/lib/case-studies";
import { SITE } from "~/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
	const now = new Date();
	const base: MetadataRoute.Sitemap = [
		{ url: SITE.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
		{ url: `${SITE.url}/tenants`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
	];
	const neighborhoods = NEIGHBORHOOD_META.map((n) => ({
		url: `${SITE.url}/neighborhoods/${n.slug}`,
		lastModified: now,
		changeFrequency: "weekly" as const,
		priority: 0.8,
	}));
	const caseStudies = CASE_STUDIES.map((c) => ({
		url: `${SITE.url}/case-studies/${c.slug}`,
		lastModified: now,
		changeFrequency: "monthly" as const,
		priority: 0.6,
	}));
	return [...base, ...neighborhoods, ...caseStudies];
}
