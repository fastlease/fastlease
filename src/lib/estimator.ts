import { LEASES, NEIGHBORHOOD_MULT } from "./leases";

export interface EstimateInput {
	bedrooms: string;
	neighborhood?: string;
	targetRent?: string;
	date?: Date;
}

export interface Estimate {
	days: number;
	rentLow: number;
	rentHigh: number;
	recRent: number;
	listDate: string;
	leaseBy: string;
	over: number;
}

const BASE_OFFSETS: Record<string, number> = {
	"Jr 1BR": 14,
	"1BR": 16,
	"1BR+den": 17,
	"2BR": 18,
	"2BR+den": 19,
	"3BR": 21,
};

const REC_RENTS: Record<string, number> = {
	"Jr 1BR": 2200,
	"1BR": 2650,
	"1BR+den": 2900,
	"2BR": 3300,
	"2BR+den": 3550,
	"3BR": 4200,
};

export const TORONTO_AVG_DAYS = 28;
export const DAILY_RENT_BENCHMARK = 107;

function fmt(d: Date) {
	return d.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}

function neighborhoodBaseDays(neighborhood: string | undefined, bedrooms: string): number {
	if (neighborhood) {
		const exact = LEASES.filter((l) => l.n === neighborhood && l.u === bedrooms);
		if (exact.length) {
			return Math.round(exact.reduce((s, l) => s + l.days, 0) / exact.length);
		}
		const byN = LEASES.filter((l) => l.n === neighborhood);
		if (byN.length) {
			return Math.round(byN.reduce((s, l) => s + l.days, 0) / byN.length);
		}
	}
	return BASE_OFFSETS[bedrooms] ?? 16;
}

export function dailyRent(neighborhood: string | undefined, bedrooms: string): number {
	const mult = (neighborhood && NEIGHBORHOOD_MULT[neighborhood]) ?? 1.0;
	const rec = REC_RENTS[bedrooms] ?? 2650;
	return Math.round((rec * mult) / 30);
}

export function estimate({
	bedrooms,
	neighborhood,
	targetRent,
	date = new Date(),
}: EstimateInput): Estimate {
	const base = neighborhoodBaseDays(neighborhood, bedrooms);
	const m = date.getMonth();
	const seasonal = m >= 4 && m <= 7 ? -2 : m === 11 || m === 0 ? 2 : 0;
	const target = Number.parseInt((targetRent ?? "").replace(/[^0-9]/g, ""), 10) || 0;
	const mult = (neighborhood && NEIGHBORHOOD_MULT[neighborhood]) ?? 1.0;
	const recRent = Math.round(((REC_RENTS[bedrooms] ?? 2650) * mult) / 25) * 25;

	let over = 0;
	if (target && target > recRent * 1.05) {
		over = Math.min(6, Math.round((target - recRent * 1.05) / 60));
	}

	const days = Math.max(7, Math.min(21, base + seasonal + over));
	const listDate = new Date(date.getTime() + 3 * 86_400_000);
	const leaseBy = new Date(date.getTime() + (days + 3) * 86_400_000);

	return {
		days,
		rentLow: Math.round((recRent * 0.97) / 25) * 25,
		rentHigh: Math.round((recRent * 1.03) / 25) * 25,
		recRent,
		listDate: fmt(listDate),
		leaseBy: fmt(leaseBy),
		over,
	};
}

export function vacancySavings(estDays: number, dailyRent = DAILY_RENT_BENCHMARK): { daysSaved: number; dollarsSaved: number } {
	const daysSaved = Math.max(0, TORONTO_AVG_DAYS - estDays);
	return { daysSaved, dollarsSaved: daysSaved * dailyRent };
}
