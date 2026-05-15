"use client";

import { useState } from "react";
import Link from "next/link";
import { Nav } from "~/app/_components/sections/Nav";
import { FormModal } from "~/app/_components/sections/FormModal";
import { RentWidget } from "~/app/_components/sections/RentWidget";
import { Footer } from "~/app/_components/sections/Footer";
import { Button } from "~/app/_components/ui/Button";
import { Reveal } from "~/app/_components/ui/Reveal";
import type { Lease } from "~/lib/leases";
import { NEIGHBORHOOD_META } from "~/lib/neighborhoods";

interface Props {
	name: string;
	slug: string;
	blurb: string;
	avgDays?: number;
	avgRent?: number;
	leases: Lease[];
	faq: { q: string; a: string }[];
}

export function NeighborhoodClient({ name, blurb, avgDays, avgRent, leases, faq }: Props) {
	const [open, setOpen] = useState(false);
	const [prefill, setPrefill] = useState<{ neighborhood: string; bedrooms: string } | undefined>(undefined);

	const openForm = (initial?: { neighborhood: string; bedrooms: string }) => {
		setPrefill(initial ?? { neighborhood: name, bedrooms: "1BR" });
		setOpen(true);
	};

	const cleanBlurb = blurb.replace(/&apos;/g, "'");

	return (
		<>
			<Nav onOpenForm={() => openForm()} />
			<main>
				<section className="section-pad pt-[clamp(80px,8vw,140px)]">
					<div className="wrap">
						<Reveal className="flex items-center gap-3 mb-5 text-[11px] uppercase tracking-[0.14em] text-ink-mute">
							<Link href="/" className="hover:text-ink underline decoration-hair underline-offset-[3px]">FastLease</Link>
							<span className="text-ink-faint">·</span>
							<span>Neighborhoods</span>
							<span className="text-ink-faint">·</span>
							<span className="text-ink">{name}</span>
						</Reveal>
						<Reveal as="h1" className="text-[clamp(40px,6vw,72px)] font-medium tracking-[-0.03em] leading-[1.02] max-w-[18ch]">
							{name} condo leasing, on a 21-day clock.
						</Reveal>
						<Reveal as="p" className="text-[18px] text-ink-soft mt-5 max-w-[52ch] leading-[1.55]">
							{cleanBlurb}
						</Reveal>

						<Reveal className="mt-10 grid grid-cols-3 max-md:grid-cols-1 gap-3">
							<Stat label="Avg days to lease" value={avgDays ? `${avgDays}` : "—"} unit="days" />
							<Stat label="Avg leased rent" value={avgRent ? `$${avgRent.toLocaleString()}` : "—"} />
							<Stat label="Recent comparables" value={`${leases.length}`} unit={leases.length === 1 ? "lease" : "leases"} />
						</Reveal>

						<Reveal className="mt-8">
							<Button onClick={() => openForm()} showArrow>Get my {name} estimate</Button>
						</Reveal>
					</div>
				</section>

				<RentWidget onOpen={openForm} />

				{leases.length > 0 && (
					<section className="section-pad">
						<div className="wrap">
							<Reveal className="flex items-center gap-4 mb-7">
								<span className="num text-[12px] tracking-[0.14em] text-ink-mute uppercase">02</span>
								<span className="flex-1 h-[1px] bg-hair" />
								<span className="text-[11px] font-medium tracking-[0.14em] text-ink-mute uppercase">Recent {name} leases</span>
							</Reveal>
							<div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-4">
								{leases.map((l) => (
									<Reveal key={`${l.u}-${l.signed}`} className="p-6 flex flex-col gap-3 bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] border border-hair rounded-[14px]">
										<div className="flex justify-between items-baseline">
											<span className="text-[11px] font-medium tracking-[0.14em] text-ink-mute uppercase">{l.n}</span>
											<span className="text-[13px] text-ink-mute">{l.u}</span>
										</div>
										<div className="text-[32px] font-medium tracking-[-0.025em] leading-none num">
											${l.leased.toLocaleString()}
											<span className="text-[13px] text-ink-faint font-normal ml-1">/mo</span>
										</div>
										<div className="text-[13px] text-ink-soft num">{l.days} days · {l.signed}</div>
									</Reveal>
								))}
							</div>
						</div>
					</section>
				)}

				<section className="section-pad">
					<div className="wrap">
						<Reveal className="flex items-center gap-4 mb-7">
							<span className="num text-[12px] tracking-[0.14em] text-ink-mute uppercase">03</span>
							<span className="flex-1 h-[1px] bg-hair" />
							<span className="text-[11px] font-medium tracking-[0.14em] text-ink-mute uppercase">Frequent questions</span>
						</Reveal>
						<div className="flex flex-col">
							{faq.map((f) => (
								<Reveal key={f.q} className="py-5 border-t border-hair last:border-b">
									<h3 className="text-[18px] font-medium mb-1.5">{f.q}</h3>
									<p className="text-[15px] text-ink-soft leading-[1.55] max-w-[68ch]">{f.a}</p>
								</Reveal>
							))}
						</div>
					</div>
				</section>

				<section className="section-pad">
					<div className="wrap">
						<Reveal className="text-[11px] uppercase tracking-[0.14em] text-ink-mute mb-3">Other neighborhoods</Reveal>
						<div className="flex flex-wrap gap-2">
							{NEIGHBORHOOD_META.filter((n) => n.name !== name).map((n) => (
								<Link
									key={n.slug}
									href={`/neighborhoods/${n.slug}`}
									className="text-[13px] px-3.5 h-9 inline-flex items-center border border-hair-strong rounded-full hover:border-ink transition-colors"
								>
									{n.name}
								</Link>
							))}
						</div>
					</div>
				</section>
			</main>
			<Footer />
			<FormModal open={open} onClose={() => setOpen(false)} mode="timeline" initialData={prefill} />
		</>
	);
}

function Stat({ label, value, unit }: { label: string; value: string; unit?: string }) {
	return (
		<div className="p-6 bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] border border-hair rounded-[14px]">
			<div className="text-[11px] uppercase tracking-[0.12em] text-ink-mute font-medium mb-2">{label}</div>
			<div className="text-[36px] font-medium tracking-[-0.025em] leading-none num">
				{value}
				{unit && <span className="text-[14px] text-ink-faint font-normal ml-1.5">{unit}</span>}
			</div>
		</div>
	);
}
