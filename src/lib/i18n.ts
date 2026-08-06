export type Lang = 'id' | 'en';

export const LANGS: Lang[] = ['id', 'en'];

export type Dict = Record<string, string>;

/** Flatten a nested object of strings into `path.to.key` => string. */
export function flatten(input: Record<string, unknown>, prefix = ''): Dict {
  const out: Dict = {};
  for (const [key, value] of Object.entries(input)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') out[path] = value;
    else if (value && typeof value === 'object') Object.assign(out, flatten(value as Record<string, unknown>, path));
  }
  return out;
}

export const LANGS_META: Record<Lang, { label: string; short: string; htmlLang: string }> = {
  id: { label: 'Bahasa Indonesia', short: 'ID', htmlLang: 'id' },
  en: { label: 'English', short: 'EN', htmlLang: 'en' },
};

export function isLang(value: unknown): value is Lang {
  return value === 'id' || value === 'en';
}

export const LANG_STORAGE_KEY = 'pktsg:lang';