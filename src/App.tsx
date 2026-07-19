import { useCallback, useEffect, useState } from 'react';
import { ScrollTrigger } from './lib/gsap';
import { SmoothScroll } from './components/SmoothScroll';
import { Preloader } from './components/Preloader';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { Contact, CursorSheen, Fit, Method, Offer, WorldBand } from './components/PremiumSections';
import { copy } from './tokens';

function App() {
  const [introDone, setIntroDone] = useState(false);
  const handleIntroComplete = useCallback(() => setIntroDone(true), []);

  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [introDone]);

  return (
    <SmoothScroll>
      <Preloader onComplete={handleIntroComplete} />
      <Nav introDone={introDone} />
      <main>
        <Hero introDone={introDone} />
        <div className="dark-shell">
          <Marquee text={copy.motto} />
          <Offer />
        </div>
        <div className="light-shell">
          <CursorSheen />
          <Method />
          <Fit />
        </div>
        <div className="dark-shell">
          <WorldBand />
          <Contact />
        </div>
      </main>
      <div className="site-grain" aria-hidden="true" />
    </SmoothScroll>
  );
}

export default App;
