"use client";

import { useState, useEffect, useMemo } from "react";
import { cn } from "~/lib/utils";
import { Button } from "../ui/Button";

interface FormModalProps {
	open: boolean;
	onClose: () => void;
	mode: "timeline" | "call";
}

const STEPS = 4; // 3 input + 1 result

export function FormModal({ open, onClose, mode }: FormModalProps) {
	const [step, setStep] = useState(0);
	const [data, setData] = useState({
		address: "",
		neighborhood: "King West",
		bedrooms: "1BR",
		targetRent: "",
		move: "flexible",
		name: "",
		email: "",
	});

	useEffect(() => {
		if (open) {
			setStep(0);
		}
	}, [open]);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape" && open) onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onClose]);

	const set = (k: keyof typeof data, v: string) => setData((d) => ({ ...d, [k]: v }));

	// Simple deterministic estimator
	const estimate = useMemo(() => {
		const baseOffsets: Record<string, number> = { "Jr 1BR": 14, "1BR": 16, "1BR+den": 17, "2BR": 18, "2BR+den": 19, "3BR": 21 };
		const base = baseOffsets[data.bedrooms] || 16;
		
		const seasonal = (() => {
			const m = new Date().getMonth();
			if (m >= 4 && m <= 7) return -2;
			if (m === 11 || m === 0) return 2;
			return 0;
		})();
		
		const target = parseInt((data.targetRent || "").replace(/[^0-9]/g, ""), 10) || 0;
		const recRents: Record<string, number> = { "Jr 1BR": 2200, "1BR": 2650, "1BR+den": 2900, "2BR": 3300, "2BR+den": 3550, "3BR": 4200 };
		const recRent = recRents[data.bedrooms] || 2650;
		
		let over = 0;
		if (target && target > recRent * 1.05) {
			over = Math.min(6, Math.round((target - recRent * 1.05) / 60));
		}
		
		const days = Math.max(7, Math.min(21, base + seasonal + over));
		const today = new Date();
		const listDate = new Date(today.getTime() + 3 * 86400000);
		const leaseDate = new Date(today.getTime() + (days + 3) * 86400000);
		
		const fmt = (d: Date) => d.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
		
		return {
			days,
			rentLow: Math.round((recRent * 0.97) / 25) * 25,
			rentHigh: Math.round((recRent * 1.03) / 25) * 25,
			listDate: fmt(listDate),
			leaseBy: fmt(leaseDate),
			over,
		};
	}, [data.bedrooms, data.targetRent]);

	if (mode === "call") {
		return (
			<div 
				className={cn(
					"fixed inset-0 z-[80] bg-[color-mix(in_oklab,var(--color-ink),transparent_50%)] backdrop-blur-[4px] flex items-center justify-center p-6 opacity-0 pointer-events-none transition-opacity duration-200",
					open && "opacity-100 pointer-events-auto"
				)} 
				onClick={onClose}
			>
				<div 
					className={cn(
						"bg-[var(--bg)] text-ink w-[min(640px,100%)] max-h-[calc(100vh-48px)] rounded-2xl border border-hair shadow-[0_30px_80px_rgba(0,0,0,0.16)] flex flex-col overflow-hidden translate-y-2 transition-transform duration-200",
						open && "translate-y-0"
					)} 
					onClick={(e) => e.stopPropagation()}
				>
					<div className="flex justify-between items-baseline pt-[26px] px-7 max-sm:px-[22px] pb-1.5">
						<div>
							<div className="text-[11px] uppercase tracking-[0.14em] text-ink-mute">15-minute call</div>
							<h3 className="text-[26px] font-medium tracking-[-0.02em] mt-2">Pick a window that works.</h3>
						</div>
						<button className="appearance-none cursor-default text-[22px] text-ink-mute w-8 h-8 grid place-items-center rounded-lg hover:bg-hair hover:text-ink outline-none" onClick={onClose} aria-label="Close">×</button>
					</div>
					<div className="px-7 max-sm:px-[22px] pt-2 pb-7 overflow-y-auto">
						<p className="text-[15px] text-ink-soft max-w-[50ch] mb-6">
							We&apos;ll send a short calendar invite. No deck, no pitch — fifteen minutes on what you&apos;d want from us, and whether we can deliver it for your unit.
						</p>
						<div className="flex flex-col gap-2 mb-[18px]">
							<label className="text-[12px] uppercase tracking-[0.12em] text-ink-mute font-medium">Your name</label>
							<input className="h-12 px-3.5 rounded-lg border border-hair-strong bg-[var(--bg,#FAF8F3)] text-ink font-sans text-[16px] outline-none transition-colors duration-150 focus:border-ink" value={data.name} onChange={(e) => set("name", e.target.value)} placeholder="Full name"/>
						</div>
						<div className="flex flex-col gap-2 mb-[18px]">
							<label className="text-[12px] uppercase tracking-[0.12em] text-ink-mute font-medium">Email</label>
							<input type="email" className="h-12 px-3.5 rounded-lg border border-hair-strong bg-[var(--bg,#FAF8F3)] text-ink font-sans text-[16px] outline-none transition-colors duration-150 focus:border-ink" value={data.email} onChange={(e) => set("email", e.target.value)} placeholder="you@domain.com"/>
						</div>
						<div className="flex flex-col gap-2 mb-[18px]">
							<label className="text-[12px] uppercase tracking-[0.12em] text-ink-mute font-medium">Preferred time</label>
							<select className="h-12 px-3.5 rounded-lg border border-hair-strong bg-[var(--bg,#FAF8F3)] text-ink font-sans text-[16px] outline-none transition-colors duration-150 focus:border-ink" defaultValue="">
								<option value="" disabled>Select a window</option>
								<option>Weekdays, mornings</option>
								<option>Weekdays, afternoons</option>
								<option>Weekday evenings</option>
								<option>Weekend</option>
							</select>
						</div>
					</div>
					<div className="flex justify-between items-center py-[18px] px-7 max-sm:px-[22px] border-t border-hair bg-[color-mix(in_oklab,var(--bg,#FAF8F3),var(--color-ink)_2%)]">
						<span className="text-[14px] text-ink-mute">We respond within one business day.</span>
						<Button onClick={onClose} className="h-11 px-[18px] text-[14px]" showArrow>
							Send request
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div 
			className={cn(
				"fixed inset-0 z-[80] bg-[color-mix(in_oklab,var(--color-ink),transparent_50%)] backdrop-blur-[4px] flex items-center justify-center p-6 opacity-0 pointer-events-none transition-opacity duration-200",
				open && "opacity-100 pointer-events-auto"
			)} 
			onClick={onClose}
		>
			<div 
				className={cn(
					"bg-[var(--bg)] text-ink w-[min(640px,100%)] max-h-[calc(100vh-48px)] rounded-2xl border border-hair shadow-[0_30px_80px_rgba(0,0,0,0.16)] flex flex-col overflow-hidden translate-y-2 transition-transform duration-200",
					open && "translate-y-0"
				)} 
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex justify-between items-baseline pt-[26px] px-7 max-sm:px-[22px] pb-1.5">
					<div>
						<div className="text-[11px] uppercase tracking-[0.14em] text-ink-mute">Leasing timeline · 60 seconds</div>
					</div>
					<button className="appearance-none cursor-default text-[22px] text-ink-mute w-8 h-8 grid place-items-center rounded-lg hover:bg-hair hover:text-ink outline-none" onClick={onClose} aria-label="Close">×</button>
				</div>
				
				<div className="flex gap-1.5 px-7 max-sm:px-[22px] pb-[18px] mt-2">
					{Array.from({ length: STEPS }, (_, i) => (
						<div 
							key={i} 
							className={cn(
								"flex-1 h-0.5 bg-hair rounded-[1px] transition-colors",
								i < step && "bg-accent",
								i === step && "bg-ink"
							)}
						/>
					))}
				</div>

				{step === 0 && (
					<div className="px-7 max-sm:px-[22px] pt-2 pb-7 overflow-y-auto">
						<h3 className="text-[26px] font-medium tracking-[-0.02em] max-w-[22ch] mb-1.5">Where&apos;s the unit?</h3>
						<p className="text-[15px] text-ink-soft max-w-[50ch] mb-6">We use building-level comparables, so the neighborhood matters more than the street address.</p>
						<div className="flex flex-col gap-2 mb-[18px]">
							<label className="text-[12px] uppercase tracking-[0.12em] text-ink-mute font-medium">Neighborhood</label>
							<select className="h-12 px-3.5 rounded-lg border border-hair-strong bg-[var(--bg,#FAF8F3)] text-ink font-sans text-[16px] outline-none transition-colors duration-150 focus:border-ink" value={data.neighborhood} onChange={(e) => set("neighborhood", e.target.value)}>
								{["King West","Liberty Village","CityPlace","St. Lawrence","Yonge & Eg","The Annex","Distillery","Fort York","Leslieville","Other Toronto"].map((n) => <option key={n} value={n}>{n}</option>)}
							</select>
						</div>
						<div className="flex flex-col gap-2 mb-[18px]">
							<label className="text-[12px] uppercase tracking-[0.12em] text-ink-mute font-medium">Building or address (optional)</label>
							<input className="h-12 px-3.5 rounded-lg border border-hair-strong bg-[var(--bg,#FAF8F3)] text-ink font-sans text-[16px] outline-none transition-colors duration-150 focus:border-ink" value={data.address} onChange={(e) => set("address", e.target.value)} placeholder="e.g. Ice Condos, or 38 Niagara St"/>
						</div>
					</div>
				)}

				{step === 1 && (
					<div className="px-7 max-sm:px-[22px] pt-2 pb-7 overflow-y-auto">
						<h3 className="text-[26px] font-medium tracking-[-0.02em] max-w-[22ch] mb-1.5">What kind of unit?</h3>
						<p className="text-[15px] text-ink-soft max-w-[50ch] mb-6">Bedroom count determines time-to-lease more than any other input.</p>
						<div className="flex flex-col gap-2 mb-[18px]">
							<label className="text-[12px] uppercase tracking-[0.12em] text-ink-mute font-medium">Bedrooms</label>
							<div className="grid grid-cols-3 max-sm:grid-cols-2 gap-2">
								{["Jr 1BR","1BR","1BR+den","2BR","2BR+den","3BR"].map((b) => (
									<button 
										key={b} 
										className={cn(
											"appearance-none cursor-default text-center h-12 grid place-items-center border border-hair-strong rounded-lg text-[15px] transition-colors",
											data.bedrooms === b && "border-ink bg-[color-mix(in_oklab,var(--color-ink),transparent_96%)]"
										)} 
										onClick={() => set("bedrooms", b)}
									>
										{b}
									</button>
								))}
							</div>
						</div>
						<div className="flex flex-col gap-2 mb-[18px]">
							<label className="text-[12px] uppercase tracking-[0.12em] text-ink-mute font-medium">Target rent (optional)</label>
							<input className="h-12 px-3.5 rounded-lg border border-hair-strong bg-[var(--bg,#FAF8F3)] text-ink font-sans text-[16px] outline-none transition-colors duration-150 focus:border-ink" inputMode="numeric" value={data.targetRent} onChange={(e) => set("targetRent", e.target.value)} placeholder="e.g. $2,800"/>
						</div>
					</div>
				)}

				{step === 2 && (
					<div className="px-7 max-sm:px-[22px] pt-2 pb-7 overflow-y-auto">
						<h3 className="text-[26px] font-medium tracking-[-0.02em] max-w-[22ch] mb-1.5">When does it need to be leased by?</h3>
						<p className="text-[15px] text-ink-soft max-w-[50ch] mb-6">Optional. We&apos;ll always work to twenty-one days — this just helps us flag anything tighter than that.</p>
						<div className="flex flex-col gap-2 mb-[18px]">
							<label className="text-[12px] uppercase tracking-[0.12em] text-ink-mute font-medium">Move-in window</label>
							<div className="grid grid-cols-3 max-sm:grid-cols-2 gap-2">
								{[{k:"urgent",l:"< 30 days"},{k:"soon",l:"30–60 days"},{k:"flexible",l:"Flexible"}].map((o) => (
									<button 
										key={o.k} 
										className={cn(
											"appearance-none cursor-default text-center h-12 grid place-items-center border border-hair-strong rounded-lg text-[15px] transition-colors",
											data.move === o.k && "border-ink bg-[color-mix(in_oklab,var(--color-ink),transparent_96%)]"
										)} 
										onClick={() => set("move", o.k)}
									>
										{o.l}
									</button>
								))}
							</div>
						</div>
						<div className="flex flex-col gap-2 mb-[18px]">
							<label className="text-[12px] uppercase tracking-[0.12em] text-ink-mute font-medium">Email (for the report)</label>
							<input type="email" className="h-12 px-3.5 rounded-lg border border-hair-strong bg-[var(--bg,#FAF8F3)] text-ink font-sans text-[16px] outline-none transition-colors duration-150 focus:border-ink" value={data.email} onChange={(e) => set("email", e.target.value)} placeholder="you@domain.com"/>
						</div>
					</div>
				)}

				{step === 3 && (
					<div className="px-7 max-sm:px-[22px] pt-2 pb-7">
						<div className="text-[11px] uppercase tracking-[0.14em] text-ink-mute mb-2">Your estimated timeline</div>
						<h3 className="text-[26px] font-medium tracking-[-0.02em] mb-1">
							{data.bedrooms} in {data.neighborhood}
						</h3>
						<p className="text-[15px] text-ink-soft mb-5">
							Based on comparable units leased in the last 90 days. Numbers refresh quarterly.
						</p>

						<div className="flex justify-between items-baseline py-[18px] border-b border-hair">
							<div>
								<div className="text-[12px] uppercase tracking-[0.12em] text-ink-mute font-medium">Estimated days to lease</div>
								<div className="text-[13px] text-ink-mute mt-1">Average across recent comparables.</div>
							</div>
							<div className="text-[28px] font-medium tracking-[-0.02em] num text-accent">{estimate.days} <span className="text-[16px] text-ink-mute">days</span></div>
						</div>
						<div className="flex justify-between items-baseline py-[18px] border-b border-hair">
							<div>
								<div className="text-[12px] uppercase tracking-[0.12em] text-ink-mute font-medium">Suggested rent range</div>
								<div className="text-[13px] text-ink-mute mt-1">Within ±3% of recent comparables.</div>
							</div>
							<div className="text-[28px] font-medium tracking-[-0.02em] num">${estimate.rentLow.toLocaleString()}–${estimate.rentHigh.toLocaleString()}</div>
						</div>
						<div className="flex justify-between items-baseline py-[18px] border-b border-hair">
							<div>
								<div className="text-[12px] uppercase tracking-[0.12em] text-ink-mute font-medium">Recommended list date</div>
								<div className="text-[13px] text-ink-mute mt-1">Allows two days for photography & pricing.</div>
							</div>
							<div className="text-[28px] font-medium tracking-[-0.02em] num">{estimate.listDate}</div>
						</div>
						<div className="flex justify-between items-baseline py-[18px]">
							<div>
								<div className="text-[12px] uppercase tracking-[0.12em] text-ink-mute font-medium">Likely signed by</div>
								<div className="text-[13px] text-ink-mute mt-1">Inside the 21-day guarantee window.</div>
							</div>
							<div className="text-[28px] font-medium tracking-[-0.02em] num">{estimate.leaseBy}</div>
						</div>

						{estimate.over > 0 && (
							<div className="mt-5 py-3.5 px-4 bg-[color-mix(in_oklab,var(--accent),transparent_88%)] rounded-[10px] text-[14px] text-ink-soft">
								Heads-up: your target rent is above our suggested range. We can still list it — the guarantee terms change above 5% over our recommendation.
							</div>
						)}

						<div className="flex gap-3 mt-5 flex-wrap">
							<Button onClick={onClose} className="px-5 text-[15px]" showArrow>Email me this estimate</Button>
							<Button variant="ghost" onClick={() => setStep(0)} className="px-5 text-[15px]">Start over</Button>
						</div>
					</div>
				)}

				{step < 3 && (
					<div className="flex justify-between items-center py-[18px] px-7 max-sm:px-[22px] border-t border-hair bg-[color-mix(in_oklab,var(--bg,#FAF8F3),var(--color-ink)_2%)] mt-auto">
						<button 
							className="appearance-none cursor-default text-[14px] text-ink-mute hover:text-ink disabled:opacity-30 disabled:hover:text-ink-mute transition-opacity" 
							onClick={() => setStep(Math.max(0, step - 1))} 
							disabled={step === 0}
						>
							← Back
						</button>
						<Button onClick={() => setStep(step + 1)} className="h-11 px-[18px] text-[14px]" showArrow>
							{step === 2 ? "See timeline" : "Continue"}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
