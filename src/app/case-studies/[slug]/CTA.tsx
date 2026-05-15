"use client";

import { useState } from "react";
import { Button } from "~/app/_components/ui/Button";
import { Reveal } from "~/app/_components/ui/Reveal";
import { FormModal } from "~/app/_components/sections/FormModal";

export function CaseStudyCTA({ neighborhood, unitType }: { neighborhood: string; unitType: string }) {
	const [open, setOpen] = useState(false);

	return (
		<section className="section-pad">
			<div className="wrap">
				<Reveal className="p-9 max-md:p-7 bg-[color-mix(in_oklab,var(--accent),transparent_92%)] border border-[color-mix(in_oklab,var(--accent),transparent_75%)] rounded-[14px] flex justify-between items-center gap-6 max-md:flex-col max-md:items-start">
					<div>
						<div className="text-[11px] font-medium tracking-[0.14em] text-accent uppercase mb-2">Same playbook for your unit</div>
						<h3 className="text-[24px] font-medium tracking-[-0.02em] max-w-[26ch]">
							Get a 21-day timeline for your {unitType} in {neighborhood}.
						</h3>
					</div>
					<Button onClick={() => setOpen(true)} showArrow>Run my estimate</Button>
				</Reveal>
			</div>
			<FormModal
				open={open}
				onClose={() => setOpen(false)}
				mode="timeline"
				initialData={{ neighborhood, bedrooms: unitType }}
			/>
		</section>
	);
}
