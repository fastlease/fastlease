"use client";

import { trackCTA, useSectionView } from "~/lib/analytics";
import { Experiments, PRICING_VARIANTS, useExperiment } from "~/lib/experiment";
import { Button } from "../ui/Button";
import { Reveal } from "../ui/Reveal";

interface PricingProps {
	onOpenForm?: () => void;
}

// Representative 1BR rent for the dollar variant. 21% of one month's rent is
// what comes off the fee on day 22. Kept conservative so the framing is
// honest for the median listing — 2BR+ owners do better than this.
const REPRESENTATIVE_RENT = 2650;
const DISCOUNT_DOLLARS = Math.round((REPRESENTATIVE_RENT * 0.21) / 5) * 5;

export function Pricing({ onOpenForm }: PricingProps) {
	const variant = useExperiment(Experiments.pricingFraming, PRICING_VARIANTS);
	const sectionRef = useSectionView("pricing");

	const guaranteeHeadline =
		variant === "dollar"
			? `Day 22 → about $${DISCOUNT_DOLLARS} off the fee.`
			: "Day 22 → 21% off the fee.";

	const firstTerm =
		variant === "dollar"
			? `If no qualified tenant has signed by end of day 21, your fee is automatically reduced by 21% — roughly $${DISCOUNT_DOLLARS} on a typical 1BR, more on a 2BR+. The discount applies whenever the lease is eventually signed.`
			: "If no qualified tenant has signed by end of day 21, your fee is automatically reduced by 21%. The discount applies whenever the lease is eventually signed.";

	return (
		<section
			className="section-pad"
			id="pricing"
			ref={sectionRef as React.RefObject<HTMLElement>}
		>
			<div className="wrap">
				<Reveal className="mb-7 flex items-center gap-4">
					<span className="num text-[12px] text-ink-mute uppercase tracking-[0.14em]">
						08
					</span>
					<span className="h-[1px] flex-1 bg-hair" />
					<span className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.14em]">
						Pricing & guarantee terms
					</span>
				</Reveal>

				<Reveal as="h2" className="mb-12 max-w-[28ch]">
					No estimates. No asterisks. Two numbers, posted up front.
				</Reveal>

				<div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
					<Reveal className="flex flex-col gap-3.5 rounded-[14px] border border-hair bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] p-9 max-md:p-7">
						<div className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.12em]">
							Flat fee · all-in
						</div>
						<div className="my-1.5 mb-2">
							<span className="num font-medium text-[clamp(28px,3vw,38px)] tracking-[-0.025em]">
								One month&apos;s rent
							</span>
						</div>
						<div className="mb-3 text-[15px] text-ink-soft">
							Payable on signed lease. Nothing payable up front, nothing payable
							if we don&apos;t deliver.
						</div>
						<ul className="m-0 flex list-none flex-col gap-3 p-0">
							{[
								"Pricing analysis & professional photography",
								"Listed across all major platforms (14)",
								"All showings, screening, and verification",
								"Lease drafting and execution",
								"Weekly written reports throughout",
							].map((li) => (
								<li
									className="flex items-baseline gap-1 text-[15px] text-ink"
									key={li}
								>
									<span className="mr-1 font-bold text-accent">›</span> {li}
								</li>
							))}
						</ul>
					</Reveal>

					<Reveal className="flex flex-col gap-3.5 rounded-[14px] border border-[color-mix(in_oklab,var(--accent),transparent_70%)] bg-[color-mix(in_oklab,var(--accent),var(--bg,#FAF8F3)_90%)] p-9 max-md:p-7">
						<div className="font-medium text-[11px] text-accent uppercase tracking-[0.12em]">
							The 21-day guarantee
						</div>
						<div className="my-1.5 mb-2">
							<span className="num font-medium text-[clamp(28px,3vw,38px)] tracking-[-0.025em]">
								{guaranteeHeadline}
							</span>
						</div>
						<div className="mb-3 text-[15px] text-ink-soft">
							Skin in the game, in writing. Not contingent payment in a dress.
						</div>
						<ol className="m-0 flex list-none flex-col gap-3 p-0">
							{[
								{ num: "01", text: firstTerm },
								{
									num: "02",
									text: "If we sign before day 21, the original flat fee applies — never any escalation, never any re-list surcharge.",
								},
								{
									num: "03",
									text: "Exclusions, listed once: owners requesting list pricing >5% above our recommended range, or units with active building disputes. We will say so before you sign.",
								},
							].map((li) => (
								<li
									className="grid grid-cols-[28px_1fr] items-baseline gap-1 text-[15px] text-ink"
									key={li.num}
								>
									<span className="num font-medium text-[12px] text-ink-mute tracking-[0.04em]">
										{li.num}
									</span>
									<span>{li.text}</span>
								</li>
							))}
						</ol>
					</Reveal>
				</div>

				<Reveal className="mt-9 flex flex-wrap items-center gap-6 max-sm:gap-4">
					<Button
						onClick={() => {
							trackCTA("pricing", "timeline", { variant });
							onOpenForm?.();
						}}
						showArrow
					>
						Get my 21-day plan
					</Button>
					<span className="max-w-[44ch] text-[14px] text-ink-mute">
						A 60-second form returns an estimated days-to-lease, suggested rent,
						and recommended listing date.
					</span>
				</Reveal>
			</div>
		</section>
	);
}
