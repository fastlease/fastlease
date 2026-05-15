"use client";

import { Reveal } from "../ui/Reveal";
import { CountUp } from "../ui/CountUp";
import { cn } from "~/lib/utils";
import { LEASES, leaseStats } from "~/lib/leases";

const COUNT_WORDS = [
	"Zero",
	"One",
	"Two",
	"Three",
	"Four",
	"Five",
	"Six",
	"Seven",
	"Eight",
	"Nine",
	"Ten",
	"Eleven",
	"Twelve",
];

function countWord(n: number): string {
	return COUNT_WORDS[n] ?? String(n);
}

export function RecentLeases({ layout = "cards" }: { layout?: "cards" | "table" }) {
	const stats = leaseStats();

	return (
		<section id="leases" className="section-pad">
			<div className="wrap">
				<Reveal className="flex items-center gap-4 mb-7">
					<span className="num text-[12px] tracking-[0.14em] text-ink-mute uppercase">07</span>
					<span className="flex-1 h-[1px] bg-hair" />
					<span className="text-[11px] font-medium tracking-[0.14em] text-ink-mute uppercase">Recent leases</span>
				</Reveal>

				<div className="grid grid-cols-2 max-md:grid-cols-1 gap-12 items-end mb-12 max-md:gap-4">
					<Reveal as="h2" className="max-w-[22ch]">
						{countWord(stats.count)} recent leases. No names, no photos. Just data.
					</Reveal>
					<Reveal as="p" className="text-[17px] text-ink-soft max-w-[48ch] leading-[1.55]">
						Anonymized at the unit level, accurate at the deal level. The pattern is the
						proof — not any single line.
					</Reveal>
				</div>

				{layout === "cards" ? (
					<div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-4">
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
										<div className="flex justify-between text-[13px] text-ink-soft">
											<span>Signed</span>
											<span className="text-ink">{l.signed}</span>
										</div>
									</div>
								</Reveal>
							);
						})}
					</div>
				) : (
					<Reveal className="p-5 max-md:p-2 bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] border border-hair rounded-[14px] overflow-x-auto">
						<table className="w-full border-collapse">
							<thead>
								<tr>
									<th className="text-left p-4 max-md:p-3 text-[11px] uppercase tracking-[0.12em] text-ink-mute font-medium">Neighborhood</th>
									<th className="text-left p-4 max-md:p-3 text-[11px] uppercase tracking-[0.12em] text-ink-mute font-medium">Unit</th>
									<th className="text-left p-4 max-md:p-3 text-[11px] uppercase tracking-[0.12em] text-ink-mute font-medium">Listed</th>
									<th className="text-left p-4 max-md:p-3 text-[11px] uppercase tracking-[0.12em] text-ink-mute font-medium">Leased</th>
									<th className="text-left p-4 max-md:p-3 text-[11px] uppercase tracking-[0.12em] text-ink-mute font-medium">Δ</th>
									<th className="text-left p-4 max-md:p-3 text-[11px] uppercase tracking-[0.12em] text-ink-mute font-medium">Days</th>
									<th className="text-left p-4 max-md:p-3 text-[11px] uppercase tracking-[0.12em] text-ink-mute font-medium">Signed</th>
								</tr>
							</thead>
							<tbody>
								{LEASES.map((l, i) => {
									const delta = l.leased - l.listed;
									return (
										<tr key={i} className="border-t border-hair hover:bg-[color-mix(in_oklab,var(--bg),var(--accent)_4%)] transition-colors">
											<td className="p-4 max-md:p-3 text-[15px]">{l.n}</td>
											<td className="p-4 max-md:p-3 text-[15px]">{l.u}</td>
											<td className="p-4 max-md:p-3 text-[15px] num">${l.listed.toLocaleString()}</td>
											<td className="p-4 max-md:p-3 text-[15px] num">${l.leased.toLocaleString()}</td>
											<td className={cn("p-4 max-md:p-3 text-[15px] num", delta >= 0 ? "text-accent" : "text-ink")}>
												{delta >= 0 ? "+" : "−"}${Math.abs(delta)}
											</td>
											<td className="p-4 max-md:p-3 text-[15px] num">{l.days}</td>
											<td className="p-4 max-md:p-3 text-[15px] text-ink-soft">{l.signed}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</Reveal>
				)}

				<Reveal className="mt-9 grid grid-cols-3 max-md:grid-cols-1 gap-7 pt-7 border-t border-hair">
					<div>
						<div className="text-[clamp(32px,3.6vw,44px)] font-medium tracking-[-0.025em] text-accent leading-none num">
							<CountUp to={stats.pctOfAsking} decimals={1} suffix="%" />
						</div>
						<div className="text-[14px] text-ink-soft max-w-[28ch] mt-2 leading-[1.45]">
							of asking rent achieved across these leases.
						</div>
					</div>
					<div>
						<div className="text-[clamp(32px,3.6vw,44px)] font-medium tracking-[-0.025em] leading-none num">
							{stats.withinOnePct}/{stats.count}
						</div>
						<div className="text-[14px] text-ink-soft max-w-[28ch] mt-2 leading-[1.45]">
							signed within 1% of the listed price.
						</div>
					</div>
					<div>
						<div className="text-[clamp(32px,3.6vw,44px)] font-medium tracking-[-0.025em] leading-none num">
							{stats.medianDays}
						</div>
						<div className="text-[14px] text-ink-soft max-w-[28ch] mt-2 leading-[1.45]">
							median days from list to signed lease.
						</div>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
