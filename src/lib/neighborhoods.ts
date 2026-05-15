import { LEASES, NEIGHBORHOODS } from "./leases";
import { slugify } from "./seo";

export interface NeighborhoodMeta {
	slug: string;
	name: string;
	blurb: string;
	avgDays?: number;
	avgRent?: number;
}

const BLURBS: Record<string, string> = {
	"King West":
		"Toronto's highest-velocity 1BR market. Walking renters, fast list-to-lease cycles.",
	"Liberty Village":
		"Young-professional density and amenity-heavy buildings. Strong 2BR demand.",
	CityPlace: "Lake-adjacent towers with the deepest renter pool in the core.",
	"St. Lawrence": "Heritage condo stock and steady professional-class demand.",
	"Yonge & Eg": "Subway-line uptown demand, larger floorplates, longer leases.",
	"The Annex":
		"Family + grad-student split. Pricing precision matters more than speed.",
	Distillery: "Premium spec, longer tenancies. Boutique demand.",
	"Fort York": "New-build inventory with strong 2BR + parking absorption.",
	Leslieville: "East-end professional demand. 2BR+den outperforms.",
	"Other Toronto":
		"Outside the core map. We'll price against the closest comparable cluster.",
};

export const NEIGHBORHOOD_META: NeighborhoodMeta[] = NEIGHBORHOODS.map(
	(name) => {
		const leases = LEASES.filter((l) => l.n === name);
		const avgDays = leases.length
			? Math.round(leases.reduce((s, l) => s + l.days, 0) / leases.length)
			: undefined;
		const avgRent = leases.length
			? Math.round(leases.reduce((s, l) => s + l.leased, 0) / leases.length)
			: undefined;
		return {
			slug: slugify(name),
			name,
			blurb: BLURBS[name] ?? `Comparables and leasing timeline for ${name}.`,
			avgDays,
			avgRent,
		};
	},
);

export function findNeighborhood(slug: string) {
	return NEIGHBORHOOD_META.find((n) => n.slug === slug);
}
