import type { OCRDocument } from './ocr';

export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

/** 24-hour `HH:mm`, or null when the source is missing/unclear. Never guessed. */
export type PrayerTime = string | null;

export type PrayerDay = {
  /** ISO `YYYY-MM-DD`. */
  date: string;
  fajr: PrayerTime;
  sunrise: PrayerTime;
  dhuhr: PrayerTime;
  asr: PrayerTime;
  maghrib: PrayerTime;
  isha: PrayerTime;
};

export type AIConfidence = {
  overall: number;
};

export type ParsedTimetable = {
  mosque: { name: string | null };
  schedule: { type: 'daily' | 'monthly'; month: number | null; year: number | null };
  language: string | null;
  entries: PrayerDay[];
  confidence: AIConfidence;
  warnings: string[];
};

export interface LocalAIProvider {
  parseTimetable(document: OCRDocument): Promise<ParsedTimetable>;
}
