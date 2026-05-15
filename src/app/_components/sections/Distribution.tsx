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
		<section id="distribution" className="section-pad">
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
					<Reveal>
						<BrowserMockup host="property.ca" accent={false}>
							<div className="px-4 pt-4 pb-3 border-b border-hair flex items-center gap-2">
								<div className="flex-1 h-9 rounded-md bg-[color-mix(in_oklab,var(--bg,#fff),var(--ink)_4%)] flex items-center px-3 gap-2 text-[12px] text-ink-mute">
									<span className="w-3 h-3 rounded-full border border-ink-mute/40" />
									Toronto · 1BR rentals
								</div>
								<div className="h-9 px-3 rounded-md bg-ink text-paper text-[12px] grid place-items-center">Search</div>
							</div>
							<div className="px-4 py-3 grid grid-cols-3 gap-2.5">
								{[1, 2, 3].map((i) => (
									<div key={i} className={`rounded-md overflow-hidden border ${i === 1 ? "border-accent ring-2 ring-accent/30" : "border-hair"}`}>
										<div className={`h-14 ${i === 1 ? "bg-[color-mix(in_oklab,var(--accent),var(--bg,#fff)_70%)]" : "bg-[color-mix(in_oklab,var(--bg,#fff),var(--ink)_6%)]"}`} />
										<div className="p-1.5">
											<div className="num text-[10px] font-medium">${(2675 + i * 50).toLocaleString()}</div>
											<div className="text-[9px] text-ink-mute">1BR · King W</div>
										</div>
									</div>
								))}
							</div>
							<div className="px-4 pb-3 flex items-center gap-2">
								<span className="text-[10px] uppercase tracking-[0.12em] text-accent font-medium">● Featured</span>
								<span className="text-[11px] text-ink-mute">Your listing, top of the grid.</span>
							</div>
						</BrowserMockup>

						<div className="mt-4">
							<div className="text-[11px] font-medium tracking-[0.12em] text-ink-mute uppercase mb-1">property.ca</div>
							<div className="flex items-baseline gap-3">
								<span className="text-[clamp(36px,4.5vw,52px)] font-medium tracking-[-0.025em] leading-none num">1M+</span>
								<span className="text-[13px] text-ink-mute leading-[1.3] max-w-[24ch]">monthly active registered users — Toronto&apos;s largest registered renter audience.</span>
							</div>
						</div>
					</Reveal>

					<Reveal>
						<BrowserMockup host="condos.ca" accent>
							<div className="px-4 pt-4 pb-3 border-b border-hair flex items-center gap-2">
								<div className="flex-1 h-9 rounded-md bg-[color-mix(in_oklab,var(--bg,#fff),var(--ink)_4%)] flex items-center px-3 gap-2 text-[12px] text-ink-mute">
									<span className="w-3 h-3 rounded-sm border border-ink-mute/40" />
									Search by building
								</div>
							</div>
							<div className="px-4 py-3 flex flex-col gap-2">
								{["Ice Condos", "King Charlotte", "Liberty Central"].map((b, i) => (
									<div key={b} className={`flex items-center gap-3 p-2 rounded-md border ${i === 0 ? "border-accent bg-[color-mix(in_oklab,var(--accent),transparent_88%)]" : "border-hair"}`}>
										<div className={`w-8 h-8 rounded-md ${i === 0 ? "bg-accent" : "bg-[color-mix(in_oklab,var(--bg,#fff),var(--ink)_6%)]"}`} />
										<div className="flex-1">
											<div className="text-[11px] font-medium">{b}</div>
											<div className="text-[10px] text-ink-mute num">{i === 0 ? "3 units listed · your unit" : `${4 - i} units listed`}</div>
										</div>
										<span className="text-[10px] num text-ink-mute">→</span>
									</div>
								))}
							</div>
						</BrowserMockup>

						<div className="mt-4">
							<div className="text-[11px] font-medium tracking-[0.12em] text-accent uppercase mb-1">condos.ca</div>
							<div className="flex items-baseline gap-3">
								<span className="text-[clamp(28px,3.4vw,38px)] font-medium tracking-[-0.025em] leading-[1.05] num">Building-level search</span>
							</div>
							<p className="text-[13px] text-ink-mute mt-2 leading-[1.45] max-w-[36ch]">
								Renters searching by tower — the audience most likely to pay your asking — see your unit before generalists.
							</p>
						</div>
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

function BrowserMockup({
	host,
	accent,
	children,
}: {
	host: string;
	accent: boolean;
	children: React.ReactNode;
}) {
	return (
		<div
			className={`rounded-[12px] overflow-hidden border bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] shadow-[0_18px_50px_rgba(0,0,0,0.06)] ${accent ? "border-[color-mix(in_oklab,var(--accent),transparent_70%)]" : "border-hair-strong"}`}
		>
			<div className="flex items-center gap-1.5 px-3 py-2 bg-[color-mix(in_oklab,var(--bg,#fff),var(--ink)_3%)] border-b border-hair">
				<span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
				<span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
				<span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
				<div className="flex-1 mx-3 h-5 rounded text-[11px] text-ink-mute flex items-center justify-center bg-[color-mix(in_oklab,var(--bg,#fff),var(--ink)_4%)]">
					<span className="num">{host}</span>
				</div>
			</div>
			{children}
		</div>
	);
}
