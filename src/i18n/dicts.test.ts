import { describe, expect, it } from 'vitest';
import { LANGS } from '@/lib/i18n';
import { DICTS, idText, t } from '@/lib/i18n-dicts';

describe('dictionary parity', () => {
  it('flattens to the same set of keys in both languages', () => {
    const keysId = Object.keys(DICTS.id);
    const keysEn = Object.keys(DICTS.en);
    expect(keysId.sort()).toEqual(keysEn.sort());
  });

  it('exposes a default (Indonesian) text for every key', () => {
    for (const key of Object.keys(DICTS.id)) {
      expect(idText(key)).not.toBe(key);
      expect(DICTS.id[key]).toBeTruthy();
    }
  });

  it('never returns a raw key for a known key', () => {
    for (const lang of LANGS) {
      for (const key of Object.keys(DICTS[lang])) {
        expect(t(lang, key)).not.toBe(key);
      }
    }
  });

  it('keeps key payload-type parity for gallery items', () => {
    expect(DICTS.id['gallery.items.0.title']).toBeTypeOf('string');
    expect(DICTS.en['gallery.items.0.title']).toBeTypeOf('string');
  });

  it('translates core chrome in both languages', () => {
    for (const lang of LANGS) {
      expect(t(lang, 'nav.home')).toBeTruthy();
      expect(t(lang, 'hero.title')).toBeTruthy();
      expect(t(lang, 'footer.legal')).toBeTruthy();
    }
    expect(t('id', 'nav.home')).toBe('Beranda');
    expect(t('en', 'nav.home')).toBe('Home');
  });

  it('falls back to Indonesian for missing keys in English', () => {
    expect(t('en', 'meta.title')).toBeTruthy();
  });
});