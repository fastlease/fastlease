"use client";

import { Reveal } from "../ui/Reveal";
import { Button } from "../ui/Button";

interface OperatorProps {
	onOpenCall?: () => void;
}

export function Operator({ onOpenCall }: OperatorProps) {
	return (
		<section id="operator" className="section-pad bg-[color-mix(in_oklab,var(--bg),var(--ink)_3%)]">
			<div className="wrap">
				<Reveal className="flex items-center gap-4 mb-7">
					<span className="num text-[12px] tracking-[0.14em] text-ink-mute uppercase">05</span>
					<span className="flex-1 h-[1px] bg-hair" />
					<span className="text-[11px] font-medium tracking-[0.14em] text-ink-mute uppercase">Who runs the file</span>
				</Reveal>

				<div className="grid grid-cols-[1fr_1.35fr] max-md:grid-cols-1 gap-14 max-md:gap-8 items-start">
					<div>
						<Reveal as="div" className="text-[clamp(30px,3.2vw,40px)] font-medium tracking-[-0.025em] leading-[1.05] mb-2">
							Sasha Bastani
						</Reveal>
						<Reveal as="div" className="text-[15px] text-ink-soft mb-8">
							Broker · Property.ca Inc. Brokerage
						</Reveal>

						<Reveal className="flex flex-col">
							{[
								{ k: "Brokerage", v: "Property.ca Inc." },
								{ k: "Coverage", v: "Toronto condo market" },
								{ k: "Distribution", v: "property.ca · condos.ca" },
								{ k: "License", v: "Ontario, RECO registered" },
							].map((r) => (
								<div key={r.k} className="grid grid-cols-[140px_1fr] gap-3 py-3 border-t border-hair last:border-b">
									<span className="uppercase tracking-[0.12em] text-[11px] text-ink-mute font-medium pt-0.5">{r.k}</span>
									<span className="text-[15px] text-ink">{r.v}</span>
								</div>
							))}
						</Reveal>

						<Reveal className="mt-8">
							<Button variant="ghost" onClick={onOpenCall}>Book a 15-minute call</Button>
						</Reveal>
					</div>

					<div className="max-md:order-first">
						<Reveal as="p" className="text-[19px] max-md:text-[17px] text-ink leading-[1.45] max-w-[52ch] mb-6">
							&ldquo;I built FastLease because the leasing process I worked inside as a broker
							was good at activity and bad at outcomes. The 21-day guarantee, the
							published screening standards, and the placement on property.ca and
							condos.ca are the three things I wished every owner got by default.&rdquo;
						</Reveal>
						<Reveal as="div" className="text-[13px] uppercase tracking-[0.12em] text-ink-mute">
							— Sasha Bastani, Broker
						</Reveal>

						<Reveal as="p" className="mt-10 text-[15px] text-ink-soft leading-[1.6] max-w-[52ch]">
							Property.ca Inc. Brokerage is the firm behind property.ca and condos.ca, two of
							Toronto&apos;s most-trafficked real-estate platforms. FastLease is the leasing
							product built inside that brokerage — same audience, same data, with the
							operating discipline of a guaranteed timeline.
						</Reveal>
					</div>
				</div>
			</div>
		</section>
	);
}
