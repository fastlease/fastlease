"use client";

import { trackCTA, useSectionView } from "~/lib/analytics";
import { Button } from "../ui/Button";
import { Reveal } from "../ui/Reveal";

interface FinalCTAProps {
	onOpenForm?: () => void;
	onOpenCall?: () => void;
}

export function FinalCTA({ onOpenForm, onOpenCall }: FinalCTAProps) {
	const sectionRef = useSectionView("final-cta");

	return (
		<section
			className="section-pad bg-[color-mix(in_oklab,var(--bg),var(--ink)_4%)]"
			ref={sectionRef as React.RefObject<HTMLElement>}
		>
			<div className="wrap flex max-w-[720px] flex-col items-center text-center">
				<Reveal className="flex items-center gap-2.5 font-medium text-[11px] text-ink-mute uppercase tracking-[0.14em]">
					<span className="h-1.5 w-1.5 rounded-full bg-accent" />
					One decision, two paths
				</Reveal>
				<Reveal as="h2" className="my-6 mb-4.5 max-w-[22ch]">
					Find out how fast your condo would lease.
				</Reveal>
				<Reveal
					as="p"
					className="mb-9 max-w-[48ch] text-[17px] text-ink-soft leading-[1.55]"
				>
					A 60-second form returns an estimated days-to-lease, a suggested rent
					range, and a recommended listing date. If we miss the 21-day mark when
					you engage us, our fee drops 21%.
				</Reveal>
				<Reveal className="flex flex-wrap justify-center gap-4">
					<Button
						onClick={() => {
							trackCTA("final-cta", "timeline");
							onOpenForm?.();
						}}
						showArrow
					>
						Get my 21-day plan
					</Button>
					<Button
						onClick={() => {
							trackCTA("final-cta", "call");
							onOpenCall?.();
						}}
						variant="ghost"
					>
						Book a 15-minute call
					</Button>
				</Reveal>
				<Reveal as="p" className="mt-7 text-[13px] text-ink-mute">
					No pressure. No follow-up calls unless you ask.
				</Reveal>
			</div>
		</section>
	);
}
