"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { env } from "~/env";
import { Events, track, trackCTA } from "~/lib/analytics";
import {
	estimate as runEstimate,
	TORONTO_AVG_DAYS,
	vacancySavings,
} from "~/lib/estimator";
import {
	EMAIL_GATE_VARIANTS,
	Experiments,
	useExperiment,
} from "~/lib/experiment";
import { BEDROOM_TYPES, comparables, NEIGHBORHOODS } from "~/lib/leases";
import { readAttribution } from "~/lib/referral";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { Button } from "../ui/Button";

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

export function FormModal({
	open,
	onClose,
	mode,
	onBookCall,
	initialData,
}: FormModalProps) {
	const [internalMode, setInternalMode] = useState<"timeline" | "call">(mode);
	const [step, setStep] = useState(0);
	const [dir, setDir] = useState<1 | -1>(1);
	const [data, setData] = useState<FormData>(EMPTY);
	const [resumed, setResumed] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const gateVariant = useExperiment(Experiments.emailGate, EMAIL_GATE_VARIANTS);

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
			const saved =
				typeof window !== "undefined"
					? localStorage.getItem(STORAGE_KEY)
					: null;
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
		track(Events.formStarted, {
			source: initialData ? "prefilled" : didResume ? "resumed" : "fresh",
		});
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
		() =>
			runEstimate({
				bedrooms: data.bedrooms,
				neighborhood: data.neighborhood,
				targetRent: data.targetRent,
			}),
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
			track(Events.leadSubmitted, {
				source: "form",
				days: estimate.days,
				gateVariant,
			});
			track(Events.estimateRevealed, { days: estimate.days });
			advance();
		} catch (e) {
			setError(e instanceof Error ? e.message : "Something went wrong.");
		}
	}, [data, estimate, submit, advance, gateVariant]);

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
				data={data}
				estimate={estimate}
				onChange={set}
				onClose={finish}
				open={open}
			/>
		);
	}

	return (
		<div
			className={cn(
				"pointer-events-none fixed inset-0 z-[80] flex items-center justify-center bg-[color-mix(in_oklab,var(--color-ink),transparent_50%)] p-6 opacity-0 backdrop-blur-[4px] transition-opacity duration-200",
				open && "pointer-events-auto opacity-100",
			)}
			onClick={handleClose}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") handleClose();
			}}
			role="button"
			tabIndex={-1}
		>
			<div
				className={cn(
					"flex max-h-[calc(100vh-48px)] w-[min(680px,100%)] translate-y-2 flex-col overflow-hidden rounded-2xl border border-hair bg-[var(--bg)] text-ink shadow-[0_30px_80px_rgba(0,0,0,0.16)] transition-transform duration-200",
					open && "translate-y-0",
				)}
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
				role="presentation"
			>
				<div className="flex items-baseline justify-between px-7 pt-[22px] pb-1.5 max-sm:px-[22px]">
					<div>
						<div className="flex items-baseline gap-2.5 text-[11px] text-ink-mute uppercase tracking-[0.14em]">
							<span>Leasing timeline · 60 seconds</span>
							<span className="text-ink-faint">·</span>
							<span className="num">
								Step {Math.min(step + 1, STEPS)} of {STEPS}
							</span>
						</div>
					</div>
					<button
						aria-label="Close"
						className="grid h-8 w-8 cursor-pointer appearance-none place-items-center rounded-lg text-[22px] text-ink-mute outline-none hover:bg-hair hover:text-ink"
						onClick={handleClose}
						type="button"
					>
						×
					</button>
				</div>

				<div className="mt-3 px-7 max-sm:px-[22px]">
					<div className="h-[3px] w-full overflow-hidden rounded-full bg-hair">
						<motion.div
							animate={{ width: `${((step + 1) / STEPS) * 100}%` }}
							className="h-full bg-ink"
							initial={false}
							transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
						/>
					</div>
				</div>

				{step > 0 &&
					step < STEPS - 1 &&
					!(step === 2 && gateVariant === "enriched") && (
						<LivePreview blurred={step < 2} data={data} estimate={estimate} />
					)}

				{resumed && step === 0 && (
					<div className="mx-7 mt-4 flex items-center justify-between gap-3 rounded-lg border border-[color-mix(in_oklab,var(--accent),transparent_75%)] bg-[color-mix(in_oklab,var(--accent),transparent_92%)] px-3.5 py-2.5 max-sm:mx-[22px]">
						<span className="text-[13px] text-ink-soft">
							Resumed from your last session.
						</span>
						<button
							className="cursor-pointer text-[12px] text-ink-mute underline hover:text-ink"
							onClick={() => {
								try {
									localStorage.removeItem(STORAGE_KEY);
								} catch {}
								setData(EMPTY);
								setStep(0);
								setResumed(false);
							}}
							type="button"
						>
							Start over
						</button>
					</div>
				)}

				<div className="relative flex-1 overflow-y-auto">
					<AnimatePresence custom={dir} initial={false} mode="wait">
						<motion.div
							animate="center"
							className="px-7 pt-6 pb-7 max-sm:px-[22px]"
							custom={dir}
							exit="exit"
							initial="enter"
							key={step}
							transition={{ duration: 0.32, ease: [0.21, 0.47, 0.32, 0.98] }}
							variants={slideVariants}
						>
							{step === 0 && (
								<StepLocation data={data} onAdvance={advance} onSet={set} />
							)}
							{step === 1 && (
								<StepUnit data={data} onAdvance={advance} onSet={set} />
							)}
							{step === 2 && (
								<StepEmailGate
									data={data}
									error={error}
									estimate={estimate}
									onSet={set}
									onSubmit={submitEmail}
									pending={submit.isPending}
									variant={gateVariant}
								/>
							)}
							{step === 3 && (
								<StepResult
									comps={comps}
									data={data}
									estimate={estimate}
									onBook={() => {
										trackCTA("form-result", "call");
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
									savings={savings}
								/>
							)}
						</motion.div>
					</AnimatePresence>
				</div>

				{step < STEPS - 1 && (
					<div className="flex items-center justify-between border-hair border-t bg-[color-mix(in_oklab,var(--bg,#FAF8F3),var(--color-ink)_2%)] px-7 py-[16px] max-sm:px-[22px]">
						<button
							className="cursor-pointer appearance-none text-[14px] text-ink-mute transition-opacity hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
							disabled={step === 0}
							onClick={back}
							type="button"
						>
							← Back
						</button>
						<div className="flex items-center gap-3">
							<span className="text-[12px] text-ink-faint max-sm:hidden">
								Press <kbd className="num text-ink-mute">Enter</kbd> to continue
							</span>
							{step === 2 ? (
								<Button
									className="h-11 px-[18px] text-[14px]"
									disabled={submit.isPending}
									onClick={submitEmail}
									showArrow
								>
									{submit.isPending ? "Sending…" : "Reveal my estimate"}
								</Button>
							) : (
								<Button
									className="h-11 px-[18px] text-[14px]"
									onClick={advance}
									showArrow
								>
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
		<div className="mx-7 mt-4 flex items-baseline justify-between gap-3 rounded-lg border border-hair bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] px-3.5 py-2.5 max-sm:mx-[22px]">
			<div className="flex items-baseline gap-2.5 text-[12px] text-ink-mute uppercase tracking-[0.1em]">
				<span>Estimate so far</span>
				<span className="text-ink-faint">·</span>
				<span className="text-ink normal-case tracking-normal">
					{data.bedrooms} in {data.neighborhood}
				</span>
			</div>
			<div
				aria-hidden={blurred}
				className={cn(
					"flex items-baseline gap-2.5 text-[13px] transition-all duration-300",
					blurred && "select-none blur-[5px]",
				)}
			>
				<span className="num font-medium text-ink">
					${estimate.rentLow.toLocaleString()}–$
					{estimate.rentHigh.toLocaleString()}
				</span>
				<span className="text-ink-faint">·</span>
				<span className="num font-medium text-ink">{estimate.days}d</span>
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
			<h3 className="mb-1.5 max-w-[22ch] font-medium text-[26px] tracking-[-0.02em]">
				Where&apos;s the unit?
			</h3>
			<p className="mb-6 max-w-[50ch] text-[15px] text-ink-soft">
				We use building-level comparables, so the neighborhood matters more than
				the street address.
			</p>

			<div className="mb-[18px] flex flex-col gap-2">
				<div className="font-medium text-[12px] text-ink-mute uppercase tracking-[0.12em]">
					Neighborhood
				</div>
				<div className="grid grid-cols-3 gap-2 max-sm:grid-cols-2">
					{NEIGHBORHOODS.map((n) => (
						<button
							className={cn(
								"grid min-h-[48px] cursor-pointer appearance-none place-items-center rounded-lg border border-hair-strong px-3 py-2 text-center text-[14px] transition-colors hover:border-ink",
								data.neighborhood === n &&
									"border-ink bg-[color-mix(in_oklab,var(--color-ink),transparent_96%)]",
							)}
							key={n}
							onClick={() => {
								onSet("neighborhood", n);
								setTimeout(onAdvance, 140);
							}}
							type="button"
						>
							{n}
						</button>
					))}
				</div>
			</div>
			<div className="flex flex-col gap-2">
				<div className="font-medium text-[12px] text-ink-mute uppercase tracking-[0.12em]">
					Building or address (optional)
				</div>
				<input
					className="h-12 rounded-lg border border-hair-strong bg-[var(--bg,#FAF8F3)] px-3.5 font-sans text-[16px] text-ink outline-none transition-colors duration-150 focus:border-ink"
					onChange={(e) => onSet("address", e.target.value)}
					placeholder="e.g. Ice Condos, or 38 Niagara St"
					value={data.address}
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
			<h3 className="mb-1.5 max-w-[22ch] font-medium text-[26px] tracking-[-0.02em]">
				What kind of unit?
			</h3>
			<p className="mb-6 max-w-[50ch] text-[15px] text-ink-soft">
				Bedroom count moves time-to-lease more than any other input.
			</p>

			<div className="mb-[18px] flex flex-col gap-2">
				<div className="font-medium text-[12px] text-ink-mute uppercase tracking-[0.12em]">
					Bedrooms
				</div>
				<div className="grid grid-cols-3 gap-2 max-sm:grid-cols-2">
					{BEDROOM_TYPES.map((b) => (
						<button
							className={cn(
								"grid h-12 cursor-pointer appearance-none place-items-center rounded-lg border border-hair-strong text-center text-[15px] transition-colors hover:border-ink",
								data.bedrooms === b &&
									"border-ink bg-[color-mix(in_oklab,var(--color-ink),transparent_96%)]",
							)}
							key={b}
							onClick={() => {
								onSet("bedrooms", b);
								setTimeout(onAdvance, 140);
							}}
							type="button"
						>
							{b}
						</button>
					))}
				</div>
			</div>
			<div className="mb-[18px] flex flex-col gap-2">
				<div className="font-medium text-[12px] text-ink-mute uppercase tracking-[0.12em]">
					Target rent (optional)
				</div>
				<input
					className="h-12 rounded-lg border border-hair-strong bg-[var(--bg,#FAF8F3)] px-3.5 font-sans text-[16px] text-ink outline-none transition-colors duration-150 focus:border-ink"
					inputMode="numeric"
					onChange={(e) => onSet("targetRent", e.target.value)}
					placeholder="e.g. $2,800"
					value={data.targetRent}
				/>
			</div>
			<div className="flex flex-col gap-2">
				<div className="font-medium text-[12px] text-ink-mute uppercase tracking-[0.12em]">
					Move-in window
				</div>
				<div className="grid grid-cols-3 gap-2 max-sm:grid-cols-2">
					{MOVE_OPTIONS.map((o) => (
						<button
							className={cn(
								"grid h-12 cursor-pointer appearance-none place-items-center rounded-lg border border-hair-strong text-center text-[15px] transition-colors hover:border-ink",
								data.move === o.k &&
									"border-ink bg-[color-mix(in_oklab,var(--color-ink),transparent_96%)]",
							)}
							key={o.k}
							onClick={() => onSet("move", o.k)}
							type="button"
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
	onSubmit: _onSubmit,
	pending: _pending,
	error,
	variant,
	estimate,
}: {
	data: FormData;
	onSet: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
	onSubmit: () => void;
	pending: boolean;
	error: string | null;
	variant: "control" | "enriched";
	estimate: ReturnType<typeof runEstimate>;
}) {
	if (variant === "enriched") {
		return (
			<div>
				<div className="mb-2 text-[11px] text-accent uppercase tracking-[0.14em]">
					Your estimate · ready
				</div>
				<h3 className="mb-1.5 max-w-[26ch] font-medium text-[26px] tracking-[-0.02em]">
					{data.bedrooms} in {data.neighborhood} — here&apos;s the snapshot.
				</h3>
				<p className="mb-5 max-w-[52ch] text-[15px] text-ink-soft">
					Enter your email to send the full report with three comparables and
					your vacancy-savings math.
				</p>

				<div className="mb-6 grid grid-cols-2 gap-2.5 max-sm:grid-cols-1">
					<div className="rounded-[10px] border border-hair bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] px-4 py-3.5">
						<div className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.12em]">
							Days to lease
						</div>
						<div className="num mt-1 font-medium text-[24px] text-accent">
							{estimate.days}{" "}
							<span className="text-[14px] text-ink-mute">days</span>
						</div>
					</div>
					<div className="rounded-[10px] border border-hair bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] px-4 py-3.5">
						<div className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.12em]">
							Suggested rent
						</div>
						<div className="num mt-1 font-medium text-[20px]">
							${estimate.rentLow.toLocaleString()}–$
							{estimate.rentHigh.toLocaleString()}
						</div>
					</div>
					<div className="rounded-[10px] border border-hair bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] px-4 py-3.5">
						<div className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.12em]">
							List by
						</div>
						<div className="num mt-1 font-medium text-[20px]">
							{estimate.listDate}
						</div>
					</div>
					<div className="rounded-[10px] border border-hair bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] px-4 py-3.5">
						<div className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.12em]">
							Signed by
						</div>
						<div className="num mt-1 font-medium text-[20px]">
							{estimate.leaseBy}
						</div>
					</div>
				</div>

				<div className="mb-[14px] flex flex-col gap-2">
					<div className="font-medium text-[12px] text-ink-mute uppercase tracking-[0.12em]">
						Email · for the full report
					</div>
					<input
						autoComplete="email"
						className="h-12 rounded-lg border border-hair-strong bg-[var(--bg,#FAF8F3)] px-3.5 font-sans text-[16px] text-ink outline-none transition-colors duration-150 focus:border-ink"
						onChange={(e) => onSet("email", e.target.value)}
						placeholder="you@domain.com"
						type="email"
						value={data.email}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<div className="font-medium text-[12px] text-ink-mute uppercase tracking-[0.12em]">
						Name (optional)
					</div>
					<input
						autoComplete="name"
						className="h-12 rounded-lg border border-hair-strong bg-[var(--bg,#FAF8F3)] px-3.5 font-sans text-[16px] text-ink outline-none transition-colors duration-150 focus:border-ink"
						onChange={(e) => onSet("name", e.target.value)}
						placeholder="First name"
						value={data.name}
					/>
				</div>

				{error && (
					<div className="mt-4 rounded-lg border border-[#fcb] bg-[#fde] px-3.5 py-2.5 text-[#a23] text-[13px]">
						{error}
					</div>
				)}

				<p className="mt-4 max-w-[56ch] text-[12px] text-ink-mute">
					No marketing emails. No follow-up unless you reply.
				</p>
			</div>
		);
	}

	return (
		<div>
			<div className="mb-2 text-[11px] text-ink-mute uppercase tracking-[0.14em]">
				One last step
			</div>
			<h3 className="mb-1.5 max-w-[26ch] font-medium text-[26px] tracking-[-0.02em]">
				Where should we send your 21-day plan?
			</h3>
			<p className="mb-6 max-w-[52ch] text-[15px] text-ink-soft">
				You&apos;ll see rent range, days, signed-by date, and three anonymized
				comparables. No spam, no follow-up unless you reply.
			</p>

			<div className="mb-[18px] flex flex-col gap-2">
				<div className="font-medium text-[12px] text-ink-mute uppercase tracking-[0.12em]">
					Email
				</div>
				<input
					autoComplete="email"
					className="h-12 rounded-lg border border-hair-strong bg-[var(--bg,#FAF8F3)] px-3.5 font-sans text-[16px] text-ink outline-none transition-colors duration-150 focus:border-ink"
					onChange={(e) => onSet("email", e.target.value)}
					placeholder="you@domain.com"
					type="email"
					value={data.email}
				/>
			</div>
			<div className="flex flex-col gap-2">
				<div className="font-medium text-[12px] text-ink-mute uppercase tracking-[0.12em]">
					Name (optional)
				</div>
				<input
					autoComplete="name"
					className="h-12 rounded-lg border border-hair-strong bg-[var(--bg,#FAF8F3)] px-3.5 font-sans text-[16px] text-ink outline-none transition-colors duration-150 focus:border-ink"
					onChange={(e) => onSet("name", e.target.value)}
					placeholder="First name"
					value={data.name}
				/>
			</div>

			{error && (
				<div className="mt-4 rounded-lg border border-[#fcb] bg-[#fde] px-3.5 py-2.5 text-[#a23] text-[13px]">
					{error}
				</div>
			)}

			<p className="mt-4 max-w-[56ch] text-[12px] text-ink-mute">
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
			<div className="mb-2 text-[11px] text-accent uppercase tracking-[0.14em]">
				Estimate sent · check your inbox
			</div>
			<h3 className="mb-1 font-medium text-[26px] tracking-[-0.02em]">
				{data.bedrooms} in {data.neighborhood}
			</h3>
			<p className="mb-5 text-[15px] text-ink-soft">
				Based on comparable units leased in the last 90 days. Numbers refresh
				quarterly.
			</p>

			<div className="flex items-baseline justify-between border-hair border-b py-[18px]">
				<div>
					<div className="font-medium text-[12px] text-ink-mute uppercase tracking-[0.12em]">
						Estimated days to lease
					</div>
					<div className="mt-1 text-[13px] text-ink-mute">
						Average across recent comparables.
					</div>
				</div>
				<div className="num font-medium text-[28px] text-accent tracking-[-0.02em]">
					{estimate.days}{" "}
					<span className="text-[16px] text-ink-mute">days</span>
				</div>
			</div>
			<div className="flex items-baseline justify-between border-hair border-b py-[18px]">
				<div>
					<div className="font-medium text-[12px] text-ink-mute uppercase tracking-[0.12em]">
						Suggested rent range
					</div>
					<div className="mt-1 text-[13px] text-ink-mute">
						Within ±3% of recent comparables.
					</div>
				</div>
				<div className="num font-medium text-[28px] tracking-[-0.02em]">
					${estimate.rentLow.toLocaleString()}–$
					{estimate.rentHigh.toLocaleString()}
				</div>
			</div>
			<div className="flex items-baseline justify-between border-hair border-b py-[18px]">
				<div>
					<div className="font-medium text-[12px] text-ink-mute uppercase tracking-[0.12em]">
						Recommended list date
					</div>
					<div className="mt-1 text-[13px] text-ink-mute">
						Allows two days for photography & pricing.
					</div>
				</div>
				<div className="num font-medium text-[28px] tracking-[-0.02em]">
					{estimate.listDate}
				</div>
			</div>
			<div className="flex items-baseline justify-between py-[18px]">
				<div>
					<div className="font-medium text-[12px] text-ink-mute uppercase tracking-[0.12em]">
						Likely signed by
					</div>
					<div className="mt-1 text-[13px] text-ink-mute">
						Inside the 21-day guarantee window.
					</div>
				</div>
				<div className="num font-medium text-[28px] tracking-[-0.02em]">
					{estimate.leaseBy}
				</div>
			</div>

			{anchor && (
				<div className="mt-4 rounded-[10px] border border-hair bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] px-5 py-4">
					<div className="mb-1.5 font-medium text-[11px] text-ink-mute uppercase tracking-[0.12em]">
						Your unit vs. the most recent comparable
					</div>
					<div className="text-[15px] text-ink leading-[1.5]">
						A{" "}
						<span className="font-medium text-ink">
							{anchor.u} in {anchor.n}
						</span>{" "}
						signed for{" "}
						<span className="num font-medium text-ink">
							${anchor.leased.toLocaleString()}
						</span>{" "}
						in{" "}
						<span className="num font-medium text-ink">{anchor.days} days</span>{" "}
						on {anchor.signed}. Same playbook, applied to yours.
					</div>
				</div>
			)}

			{savings.daysSaved > 0 && (
				<div className="mt-3 rounded-[10px] border border-[color-mix(in_oklab,var(--accent),transparent_75%)] bg-[color-mix(in_oklab,var(--accent),transparent_92%)] px-5 py-4">
					<div className="mb-1.5 font-medium text-[11px] text-accent uppercase tracking-[0.12em]">
						Why this matters
					</div>
					<div className="text-[15px] text-ink leading-[1.5]">
						<span className="num font-medium text-ink">
							{savings.daysSaved} days
						</span>{" "}
						faster than the Toronto average of{" "}
						<span className="num">{TORONTO_AVG_DAYS}</span> days. At $107/day,
						that&apos;s
						<span className="num font-medium text-ink">
							{" "}
							${savings.dollarsSaved.toLocaleString()}
						</span>{" "}
						of vacancy you don&apos;t pay.
					</div>
				</div>
			)}

			{comps.length > 0 && (
				<div className="mt-5">
					<div className="mb-3 font-medium text-[11px] text-ink-mute uppercase tracking-[0.12em]">
						Comparable recent leases
					</div>
					<div className="grid grid-cols-3 gap-2 max-sm:grid-cols-1">
						{comps.map((c) => (
							<div
								className="rounded-[10px] border border-hair bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] p-3.5"
								key={`${c.n}-${c.u}-${c.signed}`}
							>
								<div className="mb-1 text-[11px] text-ink-mute uppercase tracking-[0.12em]">
									{c.n} · {c.u}
								</div>
								<div className="num font-medium text-[20px]">
									${c.leased.toLocaleString()}
								</div>
								<div className="num mt-0.5 text-[12px] text-ink-mute">
									{c.days} days · {c.signed}
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{estimate.over > 0 && (
				<div className="mt-4 rounded-[10px] bg-[color-mix(in_oklab,var(--ink),transparent_94%)] px-4 py-3.5 text-[14px] text-ink-soft">
					Heads-up: your target rent is above our suggested range. We can still
					list it — the guarantee terms change above 5% over our recommendation.
				</div>
			)}

			<div className="mt-6 flex flex-wrap items-center gap-3">
				<Button className="px-5 text-[15px]" onClick={onBook} showArrow>
					Book your 15-minute kickoff
				</Button>
				<Button className="px-5 text-[15px]" onClick={onClose} variant="ghost">
					Close
				</Button>
				<button
					className="ml-1 cursor-pointer text-[13px] text-ink-mute underline hover:text-ink"
					onClick={onRestart}
					type="button"
				>
					Start over
				</button>
			</div>
			<p className="mt-3.5 max-w-[56ch] text-[13px] text-ink-mute">
				The call covers your unit specifically — pricing, photography window,
				and the exact 21-day calendar. No pitch deck.
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
				"pointer-events-none fixed inset-0 z-[80] flex items-center justify-center bg-[color-mix(in_oklab,var(--color-ink),transparent_50%)] p-6 opacity-0 backdrop-blur-[4px] transition-opacity duration-200",
				open && "pointer-events-auto opacity-100",
			)}
			onClick={onClose}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") onClose();
			}}
			role="button"
			tabIndex={-1}
		>
			<div
				className={cn(
					"flex max-h-[calc(100vh-48px)] w-[min(720px,100%)] translate-y-2 flex-col overflow-hidden rounded-2xl border border-hair bg-[var(--bg)] text-ink shadow-[0_30px_80px_rgba(0,0,0,0.16)] transition-transform duration-200",
					open && "translate-y-0",
				)}
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
				role="presentation"
			>
				<div className="flex items-baseline justify-between px-7 pt-[26px] pb-1.5 max-sm:px-[22px]">
					<div>
						<div className="text-[11px] text-ink-mute uppercase tracking-[0.14em]">
							15-minute kickoff
						</div>
						<h3 className="mt-2 max-w-[24ch] font-medium text-[26px] tracking-[-0.02em]">
							{hasContext
								? `Schedule your call about your ${data.bedrooms} in ${data.neighborhood}.`
								: "Pick a window that works."}
						</h3>
					</div>
					<button
						aria-label="Close"
						className="grid h-8 w-8 cursor-pointer appearance-none place-items-center rounded-lg text-[22px] text-ink-mute outline-none hover:bg-hair hover:text-ink"
						onClick={onClose}
						type="button"
					>
						×
					</button>
				</div>
				<div className="overflow-y-auto px-7 pt-2 pb-7 max-sm:px-[22px]">
					{hasContext && (
						<div className="mb-5 flex flex-wrap items-baseline gap-x-5 gap-y-1.5 rounded-[10px] border border-hair bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] px-4 py-3.5 text-[13px]">
							<span className="text-[11px] text-ink-mute uppercase tracking-[0.12em]">
								From your estimate
							</span>
							<span className="num font-medium text-ink">
								${estimate.rentLow.toLocaleString()}–$
								{estimate.rentHigh.toLocaleString()}
							</span>
							<span className="text-ink-faint">·</span>
							<span className="num font-medium text-ink">
								{estimate.days} days
							</span>
							<span className="text-ink-faint">·</span>
							<span className="num text-ink-soft">
								List by {estimate.listDate}
							</span>
						</div>
					)}

					{useCalEmbed ? (
						<div className="overflow-hidden rounded-[10px] border border-hair bg-[var(--bg,#FAF8F3)]">
							<iframe
								className="block h-[560px] w-full max-sm:h-[640px]"
								loading="lazy"
								src={`https://cal.com/${calUser}/${calEvent}?embed=true&hide_event_type_details=1&theme=light`}
								title="Book a call"
							/>
						</div>
					) : sent ? (
						<div className="py-8 text-center">
							<div className="mb-1 text-[15px] text-ink-soft">Got it.</div>
							<div className="mb-2 font-medium text-[22px] tracking-[-0.02em]">
								We&apos;ll be in touch within one business day.
							</div>
							<p className="mx-auto max-w-[40ch] text-[14px] text-ink-mute">
								Sasha will reach out at {data.email} to confirm a time.
							</p>
						</div>
					) : (
						<>
							<p className="mb-6 max-w-[50ch] text-[15px] text-ink-soft">
								A short calendar invite, no deck, no pitch. Fifteen minutes on
								your unit specifically — pricing, photography window, and the
								exact 21-day calendar.
							</p>
							<div className="mb-[18px] flex flex-col gap-2">
								<div className="font-medium text-[12px] text-ink-mute uppercase tracking-[0.12em]">
									Your name
								</div>
								<input
									className="h-12 rounded-lg border border-hair-strong bg-[var(--bg,#FAF8F3)] px-3.5 font-sans text-[16px] text-ink outline-none transition-colors duration-150 focus:border-ink"
									onChange={(e) => onChange("name", e.target.value)}
									placeholder="Full name"
									value={data.name}
								/>
							</div>
							<div className="mb-[18px] flex flex-col gap-2">
								<div className="font-medium text-[12px] text-ink-mute uppercase tracking-[0.12em]">
									Email
								</div>
								<input
									className="h-12 rounded-lg border border-hair-strong bg-[var(--bg,#FAF8F3)] px-3.5 font-sans text-[16px] text-ink outline-none transition-colors duration-150 focus:border-ink"
									onChange={(e) => onChange("email", e.target.value)}
									placeholder="you@domain.com"
									type="email"
									value={data.email}
								/>
							</div>
							<div className="mb-[18px] flex flex-col gap-2">
								<div className="font-medium text-[12px] text-ink-mute uppercase tracking-[0.12em]">
									Preferred time
								</div>
								<select
									className="h-12 rounded-lg border border-hair-strong bg-[var(--bg,#FAF8F3)] px-3.5 font-sans text-[16px] text-ink outline-none transition-colors duration-150 focus:border-ink"
									onChange={(e) => onChange("timeWindow", e.target.value)}
									value={data.timeWindow}
								>
									<option disabled value="">
										Select a window
									</option>
									<option>Weekdays, mornings</option>
									<option>Weekdays, afternoons</option>
									<option>Weekday evenings</option>
									<option>Weekend</option>
								</select>
							</div>
							{error && (
								<div className="rounded-lg border border-[#fcb] bg-[#fde] px-3.5 py-2.5 text-[#a23] text-[13px]">
									{error}
								</div>
							)}
						</>
					)}
				</div>
				{!useCalEmbed && !sent && (
					<div className="flex items-center justify-between border-hair border-t bg-[color-mix(in_oklab,var(--bg,#FAF8F3),var(--color-ink)_2%)] px-7 py-[18px] max-sm:px-[22px]">
						<span className="text-[14px] text-ink-mute">
							We respond within one business day.
						</span>
						<Button
							className="h-11 px-[18px] text-[14px]"
							disabled={book.isPending}
							onClick={send}
							showArrow
						>
							{book.isPending ? "Sending…" : "Send request"}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
