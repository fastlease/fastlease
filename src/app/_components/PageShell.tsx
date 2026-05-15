"use client";

import { type ReactNode, useState } from "react";
import { Footer } from "./sections/Footer";
import { FormModal } from "./sections/FormModal";
import { Nav } from "./sections/Nav";

type Prefill = { neighborhood: string; bedrooms: string } | undefined;

interface PageShellProps {
	children: ReactNode;
	initialPrefill?: Prefill;
}

export function PageShell({ children, initialPrefill }: PageShellProps) {
	const [open, setOpen] = useState(false);
	const [prefill] = useState<Prefill>(initialPrefill);

	return (
		<div className="min-h-screen bg-paper text-ink">
			<Nav onOpenForm={() => setOpen(true)} />
			<main>{children}</main>
			<Footer />
			<FormModal
				initialData={prefill}
				mode="timeline"
				onClose={() => setOpen(false)}
				open={open}
			/>
		</div>
	);
}

interface InlineCTAProps {
	eyebrow?: string;
	headline: string;
	buttonLabel?: string;
	neighborhood?: string;
	bedrooms?: string;
}

export function InlineCTA({
	eyebrow = "Same playbook for your unit",
	headline,
	buttonLabel = "Run my estimate",
	neighborhood,
	bedrooms,
}: InlineCTAProps) {
	const [open, setOpen] = useState(false);

	return (
		<section className="section-pad">
			<div className="wrap">
				<div className="flex items-center justify-between gap-6 rounded-[14px] border border-[color-mix(in_oklab,var(--accent),transparent_75%)] bg-[color-mix(in_oklab,var(--accent),transparent_92%)] p-9 max-md:flex-col max-md:items-start max-md:p-7">
					<div>
						<div className="mb-2 font-medium text-[11px] text-accent uppercase tracking-[0.14em]">
							{eyebrow}
						</div>
						<h3 className="max-w-[28ch] font-medium text-[24px] tracking-[-0.02em]">
							{headline}
						</h3>
					</div>
					<button
						className="inline-flex h-[46px] items-center gap-2 rounded-full bg-accent px-5 font-medium text-[15px] text-accent-ink transition-opacity hover:opacity-90"
						onClick={() => setOpen(true)}
						type="button"
					>
						{buttonLabel}
						<span aria-hidden>→</span>
					</button>
				</div>
			</div>
			<FormModal
				initialData={
					neighborhood && bedrooms ? { neighborhood, bedrooms } : undefined
				}
				mode="timeline"
				onClose={() => setOpen(false)}
				open={open}
			/>
		</section>
	);
}
