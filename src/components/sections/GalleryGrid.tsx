import { useEffect, useRef, useState } from 'react';
import { dictionary } from '@/lib/i18n-dicts';
import { isLang, LANG_STORAGE_KEY } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n';
import { GALLERY } from '@/lib/data/site-content';

/**
 * Gallery grid + lightbox. Uses the native <dialog> element so the island
 * stays dependency-free and the lightbox is keyboard/Escape-accessible.
 */
export default function GalleryGrid() {
  const [lang, setLang] = useState<Lang>('id');
  const [active, setActive] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LANG_STORAGE_KEY);
      if (isLang(stored)) setLang(stored);
    } catch {
      /* ignore */
    }
    const onChange = (e: Event) => {
      const next = (e as CustomEvent).detail as Lang;
      if (isLang(next)) setLang(next);
    };
    document.addEventListener('pktsg:langchange', onChange);
    return () => document.removeEventListener('pktsg:langchange', onChange);
  }, []);

  const dict = dictionary[lang];
  const titleFor = (i: number) => dict[`gallery.items.${i}.title`] ?? `Kegiatan ${i + 1}`;
  const descFor = (i: number) => dict[`gallery.items.${i}.desc`] ?? '';

  const open = (i: number) => {
    setActive(i);
    dialogRef.current?.showModal();
  };
  const close = () => {
    setActive(null);
    dialogRef.current?.close();
  };
  const onBackdrop = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) close();
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {GALLERY.map((g, i) => (
          <button
            key={g.file}
            type="button"
            onClick={() => open(i)}
            className="group relative block overflow-hidden rounded-2xl focus-visible:outline-offset-4"
            aria-label={`${dict['gallery.open'] ?? 'Perbesar gambar'}: ${titleFor(i)}`}
          >
            <img
              src={`/img/${g.file}`}
              alt={titleFor(i)}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-teal-950/85 via-teal-950/10 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90">
              <div className="absolute inset-x-0 bottom-0 p-3 text-left sm:p-4">
                <h4 className="text-[0.85rem] font-semibold leading-snug text-white sm:text-sm">{titleFor(i)}</h4>
                <p className="mt-0.5 hidden text-xs leading-snug text-teal-100/80 sm:block">{descFor(i)}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        onClick={onBackdrop}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClose={close}
        className="m-auto max-w-[92vw] rounded-3xl border border-line bg-white p-3 shadow-lift backdrop:bg-teal-950/70 backdrop:backdrop-blur-sm md:max-w-3xl"
      >
        {active !== null && (
          <div className="relative">
            <img
              src={`/img/${GALLERY[active].file}`}
              alt={titleFor(active)}
              className="max-h-[70vh] w-full rounded-2xl object-contain"
            />
            <button
              type="button"
              onClick={close}
              aria-label={dict['gallery.close'] ?? 'Tutup'}
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-teal-950/80 text-white transition-colors hover:bg-teal-900"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
            <div className="p-3 text-center">
              <h4 className="font-display text-lg font-semibold text-teal-950">{titleFor(active)}</h4>
              <p className="mt-1 text-sm text-ink-soft">{descFor(active)}</p>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}