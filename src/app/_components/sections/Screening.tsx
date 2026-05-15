"use client";

import { Reveal } from "../ui/Reveal";

const SCREENING = [
	{
		label: "Credit score",
		value: "680 minimum",
		note: "Verified through Equifax or TransUnion direct pull.",
	},
	{
		label: "Income-to-rent ratio",
		value: "3.0× monthly rent",
		note: "Documented through two pay stubs and most recent NOA.",
	},
	{
		label: "Employment",
		value: "Verified, not stated",
		note: "Direct contact with HR or, for self-employed, two years of T1s.",
	},
	{
		label: "Previous landlord",
		value: "Two references",
		note: "Spoken with by phone — not an emailed form.",
	},
	{
		label: "Identity & documents",
		value: "ID + status checks",
		note: "Government photo ID, work permit status where applicable.",
	},
];

export function Screening() {
	return (
		<section className="section-pad bg-[color-mix(in_oklab,var(--bg),var(--ink)_3%)]">
			<div className="wrap">
				<Reveal className="mb-7 flex items-center gap-4">
					<span className="num text-[12px] text-ink-mute uppercase tracking-[0.14em]">
						06
					</span>
					<span className="h-[1px] flex-1 bg-hair" />
					<span className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.14em]">
						Tenant screening standards
					</span>
				</Reveal>

				<div className="mb-12 grid grid-cols-2 items-end gap-12 max-md:grid-cols-1 max-md:gap-4">
					<Reveal as="h2" className="max-w-[22ch]">
						Speed without standards is not the offer.
					</Reveal>
					<Reveal
						as="p"
						className="max-w-[50ch] text-[17px] text-ink-soft leading-[1.55]"
					>
						Most leasing services are vague about screening because the
						vagueness is where the corners get cut. We publish ours.
					</Reveal>
				</div>

				<div className="overflow-hidden rounded-[14px] border border-hair bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)]">
					{SCREENING.map((s) => (
						<Reveal
							className="grid grid-cols-[220px_240px_1fr] items-baseline gap-6 border-hair border-b px-7 py-5.5 transition-colors last:border-b-0 hover:bg-[color-mix(in_oklab,var(--bg),var(--accent)_3%)] max-md:grid-cols-1 max-md:gap-1"
							key={s.label}
						>
							<div className="pt-0.5 font-medium text-[11px] text-ink-mute uppercase tracking-[0.12em]">
								{s.label}
							</div>
							<div className="font-medium text-[17px]">{s.value}</div>
							<div className="text-[15px] text-ink-soft">{s.note}</div>
						</Reveal>
					))}
				</div>

				<Reveal
					as="p"
					className="mt-8 max-w-[36ch] font-medium text-[17px] text-ink"
				>
					We move quickly. We don&apos;t cut corners. The two are easier to
					reconcile than most landlords have been led to believe.
				</Reveal>
			</div>
		</section>
	);
}
