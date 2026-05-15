"use client";

import { useState } from "react";
import { Reveal } from "../ui/Reveal";
import { motion, AnimatePresence } from "framer-motion";
import { HOMEPAGE_FAQS as FAQS } from "~/lib/faqs";

export function FAQ() {
	const [open, setOpen] = useState<number | null>(0);

	return (
		<section className="section-pad">
			<div className="wrap">
				<Reveal className="flex items-center gap-4 mb-7">
					<span className="num text-[12px] tracking-[0.14em] text-ink-mute uppercase">09</span>
					<span className="flex-1 h-[1px] bg-hair" />
					<span className="text-[11px] font-medium tracking-[0.14em] text-ink-mute uppercase">Frequently asked</span>
				</Reveal>

				<Reveal as="h2" className="max-w-[24ch] mb-10">Nine questions every landlord actually asks.</Reveal>

				<div className="border-t border-hair">
					{FAQS.map((f, i) => (
						<Reveal key={i} className="border-b border-hair">
							<button
								className="w-full text-left grid grid-cols-[60px_1fr_32px] max-md:grid-cols-[40px_1fr_24px] items-baseline gap-4 py-5.5 outline-none group cursor-pointer"
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
