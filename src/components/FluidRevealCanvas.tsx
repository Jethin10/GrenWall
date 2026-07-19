import { useEffect, useRef } from 'react';
import {
  CanvasTexture,
  HalfFloatType,
  LinearFilter,
  Mesh,
  NearestFilter,
  OrthographicCamera,
  PlaneGeometry,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  VideoTexture,
  WebGLRenderer,
  WebGLRenderTarget,
} from 'three';
import { useReducedMotion } from '../lib/useReducedMotion';

const PASS_VERTEX = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const ADVECTION_FRAGMENT = `
precision highp float;

uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 uTexelSize;
uniform float uDt;
uniform float uDissipation;

varying vec2 vUv;

vec4 bilerp(sampler2D sam, vec2 uv, vec2 tsize) {
  vec2 st = uv / tsize - 0.5;
  vec2 iuv = floor(st);
  vec2 fuv = fract(st);
  vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
  vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
  vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
  vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
  return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
}

void main() {
  vec2 coord = vUv - uDt * texture2D(uVelocity, vUv).xy * uTexelSize;
  gl_FragColor = uDissipation * bilerp(uSource, coord, uTexelSize);
}
`;

const SPLAT_FRAGMENT = `
precision highp float;

uniform sampler2D uTarget;
uniform float uAspectRatio;
uniform vec2 uPoint;
uniform vec3 uColor;
uniform float uRadius;

varying vec2 vUv;

void main() {
  vec2 p = vUv - uPoint;
  p.x *= uAspectRatio;
  vec3 splat = exp(-dot(p, p) / uRadius) * uColor;
  vec3 base = texture2D(uTarget, vUv).xyz;
  gl_FragColor = vec4(base + splat, 1.0);
}
`;

const CURL_FRAGMENT = `
precision highp float;

uniform sampler2D uVelocity;
uniform vec2 uTexelSize;

varying vec2 vUv;

void main() {
  float L = texture2D(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).y;
  float R = texture2D(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).y;
  float T = texture2D(uVelocity, vUv + vec2(0.0, uTexelSize.y)).x;
  float B = texture2D(uVelocity, vUv - vec2(0.0, uTexelSize.y)).x;
  float vorticity = R - L - T + B;
  gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
}
`;

const VORTICITY_FRAGMENT = `
precision highp float;

uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform vec2 uTexelSize;
uniform float uCurlStrength;
uniform float uDt;

varying vec2 vUv;

void main() {
  float L = texture2D(uCurl, vUv - vec2(uTexelSize.x, 0.0)).x;
  float R = texture2D(uCurl, vUv + vec2(uTexelSize.x, 0.0)).x;
  float T = texture2D(uCurl, vUv + vec2(0.0, uTexelSize.y)).x;
  float B = texture2D(uCurl, vUv - vec2(0.0, uTexelSize.y)).x;
  float C = texture2D(uCurl, vUv).x;

  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  float forceLength = length(force) + 0.0001;
  force = force / forceLength * uCurlStrength * C;

  vec2 velocity = texture2D(uVelocity, vUv).xy;
  velocity += force * uDt;
  gl_FragColor = vec4(velocity, 0.0, 1.0);
}
`;

const DIVERGENCE_FRAGMENT = `
precision highp float;

uniform sampler2D uVelocity;
uniform vec2 uTexelSize;

varying vec2 vUv;

void main() {
  float L = texture2D(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).x;
  float R = texture2D(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).x;
  float T = texture2D(uVelocity, vUv + vec2(0.0, uTexelSize.y)).y;
  float B = texture2D(uVelocity, vUv - vec2(0.0, uTexelSize.y)).y;
  float divergence = 0.5 * (R - L + T - B);
  gl_FragColor = vec4(divergence, 0.0, 0.0, 1.0);
}
`;

const PRESSURE_FRAGMENT = `
precision highp float;

uniform sampler2D uPressure;
uniform sampler2D uDivergence;
uniform vec2 uTexelSize;

varying vec2 vUv;

void main() {
  float L = texture2D(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
  float R = texture2D(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
  float T = texture2D(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
  float B = texture2D(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
  float C = texture2D(uDivergence, vUv).x;
  gl_FragColor = vec4((L + R + B + T - C) * 0.25, 0.0, 0.0, 1.0);
}
`;

const GRADIENT_FRAGMENT = `
precision highp float;

uniform sampler2D uPressure;
uniform sampler2D uVelocity;
uniform vec2 uTexelSize;

varying vec2 vUv;

void main() {
  float L = texture2D(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
  float R = texture2D(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
  float T = texture2D(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
  float B = texture2D(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;

  vec2 velocity = texture2D(uVelocity, vUv).xy;
  velocity -= vec2(R - L, T - B) * 0.5;
  gl_FragColor = vec4(velocity, 0.0, 1.0);
}
`;

const COMPOSITE_FRAGMENT = `
precision highp float;

uniform sampler2D uBaseTexture;
uniform sampler2D uRevealTexture;
uniform sampler2D uDye;
uniform float uRevealSize;
uniform float uEdgeSoftness;
uniform float uEdgeWidth;
uniform float uRevealImageAspect;
uniform float uPlaneAspect;
uniform float uFitContain;
uniform float uContainCenterY;

varying vec2 vUv;

vec2 coverUv(vec2 uv, float imageAspect, float planeAspect) {
  vec2 ratio = vec2(
    min(planeAspect / imageAspect, 1.0),
    min(imageAspect / planeAspect, 1.0)
  );
  return vec2(
    uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    uv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );
}

vec2 containUv(vec2 uv, float imageAspect, float planeAspect, float centerY) {
  vec2 ratio = vec2(
    max(planeAspect / imageAspect, 1.0),
    max(imageAspect / planeAspect, 1.0)
  );
  return vec2(
    (uv.x - 0.5) * ratio.x + 0.5,
    (uv.y - centerY) * ratio.y + 0.5
  );
}

void main() {
  vec4 baseColor = texture2D(uBaseTexture, vUv);
  vec2 revealUv = uFitContain > 0.5
    ? containUv(vUv, uRevealImageAspect, uPlaneAspect, uContainCenterY)
    : coverUv(vUv, uRevealImageAspect, uPlaneAspect);
  // Outside the contain-fitted frame the clamp repeats the video's edge
  // pixels (a near-black surround), so the reveal keeps organic fluid
  // edges everywhere instead of hard-cropping to a rectangle.
  vec4 revealColor = texture2D(uRevealTexture, clamp(revealUv, 0.001, 0.999));
  float dye = texture2D(uDye, vUv).r;
  float raw = dye * uRevealSize;
  float mask = smoothstep(uEdgeSoftness, uEdgeSoftness + uEdgeWidth, raw);
  gl_FragColor = mix(baseColor, revealColor, clamp(mask, 0.0, 1.0));
}
`;

const SETTINGS = {
  simulationResolution: 192,
  dyeResolution: 512,
  velocityDissipation: 0.962,
  dyeDissipation: 0.991,
  pressureIterations: 12,
  curlStrength: 0,
  splatRadius: 0.00105,
  splatForce: 900,
  revealSize: 3.9,
  edgeSoftness: 0.5,
  edgeWidth: 0.018,
};

interface DoubleTarget {
  read: WebGLRenderTarget;
  write: WebGLRenderTarget;
  swap: () => void;
}

interface FluidRevealCanvasProps {
  activationDelay?: number;
}

function createTarget(size: number, filter: typeof LinearFilter | typeof NearestFilter) {
  return new WebGLRenderTarget(size, size, {
    minFilter: filter,
    magFilter: filter,
    format: RGBAFormat,
    type: HalfFloatType,
    depthBuffer: false,
    stencilBuffer: false,
  });
}

function createDoubleTarget(size: number, filter: typeof LinearFilter | typeof NearestFilter): DoubleTarget {
  const target: DoubleTarget = {
    read: createTarget(size, filter),
    write: createTarget(size, filter),
    swap: () => {
      const current = target.read;
      target.read = target.write;
      target.write = current;
    },
  };
  return target;
}

function createPassMaterial(fragmentShader: string, uniforms: ShaderMaterial['uniforms']) {
  return new ShaderMaterial({
    vertexShader: PASS_VERTEX,
    fragmentShader,
    uniforms,
    depthTest: false,
    depthWrite: false,
    transparent: false,
  });
}

function paintBaseLayer(root: HTMLElement, target: HTMLCanvasElement, drawingBuffer: Vector2) {
  const bounds = root.getBoundingClientRect();
  if (bounds.width < 1 || bounds.height < 1) return;

  target.width = Math.max(1, Math.round(drawingBuffer.x));
  target.height = Math.max(1, Math.round(drawingBuffer.y));
  const context = target.getContext('2d');
  if (!context) return;

  const scaleX = target.width / bounds.width;
  const scaleY = target.height / bounds.height;
  context.setTransform(scaleX, 0, 0, scaleY, 0, 0);
  context.clearRect(0, 0, bounds.width, bounds.height);
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, bounds.width, bounds.height);

  const word = root.querySelector<HTMLElement>('.hero-word');
  const masks = Array.from(root.querySelectorAll<HTMLElement>('.hero-letter-mask'));
  if (!word || masks.length === 0) return;

  const style = getComputedStyle(word);
  const fontSize = Number.parseFloat(style.fontSize) || bounds.width * 0.16;
  context.fillStyle = '#050505';
  context.font = `${style.fontStyle} ${style.fontWeight} ${fontSize}px ${style.fontFamily}`;
  context.textAlign = 'left';
  context.textBaseline = 'alphabetic';

  // Shared vertical metrics from the full wordmark so every mask sits on the
  // same baseline — per-glyph overshoots (e.g. the round G) would otherwise
  // nudge rows or letters a pixel apart.
  const values = masks.map(
    (mask) => mask.querySelector<HTMLElement>('[data-brand-letter]')?.textContent ?? '',
  );
  const fullMetrics = context.measureText(values.join(''));
  const ascent = fullMetrics.actualBoundingBoxAscent || fontSize * 0.75;
  const descent = fullMetrics.actualBoundingBoxDescent || fontSize * 0.2;
  const glyphHeight = ascent + descent;

  // Measure the static mask wrappers, not the letter spans: the intro tween
  // translates the spans inside the masks, so a paint that lands mid-flight
  // would otherwise freeze the letters at animated offsets.
  for (const [index, mask] of masks.entries()) {
    const value = values[index];
    if (!value) continue;
    const maskBounds = mask.getBoundingClientRect();
    const paddingBottom = Number.parseFloat(getComputedStyle(mask).paddingBottom) || 0;
    const restHeight = maskBounds.height - paddingBottom;
    const measuredWidth = Math.max(context.measureText(value).width, 1);
    const baseline = maskBounds.top - bounds.top + (restHeight - glyphHeight) * 0.5 + ascent;
    const horizontalScale = Math.max(0.2, maskBounds.width / measuredWidth);

    context.save();
    context.translate(maskBounds.left - bounds.left, 0);
    context.scale(horizontalScale, 1);
    context.fillText(value, 0, baseline);
    context.restore();
  }
}

export function FluidRevealCanvas({ activationDelay = 1350 }: FluidRevealCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) {
      return;
    }

    const coarsePointer = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const initialise = () => {
      if (cancelled) return;
      const root = canvas.closest<HTMLElement>('.hero');
      if (!root) return;

      let renderer: WebGLRenderer;
      try {
        renderer = new WebGLRenderer({
          canvas,
          alpha: true,
          antialias: false,
          depth: false,
          stencil: false,
          premultipliedAlpha: false,
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance',
        });
      } catch {
        return;
      }

      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarsePointer ? 1.4 : 1.75));
      renderer.autoClear = false;

      const scene = new Scene();
      const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const geometry = new PlaneGeometry(2, 2);
      const passMesh = new Mesh(geometry);
      scene.add(passMesh);

      const simulationTexel = new Vector2(
        1 / SETTINGS.simulationResolution,
        1 / SETTINGS.simulationResolution,
      );
      const dyeTexel = new Vector2(1 / SETTINGS.dyeResolution, 1 / SETTINGS.dyeResolution);
      const velocity = createDoubleTarget(SETTINGS.simulationResolution, LinearFilter);
      const pressure = createDoubleTarget(SETTINGS.simulationResolution, NearestFilter);
      const dye = createDoubleTarget(SETTINGS.dyeResolution, LinearFilter);
      const curlTarget = createTarget(SETTINGS.simulationResolution, NearestFilter);
      const divergenceTarget = createTarget(SETTINGS.simulationResolution, NearestFilter);

      const curlMaterial = createPassMaterial(CURL_FRAGMENT, {
        uVelocity: { value: null },
        uTexelSize: { value: simulationTexel },
      });
      const vorticityMaterial = createPassMaterial(VORTICITY_FRAGMENT, {
        uVelocity: { value: null },
        uCurl: { value: null },
        uTexelSize: { value: simulationTexel },
        uCurlStrength: { value: SETTINGS.curlStrength },
        uDt: { value: 0.016 },
      });
      const advectionMaterial = createPassMaterial(ADVECTION_FRAGMENT, {
        uVelocity: { value: null },
        uSource: { value: null },
        uTexelSize: { value: simulationTexel },
        uDt: { value: 1 },
        uDissipation: { value: SETTINGS.velocityDissipation },
      });
      const splatMaterial = createPassMaterial(SPLAT_FRAGMENT, {
        uTarget: { value: null },
        uAspectRatio: { value: 1 },
        uPoint: { value: new Vector2() },
        uColor: { value: new Vector3() },
        uRadius: { value: SETTINGS.splatRadius },
      });
      const divergenceMaterial = createPassMaterial(DIVERGENCE_FRAGMENT, {
        uVelocity: { value: null },
        uTexelSize: { value: simulationTexel },
      });
      const pressureMaterial = createPassMaterial(PRESSURE_FRAGMENT, {
        uPressure: { value: null },
        uDivergence: { value: null },
        uTexelSize: { value: simulationTexel },
      });
      const gradientMaterial = createPassMaterial(GRADIENT_FRAGMENT, {
        uPressure: { value: null },
        uVelocity: { value: null },
        uTexelSize: { value: simulationTexel },
      });

      const baseCanvas = document.createElement('canvas');
      const baseTexture = new CanvasTexture(baseCanvas);
      baseTexture.minFilter = LinearFilter;
      baseTexture.magFilter = LinearFilter;
      baseTexture.generateMipmaps = false;
      const video = root.querySelector<HTMLVideoElement>('.hero-media video');
      const revealTexture = video ? new VideoTexture(video) : baseTexture;
      revealTexture.minFilter = LinearFilter;
      revealTexture.magFilter = LinearFilter;
      revealTexture.generateMipmaps = false;

      const compositeMaterial = new ShaderMaterial({
        vertexShader: PASS_VERTEX,
        fragmentShader: COMPOSITE_FRAGMENT,
        uniforms: {
          uBaseTexture: { value: baseTexture },
          uRevealTexture: { value: revealTexture },
          uDye: { value: dye.read.texture },
          uRevealSize: { value: SETTINGS.revealSize },
          uEdgeSoftness: { value: SETTINGS.edgeSoftness },
          uEdgeWidth: { value: SETTINGS.edgeWidth },
          uRevealImageAspect: { value: video?.videoWidth && video.videoHeight ? video.videoWidth / video.videoHeight : 16 / 9 },
          uPlaneAspect: { value: 1 },
          // Touch viewports are portrait, so a cover fit crops the 16:9
          // material video to an unreadable zoomed slice. Contain scales the
          // full frame to fit, banded around the wordmark.
          uFitContain: { value: coarsePointer ? 1 : 0 },
          uContainCenterY: { value: 0.5 },
        },
        transparent: false,
        premultipliedAlpha: false,
        depthTest: false,
        depthWrite: false,
      });

      const renderPass = (material: ShaderMaterial, target: WebGLRenderTarget | null) => {
        passMesh.material = material;
        renderer.setRenderTarget(target);
        renderer.render(scene, camera);
      };

      const clearTarget = (target: WebGLRenderTarget) => {
        renderer.setRenderTarget(target);
        renderer.clear(true, false, false);
      };

      [
        velocity.read,
        velocity.write,
        pressure.read,
        pressure.write,
        dye.read,
        dye.write,
        curlTarget,
        divergenceTarget,
      ].forEach(clearTarget);
      renderer.setRenderTarget(null);

      const drawingBuffer = new Vector2();
      const resize = () => {
        const bounds = root.getBoundingClientRect();
        renderer.setSize(Math.max(1, bounds.width), Math.max(1, bounds.height), false);
        const planeAspect = bounds.width / bounds.height;
        compositeMaterial.uniforms.uPlaneAspect.value = planeAspect;
        if (coarsePointer) {
          const word = root.querySelector<HTMLElement>('.hero-word');
          if (word && bounds.height > 0) {
            const wordBounds = word.getBoundingClientRect();
            const centerY =
              1 - (wordBounds.top + wordBounds.height / 2 - bounds.top) / bounds.height;
            const imageAspect = compositeMaterial.uniforms.uRevealImageAspect.value as number;
            const halfBand = 0.5 * Math.min(planeAspect / imageAspect, 1);
            compositeMaterial.uniforms.uContainCenterY.value = Math.min(
              1 - halfBand,
              Math.max(halfBand, centerY),
            );
          }
        }
        renderer.getDrawingBufferSize(drawingBuffer);
        paintBaseLayer(root, baseCanvas, drawingBuffer);
        baseTexture.needsUpdate = true;
      };

      resize();
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(root);
      // fonts.ready can resolve before the wordmark face has even STARTED
      // loading, leaving the base layer painted with fallback-font metrics
      // (rows misaligned, wrong widths). Force-load the exact face the
      // wordmark uses and repaint once it is really available to the canvas.
      const wordElement = root.querySelector<HTMLElement>('.hero-word');
      if (wordElement) {
        const wordStyle = getComputedStyle(wordElement);
        document.fonts
          .load(`${wordStyle.fontWeight} ${wordStyle.fontSize} ${wordStyle.fontFamily}`)
          .then(() => {
            if (!cancelled) resize();
          })
          .catch(() => undefined);
      }
      document.fonts.ready.then(() => {
        if (!cancelled) resize();
      });

      const ensureVideoPlayback = () => {
        if (!video) return;
        video.muted = true;
        video.defaultMuted = true;
        video.loop = true;
        video.playsInline = true;
        void video.play().catch(() => undefined);
      };
      ensureVideoPlayback();
      video?.addEventListener('loadeddata', ensureVideoPlayback);
      video?.addEventListener('canplay', ensureVideoPlayback);

      // On touch the video is contain-fitted around the wordmark (see
      // uFitContain) and the hero copy difference-blends to white under the
      // dark material, so the reveal can stay generous; only the splat is
      // slightly tighter to suit finger-sized drags.
      const revealSize = SETTINGS.revealSize;
      const splatRadius = coarsePointer ? SETTINGS.splatRadius * 0.8 : SETTINGS.splatRadius;
      const dyeDissipation = coarsePointer ? 0.985 : SETTINGS.dyeDissipation;
      compositeMaterial.uniforms.uRevealSize.value = revealSize;

      const pointer = { x: 0.5, y: 0.5 };
      const previousPointer = { x: 0.5, y: 0.5 };
      let pointerMoved = false;
      let hasPointerSample = false;
      let splatSequence = 0;
      const updatePointer = (event: MouseEvent | PointerEvent) => {
        const bounds = root.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        ) {
          hasPointerSample = false;
          return;
        }
        pointer.x = (event.clientX - bounds.left) / bounds.width;
        pointer.y = 1 - (event.clientY - bounds.top) / bounds.height;
        if (!hasPointerSample) {
          previousPointer.x = pointer.x;
          previousPointer.y = pointer.y;
          hasPointerSample = true;
          return;
        }
        pointerMoved = true;
      };
      const onPointerMove = (event: PointerEvent) => {
        updatePointer(event);
      };
      const onTouchMove = (event: TouchEvent) => {
        const touch = event.touches[0];
        if (!touch) return;
        updatePointer({ clientX: touch.clientX, clientY: touch.clientY } as MouseEvent);
      };
      root.addEventListener('mousemove', updatePointer, { passive: true });
      root.addEventListener('pointermove', onPointerMove, { passive: true });
      root.addEventListener('touchmove', onTouchMove, { passive: true });

      let visible = true;
      const intersectionObserver = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      intersectionObserver.observe(root);

      const step = () => {
        const bounds = root.getBoundingClientRect();
        const aspect = Math.max(0.1, bounds.width / bounds.height);

        if (pointerMoved) {
          const deltaX = pointer.x - previousPointer.x;
          const deltaY = pointer.y - previousPointer.y;
          if (Math.hypot(deltaX, deltaY) > 0) {
            const pixelDistance = Math.hypot(deltaX * bounds.width, deltaY * bounds.height);
            const samples = Math.min(6, Math.max(1, Math.ceil(pixelDistance / 24)));
            for (let sample = 1; sample <= samples; sample += 1) {
              const progress = sample / samples;
              const pointX = previousPointer.x + deltaX * progress;
              const pointY = previousPointer.y + deltaY * progress;

              splatMaterial.uniforms.uTarget.value = velocity.read.texture;
              splatMaterial.uniforms.uAspectRatio.value = aspect;
              splatMaterial.uniforms.uPoint.value.set(pointX, pointY);
              splatMaterial.uniforms.uColor.value.set(
                (deltaX / samples) * SETTINGS.splatForce,
                (deltaY / samples) * SETTINGS.splatForce,
                0,
              );
              splatMaterial.uniforms.uRadius.value = splatRadius;
              renderPass(splatMaterial, velocity.write);
              velocity.swap();

              splatMaterial.uniforms.uTarget.value = dye.read.texture;
              splatMaterial.uniforms.uColor.value.set(1, 1, 1);
              renderPass(splatMaterial, dye.write);
              dye.swap();
            }

            splatSequence += 1;
            canvas.dataset.splats = String(splatSequence);
            if (splatSequence % 2 === 0) {
              const directionLength = Math.max(Math.hypot(deltaX, deltaY), 0.0001);
              const side = splatSequence % 4 === 0 ? 1 : -1;
              const satelliteX = Math.min(
                0.985,
                Math.max(0.015, pointer.x + (-deltaY / directionLength) * 0.055 * side),
              );
              const satelliteY = Math.min(
                0.985,
                Math.max(0.015, pointer.y + (deltaX / directionLength) * 0.055 * side),
              );
              splatMaterial.uniforms.uTarget.value = dye.read.texture;
              splatMaterial.uniforms.uPoint.value.set(satelliteX, satelliteY);
              splatMaterial.uniforms.uColor.value.set(0.78, 0.78, 0.78);
              splatMaterial.uniforms.uRadius.value = splatRadius * 0.12;
              renderPass(splatMaterial, dye.write);
              dye.swap();
            }
          }
          previousPointer.x = pointer.x;
          previousPointer.y = pointer.y;
          pointerMoved = false;
        }

        curlMaterial.uniforms.uVelocity.value = velocity.read.texture;
        renderPass(curlMaterial, curlTarget);

        vorticityMaterial.uniforms.uVelocity.value = velocity.read.texture;
        vorticityMaterial.uniforms.uCurl.value = curlTarget.texture;
        renderPass(vorticityMaterial, velocity.write);
        velocity.swap();

        advectionMaterial.uniforms.uVelocity.value = velocity.read.texture;
        advectionMaterial.uniforms.uSource.value = velocity.read.texture;
        advectionMaterial.uniforms.uTexelSize.value = simulationTexel;
        advectionMaterial.uniforms.uDissipation.value = SETTINGS.velocityDissipation;
        renderPass(advectionMaterial, velocity.write);
        velocity.swap();

        advectionMaterial.uniforms.uVelocity.value = velocity.read.texture;
        advectionMaterial.uniforms.uSource.value = dye.read.texture;
        advectionMaterial.uniforms.uTexelSize.value = dyeTexel;
        advectionMaterial.uniforms.uDissipation.value = dyeDissipation;
        renderPass(advectionMaterial, dye.write);
        dye.swap();

        divergenceMaterial.uniforms.uVelocity.value = velocity.read.texture;
        renderPass(divergenceMaterial, divergenceTarget);

        clearTarget(pressure.read);
        pressureMaterial.uniforms.uDivergence.value = divergenceTarget.texture;
        for (let iteration = 0; iteration < SETTINGS.pressureIterations; iteration += 1) {
          pressureMaterial.uniforms.uPressure.value = pressure.read.texture;
          renderPass(pressureMaterial, pressure.write);
          pressure.swap();
        }

        gradientMaterial.uniforms.uPressure.value = pressure.read.texture;
        gradientMaterial.uniforms.uVelocity.value = velocity.read.texture;
        renderPass(gradientMaterial, velocity.write);
        velocity.swap();

        if (video?.videoWidth && video.videoHeight) {
          compositeMaterial.uniforms.uRevealImageAspect.value = video.videoWidth / video.videoHeight;
        }
        compositeMaterial.uniforms.uDye.value = dye.read.texture;
        renderer.setRenderTarget(null);
        renderer.clear(true, false, false);
        renderPass(compositeMaterial, null);
      };

      step();
      root.dataset.fluidReady = 'true';
      canvas.dataset.ready = 'true';

      let animationFrame = 0;
      let lastFrame = 0;
      let lastPlaybackAttempt = 0;
      const animate = (now: number) => {
        animationFrame = requestAnimationFrame(animate);
        if (!visible || document.hidden) return;
        if (now - lastFrame < 30) return;
        lastFrame = now;
        if (video?.paused && video.readyState >= 2 && now - lastPlaybackAttempt > 1000) {
          lastPlaybackAttempt = now;
          ensureVideoPlayback();
        }
        step();
      };
      animationFrame = requestAnimationFrame(animate);

      cleanup = () => {
        cancelAnimationFrame(animationFrame);
        root.removeEventListener('mousemove', updatePointer);
        root.removeEventListener('pointermove', onPointerMove);
        root.removeEventListener('touchmove', onTouchMove);
        video?.removeEventListener('loadeddata', ensureVideoPlayback);
        video?.removeEventListener('canplay', ensureVideoPlayback);
        intersectionObserver.disconnect();
        resizeObserver.disconnect();
        delete root.dataset.fluidReady;
        delete canvas.dataset.ready;
        delete canvas.dataset.splats;
        geometry.dispose();
        baseTexture.dispose();
        if (video) revealTexture.dispose();
        velocity.read.dispose();
        velocity.write.dispose();
        pressure.read.dispose();
        pressure.write.dispose();
        dye.read.dispose();
        dye.write.dispose();
        curlTarget.dispose();
        divergenceTarget.dispose();
        curlMaterial.dispose();
        vorticityMaterial.dispose();
        advectionMaterial.dispose();
        splatMaterial.dispose();
        divergenceMaterial.dispose();
        pressureMaterial.dispose();
        gradientMaterial.dispose();
        compositeMaterial.dispose();
        renderer.dispose();
      };
    };

    const activationTimer = window.setTimeout(initialise, activationDelay);
    return () => {
      cancelled = true;
      window.clearTimeout(activationTimer);
      cleanup?.();
    };
  }, [activationDelay, reducedMotion]);

  return <canvas ref={canvasRef} className="hero-fluid-canvas" aria-hidden="true" />;
}
