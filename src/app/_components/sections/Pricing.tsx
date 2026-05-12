"use client";

import { Reveal } from "../ui/Reveal";
import { Button } from "../ui/Button";

interface PricingProps {
	onOpenForm?: () => void;
}

export function Pricing({ onOpenForm }: PricingProps) {
	return (
		<section id="pricing" className="section-pad">
			<div className="wrap">
				<Reveal className="flex items-center gap-4 mb-7">
					<span className="num text-[12px] tracking-[0.14em] text-ink-mute uppercase">06</span>
					<span className="flex-1 h-[1px] bg-hair" />
					<span className="text-[11px] font-medium tracking-[0.14em] text-ink-mute uppercase">Pricing & guarantee terms</span>
				</Reveal>

				<Reveal as="h2" className="max-w-[26ch] mb-12">No estimates. No asterisks. Visible from the homepage.</Reveal>

				<div className="grid grid-cols-2 max-md:grid-cols-1 gap-5">
					<Reveal className="p-9 max-md:p-7 flex flex-col gap-3.5 bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] border border-hair rounded-[14px]">
						<div className="text-[11px] font-medium tracking-[0.12em] text-ink-mute uppercase">Flat fee · all-in</div>
						<div className="my-1.5 mb-2">
							<span className="text-[clamp(28px,3vw,38px)] font-medium tracking-[-0.025em] num">One month&apos;s rent</span>
						</div>
						<div className="text-[15px] text-ink-soft mb-3">Payable on signed lease. Nothing payable up front, nothing payable if we don&apos;t deliver.</div>
						<ul className="list-none p-0 m-0 flex flex-col gap-3">
							{["Pricing analysis & professional photography", "Listed across all major platforms (14)", "All showings, screening, and verification", "Lease drafting and execution", "Weekly written reports throughout"].map((li, i) => (
								<li key={i} className="text-[15px] text-ink flex gap-1 items-baseline">
									<span className="text-accent font-bold mr-1">›</span> {li}
								</li>
							))}
						</ul>
					</Reveal>

					<Reveal className="p-9 max-md:p-7 flex flex-col gap-3.5 bg-[color-mix(in_oklab,var(--accent),var(--bg,#FAF8F3)_90%)] border border-[color-mix(in_oklab,var(--accent),transparent_70%)] rounded-[14px]">
						<div className="text-[11px] font-medium tracking-[0.12em] text-accent uppercase">The 21-day guarantee</div>
						<div className="my-1.5 mb-2">
							<span className="text-[clamp(28px,3vw,38px)] font-medium tracking-[-0.025em] num">Day 22 → you don&apos;t pay.</span>
						</div>
						<div className="text-[15px] text-ink-soft mb-3">In plain English, in three bullets, on the homepage.</div>
						<ol className="list-none p-0 m-0 flex flex-col gap-3">
							{[
								{ num: "01", text: "If no qualified tenant has signed by end of day 21, the fee is suspended. We continue to work without invoicing." },
								{ num: "02", text: "If we lease the unit afterward, the original flat fee applies — never any escalation." },
								{ num: "03", text: "Exclusions are listed once, plainly: owners requesting list pricing >5% above our recommended range, or units with active building disputes." },
							].map((li, i) => (
								<li key={i} className="text-[15px] text-ink grid grid-cols-[28px_1fr] gap-1 items-baseline">
									<span className="text-[12px] tracking-[0.04em] text-ink-mute num font-medium">{li.num}</span>
									<span>{li.text}</span>
								</li>
							))}
						</ol>
					</Reveal>
				</div>

				<Reveal className="mt-9 flex items-center gap-6 flex-wrap max-sm:gap-4">
					<Button onClick={onOpenForm} showArrow>
						Get Your Leasing Timeline
					</Button>
					<span className="text-[14px] text-ink-mute max-w-[44ch]">A 60-second form returns an estimated days-to-lease, suggested rent, and recommended listing date.</span>
				</Reveal>
			</div>
		</section>
	);
}
