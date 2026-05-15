"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "~/lib/utils";
import { Button } from "../ui/Button";
import { NEIGHBORHOODS, BEDROOM_TYPES, comparables } from "~/lib/leases";
import { estimate as runEstimate, vacancySavings, TORONTO_AVG_DAYS } from "~/lib/estimator";
import { api } from "~/trpc/react";
import { track, Events } from "~/lib/analytics";
import { readAttribution } from "~/lib/referral";
import { env } from "~/env";

interface FormData {
	address: string;
	neighborhood: string;
	bedrooms: string;
	targetRent: string;
	move: string;
	name: string;
	email: string;
	timeWindow: string;
}

interface FormModalProps {
	open: boolean;
	onClose: () => void;
	mode: "timeline" | "call";
	onBookCall?: () => void;
	initialData?: Partial<FormData>;
}

const STEPS = 4; // 0 location · 1 unit · 2 email-gate · 3 reveal
const STORAGE_KEY = "fastlease.form.v1";
const EMPTY: FormData = {
	address: "",
	neighborhood: "King West",
	bedrooms: "1BR",
	targetRent: "",
	move: "flexible",
	name: "",
	email: "",
	timeWindow: "",
};

const slideVariants = {
	enter: (dir: 1 | -1) => ({ x: dir * 40, opacity: 0 }),
	center: { x: 0, opacity: 1 },
	exit: (dir: 1 | -1) => ({ x: dir * -40, opacity: 0 }),
};

export function FormModal({ open, onClose, mode, onBookCall, initialData }: FormModalProps) {
	const [internalMode, setInternalMode] = useState<"timeline" | "call">(mode);
	const [step, setStep] = useState(0);
	const [dir, setDir] = useState<1 | -1>(1);
	const [data, setData] = useState<FormData>(EMPTY);
	const [resumed, setResumed] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const submit = api.lead.submitEstimate.useMutation();

	useEffect(() => {
		if (!open) return;
		setInternalMode(mode);
		setSubmitted(false);
		setError(null);

		let next: FormData = { ...EMPTY, ...(initialData ?? {}) };
		let startStep = 0;
		let didResume = false;

		try {
			const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
			if (saved && !initialData) {
				const parsed = JSON.parse(saved) as { data?: FormData; step?: number };
				if (parsed.data && (parsed.step ?? 0) > 0) {
					next = { ...EMPTY, ...parsed.data };
					startStep = Math.min(parsed.step ?? 0, STEPS - 2);
					didResume = true;
				}
			}
		} catch {}

		setData(next);
		setStep(startStep);
		setDir(1);
		setResumed(didResume);
		track(Events.formStarted, { source: initialData ? "prefilled" : didResume ? "resumed" : "fresh" });
	}, [open, mode, initialData]);

	useEffect(() => {
		if (!open || internalMode !== "timeline") return;
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, step }));
		} catch {}
	}, [data, step, open, internalMode]);

	const set = useCallback(<K extends keyof FormData>(k: K, v: FormData[K]) => {
		setData((d) => ({ ...d, [k]: v }));
	}, []);

	const advance = useCallback(() => {
		setDir(1);
		setStep((s) => {
			const next = Math.min(STEPS - 1, s + 1);
			track(Events.formStepCompleted, { from: s, to: next });
			return next;
		});
	}, []);

	const back = useCallback(() => {
		setDir(-1);
		setStep((s) => Math.max(0, s - 1));
	}, []);

	const handleClose = useCallback(() => {
		if (!submitted) track(Events.formAbandoned, { step });
		onClose();
	}, [onClose, submitted, step]);

	const finish = useCallback(() => {
		try {
			localStorage.removeItem(STORAGE_KEY);
		} catch {}
		onClose();
	}, [onClose]);

	const estimate = useMemo(
		() => runEstimate({ bedrooms: data.bedrooms, neighborhood: data.neighborhood, targetRent: data.targetRent }),
		[data.bedrooms, data.neighborhood, data.targetRent],
	);

	const savings = useMemo(() => vacancySavings(estimate.days), [estimate.days]);
	const comps = useMemo(
		() => comparables(data.bedrooms, data.neighborhood, 3),
		[data.bedrooms, data.neighborhood],
	);

	const switchToCall = useCallback(() => {
		setDir(1);
		setInternalMode("call");
	}, []);

	const submitEmail = useCallback(async () => {
		setError(null);
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
			setError("That email doesn't look right.");
			return;
		}
		try {
			await submit.mutateAsync({
				email: data.email,
				name: data.name || undefined,
				neighborhood: data.neighborhood,
				bedrooms: data.bedrooms,
				targetRent: data.targetRent || undefined,
				address: data.address || undefined,
				moveWindow: data.move,
				source: "form",
				estimate: {
					days: estimate.days,
					rentLow: estimate.rentLow,
					rentHigh: estimate.rentHigh,
					listDate: estimate.listDate,
					leaseBy: estimate.leaseBy,
				},
				attribution: readAttribution(),
			});
			setSubmitted(true);
			track(Events.leadSubmitted, { source: "form", days: estimate.days });
			track(Events.estimateRevealed, { days: estimate.days });
			advance();
		} catch (e) {
			setError(e instanceof Error ? e.message : "Something went wrong.");
		}
	}, [data, estimate, submit, advance]);

	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				e.preventDefault();
				handleClose();
				return;
			}
			if (e.key === "Enter" && internalMode === "timeline") {
				const target = e.target as HTMLElement | null;
				if (target && target.tagName === "TEXTAREA") return;
				if (step === 2) {
					e.preventDefault();
					void submitEmail();
					return;
				}
				if (step < STEPS - 1) {
					e.preventDefault();
					advance();
				}
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, step, internalMode, advance, handleClose, submitEmail]);

	if (internalMode === "call") {
		return (
			<CallMode
				open={open}
				onClose={finish}
				data={data}
				estimate={estimate}
				onChange={set}
			/>
		);
	}

	return (
		<div
			className={cn(
				"fixed inset-0 z-[80] bg-[color-mix(in_oklab,var(--color-ink),transparent_50%)] backdrop-blur-[4px] flex items-center justify-center p-6 opacity-0 pointer-events-none transition-opacity duration-200",
				open && "opacity-100 pointer-events-auto",
			)}
			onClick={handleClose}
		>
			<div
				className={cn(
					"bg-[var(--bg)] text-ink w-[min(680px,100%)] max-h-[calc(100vh-48px)] rounded-2xl border border-hair shadow-[0_30px_80px_rgba(0,0,0,0.16)] flex flex-col overflow-hidden translate-y-2 transition-transform duration-200",
					open && "translate-y-0",
				)}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex justify-between items-baseline pt-[22px] px-7 max-sm:px-[22px] pb-1.5">
					<div>
						<div className="text-[11px] uppercase tracking-[0.14em] text-ink-mute flex items-baseline gap-2.5">
							<span>Leasing timeline · 60 seconds</span>
							<span className="text-ink-faint">·</span>
							<span className="num">Step {Math.min(step + 1, STEPS)} of {STEPS}</span>
						</div>
					</div>
					<button
						className="appearance-none cursor-pointer text-[22px] text-ink-mute w-8 h-8 grid place-items-center rounded-lg hover:bg-hair hover:text-ink outline-none"
						onClick={handleClose}
						aria-label="Close"
						type="button"
					>
						×
					</button>
				</div>

				<div className="px-7 max-sm:px-[22px] mt-3">
					<div className="h-[3px] w-full bg-hair rounded-full overflow-hidden">
						<motion.div
							className="h-full bg-ink"
							initial={false}
							animate={{ width: `${((step + 1) / STEPS) * 100}%` }}
							transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
						/>
					</div>
				</div>

				{step > 0 && step < STEPS - 1 && (
					<LivePreview data={data} estimate={estimate} blurred={step < 2} />
				)}

				{resumed && step === 0 && (
					<div className="mx-7 max-sm:mx-[22px] mt-4 flex items-center justify-between gap-3 py-2.5 px-3.5 bg-[color-mix(in_oklab,var(--accent),transparent_92%)] border border-[color-mix(in_oklab,var(--accent),transparent_75%)] rounded-lg">
						<span className="text-[13px] text-ink-soft">Resumed from your last session.</span>
						<button
							type="button"
							onClick={() => {
								try { localStorage.removeItem(STORAGE_KEY); } catch {}
								setData(EMPTY);
								setStep(0);
								setResumed(false);
							}}
							className="text-[12px] text-ink-mute hover:text-ink underline cursor-pointer"
						>
							Start over
						</button>
					</div>
				)}

				<div className="flex-1 overflow-y-auto relative">
					<AnimatePresence mode="wait" custom={dir} initial={false}>
						<motion.div
							key={step}
							custom={dir}
							variants={slideVariants}
							initial="enter"
							animate="center"
							exit="exit"
							transition={{ duration: 0.32, ease: [0.21, 0.47, 0.32, 0.98] }}
							className="px-7 max-sm:px-[22px] pt-6 pb-7"
						>
							{step === 0 && (
								<StepLocation data={data} onSet={set} onAdvance={advance} />
							)}
							{step === 1 && (
								<StepUnit data={data} onSet={set} onAdvance={advance} />
							)}
							{step === 2 && (
								<StepEmailGate
									data={data}
									onSet={set}
									onSubmit={submitEmail}
									pending={submit.isPending}
									error={error}
								/>
							)}
							{step === 3 && (
								<StepResult
									data={data}
									estimate={estimate}
									savings={savings}
									comps={comps}
									onBook={() => {
										if (onBookCall) {
											finish();
											onBookCall();
										} else {
											switchToCall();
										}
									}}
									onClose={finish}
									onRestart={() => {
										setDir(-1);
										setStep(0);
									}}
								/>
							)}
						</motion.div>
					</AnimatePresence>
				</div>

				{step < STEPS - 1 && (
					<div className="flex justify-between items-center py-[16px] px-7 max-sm:px-[22px] border-t border-hair bg-[color-mix(in_oklab,var(--bg,#FAF8F3),var(--color-ink)_2%)]">
						<button
							className="appearance-none cursor-pointer text-[14px] text-ink-mute hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
							onClick={back}
							disabled={step === 0}
							type="button"
						>
							← Back
						</button>
						<div className="flex items-center gap-3">
							<span className="text-[12px] text-ink-faint max-sm:hidden">
								Press <kbd className="num text-ink-mute">Enter</kbd> to continue
							</span>
							{step === 2 ? (
								<Button onClick={submitEmail} className="h-11 px-[18px] text-[14px]" showArrow disabled={submit.isPending}>
									{submit.isPending ? "Sending…" : "Reveal my estimate"}
								</Button>
							) : (
								<Button onClick={advance} className="h-11 px-[18px] text-[14px]" showArrow>
									Continue
								</Button>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

function LivePreview({
	data,
	estimate,
	blurred,
}: {
	data: FormData;
	estimate: ReturnType<typeof runEstimate>;
	blurred?: boolean;
}) {
	return (
		<div className="mx-7 max-sm:mx-[22px] mt-4 flex items-baseline justify-between gap-3 py-2.5 px-3.5 bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] border border-hair rounded-lg">
			<div className="flex items-baseline gap-2.5 text-[12px] text-ink-mute uppercase tracking-[0.1em]">
				<span>Estimate so far</span>
				<span className="text-ink-faint">·</span>
				<span className="text-ink normal-case tracking-normal">{data.bedrooms} in {data.neighborhood}</span>
			</div>
			<div
				className={cn(
					"flex items-baseline gap-2.5 text-[13px] transition-all duration-300",
					blurred && "blur-[5px] select-none",
				)}
				aria-hidden={blurred}
			>
				<span className="num text-ink font-medium">${estimate.rentLow.toLocaleString()}–${estimate.rentHigh.toLocaleString()}</span>
				<span className="text-ink-faint">·</span>
				<span className="num text-ink font-medium">{estimate.days}d</span>
			</div>
		</div>
	);
}

function StepLocation({
	data,
	onSet,
	onAdvance,
}: {
	data: FormData;
	onSet: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
	onAdvance: () => void;
}) {
	return (
		<div>
			<h3 className="text-[26px] font-medium tracking-[-0.02em] max-w-[22ch] mb-1.5">Where&apos;s the unit?</h3>
			<p className="text-[15px] text-ink-soft max-w-[50ch] mb-6">We use building-level comparables, so the neighborhood matters more than the street address.</p>

			<div className="flex flex-col gap-2 mb-[18px]">
				<label className="text-[12px] uppercase tracking-[0.12em] text-ink-mute font-medium">Neighborhood</label>
				<div className="grid grid-cols-3 max-sm:grid-cols-2 gap-2">
					{NEIGHBORHOODS.map((n) => (
						<button
							key={n}
							type="button"
							onClick={() => {
								onSet("neighborhood", n);
								setTimeout(onAdvance, 140);
							}}
							className={cn(
								"appearance-none cursor-pointer text-center min-h-[48px] py-2 px-3 grid place-items-center border border-hair-strong rounded-lg text-[14px] transition-colors hover:border-ink",
								data.neighborhood === n && "border-ink bg-[color-mix(in_oklab,var(--color-ink),transparent_96%)]",
							)}
						>
							{n}
						</button>
					))}
				</div>
			</div>
			<div className="flex flex-col gap-2">
				<label className="text-[12px] uppercase tracking-[0.12em] text-ink-mute font-medium">Building or address (optional)</label>
				<input
					className="h-12 px-3.5 rounded-lg border border-hair-strong bg-[var(--bg,#FAF8F3)] text-ink font-sans text-[16px] outline-none transition-colors duration-150 focus:border-ink"
					value={data.address}
					onChange={(e) => onSet("address", e.target.value)}
					placeholder="e.g. Ice Condos, or 38 Niagara St"
				/>
			</div>
		</div>
	);
}

function StepUnit({
	data,
	onSet,
	onAdvance,
}: {
	data: FormData;
	onSet: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
	onAdvance: () => void;
}) {
	const MOVE_OPTIONS = [
		{ k: "urgent", l: "< 30 days" },
		{ k: "soon", l: "30–60 days" },
		{ k: "flexible", l: "Flexible" },
	];
	return (
		<div>
			<h3 className="text-[26px] font-medium tracking-[-0.02em] max-w-[22ch] mb-1.5">What kind of unit?</h3>
			<p className="text-[15px] text-ink-soft max-w-[50ch] mb-6">Bedroom count moves time-to-lease more than any other input.</p>

			<div className="flex flex-col gap-2 mb-[18px]">
				<label className="text-[12px] uppercase tracking-[0.12em] text-ink-mute font-medium">Bedrooms</label>
				<div className="grid grid-cols-3 max-sm:grid-cols-2 gap-2">
					{BEDROOM_TYPES.map((b) => (
						<button
							key={b}
							type="button"
							onClick={() => {
								onSet("bedrooms", b);
								setTimeout(onAdvance, 140);
							}}
							className={cn(
								"appearance-none cursor-pointer text-center h-12 grid place-items-center border border-hair-strong rounded-lg text-[15px] transition-colors hover:border-ink",
								data.bedrooms === b && "border-ink bg-[color-mix(in_oklab,var(--color-ink),transparent_96%)]",
							)}
						>
							{b}
						</button>
					))}
				</div>
			</div>
			<div className="flex flex-col gap-2 mb-[18px]">
				<label className="text-[12px] uppercase tracking-[0.12em] text-ink-mute font-medium">Target rent (optional)</label>
				<input
					className="h-12 px-3.5 rounded-lg border border-hair-strong bg-[var(--bg,#FAF8F3)] text-ink font-sans text-[16px] outline-none transition-colors duration-150 focus:border-ink"
					inputMode="numeric"
					value={data.targetRent}
					onChange={(e) => onSet("targetRent", e.target.value)}
					placeholder="e.g. $2,800"
				/>
			</div>
			<div className="flex flex-col gap-2">
				<label className="text-[12px] uppercase tracking-[0.12em] text-ink-mute font-medium">Move-in window</label>
				<div className="grid grid-cols-3 max-sm:grid-cols-2 gap-2">
					{MOVE_OPTIONS.map((o) => (
						<button
							key={o.k}
							type="button"
							onClick={() => onSet("move", o.k)}
							className={cn(
								"appearance-none cursor-pointer text-center h-12 grid place-items-center border border-hair-strong rounded-lg text-[15px] transition-colors hover:border-ink",
								data.move === o.k && "border-ink bg-[color-mix(in_oklab,var(--color-ink),transparent_96%)]",
							)}
						>
							{o.l}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}

function StepEmailGate({
	data,
	onSet,
	onSubmit,
	pending,
	error,
}: {
	data: FormData;
	onSet: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
	onSubmit: () => void;
	pending: boolean;
	error: string | null;
}) {
	return (
		<div>
			<div className="text-[11px] uppercase tracking-[0.14em] text-ink-mute mb-2">One last step</div>
			<h3 className="text-[26px] font-medium tracking-[-0.02em] max-w-[26ch] mb-1.5">
				Where should we send your 21-day plan?
			</h3>
			<p className="text-[15px] text-ink-soft max-w-[52ch] mb-6">
				You&apos;ll see rent range, days, signed-by date, and three anonymized comparables. No spam, no follow-up unless you reply.
			</p>

			<div className="flex flex-col gap-2 mb-[18px]">
				<label className="text-[12px] uppercase tracking-[0.12em] text-ink-mute font-medium">Email</label>
				<input
					type="email"
					autoFocus
					autoComplete="email"
					className="h-12 px-3.5 rounded-lg border border-hair-strong bg-[var(--bg,#FAF8F3)] text-ink font-sans text-[16px] outline-none transition-colors duration-150 focus:border-ink"
					value={data.email}
					onChange={(e) => onSet("email", e.target.value)}
					placeholder="you@domain.com"
				/>
			</div>
			<div className="flex flex-col gap-2">
				<label className="text-[12px] uppercase tracking-[0.12em] text-ink-mute font-medium">Name (optional)</label>
				<input
					autoComplete="name"
					className="h-12 px-3.5 rounded-lg border border-hair-strong bg-[var(--bg,#FAF8F3)] text-ink font-sans text-[16px] outline-none transition-colors duration-150 focus:border-ink"
					value={data.name}
					onChange={(e) => onSet("name", e.target.value)}
					placeholder="First name"
				/>
			</div>

			{error && (
				<div className="mt-4 py-2.5 px-3.5 text-[13px] text-[#a23] bg-[#fde] border border-[#fcb] rounded-lg">
					{error}
				</div>
			)}

			<p className="text-[12px] text-ink-mute mt-4 max-w-[56ch]">
				We&apos;ll send the full report to your inbox. No marketing emails.
			</p>
		</div>
	);
}


function StepResult({
	data,
	estimate,
	savings,
	comps,
	onBook,
	onClose,
	onRestart,
}: {
	data: FormData;
	estimate: ReturnType<typeof runEstimate>;
	savings: ReturnType<typeof vacancySavings>;
	comps: ReturnType<typeof comparables>;
	onBook: () => void;
	onClose: () => void;
	onRestart: () => void;
}) {
	const anchor = comps[0];
	return (
		<div>
			<div className="text-[11px] uppercase tracking-[0.14em] text-accent mb-2">Estimate sent · check your inbox</div>
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
				<div className="text-[28px] font-medium tracking-[-0.02em] num text-accent">
					{estimate.days} <span className="text-[16px] text-ink-mute">days</span>
				</div>
			</div>
			<div className="flex justify-between items-baseline py-[18px] border-b border-hair">
				<div>
					<div className="text-[12px] uppercase tracking-[0.12em] text-ink-mute font-medium">Suggested rent range</div>
					<div className="text-[13px] text-ink-mute mt-1">Within ±3% of recent comparables.</div>
				</div>
				<div className="text-[28px] font-medium tracking-[-0.02em] num">
					${estimate.rentLow.toLocaleString()}–${estimate.rentHigh.toLocaleString()}
				</div>
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

			{anchor && (
				<div className="mt-4 py-4 px-5 bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] border border-hair rounded-[10px]">
					<div className="text-[11px] uppercase tracking-[0.12em] text-ink-mute font-medium mb-1.5">Your unit vs. the most recent comparable</div>
					<div className="text-[15px] text-ink leading-[1.5]">
						A <span className="text-ink font-medium">{anchor.u} in {anchor.n}</span> signed for{" "}
						<span className="num text-ink font-medium">${anchor.leased.toLocaleString()}</span> in{" "}
						<span className="num text-ink font-medium">{anchor.days} days</span> on {anchor.signed}. Same playbook, applied to yours.
					</div>
				</div>
			)}

			{savings.daysSaved > 0 && (
				<div className="mt-3 py-4 px-5 bg-[color-mix(in_oklab,var(--accent),transparent_92%)] border border-[color-mix(in_oklab,var(--accent),transparent_75%)] rounded-[10px]">
					<div className="text-[11px] uppercase tracking-[0.12em] text-accent font-medium mb-1.5">Why this matters</div>
					<div className="text-[15px] text-ink leading-[1.5]">
						<span className="num text-ink font-medium">{savings.daysSaved} days</span> faster than the Toronto average of <span className="num">{TORONTO_AVG_DAYS}</span> days. At $107/day, that&apos;s
						<span className="num text-ink font-medium"> ${savings.dollarsSaved.toLocaleString()}</span> of vacancy you don&apos;t pay.
					</div>
				</div>
			)}

			{comps.length > 0 && (
				<div className="mt-5">
					<div className="text-[11px] uppercase tracking-[0.12em] text-ink-mute font-medium mb-3">Comparable recent leases</div>
					<div className="grid grid-cols-3 max-sm:grid-cols-1 gap-2">
						{comps.map((c) => (
							<div key={`${c.n}-${c.u}-${c.signed}`} className="p-3.5 bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] border border-hair rounded-[10px]">
								<div className="text-[11px] uppercase tracking-[0.12em] text-ink-mute mb-1">{c.n} · {c.u}</div>
								<div className="text-[20px] font-medium num">${c.leased.toLocaleString()}</div>
								<div className="text-[12px] text-ink-mute mt-0.5 num">{c.days} days · {c.signed}</div>
							</div>
						))}
					</div>
				</div>
			)}

			{estimate.over > 0 && (
				<div className="mt-4 py-3.5 px-4 bg-[color-mix(in_oklab,var(--ink),transparent_94%)] rounded-[10px] text-[14px] text-ink-soft">
					Heads-up: your target rent is above our suggested range. We can still list it — the guarantee terms change above 5% over our recommendation.
				</div>
			)}

			<div className="flex gap-3 mt-6 flex-wrap items-center">
				<Button onClick={onBook} className="px-5 text-[15px]" showArrow>
					Book your 15-minute kickoff
				</Button>
				<Button variant="ghost" onClick={onClose} className="px-5 text-[15px]">
					Close
				</Button>
				<button
					type="button"
					onClick={onRestart}
					className="text-[13px] text-ink-mute hover:text-ink underline cursor-pointer ml-1"
				>
					Start over
				</button>
			</div>
			<p className="text-[13px] text-ink-mute mt-3.5 max-w-[56ch]">
				The call covers your unit specifically — pricing, photography window, and the exact 21-day calendar. No pitch deck.
			</p>
		</div>
	);
}

function CallMode({
	open,
	onClose,
	data,
	estimate,
	onChange,
}: {
	open: boolean;
	onClose: () => void;
	data: FormData;
	estimate: ReturnType<typeof runEstimate>;
	onChange: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
}) {
	const hasContext = Boolean(data.bedrooms && data.neighborhood);
	const [sent, setSent] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const book = api.lead.bookCall.useMutation();

	const calUser = env.NEXT_PUBLIC_CAL_USERNAME;
	const calEvent = env.NEXT_PUBLIC_CAL_EVENT;
	const useCalEmbed = Boolean(calUser);

	const send = async () => {
		setError(null);
		if (!data.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
			setError("Name and a valid email are required.");
			return;
		}
		try {
			await book.mutateAsync({
				email: data.email,
				name: data.name,
				neighborhood: data.neighborhood,
				bedrooms: data.bedrooms,
				timeWindow: data.timeWindow || undefined,
				source: "form-call",
				estimate: {
					days: estimate.days,
					rentLow: estimate.rentLow,
					rentHigh: estimate.rentHigh,
				},
				attribution: readAttribution(),
			});
			track(Events.callBooked, { source: "form-call" });
			setSent(true);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Something went wrong.");
		}
	};

	return (
		<div
			className={cn(
				"fixed inset-0 z-[80] bg-[color-mix(in_oklab,var(--color-ink),transparent_50%)] backdrop-blur-[4px] flex items-center justify-center p-6 opacity-0 pointer-events-none transition-opacity duration-200",
				open && "opacity-100 pointer-events-auto",
			)}
			onClick={onClose}
		>
			<div
				className={cn(
					"bg-[var(--bg)] text-ink w-[min(720px,100%)] max-h-[calc(100vh-48px)] rounded-2xl border border-hair shadow-[0_30px_80px_rgba(0,0,0,0.16)] flex flex-col overflow-hidden translate-y-2 transition-transform duration-200",
					open && "translate-y-0",
				)}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex justify-between items-baseline pt-[26px] px-7 max-sm:px-[22px] pb-1.5">
					<div>
						<div className="text-[11px] uppercase tracking-[0.14em] text-ink-mute">15-minute kickoff</div>
						<h3 className="text-[26px] font-medium tracking-[-0.02em] mt-2 max-w-[24ch]">
							{hasContext ? `Schedule your call about your ${data.bedrooms} in ${data.neighborhood}.` : "Pick a window that works."}
						</h3>
					</div>
					<button
						className="appearance-none cursor-pointer text-[22px] text-ink-mute w-8 h-8 grid place-items-center rounded-lg hover:bg-hair hover:text-ink outline-none"
						onClick={onClose}
						aria-label="Close"
						type="button"
					>
						×
					</button>
				</div>
				<div className="px-7 max-sm:px-[22px] pt-2 pb-7 overflow-y-auto">
					{hasContext && (
						<div className="mb-5 py-3.5 px-4 bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] border border-hair rounded-[10px] flex flex-wrap gap-x-5 gap-y-1.5 items-baseline text-[13px]">
							<span className="text-[11px] uppercase tracking-[0.12em] text-ink-mute">From your estimate</span>
							<span className="num text-ink font-medium">${estimate.rentLow.toLocaleString()}–${estimate.rentHigh.toLocaleString()}</span>
							<span className="text-ink-faint">·</span>
							<span className="num text-ink font-medium">{estimate.days} days</span>
							<span className="text-ink-faint">·</span>
							<span className="num text-ink-soft">List by {estimate.listDate}</span>
						</div>
					)}

					{useCalEmbed ? (
						<div className="rounded-[10px] overflow-hidden border border-hair bg-[var(--bg,#FAF8F3)]">
							<iframe
								title="Book a call"
								src={`https://cal.com/${calUser}/${calEvent}?embed=true&hide_event_type_details=1&theme=light`}
								className="w-full h-[560px] max-sm:h-[640px] block"
								loading="lazy"
							/>
						</div>
					) : sent ? (
						<div className="py-8 text-center">
							<div className="text-[15px] text-ink-soft mb-1">Got it.</div>
							<div className="text-[22px] font-medium tracking-[-0.02em] mb-2">We&apos;ll be in touch within one business day.</div>
							<p className="text-[14px] text-ink-mute max-w-[40ch] mx-auto">
								Sasha will reach out at {data.email} to confirm a time.
							</p>
						</div>
					) : (
						<>
							<p className="text-[15px] text-ink-soft max-w-[50ch] mb-6">
								A short calendar invite, no deck, no pitch. Fifteen minutes on your unit specifically — pricing, photography window, and the exact 21-day calendar.
							</p>
							<div className="flex flex-col gap-2 mb-[18px]">
								<label className="text-[12px] uppercase tracking-[0.12em] text-ink-mute font-medium">Your name</label>
								<input
									className="h-12 px-3.5 rounded-lg border border-hair-strong bg-[var(--bg,#FAF8F3)] text-ink font-sans text-[16px] outline-none transition-colors duration-150 focus:border-ink"
									value={data.name}
									onChange={(e) => onChange("name", e.target.value)}
									placeholder="Full name"
								/>
							</div>
							<div className="flex flex-col gap-2 mb-[18px]">
								<label className="text-[12px] uppercase tracking-[0.12em] text-ink-mute font-medium">Email</label>
								<input
									type="email"
									className="h-12 px-3.5 rounded-lg border border-hair-strong bg-[var(--bg,#FAF8F3)] text-ink font-sans text-[16px] outline-none transition-colors duration-150 focus:border-ink"
									value={data.email}
									onChange={(e) => onChange("email", e.target.value)}
									placeholder="you@domain.com"
								/>
							</div>
							<div className="flex flex-col gap-2 mb-[18px]">
								<label className="text-[12px] uppercase tracking-[0.12em] text-ink-mute font-medium">Preferred time</label>
								<select
									className="h-12 px-3.5 rounded-lg border border-hair-strong bg-[var(--bg,#FAF8F3)] text-ink font-sans text-[16px] outline-none transition-colors duration-150 focus:border-ink"
									value={data.timeWindow}
									onChange={(e) => onChange("timeWindow", e.target.value)}
								>
									<option value="" disabled>Select a window</option>
									<option>Weekdays, mornings</option>
									<option>Weekdays, afternoons</option>
									<option>Weekday evenings</option>
									<option>Weekend</option>
								</select>
							</div>
							{error && (
								<div className="py-2.5 px-3.5 text-[13px] text-[#a23] bg-[#fde] border border-[#fcb] rounded-lg">
									{error}
								</div>
							)}
						</>
					)}
				</div>
				{!useCalEmbed && !sent && (
					<div className="flex justify-between items-center py-[18px] px-7 max-sm:px-[22px] border-t border-hair bg-[color-mix(in_oklab,var(--bg,#FAF8F3),var(--color-ink)_2%)]">
						<span className="text-[14px] text-ink-mute">We respond within one business day.</span>
						<Button onClick={send} className="h-11 px-[18px] text-[14px]" showArrow disabled={book.isPending}>
							{book.isPending ? "Sending…" : "Send request"}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
