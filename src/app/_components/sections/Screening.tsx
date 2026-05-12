"use client";

import { Reveal } from "../ui/Reveal";

const SCREENING = [
	{ label: "Credit score", value: "680 minimum", note: "Verified through Equifax or TransUnion direct pull." },
	{ label: "Income-to-rent ratio", value: "3.0× monthly rent", note: "Documented through two pay stubs and most recent NOA." },
	{ label: "Employment", value: "Verified, not stated", note: "Direct contact with HR or, for self-employed, two years of T1s." },
	{ label: "Previous landlord", value: "Two references", note: "Spoken with by phone — not an emailed form." },
	{ label: "Identity & documents", value: "ID + status checks", note: "Government photo ID, work permit status where applicable." },
];

export function Screening() {
	return (
		<section className="section-pad bg-[color-mix(in_oklab,var(--bg),var(--ink)_3%)]">
			<div className="wrap">
				<Reveal className="flex items-center gap-4 mb-7">
					<span className="num text-[12px] tracking-[0.14em] text-ink-mute uppercase">06</span>
					<span className="flex-1 h-[1px] bg-hair" />
					<span className="text-[11px] font-medium tracking-[0.14em] text-ink-mute uppercase">Tenant screening standards</span>
				</Reveal>

				<div className="grid grid-cols-2 max-md:grid-cols-1 gap-12 items-end mb-12 max-md:gap-4">
					<Reveal as="h2" className="max-w-[22ch]">Speed without standards is not the offer.</Reveal>
					<Reveal as="p" className="text-[17px] text-ink-soft max-w-[50ch] leading-[1.55]">
						Most leasing services are vague about screening because the vagueness is where
						the corners get cut. We publish ours.
					</Reveal>
				</div>

				<div className="bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] border border-hair rounded-[14px] overflow-hidden">
					{SCREENING.map((s, i) => (
						<Reveal key={i} className="grid grid-cols-[220px_240px_1fr] max-md:grid-cols-1 max-md:gap-1 items-baseline px-7 py-5.5 border-b border-hair last:border-b-0 hover:bg-[color-mix(in_oklab,var(--bg),var(--accent)_3%)] transition-colors gap-6">
							<div className="pt-0.5 text-[11px] font-medium tracking-[0.12em] text-ink-mute uppercase">{s.label}</div>
							<div className="text-[17px] font-medium">{s.value}</div>
							<div className="text-[15px] text-ink-soft">{s.note}</div>
						</Reveal>
					))}
				</div>

				<Reveal as="p" className="mt-8 text-[17px] font-medium text-ink max-w-[36ch]">
					We move quickly. We don&apos;t cut corners. The two are easier to reconcile than
					most landlords have been led to believe.
				</Reveal>
			</div>
		</section>
	);
}
