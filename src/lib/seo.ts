import { SITE } from '@/lib/site';
import { SCHEDULE_BY_DAY } from '@/lib/schedule';

const DAY_OF_WEEK: Record<number, string> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

const fmt = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}:00`;

/** JSON-LD for the organisation (MedicalClinic + opening hours). */
export function organizationJsonLd(): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': ['MedicalClinic', 'GovernmentOrganization'],
    name: SITE.name,
    alternateName: SITE.shortName,
    description: SITE.description,
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    image: `${SITE.url}/img/sampul.webp`,
    foundingDate: '0',
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${SITE.address.street}, ${SITE.address.village}`,
      addressLocality: SITE.address.district,
      addressRegion: SITE.address.regency,
      postalCode: SITE.address.postalCode,
      addressCountry: 'ID',
    },
    openingHoursSpecification: Object.entries(SCHEDULE_BY_DAY)
      .filter(([, s]) => s.service)
      .map(([day, s]) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: DAY_OF_WEEK[Number(day)],
        opens: fmt(s.service!.start),
        closes: fmt(s.service!.end),
      })),
    sameAs: [SITE.social.instagram, SITE.social.facebook, SITE.social.tiktok],
  };
  return JSON.stringify(data);
}

/** Breadcrumb JSON-LD for sub-pages. */
export function breadcrumbJsonLd(path: string, name: string): string {
  const home = SITE.url;
  const current = new URL(path, SITE.url).href;
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: home },
      { '@type': 'ListItem', position: 2, name, item: current },
    ],
  });
}

/** Article JSON-LD for news posts. */
export function articleJsonLd(args: {
  title: string;
  excerpt: string;
  image: string;
  datePublished: string;
  url: string;
}): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: args.title,
    description: args.excerpt,
    image: [new URL(args.image, SITE.url).href],
    datePublished: args.datePublished,
    dateModified: args.datePublished,
    url: args.url,
    author: { '@type': 'Organization', name: SITE.name },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      logo: { '@type': 'ImageObject', url: `${SITE.url}/img/logo.webp` },
    },
    inLanguage: 'id',
  });
}