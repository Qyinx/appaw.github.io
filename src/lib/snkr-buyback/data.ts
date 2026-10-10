import type { GuideLocale } from '@/lib/guides/types';
import { displayCardName } from './card-id';
import announcementsJson from './announcements.json';
import pricesJson from './prices.json';
import type { SnkrBuybackAnnouncement, SnkrBuybackPrice } from './types';

export const SNKR_BUYBACK_PRICES = pricesJson as SnkrBuybackPrice[];
export const SNKR_BUYBACK_ANNOUNCEMENTS = announcementsJson as SnkrBuybackAnnouncement[];

export function snkrBuybackDates(rows: { date: string }[]): string[] {
  return [...new Set(rows.map((row) => row.date))].sort();
}

export function snkrCardName(row: SnkrBuybackPrice, locale: GuideLocale): string {
  const japanese = displayCardName(row.card_name);
  const english = displayCardName(row.card_name_en);
  if (locale === 'en') return english || japanese;
  return japanese || english;
}

export function snkrGradeLabel(grade: string): string {
  const trimmed = grade.trim();
  return trimmed || '—';
}

export function snkrPriceSourceLabel(source: string, locale: GuideLocale): string {
  const key = source.trim().toLowerCase();
  if (key === 'text') return locale === 'zh' ? '文字價' : 'Text';
  if (key === 'image') return locale === 'zh' ? '圖價' : 'Image';
  return source.trim();
}

export function formatBuybackPrice(amount: number, currency: string): string {
  const formatted = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(amount);
  if (currency === 'JPY') return `¥${formatted}`;
  if (currency === 'USD') return `$${formatted}`;
  if (currency === 'HKD') return `HK$${formatted}`;
  return currency ? `${formatted} ${currency}` : formatted;
}
