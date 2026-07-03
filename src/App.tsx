import { useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { SmoothScroll } from './components/SmoothScroll';
import { CustomCursor } from './components/CustomCursor';
import { TravelingCrystal } from './components/TravelingCrystal';
import { SectionIndex } from './components/SectionIndex';
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

  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <TravelingCrystal />
        <SectionIndex />
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
