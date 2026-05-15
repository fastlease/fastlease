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
		<section className="section-pad" id="distribution">
			<div className="wrap">
				<Reveal className="mb-7 flex items-center gap-4">
					<span className="num text-[12px] text-ink-mute uppercase tracking-[0.14em]">
						02
					</span>
					<span className="h-[1px] flex-1 bg-hair" />
					<span className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.14em]">
						Distribution & reach
					</span>
				</Reveal>

				<div className="mb-14 grid grid-cols-2 items-end gap-12 max-md:mb-8 max-md:grid-cols-1 max-md:gap-4">
					<Reveal as="h2" className="max-w-[22ch]">
						Your listing lives where the renters actually are.
					</Reveal>
					<Reveal
						as="p"
						className="max-w-[52ch] text-[17px] text-ink-soft leading-[1.55]"
					>
						FastLease is operated through Property.ca Inc. Brokerage — the firm
						that owns
						<span className="text-ink"> property.ca</span> and
						<span className="text-ink"> condos.ca</span>. Your unit is featured
						on both from day one. Not a syndication credit. The home page.
					</Reveal>
				</div>

				<div className="mb-10 grid grid-cols-2 gap-5 max-md:grid-cols-1">
					<Reveal>
						<BrowserMockup accent={false} host="property.ca">
							<div className="flex items-center gap-2 border-hair border-b px-4 pt-4 pb-3">
								<div className="flex h-9 flex-1 items-center gap-2 rounded-md bg-[color-mix(in_oklab,var(--bg,#fff),var(--ink)_4%)] px-3 text-[12px] text-ink-mute">
									<span className="h-3 w-3 rounded-full border border-ink-mute/40" />
									Toronto · 1BR rentals
								</div>
								<div className="grid h-9 place-items-center rounded-md bg-ink px-3 text-[12px] text-paper">
									Search
								</div>
							</div>
							<div className="grid grid-cols-3 gap-2.5 px-4 py-3">
								{[1, 2, 3].map((i) => (
									<div
										className={`overflow-hidden rounded-md border ${i === 1 ? "border-accent ring-2 ring-accent/30" : "border-hair"}`}
										key={i}
									>
										<div
											className={`h-14 ${i === 1 ? "bg-[color-mix(in_oklab,var(--accent),var(--bg,#fff)_70%)]" : "bg-[color-mix(in_oklab,var(--bg,#fff),var(--ink)_6%)]"}`}
										/>
										<div className="p-1.5">
											<div className="num font-medium text-[10px]">
												${(2675 + i * 50).toLocaleString()}
											</div>
											<div className="text-[9px] text-ink-mute">
												1BR · King W
											</div>
										</div>
									</div>
								))}
							</div>
							<div className="flex items-center gap-2 px-4 pb-3">
								<span className="font-medium text-[10px] text-accent uppercase tracking-[0.12em]">
									● Featured
								</span>
								<span className="text-[11px] text-ink-mute">
									Your listing, top of the grid.
								</span>
							</div>
						</BrowserMockup>

						<div className="mt-4">
							<div className="mb-1 font-medium text-[11px] text-ink-mute uppercase tracking-[0.12em]">
								property.ca
							</div>
							<div className="flex items-baseline gap-3">
								<span className="num font-medium text-[clamp(36px,4.5vw,52px)] leading-none tracking-[-0.025em]">
									1M+
								</span>
								<span className="max-w-[24ch] text-[13px] text-ink-mute leading-[1.3]">
									monthly active registered users — Toronto&apos;s largest
									registered renter audience.
								</span>
							</div>
						</div>
					</Reveal>

					<Reveal>
						<BrowserMockup accent host="condos.ca">
							<div className="flex items-center gap-2 border-hair border-b px-4 pt-4 pb-3">
								<div className="flex h-9 flex-1 items-center gap-2 rounded-md bg-[color-mix(in_oklab,var(--bg,#fff),var(--ink)_4%)] px-3 text-[12px] text-ink-mute">
									<span className="h-3 w-3 rounded-sm border border-ink-mute/40" />
									Search by building
								</div>
							</div>
							<div className="flex flex-col gap-2 px-4 py-3">
								{["Ice Condos", "King Charlotte", "Liberty Central"].map(
									(b, i) => (
										<div
											className={`flex items-center gap-3 rounded-md border p-2 ${i === 0 ? "border-accent bg-[color-mix(in_oklab,var(--accent),transparent_88%)]" : "border-hair"}`}
											key={b}
										>
											<div
												className={`h-8 w-8 rounded-md ${i === 0 ? "bg-accent" : "bg-[color-mix(in_oklab,var(--bg,#fff),var(--ink)_6%)]"}`}
											/>
											<div className="flex-1">
												<div className="font-medium text-[11px]">{b}</div>
												<div className="num text-[10px] text-ink-mute">
													{i === 0
														? "3 units listed · your unit"
														: `${4 - i} units listed`}
												</div>
											</div>
											<span className="num text-[10px] text-ink-mute">→</span>
										</div>
									),
								)}
							</div>
						</BrowserMockup>

						<div className="mt-4">
							<div className="mb-1 font-medium text-[11px] text-accent uppercase tracking-[0.12em]">
								condos.ca
							</div>
							<div className="flex items-baseline gap-3">
								<span className="num font-medium text-[clamp(28px,3.4vw,38px)] leading-[1.05] tracking-[-0.025em]">
									Building-level search
								</span>
							</div>
							<p className="mt-2 max-w-[36ch] text-[13px] text-ink-mute leading-[1.45]">
								Renters searching by tower — the audience most likely to pay
								your asking — see your unit before generalists.
							</p>
						</div>
					</Reveal>
				</div>

				<Reveal className="flex flex-wrap items-baseline gap-x-3 gap-y-2.5 border-hair border-t pt-7">
					<span className="mr-3 text-[11px] text-ink-mute uppercase tracking-[0.14em]">
						Plus syndication to
					</span>
					{SYNDICATION.map((n, i) => (
						<span
							className="inline-flex items-baseline gap-3 text-[14px] text-ink-soft"
							key={n}
						>
							{n}
							{i < SYNDICATION.length - 1 && (
								<span className="text-ink-faint">·</span>
							)}
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
			className={`overflow-hidden rounded-[12px] border bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] shadow-[0_18px_50px_rgba(0,0,0,0.06)] ${accent ? "border-[color-mix(in_oklab,var(--accent),transparent_70%)]" : "border-hair-strong"}`}
		>
			<div className="flex items-center gap-1.5 border-hair border-b bg-[color-mix(in_oklab,var(--bg,#fff),var(--ink)_3%)] px-3 py-2">
				<span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
				<span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
				<span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
				<div className="mx-3 flex h-5 flex-1 items-center justify-center rounded bg-[color-mix(in_oklab,var(--bg,#fff),var(--ink)_4%)] text-[11px] text-ink-mute">
					<span className="num">{host}</span>
				</div>
			</div>
			{children}
		</div>
	);
}
