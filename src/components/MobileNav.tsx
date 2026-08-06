import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Accordion from '@radix-ui/react-accordion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { dictionary, t } from '@/lib/i18n-dicts';
import { isLang, LANG_STORAGE_KEY } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n';
import { waLink } from '@/lib/site';

function useLang(): Lang {
  const [lang, setLang] = useState<Lang>('id');
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
  return lang;
}

type MenuLink = { href: string; key: string };
type MenuGroup = { key: string; items: MenuLink[] };
type MenuItem = MenuLink | MenuGroup;

const menu: MenuItem[] = [
  { href: '/#beranda', key: 'nav.home' },
  {
    key: 'nav.profile',
    items: [
      { href: '/#profil', key: 'nav.profileDetail' },
      { href: '/#pengaduan', key: 'nav.profileComplaint' },
    ],
  },
  {
    key: 'nav.services',
    items: [
      { href: '/#layanan', key: 'nav.servicesPrograms' },
      { href: '/tarif', key: 'nav.servicesFees' },
      { href: '/standar-layanan', key: 'nav.servicesStandards' },
    ],
  },
  { href: '/survey-kepuasan', key: 'nav.survey' },
  { href: '/#berita', key: 'nav.news' },
  { href: '/#galeri', key: 'nav.gallery' },
  { href: '/#kontak', key: 'nav.help' },
];

function isGroup(item: MenuItem): item is MenuGroup {
  return 'items' in item;
}

const panelLink =
  'block rounded-xl px-4 py-3 text-[0.95rem] font-medium text-teal-900 transition-colors hover:bg-teal-50 active:bg-teal-100';

export default function MobileNav() {
  const lang = useLang();
  const [open, setOpen] = useState(false);
  const dict = dictionary[lang];

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label={t(lang, 'a11y.openMenu')}
          aria-expanded={open}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-teal-900 transition-colors hover:bg-teal-50 lg:hidden"
        >
          <Menu size={22} />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-teal-950/55 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-sm flex-col overflow-y-auto bg-white shadow-lift outline-none"
          aria-describedby={undefined}
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <img src="/img/logo.webp" alt="Logo Puskesmas Tegowanu" width="132" height="52" className="h-9 w-auto" />
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={t(lang, 'a11y.closeMenu')}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-teal-900 hover:bg-teal-50"
              >
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <nav className="flex-1 px-3 py-2" aria-label="Navigasi utama">
            <Accordion.Root type="multiple" className="flex flex-col gap-1">
              {menu.map((item, i) => {
                if (isGroup(item)) {
                  return (
                    <Accordion.Item value={`group-${i}`} key={item.key} className="rounded-xl">
                      <Accordion.Header>
                        <Accordion.Trigger className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-[0.95rem] font-semibold text-ink transition-colors hover:bg-teal-50">
                          <span>{dict[item.key] ?? item.key}</span>
                          <ChevronDown size={18} className="transition-transform duration-200 data-[state=open]:rotate-180" />
                        </Accordion.Trigger>
                      </Accordion.Header>
                      <Accordion.Content className="pb-1 pl-3 data-[state=open]:animate-in data-[state=closed]:animate-out">
                        {item.items.map((link) => (
                          <a key={link.key} href={link.href} className={panelLink} onClick={() => setOpen(false)}>
                            {dict[link.key] ?? link.key}
                          </a>
                        ))}
                      </Accordion.Content>
                    </Accordion.Item>
                  );
                }
                return (
                  <a key={item.key} href={item.href} className={panelLink} onClick={() => setOpen(false)}>
                    {dict[item.key] ?? item.key}
                  </a>
                );
              })}
            </Accordion.Root>
          </nav>

          <div className="border-t border-line p-4">
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-teal-900 px-5 py-3 font-semibold text-white transition-colors hover:bg-teal-800"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"
                />
              </svg>
              {dict['nav.whatsapp'] ?? 'WhatsApp'}
            </a>
            <div className="mt-3 flex items-center justify-center gap-2">
              {(['id', 'en'] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => window.__pktsgSetLang?.(code)}
                  className={`rounded-full px-4 py-2 font-mono text-xs font-bold transition-colors ${
                    dict && lang === code
                      ? 'bg-teal-900 text-white'
                      : 'border border-line text-teal-800 hover:bg-teal-50'
                  }`}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}