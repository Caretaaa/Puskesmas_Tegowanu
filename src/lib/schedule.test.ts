import { describe, expect, it } from 'vitest';
import {
  formatClockWib,
  formatDateWib,
  formatMinutes,
  formatWindow,
  getStatus,
  getWibParts,
  isRegistrationOpen,
  SCHEDULE_BY_DAY,
  type WibParts,
} from '@/lib/schedule';

const wibParts = (p: Partial<WibParts>): WibParts => ({
  year: 2026,
  month: 8,
  day: 5,
  weekday: 3,
  hours: 0,
  minutes: 0,
  seconds: 0,
  ...p,
});

describe('getWibParts (Asia/Jakarta, UTC+7, no DST)', () => {
  it('converts a UTC instant to the WIB wall clock', () => {
    const parts = getWibParts(new Date('2026-08-05T06:00:00Z'));
    expect(parts.year).toBe(2026);
    expect(parts.month).toBe(8);
    expect(parts.day).toBe(5);
    // 06:00 UTC == 13:00 WIB
    expect(parts.hours).toBe(13);
    expect(parts.minutes).toBe(0);
    // Wednesday
    expect(parts.weekday).toBe(3);
  });

  it('rolls over past midnight in WIB', () => {
    const parts = getWibParts(new Date('2026-08-05T17:30:00Z'));
    // 17:30 UTC == 2026-08-06 00:30 WIB (Thursday)
    expect(parts.day).toBe(6);
    expect(parts.weekday).toBe(4);
    expect(parts.hours).toBe(0);
    expect(parts.minutes).toBe(30);
  });

  it('returns seconds', () => {
    const parts = getWibParts(new Date('2026-08-05T06:00:15Z'));
    expect(parts.seconds).toBe(15);
  });
});

describe('getStatus (registration window semantics)', () => {
  it('is closed on Sunday regardless of time', () => {
    expect(getStatus(0, 7 * 60 + 30)).toBe('closed');
    expect(getStatus(0, 12 * 60)).toBe('closed');
  });

  it('opens at 07:30 and closes at 13:00 on weekdays', () => {
    for (const day of [1, 2, 3, 4]) {
      expect(getStatus(day, 7 * 60 + 29)).toBe('closed');
      expect(getStatus(day, 7 * 60 + 30)).toBe('open'); // inclusive start
      expect(getStatus(day, 12 * 60 + 59)).toBe('open');
      expect(getStatus(day, 13 * 60)).toBe('closed'); // exclusive end
    }
  });

  it('uses the Friday window (07:30–11:00) and Saturday window (07:30–12:00)', () => {
    expect(getStatus(5, 10 * 60 + 59)).toBe('open');
    expect(getStatus(5, 11 * 60)).toBe('closed');
    expect(getStatus(6, 12 * 60 - 1)).toBe('open');
    expect(getStatus(6, 12 * 60)).toBe('closed');
  });

  it('isRegistrationOpen uses the exact WIB parts', () => {
    expect(isRegistrationOpen(getWibParts(new Date('2026-08-05T00:15:00Z')))).toBe(false); // 07:15 Wed
    expect(isRegistrationOpen(getWibParts(new Date('2026-08-05T00:30:00Z')))).toBe(true); // 07:30 Wed
    expect(isRegistrationOpen(getWibParts(new Date('2026-08-05T06:00:00Z')))).toBe(false); // 13:00 Wed
  });
});

describe('schedule table integrity', () => {
  it('registration window fits inside the service window on weekdays', () => {
    for (const day of [1, 2, 3, 4, 5, 6]) {
      const { registration, service } = SCHEDULE_BY_DAY[day];
      if (registration && service) {
        expect(registration.start).toBeLessThanOrEqual(service.start);
        expect(registration.end).toBeLessThanOrEqual(service.end);
      }
    }
  });
});

describe('formatting helpers', () => {
  it('formatMinutes produces dot-separated times', () => {
    expect(formatMinutes(7 * 60 + 30)).toBe('07.30');
    expect(formatMinutes(13 * 60)).toBe('13.00');
  });

  it('formatWindow renders an open window or the closed label', () => {
    expect(formatWindow({ start: 7 * 60 + 30, end: 13 * 60 }, 'Libur')).toBe('07.30 – 13.00 WIB');
    expect(formatWindow(null, 'Libur')).toBe('Libur');
  });

  it('formatClockWib pads to HH:MM:SS', () => {
    expect(formatClockWib(wibParts({ hours: 7, minutes: 5, seconds: 1 }))).toBe('07:05:01');
  });

  it('formatDateWib localizes the WIB date', () => {
    const parts = wibParts({ year: 2026, month: 8, day: 5 });
    expect(formatDateWib(parts, 'id')).toBe('Rabu, 5 Agustus 2026');
    expect(formatDateWib(parts, 'en')).toBe('Wednesday, August 5, 2026');
  });
});