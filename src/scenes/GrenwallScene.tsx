import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber';
import { Environment, Lightformer, MeshTransmissionMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

const BONE = '#F2EFE7';
const EMBER = '#D8823A';

// Same "G" path as Monogram.tsx, extruded and suspended glowing at the
// crystal's core — the exact brand path given real depth, not a second
// letterform hand-authored just for 3D.
const G_PATH =
  'M27 14.2C25.2 12 22.8 10.8 20 10.8c-5.4 0-9.8 4.4-9.8 9.8s4.4 9.8 9.8 9.8c4.6 0 8.5-3.2 9.5-7.5H19.8v-3.4h13.2c.05.6.05 1.1.05 1.7 0 7-5.5 12.6-13.3 12.6C12 33.8 6.4 28.2 6.4 21S12 8.2 19.7 8.2c3.9 0 7.2 1.4 9.6 3.9L27 14.2z';

function buildGGeometry(): THREE.ExtrudeGeometry {
  const loader = new SVGLoader();
  const data = loader.parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${G_PATH}"/></svg>`);
  const shapes = data.paths.flatMap((p) => p.toShapes());
  const geometry = new THREE.ExtrudeGeometry(shapes, {
    depth: 5,
    bevelEnabled: true,
    bevelThickness: 0.6,
    bevelSize: 0.4,
    bevelSegments: 3,
    curveSegments: 20,
  });
  geometry.center();
  geometry.scale(0.026, -0.026, 0.026); // SVG y-down -> three y-up, scaled to sit comfortably inside the crystal shell
  geometry.computeVertexNormals();
  return geometry;
}

/** A soft radial glow, generated once as a canvas texture — no external asset. */
function buildGlowTexture(hex: string): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, `${hex}aa`);
  gradient.addColorStop(0.5, `${hex}33`);
  gradient.addColorStop(1, `${hex}00`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** A soft, edgeless glow behind the crystal so the transmission material has color to refract. */
function Backdrop() {
  const texture = useMemo(() => buildGlowTexture(BONE), []);
  return (
    <mesh position={[0, 0.2, -3]}>
      <planeGeometry args={[6, 6]} />
      <meshBasicMaterial map={texture} transparent opacity={0.5} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function GroundGlow() {
  const texture = useMemo(() => buildGlowTexture(EMBER), []);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const material = mesh.material as THREE.MeshBasicMaterial;
    material.opacity = 0.35 + Math.sin(state.clock.elapsedTime * 0.6) * 0.08;
  });

  return (
    <mesh ref={meshRef} position={[0, -2.6, -1]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[5.5, 5.5]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function CrystalGroup() {
  const groupRef = useRef<THREE.Group>(null);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const gGeometry = useMemo(buildGGeometry, []);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!dragging.current || !groupRef.current) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      groupRef.current.rotation.y += dx * 0.012;
      groupRef.current.rotation.x += dy * 0.012;
      lastPos.current = { x: e.clientX, y: e.clientY };
    }
    function onUp() {
      dragging.current = false;
    }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    if (!dragging.current) {
      group.rotation.y += delta * 0.22;
      group.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.22;
      const targetTilt = state.pointer.y * -0.22;
      group.rotation.x += (targetTilt - group.rotation.x) * 0.03;
    }
  });

  return (
    <group ref={groupRef} onPointerDown={handlePointerDown}>
      <mesh scale={[1, 1.32, 1]}>
        <octahedronGeometry args={[1.35, 0]} />
        <MeshTransmissionMaterial
          samples={6}
          resolution={256}
          transmission={1}
          thickness={1}
          roughness={0.05}
          ior={1.4}
          chromaticAberration={0.06}
          anisotropy={0.3}
          distortion={0.1}
          distortionScale={0.25}
          temporalDistortion={0.06}
          clearcoat={0.6}
          color={BONE}
          attenuationColor={BONE}
          attenuationDistance={4.5}
        />
      </mesh>
      <mesh geometry={gGeometry}>
        <meshStandardMaterial color={BONE} emissive={EMBER} emissiveIntensity={1.4} roughness={0.35} />
      </mesh>
      <pointLight position={[0, 0, 0]} color={EMBER} intensity={1.1} distance={3.5} />
      <Sparkles count={32} scale={3} size={2.2} speed={0.22} color={BONE} opacity={0.4} />
    </group>
  );
}

/** The floating GRENWALL crystal — a glass shell around a glowing "G", bobbing, spun by drag, eased toward the cursor. */
export default function GrenwallScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 9], fov: 40 }}
      // The wrapper is CSS-scaled (via GSAP) as it travels the page, not resized —
      // measuring on scroll would pick up that scaled visual size and shrink the
      // real render resolution to match, breaking MeshTransmissionMaterial's FBO.
      resize={{ scroll: false, offsetSize: true }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 4, 5]} intensity={0.4} color={BONE} />
      <Environment resolution={64} background={false}>
        <Lightformer intensity={2.5} color={BONE} position={[0, 3, 2]} scale={[4, 4, 1]} />
        <Lightformer intensity={1.4} color={EMBER} position={[-3, -1, 2]} scale={[2, 2, 1]} />
        <Lightformer intensity={0.8} color={BONE} position={[3, 0, -3]} scale={[3, 3, 1]} />
      </Environment>
      <Backdrop />
      <GroundGlow />
      <CrystalGroup />
    </Canvas>
  );
}
