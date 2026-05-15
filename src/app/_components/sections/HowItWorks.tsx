"use client";

import { Reveal } from "../ui/Reveal";

const PHASE_CARDS = [
	{
		days: "Days 1–3",
		title: "Listed and live.",
		body: "A pricing analysis against comparable units in the building, not just the neighborhood. Professional photography. Day-one featured placement on property.ca and condos.ca — plus syndication to twelve more platforms.",
		bullets: [
			"Comparable-unit pricing",
			"Professional photography",
			"property.ca + condos.ca on day one",
		],
	},
	{
		days: "Days 4–14",
		title: "Qualified showings.",
		body: "Inbound inquiry is filtered before it ever reaches your inbox. Showings are scheduled in clusters so the unit reads as in-demand. You get a single weekly report with the things worth knowing — never a list of every email.",
		bullets: [
			"Pre-screened inquiries",
			"Clustered showings",
			"Weekly operator report",
		],
	},
	{
		days: "Days 15–21",
		title: "Screened and signed.",
		body: "Applications are stack-ranked against the criteria we publish below. Credit, income, employment, prior-landlord references — verified, not just checked off. You approve the tenant. We execute the lease.",
		bullets: [
			"Stack-ranked applications",
			"Verified — not just checked",
			"Lease executed by day 21",
		],
	},
];

export function HowItWorks() {
	return (
		<section className="section-pad" id="how">
			<div className="wrap">
				<Reveal className="mb-7 flex items-center gap-4">
					<span className="num text-[12px] text-ink-mute uppercase tracking-[0.14em]">
						04
					</span>
					<span className="h-[1px] flex-1 bg-hair" />
					<span className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.14em]">
						How it works
					</span>
				</Reveal>

				<Reveal as="h2" className="mb-4 max-w-[22ch]">
					Three phases. Nine days of slack built in.
				</Reveal>
				<Reveal
					as="p"
					className="mb-14 max-w-[60ch] text-[17px] text-ink-soft leading-[1.55]"
				>
					The schedule below is what we plan to. The guarantee is what we
					promise. The gap between them is deliberate — and if we close it
					slower than twenty-one days, our fee drops by twenty-one percent.
				</Reveal>

				<div className="grid grid-cols-3 gap-5 max-lg:grid-cols-1">
					{PHASE_CARDS.map((p, i) => (
						<Reveal
							className="flex flex-col gap-4 rounded-[14px] border border-hair bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] p-7 pb-8"
							key={p.title}
						>
							<div className="flex items-baseline justify-between">
								<span className="num font-medium text-[11px] text-ink-mute uppercase tracking-[0.14em]">
									{p.days}
								</span>
								<span className="num text-[12px] text-ink-faint tracking-[0.04em]">
									0{i + 1} / 03
								</span>
							</div>
							<h3 className="text-[22px] leading-[1.2]">{p.title}</h3>
							<p className="text-[15px] text-ink-soft leading-[1.5]">
								{p.body}
							</p>
							<ul className="m-0 mt-1.5 flex list-none flex-col gap-2 p-0">
								{p.bullets.map((b) => (
									<li className="text-[14px] text-ink" key={b}>
										<span className="mr-2 font-bold text-accent">›</span> {b}
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
