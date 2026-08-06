import type { Lang } from '@/lib/i18n';

export const SITE = {
  name: 'UPTD Puskesmas Tegowanu',
  shortName: 'Puskesmas Tegowanu',
  tagline: 'Melayani Dengan Sepenuh Hati',
  url: 'https://puskesmas-tegowanu.dinkes-grobogan.id',
  description:
    'Fasilitas Pelayanan Kesehatan Tingkat Pertama di Jln. Gatot Subroto No. 128, Kecamatan Tegowanu, Kabupaten Grobogan. Melayani dengan sepenuh hati.',
  locale: 'id_ID',
  address: {
    street: 'Jln. Gatot Subroto No. 128',
    village: 'Desa Tegowanu Kulon',
    district: 'Kecamatan Tegowanu',
    regency: 'Kabupaten Grobogan',
    postalCode: '58165',
  },
  phone: '(0292) 5135150',
  phoneMobile: '0812-1593-5791',
  phoneWa: '+62 812-1593-5791',
  whatsappNumber: '6281215935791',
  email: 'Puskesmastegowanu@gmail.com',
  mapEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.652300883213!2d110.60023267517163!3d-7.050080669084509!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e70915844367e51%3A0x26e2d47e0f1d6c9e!2sPuskesmas%20Tegowanu!5e0!3m2!1sid!2sid!4v1785305603633!5m2!1sid!2sid',
  social: {
    instagram: 'https://www.instagram.com/puskesmastegowanu',
    facebook: 'https://web.facebook.com/pages/Puskesmas%20Tegowanu',
    tiktok: 'https://www.tiktok.com/@puskesmas.tegowanu',
  },
  surveyFormEmbed: 'https://forms.gle/AZpvenWufsmvqUqo9',
  surveyResults:
    'https://docs.google.com/spreadsheets/d/1GSPti5cwvUyJcyeW636KeFh9JdKrrZnA8-E4msE5Jb4/edit?usp=sharing',
} as const;

export type SiteConfig = typeof SITE;

export function waLink(message?: string) {
  const base = `https://wa.me/${SITE.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function waMessage(lang: Lang): string {
  return lang === 'id'
    ? 'Halo, saya ingin bertanya tentang layanan di UPTD Puskesmas Tegowanu.'
    : 'Hello, I have a question about the services at UPTD Puskesmas Tegowanu.';
}