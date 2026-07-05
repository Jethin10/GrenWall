import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import { fallState, fallCurve, introState } from '../lib/fallState';

const DISK_TILT = THREE.MathUtils.degToRad(78);
// Throttled — a full ring of infalling matter reads just as well at fewer
// points, and it's one of the two heaviest per-frame CPU costs (the other is
// the fragment shader, which scales with pixels, not point count).
const MOTE_COUNT = 150;

/* ------------------------------------------------------------------ */
/* Accretion-disk shader                                               */
/* ------------------------------------------------------------------ */

const DISK_VERTEX = /* glsl */ `
  varying vec3 vPos;
  void main() {
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const DISK_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform float uPulse;
  uniform float uInner;
  uniform float uOuter;
  uniform float uBrightness;
  uniform float uViolet; // lensing fringe amount (halo only)
  varying vec3 vPos;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  void main() {
    float r = length(vPos.xy);
    float angle = atan(vPos.y, vPos.x);
    float rn = clamp((r - uInner) / (uOuter - uInner), 0.0, 1.0);

    // The disk spins — inner material orbits faster (differential rotation).
    float a = angle - uTime * (0.5 + 1.0 * (1.0 - rn));

    // Streaky flowing noise, stretched along the direction of travel.
    float n = 0.6 * noise(vec2(a * 3.0, r * 6.0));
    n += 0.4 * noise(vec2(a * 7.0 + 13.7, r * 11.0 - uTime * 0.3));

    // Radial temperature ramp: white-hot inner rim -> ember -> deep amber.
    vec3 deep = vec3(0.722, 0.314, 0.102);
    vec3 mid  = vec3(0.910, 0.569, 0.184);
    vec3 hot  = vec3(1.000, 0.949, 0.863);
    vec3 col = mix(hot, mid, smoothstep(0.0, 0.32, rn));
    col = mix(col, deep, smoothstep(0.32, 1.0, rn));
    // Whisper of violet lensing fringe toward the outer edge (halo only).
    col = mix(col, vec3(0.431, 0.290, 0.620), uViolet * smoothstep(0.65, 1.0, rn));

    // Doppler beaming: the approaching side runs hotter.
    float doppler = 1.0 + 0.6 * sin(angle);

    // Velocity ripple: a bright pulse runs through the disk on fast scroll.
    float ripple = 1.0 + uPulse * (0.6 * sin(22.0 * rn - uTime * 9.0) + 0.55);

    float edge = smoothstep(0.0, 0.055, rn) * (1.0 - smoothstep(0.6, 1.0, rn));
    float brightness = uBrightness * doppler * ripple * (0.5 + 0.7 * n);

    gl_FragColor = vec4(col * brightness, edge * (0.45 + 0.55 * n));
  }
`;

interface DiskMaterial extends THREE.ShaderMaterial {
  userData: { base: number };
}

function makeDiskMaterial(inner: number, outer: number, brightness: number, violet: number): DiskMaterial {
  const mat = new THREE.ShaderMaterial({
    vertexShader: DISK_VERTEX,
    fragmentShader: DISK_FRAGMENT,
    uniforms: {
      uTime: { value: 0 },
      uPulse: { value: 0 },
      uInner: { value: inner },
      uOuter: { value: outer },
      uBrightness: { value: brightness },
      uViolet: { value: violet },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  }) as DiskMaterial;
  mat.userData = { base: brightness };
  return mat;
}

/* ------------------------------------------------------------------ */
/* Infalling matter                                                    */
/* ------------------------------------------------------------------ */

interface Mote {
  angle: number;
  radius: number;
  speed: number;
  y: number;
}

function Motes() {
  const motes = useMemo<Mote[]>(
    () =>
      Array.from({ length: MOTE_COUNT }, () => ({
        angle: Math.random() * Math.PI * 2,
        radius: 1.3 + Math.random() * 2.4,
        speed: 0.35 + Math.random() * 0.5,
        y: (Math.random() - 0.5) * 0.16,
      })),
    [],
  );
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(MOTE_COUNT * 3), 3));
    return geo;
  }, []);

  useFrame((_, delta) => {
    const positions = geometry.attributes.position as THREE.BufferAttribute;
    // The pull intensifies the deeper you fall and the faster you scroll.
    const inward = 0.12 + fallCurve(fallState.progress) * 0.6 + fallState.velocity * 1.0;
    const spin = 1 + fallState.velocity * 1.5;
    for (let i = 0; i < motes.length; i++) {
      const m = motes[i];
      m.angle += delta * m.speed * (2.4 / m.radius) * spin; // Keplerian-ish: faster inside
      m.radius -= delta * inward * (1.4 / m.radius);
      if (m.radius < 1.08) {
        m.radius = 3.4 + Math.random() * 0.4;
        m.angle = Math.random() * Math.PI * 2;
      }
      positions.setXYZ(i, Math.cos(m.angle) * m.radius, Math.sin(m.angle) * m.radius, m.y);
    }
    positions.needsUpdate = true;
  });

  return (
    <points geometry={geometry}>
      <pointsMaterial
        color="#E8912F"
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/* The black hole                                                      */
/* ------------------------------------------------------------------ */

function BlackHole() {
  const groupRef = useRef<THREE.Group>(null);
  const diskTime = useRef(0);

  const diskMaterial = useMemo(() => makeDiskMaterial(1.18, 2.9, 1.15, 0), []);
  const haloMaterial = useMemo(() => makeDiskMaterial(1.03, 1.9, 0.5, 0.14), []);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const p = fallState.progress;
    const v = fallState.velocity;
    const s = fallCurve(p);

    // Disk time advances faster the faster you fall — the whole disk spins up.
    // The intro's own gathering (introState.zoom above its 1 rest value) spins
    // it up the same way, so the one instance reads as continuously alive
    // through the handoff, not two differently-animated objects.
    const introSpin = Math.max(introState.zoom - 1, 0);
    diskTime.current += delta * (1 + v * 2 + p * 0.6 + introSpin * 0.5);
    const t = diskTime.current;
    const pulse = Math.min(v * 1.2, 1);
    // Brighten the disk with depth + speed; bloom keys off luminance, so this
    // is what makes the glow bleed harder the deeper you fall — no need to
    // animate the Bloom effect directly (its ref can't be touched under React
    // 19 + postprocessing without a circular-JSON crash).
    const glow = (1 + s * 0.9 + v * 0.5) * introState.glow;

    diskMaterial.uniforms.uTime.value = t;
    diskMaterial.uniforms.uPulse.value = pulse;
    diskMaterial.uniforms.uBrightness.value = diskMaterial.userData.base * glow;
    haloMaterial.uniforms.uTime.value = t * 0.7;
    haloMaterial.uniforms.uPulse.value = pulse;
    haloMaterial.uniforms.uBrightness.value = haloMaterial.userData.base * glow;

    // The camera dollies toward the singularity across the whole scroll —
    // the page is one continuous fall inward. Capped short of the horizon so
    // the disk never fills the whole viewport (a fill-rate bomb on weak GPUs).
    state.camera.position.z = 9 - s * 3.3;

    // The mass grows and bobs; deeper = bigger. The intro multiplies this same
    // scale by `introState.zoom` (>1 while gathering/filling the screen,
    // eased back to exactly 1 by the time the intro hands off) — the object
    // never resets or swaps, it just settles into its hero size.
    group.scale.setScalar((0.82 + s * 0.2) * introState.zoom);
    group.position.y = Math.sin((state.clock.elapsedTime * Math.PI * 2) / 3.5) * 0.12;
  });

  return (
    <group ref={groupRef}>
      {/* Event horizon — pure black, light-swallowing */}
      <mesh>
        <sphereGeometry args={[1, 48, 48]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* The accretion disk, nearly edge-on, plus the matter falling in */}
      <group rotation={[DISK_TILT, 0, 0]}>
        <mesh material={diskMaterial}>
          <ringGeometry args={[1.18, 2.9, 128, 8]} />
        </mesh>
        <Motes />
      </group>

      {/* Lensed image of the disk — the camera-facing halo hugging the horizon */}
      <mesh material={haloMaterial} position={[0, 0, -0.02]}>
        <ringGeometry args={[1.03, 1.9, 128, 4]} />
      </mesh>

      {/* Photon ring — the thin bright edge right at the silhouette */}
      <mesh position={[0, 0, -0.01]}>
        <ringGeometry args={[1.03, 1.07, 128, 1]} />
        <meshBasicMaterial color="#FFF2DC" transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */

/**
 * The GRENWALL black hole — a light-swallowing event horizon wrapped in a
 * shader-driven accretion disk (white-hot inner rim, Doppler-bright side,
 * flowing streaks), a lensed halo hugging the silhouette, matter spiraling
 * in, all bloomed so the disk genuinely bleeds light. It's the spine of the
 * page: the camera continuously dollies toward the singularity as you scroll
 * (`fallState`), the disk grows and brightens, the pull and spin intensify,
 * and fast scrolling ripples the disk — the whole site is a fall inward.
 */
/** Pauses the render loop while the tab isn't visible — no point burning GPU/CPU on a hidden page. */
function usePageVisible(): boolean {
  const [visible, setVisible] = useState(() => document.visibilityState === 'visible');
  useEffect(() => {
    const onChange = () => setVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);
  return visible;
}

export default function GrenwallScene() {
  const visible = usePageVisible();
  return (
    <Canvas
      // Capped at 1.5 (never native/uncapped on a high-DPI display) — the disk
      // is a heavy additive + bloom shader, so fill-rate matters more than on
      // a typical scene. Bloom's own resolutionScale below does the rest of
      // the work keeping the fullscreen composer inside 60fps.
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 9], fov: 40 }}
      resize={{ scroll: false, offsetSize: true }}
      frameloop={visible ? 'always' : 'never'}
    >
      <BlackHole />
      {/* Pre-compiles shaders/materials against the current renderer up front,
          so the first frames after the intro's reveal mask opens don't stutter
          on a cold shader-compile — it would otherwise land mid-animation. */}
      <Preload all />
      {/* No Vignette here: it paints the transparent canvas rectangle visible
          against the page. The field's radial mask + section vignettes carry that.
          No refs on the effects either — under React 19 a ref leaks into props and
          postprocessing's JSON.stringify memo key chokes on the circular effect. */}
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={1.0}
          luminanceThreshold={0.28}
          luminanceSmoothing={0.25}
          mipmapBlur
          resolutionScale={0.5}
          levels={6}
        />
        <ChromaticAberration offset={[0.0014, 0.0009]} />
      </EffectComposer>
    </Canvas>
  );
}
