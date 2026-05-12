// form-modal.jsx — Get Your Leasing Timeline modal
// A 3-step form that returns an estimated days-to-lease, suggested rent, and listing date.

function FormModal({ open, onClose, mode }) {
  // mode: 'timeline' | 'call'
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState({
    address: '',
    neighborhood: 'King West',
    bedrooms: '1BR',
    targetRent: '',
    move: 'flexible',
    name: '',
    email: '',
  });

  React.useEffect(() => { if (open) { setStep(0); } }, [open]);
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && open) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const STEPS = 4; // 3 input + 1 result

  // Simple deterministic estimator
  const estimate = React.useMemo(() => {
    const base = { 'Jr 1BR': 14, '1BR': 16, '1BR+den': 17, '2BR': 18, '2BR+den': 19, '3BR': 21 }[data.bedrooms] || 16;
    const seasonal = (() => {
      const m = new Date().getMonth();
      if (m >= 4 && m <= 7) return -2;
      if (m === 11 || m === 0) return +2;
      return 0;
    })();
    const target = parseInt((data.targetRent || '').replace(/[^0-9]/g, ''), 10) || 0;
    const recRent = ({ 'Jr 1BR': 2200, '1BR': 2650, '1BR+den': 2900, '2BR': 3300, '2BR+den': 3550, '3BR': 4200 })[data.bedrooms];
    let over = 0;
    if (target && target > recRent * 1.05) over = Math.min(6, Math.round((target - recRent * 1.05) / 60));
    const days = Math.max(7, Math.min(21, base + seasonal + over));
    const today = new Date();
    const listDate = new Date(today.getTime() + 3 * 86400000);
    const leaseDate = new Date(today.getTime() + (days + 3) * 86400000);
    const fmt = (d) => d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
    return {
      days,
      rentLow: Math.round((recRent * 0.97) / 25) * 25,
      rentHigh: Math.round((recRent * 1.03) / 25) * 25,
      listDate: fmt(listDate),
      leaseBy: fmt(leaseDate),
      over,
    };
  }, [data.bedrooms, data.targetRent]);

  if (mode === 'call') {
    return (
      <div className={`fm-scrim ${open ? 'open' : ''}`} onClick={onClose}>
        <div className="fm" onClick={(e) => e.stopPropagation()}>
          <div className="fm-head">
            <div>
              <div className="fm-eyebrow">15-minute call</div>
              <h3 className="fm-step-h" style={{ marginTop: 8 }}>Pick a window that works.</h3>
            </div>
            <button className="fm-close" onClick={onClose} aria-label="Close">×</button>
          </div>
          <div className="fm-body">
            <p className="fm-step-sub">We'll send a short calendar invite. No deck, no pitch — fifteen minutes on what you'd want from us, and whether we can deliver it for your unit.</p>
            <div className="fm-field">
              <label className="fm-label">Your name</label>
              <input className="fm-input" value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="Full name"/>
            </div>
            <div className="fm-field">
              <label className="fm-label">Email</label>
              <input type="email" className="fm-input" value={data.email} onChange={(e) => set('email', e.target.value)} placeholder="you@domain.com"/>
            </div>
            <div className="fm-field">
              <label className="fm-label">Preferred time</label>
              <select className="fm-select" defaultValue="">
                <option value="" disabled>Select a window</option>
                <option>Weekdays, mornings</option>
                <option>Weekdays, afternoons</option>
                <option>Weekday evenings</option>
                <option>Weekend</option>
              </select>
            </div>
          </div>
          <div className="fm-foot">
            <span className="fm-back" style={{ color: 'var(--ink-mute)' }}>We respond within one business day.</span>
            <button className="btn btn-primary" onClick={onClose} style={{ height: 44, padding: '0 18px', fontSize: 14 }}>
              Send request <span className="arr">→</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fm-scrim ${open ? 'open' : ''}`} onClick={onClose}>
      <div className="fm" onClick={(e) => e.stopPropagation()}>
        <div className="fm-head">
          <div>
            <div className="fm-eyebrow">Leasing timeline · 60 seconds</div>
          </div>
          <button className="fm-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="fm-progress">
          {Array.from({ length: STEPS }, (_, i) => (
            <div key={i} className={`fm-progress-step ${i < step ? 'done' : i === step ? 'active' : ''}`}/>
          ))}
        </div>

        {step === 0 && (
          <div className="fm-body">
            <h3 className="fm-step-h">Where's the unit?</h3>
            <p className="fm-step-sub">We use building-level comparables, so the neighborhood matters more than the street address.</p>
            <div className="fm-field">
              <label className="fm-label">Neighborhood</label>
              <select className="fm-select" value={data.neighborhood} onChange={(e) => set('neighborhood', e.target.value)}>
                {['King West','Liberty Village','CityPlace','St. Lawrence','Yonge & Eg','The Annex','Distillery','Fort York','Leslieville','Other Toronto'].map((n) => <option key={n}>{n}</option>)}
              </select>
            </div>
            <div className="fm-field">
              <label className="fm-label">Building or address (optional)</label>
              <input className="fm-input" value={data.address} onChange={(e) => set('address', e.target.value)} placeholder="e.g. Ice Condos, or 38 Niagara St"/>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="fm-body">
            <h3 className="fm-step-h">What kind of unit?</h3>
            <p className="fm-step-sub">Bedroom count determines time-to-lease more than any other input.</p>
            <div className="fm-field">
              <label className="fm-label">Bedrooms</label>
              <div className="fm-radio-group">
                {['Jr 1BR','1BR','1BR+den','2BR','2BR+den','3BR'].map((b) => (
                  <button key={b} className={`fm-radio ${data.bedrooms === b ? 'on' : ''}`} onClick={() => set('bedrooms', b)}>{b}</button>
                ))}
              </div>
            </div>
            <div className="fm-field">
              <label className="fm-label">Target rent (optional)</label>
              <input className="fm-input" inputMode="numeric" value={data.targetRent} onChange={(e) => set('targetRent', e.target.value)} placeholder="e.g. $2,800"/>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fm-body">
            <h3 className="fm-step-h">When does it need to be leased by?</h3>
            <p className="fm-step-sub">Optional. We'll always work to twenty-one days — this just helps us flag anything tighter than that.</p>
            <div className="fm-field">
              <label className="fm-label">Move-in window</label>
              <div className="fm-radio-group">
                {[{k:'urgent',l:'< 30 days'},{k:'soon',l:'30–60 days'},{k:'flexible',l:'Flexible'}].map((o) => (
                  <button key={o.k} className={`fm-radio ${data.move === o.k ? 'on' : ''}`} onClick={() => set('move', o.k)}>{o.l}</button>
                ))}
              </div>
            </div>
            <div className="fm-field">
              <label className="fm-label">Email (for the report)</label>
              <input type="email" className="fm-input" value={data.email} onChange={(e) => set('email', e.target.value)} placeholder="you@domain.com"/>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fm-result">
            <div className="fm-eyebrow" style={{ marginBottom: 8 }}>Your estimated timeline</div>
            <h3 className="fm-step-h" style={{ marginBottom: 4 }}>
              {data.bedrooms} in {data.neighborhood}
            </h3>
            <p className="fm-step-sub" style={{ marginBottom: 20 }}>
              Based on comparable units leased in the last 90 days. Numbers refresh quarterly.
            </p>

            <div className="fm-result-row">
              <div>
                <div className="fm-result-label">Estimated days to lease</div>
                <div className="fm-result-note" style={{ marginTop: 4 }}>Average across recent comparables.</div>
              </div>
              <div className="fm-result-val acc">{estimate.days} <span style={{ fontSize: 16, color: 'var(--ink-mute)' }}>days</span></div>
            </div>
            <div className="fm-result-row">
              <div>
                <div className="fm-result-label">Suggested rent range</div>
                <div className="fm-result-note" style={{ marginTop: 4 }}>Within ±3% of recent comparables.</div>
              </div>
              <div className="fm-result-val num">${estimate.rentLow.toLocaleString()}–${estimate.rentHigh.toLocaleString()}</div>
            </div>
            <div className="fm-result-row">
              <div>
                <div className="fm-result-label">Recommended list date</div>
                <div className="fm-result-note" style={{ marginTop: 4 }}>Allows two days for photography & pricing.</div>
              </div>
              <div className="fm-result-val">{estimate.listDate}</div>
            </div>
            <div className="fm-result-row">
              <div>
                <div className="fm-result-label">Likely signed by</div>
                <div className="fm-result-note" style={{ marginTop: 4 }}>Inside the 21-day guarantee window.</div>
              </div>
              <div className="fm-result-val">{estimate.leaseBy}</div>
            </div>

            {estimate.over > 0 && (
              <div style={{ marginTop: 20, padding: '14px 16px', background: 'color-mix(in oklab, var(--accent), transparent 88%)', borderRadius: 10, fontSize: 14, color: 'var(--ink-soft)' }}>
                Heads-up: your target rent is above our suggested range. We can still list it — the guarantee terms change above 5% over our recommendation.
              </div>
            )}

            <div className="fm-result-cta">
              <button className="btn btn-primary" onClick={onClose}>Email me this estimate <span className="arr">→</span></button>
              <button className="btn btn-ghost" onClick={() => setStep(0)}>Start over</button>
            </div>
          </div>
        )}

        {step < 3 && (
          <div className="fm-foot">
            <button className="fm-back" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{ opacity: step === 0 ? .3 : 1 }}>
              ← Back
            </button>
            <button className="btn btn-primary" onClick={() => setStep(step + 1)} style={{ height: 44, padding: '0 18px', fontSize: 14 }}>
              {step === 2 ? 'See timeline' : 'Continue'} <span className="arr">→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { FormModal });
