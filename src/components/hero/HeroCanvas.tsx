import { useEffect, useRef } from 'react';
import type { WebGLRenderer } from 'three';

/**
 * Decorative Three.js blob layer behind the hero.
 * - dynamic-imported so it never enters the critical-path bundle
 * - dropped for reduced-motion, touch devices, or low-end hardware
 * - guarded WebGL availability; no-JS sees a static CSS gradient instead
 */
export default function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (reduced || coarse) return;

    const nav = navigator as Navigator & { deviceMemory?: number };
    const memory = nav.deviceMemory ?? 4;
    const cores = nav.hardwareConcurrency ?? 4;
    if (memory < 2 || cores < 4) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    import('three')
      .then((THREE) => {
        if (disposed || !canvas) return;
        let renderer: WebGLRenderer | null = null;
        try {
          renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        } catch {
          return; // WebGL unavailable — static gradient stays
        }
        if (!renderer) return;

        const vertex = /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = position.xy * 0.5 + 0.5;
            gl_Position = vec4(position.xy, 0.0, 1.0);
          }
        `;
        const fragment = /* glsl */ `
          uniform float uTime;
          uniform vec2 uRes;
          varying vec2 vUv;
          void main() {
            vec2 asp = vec2(uRes.x / uRes.y, 1.0);
            vec2 p = vUv * asp;
            vec3 teal = vec3(0.07, 0.42, 0.38);
            vec3 tealBright = vec3(0.06, 0.72, 0.62);
            vec3 mint = vec3(0.56, 0.84, 0.75);
            float t = uTime * 0.12;
            vec2 b1 = vec2(0.72, 0.30) + vec2(sin(t), cos(t * 1.3)) * 0.04;
            vec2 b2 = vec2(0.15, 0.82) + vec2(cos(t * 0.8), sin(t * 1.1)) * 0.05;
            float d1 = length((p - b1 * asp) * vec2(1.0, 1.5));
            float d2 = length((p - b2 * asp) * vec2(1.5, 1.0));
            float g1 = 1.0 - smoothstep(0.0, 1.35, d1);
            float g2 = 1.0 - smoothstep(0.0, 1.05, d2);
            vec3 col = vec3(0.965, 0.984, 0.98);
            col = mix(col, teal, 0.30 * g1);
            col = mix(col, tealBright, 0.22 * g2);
            col = mix(col, mint, 0.20 * (g1 * g2) * 2.0);
            gl_FragColor = vec4(col, 0.85);
          }
        `;

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-1, -1, 3, -1, -1, 3]), 2));
        const material = new THREE.ShaderMaterial({
          vertexShader: vertex,
          fragmentShader: fragment,
          uniforms: { uTime: { value: 0 }, uRes: { value: [1, 1] } },
          transparent: true,
          depthWrite: false,
        });
        const mesh = new THREE.Mesh(geo, material);
        scene.add(mesh);
        camera.position.z = 1;

        const rendererRef = renderer;
        const materialRef = material;
        const geoRef = geo;
        const start = performance.now();
        let raf = 0;
        const resize = () => {
          const { clientWidth, clientHeight } = canvas;
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          rendererRef.setSize(clientWidth, clientHeight, false);
          rendererRef.setPixelRatio(dpr);
          materialRef.uniforms.uRes.value = [clientWidth, clientHeight];
        };
        const loop = () => {
          raf = requestAnimationFrame(loop);
          materialRef.uniforms.uTime.value = (performance.now() - start) / 1000;
          rendererRef.render(scene, camera);
        };
        resize();
        window.addEventListener('resize', resize);
        loop();

        cleanup = () => {
          cancelAnimationFrame(raf);
          window.removeEventListener('resize', resize);
          materialRef.dispose();
          geoRef.dispose();
          rendererRef.dispose();
        };
      })
      .catch(() => {
        /* three import failed — static gradient remains */
      });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-80"
    />
  );
}