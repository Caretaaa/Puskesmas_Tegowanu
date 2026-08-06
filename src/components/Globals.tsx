import { useEffect } from 'react';
import type Lenis from 'lenis';
import type { gsap as GsapCore } from 'gsap';

/**
 * Site-wide progressive-enhancement island:
 *  - Lenis smooth scroll (skipped on reduced-motion)
 *  - GSAP scroll reveals + hero rise + stat counters
 *  - ScrollSpy for nav highlighting
 *  - Aurora cursor (desktop, fine pointer, GPU-transforms only)
 * All effects default to visible DOM so no-JS / reduced-motion is never broken.
 *
 * gsap / lenis are loaded lazily via dynamic `import()` so animation libs stay
 * out of the critical path (PRD §3.1 — ≤60KB gzip initial JS on landing).
 */
export default function Globals() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(prefers-pointer: fine)').matches;
    let alive = true;
    let lenis: InstanceType<typeof Lenis> | null = null;
    let ctx: ReturnType<typeof GsapCore.context> | null = null;
    const cleanups: Array<() => void> = [];

    // Header "scrolled" state
    const header = document.querySelector<HTMLElement>('[data-header]');
    const onHeaderDetect = () => {
      if (!header) return;
      const scrolled = window.scrollY > 10;
      header.classList.toggle('is-scrolled', scrolled);
    };
    window.addEventListener('scroll', onHeaderDetect, { passive: true });
    onHeaderDetect();
    cleanups.push(() => window.removeEventListener('scroll', onHeaderDetect));

    // ScrollSpy — always on
    const spyTargets = Array.from(document.querySelectorAll<HTMLElement>('[data-spy]'));
    const navLinks = Array.from(document.querySelectorAll<HTMLElement>('[data-nav]'));
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute('data-spy');
          navLinks.forEach((link) => {
            const on = link.getAttribute('data-nav') === id;
            link.classList.toggle('is-active', on);
            link.setAttribute('aria-current', on ? 'true' : 'false');
          });
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    );
    spyTargets.forEach((el) => spy.observe(el));
    cleanups.push(() => spy.disconnect());

    if (!prefersReduced) {
      const startAnimations = async () => {
        const [{ default: LenisCtor }, { gsap }, { ScrollTrigger }] = await Promise.all([
          import('lenis'),
          import('gsap'),
          import('gsap/ScrollTrigger'),
        ]);
        gsap.registerPlugin(ScrollTrigger);
        if (!alive) return;

        // Allow islands (e.g. AboutTabs) to trigger a position refresh when
        // their layout changes (tab switches mount/unmount parallax targets).
        const refresh = () => ScrollTrigger.refresh();
        window.addEventListener('pktsg:refresh-animations', refresh);
        cleanups.push(() => window.removeEventListener('pktsg:refresh-animations', refresh));

        ctx = gsap.context(() => {});
        lenis = new LenisCtor({ lerp: 0.1, wheelMultiplier: 1 });
        lenis.on('scroll', ScrollTrigger.update);
        const tickerCb = (time: number) => lenis?.raf(time * 1000);
        gsap.ticker.add(tickerCb);
        gsap.ticker.lagSmoothing(0);
        cleanups.push(() => gsap.ticker.remove(tickerCb));

        ctx.add(() => {
          // Hero entrance — transforms only (content stays painted for LCP).
          gsap.from('.hero-anim', {
            y: 26,
            filter: 'blur(6px)',
            duration: 0.9,
            stagger: 0.07,
            ease: 'power2.out',
            delay: 0.05,
          });

          // Scroll reveals
          gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
            gsap.fromTo(
              el,
              { autoAlpha: 0, y: 30 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: { trigger: el, start: 'top 88%', once: true },
              },
            );
          });

          // Number counters — real text stays in the DOM for no-JS/SEO.
          gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
            const target = Number(el.dataset.count);
            if (!Number.isFinite(target)) return;
            const obj = { n: 0 };
            gsap.to(obj, {
              n: target,
              duration: 1.6,
              ease: 'power1.out',
              scrollTrigger: { trigger: el, start: 'top 92%', once: true },
              onUpdate: () => {
                el.textContent = String(Math.round(obj.n));
              },
            });
          });

          // Parallax layers — transform-only, scrub-driven (desktop only).
          if (window.matchMedia('(min-width: 768px)').matches) {
            gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
              const speed = Number(el.dataset.parallaxSpeed ?? 0.2);
              if (!Number.isFinite(speed) || speed <= 0) return;
              gsap.fromTo(
                el,
                { yPercent: speed * 50 },
                {
                  yPercent: -speed * 50,
                  ease: 'none',
                  scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
                },
              );
            });
          }
        });

        // Same-page anchor navigation through Lenis
        const onAnchorClick = (e: Event) => {
          const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
          if (!a || !lenis) return;
          const href = a.getAttribute('href');
          if (!href || href === '#') return;
          if (a.hasAttribute('data-native-anchor')) return;
          if (new URL(a.href).pathname !== window.location.pathname) return;
          const target = document.querySelector<HTMLElement>(href);
          if (!target) return;
          e.preventDefault();
          lenis.scrollTo(target, {
            offset: -88,
            duration: 1.15,
            easing: (t) => 1 - Math.pow(1 - t, 3),
          });
          history.replaceState(null, '', href);
        };
        document.addEventListener('click', onAnchorClick);
        cleanups.push(() => document.removeEventListener('click', onAnchorClick));
      };

      void startAnimations();
    }

    // Aurora cursor — desktop only, GPU-friendly
    if (finePointer && !prefersReduced && window.innerWidth > 900) {
      const aurora = document.createElement('div');
      aurora.className = 'aurora-cursor';
      document.body.appendChild(aurora);
      let mouseX = window.innerWidth / 2;
      let mouseY = window.innerHeight / 2;
      let posX = mouseX;
      let posY = mouseY;
      const onMove = (e: MouseEvent) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        aurora.style.opacity = '1';
      };
      const onLeave = () => {
        aurora.style.opacity = '0';
      };
      const tick = () => {
        if (!alive) return;
        posX += (mouseX - posX) * 0.06;
        posY += (mouseY - posY) * 0.06;
        aurora.style.transform = `translate(${posX - 175}px, ${posY - 175}px)`;
        const el = document.elementFromPoint(mouseX, mouseY);
        const blended = el?.closest('.hero, .layanan, .cta-strip, footer');
        aurora.classList.toggle('light-blend', Boolean(blended));
        requestAnimationFrame(tick);
      };
      window.addEventListener('mousemove', onMove, { passive: true });
      document.addEventListener('mouseleave', onLeave);
      cleanups.push(() => {
        window.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseleave', onLeave);
        aurora.remove();
      });
      requestAnimationFrame(tick);
    }

    return () => {
      alive = false;
      cleanups.forEach((fn) => fn());
      ctx?.revert();
      lenis?.destroy();
    };
  }, []);

  return null;
}