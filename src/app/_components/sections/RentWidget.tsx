"use client";

import { useEffect, useMemo, useState } from "react";
import { Events, track, trackCTA, useSectionView } from "~/lib/analytics";
import { estimate as runEstimate } from "~/lib/estimator";
import { BEDROOM_TYPES, NEIGHBORHOODS } from "~/lib/leases";
import { cn } from "~/lib/utils";
import { Button } from "../ui/Button";
import { Reveal } from "../ui/Reveal";

interface RentWidgetProps {
	onOpen?: (initial: { neighborhood: string; bedrooms: string }) => void;
	onChange?: (selection: { neighborhood: string; bedrooms: string }) => void;
}

export function RentWidget({ onOpen, onChange }: RentWidgetProps) {
	const [neighborhood, setNeighborhood] = useState("King West");
	const [bedrooms, setBedrooms] = useState("1BR");
	const sectionRef = useSectionView("rent-widget");

	const result = useMemo(
		() => runEstimate({ bedrooms, neighborhood }),
		[bedrooms, neighborhood],
	);

	useEffect(() => {
		onChange?.({ neighborhood, bedrooms });
	}, [neighborhood, bedrooms, onChange]);

	const handleSubmit = () => {
		track(Events.rentWidgetSubmitted, {
			neighborhood,
			bedrooms,
			days: result.days,
		});
		trackCTA("rent-widget", "timeline", { neighborhood, bedrooms });
		onOpen?.({ neighborhood, bedrooms });
	};

	return (
		<section
			className="section-pad"
			ref={sectionRef as React.RefObject<HTMLElement>}
		>
			<div className="wrap">
				<Reveal className="rounded-[14px] border border-hair bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] p-9 max-md:p-7">
					<div className="grid grid-cols-[1.1fr_1fr] items-center gap-10 max-lg:grid-cols-1 max-lg:gap-7">
						<div>
							<div className="mb-3.5 font-medium text-[11px] text-ink-mute uppercase tracking-[0.14em]">
								Where would yours fit?
							</div>
							<h3 className="mb-5 max-w-[22ch] font-medium text-[clamp(26px,2.6vw,34px)] leading-[1.1] tracking-[-0.025em]">
								See what your unit would lease for in twelve seconds.
							</h3>

							<div className="flex flex-col gap-3.5">
								<div>
									<label
										className="mb-1.5 block font-medium text-[11px] text-ink-mute uppercase tracking-[0.12em]"
										htmlFor="rent-neighborhood"
									>
										Neighborhood
									</label>
									<select
										className="h-11 w-full max-w-[300px] rounded-lg border border-hair-strong bg-[var(--bg,#FAF8F3)] px-3 font-sans text-[15px] text-ink outline-none focus:border-ink"
										id="rent-neighborhood"
										onChange={(e) => setNeighborhood(e.target.value)}
										value={neighborhood}
									>
										{NEIGHBORHOODS.map((n) => (
											<option key={n} value={n}>
												{n}
											</option>
										))}
									</select>
								</div>
								<div>
									<div className="mb-1.5 block font-medium text-[11px] text-ink-mute uppercase tracking-[0.12em]">
										Bedrooms
									</div>{" "}
									<div className="flex flex-wrap gap-1.5">
										{BEDROOM_TYPES.map((b) => (
											<button
												className={cn(
													"h-10 cursor-pointer appearance-none rounded-full border border-hair-strong px-3.5 text-[13px] transition-colors hover:border-ink",
													bedrooms === b && "border-ink bg-ink text-paper",
												)}
												key={b}
												onClick={() => setBedrooms(b)}
												type="button"
											>
												{b}
											</button>
										))}
									</div>
								</div>
							</div>
						</div>

						<div className="border-hair border-l pl-10 max-lg:border-t max-lg:border-l-0 max-lg:pt-7 max-lg:pl-0">
							<div className="mb-3.5 font-medium text-[11px] text-ink-mute uppercase tracking-[0.12em]">
								Live estimate
							</div>
							<div className="flex flex-col gap-3">
								<div className="flex items-baseline justify-between border-hair border-b pb-3">
									<span className="text-[13px] text-ink-soft">
										Suggested rent
									</span>
									<span className="num font-medium text-[clamp(22px,2vw,28px)] tracking-[-0.02em]">
										${result.rentLow.toLocaleString()}–$
										{result.rentHigh.toLocaleString()}
									</span>
								</div>
								<div className="flex items-baseline justify-between border-hair border-b pb-3">
									<span className="text-[13px] text-ink-soft">
										Days to lease
									</span>
									<span className="num font-medium text-[clamp(22px,2vw,28px)] text-accent tracking-[-0.02em]">
										{result.days}
									</span>
								</div>
								<div className="flex items-baseline justify-between pb-1">
									<span className="text-[13px] text-ink-soft">Signed by</span>
									<span className="num font-medium text-[clamp(22px,2vw,28px)] tracking-[-0.02em]">
										{result.leaseBy}
									</span>
								</div>
							</div>
							<div className="mt-6">
								<Button className="w-full" onClick={handleSubmit} showArrow>
									Get my 21-day plan
								</Button>
								<p className="mt-2.5 text-[12px] text-ink-mute leading-[1.45]">
									Adds your target rent and move-in window for a complete
									estimate.
								</p>
							</div>
						</div>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
