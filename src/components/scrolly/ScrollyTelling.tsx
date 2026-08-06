import { useEffect, useRef } from 'react';
import { KLASTER } from '@/lib/data/site-content';
import { idText } from '@/lib/i18n-dicts';

const STEPS = KLASTER.length;

const chipStyles = [
  'bg-mint/20 text-mint',
  'bg-amber-400/20 text-amber-300',
  'bg-teal-400/20 text-teal-200',
  'bg-teal-600/20 text-teal-200',
  'bg-amber-500/20 text-amber-300',
];
const ghostAccents = ['text-mint', 'text-amber-300', 'text-teal-300', 'text-teal-400', 'text-amber-400'];

const stepLabel = (num: string) => (num === 'Lintas' ? 'Lintas Klaster' : `Klaster ${num}`);

/**
 * Desktop scrollytelling narrative for the 5 service clusters (Klaster 01â€“05).
 * - GSAP ScrollTrigger pins the two-pane stage; scroll progress advances the
 *   active panel, the rail dots, and the progress fill.
 * - gsap is dynamic-imported (shares the lazy chunk with Globals).
 * - Reduced-motion / <1024px / no-JS: stays a stacked CSS layout (visible).
 */
export default function ScrollyTelling() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !window.matchMedia('(min-width: 1024px)').matches) return;

    let alive = true;
    let kill: (() => void) | undefined;

    import('gsap')
      .then(async ({ gsap }) => {
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);
        if (!alive) return;

        root.classList.add('is-scrolly');
        const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-scroll-panel]'));
        const dots = Array.from(root.querySelectorAll<HTMLElement>('[data-scroll-dot]'));
        const fill = root.querySelector<HTMLElement>('[data-scroll-fill]');
        let current = -1;

        const setActive = (i: number) => {
          current = i;
          panels.forEach((p, idx) => p.classList.toggle('is-active', idx === i));
          dots.forEach((d, idx) => {
            d.classList.toggle('is-active', idx <= i);
            d.setAttribute('aria-current', idx === i ? 'step' : 'false');
          });
          if (fill) fill.style.height = `${((i + 1) / STEPS) * 100}%`;
        };
        setActive(0);

        const stage = root.querySelector<HTMLElement>('[data-scrolly]') ?? root;
        const trigger = ScrollTrigger.create({
          trigger: stage,
          start: 'top top+=80',
          end: `+=${STEPS * 540}`,
          pin: true,
          anticipatePin: 1,
          scrub: 0.4,
          onUpdate: (self) => {
            const idx = Math.min(STEPS - 1, Math.max(0, Math.floor(self.progress * STEPS)));
            if (idx !== current) setActive(idx);
          },
        });

        kill = () => {
          trigger.kill();
          root.classList.remove('is-scrolly');
        };
      })
      .catch(() => {
        /* gsap unavailable â€” stacked CSS layout stays visible */
      });

    return () => {
      alive = false;
      kill?.();
    };
  }, []);

  return (
    <div ref={ref}>
      <div data-scrolly className="mt-14 hidden grid-cols-[300px_1fr] gap-12 lg:grid">
        {/* Progress rail */}
        <div className="relative">
          <ol className="relative space-y-8 pl-9" aria-label="Klaster pelayanan">
            <span aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-white/15"></span>
            <span aria-hidden data-scroll-fill className="absolute bottom-2 left-[7px] top-2 w-px bg-mint"></span>
            {KLASTER.map((k) => (
              <li key={k.key} data-scroll-dot className="relative">
                <span aria-hidden className="scrolly-dot absolute -left-[21px] top-2 h-4 w-4 rounded-full border-2 bg-ink"></span>
                <span className="scrolly-label font-mono text-[0.7rem] font-bold uppercase tracking-[0.22em]">
                  {stepLabel(k.num)}
                </span>
                <h4 className="mt-1 font-display text-lg font-semibold">
                  <span data-i18n={`services.${k.key}`}>{idText(`services.${k.key}`)}</span>
                </h4>
              </li>
            ))}
          </ol>
        </div>

        {/* Narrative stage */}
        <div className="relative">
          <div className="grid min-h-[62vh] items-center rounded-[2rem] border border-teal-700/50 bg-white/5 p-8 backdrop-blur sm:p-10 lg:min-h-[58vh]">
            {KLASTER.map((k, i) => (
              <article key={k.key} data-scroll-panel className="is-active">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <span
                      className={
                        'inline-flex rounded-full px-3 py-1 font-mono text-[0.7rem] font-bold tracking-wider ' +
                        chipStyles[i % chipStyles.length]
                      }
                    >
                      {stepLabel(k.num)}
                    </span>
                    <h4 className="mt-5 font-display text-2xl font-bold text-white" data-i18n={`services.${k.key}`}>
                      {idText(`services.${k.key}`)}
                    </h4>
                    <p className="mt-3 max-w-md text-lg leading-relaxed text-teal-100/70" data-i18n={`services.${k.key}Desc`}>
                      {idText(`services.${k.key}Desc`)}
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className={
                      'pointer-events-none select-none font-display text-[6.5rem] font-bold leading-none ' +
                      ghostAccents[i % ghostAccents.length]
                    }
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}