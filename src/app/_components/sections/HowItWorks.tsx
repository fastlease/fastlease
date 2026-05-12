"use client";

import { Reveal } from "../ui/Reveal";
import { cn } from "~/lib/utils";

const PHASE_CARDS = [
	{
		days: "Days 1–3",
		title: "Listed and live.",
		body: "A pricing analysis against comparable units in the building (not just the neighborhood). Professional photography. Syndication across fourteen platforms — including the three Toronto landlords actually use.",
		bullets: ["Comparable-unit pricing", "Professional photography", "Listed across 14 platforms"],
	},
	{
		days: "Days 4–14",
		title: "Qualified showings.",
		body: "Inbound inquiry is filtered before it ever reaches your inbox. Showings are scheduled in clusters so the unit reads as in-demand. You get a single weekly report with the things worth knowing — never a list of every email.",
		bullets: ["Pre-screened inquiries", "Clustered showings", "Weekly operator report"],
	},
	{
		days: "Days 15–21",
		title: "Screened and signed.",
		body: "Applications are stack-ranked against the criteria we publish below. Credit, income, employment, prior-landlord references — verified, not just checked off. You approve the tenant. We execute the lease.",
		bullets: ["Stack-ranked applications", "Verified — not just checked", "Lease executed by day 21"],
	},
];

export function HowItWorks() {
	return (
		<section id="how" className="section-pad">
			<div className="wrap">
				<Reveal className="flex items-center gap-4 mb-7">
					<span className="num text-[12px] tracking-[0.14em] text-ink-mute uppercase">03</span>
					<span className="flex-1 h-[1px] bg-hair" />
					<span className="text-[11px] font-medium tracking-[0.14em] text-ink-mute uppercase">How it works</span>
				</Reveal>
				
				<Reveal as="h2" className="max-w-[22ch] mb-4">Three phases. Nine days of slack built in.</Reveal>
				<Reveal as="p" className="text-[17px] text-ink-soft max-w-[60ch] mb-14 leading-[1.55]">
					The schedule below is what we plan to. The guarantee is what we promise. The gap
					between the two is deliberate — and the reason landlords stop reading other
					leasing sites once they reach this section.
				</Reveal>

				<div className="grid grid-cols-3 max-lg:grid-cols-1 gap-5">
					{PHASE_CARDS.map((p, i) => (
						<Reveal key={i} className="p-7 pb-8 flex flex-col gap-4 bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] border border-hair rounded-[14px]">
							<div className="flex justify-between items-baseline">
								<span className="text-[11px] font-medium tracking-[0.14em] text-ink-mute uppercase num">{p.days}</span>
								<span className="text-ink-faint text-[12px] tracking-[0.04em] num">0{i + 1} / 03</span>
							</div>
							<h3 className="text-[22px] leading-[1.2]">{p.title}</h3>
							<p className="text-[15px] text-ink-soft leading-[1.5]">{p.body}</p>
							<ul className="list-none p-0 m-0 mt-1.5 flex flex-col gap-2">
								{p.bullets.map((b, j) => (
									<li key={j} className="text-[14px] text-ink">
										<span className="text-accent mr-2 font-bold">›</span> {b}
									</li>
								))}
							</ul>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
