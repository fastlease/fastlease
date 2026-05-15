"use client";

import { useEffect, useMemo, useState } from "react";
import { Reveal } from "../ui/Reveal";
import { Button } from "../ui/Button";
import { cn } from "~/lib/utils";
import { NEIGHBORHOODS, BEDROOM_TYPES } from "~/lib/leases";
import { estimate as runEstimate } from "~/lib/estimator";

interface RentWidgetProps {
	onOpen?: (initial: { neighborhood: string; bedrooms: string }) => void;
	onChange?: (selection: { neighborhood: string; bedrooms: string }) => void;
}

export function RentWidget({ onOpen, onChange }: RentWidgetProps) {
	const [neighborhood, setNeighborhood] = useState("King West");
	const [bedrooms, setBedrooms] = useState("1BR");

	const result = useMemo(
		() => runEstimate({ bedrooms, neighborhood }),
		[bedrooms, neighborhood],
	);

	useEffect(() => {
		onChange?.({ neighborhood, bedrooms });
	}, [neighborhood, bedrooms, onChange]);

	return (
		<section className="section-pad">
			<div className="wrap">
				<Reveal className="p-9 max-md:p-7 bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] border border-hair rounded-[14px]">
					<div className="grid grid-cols-[1.1fr_1fr] max-lg:grid-cols-1 gap-10 max-lg:gap-7 items-center">
						<div>
							<div className="text-[11px] font-medium tracking-[0.14em] text-ink-mute uppercase mb-3.5">Where would yours fit?</div>
							<h3 className="text-[clamp(26px,2.6vw,34px)] font-medium tracking-[-0.025em] leading-[1.1] mb-5 max-w-[22ch]">
								See what your unit would lease for in twelve seconds.
							</h3>

							<div className="flex flex-col gap-3.5">
								<div>
									<label className="text-[11px] uppercase tracking-[0.12em] text-ink-mute font-medium block mb-1.5">Neighborhood</label>
									<select
										value={neighborhood}
										onChange={(e) => setNeighborhood(e.target.value)}
										className="h-11 px-3 rounded-lg border border-hair-strong bg-[var(--bg,#FAF8F3)] text-ink font-sans text-[15px] outline-none focus:border-ink w-full max-w-[300px]"
									>
										{NEIGHBORHOODS.map((n) => (
											<option key={n} value={n}>{n}</option>
										))}
									</select>
								</div>
								<div>
									<label className="text-[11px] uppercase tracking-[0.12em] text-ink-mute font-medium block mb-1.5">Bedrooms</label>
									<div className="flex flex-wrap gap-1.5">
										{BEDROOM_TYPES.map((b) => (
											<button
												key={b}
												type="button"
												onClick={() => setBedrooms(b)}
												className={cn(
													"appearance-none cursor-pointer h-10 px-3.5 border border-hair-strong rounded-full text-[13px] transition-colors hover:border-ink",
													bedrooms === b && "border-ink bg-ink text-paper",
												)}
											>
												{b}
											</button>
										))}
									</div>
								</div>
							</div>
						</div>

						<div className="border-l max-lg:border-l-0 max-lg:border-t border-hair pl-10 max-lg:pl-0 max-lg:pt-7">
							<div className="text-[11px] uppercase tracking-[0.12em] text-ink-mute font-medium mb-3.5">Live estimate</div>
							<div className="flex flex-col gap-3">
								<div className="flex justify-between items-baseline border-b border-hair pb-3">
									<span className="text-[13px] text-ink-soft">Suggested rent</span>
									<span className="text-[clamp(22px,2vw,28px)] font-medium tracking-[-0.02em] num">
										${result.rentLow.toLocaleString()}–${result.rentHigh.toLocaleString()}
									</span>
								</div>
								<div className="flex justify-between items-baseline border-b border-hair pb-3">
									<span className="text-[13px] text-ink-soft">Days to lease</span>
									<span className="text-[clamp(22px,2vw,28px)] font-medium tracking-[-0.02em] num text-accent">
										{result.days}
									</span>
								</div>
								<div className="flex justify-between items-baseline pb-1">
									<span className="text-[13px] text-ink-soft">Signed by</span>
									<span className="text-[clamp(22px,2vw,28px)] font-medium tracking-[-0.02em] num">{result.leaseBy}</span>
								</div>
							</div>
							<div className="mt-6">
								<Button
									onClick={() => onOpen?.({ neighborhood, bedrooms })}
									className="w-full"
									showArrow
								>
									Get my 21-day plan
								</Button>
								<p className="text-[12px] text-ink-mute mt-2.5 leading-[1.45]">
									Adds your target rent and move-in window for a complete estimate.
								</p>
							</div>
						</div>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
