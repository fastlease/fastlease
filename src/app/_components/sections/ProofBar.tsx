"use client";

import { CountUp } from "../ui/CountUp";
import { Reveal } from "../ui/Reveal";

const NUM_LEASED = 127;
const AVG_DAYS = 16;
const PCT_ASKING = 99.4;
const GUARANTEE_DAYS = 21;

export function ProofBar() {
	return (
		<section className="section-pad py-10">
			<div className="wrap">
				<hr className="border-hair border-t" />
				<Reveal className="grid grid-cols-4 gap-0 py-14 max-md:grid-cols-2 max-md:gap-y-6 max-md:py-9">
					{[
						{ v: NUM_LEASED, label: "Condos leased", sub: "2025 YTD" },
						{
							v: AVG_DAYS,
							label: "Days, average",
							sub: "Listing to signed lease",
						},
						{
							v: PCT_ASKING,
							label: "% of asking",
							sub: "Achieved on closed leases",
							decimals: 1,
							suffix: "%",
						},
						{
							v: GUARANTEE_DAYS,
							label: "Day guarantee",
							sub: "Or you don't pay",
						},
					].map((s) => (
						<div
							className="border-hair border-l px-6 first:border-l-0 first:pl-0 max-md:nth-[3]:border-l-0 max-md:nth-[3]:pl-0"
							key={s.label}
						>
							<div className="num font-medium text-[clamp(56px,8vw,104px)] leading-none tracking-[-0.04em] max-md:text-[clamp(44px,12vw,68px)]">
								<CountUp decimals={s.decimals} suffix={s.suffix} to={s.v} />
							</div>
							<div className="mt-3.5 font-medium text-[14px] text-ink">
								{s.label}
							</div>
							<div className="mt-0.5 text-[12px] text-ink-mute tracking-[0.02em]">
								{s.sub}
							</div>
						</div>
					))}
				</Reveal>
				<hr className="border-hair border-t" />
			</div>
		</section>
	);
}
