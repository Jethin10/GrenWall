import { useEffect, useState } from 'react';
import { ScrollTrigger } from './lib/gsap';
import { SmoothScroll } from './components/SmoothScroll';
import { CustomCursor } from './components/CustomCursor';
import { Preloader } from './components/Preloader';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Manifesto } from './components/Manifesto';
import { GapInterstitial } from './components/GapInterstitial';
import { WhatWeBuild } from './components/WhatWeBuild';
import { WhatWeDo } from './components/WhatWeDo';
import { WhyGrenwall } from './components/WhyGrenwall';
import { Marquee } from './components/Marquee';
import { FAQ } from './components/FAQ';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';

function App() {
  const [introDone, setIntroDone] = useState(false);

  // One global re-measure after every section has mounted. React finishes
  // mounting after the window 'load' refresh ScrollTrigger does on its own,
  // so triggers created early would otherwise keep positions measured before
  // the pinned sections injected their spacers.
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <SmoothScroll>
      <Preloader onComplete={() => setIntroDone(true)} />
      <CustomCursor />
      <Nav introDone={introDone} />
      <div className="grain-overlay" aria-hidden="true" />
      <main>
        <Hero introDone={introDone} />
        <Manifesto />
        <GapInterstitial />
        <WhatWeBuild />
        <WhatWeDo />
        <WhyGrenwall />
        <Marquee text="Agents · Workflows · Integrations · Chat · Voice · Audits ·" />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </SmoothScroll>
  );
}

export default App;
