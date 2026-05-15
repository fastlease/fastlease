"use client";

import { trackCTA, useSectionView } from "~/lib/analytics";
import { Experiments, HERO_VARIANTS, useExperiment } from "~/lib/experiment";
import { Button } from "../ui/Button";
import { Reveal } from "../ui/Reveal";

const NUM_LEASED = 127;
const AVG_DAYS = 16;
const PCT_ASKING = 99.4;
const GUARANTEE_DAYS = 21;

const HEADLINES = [
	{
		eyebrow: "Toronto Condo Leasing",
		h: "Leased by day 21,\nor 21% off the fee.",
	},
	{
		eyebrow: "A leasing system, not a service",
		h: "A date, not\na best effort.",
	},
	{ eyebrow: "Toronto Condo Leasing", h: "21 days.\nOr 21% off." },
];

const VARIANT_COPY = {
	control: {
		eyebrow: "Toronto Condo Leasing",
		headline: "Leased by day 21,\nor 21% off the fee.",
		cta: "Get my 21-day plan",
	},
	"guarantee-first": {
		eyebrow: "Skin in the game · written guarantee",
		headline: "We sign your tenant\nby day 21 — or our\nfee drops 21%.",
		cta: "See if your unit qualifies",
	},
} as const;

interface HeroProps {
	headlineIdx?: number;
	onOpenForm?: () => void;
}

export function Hero({ headlineIdx, onOpenForm }: HeroProps) {
	const variant = useExperiment(Experiments.heroCopy, HERO_VARIANTS);
	const sectionRef = useSectionView("hero");

	const copy = VARIANT_COPY[variant];
	// Legacy `headlineIdx` prop still works for direct overrides, but loses the experiment.
	const fallback =
		headlineIdx != null ? (HEADLINES[headlineIdx] ?? HEADLINES[0]) : null;
	const eyebrow = fallback?.eyebrow ?? copy.eyebrow;
	const headline = fallback?.h ?? copy.headline;
	const ctaLabel = fallback ? "Get my 21-day plan" : copy.cta;

	const handleClick = () => {
		trackCTA("hero", "timeline", { variant });
		onOpenForm?.();
	};

	return (
		<section
			className="section-pad pt-[clamp(56px,8vw,100px)] pb-[clamp(40px,6vw,80px)]"
			id="top"
			ref={sectionRef as React.RefObject<HTMLElement>}
		>
			<div className="wrap flex max-w-[1080px] flex-col items-start">
				<Reveal className="mb-7 flex items-center gap-[10px] font-medium text-[11px] text-ink-mute uppercase tracking-[0.14em]">
					<span className="h-1.5 w-1.5 rounded-full bg-accent" />
					{eyebrow}
				</Reveal>

				<Reveal
					as="h1"
					className="mb-7 max-w-[14ch] leading-[1.05] tracking-[-0.03em] [text-wrap:balance]"
				>
					{headline.split("\n").map((line, i, arr) => (
						<span key={line}>
							{line}
							{i < arr.length - 1 && <br />}
						</span>
					))}{" "}
				</Reveal>
				<Reveal
					as="p"
					className="mb-10 max-w-[56ch] text-[clamp(18px,1.5vw,22px)] text-ink-soft leading-[1.45]"
				>
					A modern leasing system for Toronto condo owners. If we don&apos;t
					sign a qualified tenant in {GUARANTEE_DAYS} days, our fee drops{" "}
					{GUARANTEE_DAYS}% — automatically, in writing, no escalation either
					way.
				</Reveal>

				<Reveal className="mb-8 flex items-center gap-6 max-sm:flex-col max-sm:items-stretch max-sm:gap-4">
					<Button onClick={handleClick} showArrow>
						{ctaLabel}
					</Button>
					<a
						className="inline-flex items-center gap-1.5 border-ink-faint border-b pb-[2px] text-[15px] text-ink transition-all hover:border-ink max-sm:self-start"
						href="#how"
					>
						See how it works <span>→</span>
					</a>
				</Reveal>

				<Reveal className="flex flex-wrap items-baseline gap-2 text-[14px] text-ink-mute">
					<span className="num font-medium text-ink">{NUM_LEASED}</span> condos
					leased in 2025
					<span className="mx-1 text-ink-faint">·</span>
					Average:{" "}
					<span className="num font-medium text-ink">{AVG_DAYS} days</span>
					<span className="mx-1 text-ink-faint">·</span>
					<span className="num font-medium text-ink">{PCT_ASKING}%</span> of
					asking
					<span className="mx-1 text-ink-faint">·</span>
					Featured on <span className="font-medium text-ink">property.ca</span>{" "}
					+ <span className="font-medium text-ink">condos.ca</span>
				</Reveal>
			</div>
		</section>
	);
}
