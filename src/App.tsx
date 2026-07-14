import { useCallback, useEffect, useState } from 'react';
import { ScrollTrigger } from './lib/gsap';
import { SmoothScroll } from './components/SmoothScroll';
import { Preloader } from './components/Preloader';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import {
  Capabilities,
  Contact,
  Manifesto,
  Process,
  SelectedSystems,
} from './components/EditorialSections';

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
          <Manifesto />
          <Capabilities />
          <SelectedSystems />
          <Process />
          <Contact />
        </div>
      </main>
      <div className="site-grain" aria-hidden="true" />
    </SmoothScroll>
  );
}

export default App;
