import { useEffect, useRef } from 'react';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from 'three';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useReducedMotion } from '../lib/useReducedMotion';
import { GLOBE_DOTS } from '../data/globeDots';

const RADIUS = 1;

// Deliveries radiate out of India to client timezones — drawn as great arcs.
const HOME: [number, number] = [19.08, 72.88]; // Mumbai
const CITIES: ReadonlyArray<{ name: string; at: [number, number] }> = [
  { name: 'New York', at: [40.71, -74.0] },
  { name: 'San Francisco', at: [37.77, -122.42] },
  { name: 'London', at: [51.5, -0.12] },
  { name: 'Berlin', at: [52.52, 13.4] },
  { name: 'Dubai', at: [25.2, 55.27] },
  { name: 'Singapore', at: [1.35, 103.82] },
  { name: 'Sydney', at: [-33.87, 151.21] },
  { name: 'Tokyo', at: [35.68, 139.69] },
  { name: 'São Paulo', at: [-23.55, -46.63] },
];

function latLonToVec3(lat: number, lon: number, radius: number): Vector3 {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

const DOT_VERTEX = `
attribute float aSeed;
uniform float uTime;
uniform float uPixelRatio;
varying float vAlpha;

void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  // Front-facing dots read solid; the far hemisphere falls away like the
  // Cloudflare globe instead of rendering as visual noise.
  vec3 worldNormal = normalize((modelMatrix * vec4(position, 0.0)).xyz);
  vec3 viewDir = normalize(cameraPosition);
  float facing = dot(worldNormal, viewDir);
  float twinkle = 0.78 + 0.22 * sin(uTime * 0.9 + aSeed * 40.0);
  vAlpha = (0.1 + 0.9 * smoothstep(-0.05, 0.5, facing)) * twinkle;
  gl_PointSize = (2.4 + 1.6 * smoothstep(0.0, 1.0, facing)) * uPixelRatio;
  gl_Position = projectionMatrix * mv;
}
`;

const DOT_FRAGMENT = `
precision mediump float;
uniform vec3 uColor;
varying float vAlpha;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = smoothstep(0.5, 0.18, length(c));
  gl_FragColor = vec4(uColor, d * vAlpha);
}
`;

type ArcRuntime = {
  line: Line;
  material: LineBasicMaterial;
  head: Points;
  points: Vector3[];
  segments: number;
  progress: number; // 0..2 — first half draws, second half retracts
  speed: number;
  delay: number;
};

// Great-circle slerp with a sine-lobe altitude lift. A naive "normalize the
// midpoint" arc explodes for near-antipodal pairs (Mumbai → SF).
function buildArcPoints(from: Vector3, to: Vector3, segments: number): Vector3[] {
  const a = from.clone().normalize();
  const b = to.clone().normalize();
  const omega = a.angleTo(b);
  const sinOmega = Math.sin(omega);
  const points: Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p =
      sinOmega < 1e-4
        ? a.clone().lerp(b, t).normalize()
        : a
            .clone()
            .multiplyScalar(Math.sin((1 - t) * omega) / sinOmega)
            .add(b.clone().multiplyScalar(Math.sin(t * omega) / sinOmega))
            .normalize();
    const lift = 1.004 + Math.sin(Math.PI * t) * (0.06 + omega * 0.085);
    points.push(p.multiplyScalar(RADIUS * lift));
  }
  return points;
}

function arcPointAt(arc: ArcRuntime, fraction: number, out: Vector3): Vector3 {
  const x = Math.min(Math.max(fraction, 0), 1) * arc.segments;
  const i = Math.min(Math.floor(x), arc.segments - 1);
  return out.copy(arc.points[i]).lerp(arc.points[i + 1], x - i);
}

export function GlobeFooter() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      return;
    }
    renderer.setClearColor(0x000000, 0);

    const scene = new Scene();
    const camera = new PerspectiveCamera(34, 1, 0.1, 20);
    camera.position.set(0, 0.35, 3.4);
    camera.lookAt(0, 0, 0);

    const globe = new Group();
    // Tilt like a desk globe; start with India (home) facing the reader.
    globe.rotation.x = 0.32;
    globe.rotation.y = -2.83;
    scene.add(globe);

    const bone = new Color('#e8e8e3');
    const gray = new Color('#c9c6c0');

    // Opaque body: occludes far-side dots and arcs so the sphere reads solid,
    // a touch lighter than the page ground to give the planet a silhouette.
    const body = new Mesh(
      new SphereGeometry(RADIUS * 0.992, 48, 48),
      new MeshBasicMaterial({ color: new Color('#0e0e0d') }),
    );
    globe.add(body);

    // --- land dots ---
    const dotGeometry = new BufferGeometry();
    const dotPositions = new Float32Array(GLOBE_DOTS.length * 3);
    const dotSeeds = new Float32Array(GLOBE_DOTS.length);
    GLOBE_DOTS.forEach(([lat, lon], i) => {
      const v = latLonToVec3(lat, lon, RADIUS);
      dotPositions.set([v.x, v.y, v.z], i * 3);
      dotSeeds[i] = Math.sin(i * 12.9898) * 0.5 + 0.5;
    });
    dotGeometry.setAttribute('position', new BufferAttribute(dotPositions, 3));
    dotGeometry.setAttribute('aSeed', new BufferAttribute(dotSeeds, 1));
    const dotMaterial = new ShaderMaterial({
      vertexShader: DOT_VERTEX,
      fragmentShader: DOT_FRAGMENT,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: 1 },
        uColor: { value: gray },
      },
      transparent: true,
      depthWrite: false,
    });
    globe.add(new Points(dotGeometry, dotMaterial));

    // --- home + city markers ---
    const markerGeometry = new BufferGeometry();
    const markerPositions = new Float32Array((CITIES.length + 1) * 3);
    const markerSeeds = new Float32Array(CITIES.length + 1);
    [HOME, ...CITIES.map((c) => c.at)].forEach(([lat, lon], i) => {
      const v = latLonToVec3(lat, lon, RADIUS * 1.005);
      markerPositions.set([v.x, v.y, v.z], i * 3);
      markerSeeds[i] = i / (CITIES.length + 1);
    });
    markerGeometry.setAttribute('position', new BufferAttribute(markerPositions, 3));
    markerGeometry.setAttribute('aSeed', new BufferAttribute(markerSeeds, 1));
    const markerMaterial = new ShaderMaterial({
      vertexShader: DOT_VERTEX.replace('(1.9 + 1.3', '(3.4 + 2.2'),
      fragmentShader: DOT_FRAGMENT,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: 1 },
        uColor: { value: bone },
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    globe.add(new Points(markerGeometry, markerMaterial));

    // --- shipping arcs ---
    const home = latLonToVec3(HOME[0], HOME[1], RADIUS * 1.004);
    const segments = 64;
    const arcs: ArcRuntime[] = CITIES.map((city, index) => {
      const target = latLonToVec3(city.at[0], city.at[1], RADIUS * 1.004);
      const points = buildArcPoints(home, target, segments);
      const positions = new Float32Array((segments + 1) * 3);
      points.forEach((p, i) => positions.set([p.x, p.y, p.z], i * 3));
      const geometry = new BufferGeometry();
      geometry.setAttribute('position', new BufferAttribute(positions, 3));
      geometry.setDrawRange(0, 0);
      const material = new LineBasicMaterial({
        color: bone,
        transparent: true,
        opacity: 0,
        blending: AdditiveBlending,
        depthWrite: false,
      });
      const line = new Line(geometry, material);
      const headGeometry = new BufferGeometry();
      headGeometry.setAttribute('position', new BufferAttribute(new Float32Array(3), 3));
      const head = new Points(
        headGeometry,
        new ShaderMaterial({
          vertexShader: DOT_VERTEX.replace('(1.9 + 1.3', '(4.6 + 2.0'),
          fragmentShader: DOT_FRAGMENT,
          uniforms: {
            uTime: { value: 0 },
            uPixelRatio: { value: 1 },
            uColor: { value: bone },
          },
          transparent: true,
          depthWrite: false,
          blending: AdditiveBlending,
        }),
      );
      headGeometry.setAttribute('aSeed', new BufferAttribute(new Float32Array([0.5]), 1));
      globe.add(line, head);
      return {
        line,
        material,
        head,
        points,
        segments,
        progress: 0,
        speed: 0.34 + (index % 3) * 0.05,
        delay: index * 0.9,
      };
    });
    const headScratch = new Vector3();

    const resize = () => {
      const width = wrap.clientWidth;
      const height = wrap.clientHeight;
      const ratio = Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(ratio);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      dotMaterial.uniforms.uPixelRatio.value = ratio;
      markerMaterial.uniforms.uPixelRatio.value = ratio;
      arcs.forEach((arc) => {
        (arc.head.material as ShaderMaterial).uniforms.uPixelRatio.value = ratio;
      });
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);

    // Grab-to-spin with inertia; idle lean follows the cursor.
    const pointer = { x: 0, y: 0 };
    const drag = { active: false, lastX: 0, lastY: 0, lastT: 0, velocity: 0 };
    const onPointerMove = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      if (!drag.active) return;
      const now = performance.now();
      const dx = event.clientX - drag.lastX;
      const dy = event.clientY - drag.lastY;
      const dt = Math.max(now - drag.lastT, 1) / 1000;
      globe.rotation.y += dx * 0.0052;
      globe.rotation.x = Math.min(Math.max(globe.rotation.x + dy * 0.0028, -0.25), 0.75);
      drag.velocity = (dx * 0.0052) / dt;
      drag.lastX = event.clientX;
      drag.lastY = event.clientY;
      drag.lastT = now;
    };
    const onPointerDown = (event: PointerEvent) => {
      drag.active = true;
      drag.lastX = event.clientX;
      drag.lastY = event.clientY;
      drag.lastT = performance.now();
      drag.velocity = 0;
      wrap.setPointerCapture(event.pointerId);
      wrap.classList.add('is-grabbing');
    };
    const endDrag = (event: PointerEvent) => {
      if (!drag.active) return;
      drag.active = false;
      wrap.classList.remove('is-grabbing');
      if (wrap.hasPointerCapture(event.pointerId)) wrap.releasePointerCapture(event.pointerId);
    };
    wrap.addEventListener('pointermove', onPointerMove);
    wrap.addEventListener('pointerdown', onPointerDown);
    wrap.addEventListener('pointerup', endDrag);
    wrap.addEventListener('pointercancel', endDrag);

    let frame = 0;
    let elapsed = 0;
    let last = performance.now();
    let visible = false;
    const spinBase = reducedMotion ? 0 : 0.05;

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (!visible) {
        last = now;
        return;
      }
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      elapsed += dt;

      if (!drag.active) {
        // Thrown momentum bleeds off, then the idle spin takes over.
        drag.velocity *= Math.pow(0.12, dt);
        globe.rotation.y += (spinBase + drag.velocity) * dt + 0.0004;
        globe.rotation.x += (0.32 + pointer.y * 0.12 - globe.rotation.x) * 0.03;
        globe.rotation.z += (pointer.x * -0.05 - globe.rotation.z) * 0.04;
      }

      dotMaterial.uniforms.uTime.value = elapsed;
      markerMaterial.uniforms.uTime.value = elapsed;

      if (!reducedMotion) {
        arcs.forEach((arc) => {
          if (arc.delay > 0) {
            arc.delay -= dt;
            return;
          }
          arc.progress += dt * arc.speed;
          if (arc.progress >= 2) {
            arc.progress = 0;
            arc.delay = 1.5 + Math.abs(Math.sin(elapsed * 3.7)) * 4;
            arc.line.geometry.setDrawRange(0, 0);
            arc.material.opacity = 0;
            return;
          }
          const drawing = arc.progress < 1;
          const t = drawing ? arc.progress : arc.progress - 1;
          const eased = t * t * (3 - 2 * t);
          const start = drawing ? 0 : Math.floor(eased * arc.segments);
          const end = drawing ? Math.floor(eased * arc.segments) : arc.segments;
          arc.line.geometry.setDrawRange(start, Math.max(end - start, 0) + 1);
          arc.material.opacity = drawing ? 0.65 : 0.65 * (1 - t * 0.4);
          arcPointAt(arc, drawing ? eased : 1, headScratch);
          const headAttr = arc.head.geometry.getAttribute('position') as BufferAttribute;
          headAttr.set([headScratch.x, headScratch.y, headScratch.z]);
          headAttr.needsUpdate = true;
          (arc.head.material as ShaderMaterial).uniforms.uTime.value = elapsed;
        });
      }

      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(tick);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: '120px' },
    );
    io.observe(wrap);

    // Scroll entrance: the planet rises and settles as the footer arrives.
    let intro: gsap.core.Tween | undefined;
    if (!reducedMotion) {
      intro = gsap.fromTo(
        canvas,
        { yPercent: 22, scale: 0.86, opacity: 0 },
        {
          yPercent: 0,
          scale: 1,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: wrap,
            start: 'top 95%',
            end: 'top 30%',
            scrub: 0.6,
          },
        },
      );
    }

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      io.disconnect();
      wrap.removeEventListener('pointermove', onPointerMove);
      wrap.removeEventListener('pointerdown', onPointerDown);
      wrap.removeEventListener('pointerup', endDrag);
      wrap.removeEventListener('pointercancel', endDrag);
      intro?.scrollTrigger?.kill();
      intro?.kill();
      arcs.forEach((arc) => {
        arc.line.geometry.dispose();
        arc.material.dispose();
        arc.head.geometry.dispose();
        (arc.head.material as ShaderMaterial).dispose();
      });
      body.geometry.dispose();
      body.material.dispose();
      dotGeometry.dispose();
      dotMaterial.dispose();
      markerGeometry.dispose();
      markerMaterial.dispose();
      renderer.dispose();
      ScrollTrigger.refresh();
    };
  }, [reducedMotion]);

  return (
    <div ref={wrapRef} className="globe-stage" aria-hidden="true">
      <canvas ref={canvasRef} className="globe-canvas" />
    </div>
  );
}
