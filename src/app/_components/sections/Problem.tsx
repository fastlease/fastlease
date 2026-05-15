"use client";

import { useMemo, useState } from "react";
import { Reveal } from "../ui/Reveal";
import { cn } from "~/lib/utils";
import { dailyRent, estimate as runEstimate, TORONTO_AVG_DAYS } from "~/lib/estimator";

const PRESETS = [21, 45, 90];

interface ProblemProps {
	ctx?: { neighborhood: string; bedrooms: string };
}

export function Problem({ ctx }: ProblemProps) {
	const neighborhood = ctx?.neighborhood ?? "King West";
	const bedrooms = ctx?.bedrooms ?? "1BR";
	const [days, setDays] = useState(45);

	const perDay = useMemo(() => dailyRent(neighborhood, bedrooms), [neighborhood, bedrooms]);
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
				<Reveal className="flex items-center gap-4 mb-7">
					<span className="num text-[12px] tracking-[0.14em] text-ink-mute uppercase">03</span>
					<span className="flex-1 h-[1px] bg-hair" />
					<span className="text-[11px] font-medium tracking-[0.14em] text-ink-mute uppercase">The cost of vacancy</span>
				</Reveal>

				<div className="grid grid-cols-[1.1fr_1fr] max-lg:grid-cols-1 gap-14 max-lg:gap-10 items-start">
					<div>
						<Reveal as="h2" className="max-w-[22ch] mb-8">
							Every vacant day costs you <span className="text-accent num">${perDay}</span>.
						</Reveal>
						<Reveal as="p" className="text-[17px] text-ink-soft leading-[1.55] max-w-[48ch] mb-5">
							That&apos;s the daily rent on a {bedrooms} in {neighborhood}. Vacancy is rarely
							dramatic — it&apos;s a slow leak, three weeks here, six there, that most landlords
							don&apos;t sit down and total at the end of the year.
						</Reveal>
						<Reveal as="p" className="text-[17px] text-ink-soft leading-[1.55] max-w-[48ch]">
							That&apos;s why FastLease is built around a date instead of a best effort. We don&apos;t
							think you&apos;re losing thousands. We know you already know the math, and you&apos;d
							rather work with someone who reports against it.
						</Reveal>
					</div>

					<Reveal>
						<div className="p-7 max-md:p-6 bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] border border-hair rounded-[14px]">
							<div className="text-[11px] font-medium tracking-[0.14em] text-ink-mute uppercase mb-5">The math, plainly</div>

							<div className="grid grid-cols-[1fr_auto] items-baseline border-t border-hair pt-4">
								<span className="text-[14px] text-ink-soft">Days vacant</span>
								<span className="text-[28px] font-medium tracking-[-0.02em] num text-ink leading-none">{days}</span>
							</div>
							<div className="grid grid-cols-[1fr_auto] items-baseline border-t border-hair pt-4 mt-4">
								<span className="text-[14px] text-ink-soft">× Daily rent</span>
								<span className="text-[22px] font-medium tracking-[-0.02em] num text-ink-mute leading-none">${perDay}</span>
							</div>
							<div className="grid grid-cols-[1fr_auto] items-baseline border-t border-double border-ink/30 pt-5 mt-4">
								<span className="text-[14px] text-ink-soft">Lost rent</span>
								<span className="text-[clamp(40px,5vw,56px)] font-medium tracking-[-0.025em] num text-accent leading-none">
									${lost.toLocaleString()}
								</span>
							</div>

							<div className="mt-7 flex flex-col gap-2.5">
								<div className="text-[11px] tracking-[0.12em] uppercase text-ink-mute">Try a scenario</div>
								<div className="flex flex-wrap gap-2">
									{PRESETS.map((d) => (
										<button
											key={d}
											type="button"
											onClick={() => setDays(d)}
											className={cn(
												"appearance-none cursor-pointer text-[14px] px-3.5 h-9 rounded-full border transition-colors num",
												days === d
													? "border-ink bg-ink text-paper"
													: "border-hair-strong text-ink hover:border-ink",
											)}
										>
											{d} days
										</button>
									))}
								</div>
							</div>

							{savedDays > 0 && (
								<div className="mt-7 pt-5 border-t border-hair">
									<div className="text-[11px] tracking-[0.12em] uppercase text-accent font-medium mb-2">
										What FastLease saves
									</div>
									<p className="text-[14px] text-ink-soft leading-[1.55]">
										Toronto average is <span className="num text-ink">{TORONTO_AVG_DAYS}</span> days. Your
										FastLease estimate finishes at <span className="num text-ink">{fastleaseDays}</span> —
										that&apos;s <span className="num text-ink">{savedDays}</span> days saved,
										or <span className="num text-accent">${saved.toLocaleString()}</span> not bled.
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
