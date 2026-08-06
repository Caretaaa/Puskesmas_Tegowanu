import { useEffect, useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { dictionary } from '@/lib/i18n-dicts';
import { isLang, LANG_STORAGE_KEY } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n';
import { waLink } from '@/lib/site';

type TabId = 'profil' | 'pengaduan';

function hashToTab(hash: string): TabId {
  return hash === '#pengaduan' ? 'pengaduan' : 'profil';
}

export default function AboutTabs() {
  const [lang, setLang] = useState<Lang>('id');
  const [tab, setTab] = useState<TabId>(() => {
    if (typeof window === 'undefined') return 'profil';
    return hashToTab(window.location.hash);
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LANG_STORAGE_KEY);
      if (isLang(stored)) setLang(stored);
    } catch {
      /* ignore */
    }
    const onLang = (e: Event) => {
      const next = (e as CustomEvent).detail as Lang;
      if (isLang(next)) setLang(next);
    };
    const onHash = () => setTab(hashToTab(window.location.hash));
    document.addEventListener('pktsg:langchange', onLang);
    window.addEventListener('hashchange', onHash);
    return () => {
      document.removeEventListener('pktsg:langchange', onLang);
      window.removeEventListener('hashchange', onHash);
    };
  }, []);

  const dict = dictionary[lang];
  const t = (k: string) => dict[k] ?? k;

  return (
      <Tabs.Root
        value={tab}
        onValueChange={(v) => {
          setTab(v as TabId);
          window.dispatchEvent(new Event('pktsg:refresh-animations'));
        }}
        className="mt-10"
      >
      <Tabs.List className="inline-flex flex-wrap gap-2 rounded-full border border-line bg-white p-1.5 shadow-card" aria-label="Tab informasi puskesmas">
        <Tabs.Trigger
          value="profil"
          className="rounded-full px-5 py-2.5 text-sm font-semibold text-ink-soft transition-colors data-[state=active]:bg-teal-900 data-[state=active]:text-white"
        >
          {t('about.tabProfile')}
        </Tabs.Trigger>
        <Tabs.Trigger
          value="pengaduan"
          className="rounded-full px-5 py-2.5 text-sm font-semibold text-ink-soft transition-colors data-[state=active]:bg-amber-500 data-[state=active]:text-teal-950"
        >
          {t('about.tabComplaint')}
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="profil" className="mt-8 outline-none">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative" data-parallax data-parallax-speed="0.22">
            <div aria-hidden className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-br from-mint/40 to-teal-100"></div>
            <img
              src="/img/profil.webp"
              alt={t('about.imageAlt')}
              width="600"
              height="450"
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full scale-[1.28] rounded-[1.6rem] border border-line object-cover shadow-card"
            />
          </div>
          <div>
            <p className="leading-relaxed text-ink-soft">{t('about.p1')}</p>
            <p className="mt-4 leading-relaxed text-ink-soft">{t('about.p2')}</p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border-l-4 border-mint bg-white p-5 shadow-card">
                <h4 className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-teal-700">{t('about.vision')}</h4>
                <p className="mt-2 font-display text-[1.02rem] leading-snug text-teal-950">{t('about.visionText')}</p>
              </div>
              <div className="rounded-2xl border-l-4 border-amber-400 bg-white p-5 shadow-card">
                <h4 className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-amber-600">{t('about.mission')}</h4>
                <p className="mt-2 font-display text-[1.02rem] leading-snug text-teal-950">{t('about.missionText')}</p>
              </div>
            </div>
          </div>
        </div>
      </Tabs.Content>

      <Tabs.Content value="pengaduan" className="mt-8 outline-none">
        <div className="rounded-3xl border border-line bg-white p-8 text-center shadow-card sm:p-12">
          <h3 className="font-display text-2xl font-semibold text-teal-950">{t('about.complaintTitle')}</h3>
          <p className="mx-auto mt-3 max-w-xl leading-relaxed text-ink-soft">{t('about.complaintDesc')}</p>
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-teal-900 px-7 py-3.5 font-semibold text-white shadow-card transition-colors hover:bg-teal-800"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                fill="currentColor"
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"
              />
            </svg>
            {t('about.complaintCta')}
          </a>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
}