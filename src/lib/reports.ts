import { LEASES, type Lease } from "./leases";
import { parseMonthYear } from "./seo";

export interface ReportPeriod {
	slug: string;
	title: string;
	quarter: string;
	year: number;
	periodLabel: string;
	rangeStart: string;
	rangeEnd: string;
	summary: string;
	datePublished: string;
}

export interface ReportStats {
	count: number;
	medianDays: number;
	avgDays: number;
	pctOfAsking: number;
	pctWithinOnePct: number;
	pctOverAsking: number;
	leases: Lease[];
	byNeighborhood: {
		neighborhood: string;
		count: number;
		avgDays: number;
		avgRent: number;
	}[];
	byBedroom: {
		bedroom: string;
		count: number;
		avgDays: number;
		avgRent: number;
	}[];
}

export const REPORTS: ReportPeriod[] = [
	{
		slug: "q1-2026-toronto-condo-leasing",
		title: "Q1 2026 Toronto Condo Leasing Report",
		quarter: "Q1",
		year: 2026,
		periodLabel: "January–March 2026",
		rangeStart: "Jan 2026",
		rangeEnd: "Mar 2026",
		summary:
			"FastLease's Q1 2026 lease activity across Toronto core neighborhoods: median days-to-lease, percentage of asking achieved, and per-neighborhood breakdowns.",
		datePublished: "2026-04-15",
	},
];

export function findReport(slug: string): ReportPeriod | undefined {
	return REPORTS.find((r) => r.slug === slug);
}

function median(nums: number[]): number {
	if (!nums.length) return 0;
	const sorted = [...nums].sort((a, b) => a - b);
	const mid = Math.floor(sorted.length / 2);
	return sorted.length % 2
		? (sorted[mid] ?? 0)
		: Math.round(((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2);
}

export function statsForPeriod(period: ReportPeriod): ReportStats {
	const startTime = parseMonthYear(period.rangeStart).getTime();
	const endTime = parseMonthYear(period.rangeEnd).getTime();

	const leases = LEASES.filter((l) => {
		const t = parseMonthYear(l.signed).getTime();
		return t >= startTime && t <= endTime;
	});

	if (!leases.length) {
		return {
			count: 0,
			medianDays: 0,
			avgDays: 0,
			pctOfAsking: 0,
			pctWithinOnePct: 0,
			pctOverAsking: 0,
			leases: [],
			byNeighborhood: [],
			byBedroom: [],
		};
	}

	const days = leases.map((l) => l.days);
	const medianDays = median(days);
	const avgDays = Math.round(days.reduce((s, d) => s + d, 0) / days.length);
	const pctOfAsking =
		Math.round(
			(leases.reduce((s, l) => s + l.leased / l.listed, 0) / leases.length) *
				1000,
		) / 10;
	const pctWithinOnePct = Math.round(
		(leases.filter((l) => Math.abs(l.leased - l.listed) / l.listed <= 0.01)
			.length /
			leases.length) *
			100,
	);
	const pctOverAsking = Math.round(
		(leases.filter((l) => l.leased > l.listed).length / leases.length) * 100,
	);

	const neighborhoodGroups = new Map<string, Lease[]>();
	for (const l of leases) {
		const arr = neighborhoodGroups.get(l.n) ?? [];
		arr.push(l);
		neighborhoodGroups.set(l.n, arr);
	}
	const byNeighborhood = [...neighborhoodGroups.entries()]
		.map(([neighborhood, items]) => ({
			neighborhood,
			count: items.length,
			avgDays: Math.round(items.reduce((s, l) => s + l.days, 0) / items.length),
			avgRent: Math.round(
				items.reduce((s, l) => s + l.leased, 0) / items.length,
			),
		}))
		.sort((a, b) => a.avgDays - b.avgDays);

	const bedroomGroups = new Map<string, Lease[]>();
	for (const l of leases) {
		const arr = bedroomGroups.get(l.u) ?? [];
		arr.push(l);
		bedroomGroups.set(l.u, arr);
	}
	const byBedroom = [...bedroomGroups.entries()]
		.map(([bedroom, items]) => ({
			bedroom,
			count: items.length,
			avgDays: Math.round(items.reduce((s, l) => s + l.days, 0) / items.length),
			avgRent: Math.round(
				items.reduce((s, l) => s + l.leased, 0) / items.length,
			),
		}))
		.sort((a, b) => a.avgDays - b.avgDays);

	return {
		count: leases.length,
		medianDays,
		avgDays,
		pctOfAsking,
		pctWithinOnePct,
		pctOverAsking,
		leases,
		byNeighborhood,
		byBedroom,
	};
}
