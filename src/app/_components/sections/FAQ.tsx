"use client";

import { useState } from "react";
import { Reveal } from "../ui/Reveal";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "~/lib/utils";

const FAQS = [
	{ q: "What if my unit is priced above market?",
		a: "We give you a recommended range with the comparable-unit data behind it. If you choose to list more than 5% above that range, the 21-day guarantee is suspended for that listing — the rest of the engagement continues unchanged. We will tell you, in writing, before you sign." },
	{ q: "What happens on day 22 if it isn't leased?",
		a: "The fee is suspended and we continue to work without invoicing until a qualified tenant signs. When that happens, the original flat fee applies — never any escalation, never any late penalty on you." },
	{ q: "Do you handle showings for out-of-town owners?",
		a: "Yes. Most of our owners do not attend a single showing. We host, we filter, and the weekly report contains anything worth knowing — never a list of every email." },
	{ q: "What's your tenant screening process, exactly?",
		a: "Five layers, published above on this page: credit, income-to-rent ratio, employment verification, two prior-landlord references contacted by phone, and document authentication. We do not accept applicants who clear four of the five." },
	{ q: "How do you market the listing?",
		a: "Pricing analysis on day one, photography on day two, listings live on day three across fourteen platforms. We do not pay for \"premium\" placements that do not measurably move time-to-lease." },
	{ q: "What's the fee, exactly?",
		a: "One month's rent, flat, payable only on signed lease. There is no listing fee, no photography fee, no early-termination fee. The number on the homepage is the number on the invoice." },
	{ q: "Can I review applications before you accept one?",
		a: "Yes. Every application is presented to you with the screening summary attached. We recommend; you decide. No tenant is signed without your explicit approval." },
	{ q: "What if I already have an agent?",
		a: "Then keep them. We do not work around existing exclusive listing agreements, and we will say so plainly if you ask us to. If the agreement has expired or is non-exclusive, we are happy to talk." },
];

export function FAQ() {
	const [open, setOpen] = useState<number | null>(0);

	return (
		<section className="section-pad">
			<div className="wrap">
				<Reveal className="flex items-center gap-4 mb-7">
					<span className="num text-[12px] tracking-[0.14em] text-ink-mute uppercase">07</span>
					<span className="flex-1 h-[1px] bg-hair" />
					<span className="text-[11px] font-medium tracking-[0.14em] text-ink-mute uppercase">Frequently asked</span>
				</Reveal>
				
				<Reveal as="h2" className="max-w-[24ch] mb-10">Eight questions every landlord actually asks.</Reveal>

				<div className="border-t border-hair">
					{FAQS.map((f, i) => (
						<Reveal key={i} className="border-b border-hair">
							<button 
								className="w-full text-left grid grid-cols-[60px_1fr_32px] max-md:grid-cols-[40px_1fr_24px] items-baseline gap-4 py-5.5 outline-none group"
								onClick={() => setOpen(open === i ? null : i)}
							>
								<span className="text-[12px] tracking-[0.04em] text-ink-mute num">{String(i + 1).padStart(2, "0")}</span>
								<span className="text-[19px] font-medium transition-colors group-hover:text-accent">{f.q}</span>
								<span className="text-[22px] text-ink-mute justify-self-end leading-none">
									{open === i ? "−" : "+"}
								</span>
							</button>
							<AnimatePresence initial={false}>
								{open === i && (
									<motion.div
										initial={{ height: 0, opacity: 0 }}
										animate={{ height: "auto", opacity: 1 }}
										exit={{ height: 0, opacity: 0 }}
										transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
										className="overflow-hidden"
									>
										<div className="grid grid-cols-[60px_1fr_32px] max-md:grid-cols-[40px_1fr_24px] gap-4 pb-6">
											<div />
											<div className="text-[16px] text-ink-soft leading-[1.55] max-w-[80ch]">
												{f.a}
											</div>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
