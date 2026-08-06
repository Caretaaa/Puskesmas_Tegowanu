export interface KlasterItem {
  num: string;
  /** i18n key prefix under `services.*` for title and `services.<key>Desc`. */
  key: string;
}

/** Lima klaster pelayanan sesuai siklus hidup masyarakat. */
export const KLASTER: KlasterItem[] = [
  { num: '01', key: 'klaster01' },
  { num: '02', key: 'klaster02' },
  { num: '03', key: 'klaster03' },
  { num: '04', key: 'klaster04' },
  { num: 'Lintas', key: 'klaster05' },
];

export interface Stat {
  value: string;
  /** i18n key under `stats.*`. */
  key: string;
}

/**
 * Hero stats — mirrors the reference's *heading* strip.
 * Note: reference body says "82 pegawai" while the strip shows 86
 * (PRD flags this discrepancy; kept as-is pending stakeholder confirmation).
 */
export const STATS: Stat[] = [
  { value: '18', key: 'stats.villages' },
  { value: '82', key: 'stats.posyandu' },
  { value: '86', key: 'stats.staff' },
  { value: '60k+', key: 'stats.population' },
];

export interface GalleryImage {
  file: string;
  /** i18n key under `gallery.items[i].title` / `.desc`. */
  index: number;
}

/** Filenames under /img — mapped to the gallery items array in the i18n dict. */
export const GALLERY: GalleryImage[] = [
  { file: 'kegiatan6.webp', index: 0 },
  { file: 'kegiatan2.webp', index: 1 },
  { file: 'kegiatan3.webp', index: 2 },
  { file: 'kegiatan4.webp', index: 3 },
  { file: 'kegiatan5.webp', index: 4 },
  { file: 'kegiatan7.webp', index: 5 },
];