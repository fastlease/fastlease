"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "~/lib/utils";
import { Button } from "../ui/Button";
import { NEIGHBORHOODS, BEDROOM_TYPES } from "~/lib/leases";

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
		setVisible(false);
		onOpen({ neighborhood, bedrooms });
	};

	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					className="fixed inset-0 z-[90] bg-[color-mix(in_oklab,var(--color-ink),transparent_50%)] backdrop-blur-[4px] flex items-center justify-center p-6"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.18 }}
					onClick={() => setVisible(false)}
				>
					<motion.div
						className="bg-[var(--bg)] text-ink w-[min(520px,100%)] rounded-2xl border border-hair shadow-[0_30px_80px_rgba(0,0,0,0.16)] overflow-hidden"
						initial={{ y: 16, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 8, opacity: 0 }}
						transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex justify-between items-baseline pt-[22px] px-7 pb-1">
							<div className="text-[11px] uppercase tracking-[0.14em] text-ink-mute">Before you go</div>
							<button
								className="appearance-none cursor-pointer text-[22px] text-ink-mute w-8 h-8 grid place-items-center rounded-lg hover:bg-hair hover:text-ink outline-none"
								onClick={() => setVisible(false)}
								aria-label="Close"
								type="button"
							>
								×
							</button>
						</div>
						<div className="px-7 pt-3 pb-6">
							<h3 className="text-[24px] font-medium tracking-[-0.02em] max-w-[22ch] mb-1.5">
								Want a 21-day rent estimate for your unit?
							</h3>
							<p className="text-[14px] text-ink-soft max-w-[44ch] mb-5">
								Two answers. Building-level comparables, suggested rent range, and the exact signed-by date. No call required.
							</p>

							<div className="flex flex-col gap-2 mb-4">
								<label className="text-[11px] uppercase tracking-[0.12em] text-ink-mute font-medium">Neighborhood</label>
								<select
									value={neighborhood}
									onChange={(e) => setNeighborhood(e.target.value)}
									className="h-11 px-3 rounded-lg border border-hair-strong bg-[var(--bg,#FAF8F3)] text-ink font-sans text-[15px] outline-none focus:border-ink"
								>
									{NEIGHBORHOODS.map((n) => (
										<option key={n} value={n}>{n}</option>
									))}
								</select>
							</div>
							<div className="flex flex-col gap-2 mb-5">
								<label className="text-[11px] uppercase tracking-[0.12em] text-ink-mute font-medium">Bedrooms</label>
								<div className="flex flex-wrap gap-1.5">
									{BEDROOM_TYPES.map((b) => (
										<button
											key={b}
											type="button"
											onClick={() => setBedrooms(b)}
											className={cn(
												"appearance-none cursor-pointer h-10 px-3.5 border border-hair-strong rounded-full text-[13px] transition-colors hover:border-ink",
												bedrooms === b && "border-ink bg-ink text-paper",
											)}
										>
											{b}
										</button>
									))}
								</div>
							</div>
						</div>
						<div className="flex justify-between items-center py-[16px] px-7 border-t border-hair bg-[color-mix(in_oklab,var(--bg,#FAF8F3),var(--color-ink)_2%)]">
							<button
								type="button"
								onClick={() => setVisible(false)}
								className="text-[13px] text-ink-mute hover:text-ink underline cursor-pointer"
							>
								No thanks
							</button>
							<Button onClick={submit} className="h-11 px-[18px] text-[14px]" showArrow>
								Get my rent estimate
							</Button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
