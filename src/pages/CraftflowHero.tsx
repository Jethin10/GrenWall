import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../lib/useReducedMotion';
import { StudyArtwork } from './CraftflowStudies';
import { studies } from './craftflow-studies';
import { BoardArtwork } from './CraftflowBoard';
import './craftflow-hero.css';

const boardStudies = [2, 3, 1, 0, 6, 5, 4, 7];
const scatter = [
  [-16, -11, -12], [3, -17, 8], [18, -5, 13], [-21, 5, -7],
  [5, 1, -5], [19, 15, 11], [-8, 19, 9], [8, 24, -8],
];

export default function CraftflowHero() {
  const boardRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [loose, setLoose] = useState(false);
  const [activeStudy, setActiveStudy] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (activeStudy !== null && !dialog.open) dialog.showModal();
    if (activeStudy === null && dialog.open) dialog.close();
  }, [activeStudy]);

  useEffect(() => {
    const board = boardRef.current;
    if (!board || reduced || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    // One compositor transform per pointer frame. No animation loop at rest.
    let frame = 0;
    let x = 0, y = 0;
    const paint = () => {
      frame = 0;
      board.style.setProperty('--aim-x', `${x}deg`);
      board.style.setProperty('--aim-y', `${y}deg`);
    };
    const move = (event: PointerEvent) => {
      const rect = board.getBoundingClientRect();
      x = (event.clientX - rect.left - rect.width / 2) / rect.width * 4;
      y = (event.clientY - rect.top - rect.height / 2) / rect.height * -4;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const leave = () => { x = y = 0; if (!frame) frame = requestAnimationFrame(paint); };
    board.addEventListener('pointermove', move);
    board.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(frame);
      board.removeEventListener('pointermove', move);
      board.removeEventListener('pointerleave', leave);
    };
  }, [reduced]);

  const study = activeStudy === null ? null : studies[activeStudy];
  return <>
    <section className="cf-editorial" aria-labelledby="cf-editorial-title">
      <div className="cf-editorial-copy">
        <p className="cf-editorial-intro">Independent minds.<br />Distinctive brands.</p>
        <h1 id="cf-editorial-title"><span>Out of</span><span>the</span><span>ordinary<span className="cf-title-dot">.</span></span></h1>
        <div className="cf-editorial-description">
          <p>We build identities, digital experiences<br className="cf-desktop-break" /> and campaigns with a point of view.</p>
          <a className="cf-editorial-contact" href="#contact" aria-label="Start a Craftflow project"><span className="cf-contact-label">Let's make something</span><span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div className="cf-board-wrap">
        <div className="cf-board" ref={boardRef} data-layout={loose ? 'free' : 'grid'}>
          <div className="cf-board-plane">
            {boardStudies.map((studyIndex, index) => <button
              type="button" key={index} className={`cf-board-tile cf-board-tile--${index}`}
              style={{ '--tile-x': `${scatter[index][0]}%`, '--tile-y': `${scatter[index][1]}%`, '--tile-r': `${scatter[index][2]}deg`, '--tile-order': index } as React.CSSProperties}
              aria-label={`Explore ${studies[studyIndex].name}, ${studies[studyIndex].kind}. Studio concept.`}
              onAnimationEnd={event => { event.currentTarget.style.animation = 'none'; }} onClick={() => setActiveStudy(studyIndex)}
              onPointerEnter={() => setHovered(studyIndex)} onPointerLeave={() => setHovered(null)}
              onFocus={() => setHovered(studyIndex)} onBlur={() => setHovered(null)}
            ><div className="cf-board-tile-art"><BoardArtwork index={index} /></div><span className="cf-board-open" aria-hidden="true">↗</span></button>)}
          </div>
        </div>
        <div className="cf-board-caption">
          <span aria-live="polite">{hovered === null ? 'From the studio. A few explorations.' : `${studies[hovered].name} / ${studies[hovered].kind}`}</span>
          <button className="cf-reframe" type="button" aria-pressed={loose} onClick={() => setLoose(value => !value)}>
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d={loose ? 'M3 3h5v5H3zM12 3h5v5h-5zM3 12h5v5H3zM12 12h5v5h-5z' : 'm4 2 5 2-2 5-5-2Zm9 1 5 1-1 5-5-1ZM3 12l5-1 1 5-5 1Zm10 0 5 2-2 5-5-2Z'} fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>
            {loose ? 'Bring it together' : 'Break the grid'}
          </button>
        </div>
      </div>
      <div className="cf-editorial-foot"><span>Brand strategy, design & digital marketing</span><a href="#playground">A thought in motion <span aria-hidden="true">↓</span></a></div>
    </section>
    <dialog ref={dialogRef} className="cf-study-dialog" aria-labelledby="cf-study-title" onCancel={() => setActiveStudy(null)} onClose={() => setActiveStudy(null)} onClick={event => { if (event.target === event.currentTarget) setActiveStudy(null); }}>
      {study && <div className="cf-study-detail"><div className="cf-study-detail-art"><StudyArtwork index={activeStudy!} instance="detail" /></div><div className="cf-study-detail-copy"><button className="cf-study-close" type="button" autoFocus onClick={() => setActiveStudy(null)}>Close <span aria-hidden="true">×</span></button><span className="cf-study-kicker">Craftflow / Studio exploration</span><h2 id="cf-study-title">{study.name}</h2><span className="cf-study-kind">{study.kind}</span><p>{study.note}</p><small>An original studio concept, not a client case study.</small><a href="#contact" onClick={() => setActiveStudy(null)}>Have something in mind? <span aria-hidden="true">↗</span></a></div></div>}
    </dialog>
  </>;
}
