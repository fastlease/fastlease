import { slugify } from "./seo";

export interface CaseStudyWeek {
	label: string;
	day: number;
	headline: string;
	body: string;
}

export interface CaseStudy {
	slug: string;
	title: string;
	summary: string;
	neighborhood: string;
	unitType: string;
	listed: number;
	leased: number;
	daysToLease: number;
	signedDate: string;
	weeks: CaseStudyWeek[];
}

const RAW: Omit<CaseStudy, "slug">[] = [
	{
		title: "King West 1BR — listed Apr 2, signed Apr 16",
		summary:
			"Investor-owner with three weeks of carrying-cost runway before vacancy ate the quarter. Featured placement on property.ca + condos.ca on day one, ten showings in seven days, signed at $25 above ask.",
		neighborhood: "King West",
		unitType: "1BR",
		listed: 2650,
		leased: 2675,
		daysToLease: 14,
		signedDate: "Apr 2026",
		weeks: [
			{
				label: "Week 1",
				day: 3,
				headline: "Live on property.ca + condos.ca",
				body: "Photography day 2. Listing live day 3, with featured placement on both portals. Booked four showings inside the first 48 hours from the condos.ca building-search audience alone.",
			},
			{
				label: "Week 2",
				day: 10,
				headline: "Ten showings, two qualified applications",
				body: "Standard FastLease screening rubric applied — verified income, two credit checks pulled, employer letters on file. One application pulled ahead on credit + employment tenure.",
			},
			{
				label: "Week 2",
				day: 14,
				headline: "Signed at $2,675 — $25 above ask",
				body: "Lease signed on day 14. Inside the 21-day window. Featured-placement renter, condos.ca direct.",
			},
		],
	},
	{
		title: "Liberty Village 2BR+den — listed Mar 18, signed Apr 6",
		summary:
			"Family-investor unit with parking. Slower mid-month list date but recovered with aggressive day-1 featured placement on property.ca.",
		neighborhood: "Liberty Village",
		unitType: "2BR+den",
		listed: 3450,
		leased: 3400,
		daysToLease: 19,
		signedDate: "Apr 2026",
		weeks: [
			{
				label: "Week 1",
				day: 3,
				headline: "Photography + featured placement",
				body: "Day 3 live with featured placement. Property.ca homepage rotation kicked in for the larger floorplan filter.",
			},
			{
				label: "Week 2",
				day: 12,
				headline: "Five showings, two applications",
				body: "Slightly slower 2BR+den market in March. Two applications, both above credit and income threshold.",
			},
			{
				label: "Week 3",
				day: 19,
				headline: "Signed at $3,400 — $50 under ask",
				body: "Settled $50 under listing to lock in a 14-month term with parking included. Owner net rent vs. shorter term + tighter pricing remained positive.",
			},
		],
	},
];

export const CASE_STUDIES: CaseStudy[] = RAW.map((c) => ({
	...c,
	slug: slugify(c.title),
}));

export function findCaseStudy(slug: string) {
	return CASE_STUDIES.find((c) => c.slug === slug);
}
