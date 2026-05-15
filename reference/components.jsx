// components.jsx — shared building blocks

function useReveal() {
	const ref = React.useRef(null);
	React.useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const io = new IntersectionObserver(
			(entries) => {
				entries.forEach((e) => {
					if (e.isIntersecting) {
						el.classList.add("in");
						io.disconnect();
					}
				});
			},
			{ threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
		);
		io.observe(el);
		return () => io.disconnect();
	}, []);
	return ref;
}

function Reveal({ children, as: As = "div", style, className = "", ...rest }) {
	const ref = useReveal();
	return (
		<As className={`reveal ${className}`} ref={ref} style={style} {...rest}>
			{children}
		</As>
	);
}

// Count-up number that runs once when it enters the viewport
function CountUp({
	to,
	duration = 800,
	decimals = 0,
	suffix = "",
	prefix = "",
}) {
	const ref = React.useRef(null);
	const [val, setVal] = React.useState(0);
	React.useEffect(() => {
		const el = ref.current;
		if (!el) return;
		let started = false;
		const io = new IntersectionObserver(
			(entries) => {
				entries.forEach((e) => {
					if (e.isIntersecting && !started) {
						started = true;
						const t0 = performance.now();
						const tick = (t) => {
							const p = Math.min(1, (t - t0) / duration);
							const eased = 1 - (1 - p) ** 3;
							setVal(to * eased);
							if (p < 1) requestAnimationFrame(tick);
							else setVal(to);
						};
						requestAnimationFrame(tick);
						io.disconnect();
					}
				});
			},
			{ threshold: 0.4 },
		);
		io.observe(el);
		return () => io.disconnect();
	}, [to, duration]);
	const display =
		decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString();
	return (
		<span className="num" ref={ref}>
			{prefix}
			{display}
			{suffix}
		</span>
	);
}

// Logo mark variants
function LogoMark({ variant = "timestamp", size = 22 }) {
	const stroke = "currentColor";
	const sw = 1.6;
	if (variant === "wordmark") return null;
	if (variant === "timestamp") {
		// A precise tick mark inside a square — like a timestamp ledger entry
		return (
			<svg aria-hidden="true" height={size} viewBox="0 0 24 24" width={size}>
				<rect
					fill="none"
					height="19"
					rx="3"
					stroke={stroke}
					strokeWidth={sw}
					width="19"
					x="2.5"
					y="2.5"
				/>
				<path
					d="M7 12.4 L10.6 16 L17 8.5"
					fill="none"
					stroke="var(--accent)"
					strokeLinecap="square"
					strokeLinejoin="miter"
					strokeWidth="2"
				/>
			</svg>
		);
	}
	if (variant === "counter") {
		// A simplified counter / progress dial — 75% arc
		return (
			<svg aria-hidden="true" height={size} viewBox="0 0 24 24" width={size}>
				<circle
					cx="12"
					cy="12"
					fill="none"
					opacity=".22"
					r="9"
					stroke={stroke}
					strokeWidth={sw}
				/>
				<path
					d="M12 3 a9 9 0 0 1 7.79 13.5"
					fill="none"
					stroke="var(--accent)"
					strokeLinecap="square"
					strokeWidth={sw + 0.4}
				/>
				<circle cx="12" cy="12" fill={stroke} r="1.6" />
			</svg>
		);
	}
	// abstract — three nested squares stepping like a milestone marker
	return (
		<svg aria-hidden="true" height={size} viewBox="0 0 24 24" width={size}>
			<rect fill={stroke} height="18" width="6" x="3" y="3" />
			<rect fill={stroke} height="15" opacity=".55" width="4" x="11" y="6" />
			<rect fill="var(--accent)" height="12" width="4" x="17" y="9" />
		</svg>
	);
}

function Wordmark({ variant, mono = false }) {
	return (
		<span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
			{variant !== "wordmark" && <LogoMark size={20} variant={variant} />}
			<span
				style={{
					fontWeight: 600,
					fontSize: 17,
					letterSpacing: "-0.018em",
					color: mono ? "inherit" : "var(--ink)",
				}}
			>
				FastLease
				<span style={{ color: "var(--ink-faint)", fontWeight: 500 }}>.ca</span>
			</span>
		</span>
	);
}

Object.assign(window, { Reveal, useReveal, CountUp, LogoMark, Wordmark });
