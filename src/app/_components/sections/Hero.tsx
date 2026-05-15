"use client";

import { Reveal } from "../ui/Reveal";
import { Button } from "../ui/Button";

const NUM_LEASED = 127;
const AVG_DAYS = 16;
const PCT_ASKING = 99.4;
const GUARANTEE_DAYS = 21;

const HEADLINES = [
	{ eyebrow: "Toronto Condo Leasing", h: "Leased by day 21,\nor 21% off the fee." },
	{ eyebrow: "A leasing system, not a service", h: "A date, not\na best effort." },
	{ eyebrow: "Toronto Condo Leasing", h: "21 days.\nOr 21% off." },
];

interface HeroProps {
	headlineIdx?: number;
	onOpenForm?: () => void;
}

export function Hero({ headlineIdx = 0, onOpenForm }: HeroProps) {
	const data = HEADLINES[headlineIdx] ?? HEADLINES[0]!;

	return (
		<section id="top" className="section-pad pt-[clamp(56px,8vw,100px)] pb-[clamp(40px,6vw,80px)]">
			<div className="wrap flex flex-col items-start max-w-[1080px]">
				<Reveal className="mb-7 uppercase text-[11px] font-medium tracking-[0.14em] text-ink-mute flex items-center gap-[10px]">
					<span className="w-1.5 h-1.5 rounded-full bg-accent" />
					{data.eyebrow}
				</Reveal>

				<Reveal as="h1" className="mb-7 max-w-[14ch] leading-[1.05] tracking-[-0.03em] [text-wrap:balance]">
					{data.h.split("\n").map((line, i, arr) => (
						<span key={i}>
							{line}
							{i < arr.length - 1 && <br />}
						</span>
					))}
				</Reveal>

				<Reveal as="p" className="text-[clamp(18px,1.5vw,22px)] text-ink-soft max-w-[56ch] mb-10 leading-[1.45]">
					A modern leasing system for Toronto condo owners. If we don&apos;t sign a qualified tenant in {GUARANTEE_DAYS} days, our fee drops {GUARANTEE_DAYS}% — automatically, in writing, no escalation either way.
				</Reveal>

				<Reveal className="flex gap-6 items-center mb-8 max-sm:flex-col max-sm:items-stretch max-sm:gap-4">
					<Button onClick={onOpenForm} showArrow>
						Get my 21-day plan
					</Button>
					<a href="#how" className="inline-flex items-center gap-1.5 text-ink border-b border-ink-faint pb-[2px] text-[15px] hover:border-ink transition-all max-sm:self-start">
						See how it works <span>→</span>
					</a>
				</Reveal>

				<Reveal className="flex flex-wrap gap-2 items-baseline text-[14px] text-ink-mute">
					<span className="num text-ink font-medium">{NUM_LEASED}</span> condos leased in 2025
					<span className="text-ink-faint mx-1">·</span>
					Average: <span className="num text-ink font-medium">{AVG_DAYS} days</span>
					<span className="text-ink-faint mx-1">·</span>
					<span className="num text-ink font-medium">{PCT_ASKING}%</span> of asking
					<span className="text-ink-faint mx-1">·</span>
					Featured on <span className="text-ink font-medium">property.ca</span> + <span className="text-ink font-medium">condos.ca</span>
				</Reveal>
			</div>
		</section>
	);
}
