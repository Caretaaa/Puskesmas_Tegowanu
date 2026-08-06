import { useEffect, useState } from 'react';
import { dictionary } from '@/lib/i18n-dicts';
import { isLang, LANG_STORAGE_KEY } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n';
import { SITE } from '@/lib/site';

/**
 * Lightweight client-side admin gate for the survey results sheet.
 * NOTE: password-gated access is cosmetic (matches the current site) and is
 * NOT a security boundary — documented in the PRD as a known limitation.
 */
const STAFF_PASSWORD = 'admin123';

export default function SurveyGate() {
  const [lang, setLang] = useState<Lang>('id');
  const [granted, setGranted] = useState(false);

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
  const t = (k: string) => dict[k] ?? k;

  const requestAccess = () => {
    const pass = window.prompt(t('pages.surveyPrompt'));
    if (pass === null) return;
    if (pass === STAFF_PASSWORD) {
      setGranted(true);
    } else {
      window.alert(t('pages.surveyWrong'));
    }
  };

  return (
    <div className="mx-auto mt-14 max-w-2xl border-t border-dashed border-line pt-10 text-center">
      <button
        type="button"
        onClick={requestAccess}
        className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-xs font-semibold text-ink-soft transition-colors hover:border-teal-700 hover:text-teal-900"
      >
        {t('pages.surveyAdmin')}
      </button>

      {granted && (
        <div className="mt-6 rounded-3xl bg-teal-50 p-8 shadow-card">
          <h3 className="font-display text-xl font-semibold text-teal-950">{t('pages.surveyAdminTitle')}</h3>
          <a
            href={SITE.surveyResults}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-teal-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-teal-800"
          >
            {t('pages.surveyAdminCta')}
          </a>
          <p className="mt-4 text-xs text-ink-soft">{t('pages.surveyAdminNote')}</p>
        </div>
      )}
    </div>
  );
}