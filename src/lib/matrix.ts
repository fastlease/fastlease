import { BEDROOM_TYPES, LEASES, type Lease, NEIGHBORHOODS } from "./leases";
import { slugify } from "./seo";

export interface MatrixCell {
	neighborhood: string;
	bedroom: string;
	neighborhoodSlug: string;
	bedroomSlug: string;
	comps: Lease[];
	avgDays?: number;
	avgRent?: number;
}

/** Build (neighborhood, bedroom) cells that have at least one real comparable lease. */
function buildCells(): MatrixCell[] {
	const cells: MatrixCell[] = [];
	for (const n of NEIGHBORHOODS) {
		for (const b of BEDROOM_TYPES) {
			const comps = LEASES.filter((l) => l.n === n && l.u === b);
			if (comps.length === 0) continue;
			const avgDays = Math.round(
				comps.reduce((s, l) => s + l.days, 0) / comps.length,
			);
			const avgRent = Math.round(
				comps.reduce((s, l) => s + l.leased, 0) / comps.length,
			);
			cells.push({
				neighborhood: n,
				bedroom: b,
				neighborhoodSlug: slugify(n),
				bedroomSlug: slugify(b),
				comps,
				avgDays,
				avgRent,
			});
		}
	}
	return cells;
}

export const MATRIX_CELLS: MatrixCell[] = buildCells();

export function findCell(
	neighborhoodSlug: string,
	bedroomSlug: string,
): MatrixCell | undefined {
	return MATRIX_CELLS.find(
		(c) =>
			c.neighborhoodSlug === neighborhoodSlug && c.bedroomSlug === bedroomSlug,
	);
}

/** Sibling cells in the same neighborhood — for internal linking. */
export function siblingsByNeighborhood(neighborhood: string): MatrixCell[] {
	return MATRIX_CELLS.filter((c) => c.neighborhood === neighborhood);
}
