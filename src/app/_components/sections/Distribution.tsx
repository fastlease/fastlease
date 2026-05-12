"use client";

import { Reveal } from "../ui/Reveal";

const SYNDICATION = [
	"MLS",
	"Realtor.ca",
	"Zumper",
	"PadMapper",
	"Kijiji",
	"Facebook Marketplace",
	"Instagram",
	"RentFaster",
	"Rentals.ca",
	"Apartments.com",
	"Zoocasa",
	"RentSeeker",
];

export function Distribution() {
	return (
		<section id="distribution" className="section-pad pt-[clamp(60px,7vw,100px)]">
			<div className="wrap">
				<Reveal className="flex items-center gap-4 mb-7">
					<span className="num text-[12px] tracking-[0.14em] text-ink-mute uppercase">02</span>
					<span className="flex-1 h-[1px] bg-hair" />
					<span className="text-[11px] font-medium tracking-[0.14em] text-ink-mute uppercase">Distribution & reach</span>
				</Reveal>

				<div className="grid grid-cols-2 max-md:grid-cols-1 gap-12 max-md:gap-4 items-end mb-14 max-md:mb-8">
					<Reveal as="h2" className="max-w-[22ch]">Your listing lives where the renters actually are.</Reveal>
					<Reveal as="p" className="text-[17px] text-ink-soft max-w-[52ch] leading-[1.55]">
						FastLease is operated through Property.ca Inc. Brokerage — the firm that owns
						<span className="text-ink"> property.ca</span> and
						<span className="text-ink"> condos.ca</span>. Your unit is featured on both from day one. Not a syndication credit. The home page.
					</Reveal>
				</div>

				<div className="grid grid-cols-2 max-md:grid-cols-1 gap-5 mb-10">
					<Reveal className="p-9 max-md:p-7 flex flex-col gap-3 bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] border border-hair rounded-[14px]">
						<div className="text-[11px] font-medium tracking-[0.12em] text-ink-mute uppercase">property.ca</div>
						<div className="flex items-baseline gap-3 mt-1">
							<span className="text-[clamp(44px,5.5vw,64px)] font-medium tracking-[-0.03em] leading-none num">1M+</span>
							<span className="text-[14px] text-ink-mute leading-[1.3] max-w-[18ch]">monthly active registered users</span>
						</div>
						<p className="text-[15px] text-ink-soft mt-3.5 leading-[1.5] max-w-[44ch]">
							Toronto&apos;s largest registered renter and buyer audience. Featured placement is part of the engagement — never a paid upsell.
						</p>
					</Reveal>
					<Reveal className="p-9 max-md:p-7 flex flex-col gap-3 bg-[color-mix(in_oklab,var(--accent),var(--bg,#FAF8F3)_90%)] border border-[color-mix(in_oklab,var(--accent),transparent_70%)] rounded-[14px]">
						<div className="text-[11px] font-medium tracking-[0.12em] text-accent uppercase">condos.ca</div>
						<div className="flex items-baseline gap-3 mt-1">
							<span className="text-[clamp(36px,4.5vw,52px)] font-medium tracking-[-0.025em] leading-[1.05] num">Building-level search</span>
						</div>
						<p className="text-[15px] text-ink-soft mt-3.5 leading-[1.5] max-w-[44ch]">
							The renter searching by tower — the audience most likely to pay your asking — sees your unit before it hits the long tail of generalist sites.
						</p>
					</Reveal>
				</div>

				<Reveal className="flex flex-wrap items-baseline gap-x-3 gap-y-2.5 pt-7 border-t border-hair">
					<span className="text-[11px] tracking-[0.14em] uppercase text-ink-mute mr-3">Plus syndication to</span>
					{SYNDICATION.map((n, i) => (
						<span key={n} className="text-[14px] text-ink-soft inline-flex items-baseline gap-3">
							{n}
							{i < SYNDICATION.length - 1 && <span className="text-ink-faint">·</span>}
						</span>
					))}
				</Reveal>
			</div>
		</section>
	);
}
