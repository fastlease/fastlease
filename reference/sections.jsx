// sections.jsx — every landing-page section except the timeline (in timeline.jsx)
// Uses globals: Reveal, CountUp, Wordmark, LogoMark, TimelineCalendar/Beam/Gantt

const NUM_LEASED = 127;
const AVG_DAYS = 16;
const PCT_ASKING = 99.4;
const GUARANTEE_DAYS = 21;

const HEADLINES = [
  { eyebrow: "Toronto Condo Leasing",      h: "Your condo,\nleased in 21 days." },
  { eyebrow: "A leasing system, not a service", h: "A date, not\na best effort." },
  { eyebrow: "Toronto Condo Leasing",      h: "Leased by day 21,\nor you don't pay." },
];

function Nav({ onOpenForm, logoVariant, scrolled }) {
  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="wrap nav-inner">
        <a className="nav-logo" href="#top"><Wordmark variant={logoVariant} /></a>
        <nav className="nav-links">
          <a className="nav-link" href="#how">How It Works</a>
          <a className="nav-link" href="#pricing">Pricing</a>
          <a className="nav-link" href="#leases">Recent Leases</a>
        </nav>
        <button className="btn btn-primary nav-cta" onClick={onOpenForm}>
          Get Your Timeline
          <span className="arr">→</span>
        </button>
      </div>
    </header>
  );
}

function Hero({ headlineIdx, onOpenForm }) {
  const data = HEADLINES[headlineIdx] || HEADLINES[0];
  return (
    <section id="top" className="section hero">
      <div className="wrap hero-inner">
        <Reveal as="div" className="hero-eyebrow eyebrow">
          <span className="dot"/>{data.eyebrow}
        </Reveal>
        <Reveal as="h1" className="hero-h">
          {data.h.split('\n').map((line, i, arr) => (
            <span key={i}>{i === arr.length - 1 ? <span className="accent-period">{line}</span> : line}{i < arr.length - 1 && <br/>}</span>
          ))}
        </Reveal>
        <Reveal as="p" className="hero-sub">
          A modern leasing system for Toronto condo owners. If we don't sign a qualified tenant in {GUARANTEE_DAYS} days, you don't pay until we do.
        </Reveal>
        <Reveal as="div" className="hero-ctas">
          <button className="btn btn-primary" onClick={onOpenForm}>
            Get Your Leasing Timeline
            <span className="arr">→</span>
          </button>
          <a className="ulink hero-secondary" href="#how">See how it works <span>→</span></a>
        </Reveal>
        <Reveal as="div" className="hero-microproof">
          <span className="num">{NUM_LEASED}</span> condos leased in 2025
          <span className="hero-dot">·</span>
          Average: <span className="num">{AVG_DAYS} days</span>
          <span className="hero-dot">·</span>
          <span className="num">{PCT_ASKING}%</span> of asking
        </Reveal>
      </div>
    </section>
  );
}

function TimelineSection({ treatment }) {
  return (
    <section id="timeline" className="section timeline-sec">
      <div className="wrap">
        <Reveal as="div" className="kicker">
          <span className="num-tag">01</span>
          <span className="line"/>
          <span className="label">The 21-day timeline</span>
        </Reveal>
        <div className="timeline-head">
          <Reveal as="h2">The process, made visible.</Reveal>
          <Reveal as="p" className="timeline-lede">
            Most leasing services sell their best effort. We sell a date. Here's what the
            twenty-one days actually look like — and where the unit below this paragraph
            sits today.
          </Reveal>
        </div>

        <Reveal as="div" className="tl-canvas">
          {treatment === 'calendar' && <TimelineCalendar />}
          {treatment === 'beam'     && <TimelineBeam />}
          {treatment === 'gantt'    && <TimelineGantt />}
          {/* Mobile fallback — always rendered, shown only at narrow widths */}
          <TimelineMobile />
        </Reveal>

        <TimelineLegend />
      </div>
    </section>
  );
}

function TimelineMobile() {
  const items = [
    { phase: 1, phaseName: 'Listed and live',     day: 1,  label: 'Listing live',         start: true },
    { phase: 1, phaseName: 'Listed and live',     day: 3,  label: 'Photography complete' },
    { phase: 2, phaseName: 'Qualified showings',  day: 5,  label: 'First showings',       start: true },
    { phase: 2, phaseName: 'Qualified showings',  day: 11, label: 'Applications in' },
    { phase: 2, phaseName: 'Qualified showings',  day: 13, label: 'Sample unit — today',  today: true },
    { phase: 3, phaseName: 'Screened and signed', day: 16, label: 'Screening complete',   start: true },
    { phase: 3, phaseName: 'Screened and signed', day: 21, label: 'Lease signed' },
  ];
  return (
    <ol className="tl-mobile">
      {items.map((it, i) => (
        <li key={i} className={`tl-mobile-item ${it.today ? 'is-today' : ''} ${it.start ? 'phase-start' : ''}`}>
          {it.start && <div className="tl-mobile-phase">Phase 0{it.phase} · {it.phaseName}</div>}
          <div className="tl-mobile-day">Day {String(it.day).padStart(2,'0')}</div>
          <div className="tl-mobile-label">{it.label}</div>
        </li>
      ))}
    </ol>
  );
}

function ProofBar() {
  return (
    <section className="section proof-sec">
      <div className="wrap">
        <hr className="divider"/>
        <Reveal as="div" className="proof-grid">
          {[
            { v: NUM_LEASED, label: 'Condos leased', sub: '2025 YTD' },
            { v: AVG_DAYS,   label: 'Days, average', sub: 'Listing to signed lease' },
            { v: PCT_ASKING, label: '% of asking',   sub: 'Achieved on closed leases', decimals: 1, suffix: '%' },
            { v: GUARANTEE_DAYS, label: 'Day guarantee', sub: 'Or you don\'t pay' },
          ].map((s, i) => (
            <div key={i} className="proof-cell">
              <div className="bignum">
                <CountUp to={s.v} decimals={s.decimals || 0} suffix={s.suffix || ''} />
              </div>
              <div className="proof-label">{s.label}</div>
              <div className="proof-sub">{s.sub}</div>
            </div>
          ))}
        </Reveal>
        <hr className="divider"/>
      </div>
    </section>
  );
}

function ProblemReframe() {
  return (
    <section className="section problem-sec">
      <div className="wrap problem-grid">
        <Reveal as="div" className="kicker">
          <span className="num-tag">02</span>
          <span className="line"/>
          <span className="label">The cost of vacancy</span>
        </Reveal>
        <div className="problem-body">
          <Reveal as="h2" className="problem-h">
            Every vacant day costs you <span className="accent num">$107</span>.
          </Reveal>
          <div className="problem-cols">
            <Reveal as="p">
              The number above is the daily rent on a typical King West one-bedroom. Vacancy
              is rarely dramatic. It's a slow leak — three weeks here, six there — that most
              landlords don't sit down and total at the end of the year.
            </Reveal>
            <Reveal as="p">
              That's why FastLease is built around a date instead of a best effort. We don't
              think you're losing thousands. We think you already know the math, and you'd
              rather work with someone who reports against it.
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

const PHASE_CARDS = [
  {
    days: 'Days 1–3',
    title: 'Listed and live.',
    body: 'A pricing analysis against comparable units in the building (not just the neighborhood). Professional photography. Syndication across fourteen platforms — including the three Toronto landlords actually use.',
    bullets: ['Comparable-unit pricing', 'Professional photography', 'Listed across 14 platforms'],
  },
  {
    days: 'Days 4–14',
    title: 'Qualified showings.',
    body: 'Inbound inquiry is filtered before it ever reaches your inbox. Showings are scheduled in clusters so the unit reads as in-demand. You get a single weekly report with the things worth knowing — never a list of every email.',
    bullets: ['Pre-screened inquiries', 'Clustered showings', 'Weekly operator report'],
  },
  {
    days: 'Days 15–21',
    title: 'Screened and signed.',
    body: 'Applications are stack-ranked against the criteria we publish below. Credit, income, employment, prior-landlord references — verified, not just checked off. You approve the tenant. We execute the lease.',
    bullets: ['Stack-ranked applications', 'Verified — not just checked', 'Lease executed by day 21'],
  },
];

function HowItWorks() {
  return (
    <section id="how" className="section how-sec">
      <div className="wrap">
        <Reveal as="div" className="kicker">
          <span className="num-tag">03</span>
          <span className="line"/>
          <span className="label">How it works</span>
        </Reveal>
        <Reveal as="h2" className="how-h">Three phases. Nine days of slack built in.</Reveal>
        <Reveal as="p" className="how-lede">
          The schedule below is what we plan to. The guarantee is what we promise. The gap
          between the two is deliberate — and the reason landlords stop reading other
          leasing sites once they reach this section.
        </Reveal>

        <div className="how-grid">
          {PHASE_CARDS.map((p, i) => (
            <Reveal as="div" key={i} className="how-card card">
              <div className="how-card-head">
                <span className="label num">{p.days}</span>
                <span className="how-card-num num">0{i + 1} / 03</span>
              </div>
              <h3 className="how-card-title">{p.title}</h3>
              <p className="how-card-body">{p.body}</p>
              <ul className="how-card-list">
                {p.bullets.map((b, j) => (
                  <li key={j}><span className="how-card-tick">›</span> {b}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const SCREENING = [
  { label: 'Credit score',          value: '680 minimum',              note: 'Verified through Equifax or TransUnion direct pull.' },
  { label: 'Income-to-rent ratio',  value: '3.0× monthly rent',        note: 'Documented through two pay stubs and most recent NOA.' },
  { label: 'Employment',            value: 'Verified, not stated',     note: 'Direct contact with HR or, for self-employed, two years of T1s.' },
  { label: 'Previous landlord',     value: 'Two references',           note: 'Spoken with by phone — not an emailed form.' },
  { label: 'Identity & documents',  value: 'ID + status checks',       note: 'Government photo ID, work permit status where applicable.' },
];

function Screening() {
  return (
    <section className="section screen-sec">
      <div className="wrap">
        <Reveal as="div" className="kicker">
          <span className="num-tag">04</span>
          <span className="line"/>
          <span className="label">Tenant screening standards</span>
        </Reveal>
        <div className="screen-head">
          <Reveal as="h2">Speed without standards is not the offer.</Reveal>
          <Reveal as="p" className="screen-lede">
            Most leasing services are vague about screening because the vagueness is where
            the corners get cut. We publish ours.
          </Reveal>
        </div>

        <div className="screen-list card">
          {SCREENING.map((s, i) => (
            <Reveal as="div" key={i} className="screen-row">
              <div className="screen-row-label label">{s.label}</div>
              <div className="screen-row-value">{s.value}</div>
              <div className="screen-row-note">{s.note}</div>
            </Reveal>
          ))}
        </div>

        <Reveal as="p" className="screen-foot">
          We move quickly. We don't cut corners. The two are easier to reconcile than
          most landlords have been led to believe.
        </Reveal>
      </div>
    </section>
  );
}

const LEASES = [
  { n: 'King West',       u: '1BR',       listed: 2650, leased: 2675, days: 14 },
  { n: 'Liberty Village', u: '2BR+den',   listed: 3450, leased: 3400, days: 19 },
  { n: 'CityPlace',       u: 'Jr 1BR',    listed: 2200, leased: 2200, days: 11 },
  { n: 'St. Lawrence',    u: '1BR+den',   listed: 2850, leased: 2900, days: 17 },
  { n: 'Yonge & Eg',      u: '2BR',       listed: 3250, leased: 3200, days: 21 },
  { n: 'The Annex',       u: '1BR',       listed: 2400, leased: 2400, days: 9 },
  { n: 'Distillery',      u: '1BR',       listed: 2700, leased: 2675, days: 13 },
  { n: 'Fort York',       u: '2BR',       listed: 3100, leased: 3150, days: 16 },
  { n: 'Leslieville',     u: '2BR+den',   listed: 3550, leased: 3500, days: 20 },
];

function RecentLeases({ layout }) {
  return (
    <section id="leases" className="section leases-sec">
      <div className="wrap">
        <Reveal as="div" className="kicker">
          <span className="num-tag">05</span>
          <span className="line"/>
          <span className="label">Recent leases</span>
        </Reveal>
        <div className="leases-head">
          <Reveal as="h2">Nine recent leases. No names, no photos. Just data.</Reveal>
          <Reveal as="p" className="leases-lede">
            Anonymized at the unit level, accurate at the deal level. The pattern is the
            proof — not any single line.
          </Reveal>
        </div>

        {layout === 'cards' ? (
          <Reveal as="div" className="leases-grid">
            {LEASES.map((l, i) => {
              const delta = l.leased - l.listed;
              return (
                <div key={i} className="lease-card card">
                  <div className="lease-card-top">
                    <span className="label">{l.n}</span>
                    <span className="lease-card-u">{l.u}</span>
                  </div>
                  <div className="lease-card-rent num">${l.leased.toLocaleString()}<span className="lease-card-rent-mo">/mo</span></div>
                  <div className="lease-card-meta">
                    <div className="lease-card-row">
                      <span>Listed</span>
                      <span className="num">${l.listed.toLocaleString()}</span>
                    </div>
                    <div className="lease-card-row">
                      <span>Δ vs. asking</span>
                      <span className={`num ${delta >= 0 ? 'acc' : ''}`}>{delta >= 0 ? '+' : '−'}${Math.abs(delta)}</span>
                    </div>
                    <div className="lease-card-row">
                      <span>Days to lease</span>
                      <span className="num">{l.days}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </Reveal>
        ) : (
          <Reveal as="div" className="leases-table-wrap card">
            <table className="dataTable leases-table">
              <thead>
                <tr>
                  <th>Neighborhood</th>
                  <th>Unit</th>
                  <th>Listed</th>
                  <th>Leased</th>
                  <th>Δ</th>
                  <th>Days</th>
                </tr>
              </thead>
              <tbody>
                {LEASES.map((l, i) => {
                  const delta = l.leased - l.listed;
                  return (
                    <tr key={i}>
                      <td>{l.n}</td>
                      <td>{l.u}</td>
                      <td className="num-cell">${l.listed.toLocaleString()}</td>
                      <td className="num-cell">${l.leased.toLocaleString()}</td>
                      <td className={`num-cell ${delta >= 0 ? 'acc' : ''}`}>{delta >= 0 ? '+' : '−'}${Math.abs(delta)}</td>
                      <td className="num-cell">{l.days}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Reveal>
        )}

        <Reveal as="div" className="leases-foot">
          <span className="leases-foot-num"><CountUp to={99.4} decimals={1} suffix="%"/> </span>
          <span className="leases-foot-label">of asking rent achieved across closed 2025 leases.</span>
        </Reveal>
      </div>
    </section>
  );
}

function Pricing({ onOpenForm }) {
  return (
    <section id="pricing" className="section pricing-sec">
      <div className="wrap">
        <Reveal as="div" className="kicker">
          <span className="num-tag">06</span>
          <span className="line"/>
          <span className="label">Pricing & guarantee terms</span>
        </Reveal>
        <Reveal as="h2" className="pricing-h">No estimates. No asterisks. Visible from the homepage.</Reveal>

        <div className="pricing-grid">
          <Reveal as="div" className="pricing-card card">
            <div className="pricing-card-eyebrow label">Flat fee · all-in</div>
            <div className="pricing-card-price">
              <span className="pricing-card-amt num">One month's rent</span>
            </div>
            <div className="pricing-card-sub">Payable on signed lease. Nothing payable up front, nothing payable if we don't deliver.</div>
            <ul className="pricing-list">
              <li><span className="t">›</span> Pricing analysis & professional photography</li>
              <li><span className="t">›</span> Listed across all major platforms (14)</li>
              <li><span className="t">›</span> All showings, screening, and verification</li>
              <li><span className="t">›</span> Lease drafting and execution</li>
              <li><span className="t">›</span> Weekly written reports throughout</li>
            </ul>
          </Reveal>

          <Reveal as="div" className="pricing-card pricing-guarantee card">
            <div className="pricing-card-eyebrow label" style={{ color: 'var(--accent)' }}>The 21-day guarantee</div>
            <div className="pricing-card-price">
              <span className="pricing-card-amt num">Day 22 → you don't pay.</span>
            </div>
            <div className="pricing-card-sub">In plain English, in three bullets, on the homepage.</div>
            <ol className="pricing-list pricing-list-num">
              <li><span className="t num">01</span> If no qualified tenant has signed by end of day 21, the fee is suspended. We continue to work without invoicing.</li>
              <li><span className="t num">02</span> If we lease the unit afterward, the original flat fee applies — never any escalation.</li>
              <li><span className="t num">03</span> Exclusions are listed once, plainly: owners requesting list pricing &gt;5% above our recommended range, or units with active building disputes.</li>
            </ol>
          </Reveal>
        </div>

        <Reveal as="div" className="pricing-cta">
          <button className="btn btn-primary" onClick={onOpenForm}>
            Get Your Leasing Timeline
            <span className="arr">→</span>
          </button>
          <span className="pricing-cta-aside">A 60-second form returns an estimated days-to-lease, suggested rent, and recommended listing date.</span>
        </Reveal>
      </div>
    </section>
  );
}

const FAQS = [
  { q: 'What if my unit is priced above market?',
    a: 'We give you a recommended range with the comparable-unit data behind it. If you choose to list more than 5% above that range, the 21-day guarantee is suspended for that listing — the rest of the engagement continues unchanged. We will tell you, in writing, before you sign.' },
  { q: 'What happens on day 22 if it isn\'t leased?',
    a: 'The fee is suspended and we continue to work without invoicing until a qualified tenant signs. When that happens, the original flat fee applies — never any escalation, never any late penalty on you.' },
  { q: 'Do you handle showings for out-of-town owners?',
    a: 'Yes. Most of our owners do not attend a single showing. We host, we filter, and the weekly report contains anything worth knowing — never a list of every email.' },
  { q: 'What\'s your tenant screening process, exactly?',
    a: 'Five layers, published above on this page: credit, income-to-rent ratio, employment verification, two prior-landlord references contacted by phone, and document authentication. We do not accept applicants who clear four of the five.' },
  { q: 'How do you market the listing?',
    a: 'Pricing analysis on day one, photography on day two, listings live on day three across fourteen platforms. We do not pay for "premium" placements that do not measurably move time-to-lease.' },
  { q: 'What\'s the fee, exactly?',
    a: 'One month\'s rent, flat, payable only on signed lease. There is no listing fee, no photography fee, no early-termination fee. The number on the homepage is the number on the invoice.' },
  { q: 'Can I review applications before you accept one?',
    a: 'Yes. Every application is presented to you with the screening summary attached. We recommend; you decide. No tenant is signed without your explicit approval.' },
  { q: 'What if I already have an agent?',
    a: 'Then keep them. We do not work around existing exclusive listing agreements, and we will say so plainly if you ask us to. If the agreement has expired or is non-exclusive, we are happy to talk.' },
];

function FAQ() {
  const [open, setOpen] = React.useState(0);
  return (
    <section className="section faq-sec">
      <div className="wrap">
        <Reveal as="div" className="kicker">
          <span className="num-tag">07</span>
          <span className="line"/>
          <span className="label">Frequently asked</span>
        </Reveal>
        <Reveal as="h2" className="faq-h">Eight questions every landlord actually asks.</Reveal>

        <div className="faq-list">
          {FAQS.map((f, i) => (
            <Reveal as="div" key={i} className={`faq-item ${open === i ? 'open' : ''}`}>
              <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                <span className="faq-q-num num">0{i + 1}</span>
                <span className="faq-q-text">{f.q}</span>
                <span className="faq-q-icon" aria-hidden="true">{open === i ? '−' : '+'}</span>
              </button>
              <div className="faq-a-wrap">
                <div className="faq-a">{f.a}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ onOpenForm, onOpenCall }) {
  return (
    <section className="section final-sec">
      <div className="wrap final-inner">
        <Reveal as="div" className="eyebrow"><span className="dot"/>One decision, two paths</Reveal>
        <Reveal as="h2" className="final-h">Find out how fast your condo would lease.</Reveal>
        <Reveal as="p" className="final-sub">
          A 60-second form returns an estimated days-to-lease, a suggested rent range, and
          a recommended listing date. No call required unless you ask for one.
        </Reveal>
        <Reveal as="div" className="final-ctas">
          <button className="btn btn-primary" onClick={onOpenForm}>
            Get Your Leasing Timeline <span className="arr">→</span>
          </button>
          <button className="btn btn-ghost" onClick={onOpenCall}>
            Book a 15-minute call
          </button>
        </Reveal>
        <Reveal as="p" className="final-fineprint">
          No pressure. No follow-up calls unless you ask.
        </Reveal>
      </div>
    </section>
  );
}

function Footer({ logoVariant }) {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <Wordmark variant={logoVariant} />
          <p className="footer-line">A 21-day leasing system for Toronto condo owners.</p>
        </div>
        <div className="footer-cols">
          <div>
            <div className="label footer-h">The page</div>
            <a href="#how" className="footer-link">How It Works</a>
            <a href="#pricing" className="footer-link">Pricing</a>
            <a href="#leases" className="footer-link">Recent Leases</a>
          </div>
          <div>
            <div className="label footer-h">Operations</div>
            <a className="footer-link">hello@fastlease.ca</a>
            <a className="footer-link">+1 (416) 555-0121</a>
            <a className="footer-link">Brokerage of record</a>
          </div>
          <div>
            <div className="label footer-h">Coverage</div>
            <div className="footer-link footer-static">Downtown · East End</div>
            <div className="footer-link footer-static">Midtown · Waterfront</div>
            <div className="footer-link footer-static">98 buildings · 12 districts</div>
          </div>
        </div>
      </div>
      <div className="wrap footer-rule">
        <hr className="divider"/>
        <div className="footer-fine">
          <span>© 2026 FastLease Operations Inc.</span>
          <span>Brokerage licensed in Ontario.</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  Nav, Hero, TimelineSection, ProofBar, ProblemReframe, HowItWorks,
  Screening, RecentLeases, Pricing, FAQ, FinalCTA, Footer,
});
