// timeline.jsx — three treatments of the 21-Day Timeline

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

const TODAY = 13; // sample unit highlight

// Sequential entry — animates in once on view
function useSequentialEntry(count, stepMs = 60) {
	const ref = React.useRef(null);
	const [n, setN] = React.useState(0);
	React.useEffect(() => {
		const el = ref.current;
		if (!el) return;
		let cancelled = false;
		const io = new IntersectionObserver(
			(entries) => {
				entries.forEach((e) => {
					if (e.isIntersecting) {
						let i = 0;
						const step = () => {
							if (cancelled) return;
							i++;
							setN(i);
							if (i < count) setTimeout(step, stepMs);
						};
						setTimeout(step, 80);
						io.disconnect();
					}
				});
			},
			{ threshold: 0.25 },
		);
		io.observe(el);
		return () => {
			cancelled = true;
			io.disconnect();
		};
	}, [count, stepMs]);
	return [ref, n];
}

// 1) CALENDAR — strict 21-day grid with milestone pins
function TimelineCalendar() {
	const [ref, shown] = useSequentialEntry(21, 35);
	const days = Array.from({ length: 21 }, (_, i) => i + 1);
	const milestoneByDay = Object.fromEntries(MILESTONES.map((m) => [m.day, m]));
	return (
		<div className="tl-calendar" ref={ref}>
			<div className="tl-cal-header">
				<span className="label">Day 01</span>
				<span className="label" style={{ textAlign: "right" }}>
					Day 21
				</span>
			</div>
			<div className="tl-cal-grid">
				{days.map((d) => {
					const ms = milestoneByDay[d];
					const isToday = d === TODAY;
					const visible = d <= shown;
					return (
						<div
							className={`tl-cal-cell ${visible ? "in" : ""} ${isToday ? "today" : ""} ${ms ? "has-ms" : ""}`}
							key={d}
						>
							<div className="tl-cal-tick" />
							<div className="tl-cal-day num">
								{d.toString().padStart(2, "0")}
							</div>
							{ms && (
								<div
									className={`tl-cal-pin ${ms.phase === 1 ? "p1" : ms.phase === 2 ? "p2" : "p3"}`}
								>
									<div className="tl-cal-pin-line" />
									<div className="tl-cal-pin-label">{ms.label}</div>
								</div>
							)}
							{isToday && (
								<div className="tl-cal-today">
									<div className="tl-cal-today-dot" />
									<div className="tl-cal-today-label">Sample unit · today</div>
								</div>
							)}
						</div>
					);
				})}
			</div>
			<div className="tl-cal-phases">
				{PHASES.map((p) => {
					const [a, b] = p.range;
					const left = ((a - 1) / 21) * 100;
					const width = ((b - a + 1) / 21) * 100;
					return (
						<div
							className="tl-cal-phase"
							key={p.id}
							style={{ left: `${left}%`, width: `${width}%` }}
						>
							<div className="tl-cal-phase-bar" />
							<div className="tl-cal-phase-name">{p.name}</div>
							<div className="tl-cal-phase-range num">
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

// 2) BEAM — three phase bands on a single beam with milestone markers above
function TimelineBeam() {
	const [ref, shown] = useSequentialEntry(MILESTONES.length, 110);
	return (
		<div className="tl-beam" ref={ref}>
			<div className="tl-beam-axis">
				{PHASES.map((p) => {
					const [a, b] = p.range;
					const left = ((a - 1) / 21) * 100;
					const width = ((b - a + 1) / 21) * 100;
					return (
						<div
							className={`tl-beam-band band-${p.id}`}
							key={p.id}
							style={{ left: `${left}%`, width: `${width}%` }}
						>
							<div className="tl-beam-band-label">
								<span className="label">Phase 0{p.id}</span>
								<span className="tl-beam-band-name">{p.name}</span>
							</div>
						</div>
					);
				})}
				<div
					className="tl-beam-today"
					style={{ left: `${((TODAY - 0.5) / 21) * 100}%` }}
				>
					<div className="tl-beam-today-line" />
					<div className="tl-beam-today-dot" />
					<div className="tl-beam-today-tag">
						<span className="num">Day {TODAY}</span> · sample unit
					</div>
				</div>
			</div>
			<div className="tl-beam-rule" />
			<div className="tl-beam-marks">
				{MILESTONES.map((m, i) => (
					<div
						className={`tl-beam-mark ${i < shown ? "in" : ""}`}
						key={m.day}
						style={{ left: `${((m.day - 0.5) / 21) * 100}%` }}
					>
						<div className="tl-beam-mark-tick" />
						<div className="tl-beam-mark-day num">Day {m.day}</div>
						<div className="tl-beam-mark-label">{m.label}</div>
					</div>
				))}
			</div>
		</div>
	);
}

// 3) GANTT — phase bars stacked, day axis below
function TimelineGantt() {
	const [ref, shown] = useSequentialEntry(
		PHASES.length + MILESTONES.length,
		90,
	);
	return (
		<div className="tl-gantt" ref={ref}>
			<div className="tl-gantt-grid">
				{Array.from({ length: 21 }, (_, i) => i + 1).map((d) => (
					<div className="tl-gantt-col" key={d}>
						{(d === 1 || d === 7 || d === 14 || d === 21) && (
							<span className="tl-gantt-col-lbl num">
								{d.toString().padStart(2, "0")}
							</span>
						)}
					</div>
				))}
			</div>
			<div className="tl-gantt-rows">
				{PHASES.map((p, idx) => {
					const [a, b] = p.range;
					const left = ((a - 1) / 21) * 100;
					const width = ((b - a + 1) / 21) * 100;
					return (
						<div
							className={`tl-gantt-row ${idx < shown ? "in" : ""}`}
							key={p.id}
						>
							<div className="tl-gantt-row-meta">
								<span className="label">Phase 0{p.id}</span>
								<span className="tl-gantt-row-name">{p.name}</span>
							</div>
							<div className="tl-gantt-track">
								<div
									className={`tl-gantt-bar band-${p.id}`}
									style={{ left: `${left}%`, width: `${width}%` }}
								>
									<span className="num">
										D{a}–D{b}
									</span>
								</div>
								{MILESTONES.filter((m) => m.phase === p.id).map((m, j) => (
									<div
										className={`tl-gantt-ms ${shown > PHASES.length + j ? "in" : ""}`}
										key={m.day}
										style={{ left: `${((m.day - 0.5) / 21) * 100}%` }}
										title={`Day ${m.day} · ${m.label}`}
									>
										<div className="tl-gantt-ms-dot" />
									</div>
								))}
							</div>
						</div>
					);
				})}
			</div>
			<div
				className="tl-gantt-today"
				style={{
					left: `calc(var(--meta-w) + ((${TODAY} - 0.5) / 21) * (100% - var(--meta-w)))`,
				}}
			>
				<div className="tl-gantt-today-line" />
				<div className="tl-gantt-today-tag">
					<span className="num">Day {TODAY}</span> · today
				</div>
			</div>
		</div>
	);
}

function TimelineLegend() {
	return (
		<div className="tl-legend">
			{PHASES.map((p) => (
				<div className="tl-legend-item" key={p.id}>
					<span className={`tl-legend-dot band-${p.id}`} />
					<span className="label">Phase 0{p.id}</span>
					<span className="tl-legend-name">{p.name}</span>
					<span className="tl-legend-range num">
						Days {p.range[0]}–{p.range[1]}
					</span>
				</div>
			))}
		</div>
	);
}

Object.assign(window, {
	TimelineCalendar,
	TimelineBeam,
	TimelineGantt,
	TimelineLegend,
});
