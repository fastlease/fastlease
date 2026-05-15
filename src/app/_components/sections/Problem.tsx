"use client";

import { useMemo, useState } from "react";
import {
	dailyRent,
	estimate as runEstimate,
	TORONTO_AVG_DAYS,
} from "~/lib/estimator";
import { cn } from "~/lib/utils";
import { Reveal } from "../ui/Reveal";

const PRESETS = [21, 45, 90];

interface ProblemProps {
	ctx?: { neighborhood: string; bedrooms: string };
}

export function Problem({ ctx }: ProblemProps) {
	const neighborhood = ctx?.neighborhood ?? "King West";
	const bedrooms = ctx?.bedrooms ?? "1BR";
	const [days, setDays] = useState(45);

	const perDay = useMemo(
		() => dailyRent(neighborhood, bedrooms),
		[neighborhood, bedrooms],
	);
	const fastleaseDays = useMemo(
		() => runEstimate({ neighborhood, bedrooms }).days,
		[neighborhood, bedrooms],
	);
	const lost = days * perDay;
	const savedDays = Math.max(0, TORONTO_AVG_DAYS - fastleaseDays);
	const saved = savedDays * perDay;

	return (
		<section className="section-pad bg-[color-mix(in_oklab,var(--bg),var(--ink)_3%)]">
			<div className="wrap grid grid-cols-1">
				<Reveal className="mb-7 flex items-center gap-4">
					<span className="num text-[12px] text-ink-mute uppercase tracking-[0.14em]">
						03
					</span>
					<span className="h-[1px] flex-1 bg-hair" />
					<span className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.14em]">
						The cost of vacancy
					</span>
				</Reveal>

				<div className="grid grid-cols-[1.1fr_1fr] items-start gap-14 max-lg:grid-cols-1 max-lg:gap-10">
					<div>
						<Reveal as="h2" className="mb-8 max-w-[22ch]">
							Every vacant day costs you{" "}
							<span className="num text-accent">${perDay}</span>.
						</Reveal>
						<Reveal
							as="p"
							className="mb-5 max-w-[48ch] text-[17px] text-ink-soft leading-[1.55]"
						>
							That&apos;s the daily rent on a {bedrooms} in {neighborhood}.
							Vacancy is rarely dramatic — it&apos;s a slow leak, three weeks
							here, six there, that most landlords don&apos;t sit down and total
							at the end of the year.
						</Reveal>
						<Reveal
							as="p"
							className="max-w-[48ch] text-[17px] text-ink-soft leading-[1.55]"
						>
							That&apos;s why FastLease is built around a date instead of a best
							effort. We don&apos;t think you&apos;re losing thousands. We know
							you already know the math, and you&apos;d rather work with someone
							who reports against it.
						</Reveal>
					</div>

					<Reveal>
						<div className="rounded-[14px] border border-hair bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] p-7 max-md:p-6">
							<div className="mb-5 font-medium text-[11px] text-ink-mute uppercase tracking-[0.14em]">
								The math, plainly
							</div>

							<div className="grid grid-cols-[1fr_auto] items-baseline border-hair border-t pt-4">
								<span className="text-[14px] text-ink-soft">Days vacant</span>
								<span className="num font-medium text-[28px] text-ink leading-none tracking-[-0.02em]">
									{days}
								</span>
							</div>
							<div className="mt-4 grid grid-cols-[1fr_auto] items-baseline border-hair border-t pt-4">
								<span className="text-[14px] text-ink-soft">× Daily rent</span>
								<span className="num font-medium text-[22px] text-ink-mute leading-none tracking-[-0.02em]">
									${perDay}
								</span>
							</div>
							<div className="mt-4 grid grid-cols-[1fr_auto] items-baseline border-ink/30 border-t border-double pt-5">
								<span className="text-[14px] text-ink-soft">Lost rent</span>
								<span className="num font-medium text-[clamp(40px,5vw,56px)] text-accent leading-none tracking-[-0.025em]">
									${lost.toLocaleString()}
								</span>
							</div>

							<div className="mt-7 flex flex-col gap-2.5">
								<div className="text-[11px] text-ink-mute uppercase tracking-[0.12em]">
									Try a scenario
								</div>
								<div className="flex flex-wrap gap-2">
									{PRESETS.map((d) => (
										<button
											className={cn(
												"num h-9 cursor-pointer appearance-none rounded-full border px-3.5 text-[14px] transition-colors",
												days === d
													? "border-ink bg-ink text-paper"
													: "border-hair-strong text-ink hover:border-ink",
											)}
											key={d}
											onClick={() => setDays(d)}
											type="button"
										>
											{d} days
										</button>
									))}
								</div>
							</div>

							{savedDays > 0 && (
								<div className="mt-7 border-hair border-t pt-5">
									<div className="mb-2 font-medium text-[11px] text-accent uppercase tracking-[0.12em]">
										What FastLease saves
									</div>
									<p className="text-[14px] text-ink-soft leading-[1.55]">
										Toronto average is{" "}
										<span className="num text-ink">{TORONTO_AVG_DAYS}</span>{" "}
										days. Your FastLease estimate finishes at{" "}
										<span className="num text-ink">{fastleaseDays}</span> —
										that&apos;s{" "}
										<span className="num text-ink">{savedDays}</span> days
										saved, or{" "}
										<span className="num text-accent">
											${saved.toLocaleString()}
										</span>{" "}
										not bled.
									</p>
								</div>
							)}
						</div>
					</Reveal>
				</div>
			</div>
		</section>
	);
}
