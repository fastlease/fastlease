// components.jsx — shared building blocks

function useReveal() {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect(); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, as: As = 'div', style, className = '', ...rest }) {
  const ref = useReveal();
  return <As ref={ref} className={`reveal ${className}`} style={style} {...rest}>{children}</As>;
}

// Count-up number that runs once when it enters the viewport
function CountUp({ to, duration = 800, decimals = 0, suffix = '', prefix = '' }) {
  const ref = React.useRef(null);
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    let started = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started) {
          started = true;
          const t0 = performance.now();
          const tick = (t) => {
            const p = Math.min(1, (t - t0) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(to * eased);
            if (p < 1) requestAnimationFrame(tick);
            else setVal(to);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);
  const display = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString();
  return <span ref={ref} className="num">{prefix}{display}{suffix}</span>;
}

// Logo mark variants
function LogoMark({ variant = 'timestamp', size = 22 }) {
  const stroke = 'currentColor';
  const sw = 1.6;
  if (variant === 'wordmark') return null;
  if (variant === 'timestamp') {
    // A precise tick mark inside a square — like a timestamp ledger entry
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2.5" y="2.5" width="19" height="19" rx="3" fill="none" stroke={stroke} strokeWidth={sw}/>
        <path d="M7 12.4 L10.6 16 L17 8.5" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"/>
      </svg>
    );
  }
  if (variant === 'counter') {
    // A simplified counter / progress dial — 75% arc
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke={stroke} strokeWidth={sw} opacity=".22"/>
        <path d="M12 3 a9 9 0 0 1 7.79 13.5" fill="none" stroke="var(--accent)" strokeWidth={sw + 0.4} strokeLinecap="square"/>
        <circle cx="12" cy="12" r="1.6" fill={stroke}/>
      </svg>
    );
  }
  // abstract — three nested squares stepping like a milestone marker
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="6" height="18" fill={stroke}/>
      <rect x="11" y="6" width="4" height="15" fill={stroke} opacity=".55"/>
      <rect x="17" y="9" width="4" height="12" fill="var(--accent)"/>
    </svg>
  );
}

function Wordmark({ variant, mono = false }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      {variant !== 'wordmark' && <LogoMark variant={variant} size={20}/>}
      <span style={{
        fontWeight: 600,
        fontSize: 17,
        letterSpacing: '-0.018em',
        color: mono ? 'inherit' : 'var(--ink)',
      }}>
        FastLease<span style={{ color: 'var(--ink-faint)', fontWeight: 500 }}>.ca</span>
      </span>
    </span>
  );
}

Object.assign(window, { Reveal, useReveal, CountUp, LogoMark, Wordmark });
