// app.jsx — root component, Tweaks wiring, mount

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "direction": "premium",
  "paper":     "warmest",
  "timeline":  "calendar",
  "leases":    "cards",
  "headline":  0,
  "logo":      "timestamp"
}/*EDITMODE-END*/;

function applyTheme(direction, paper) {
  const html = document.documentElement;
  html.setAttribute('data-direction', direction);
  html.setAttribute('data-paper', paper);
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [scrolled, setScrolled] = React.useState(false);
  const [showSticky, setShowSticky] = React.useState(false);
  const [modal, setModal] = React.useState(null); // 'timeline' | 'call' | null

  React.useEffect(() => { applyTheme(t.direction, t.paper); }, [t.direction, t.paper]);

  React.useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      setShowSticky(y > window.innerHeight * 0.7);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openTimeline = () => setModal('timeline');
  const openCall = () => setModal('call');
  const closeModal = () => setModal(null);

  return (
    <React.Fragment>
      <Nav onOpenForm={openTimeline} logoVariant={t.logo} scrolled={scrolled}/>
      <main>
        <Hero headlineIdx={t.headline} onOpenForm={openTimeline}/>
        <TimelineSection treatment={t.timeline}/>
        <ProofBar/>
        <ProblemReframe/>
        <HowItWorks/>
        <Screening/>
        <RecentLeases layout={t.leases}/>
        <Pricing onOpenForm={openTimeline}/>
        <FAQ/>
        <FinalCTA onOpenForm={openTimeline} onOpenCall={openCall}/>
      </main>
      <Footer logoVariant={t.logo}/>

      <FormModal open={!!modal} mode={modal || 'timeline'} onClose={closeModal}/>

      <div className={`sticky-cta ${showSticky ? 'show' : ''}`}>
        <button className="btn btn-primary" onClick={openTimeline}>
          Get Your Timeline <span className="arr">→</span>
        </button>
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Color direction"/>
        <TweakRadio
          label="Theme"
          value={t.direction}
          options={[
            { value: 'operator', label: 'Operator' },
            { value: 'premium',  label: 'Premium' },
            { value: 'precise',  label: 'Precise' },
          ]}
          onChange={(v) => setTweak('direction', v)}
        />
        <TweakRadio
          label="Paper"
          value={t.paper}
          options={[
            { value: 'warmest', label: 'Warmest' },
            { value: 'warm',    label: 'Warm' },
            { value: 'cool',    label: 'Cool' },
            { value: 'white',   label: 'White' },
          ]}
          onChange={(v) => setTweak('paper', v)}
        />

        <TweakSection label="Timeline treatment"/>
        <TweakRadio
          label="Visual"
          value={t.timeline}
          options={[
            { value: 'calendar', label: 'Calendar' },
            { value: 'beam',     label: 'Beam' },
            { value: 'gantt',    label: 'Gantt' },
          ]}
          onChange={(v) => setTweak('timeline', v)}
        />

        <TweakSection label="Recent leases"/>
        <TweakRadio
          label="Layout"
          value={t.leases}
          options={[
            { value: 'cards', label: 'Cards' },
            { value: 'table', label: 'Table' },
          ]}
          onChange={(v) => setTweak('leases', v)}
        />

        <TweakSection label="Hero headline"/>
        <TweakRadio
          label="Variant"
          value={String(t.headline)}
          options={[
            { value: '0', label: '21 days' },
            { value: '1', label: 'A date' },
            { value: '2', label: 'Or you don\'t pay' },
          ]}
          onChange={(v) => setTweak('headline', parseInt(v, 10))}
        />

        <TweakSection label="Logo mark"/>
        <TweakRadio
          label="Mark"
          value={t.logo}
          options={[
            { value: 'timestamp', label: 'Timestamp' },
            { value: 'counter',   label: 'Counter' },
            { value: 'abstract',  label: 'Abstract' },
            { value: 'wordmark',  label: 'None' },
          ]}
          onChange={(v) => setTweak('logo', v)}
        />
      </TweaksPanel>
    </React.Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
