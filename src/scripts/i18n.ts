import { dictionary } from '@/lib/i18n-dicts';
import type { Lang } from '@/lib/i18n';
import { isLang, LANG_STORAGE_KEY } from '@/lib/i18n';

function swapText(root: ParentNode | Document) {
  root.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    const value = dictionary[lang][key] ?? dictionary.id[key];
    if (value == null) return;
    if (el.hasAttribute('data-i18n-html')) el.innerHTML = value;
    else el.textContent = value;
  });
  root.querySelectorAll<HTMLElement>('[data-i18n-alt]').forEach((el) => {
    const key = el.getAttribute('data-i18n-alt');
    if (!key) return;
    const value = dictionary[lang][key] ?? dictionary.id[key];
    if (value != null) el.setAttribute('alt', value);
  });
}

let lang: Lang = 'id';

export function applyLang(next: Lang) {
  lang = next;
  try {
    localStorage.setItem(LANG_STORAGE_KEY, next);
  } catch {
    /* private mode */
  }
  document.documentElement.lang = next === 'en' ? 'en' : 'id';
  document.documentElement.dataset.lang = next;

  const dict = dictionary[next];
  const title = dict['meta.title'];
  if (title) document.title = title;
  const desc = dict['meta.description'] ?? dict['meta.description'];
  const meta = document.querySelector('meta[name="description"]');
  if (desc && meta) meta.setAttribute('content', desc);
  const og = document.querySelector('meta[property="og:title"]');
  if (title && og) og.setAttribute('content', title);
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (desc && ogDesc) ogDesc.setAttribute('content', desc);

  swapText(document);

  document.querySelectorAll<HTMLElement>('[data-lang-toggle]').forEach((btn) => {
    const active = btn.getAttribute('data-lang') === next;
    btn.setAttribute('aria-pressed', String(active));
    btn.classList.toggle('is-active', active);
  });

  document.dispatchEvent(new CustomEvent('pktsg:langchange', { detail: next }));
}

export function setLang(langValue: Lang) {
  applyLang(langValue);
}

declare global {
  interface Window {
    __pktsgSetLang?: (lang: Lang) => void;
  }
}

function currentLang(): Lang {
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (isLang(stored)) return stored;
  } catch {
    /* ignore */
  }
  return 'id';
}

function init() {
  const next = currentLang();
  if (next !== 'id') {
    // hydrate page in the persisted language
    applyLang(next);
  } else {
    // ensure toggle active states are correct on first paint
    document.querySelectorAll<HTMLElement>('[data-lang-toggle]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang') === 'id'));
      btn.classList.toggle('is-active', btn.getAttribute('data-lang') === 'id');
    });
  }

  // wire toggler buttons anywhere in the DOM (topbar / footer / menu)
  const onClick = (e: Event) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-lang-toggle]');
    if (!btn) return;
    const target = btn.getAttribute('data-lang');
    if (isLang(target)) applyLang(target);
  };
  document.addEventListener('click', onClick);
  window.__pktsgSetLang = (l) => applyLang(l);
}

init();