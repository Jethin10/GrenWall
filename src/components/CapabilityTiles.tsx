import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { gsap } from '../lib/gsap';
import { RevealText } from './RevealText';
import { AgentMark } from './AgentMark';
import { ClipReveal } from './ClipReveal';
import { useReducedMotion } from '../lib/useReducedMotion';
import { useIsMobile } from '../lib/useIsMobile';

const BONE = '#F3EFE6';
const EMBER = '#D8823A';
const VOID = '#050506';

function pulseNode(el: SVGCircleElement | null) {
  if (!el) return;
  gsap.fromTo(
    el,
    { opacity: 0, scale: 1 },
    { opacity: 1, scale: 1.5, duration: 0.2, ease: 'power2.out', yoyo: true, repeat: 1, transformOrigin: '50% 50%' },
  );
}

/* ---------- shared tile frame ---------- */

interface TileProps {
  title: string;
  caption: string;
  className?: string;
  delay?: number;
  children: ReactNode;
  onPlayChange: (playing: boolean) => void;
}

function Tile({ title, caption, className = '', delay = 0, children, onPlayChange }: TileProps) {
  return (
    <ClipReveal className={className} delay={delay}>
      <motion.div
        data-cursor="view"
        onMouseEnter={() => onPlayChange(true)}
        onMouseLeave={() => onPlayChange(false)}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="group flex h-full flex-col justify-between rounded-2xl border border-line bg-surface p-6 shadow-none transition-shadow duration-300 hover:shadow-[0_20px_45px_-22px_rgba(216,130,58,0.25)]"
      >
        <div className="flex flex-1 items-center justify-center">{children}</div>
        <div className="mt-5">
          <h3 className="font-display text-lg text-bone">{title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted">{caption}</p>
        </div>
      </motion.div>
    </ClipReveal>
  );
}

/** Same card, without the scroll-triggered clip-reveal — the horizontal slide itself is the reveal. */
function RowTile({ title, caption, className = '', children, onPlayChange }: Omit<TileProps, 'delay'>) {
  return (
    <motion.div
      data-cursor="view"
      onMouseEnter={() => onPlayChange(true)}
      onMouseLeave={() => onPlayChange(false)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`group flex shrink-0 flex-col justify-between rounded-2xl border border-line bg-surface p-8 shadow-none transition-shadow duration-300 hover:shadow-[0_20px_45px_-22px_rgba(216,130,58,0.25)] ${className}`}
    >
      {/* Scenes are shared with the mobile grid; the reel just shows them larger. */}
      <div className="flex flex-1 scale-[1.45] items-center justify-center">{children}</div>
      <div className="mt-5">
        <h3 className="font-display text-xl text-bone">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{caption}</p>
      </div>
    </motion.div>
  );
}

/* ---------- scene: a message sending itself ---------- */

function MessageScene({ playing }: { playing: boolean }) {
  const dotRef = useRef<SVGCircleElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const reducedMotion = useReducedMotion();
  const length = 62;

  useEffect(() => {
    const dot = dotRef.current;
    const line = lineRef.current;
    if (!dot || !line) return;
    gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });

    if (reducedMotion) {
      gsap.set(dot, { x: playing ? length : 0 });
      gsap.set(line, { strokeDashoffset: playing ? 0 : length });
      return;
    }

    if (playing) {
      const tl = gsap.timeline();
      tl.to(dot, { x: length, duration: 0.9, ease: 'power2.inOut' }).to(
        line,
        { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' },
        0,
      );
      return () => {
        tl.kill();
      };
    }
    gsap.to(dot, { x: 0, duration: 0.4, ease: 'power2.out' });
    gsap.to(line, { strokeDashoffset: length, duration: 0.4, ease: 'power2.out' });
  }, [playing, reducedMotion]);

  return (
    <svg viewBox="0 0 100 40" className="h-16 w-full" aria-hidden="true">
      <circle cx="19" cy="20" r="4" fill={BONE} opacity="0.35" />
      <circle cx="81" cy="20" r="4" fill="none" stroke={BONE} strokeOpacity="0.25" />
      <line ref={lineRef} x1="19" y1="20" x2="81" y2="20" stroke={EMBER} strokeWidth="1.5" />
      <circle ref={dotRef} cx="19" cy="20" r="3.5" fill={EMBER} className="motion-safe:animate-pulse" />
    </svg>
  );
}

/* ---------- scene (star): a spreadsheet row filling in, with a running cursor + a final flash ---------- */

function SpreadsheetScene({ playing }: { playing: boolean }) {
  const cellRefs = useRef<(SVGRectElement | null)[]>([]);
  const sumRef = useRef<SVGGElement>(null);
  const cursorRef = useRef<SVGRectElement>(null);
  const reducedMotion = useReducedMotion();
  const cols = [12, 34, 56, 78];
  const rows = [16, 30];

  useEffect(() => {
    const cells = cellRefs.current.filter(Boolean) as SVGRectElement[];
    const sum = sumRef.current;
    const cursor = cursorRef.current;
    if (!sum || !cursor) return;

    if (reducedMotion) {
      gsap.set(cells, { attr: { 'fill-opacity': playing ? 1 : 0 } });
      gsap.set(sum, { scale: playing ? 1 : 0, opacity: playing ? 1 : 0 });
      gsap.set(cursor, { opacity: 0 });
      return;
    }

    if (!playing) {
      gsap.to(cells, { attr: { 'fill-opacity': 0 }, stagger: 0.04, duration: 0.2, ease: 'power2.out' });
      gsap.to(sum, { scale: 0, opacity: 0, duration: 0.2, ease: 'power2.in' });
      gsap.to(cursor, { opacity: 0, duration: 0.15 });
      return;
    }

    const tl = gsap.timeline();
    cells.forEach((cell, i) => {
      const cx = Number(cell.getAttribute('x'));
      const cy = Number(cell.getAttribute('y'));
      tl.set(cursor, { x: cx, y: cy, opacity: 1 }, i * 0.09).to(
        cell,
        { attr: { 'fill-opacity': 1 }, duration: 0.3, ease: 'power2.out' },
        i * 0.09 + 0.05,
      );
    });
    const settleAt = cells.length * 0.09 + 0.1;
    const lastCell = cells[cells.length - 1];
    tl.to(cursor, { opacity: 0, duration: 0.15 }, cells.length * 0.09)
      .fromTo(sum, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2.2)' }, settleAt)
      .fromTo(
        lastCell,
        { scale: 1 },
        { scale: 1.2, duration: 0.15, ease: 'power2.inOut', yoyo: true, repeat: 1, transformOrigin: '50% 50%' },
        settleAt,
      );

    return () => {
      tl.kill();
    };
  }, [playing, reducedMotion]);

  return (
    <svg viewBox="0 0 100 56" className="h-24 w-full" aria-hidden="true">
      {[0, 1, 2].map((r) => (
        <line key={`h${r}`} x1="8" x2="92" y1={9 + r * 14} y2={9 + r * 14} stroke={BONE} strokeOpacity="0.14" />
      ))}
      {[0, 1, 2, 3, 4].map((c) => (
        <line key={`v${c}`} y1="9" y2="37" x1={8 + c * 21} x2={8 + c * 21} stroke={BONE} strokeOpacity="0.14" />
      ))}
      <line x1="8" x2="92" y1="43" y2="43" stroke={BONE} strokeOpacity="0.3" />
      {rows.map((y, ri) =>
        cols.map((x, ci) => {
          const idx = ri * cols.length + ci;
          return (
            <rect
              key={idx}
              ref={(el) => {
                cellRefs.current[idx] = el;
              }}
              x={x - 8}
              y={y - 5}
              width="16"
              height="9"
              rx="1.5"
              fill={EMBER}
              fillOpacity="0"
            />
          );
        }),
      )}
      <rect ref={cursorRef} width="1.5" height="9" fill={BONE} opacity="0" />
      <g ref={sumRef} style={{ opacity: 0 }}>
        <rect x="78" y="38" width="17" height="10" rx="1.5" fill={EMBER} />
      </g>
    </svg>
  );
}

/* ---------- scene: an invoice clearing ---------- */

function InvoiceScene({ playing }: { playing: boolean }) {
  const stampRef = useRef<SVGGElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const stamp = stampRef.current;
    if (!stamp) return;
    if (reducedMotion) {
      gsap.set(stamp, { scale: playing ? 1 : 0.4, opacity: playing ? 1 : 0, rotate: playing ? -12 : -22 });
      return;
    }
    if (playing) {
      gsap.fromTo(
        stamp,
        { scale: 0.4, opacity: 0, rotate: -22, transformOrigin: '65px 28px' },
        { scale: 1, opacity: 1, rotate: -12, duration: 0.55, ease: 'back.out(2.4)' },
      );
    } else {
      gsap.to(stamp, { scale: 0.4, opacity: 0, duration: 0.25, ease: 'power2.in' });
    }
  }, [playing, reducedMotion]);

  return (
    <svg viewBox="0 0 100 50" className="h-16 w-full" aria-hidden="true">
      <rect x="20" y="8" width="60" height="34" rx="3" fill="none" stroke={BONE} strokeOpacity="0.2" />
      <line x1="27" y1="18" x2="60" y2="18" stroke={BONE} strokeOpacity="0.18" strokeWidth="2" />
      <line x1="27" y1="25" x2="70" y2="25" stroke={BONE} strokeOpacity="0.18" strokeWidth="2" />
      <line x1="27" y1="32" x2="50" y2="32" stroke={BONE} strokeOpacity="0.18" strokeWidth="2" />
      <g ref={stampRef} style={{ opacity: 0 }}>
        <circle cx="65" cy="28" r="13" fill="none" stroke={EMBER} strokeWidth="2" />
        <path d="M59 28l4 4 8-8" fill="none" stroke={EMBER} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/* ---------- scene (star): leads routing through a proper two-level branching tree ---------- */

const TRUNK_D: Record<'L' | 'R', string> = {
  L: 'M50 48 C 50 38, 36 34, 28 28',
  R: 'M50 48 C 50 38, 64 34, 72 28',
};
const SPLIT_POINT: Record<'L' | 'R', { x: number; y: number }> = {
  L: { x: 28, y: 28 },
  R: { x: 72, y: 28 },
};
const LEAF_BRANCHES = [
  { split: 'L' as const, d: 'M28 28 C 22 22, 16 16, 12 8', leaf: { x: 12, y: 8 } },
  { split: 'L' as const, d: 'M28 28 C 30 20, 33 14, 36 8', leaf: { x: 36, y: 8 } },
  { split: 'R' as const, d: 'M72 28 C 70 20, 67 14, 64 8', leaf: { x: 64, y: 8 } },
  { split: 'R' as const, d: 'M72 28 C 78 22, 84 16, 88 8', leaf: { x: 88, y: 8 } },
];

function LeadRoutingScene({ playing }: { playing: boolean }) {
  const trunkLRef = useRef<SVGPathElement>(null);
  const trunkRRef = useRef<SVGPathElement>(null);
  const leafPathRefs = useRef<(SVGPathElement | null)[]>([]);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const splitGlowRefs = useRef<Record<'L' | 'R', SVGCircleElement | null>>({ L: null, R: null });
  const leafGlowRefs = useRef<(SVGCircleElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const trunkL = trunkLRef.current;
    const trunkR = trunkRRef.current;
    if (!trunkL || !trunkR) return;

    const trunkLen: Record<'L' | 'R', number> = { L: trunkL.getTotalLength(), R: trunkR.getTotalLength() };
    gsap.set(trunkL, { strokeDasharray: trunkLen.L, strokeDashoffset: trunkLen.L });
    gsap.set(trunkR, { strokeDasharray: trunkLen.R, strokeDashoffset: trunkLen.R });

    const leafLens = leafPathRefs.current.map((p) => p?.getTotalLength() ?? 0);
    leafPathRefs.current.forEach((p, i) => p && gsap.set(p, { strokeDasharray: leafLens[i], strokeDashoffset: leafLens[i] }));

    if (reducedMotion) {
      gsap.set(trunkL, { strokeDashoffset: playing ? 0 : trunkLen.L });
      gsap.set(trunkR, { strokeDashoffset: playing ? 0 : trunkLen.R });
      leafPathRefs.current.forEach((p, i) => p && gsap.set(p, { strokeDashoffset: playing ? 0 : leafLens[i] }));
      LEAF_BRANCHES.forEach((b, i) => {
        const dot = dotRefs.current[i];
        if (dot) gsap.set(dot, { attr: playing ? { cx: b.leaf.x, cy: b.leaf.y } : { cx: 50, cy: 48 }, opacity: playing ? 1 : 0 });
      });
      return;
    }

    if (!playing) {
      gsap.set(trunkL, { strokeDashoffset: trunkLen.L });
      gsap.set(trunkR, { strokeDashoffset: trunkLen.R });
      leafPathRefs.current.forEach((p, i) => p && gsap.set(p, { strokeDashoffset: leafLens[i] }));
      dotRefs.current.forEach((d) => d && gsap.set(d, { attr: { cx: 50, cy: 48 }, opacity: 0 }));
      return;
    }

    const tweens: gsap.core.Tween[] = [];
    tweens.push(
      gsap.to(trunkL, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.inOut' }),
      gsap.to(trunkR, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.inOut' }),
    );

    LEAF_BRANCHES.forEach((branch, i) => {
      const dot = dotRefs.current[i];
      const leafPath = leafPathRefs.current[i];
      const trunkPath = branch.split === 'L' ? trunkL : trunkR;
      if (!dot || !leafPath) return;

      const tLen = trunkPath.getTotalLength();
      const lLen = leafLens[i];
      const stage1 = { t: 0 };

      const tw = gsap.to(stage1, {
        t: 1,
        duration: 0.45,
        delay: 0.05,
        ease: 'power2.inOut',
        onStart: () => gsap.set(dot, { opacity: 1 }),
        onUpdate: () => {
          const pt = trunkPath.getPointAtLength(tLen * stage1.t);
          gsap.set(dot, { attr: { cx: pt.x, cy: pt.y } });
        },
        onComplete: () => {
          pulseNode(splitGlowRefs.current[branch.split]);
          const stage2 = { t: 0 };
          gsap.to(stage2, {
            t: 1,
            duration: 0.45,
            ease: 'power2.inOut',
            onUpdate: () => {
              gsap.set(leafPath, { strokeDashoffset: lLen * (1 - stage2.t) });
              const pt = leafPath.getPointAtLength(lLen * stage2.t);
              gsap.set(dot, { attr: { cx: pt.x, cy: pt.y } });
            },
            onComplete: () => pulseNode(leafGlowRefs.current[i]),
          });
        },
      });
      tweens.push(tw);
    });

    return () => {
      tweens.forEach((t) => t.kill());
    };
  }, [playing, reducedMotion]);

  return (
    <svg viewBox="0 0 100 56" className="h-24 w-full" aria-hidden="true">
      <circle cx="50" cy="48" r="4" fill={BONE} opacity="0.35" />
      <path d={TRUNK_D.L} fill="none" stroke={BONE} strokeOpacity="0.14" strokeWidth="1.5" />
      <path d={TRUNK_D.R} fill="none" stroke={BONE} strokeOpacity="0.14" strokeWidth="1.5" />
      <path ref={trunkLRef} d={TRUNK_D.L} fill="none" stroke={EMBER} strokeWidth="1.5" />
      <path ref={trunkRRef} d={TRUNK_D.R} fill="none" stroke={EMBER} strokeWidth="1.5" />

      {LEAF_BRANCHES.map((branch) => (
        <path key={branch.d} d={branch.d} fill="none" stroke={BONE} strokeOpacity="0.14" strokeWidth="1.5" />
      ))}
      {LEAF_BRANCHES.map((branch, i) => (
        <path
          key={`${branch.d}-active`}
          ref={(el) => {
            leafPathRefs.current[i] = el;
          }}
          d={branch.d}
          fill="none"
          stroke={EMBER}
          strokeWidth="1.5"
        />
      ))}

      {(['L', 'R'] as const).map((k) => (
        <g key={k}>
          <circle cx={SPLIT_POINT[k].x} cy={SPLIT_POINT[k].y} r="3" fill="none" stroke={BONE} strokeOpacity="0.3" />
          <circle
            ref={(el) => {
              splitGlowRefs.current[k] = el;
            }}
            cx={SPLIT_POINT[k].x}
            cy={SPLIT_POINT[k].y}
            r="3"
            fill={EMBER}
            opacity="0"
          />
        </g>
      ))}
      {LEAF_BRANCHES.map((branch, i) => (
        <g key={`leaf-${branch.leaf.x}`}>
          <circle cx={branch.leaf.x} cy={branch.leaf.y} r="3.5" fill="none" stroke={BONE} strokeOpacity="0.3" />
          <circle
            ref={(el) => {
              leafGlowRefs.current[i] = el;
            }}
            cx={branch.leaf.x}
            cy={branch.leaf.y}
            r="3.5"
            fill={EMBER}
            opacity="0"
          />
        </g>
      ))}
      {LEAF_BRANCHES.map((branch, i) => (
        <circle
          key={`dot-${branch.leaf.x}`}
          ref={(el) => {
            dotRefs.current[i] = el;
          }}
          cx="50"
          cy="48"
          r="2.4"
          fill={EMBER}
          opacity="0"
        />
      ))}
    </svg>
  );
}

/* ---------- scene: a report assembling ---------- */

function ReportScene({ playing }: { playing: boolean }) {
  const barRefs = useRef<(SVGRectElement | null)[]>([]);
  const reducedMotion = useReducedMotion();
  const xs = [20, 38, 56, 74];
  const heights = [14, 22, 10, 26];

  useEffect(() => {
    const bars = barRefs.current.filter(Boolean) as SVGRectElement[];
    if (reducedMotion) {
      bars.forEach((bar, i) => {
        gsap.set(bar, { attr: playing ? { height: heights[i], y: 40 - heights[i] } : { height: 2, y: 38 } });
      });
      return;
    }
    bars.forEach((bar, i) => {
      if (playing) {
        gsap.to(bar, { attr: { height: heights[i], y: 40 - heights[i] }, duration: 0.5, delay: i * 0.08, ease: 'power2.out' });
      } else {
        gsap.to(bar, { attr: { height: 2, y: 38 }, duration: 0.3, ease: 'power2.in' });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, reducedMotion]);

  return (
    <svg viewBox="0 0 100 50" className="h-16 w-full" aria-hidden="true">
      <line x1="14" y1="40" x2="86" y2="40" stroke={BONE} strokeOpacity="0.2" />
      {xs.map((x, i) => (
        <rect
          key={x}
          ref={(el) => {
            barRefs.current[i] = el;
          }}
          x={x}
          y={38}
          width="10"
          height="2"
          rx="1.5"
          fill={EMBER}
        />
      ))}
    </svg>
  );
}

/* ---------- scene: a queue draining ---------- */

const QUEUE_ITEM_YS = [28, 18, 8];

function QueueScene({ playing }: { playing: boolean }) {
  const itemRefs = useRef<(SVGRectElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const items = itemRefs.current.filter(Boolean) as SVGRectElement[];
    if (reducedMotion) {
      gsap.set(items, { y: playing ? 20 : 0, opacity: playing ? 0 : 1 });
      return;
    }
    if (playing) {
      gsap.to(items, { y: 20, opacity: 0, stagger: 0.18, duration: 0.45, ease: 'power2.in' });
    } else {
      gsap.to(items, { y: 0, opacity: 1, stagger: 0.06, duration: 0.3, ease: 'power2.out' });
    }
  }, [playing, reducedMotion]);

  return (
    <svg viewBox="0 0 100 50" className="h-16 w-full" aria-hidden="true">
      <line x1="10" y1="36" x2="90" y2="36" stroke={EMBER} strokeWidth="2" strokeDasharray="2 3" />
      {QUEUE_ITEM_YS.map((y, i) => (
        <rect
          key={y}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          x="42"
          y={y}
          width="16"
          height="8"
          rx="1.5"
          fill={BONE}
          fillOpacity="0.7"
        />
      ))}
    </svg>
  );
}

/* ---------- scene: an inbox sorting itself ---------- */

const SCATTERED: [number, number][] = [
  [22, 14],
  [72, 12],
  [32, 32],
  [78, 30],
];
const SORTED: [number, number][] = [
  [32, 15],
  [32, 29],
  [68, 15],
  [68, 29],
];

function InboxSortScene({ playing }: { playing: boolean }) {
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const dots = dotRefs.current.filter(Boolean) as SVGCircleElement[];
    const targets = playing ? SORTED : SCATTERED;

    if (reducedMotion) {
      dots.forEach((d, i) => gsap.set(d, { attr: { cx: targets[i][0], cy: targets[i][1] } }));
      return;
    }
    dots.forEach((d, i) => {
      gsap.to(d, {
        attr: { cx: targets[i][0], cy: targets[i][1] },
        duration: 0.5,
        delay: i * 0.06,
        ease: playing ? 'back.out(1.6)' : 'power2.out',
      });
    });
  }, [playing, reducedMotion]);

  return (
    <svg viewBox="0 0 100 44" className="h-16 w-full" aria-hidden="true">
      <rect x="10" y="4" width="80" height="36" rx="3" fill="none" stroke={BONE} strokeOpacity="0.14" />
      {SCATTERED.map((pos, i) => (
        <circle
          key={pos[0] + pos[1]}
          ref={(el) => {
            dotRefs.current[i] = el;
          }}
          cx={pos[0]}
          cy={pos[1]}
          r="4"
          fill={EMBER}
        />
      ))}
    </svg>
  );
}

/* ---------- scene: a stack of tasks flipping to done ---------- */

const TASK_ROWS = [10, 24, 38];

function TaskStackScene({ playing }: { playing: boolean }) {
  const checkRefs = useRef<(SVGGElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const checks = checkRefs.current.filter(Boolean) as SVGGElement[];
    if (reducedMotion) {
      gsap.set(checks, { scale: playing ? 1 : 0, opacity: playing ? 1 : 0 });
      return;
    }
    if (playing) {
      gsap.to(checks, { scale: 1, opacity: 1, stagger: 0.15, duration: 0.35, ease: 'back.out(2.2)' });
    } else {
      gsap.to(checks, { scale: 0, opacity: 0, stagger: 0.05, duration: 0.2, ease: 'power2.in' });
    }
  }, [playing, reducedMotion]);

  return (
    <svg viewBox="0 0 100 50" className="h-16 w-full" aria-hidden="true">
      {TASK_ROWS.map((y, i) => (
        <g key={y}>
          <rect x="10" y={y} width="60" height="8" rx="2" fill="none" stroke={BONE} strokeOpacity="0.14" />
          <circle cx="80" cy={y + 4} r="6" fill="none" stroke={BONE} strokeOpacity="0.3" strokeWidth="1.5" />
          <g
            ref={(el) => {
              checkRefs.current[i] = el;
            }}
            style={{ transformOrigin: `80px ${y + 4}px`, opacity: 0 }}
          >
            <circle cx="80" cy={y + 4} r="6" fill={EMBER} />
            <path
              d={`M77 ${y + 4} l2 2 4-4`}
              fill="none"
              stroke={VOID}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
      ))}
    </svg>
  );
}

/* ---------- scene: a document assembling line by line ---------- */

const DOC_LINES = [
  { y: 12, width: 55 },
  { y: 20, width: 68 },
  { y: 28, width: 42 },
  { y: 36, width: 60 },
];

function DocumentScene({ playing }: { playing: boolean }) {
  const lineRefs = useRef<(SVGRectElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const lines = lineRefs.current.filter(Boolean) as SVGRectElement[];
    if (reducedMotion) {
      gsap.set(lines, { scaleX: playing ? 1 : 0 });
      return;
    }
    if (playing) {
      gsap.to(lines, { scaleX: 1, stagger: 0.12, duration: 0.35, ease: 'power2.out' });
    } else {
      gsap.to(lines, { scaleX: 0, stagger: 0.04, duration: 0.2, ease: 'power2.in' });
    }
  }, [playing, reducedMotion]);

  return (
    <svg viewBox="0 0 100 50" className="h-16 w-full" aria-hidden="true">
      <rect x="14" y="4" width="72" height="42" rx="2" fill="none" stroke={BONE} strokeOpacity="0.14" />
      {DOC_LINES.map((line, i) => (
        <rect
          key={line.y}
          ref={(el) => {
            lineRefs.current[i] = el;
          }}
          x="22"
          y={line.y}
          width={line.width}
          height="3"
          rx="1.5"
          fill={EMBER}
          style={{ transform: 'scaleX(0)', transformOrigin: '22px center' }}
        />
      ))}
    </svg>
  );
}

/* ---------- section ---------- */

interface TileConfig {
  title: string;
  caption: string;
  gridClassName: string;
  wide: boolean;
  delay: number;
  Scene: (props: { playing: boolean }) => ReactNode;
}

const TILES: TileConfig[] = [
  {
    title: 'Rows that fill themselves in',
    caption: 'New data lands exactly where it belongs, then totals itself.',
    gridClassName: 'sm:col-span-2 sm:row-span-2',
    wide: true,
    delay: 0,
    Scene: SpreadsheetScene,
  },
  {
    title: 'Leads that route themselves',
    caption: 'Straight to the right inbox, every time — never just one path.',
    gridClassName: 'sm:col-span-2 sm:row-span-2',
    wide: true,
    delay: 0.1,
    Scene: LeadRoutingScene,
  },
  {
    title: 'Messages that send themselves',
    caption: 'Drafted, checked, and sent without a finger lifted.',
    gridClassName: '',
    wide: false,
    delay: 0.2,
    Scene: MessageScene,
  },
  {
    title: 'Invoices that clear themselves',
    caption: 'Matched, checked, and marked paid on their own.',
    gridClassName: '',
    wide: false,
    delay: 0.26,
    Scene: InvoiceScene,
  },
  {
    title: 'Queues that drain themselves',
    caption: "Work leaves the line the moment it's ready.",
    gridClassName: '',
    wide: false,
    delay: 0.32,
    Scene: QueueScene,
  },
  {
    title: 'Inboxes that sort themselves',
    caption: 'Everything lands in its place, automatically.',
    gridClassName: '',
    wide: false,
    delay: 0.38,
    Scene: InboxSortScene,
  },
  {
    title: 'Tasks that mark themselves done',
    caption: 'No status meeting required.',
    gridClassName: '',
    wide: false,
    delay: 0.44,
    Scene: TaskStackScene,
  },
  {
    title: 'Documents that assemble themselves',
    caption: 'Written, line by line, before you sit down.',
    gridClassName: '',
    wide: false,
    delay: 0.5,
    Scene: DocumentScene,
  },
  {
    title: 'Reports that assemble themselves',
    caption: 'The numbers, pulled and laid out before you ask.',
    gridClassName: 'sm:col-span-2',
    wide: true,
    delay: 0.56,
    Scene: ReportScene,
  },
];

/**
 * The capability mosaic — Podium's horizontal-scroll reel. Pinned in place,
 * the whole row of scenes slides left as you scroll down, one vertical
 * scroll mapped 1:1 to the row's horizontal distance, so the tiles reveal
 * themselves tile-by-tile rather than all sitting there at once. Falls back
 * to the original asymmetric hover-to-play grid on mobile and reduced motion.
 */
export function CapabilityTiles() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const horizontal = !reducedMotion && !isMobile;

  useEffect(() => {
    if (!horizontal) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const distance = () => Math.max(track.scrollWidth - window.innerWidth, 0);
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [horizontal]);

  return (
    <section
      ref={sectionRef}
      id="capability"
      className={`relative overflow-hidden ${horizontal ? 'flex min-h-[100svh] flex-col justify-center' : ''}`}
    >
      <div className={`px-6 ${horizontal ? 'pt-10' : 'pt-24 md:pt-32'}`}>
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 flex items-center">
            <AgentMark />
            <div className="label-mono">02 — Capability</div>
          </div>
          <RevealText
            as="h2"
            lines={['Automations,', 'at work.']}
            className="max-w-2xl font-display text-4xl text-bone md:text-5xl"
          />
        </div>
      </div>

      {horizontal ? (
        <div className="mt-14 pb-10">
          <div ref={trackRef} className="flex gap-5 px-6 will-change-transform" style={{ width: 'max-content' }}>
            {TILES.map((tile) => (
              <RowTileWrapper
                key={tile.title}
                title={tile.title}
                caption={tile.caption}
                className={tile.wide ? 'h-[450px] w-[640px]' : 'h-[450px] w-[380px]'}
              >
                {(playing) => <tile.Scene playing={playing} />}
              </RowTileWrapper>
            ))}
          </div>
        </div>
      ) : (
        <div className="px-6 pb-24 md:pb-32">
          <div className="mx-auto max-w-6xl">
            <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-4 sm:auto-rows-[210px]">
              {TILES.map((tile) => (
                <TileWrapper
                  key={tile.title}
                  className={tile.gridClassName}
                  delay={tile.delay}
                  title={tile.title}
                  caption={tile.caption}
                >
                  {(playing) => <tile.Scene playing={playing} />}
                </TileWrapper>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

interface TileWrapperProps {
  title: string;
  caption: string;
  className?: string;
  delay?: number;
  children: (playing: boolean) => ReactNode;
}

function TileWrapper({ title, caption, className, delay, children }: TileWrapperProps) {
  const [playing, setPlaying] = useState(false);
  return (
    <Tile title={title} caption={caption} className={className} delay={delay} onPlayChange={setPlaying}>
      {children(playing)}
    </Tile>
  );
}

function RowTileWrapper({ title, caption, className, children }: Omit<TileWrapperProps, 'delay'>) {
  const [playing, setPlaying] = useState(false);
  return (
    <RowTile title={title} caption={caption} className={className} onPlayChange={setPlaying}>
      {children(playing)}
    </RowTile>
  );
}
