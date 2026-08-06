import { flatten } from '@/lib/i18n';
import type { Dict, Lang } from '@/lib/i18n';
import idDict from '@/i18n/id';
import enDict from '@/i18n/en';

export const DICTS: Record<Lang, Dict> = {
  id: flatten(idDict as unknown as Record<string, unknown>),
  en: flatten(enDict as unknown as Record<string, unknown>),
};

/** SSR-side string lookup with graceful fallback to the Indonesian text. */
export function t(lang: Lang, key: string): string {
  return DICTS[lang][key] ?? DICTS.id[key] ?? key;
}

/**
 * Default (Indonesian) text for an i18n key — the SSR initial content that
 * the client-side swap script later translates for `[data-i18n]` elements.
 */
export function idText(key: string): string {
  return DICTS.id[key] ?? key;
}

export const dictionary = DICTS; // used by the client-side language swap script
export const initialLang: Lang = 'id';