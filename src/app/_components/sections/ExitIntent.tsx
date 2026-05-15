"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Events, track, trackCTA } from "~/lib/analytics";
import { BEDROOM_TYPES, NEIGHBORHOODS } from "~/lib/leases";
import { cn } from "~/lib/utils";
import { Button } from "../ui/Button";

interface ExitIntentProps {
	onOpen: (initial: { neighborhood: string; bedrooms: string }) => void;
}

const SESSION_KEY = "fastlease.exitintent.fired";
const SCROLL_THRESHOLD = 600;

export function ExitIntent({ onOpen }: ExitIntentProps) {
	const [visible, setVisible] = useState(false);
	const [neighborhood, setNeighborhood] = useState("King West");
	const [bedrooms, setBedrooms] = useState("1BR");
	const firedRef = useRef(false);

	useEffect(() => {
		if (typeof window === "undefined") return;
		if (window.matchMedia("(max-width: 900px)").matches) return;

		try {
			if (sessionStorage.getItem(SESSION_KEY) === "1") {
				firedRef.current = true;
				return;
			}
		} catch {}

		const onMouseOut = (e: MouseEvent) => {
			if (firedRef.current) return;
			if (window.scrollY < SCROLL_THRESHOLD) return;
			if (e.clientY > 0) return;
			if (e.relatedTarget) return;
			firedRef.current = true;
			try {
				sessionStorage.setItem(SESSION_KEY, "1");
			} catch {}
			setVisible(true);
			track(Events.exitIntentShown);
		};

		document.addEventListener("mouseout", onMouseOut);
		return () => document.removeEventListener("mouseout", onMouseOut);
	}, []);

	useEffect(() => {
		if (!visible) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setVisible(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [visible]);

	const submit = () => {
		track(Events.exitIntentConverted, { neighborhood, bedrooms });
		trackCTA("exit-intent", "timeline", { neighborhood, bedrooms });
		setVisible(false);
		onOpen({ neighborhood, bedrooms });
	};

	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					animate={{ opacity: 1 }}
					className="fixed inset-0 z-[90] flex items-center justify-center bg-[color-mix(in_oklab,var(--color-ink),transparent_50%)] p-6 backdrop-blur-[4px]"
					exit={{ opacity: 0 }}
					initial={{ opacity: 0 }}
					onClick={() => setVisible(false)}
					transition={{ duration: 0.18 }}
				>
					<motion.div
						animate={{ y: 0, opacity: 1 }}
						className="w-[min(520px,100%)] overflow-hidden rounded-2xl border border-hair bg-[var(--bg)] text-ink shadow-[0_30px_80px_rgba(0,0,0,0.16)]"
						exit={{ y: 8, opacity: 0 }}
						initial={{ y: 16, opacity: 0 }}
						onClick={(e) => e.stopPropagation()}
						transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
					>
						<div className="flex items-baseline justify-between px-7 pt-[22px] pb-1">
							<div className="text-[11px] text-ink-mute uppercase tracking-[0.14em]">
								Before you go
							</div>
							<button
								aria-label="Close"
								className="grid h-8 w-8 cursor-pointer appearance-none place-items-center rounded-lg text-[22px] text-ink-mute outline-none hover:bg-hair hover:text-ink"
								onClick={() => setVisible(false)}
								type="button"
							>
								×
							</button>
						</div>
						<div className="px-7 pt-3 pb-6">
							<h3 className="mb-1.5 max-w-[22ch] font-medium text-[24px] tracking-[-0.02em]">
								Want a 21-day rent estimate for your unit?
							</h3>
							<p className="mb-5 max-w-[44ch] text-[14px] text-ink-soft">
								Two answers. Building-level comparables, suggested rent range,
								and the exact signed-by date. No call required.
							</p>

							<div className="mb-4 flex flex-col gap-2">
								<label
									className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.12em]"
									htmlFor="neighborhood-select"
								>
									Neighborhood
								</label>
								<select
									className="h-11 rounded-lg border border-hair-strong bg-[var(--bg,#FAF8F3)] px-3 font-sans text-[15px] text-ink outline-none focus:border-ink"
									id="neighborhood-select"
									onChange={(e) => setNeighborhood(e.target.value)}
									value={neighborhood}
								>
									{NEIGHBORHOODS.map((n) => (
										<option key={n} value={n}>
											{n}
										</option>
									))}
								</select>
							</div>
							<div className="mb-5 flex flex-col gap-2">
								<div className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.12em]">
									Bedrooms
								</div>
								<div className="flex flex-wrap gap-1.5">
									{BEDROOM_TYPES.map((b) => (
										<button
											className={cn(
												"h-10 cursor-pointer appearance-none rounded-full border border-hair-strong px-3.5 text-[13px] transition-colors hover:border-ink",
												bedrooms === b && "border-ink bg-ink text-paper",
											)}
											key={b}
											onClick={() => setBedrooms(b)}
											type="button"
										>
											{b}
										</button>
									))}
								</div>
							</div>
						</div>
						<div className="flex items-center justify-between border-hair border-t bg-[color-mix(in_oklab,var(--bg,#FAF8F3),var(--color-ink)_2%)] px-7 py-[16px]">
							<button
								className="cursor-pointer text-[13px] text-ink-mute underline hover:text-ink"
								onClick={() => setVisible(false)}
								type="button"
							>
								No thanks
							</button>
							<Button
								className="h-11 px-[18px] text-[14px]"
								onClick={submit}
								showArrow
							>
								Get my rent estimate
							</Button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
