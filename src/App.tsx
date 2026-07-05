import { useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { ScrollTrigger } from './lib/gsap';
import { SmoothScroll } from './components/SmoothScroll';
import { CustomCursor } from './components/CustomCursor';
import { Starfield } from './components/Starfield';
import { BlackHoleField } from './components/BlackHoleField';
import { FallController } from './components/FallController';
import { HorizonCrossing } from './components/HorizonCrossing';
import { Preloader } from './components/Preloader';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { CropMarkDivider } from './components/CropMarkDivider';
import { TreeConnector } from './components/TreeConnector';
import { WhatWeBuild } from './components/WhatWeBuild';
import { CapabilityTiles } from './components/CapabilityTiles';
import { WhatWeDo } from './components/WhatWeDo';
import { WhyGrenwall } from './components/WhyGrenwall';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';

function App() {
  const [introDone, setIntroDone] = useState(false);

  // One global re-measure after every section has mounted. React finishes
  // mounting after the window 'load' refresh ScrollTrigger does on its own,
  // so triggers created early (index rail, black-hole flight, reveals) would
  // otherwise keep start/end positions measured before the pinned sections
  // injected their spacers — skewing everything downstream of a pin.
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <Starfield />
        <BlackHoleField />
        <FallController />
        <HorizonCrossing />
        <Preloader onComplete={() => setIntroDone(true)} />
        <CustomCursor />
        <Nav />
        <div className="grain-overlay" aria-hidden="true" />
        <main>
          <Hero introDone={introDone} />
          <CropMarkDivider />
          <WhatWeBuild />
          <CropMarkDivider />
          <CapabilityTiles />
          <TreeConnector />
          <WhatWeDo />
          <CropMarkDivider />
          <WhyGrenwall />
          <TreeConnector />
          <CTA />
        </main>
        <Footer />
      </SmoothScroll>
    </MotionConfig>
  );
}

export default App;
