"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { HOMEPAGE_FAQS as FAQS } from "~/lib/faqs";
import { Reveal } from "../ui/Reveal";

export function FAQ() {
	const [open, setOpen] = useState<number | null>(0);

	return (
		<section className="section-pad">
			<div className="wrap">
				<Reveal className="mb-7 flex items-center gap-4">
					<span className="num text-[12px] text-ink-mute uppercase tracking-[0.14em]">
						09
					</span>
					<span className="h-[1px] flex-1 bg-hair" />
					<span className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.14em]">
						Frequently asked
					</span>
				</Reveal>

				<Reveal as="h2" className="mb-10 max-w-[24ch]">
					Nine questions every landlord actually asks.
				</Reveal>

				<div className="border-hair border-t">
					{FAQS.map((f, i) => (
						<Reveal className="border-hair border-b" key={f.q}>
							<button
								className="group grid w-full cursor-pointer grid-cols-[60px_1fr_32px] items-baseline gap-4 py-5.5 text-left outline-none max-md:grid-cols-[40px_1fr_24px]"
								onClick={() => setOpen(open === i ? null : i)}
								type="button"
							>
								<span className="num text-[12px] text-ink-mute tracking-[0.04em]">
									{String(i + 1).padStart(2, "0")}
								</span>
								<span className="font-medium text-[19px] transition-colors group-hover:text-accent">
									{f.q}
								</span>
								<span className="justify-self-end text-[22px] text-ink-mute leading-none">
									{open === i ? "−" : "+"}
								</span>
							</button>
							<AnimatePresence initial={false}>
								{open === i && (
									<motion.div
										animate={{ height: "auto", opacity: 1 }}
										className="overflow-hidden"
										exit={{ height: 0, opacity: 0 }}
										initial={{ height: 0, opacity: 0 }}
										transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
									>
										<div className="grid grid-cols-[60px_1fr_32px] gap-4 pb-6 max-md:grid-cols-[40px_1fr_24px]">
											<div />
											<div className="max-w-[80ch] text-[16px] text-ink-soft leading-[1.55]">
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
