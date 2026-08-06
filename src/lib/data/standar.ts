export interface StandardRow {
  no: number;
  name: string;
  requirements: string;
  time: string;
}

export interface StandardTable {
  id: string;
  num: number;
  title: string;
  rows: StandardRow[];
}

/**
 * Standar Pelayanan Minimal — sourced verbatim from REFERENCE.md
 * §standar-layanan-view. (v1: authored in Bahasa Indonesia.)
 */
export const STANDAR: StandardTable[] = [
  {
    id: 'umum',
    num: 1,
    title: 'Pelayanan Pemeriksaan Umum',
    rows: [
      { no: 1, name: 'Pemeriksaan Rawat Jalan Umum', requirements: 'Nomor Antrean.', time: '10 - 15 Menit / Pasien' },
      { no: 2, name: 'Pembuatan Surat Keterangan Sehat', requirements: 'Membawa KTP/Kartu Pelajar.', time: '15 Menit' },
      {
        no: 3,
        name: 'Imunisasi Pra Nikah (catin)',
        requirements: 'Membawa KTP Laki-laki & Perempuan, surat pengantar dari KUA setempat.',
        time: '15 Menit',
      },
    ],
  },
  {
    id: 'gigi',
    num: 2,
    title: 'Pelayanan Kesehatan Gigi & Mulut',
    rows: [
      { no: 1, name: 'Pemeriksaan & Konsultasi Gigi', requirements: 'Nomor Antrean.', time: '15 Menit' },
      {
        no: 2,
        name: 'Pencabutan / Penambalan Gigi',
        requirements: 'Hasil pemeriksaan dokter, kondisi pasien memungkinkan (tensi normal).',
        time: '30 - 45 Menit',
      },
    ],
  },
  {
    id: 'kia-kb',
    num: 3,
    title: 'Pelayanan KIA (Kesehatan Ibu & Anak) / KB',
    rows: [
      { no: 1, name: 'Pemeriksaan Ibu Hamil (ANC)', requirements: 'Buku KIA (Pink), Kartu Identitas Berobat.', time: '20 - 30 Menit' },
      { no: 2, name: 'Pelayanan Keluarga Berencana (KB)', requirements: 'Kartu Akseptor KB, Rekam Medis.', time: '15 - 20 Menit' },
    ],
  },
  {
    id: 'farmasi',
    num: 4,
    title: 'Pelayanan Farmasi / Apotek',
    rows: [
      { no: 1, name: 'Pelayanan Resep Obat Non Racikan', requirements: 'Sudah diperiksa oleh dokter di poli.', time: 'Maksimal 15 Menit' },
      {
        no: 2,
        name: 'Pelayanan Resep Obat Racikan (Puyer/Salep)',
        requirements: 'Sudah diperiksa oleh dokter di poli.',
        time: 'Maksimal 30 Menit',
      },
    ],
  },
  {
    id: 'lansia',
    num: 5,
    title: 'Pelayanan Poli Lansia',
    rows: [
      { no: 1, name: 'Pemeriksaan Pasien Lansia', requirements: 'Nomor Antrean, KTP / Kartu Identitas Berobat.', time: '10 - 15 Menit' },
      { no: 2, name: 'Konsultasi Kesehatan Lansia', requirements: 'Membawa Buku Rekam Medis (jika ada).', time: '15 Menit' },
    ],
  },
  {
    id: 'mtbs',
    num: 6,
    title: 'Pelayanan Poli MTBS (Manajemen Terpadu Balita Sakit)',
    rows: [
      { no: 1, name: 'Pemeriksaan Balita Sakit', requirements: 'Buku KIA (Pink), Nomor Antrean.', time: '15 - 20 Menit' },
      { no: 2, name: 'Konsultasi Tumbuh Kembang Anak', requirements: 'Buku KIA (Pink).', time: '15 Menit' },
    ],
  },
  {
    id: 'lab',
    num: 7,
    title: 'Pelayanan Laboratorium',
    rows: [
      { no: 1, name: 'Pengambilan Sampel (Darah/Urine)', requirements: 'Surat Pengantar dari Dokter Poli.', time: '5 - 10 Menit' },
      { no: 2, name: 'Pemeriksaan Darah Rutin', requirements: 'Sampel sudah diambil.', time: '30 - 60 Menit' },
      {
        no: 3,
        name: 'Pemeriksaan Gula Darah/Asam Urat/Kolesterol',
        requirements: 'Sampel sudah diambil.',
        time: '10 - 15 Menit',
      },
    ],
  },
  {
    id: 'poned',
    num: 8,
    title: 'Pelayanan Ruang Bersalin (PONED)',
    rows: [
      {
        no: 1,
        name: 'Penanganan Kegawatdaruratan Kebidanan',
        requirements: 'KTP, Buku KIA, Kartu JKN/KIS (jika ada).',
        time: 'Sesuai Kondisi Pasien',
      },
      {
        no: 2,
        name: 'Pertolongan Persalinan Normal',
        requirements: 'KTP, Buku KIA, Kartu JKN/KIS.',
        time: 'Sesuai Kondisi (Kala I - Kala IV)',
      },
    ],
  },
  {
    id: 'gizi',
    num: 9,
    title: 'Pelayanan Konsultasi Gizi & Sanitasi',
    rows: [
      { no: 1, name: 'Konsultasi Gizi Pasien / Balita', requirements: 'Surat Rujukan Internal dari Poli, Buku KIA.', time: '15 - 30 Menit' },
      { no: 2, name: 'Konsultasi Sanitasi Lingkungan', requirements: 'Nomor Antrean / Rujukan Internal.', time: '15 - 20 Menit' },
    ],
  },
];

export const STANDAR_TOTAL_ROWS = STANDAR.reduce((n, t) => n + t.rows.length, 0);