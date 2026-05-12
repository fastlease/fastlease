"use client";

import { Reveal } from "../ui/Reveal";
import { CountUp } from "../ui/CountUp";
import { cn } from "~/lib/utils";

const LEASES = [
	{ n: "King West", u: "1BR", listed: 2650, leased: 2675, days: 14 },
	{ n: "Liberty Village", u: "2BR+den", listed: 3450, leased: 3400, days: 19 },
	{ n: "CityPlace", u: "Jr 1BR", listed: 2200, leased: 2200, days: 11 },
	{ n: "St. Lawrence", u: "1BR+den", listed: 2850, leased: 2900, days: 17 },
	{ n: "Yonge & Eg", u: "2BR", listed: 3250, leased: 3200, days: 21 },
	{ n: "The Annex", u: "1BR", listed: 2400, leased: 2400, days: 9 },
	{ n: "Distillery", u: "1BR", listed: 2700, leased: 2675, days: 13 },
	{ n: "Fort York", u: "2BR", listed: 3100, leased: 3150, days: 16 },
	{ n: "Leslieville", u: "2BR+den", listed: 3550, leased: 3500, days: 20 },
];

export function RecentLeases({ layout = "cards" }: { layout?: "cards" | "table" }) {
	return (
		<section id="leases" className="section-pad">
			<div className="wrap">
				<Reveal className="flex items-center gap-4 mb-7">
					<span className="num text-[12px] tracking-[0.14em] text-ink-mute uppercase">05</span>
					<span className="flex-1 h-[1px] bg-hair" />
					<span className="text-[11px] font-medium tracking-[0.14em] text-ink-mute uppercase">Recent leases</span>
				</Reveal>

				<div className="grid grid-cols-2 md:grid-cols-1 gap-12 items-end mb-12 sm:gap-4">
					<Reveal as="h2" className="max-w-[22ch]">Nine recent leases. No names, no photos. Just data.</Reveal>
					<Reveal as="p" className="text-[17px] text-ink-soft max-w-[48ch] leading-[1.55]">
						Anonymized at the unit level, accurate at the deal level. The pattern is the
						proof — not any single line.
					</Reveal>
				</div>

				{layout === "cards" ? (
					<div className="grid grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 gap-4">
						{LEASES.map((l, i) => {
							const delta = l.leased - l.listed;
							return (
								<Reveal key={i} className="p-6 flex flex-col gap-4 bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] border border-hair rounded-[14px]">
									<div className="flex justify-between items-baseline">
										<span className="text-[11px] font-medium tracking-[0.14em] text-ink-mute uppercase">{l.n}</span>
										<span className="text-[13px] text-ink-mute tracking-[0.02em]">{l.u}</span>
									</div>
									<div className="text-[36px] font-medium tracking-[-0.025em] leading-none num">
										${l.leased.toLocaleString()}
										<span className="text-[14px] text-ink-faint font-normal ml-1">/mo</span>
									</div>
									<div className="flex flex-col gap-1.5 border-t border-hair pt-3.5 mt-auto">
										<div className="flex justify-between text-[13px] text-ink-soft">
											<span>Listed</span>
											<span className="num text-ink">${l.listed.toLocaleString()}</span>
										</div>
										<div className="flex justify-between text-[13px] text-ink-soft">
											<span>Δ vs. asking</span>
											<span className={cn("num", delta >= 0 ? "text-accent" : "text-ink")}>
												{delta >= 0 ? "+" : "−"}${Math.abs(delta)}
											</span>
										</div>
										<div className="flex justify-between text-[13px] text-ink-soft">
											<span>Days to lease</span>
											<span className="num text-ink">{l.days}</span>
										</div>
									</div>
								</Reveal>
							);
						})}
					</div>
				) : (
					<Reveal className="p-2 sm:p-5 bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] border border-hair rounded-[14px] overflow-x-auto">
						<table className="w-full border-collapse">
							<thead>
								<tr>
									<th className="text-left p-4 sm:p-3 text-[11px] uppercase tracking-[0.12em] text-ink-mute font-medium">Neighborhood</th>
									<th className="text-left p-4 sm:p-3 text-[11px] uppercase tracking-[0.12em] text-ink-mute font-medium">Unit</th>
									<th className="text-left p-4 sm:p-3 text-[11px] uppercase tracking-[0.12em] text-ink-mute font-medium">Listed</th>
									<th className="text-left p-4 sm:p-3 text-[11px] uppercase tracking-[0.12em] text-ink-mute font-medium">Leased</th>
									<th className="text-left p-4 sm:p-3 text-[11px] uppercase tracking-[0.12em] text-ink-mute font-medium">Δ</th>
									<th className="text-left p-4 sm:p-3 text-[11px] uppercase tracking-[0.12em] text-ink-mute font-medium">Days</th>
								</tr>
							</thead>
							<tbody>
								{LEASES.map((l, i) => {
									const delta = l.leased - l.listed;
									return (
										<tr key={i} className="border-t border-hair hover:bg-[color-mix(in_oklab,var(--bg),var(--accent)_4%)] transition-colors">
											<td className="p-4 sm:p-3 text-[15px]">{l.n}</td>
											<td className="p-4 sm:p-3 text-[15px]">{l.u}</td>
											<td className="p-4 sm:p-3 text-[15px] num">${l.listed.toLocaleString()}</td>
											<td className="p-4 sm:p-3 text-[15px] num">${l.leased.toLocaleString()}</td>
											<td className={cn("p-4 sm:p-3 text-[15px] num", delta >= 0 ? "text-accent" : "text-ink")}>
												{delta >= 0 ? "+" : "−"}${Math.abs(delta)}
											</td>
											<td className="p-4 sm:p-3 text-[15px] num">{l.days}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</Reveal>
				)}

				<Reveal className="mt-9 flex gap-3.5 items-baseline">
					<span className="text-[36px] font-medium tracking-[-0.025em] text-accent leading-none">
						<CountUp to={99.4} decimals={1} suffix="%" />
					</span>
					<span className="text-[17px] text-ink-soft max-w-[32ch]">of asking rent achieved across closed 2025 leases.</span>
				</Reveal>
			</div>
		</section>
	);
}
