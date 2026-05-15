"use client";

import { useState } from "react";
import { FormModal } from "~/app/_components/sections/FormModal";
import { Button } from "~/app/_components/ui/Button";
import { Reveal } from "~/app/_components/ui/Reveal";

export function CaseStudyCTA({
	neighborhood,
	unitType,
}: {
	neighborhood: string;
	unitType: string;
}) {
	const [open, setOpen] = useState(false);

	return (
		<section className="section-pad">
			<div className="wrap">
				<Reveal className="flex items-center justify-between gap-6 rounded-[14px] border border-[color-mix(in_oklab,var(--accent),transparent_75%)] bg-[color-mix(in_oklab,var(--accent),transparent_92%)] p-9 max-md:flex-col max-md:items-start max-md:p-7">
					<div>
						<div className="mb-2 font-medium text-[11px] text-accent uppercase tracking-[0.14em]">
							Same playbook for your unit
						</div>
						<h3 className="max-w-[26ch] font-medium text-[24px] tracking-[-0.02em]">
							Get a 21-day timeline for your {unitType} in {neighborhood}.
						</h3>
					</div>
					<Button onClick={() => setOpen(true)} showArrow>
						Run my estimate
					</Button>
				</Reveal>
			</div>
			<FormModal
				initialData={{ neighborhood, bedrooms: unitType }}
				mode="timeline"
				onClose={() => setOpen(false)}
				open={open}
			/>
		</section>
	);
}
