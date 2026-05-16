export interface Lease {
	n: string;
	u: string;
	listed: number;
	leased: number;
	days: number;
	signed: string;
}

export const LEASES: Lease[] = [
	{
		n: "King West",
		u: "1BR",
		listed: 2650,
		leased: 2675,
		days: 14,
		signed: "Apr 2026",
	},
	{
		n: "Liberty Village",
		u: "2BR+den",
		listed: 3450,
		leased: 3400,
		days: 19,
		signed: "Apr 2026",
	},
	{
		n: "CityPlace",
		u: "Jr 1BR",
		listed: 2200,
		leased: 2200,
		days: 11,
		signed: "Mar 2026",
	},
	{
		n: "St. Lawrence",
		u: "1BR+den",
		listed: 2850,
		leased: 2900,
		days: 17,
		signed: "Mar 2026",
	},
	{
		n: "Yonge & Eg",
		u: "2BR",
		listed: 3250,
		leased: 3200,
		days: 21,
		signed: "Mar 2026",
	},
	{
		n: "The Annex",
		u: "1BR",
		listed: 2400,
		leased: 2400,
		days: 9,
		signed: "Feb 2026",
	},
	{
		n: "Distillery",
		u: "1BR",
		listed: 2700,
		leased: 2675,
		days: 13,
		signed: "Feb 2026",
	},
	{
		n: "Fort York",
		u: "2BR",
		listed: 3100,
		leased: 3150,
		days: 16,
		signed: "Feb 2026",
	},
	{
		n: "Leslieville",
		u: "2BR+den",
		listed: 3550,
		leased: 3500,
		days: 20,
		signed: "Jan 2026",
	},
];

export const NEIGHBORHOODS = [
	"King West",
	"Liberty Village",
	"CityPlace",
	"St. Lawrence",
	"Yonge & Eg",
	"The Annex",
	"Distillery",
	"Fort York",
	"Leslieville",
	"Other Toronto",
];

export const BEDROOM_TYPES = [
	"Jr 1BR",
	"1BR",
	"1BR+den",
	"2BR",
	"2BR+den",
	"3BR",
];

export const NEIGHBORHOOD_MULT: Record<string, number> = {
	"King West": 1.0,
	"Liberty Village": 0.96,
	CityPlace: 1.0,
	"St. Lawrence": 1.02,
	"Yonge & Eg": 0.98,
	"The Annex": 0.9,
	Distillery: 1.0,
	"Fort York": 0.95,
	Leslieville: 0.98,
	"Other Toronto": 0.92,
};

export interface LeaseStats {
	count: number;
	pctOfAsking: number;
	withinOnePct: number;
	medianDays: number;
}

// ⚡ Bolt: Cache leaseStats result to avoid recomputing aggregates on static data
// Impact: Bypasses expensive reduce, filter, and sort operations on subsequent calls
let _cachedStats: LeaseStats | null = null;

export function leaseStats(): LeaseStats {
	if (_cachedStats) return _cachedStats;

	const count = LEASES.length;
	const pctOfAsking =
		(LEASES.reduce((sum, l) => sum + l.leased / l.listed, 0) / count) * 100;
	const withinOnePct = LEASES.filter(
		(l) => Math.abs(l.leased - l.listed) / l.listed <= 0.01,
	).length;
	const sortedDays = [...LEASES.map((l) => l.days)].sort((a, b) => a - b);
	const mid = Math.floor(sortedDays.length / 2);
	const medianDays =
		sortedDays.length % 2
			? (sortedDays[mid] ?? 0)
			: Math.round(((sortedDays[mid - 1] ?? 0) + (sortedDays[mid] ?? 0)) / 2);

	_cachedStats = { count, pctOfAsking, withinOnePct, medianDays };
	return _cachedStats;
}

export function comparables(
	bedrooms: string,
	neighborhood: string,
	limit = 3,
): Lease[] {
	const exact = LEASES.filter((l) => l.u === bedrooms && l.n === neighborhood);
	if (exact.length >= limit) return exact.slice(0, limit);
	const byBedroom = LEASES.filter((l) => l.u === bedrooms);
	if (byBedroom.length >= limit) return byBedroom.slice(0, limit);
	const byNeighborhood = LEASES.filter((l) => l.n === neighborhood);
	const merged = [...new Set([...exact, ...byBedroom, ...byNeighborhood])];
	return merged.slice(0, limit);
}
