import type { MetadataRoute } from "next";
import { CASE_STUDIES } from "~/lib/case-studies";
import { GLOSSARY_POSTS } from "~/lib/glossary";
import { LEASES } from "~/lib/leases";
import { MATRIX_CELLS } from "~/lib/matrix";
import { NEIGHBORHOOD_META } from "~/lib/neighborhoods";
import { REPORTS } from "~/lib/reports";
import { parseMonthYear, SITE } from "~/lib/seo";

function latestLeaseDate(neighborhood?: string): Date {
	const pool = neighborhood
		? LEASES.filter((l) => l.n === neighborhood)
		: LEASES;
	const dates = pool.map((l) => parseMonthYear(l.signed).getTime());
	const max = dates.length ? Math.max(...dates) : Date.now();
	return new Date(max);
}

export default function sitemap(): MetadataRoute.Sitemap {
	const homepageModified = latestLeaseDate();

	const base: MetadataRoute.Sitemap = [
		{
			url: SITE.url,
			lastModified: homepageModified,
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${SITE.url}/tenants`,
			lastModified: homepageModified,
			changeFrequency: "weekly",
			priority: 0.7,
		},
		{
			url: `${SITE.url}/vs/standard-toronto-brokerage`,
			lastModified: homepageModified,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${SITE.url}/reports`,
			lastModified: homepageModified,
			changeFrequency: "monthly",
			priority: 0.7,
		},
	];

	const neighborhoods = NEIGHBORHOOD_META.map((n) => ({
		url: `${SITE.url}/neighborhoods/${n.slug}`,
		lastModified: latestLeaseDate(n.name),
		changeFrequency: "weekly" as const,
		priority: 0.8,
	}));

	const caseStudies = CASE_STUDIES.map((c) => ({
		url: `${SITE.url}/case-studies/${c.slug}`,
		lastModified: parseMonthYear(c.signedDate),
		changeFrequency: "monthly" as const,
		priority: 0.6,
	}));

	const matrix = MATRIX_CELLS.map((c) => ({
		url: `${SITE.url}/leasing/${c.neighborhoodSlug}/${c.bedroomSlug}`,
		lastModified: latestLeaseDate(c.neighborhood),
		changeFrequency: "weekly" as const,
		priority: 0.7,
	}));

	const glossary = GLOSSARY_POSTS.map((p) => ({
		url: `${SITE.url}/learn/${p.slug}`,
		lastModified: new Date(p.dateModified),
		changeFrequency: "monthly" as const,
		priority: 0.6,
	}));

	const reports = REPORTS.map((r) => ({
		url: `${SITE.url}/reports/${r.slug}`,
		lastModified: new Date(r.datePublished),
		changeFrequency: "monthly" as const,
		priority: 0.7,
	}));

	return [
		...base,
		...neighborhoods,
		...caseStudies,
		...matrix,
		...glossary,
		...reports,
	];
}
