"use client";

import { LEASES, leaseStats } from "~/lib/leases";
import { cn } from "~/lib/utils";
import { CountUp } from "../ui/CountUp";
import { Reveal } from "../ui/Reveal";

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

export function RecentLeases({
	layout = "cards",
}: {
	layout?: "cards" | "table";
}) {
	const stats = leaseStats();

	return (
		<section className="section-pad" id="leases">
			<div className="wrap">
				<Reveal className="mb-7 flex items-center gap-4">
					<span className="num text-[12px] text-ink-mute uppercase tracking-[0.14em]">
						07
					</span>
					<span className="h-[1px] flex-1 bg-hair" />
					<span className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.14em]">
						Recent leases
					</span>
				</Reveal>

				<div className="mb-12 grid grid-cols-2 items-end gap-12 max-md:grid-cols-1 max-md:gap-4">
					<Reveal as="h2" className="max-w-[22ch]">
						{countWord(stats.count)} recent leases. No names, no photos. Just
						data.
					</Reveal>
					<Reveal
						as="p"
						className="max-w-[48ch] text-[17px] text-ink-soft leading-[1.55]"
					>
						Anonymized at the unit level, accurate at the deal level. The
						pattern is the proof — not any single line.
					</Reveal>
				</div>

				{layout === "cards" ? (
					<div className="grid grid-cols-3 gap-4 max-md:grid-cols-1 max-lg:grid-cols-2">
						{LEASES.map((l) => {
							const delta = l.leased - l.listed;
							return (
								<Reveal
									className="flex flex-col gap-4 rounded-[14px] border border-hair bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] p-6"
									key={`${l.n}-${l.u}-${l.signed}`}
								>
									<div className="flex items-baseline justify-between">
										<span className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.14em]">
											{l.n}
										</span>
										<span className="text-[13px] text-ink-mute tracking-[0.02em]">
											{l.u}
										</span>
									</div>
									<div className="num font-medium text-[36px] leading-none tracking-[-0.025em]">
										${l.leased.toLocaleString()}
										<span className="ml-1 font-normal text-[14px] text-ink-faint">
											/mo
										</span>
									</div>
									<div className="mt-auto flex flex-col gap-1.5 border-hair border-t pt-3.5">
										<div className="flex justify-between text-[13px] text-ink-soft">
											<span>Listed</span>
											<span className="num text-ink">
												${l.listed.toLocaleString()}
											</span>
										</div>
										<div className="flex justify-between text-[13px] text-ink-soft">
											<span>Δ vs. asking</span>
											<span
												className={cn(
													"num",
													delta >= 0 ? "text-accent" : "text-ink",
												)}
											>
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
					<Reveal className="overflow-x-auto rounded-[14px] border border-hair bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] p-5 max-md:p-2">
						<table className="w-full border-collapse">
							<thead>
								<tr>
									<th className="p-4 text-left font-medium text-[11px] text-ink-mute uppercase tracking-[0.12em] max-md:p-3">
										Neighborhood
									</th>
									<th className="p-4 text-left font-medium text-[11px] text-ink-mute uppercase tracking-[0.12em] max-md:p-3">
										Unit
									</th>
									<th className="p-4 text-left font-medium text-[11px] text-ink-mute uppercase tracking-[0.12em] max-md:p-3">
										Listed
									</th>
									<th className="p-4 text-left font-medium text-[11px] text-ink-mute uppercase tracking-[0.12em] max-md:p-3">
										Leased
									</th>
									<th className="p-4 text-left font-medium text-[11px] text-ink-mute uppercase tracking-[0.12em] max-md:p-3">
										Δ
									</th>
									<th className="p-4 text-left font-medium text-[11px] text-ink-mute uppercase tracking-[0.12em] max-md:p-3">
										Days
									</th>
									<th className="p-4 text-left font-medium text-[11px] text-ink-mute uppercase tracking-[0.12em] max-md:p-3">
										Signed
									</th>
								</tr>
							</thead>
							<tbody>
								{LEASES.map((l) => {
									const delta = l.leased - l.listed;
									return (
										<tr
											className="border-hair border-t transition-colors hover:bg-[color-mix(in_oklab,var(--bg),var(--accent)_4%)]"
											key={`${l.n}-${l.u}-${l.signed}-row`}
										>
											<td className="p-4 text-[15px] max-md:p-3">{l.n}</td>
											<td className="p-4 text-[15px] max-md:p-3">{l.u}</td>
											<td className="num p-4 text-[15px] max-md:p-3">
												${l.listed.toLocaleString()}
											</td>
											<td className="num p-4 text-[15px] max-md:p-3">
												${l.leased.toLocaleString()}
											</td>
											<td
												className={cn(
													"num p-4 text-[15px] max-md:p-3",
													delta >= 0 ? "text-accent" : "text-ink",
												)}
											>
												{delta >= 0 ? "+" : "−"}${Math.abs(delta)}
											</td>
											<td className="num p-4 text-[15px] max-md:p-3">
												{l.days}
											</td>
											<td className="p-4 text-[15px] text-ink-soft max-md:p-3">
												{l.signed}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</Reveal>
				)}

				<Reveal className="mt-9 grid grid-cols-3 gap-7 border-hair border-t pt-7 max-md:grid-cols-1">
					<div>
						<div className="num font-medium text-[clamp(32px,3.6vw,44px)] text-accent leading-none tracking-[-0.025em]">
							<CountUp decimals={1} suffix="%" to={stats.pctOfAsking} />
						</div>
						<div className="mt-2 max-w-[28ch] text-[14px] text-ink-soft leading-[1.45]">
							of asking rent achieved across these leases.
						</div>
					</div>
					<div>
						<div className="num font-medium text-[clamp(32px,3.6vw,44px)] leading-none tracking-[-0.025em]">
							{stats.withinOnePct}/{stats.count}
						</div>
						<div className="mt-2 max-w-[28ch] text-[14px] text-ink-soft leading-[1.45]">
							signed within 1% of the listed price.
						</div>
					</div>
					<div>
						<div className="num font-medium text-[clamp(32px,3.6vw,44px)] leading-none tracking-[-0.025em]">
							{stats.medianDays}
						</div>
						<div className="mt-2 max-w-[28ch] text-[14px] text-ink-soft leading-[1.45]">
							median days from list to signed lease.
						</div>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
