export interface FeeRow {
  no: number;
  name: string;
  fee: string;
}

export interface FeeTable {
  id: string;
  title: string;
  rows: FeeRow[];
}

/**
 * Tarif retribusi layanan — sourced verbatim from REFERENCE.md §tarif-view.
 * (v1: authored once in Bahasa Indonesia; EN tables are a later milestone.)
 */
export const TARIF: FeeTable[] = [
  {
    id: 'umum',
    title: 'Pemeriksaan Umum & Tindakan Medik',
    rows: [
      { no: 1, name: 'Pelayanan Rawat Jalan', fee: 'Rp10.000,00' },
      { no: 2, name: 'Kedaruratan Medik', fee: 'Rp20.000,00' },
      { no: 3, name: 'Pelayanan Kunjungan Rumah', fee: 'Rp35.000,00' },
      { no: 4, name: 'Tindakan Medik Kategori I', fee: 'Rp30.000,00' },
      { no: 5, name: 'Tindakan Medik Kategori II', fee: 'Rp50.000,00' },
      { no: 6, name: 'Tindakan Medik Kategori III', fee: 'Rp75.000,00' },
      { no: 7, name: 'Imunisasi Pra Nikah (catin)', fee: 'Rp20.000,00' },
    ],
  },
  {
    id: 'kia-kb',
    title: 'Kesehatan Ibu, Anak (KIA) & Keluarga Berencana (KB)',
    rows: [
      { no: 1, name: 'Persalinan Normal', fee: 'Rp1.000.000,00' },
      { no: 2, name: 'Persalinan dengan Penyulit (Abnormal)', fee: 'Rp1.200.000,00' },
      { no: 3, name: 'Pelayanan Tindakan Paska Persalinan', fee: 'Rp250.000,00' },
      { no: 4, name: 'Pelayanan Pra Rujukan Pada Komplikasi', fee: 'Rp200.000,00' },
      { no: 5, name: 'Penanganan Komplikasi KB Paska Persalinan', fee: 'Rp200.000,00' },
      { no: 6, name: 'Pelayanan KB Suntik', fee: 'Rp20.000,00' },
      { no: 7, name: 'Pelayanan KB Implant', fee: 'Rp75.000,00' },
      { no: 8, name: 'Pelayanan KB IUD', fee: 'Rp75.000,00' },
    ],
  },
  {
    id: 'gigi',
    title: 'Pemeriksaan & Tindakan Gigi',
    rows: [
      { no: 1, name: 'Tindakan Gigi Penambalan Sementara', fee: 'Rp30.000,00' },
      { no: 2, name: 'Tindakan Gigi Penambalan gigi tetap', fee: 'Rp60.000,00' },
      { no: 3, name: 'Tindakan Gigi Pencabutan gigi susu', fee: 'Rp30.000,00' },
      { no: 4, name: 'Tindakan Gigi Pencabutan gigi tetap', fee: 'Rp75.000,00' },
      { no: 5, name: 'Tindakan Gigi Insisi abses', fee: 'Rp30.000,00' },
      { no: 6, name: 'Tindakan Gigi Pencabutan gigi impaksi', fee: 'Rp100.000,00' },
    ],
  },
  {
    id: 'lab',
    title: 'Laboratorium & Penunjang Diagnostik',
    rows: [
      { no: 1, name: 'Pemeriksaan Laboratorium Sederhana', fee: 'Rp17.500,00' },
      { no: 2, name: 'Pemeriksaan Laboratorium Sedang', fee: 'Rp26.500,00' },
      { no: 3, name: 'Pemeriksaan Laboratorium Besar', fee: 'Rp38.500,00' },
      { no: 4, name: 'Pemeriksaan Laboratorium Canggih', fee: 'Rp52.500,00' },
      { no: 5, name: 'Pelayanan USG', fee: 'Rp50.000,00' },
      { no: 6, name: 'EKG', fee: 'Rp25.000,00' },
    ],
  },
  {
    id: 'ambulan',
    title: 'Pelayanan Mobil Ambulan & Jenazah',
    rows: [
      { no: 1, name: 'Pelayanan Mobil Ambulan Jarak < 10 km', fee: 'Rp150.000,00' },
      { no: 2, name: 'Pelayanan Mobil Ambulan Jarak 11 - 35 km', fee: 'Rp275.000,00' },
      { no: 3, name: 'Pelayanan Mobil Ambulan Jarak > 35 km', fee: 'Rp275.000,00' },
      { no: 4, name: 'Pelayanan Mobil Jenazah Jarak < 10 km', fee: 'Rp130.000,00' },
      { no: 5, name: 'Pelayanan Mobil Jenazah Jarak 11 - 35 km', fee: 'Rp250.000,00' },
      { no: 6, name: 'Pelayanan Mobil Jenazah Jarak > 35 km', fee: 'Rp250.000,00' },
    ],
  },
  {
    id: 'visum',
    title: 'Pengujian Kesehatan & Visum',
    rows: [
      { no: 1, name: 'Pengujian Kesehatan Pelajar', fee: 'Rp3.000,00' },
      { no: 2, name: 'Pengujian Kesehatan Masyarakat Umum', fee: 'Rp10.000,00' },
      { no: 3, name: 'Pengujian Kesehatan Calon Pengantin', fee: 'Rp20.000,00' },
      { no: 4, name: 'Pengujian Kesehatan Calon Haji', fee: 'Rp10.000,00' },
      { no: 5, name: 'Visum et Repertum Pemeriksaan Luar', fee: 'Rp15.000,00' },
      { no: 6, name: 'Visum et Repertum Jasa Raharja', fee: 'Rp15.000,00' },
      { no: 7, name: 'Visum et Repertum Asuransi', fee: 'Rp15.000,00' },
      { no: 8, name: 'Visum et Repertum Visum luar jenazah', fee: 'Rp75.000,00' },
    ],
  },
];

export const TARIF_TOTAL_ROWS = TARIF.reduce((n, t) => n + t.rows.length, 0);