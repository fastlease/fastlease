"use client";

import { motion } from "framer-motion";
import { cn } from "~/lib/utils";
import { Reveal } from "../ui/Reveal";

const MILESTONES = [
	{ day: 1, label: "Listing live", phase: 1 },
	{ day: 3, label: "Photography complete", phase: 1 },
	{ day: 5, label: "First showings", phase: 2 },
	{ day: 11, label: "Applications in", phase: 2 },
	{ day: 16, label: "Screening complete", phase: 3 },
	{ day: 21, label: "Lease signed", phase: 3 },
];

const PHASES = [
	{
		id: 1,
		name: "Listed and live",
		range: [1, 3],
		note: "Pricing analysis, photography, syndication.",
	},
	{
		id: 2,
		name: "Qualified showings",
		range: [4, 14],
		note: "Inbound filtering, scheduled tours, inquiry tracking.",
	},
	{
		id: 3,
		name: "Screened and signed",
		range: [15, 21],
		note: "Application review, verification, lease execution.",
	},
];

const TODAY = 13;

export function TimelineSection({
	treatment = "calendar",
}: {
	treatment?: "calendar" | "beam" | "gantt";
}) {
	return (
		<section className="section-pad" id="timeline">
			<div className="wrap">
				<Reveal className="mb-7 flex items-center gap-4">
					<span className="num text-[12px] text-ink-mute uppercase tracking-[0.14em]">
						01
					</span>
					<span className="h-[1px] flex-1 bg-hair" />
					<span className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.14em]">
						The 21-day timeline
					</span>
				</Reveal>

				<div className="mb-14 grid grid-cols-2 items-end gap-12 max-md:mb-6 max-md:grid-cols-1 max-md:gap-4">
					<Reveal as="h2" className="max-w-[22ch]">
						The process, made visible.
					</Reveal>
					<Reveal
						as="p"
						className="max-w-[52ch] text-[17px] text-ink-soft leading-[1.55]"
					>
						Most leasing services sell their best effort. We sell a date.
						Here&apos;s what the twenty-one days actually look like — and where
						the unit below this paragraph sits today.
					</Reveal>
				</div>

				<Reveal className="relative">
					{treatment === "calendar" && <TimelineCalendar />}
					{treatment === "beam" && <TimelineBeam />}
					{treatment === "gantt" && <TimelineGantt />}

					{/* Mobile List View (rendered on mobile, hidden on desktop) */}
					<div className="relative mt-10 ml-[18px] hidden flex-col border-hair border-l pl-[22px] max-md:flex">
						{MILESTONES.map((m, _i) => (
							<div
								className={cn(
									"relative py-[14px] pb-[22px]",
									m.day === TODAY && "is-today",
								)}
								key={m.day}
							>
								<div
									className={cn(
										"absolute top-[22px] left-[-28px] h-[11px] w-[11px] rounded-full border-2 border-ink-soft bg-paper",
										m.day === TODAY && "border-accent bg-accent",
									)}
								/>
								<div className="mb-2 text-[11px] text-ink-mute uppercase tracking-[0.14em]">
									Phase 0{m.phase}
								</div>
								<div className="num text-[13px] text-ink-mute tracking-[0.04em]">
									Day {m.day}
								</div>
								<div className="mt-0.5 font-medium text-[17px] text-ink">
									{m.label}
								</div>
							</div>
						))}
					</div>
				</Reveal>

				<TimelineLegend />
			</div>
		</section>
	);
}

function TimelineCalendar() {
	const days = Array.from({ length: 21 }, (_, i) => i + 1);
	const milestoneByDay = Object.fromEntries(MILESTONES.map((m) => [m.day, m]));

	return (
		<div className="relative pt-14 pb-3 max-md:hidden">
			<div className="mb-4 flex justify-between">
				<span className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.14em]">
					Day 01
				</span>
				<span className="text-right font-medium text-[11px] text-ink-mute uppercase tracking-[0.14em]">
					Day 21
				</span>
			</div>

			<div className="relative grid grid-cols-[repeat(21,1fr)] border-hair border-t">
				{days.map((d) => {
					const ms = milestoneByDay[d];
					const isToday = d === TODAY;
					return (
						<motion.div
							className={cn(
								"relative h-14 border-hair border-r",
								d === 1 && "border-l",
							)}
							initial={{ opacity: 0, y: 6 }}
							key={d}
							transition={{ delay: d * 0.03 }}
							viewport={{ once: true }}
							whileInView={{ opacity: 1, y: 0 }}
						>
							<div className="absolute inset-x-0 top-0 h-2 border-hair border-b" />
							<div
								className={cn(
									"num absolute inset-x-0 top-3 text-center text-[11px] tracking-[0.04em]",
									isToday ? "font-medium text-accent" : "text-ink-mute",
									ms && "font-medium text-ink",
								)}
							>
								{d.toString().padStart(2, "0")}
							</div>

							{ms && (
								<div className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
									<div
										className={cn(
											"mx-auto w-[1px] bg-ink-faint",
											[1, 5, 16].includes(d) ? "h-6" : "h-[58px]",
										)}
									/>
									<div className="mt-1.5 text-[12px] text-ink-soft">
										{ms.label}
									</div>
								</div>
							)}

							{isToday && (
								<div className="absolute top-[-62px] left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center">
									<div className="mb-1.5 whitespace-nowrap font-medium text-[11px] text-accent uppercase tracking-[0.12em]">
										Sample unit · today
									</div>
									<div className="h-2.5 w-2.5 animate-pulse-once rounded-full bg-accent shadow-[0_0_0_4px_rgba(184,85,58,0.22)]" />
								</div>
							)}
						</motion.div>
					);
				})}
			</div>

			<div className="relative mt-[140px] h-[70px]">
				{PHASES.map((p) => {
					const [a, b] = p.range as [number, number];
					const left = ((a - 1) / 21) * 100;
					const width = ((b - a + 1) / 21) * 100;
					return (
						<div
							className="absolute top-0 pr-3"
							key={p.id}
							style={{ left: `${left}%`, width: `${width}%` }}
						>
							<div
								className={cn(
									"h-1 rounded-[2px]",
									p.id === 2
										? "bg-accent opacity-100"
										: "bg-ink opacity-[0.68]",
								)}
							/>
							<div className="mt-3.5 font-medium text-[15px] text-ink">
								{p.name}
							</div>
							<div className="num mt-0.5 text-[12px] text-ink-mute tracking-[0.04em]">
								Days {a}
								{a === b ? "" : `–${b}`}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

function TimelineBeam() {
	return (
		<div className="relative pt-[120px] pb-6 max-md:hidden">
			<div className="relative mt-4 flex h-[84px]">
				{PHASES.map((p) => {
					const [a, b] = p.range as [number, number];
					const left = ((a - 1) / 21) * 100;
					const width = ((b - a + 1) / 21) * 100;
					return (
						<div
							className={cn(
								"absolute top-6 h-9 rounded-1",
								p.id === 1 && "bg-[color-mix(in_oklab,var(--ink),white_88%)]",
								p.id === 2 &&
									"bg-[color-mix(in_oklab,var(--accent),white_32%)]",
								p.id === 3 && "bg-[color-mix(in_oklab,var(--ink),white_78%)]",
							)}
							key={p.id}
							style={{ left: `${left}%`, width: `${width}%` }}
						>
							<div className="absolute top-full left-0 mt-3 flex flex-col gap-0.5">
								<span className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.14em]">
									Phase 0{p.id}
								</span>
								<span className="font-medium text-[15px]">{p.name}</span>
							</div>
						</div>
					);
				})}
				<div
					className="absolute top-[-20px] bottom-[-20px] z-[3]"
					style={{ left: `${((TODAY - 0.5) / 21) * 100}%` }}
				>
					<div className="absolute inset-y-0 w-[1px] bg-accent" />
					<div className="absolute top-11 left-[-5px] h-[11px] w-[11px] animate-pulse-once rounded-full bg-accent shadow-[0_0_0_5px_rgba(184,85,58,0.2)]" />
					<div className="absolute bottom-[-28px] left-2 whitespace-nowrap font-medium text-[12px] text-accent">
						<span className="num">Day {TODAY}</span> · sample unit
					</div>
				</div>
			</div>

			<div className="absolute top-[180px] right-0 left-0 mt-2 h-[1px] bg-hair" />

			<div className="absolute top-[-84px] right-0 left-0 h-[90px]">
				{MILESTONES.map((m, i) => (
					<motion.div
						className="absolute top-0 -translate-x-1/2 text-center"
						initial={{ opacity: 0 }}
						key={m.day}
						style={{ left: `${((m.day - 0.5) / 21) * 100}%` }}
						transition={{ delay: i * 0.1 }}
						viewport={{ once: true }}
						whileInView={{ opacity: 1 }}
					>
						<div
							className={cn(
								"mx-auto w-[1px] bg-ink-faint",
								[1, 5, 16].includes(m.day) ? "h-6" : "h-[60px]",
							)}
						/>
						<div className="num mt-1 text-[11px] text-ink-mute tracking-[0.04em]">
							Day {m.day}
						</div>
						<div className="mt-0.5 whitespace-nowrap text-[12px] text-ink-soft">
							{m.label}
						</div>
					</motion.div>
				))}
			</div>
		</div>
	);
}

function TimelineGantt() {
	return (
		<div className="relative py-3 pb-14 [--meta-w:220px] max-md:hidden">
			<div className="pointer-events-none absolute inset-0 bottom-14 ml-[var(--meta-w)] grid grid-cols-[repeat(21,1fr)] border-hair border-y">
				{Array.from({ length: 21 }, (_, i) => i + 1).map((d) => (
					<div className="relative border-hair border-r first:border-l" key={d}>
						{[1, 7, 14, 21].includes(d) && (
							<span className="num absolute top-[-22px] left-0 -translate-x-1/2 text-[11px] text-ink-mute tracking-[0.04em]">
								{d.toString().padStart(2, "0")}
							</span>
						)}
					</div>
				))}
			</div>

			<div className="relative flex flex-col gap-3.5 pt-[30px]">
				{PHASES.map((p, idx) => {
					const [a, b] = p.range as [number, number];
					const left = ((a - 1) / 21) * 100;
					const width = ((b - a + 1) / 21) * 100;
					return (
						<motion.div
							className="grid grid-cols-[var(--meta-w)_1fr] items-center"
							initial={{ opacity: 0, x: -8 }}
							key={p.id}
							transition={{ delay: idx * 0.1 }}
							viewport={{ once: true }}
							whileInView={{ opacity: 1, x: 0 }}
						>
							<div className="flex flex-col gap-0.5 pr-4">
								<span className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.14em]">
									Phase 0{p.id}
								</span>
								<span className="font-medium text-[15px]">{p.name}</span>
							</div>
							<div className="relative h-9">
								<div
									className={cn(
										"absolute top-1.5 flex h-6 items-center rounded-[3px] px-[10px] text-[11px] text-ink tracking-[0.04em]",
										p.id === 1 &&
											"bg-[color-mix(in_oklab,var(--ink),white_88%)]",
										p.id === 2 &&
											"bg-[color-mix(in_oklab,var(--accent),white_35%)]",
										p.id === 3 &&
											"bg-[color-mix(in_oklab,var(--ink),white_78%)]",
									)}
									style={{ left: `${left}%`, width: `${width}%` }}
								>
									<span className="num">
										D{a}–D{b}
									</span>
								</div>
								{MILESTONES.filter((m) => m.phase === p.id).map((m, j) => (
									<motion.div
										className="absolute top-[18px] h-0 w-0"
										initial={{ opacity: 0 }}
										key={m.day}
										style={{ left: `${((m.day - 0.5) / 21) * 100}%` }}
										title={`Day ${m.day} · ${m.label}`}
										transition={{ delay: (idx + j) * 0.1 }}
										viewport={{ once: true }}
										whileInView={{ opacity: 1 }}
									>
										<div className="h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-paper bg-ink" />
									</motion.div>
								))}
							</div>
						</motion.div>
					);
				})}
			</div>

			<div
				className="pointer-events-none absolute top-1.5 bottom-14"
				style={{
					left: `calc(var(--meta-w) + ((${TODAY} - 0.5) / 21) * (100% - var(--meta-w)))`,
				}}
			>
				<div className="absolute inset-y-0 w-[1px] bg-accent" />
				<div className="absolute bottom-[-22px] left-1.5 whitespace-nowrap font-medium text-[12px] text-accent">
					<span className="num">Day {TODAY}</span> · today
				</div>
			</div>
		</div>
	);
}

function TimelineLegend() {
	return (
		<div className="mt-15 flex flex-wrap gap-7 border-hair border-t pt-7">
			{PHASES.map((p) => (
				<div className="flex items-baseline gap-2" key={p.id}>
					<span
						className={cn(
							"inline-block h-2.5 w-2.5 self-center rounded-[2px]",
							p.id === 1 && "bg-[color-mix(in_oklab,var(--ink),white_60%)]",
							p.id === 2 && "bg-accent",
							p.id === 3 && "bg-[color-mix(in_oklab,var(--ink),white_78%)]",
						)}
					/>
					<span className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.14em]">
						Phase 0{p.id}
					</span>
					<span className="ml-1 text-[14px] text-ink">{p.name}</span>
					<span className="num ml-1 text-[12px] text-ink-mute tracking-[0.04em]">
						Days {p.range[0]}–{p.range[1]}
					</span>
				</div>
			))}
		</div>
	);
}
