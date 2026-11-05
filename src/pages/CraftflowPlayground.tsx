import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../lib/useReducedMotion';

const chapters = [
  { word: 'idea.', label: 'The spark', title: 'It starts with a different thought.', copy: 'An observation. A question. A better way to tell your story. We find the idea worth building around.' },
  { word: 'form.', label: 'The identity', title: 'Then it finds its own language.', copy: 'Type, colour, composition and a point of view. We give your idea a recognisable identity, down to the smallest detail.' },
  { word: 'impact.', label: 'The connection', title: 'And becomes something people feel.', copy: 'Across your website, your content and your next campaign. A clear idea, carried all the way into the world.' },
];
type Particle = { x: number; y: number; vx: number; vy: number; tx: number; ty: number; seed: number; gold: boolean };

function ParticleType({ word, reduced }: { word: string; reduced: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wordRef = useRef(word);
  const targetRef = useRef<(() => void) | null>(null);
  useEffect(() => { wordRef.current = word; targetRef.current?.(); }, [word]);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || reduced) return;
    const sample = document.createElement('canvas');
    const ink = sample.getContext('2d', { willReadFrequently: true });
    if (!ink) return;
    let width = 1, height = 1, frame = 0, previous = 0, phase = 0;
    let visible = false, disposed = false;
    let particles: Particle[] = [];
    const pointer = { x: -1000, y: -1000, active: false };
    const target = () => {
      ink.clearRect(0, 0, width, height);
      const size = Math.min(width * .3, height * .65);
      ink.font = `600 ${size}px 'Inter Variable', sans-serif`;
      const measured = ink.measureText(wordRef.current).width;
      ink.font = `600 ${size * Math.min(1, width * .88 / measured)}px 'Inter Variable', sans-serif`;
      ink.textAlign = 'center'; ink.textBaseline = 'middle'; ink.fillStyle = '#fff';
      ink.fillText(wordRef.current, width / 2, height * .48);
      const pixels = ink.getImageData(0, 0, width, height).data;
      const points: { x: number; y: number }[] = [];
      const step = width < 600 ? 3 : 4;
      for (let y = 0; y < height; y += step) for (let x = 0; x < width; x += step) {
        if (pixels[(y * width + x) * 4 + 3] > 120) points.push({ x, y });
      }
      // Stable shuffle spreads each morph across the whole word.
      for (let i = points.length - 1; i > 0; i--) {
        const j = (i * 16807 + 37) % (i + 1);
        [points[i], points[j]] = [points[j], points[i]];
      }
      const count = Math.min(width < 600 ? 1500 : 4200, points.length);
      particles = Array.from({ length: count }, (_, i) => {
        const point = points[Math.floor(i * points.length / count)];
        const old = particles[i], seed = (i * 2.399963) % (Math.PI * 2);
        return { x: old?.x ?? width / 2 + Math.cos(seed) * width * .42, y: old?.y ?? height / 2 + Math.sin(seed) * height * .42, vx: old?.vx ?? 0, vy: old?.vy ?? 0, tx: point.x, ty: point.y, seed, gold: i % 13 === 0 };
      });
      canvas.dataset.particles = String(count); canvas.dataset.word = wordRef.current;
    };
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(bounds.width)); height = Math.max(1, Math.round(bounds.height));
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = width * dpr; canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); sample.width = width; sample.height = height; target();
    };
    const draw = (time: number) => {
      frame = 0;
      if (!visible || document.hidden || disposed) return;
      const delta = Math.min((time - previous) / 16.67 || 1, 2); previous = time; phase += .009 * delta;
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(232,232,227,.07)'; ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath(); ctx.ellipse(width / 2, height * .48, width * (.39 + i * .035), height * (.24 + i * .025), -.25 + i * .24 + Math.sin(phase * .18) * .12, 0, Math.PI * 2); ctx.stroke();
      }
      const radius = width < 600 ? 65 : 115;
      for (const p of particles) {
        const dx = p.x - pointer.x, dy = p.y - pointer.y, distance = Math.hypot(dx, dy);
        if (pointer.active && distance < radius) {
          const force = (1 - distance / radius) * 3.8 * delta;
          p.vx += dx / Math.max(distance, 1) * force; p.vy += dy / Math.max(distance, 1) * force;
        }
        p.vx = (p.vx + (p.tx + Math.sin(phase + p.seed) * 1.4 - p.x) * .022 * delta) * Math.pow(.84, delta);
        p.vy = (p.vy + (p.ty + Math.cos(phase + p.seed) * 1.4 - p.y) * .022 * delta) * Math.pow(.84, delta);
        p.x += p.vx * delta; p.y += p.vy * delta;
        ctx.fillStyle = p.gold ? '#d6b25a' : 'rgba(243,243,241,.88)';
        const dot = width < 600 ? 1.4 : 1.9; ctx.fillRect(p.x, p.y, dot, dot);
      }
      if (pointer.active) { ctx.beginPath(); ctx.arc(pointer.x, pointer.y, 18, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(214,178,90,.6)'; ctx.stroke(); }
      canvas.dataset.ready = 'true'; frame = requestAnimationFrame(draw);
    };
    const start = () => {
      if (visible && !document.hidden && !frame) { previous = performance.now(); frame = requestAnimationFrame(draw); }
      if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0; }
    };
    const move = (event: PointerEvent) => { const r = canvas.getBoundingClientRect(); pointer.x = event.clientX - r.left; pointer.y = event.clientY - r.top; pointer.active = true; };
    const leave = () => { pointer.active = false; };
    const burst = (event: PointerEvent) => {
      move(event);
      for (const p of particles) {
        const dx = p.x - pointer.x, dy = p.y - pointer.y, d = Math.max(12, Math.hypot(dx, dy)), force = Math.min(35, 1400 / d);
        p.vx += dx / d * force; p.vy += dy / d * force;
      }
    };
    targetRef.current = target; resize();
    document.fonts.ready.then(() => { if (!disposed) target(); });
    const observer = new ResizeObserver(resize); observer.observe(canvas);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (!visible && frame) { cancelAnimationFrame(frame); frame = 0; } start(); });
    intersection.observe(canvas);
    canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerdown', burst);
    canvas.addEventListener('pointerleave', leave); canvas.addEventListener('pointerup', leave); canvas.addEventListener('pointercancel', leave);
    document.addEventListener('visibilitychange', start);
    return () => {
      disposed = true; cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect(); targetRef.current = null;
      canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerdown', burst);
      canvas.removeEventListener('pointerleave', leave); canvas.removeEventListener('pointerup', leave); canvas.removeEventListener('pointercancel', leave);
      document.removeEventListener('visibilitychange', start);
    };
  }, [reduced]);
  return <div className="cf-particle-type"><span className="cf-particle-fallback" aria-hidden="true">{word}</span>{!reduced && <canvas ref={canvasRef} aria-hidden="true" />}</div>;
}

export default function CraftflowPlayground() {
  const rootRef = useRef<HTMLElement>(null);
  const [chapter, setChapter] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    const media = window.matchMedia('(min-width: 901px) and (min-height: 651px)');
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!media.matches) return;
      const bounds = root.getBoundingClientRect();
      // Only auto-advance while the stage occupies the viewport; keyboard or
      // chapter selection outside it must not be overwritten by unrelated scrolls.
      if (bounds.top > innerHeight || bounds.bottom < 0) return;
      const progress = Math.max(0, Math.min(.999, -bounds.top / Math.max(1, bounds.height - innerHeight)));
      setChapter(Math.floor(progress * 3)); root.style.setProperty('--cf-progress', String(progress));
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', scroll, { passive: true }); window.addEventListener('resize', scroll); media.addEventListener('change', scroll); update();
    return () => { window.removeEventListener('scroll', scroll); window.removeEventListener('resize', scroll); media.removeEventListener('change', scroll); cancelAnimationFrame(frame); };
  }, [reduced]);
  const choose = (index: number) => {
    const root = rootRef.current;
    if (root && !reduced && window.matchMedia('(min-width: 901px) and (min-height: 651px)').matches) {
      const offset = index === 0 ? .03 : index === 1 ? .5 : .97;
      window.scrollTo({ top: scrollY + root.getBoundingClientRect().top + (root.offsetHeight - innerHeight) * offset, behavior: 'instant' });
    }
    setChapter(index);
  };
  return <section id="playground" ref={rootRef} className={`cf-playground${reduced ? ' cf-playground--still' : ''}`} aria-labelledby="cf-playground-title" data-chapter={chapter}>
    <div className="cf-playground-sticky">
      <div className="cf-playground-top"><span>Craftflow / In motion</span><span>A thought, taking shape</span></div>
      <div className="cf-playground-heading"><h2 id="cf-playground-title">Nothing starts <em>fully formed.</em></h2><p>Neither do the brands you remember.</p></div>
      <ParticleType word={chapters[chapter].word} reduced={reduced} />
      <div className="cf-playground-bottom">
        <div className="cf-chapters" aria-label="Explore how an idea takes shape">{chapters.map((item, index) => <button key={item.word} type="button" aria-pressed={chapter === index} onClick={() => choose(index)}><span>0{index + 1}</span>{item.label}<i aria-hidden="true" /></button>)}</div>
        <div className="cf-chapter-copy" aria-live="polite"><h3>{chapters[chapter].title}</h3><p>{chapters[chapter].copy}</p></div>
      </div>
      <div className="cf-playground-instructions"><span>{reduced ? 'Explore each chapter above' : 'Move through the letters. Tap to make a little chaos.'}</span><a href="#services">Explore our services ↗</a></div>
      <div className="cf-playground-progress" aria-hidden="true" />
    </div>
  </section>;
}
