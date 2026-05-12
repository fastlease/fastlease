"use client";

import { Reveal } from "../ui/Reveal";
import { Button } from "../ui/Button";

interface FinalCTAProps {
	onOpenForm?: () => void;
	onOpenCall?: () => void;
}

export function FinalCTA({ onOpenForm, onOpenCall }: FinalCTAProps) {
	return (
		<section className="section-pad bg-[color-mix(in_oklab,var(--bg),var(--ink)_4%)]">
			<div className="wrap flex flex-col items-center text-center max-w-[720px]">
				<Reveal className="uppercase text-[11px] font-medium tracking-[0.14em] text-ink-mute flex items-center gap-2.5">
					<span className="w-1.5 h-1.5 rounded-full bg-accent" />
					One decision, two paths
				</Reveal>
				<Reveal as="h2" className="my-6 mb-4.5 max-w-[22ch]">Find out how fast your condo would lease.</Reveal>
				<Reveal as="p" className="text-[17px] text-ink-soft max-w-[48ch] mb-9 leading-[1.55]">
					A 60-second form returns an estimated days-to-lease, a suggested rent range, and
					a recommended listing date. If we miss the 21-day mark when you engage us, our
					fee drops 21%.
				</Reveal>
				<Reveal className="flex gap-4 flex-wrap justify-center">
					<Button onClick={onOpenForm} showArrow>
						Get Your Leasing Timeline
					</Button>
					<Button variant="ghost" onClick={onOpenCall}>
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
