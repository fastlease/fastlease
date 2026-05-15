"use client";

import Link from "next/link";
import { useState } from "react";
import { Footer } from "~/app/_components/sections/Footer";
import { FormModal } from "~/app/_components/sections/FormModal";
import { Nav } from "~/app/_components/sections/Nav";
import { RentWidget } from "~/app/_components/sections/RentWidget";
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

export function NeighborhoodClient({
	name,
	blurb,
	avgDays,
	avgRent,
	leases,
	faq,
}: Props) {
	const [open, setOpen] = useState(false);
	const [prefill, setPrefill] = useState<
		{ neighborhood: string; bedrooms: string } | undefined
	>(undefined);

	const openForm = (initial?: { neighborhood: string; bedrooms: string }) => {
		setPrefill(initial ?? { neighborhood: name, bedrooms: "1BR" });
		setOpen(true);
	};

	return (
		<>
			<Nav onOpenForm={() => openForm()} />
			<main>
				<section className="section-pad pt-[clamp(80px,8vw,140px)]">
					<div className="wrap">
						<Reveal className="mb-5 flex items-center gap-3 text-[11px] text-ink-mute uppercase tracking-[0.14em]">
							<Link
								className="underline decoration-hair underline-offset-[3px] hover:text-ink"
								href="/"
							>
								FastLease
							</Link>
							<span className="text-ink-faint">·</span>
							<span>Neighborhoods</span>
							<span className="text-ink-faint">·</span>
							<span className="text-ink">{name}</span>
						</Reveal>
						<Reveal
							as="h1"
							className="max-w-[18ch] font-medium text-[clamp(40px,6vw,72px)] leading-[1.02] tracking-[-0.03em]"
						>
							{name} condo leasing, on a 21-day clock.
						</Reveal>
						<Reveal
							as="p"
							className="mt-5 max-w-[52ch] text-[18px] text-ink-soft leading-[1.55]"
						>
							{blurb}
						</Reveal>

						<Reveal className="mt-10 grid grid-cols-3 gap-3 max-md:grid-cols-1">
							<Stat
								label="Avg days to lease"
								unit="days"
								value={avgDays ? `${avgDays}` : "—"}
							/>
							<Stat
								label="Avg leased rent"
								value={avgRent ? `$${avgRent.toLocaleString()}` : "—"}
							/>
							<Stat
								label="Recent comparables"
								unit={leases.length === 1 ? "lease" : "leases"}
								value={`${leases.length}`}
							/>
						</Reveal>

						<Reveal className="mt-8">
							<Button onClick={() => openForm()} showArrow>
								Get my {name} estimate
							</Button>
						</Reveal>
					</div>
				</section>

				<RentWidget onOpen={openForm} />

				{leases.length > 0 && (
					<section className="section-pad">
						<div className="wrap">
							<Reveal className="mb-7 flex items-center gap-4">
								<span className="num text-[12px] text-ink-mute uppercase tracking-[0.14em]">
									02
								</span>
								<span className="h-[1px] flex-1 bg-hair" />
								<span className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.14em]">
									Recent {name} leases
								</span>
							</Reveal>
							<div className="grid grid-cols-3 gap-4 max-md:grid-cols-1 max-lg:grid-cols-2">
								{leases.map((l) => (
									<Reveal
										className="flex flex-col gap-3 rounded-[14px] border border-hair bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] p-6"
										key={`${l.u}-${l.signed}`}
									>
										<div className="flex items-baseline justify-between">
											<span className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.14em]">
												{l.n}
											</span>
											<span className="text-[13px] text-ink-mute">{l.u}</span>
										</div>
										<div className="num font-medium text-[32px] leading-none tracking-[-0.025em]">
											${l.leased.toLocaleString()}
											<span className="ml-1 font-normal text-[13px] text-ink-faint">
												/mo
											</span>
										</div>
										<div className="num text-[13px] text-ink-soft">
											{l.days} days · {l.signed}
										</div>
									</Reveal>
								))}
							</div>
						</div>
					</section>
				)}

				<section className="section-pad">
					<div className="wrap">
						<Reveal className="mb-7 flex items-center gap-4">
							<span className="num text-[12px] text-ink-mute uppercase tracking-[0.14em]">
								03
							</span>
							<span className="h-[1px] flex-1 bg-hair" />
							<span className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.14em]">
								Frequent questions
							</span>
						</Reveal>
						<div className="flex flex-col">
							{faq.map((f) => (
								<Reveal
									className="border-hair border-t py-5 last:border-b"
									key={f.q}
								>
									<h3 className="mb-1.5 font-medium text-[18px]">{f.q}</h3>
									<p className="max-w-[68ch] text-[15px] text-ink-soft leading-[1.55]">
										{f.a}
									</p>
								</Reveal>
							))}
						</div>
					</div>
				</section>

				<section className="section-pad">
					<div className="wrap">
						<Reveal className="mb-3 text-[11px] text-ink-mute uppercase tracking-[0.14em]">
							Other neighborhoods
						</Reveal>
						<div className="flex flex-wrap gap-2">
							{NEIGHBORHOOD_META.filter((n) => n.name !== name).map((n) => (
								<Link
									className="inline-flex h-9 items-center rounded-full border border-hair-strong px-3.5 text-[13px] transition-colors hover:border-ink"
									href={`/neighborhoods/${n.slug}`}
									key={n.slug}
								>
									{n.name}
								</Link>
							))}
						</div>
					</div>
				</section>
			</main>
			<Footer />
			<FormModal
				initialData={prefill}
				mode="timeline"
				onClose={() => setOpen(false)}
				open={open}
			/>
		</>
	);
}

function Stat({
	label,
	value,
	unit,
}: {
	label: string;
	value: string;
	unit?: string;
}) {
	return (
		<div className="rounded-[14px] border border-hair bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] p-6">
			<div className="mb-2 font-medium text-[11px] text-ink-mute uppercase tracking-[0.12em]">
				{label}
			</div>
			<div className="num font-medium text-[36px] leading-none tracking-[-0.025em]">
				{value}
				{unit && (
					<span className="ml-1.5 font-normal text-[14px] text-ink-faint">
						{unit}
					</span>
				)}
			</div>
		</div>
	);
}
