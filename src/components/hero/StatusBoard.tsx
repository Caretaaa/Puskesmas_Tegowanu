import { useEffect, useState } from 'react';
import { dictionary } from '@/lib/i18n-dicts';
import { isLang, LANG_STORAGE_KEY } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n';
import {
  getWibParts,
  getStatus,
  formatClockWib,
  formatDateWib,
  formatWindow,
  SCHEDULE_BY_DAY,
} from '@/lib/schedule';
import type { WibParts } from '@/lib/schedule';
import { waLink } from '@/lib/site';

/**
 * Live service-status signboard. Server-rendered with the same pure
 * schedule logic (SSR props) so hydration never mismatches; the island
 * only ticks the clock and reacts to language changes.
 */
export default function StatusBoard({ initial }: { initial: WibParts }) {
  const [lang, setLang] = useState<Lang>('id');
  const [parts, setParts] = useState<WibParts>(initial);

  useEffect(() => {
    const id = window.setInterval(() => setParts(getWibParts(new Date())), 1000);
    return () => window.clearInterval(id);
  }, []);

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
  const status = getStatus(parts.weekday, parts.hours * 60 + parts.minutes);
  const sched = SCHEDULE_BY_DAY[parts.weekday];
  const open = status === 'open';

  return (
    <div className="relative overflow-hidden rounded-3xl border border-line bg-white/95 p-6 shadow-lift backdrop-blur sm:p-7">
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-mint/25 blur-2xl"></div>

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.22em] text-teal-700">
            {dict['status.title'] ?? 'Papan Status Layanan'}
          </p>
          <p className="mt-1.5 text-sm font-medium text-ink-soft">{formatDateWib(parts, lang)}</p>
        </div>
        <p className="rounded-2xl bg-teal-950 px-4 py-2 font-mono text-xl font-bold tabular-nums tracking-wider text-mint">
          {formatClockWib(parts)}
        </p>
      </div>

      <div
        className={`status-pill mt-5 ${open ? 'status-open' : 'status-closed'}`}
        role="status"
        aria-live="polite"
      >
        <span className="dot"></span>
        <span>{open ? dict['status.open'] : dict['status.closed']}</span>
      </div>

      <dl className="mt-5 space-y-2.5">
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-teal-50/70 px-4 py-3">
          <dt className="flex items-center gap-2 text-sm font-semibold text-teal-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-900 text-xs font-bold text-mint">
              P
            </span>
            {dict['status.poned'] ?? 'PONED'}
          </dt>
          <dd className="font-mono text-sm font-bold text-teal-900">{dict['status.hours24'] ?? '24 JAM'}</dd>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-line px-4 py-3">
          <dt className="text-sm font-medium text-ink-soft">{dict['status.registration']}</dt>
          <dd className="font-mono text-sm font-semibold text-ink">{formatWindow(sched.registration, dict['status.closedLabel'] ?? 'Libur')}</dd>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-line px-4 py-3">
          <dt className="text-sm font-medium text-ink-soft">{dict['status.service']}</dt>
          <dd className="font-mono text-sm font-semibold text-ink">{formatWindow(sched.service, dict['status.closedLabel'] ?? 'Libur')}</dd>
        </div>
      </dl>

      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 transition-colors hover:bg-amber-100"
      >
        <span className="text-sm font-semibold text-amber-700">{dict['status.emergency']}</span>
        <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-700 underline underline-offset-4">
          {dict['status.emergencyCta']}
        </span>
      </a>
    </div>
  );
}