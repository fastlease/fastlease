"use client";

import { motion } from "framer-motion";
import { Reveal } from "../ui/Reveal";
import { cn } from "~/lib/utils";

const MILESTONES = [
	{ day: 1, label: "Listing live", phase: 1 },
	{ day: 3, label: "Photography complete", phase: 1 },
	{ day: 5, label: "First showings", phase: 2 },
	{ day: 11, label: "Applications in", phase: 2 },
	{ day: 16, label: "Screening complete", phase: 3 },
	{ day: 21, label: "Lease signed", phase: 3 },
];

const PHASES = [
	{ id: 1, name: "Listed and live", range: [1, 3], note: "Pricing analysis, photography, syndication." },
	{ id: 2, name: "Qualified showings", range: [4, 14], note: "Inbound filtering, scheduled tours, inquiry tracking." },
	{ id: 3, name: "Screened and signed", range: [15, 21], note: "Application review, verification, lease execution." },
];

const TODAY = 13;

export function TimelineSection({ treatment = "calendar" }: { treatment?: "calendar" | "beam" | "gantt" }) {
	return (
		<section id="timeline" className="section-pad">
			<div className="wrap">
				<Reveal className="flex items-center gap-4 mb-7">
					<span className="num text-[12px] tracking-[0.14em] text-ink-mute uppercase">01</span>
					<span className="flex-1 h-[1px] bg-hair" />
					<span className="text-[11px] font-medium tracking-[0.14em] text-ink-mute uppercase">The 21-day timeline</span>
				</Reveal>
				
				<div className="grid grid-cols-2 max-md:grid-cols-1 gap-12 max-md:gap-4 items-end mb-14 max-md:mb-6">
					<Reveal as="h2" className="max-w-[22ch]">The process, made visible.</Reveal>
					<Reveal as="p" className="text-[17px] text-ink-soft max-w-[52ch] leading-[1.55]">
						Most leasing services sell their best effort. We sell a date. Here&apos;s what the
						twenty-one days actually look like — and where the unit below this paragraph
						sits today.
					</Reveal>
				</div>

				<Reveal className="relative">
					{treatment === "calendar" && <TimelineCalendar />}
					{treatment === "beam" && <TimelineBeam />}
					{treatment === "gantt" && <TimelineGantt />}
					
					{/* Mobile List View (rendered on mobile, hidden on desktop) */}
					<div className="hidden max-md:flex flex-col border-l border-hair ml-[18px] pl-[22px] relative mt-10">
						{MILESTONES.map((m, i) => (
							<div key={m.day} className={cn(
								"relative py-[14px] pb-[22px]",
								m.day === TODAY && "is-today"
							)}>
								<div className={cn(
									"absolute left-[-28px] top-[22px] w-[11px] h-[11px] rounded-full bg-paper border-2 border-ink-soft",
									m.day === TODAY && "border-accent bg-accent"
								)} />
								<div className="text-[11px] uppercase tracking-[0.14em] text-ink-mute mb-2">Phase 0{m.phase}</div>
								<div className="text-[13px] text-ink-mute tracking-[0.04em] num">Day {m.day}</div>
								<div className="text-[17px] font-medium mt-0.5 text-ink">{m.label}</div>
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
		<div className="max-md:hidden pt-14 pb-3 relative">
			<div className="flex justify-between mb-4">
				<span className="text-[11px] font-medium tracking-[0.14em] text-ink-mute uppercase">Day 01</span>
				<span className="text-[11px] font-medium tracking-[0.14em] text-ink-mute uppercase text-right">Day 21</span>
			</div>
			
			<div className="grid grid-cols-[repeat(21,1fr)] border-t border-hair relative">
				{days.map((d) => {
					const ms = milestoneByDay[d];
					const isToday = d === TODAY;
					return (
						<motion.div 
							key={d} 
							initial={{ opacity: 0, y: 6 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: d * 0.03 }}
							className={cn(
								"relative h-14 border-r border-hair",
								d === 1 && "border-l"
							)}
						>
							<div className="absolute top-0 inset-x-0 h-2 border-b border-hair" />
							<div className={cn(
								"absolute top-3 inset-x-0 text-center text-[11px] tracking-[0.04em] num",
								isToday ? "text-accent font-medium" : "text-ink-mute",
								ms && "text-ink font-medium"
							)}>
								{d.toString().padStart(2, "0")}
							</div>

							{ms && (
								<div className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
									<div className={cn(
										"w-[1px] bg-ink-faint mx-auto",
										[1, 5, 16].includes(d) ? "h-6" : "h-[58px]"
									)} />
									<div className="mt-1.5 text-[12px] text-ink-soft">{ms.label}</div>
								</div>
							)}

							{isToday && (
								<div className="absolute top-[-62px] left-1/2 -translate-x-1/2 flex flex-col items-center z-[2]">
									<div className="mb-1.5 text-[11px] text-accent font-medium uppercase tracking-[0.12em] whitespace-nowrap">Sample unit · today</div>
									<div className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_0_4px_rgba(184,85,58,0.22)] animate-pulse-once" />
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
						<div key={p.id} className="absolute top-0 pr-3" style={{ left: `${left}%`, width: `${width}%` }}>
							<div className={cn(
								"h-1 rounded-[2px]",
								p.id === 2 ? "bg-accent opacity-100" : "bg-ink opacity-[0.68]"
							)} />
							<div className="mt-3.5 text-[15px] font-medium text-ink">{p.name}</div>
							<div className="mt-0.5 text-[12px] text-ink-mute tracking-[0.04em] num">Days {a}{a === b ? "" : `–${b}`}</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

function TimelineBeam() {
	return (
		<div className="max-md:hidden relative pt-[120px] pb-6">
			<div className="relative h-[84px] mt-4 flex">
				{PHASES.map((p) => {
					const [a, b] = p.range as [number, number];
					const left = ((a - 1) / 21) * 100;
					const width = ((b - a + 1) / 21) * 100;
					return (
						<div 
							key={p.id} 
							className={cn(
								"absolute top-6 h-9 rounded-1",
								p.id === 1 && "bg-[color-mix(in_oklab,var(--ink),white_88%)]",
								p.id === 2 && "bg-[color-mix(in_oklab,var(--accent),white_32%)]",
								p.id === 3 && "bg-[color-mix(in_oklab,var(--ink),white_78%)]"
							)} 
							style={{ left: `${left}%`, width: `${width}%` }}
						>
							<div className="absolute top-full mt-3 left-0 flex flex-col gap-0.5">
								<span className="text-[11px] font-medium tracking-[0.14em] text-ink-mute uppercase">Phase 0{p.id}</span>
								<span className="text-[15px] font-medium">{p.name}</span>
							</div>
						</div>
					);
				})}
				<div className="absolute top-[-20px] bottom-[-20px] z-[3]" style={{ left: `${((TODAY - 0.5) / 21) * 100}%` }}>
					<div className="absolute inset-y-0 w-[1px] bg-accent" />
					<div className="absolute top-11 left-[-5px] w-[11px] h-[11px] rounded-full bg-accent shadow-[0_0_0_5px_rgba(184,85,58,0.2)] animate-pulse-once" />
					<div className="absolute bottom-[-28px] left-2 text-[12px] text-accent font-medium whitespace-nowrap">
						<span className="num">Day {TODAY}</span> · sample unit
					</div>
				</div>
			</div>
			
			<div className="h-[1px] bg-hair mt-2 absolute left-0 right-0 top-[180px]" />
			
			<div className="absolute top-[-84px] left-0 right-0 h-[90px]">
				{MILESTONES.map((m, i) => (
					<motion.div 
						key={m.day} 
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ delay: i * 0.1 }}
						className="absolute top-0 -translate-x-1/2 text-center"
						style={{ left: `${((m.day - 0.5) / 21) * 100}%` }}
					>
						<div className={cn(
							"w-[1px] bg-ink-faint mx-auto",
							[1, 5, 16].includes(m.day) ? "h-6" : "h-[60px]"
						)} />
						<div className="text-[11px] text-ink-mute mt-1 tracking-[0.04em] num">Day {m.day}</div>
						<div className="text-[12px] text-ink-soft mt-0.5 whitespace-nowrap">{m.label}</div>
					</motion.div>
				))}
			</div>
		</div>
	);
}

function TimelineGantt() {
	return (
		<div className="max-md:hidden relative py-3 pb-14 [--meta-w:220px]">
			<div className="grid grid-cols-[repeat(21,1fr)] ml-[var(--meta-w)] border-y border-hair absolute inset-0 bottom-14 pointer-events-none">
				{Array.from({ length: 21 }, (_, i) => i + 1).map((d) => (
					<div key={d} className="border-r border-hair relative first:border-l">
						{[1, 7, 14, 21].includes(d) && (
							<span className="absolute top-[-22px] left-0 -translate-x-1/2 text-[11px] text-ink-mute tracking-[0.04em] num">
								{d.toString().padStart(2, "0")}
							</span>
						)}
					</div>
				))}
			</div>
			
			<div className="relative pt-[30px] flex flex-col gap-3.5">
				{PHASES.map((p, idx) => {
					const [a, b] = p.range as [number, number];
					const left = ((a - 1) / 21) * 100;
					const width = ((b - a + 1) / 21) * 100;
					return (
						<motion.div 
							key={p.id} 
							initial={{ opacity: 0, x: -8 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ delay: idx * 0.1 }}
							className="grid grid-cols-[var(--meta-w)_1fr] items-center"
						>
							<div className="flex flex-col gap-0.5 pr-4">
								<span className="text-[11px] font-medium tracking-[0.14em] text-ink-mute uppercase">Phase 0{p.id}</span>
								<span className="text-[15px] font-medium">{p.name}</span>
							</div>
							<div className="relative h-9">
								<div 
									className={cn(
										"absolute top-1.5 h-6 rounded-[3px] flex items-center px-[10px] text-[11px] tracking-[0.04em] text-ink",
										p.id === 1 && "bg-[color-mix(in_oklab,var(--ink),white_88%)]",
										p.id === 2 && "bg-[color-mix(in_oklab,var(--accent),white_35%)]",
										p.id === 3 && "bg-[color-mix(in_oklab,var(--ink),white_78%)]"
									)} 
									style={{ left: `${left}%`, width: `${width}%` }}
								>
									<span className="num">D{a}–D{b}</span>
								</div>
								{MILESTONES.filter((m) => m.phase === p.id).map((m, j) => (
									<motion.div 
										key={m.day} 
										initial={{ opacity: 0 }}
										whileInView={{ opacity: 1 }}
										viewport={{ once: true }}
										transition={{ delay: (idx + j) * 0.1 }}
										className="absolute top-[18px] w-0 h-0"
										style={{ left: `${((m.day - 0.5) / 21) * 100}%` }}
										title={`Day ${m.day} · ${m.label}`}
									>
										<div className="w-2 h-2 rounded-full bg-ink -translate-x-1/2 -translate-y-1/2 border-2 border-paper" />
									</motion.div>
								))}
							</div>
						</motion.div>
					);
				})}
			</div>
			
			<div className="absolute top-1.5 bottom-14 pointer-events-none" style={{ left: `calc(var(--meta-w) + ((${TODAY} - 0.5) / 21) * (100% - var(--meta-w)))` }}>
				<div className="absolute inset-y-0 w-[1px] bg-accent" />
				<div className="absolute bottom-[-22px] left-1.5 text-[12px] text-accent font-medium whitespace-nowrap">
					<span className="num">Day {TODAY}</span> · today
				</div>
			</div>
		</div>
	);
}

function TimelineLegend() {
	return (
		<div className="flex flex-wrap gap-7 mt-15 pt-7 border-t border-hair">
			{PHASES.map((p) => (
				<div key={p.id} className="flex items-baseline gap-2">
					<span className={cn(
						"w-2.5 h-2.5 rounded-[2px] inline-block self-center",
						p.id === 1 && "bg-[color-mix(in_oklab,var(--ink),white_60%)]",
						p.id === 2 && "bg-accent",
						p.id === 3 && "bg-[color-mix(in_oklab,var(--ink),white_78%)]"
					)} />
					<span className="text-[11px] font-medium tracking-[0.14em] text-ink-mute uppercase">Phase 0{p.id}</span>
					<span className="text-[14px] text-ink ml-1">{p.name}</span>
					<span className="text-[12px] text-ink-mute tracking-[0.04em] num ml-1">Days {p.range[0]}–{p.range[1]}</span>
				</div>
			))}
		</div>
	);
}
