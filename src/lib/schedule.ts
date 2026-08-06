import type { Lang } from '@/lib/i18n';

export type TimeWindow = { start: number; end: number } | null;

export interface DaySchedule {
  registration: TimeWindow;
  service: TimeWindow;
}

const h = (hour: number, minute = 0) => hour * 60 + minute;

/**
 * Prefix registration / service schedule for each weekday (0 = Sunday).
 * Times in WIB (UTC+7).
 */
export const SCHEDULE_BY_DAY: Record<number, DaySchedule> = {
  0: { registration: null, service: null }, // Minggu libur
  1: { registration: { start: h(7, 30), end: h(13) }, service: { start: h(7, 30), end: h(14, 15) } },
  2: { registration: { start: h(7, 30), end: h(13) }, service: { start: h(7, 30), end: h(14, 15) } },
  3: { registration: { start: h(7, 30), end: h(13) }, service: { start: h(7, 30), end: h(14, 15) } },
  4: { registration: { start: h(7, 30), end: h(13) }, service: { start: h(7, 30), end: h(14, 15) } },
  5: { registration: { start: h(7, 30), end: h(11) }, service: { start: h(7, 30), end: h(11, 15) } },
  6: { registration: { start: h(7, 30), end: h(12) }, service: { start: h(7, 30), end: h(12, 45) } },
};

const WIB = 'Asia/Jakarta';

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export interface WibParts {
  year: number;
  month: number;
  day: number;
  weekday: number; // 0-6
  hours: number;
  minutes: number;
  seconds: number;
}

/** Extract the current wall-clock time in WIB for any instant. Pure & deterministic. */
export function getWibParts(date: Date = new Date()): WibParts {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: WIB,
    hour12: false,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(date).map((p) => [p.type, p.value]),
  );
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    weekday: WEEKDAY_INDEX[parts.weekday as string] ?? 0,
    hours: Number(parts.hour) % 24,
    minutes: Number(parts.minute),
    seconds: Number(parts.second),
  };
}

/** Status reflects the *registration* window, matching the reference behaviour. */
export function getStatus(day: number, minutes: number): 'open' | 'closed' {
  const window = SCHEDULE_BY_DAY[day]?.registration;
  if (!window) return 'closed';
  return minutes >= window.start && minutes < window.end ? 'open' : 'closed';
}

export function isRegistrationOpen(parts: WibParts): boolean {
  return getStatus(parts.weekday, parts.hours * 60 + parts.minutes) === 'open';
}

/** "07:30" → "07.30" (reference dot-separated style). */
export function formatMinutes(totalMinutes: number): string {
  const hh = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
  const mm = String(totalMinutes % 60).padStart(2, '0');
  return `${hh}.${mm}`;
}

export function formatWindow(window: TimeWindow, closedLabel: string): string {
  if (!window) return closedLabel;
  return `${formatMinutes(window.start)} – ${formatMinutes(window.end)} WIB`;
}

export function formatClockWib(parts: WibParts): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(parts.hours)}:${p(parts.minutes)}:${p(parts.seconds)}`;
}

/** e.g. "Senin, 5 Agustus 2026" (id) / "Monday, 5 August 2026" (en). */
export function formatDateWib(parts: WibParts, lang: Lang): string {
  const locale = lang === 'id' ? 'id-ID' : 'en-US';
  const utcDate = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(utcDate);
}

export function todaySchedule(parts: WibParts): DaySchedule {
  return SCHEDULE_BY_DAY[parts.weekday];
}