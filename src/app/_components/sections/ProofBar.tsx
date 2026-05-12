"use client";

import { Reveal } from "../ui/Reveal";
import { CountUp } from "../ui/CountUp";

const NUM_LEASED = 127;
const AVG_DAYS = 16;
const PCT_ASKING = 99.4;
const GUARANTEE_DAYS = 21;

export function ProofBar() {
	return (
		<section className="section-pad py-10">
			<div className="wrap">
				<hr className="border-t border-hair" />
				<Reveal className="grid grid-cols-4 max-md:grid-cols-2 py-14 max-md:py-9 gap-0 max-md:gap-y-6">
					{[
						{ v: NUM_LEASED, label: "Condos leased", sub: "2025 YTD" },
						{ v: AVG_DAYS, label: "Days, average", sub: "Listing to signed lease" },
						{ v: PCT_ASKING, label: "% of asking", sub: "Achieved on closed leases", decimals: 1, suffix: "%" },
						{ v: GUARANTEE_DAYS, label: "Day guarantee", sub: "Or you don't pay" },
					].map((s, i) => (
						<div key={i} className="px-6 border-l border-hair first:border-l-0 first:pl-0 max-md:nth-[3]:border-l-0 max-md:nth-[3]:pl-0">
							<div className="text-[clamp(56px,8vw,104px)] max-md:text-[clamp(44px,12vw,68px)] font-medium tracking-[-0.04em] leading-none num">
								<CountUp to={s.v} decimals={s.decimals} suffix={s.suffix} />
							</div>
							<div className="text-[14px] font-medium mt-3.5 text-ink">{s.label}</div>
							<div className="text-[12px] text-ink-mute mt-0.5 tracking-[0.02em]">{s.sub}</div>
						</div>
					))}
				</Reveal>
				<hr className="border-t border-hair" />
			</div>
		</section>
	);
}
