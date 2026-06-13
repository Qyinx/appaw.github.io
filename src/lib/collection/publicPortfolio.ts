import { notFound } from 'next/navigation';
import {
  normalizeCard,
  parseCardListFxMeta,
  type CollectorCard,
  type Currency,
  type GradingCompany,
  type Language,
  type PreferredCurrencyPrices,
} from '@/app/collection/types';
import { getCardImagesArray, imageEntryToUrl, resolveAbsoluteBackendUrl } from '@/app/collection/lib/cardImages';

const BACKEND_URL =
  process.env.BACKEND_URL ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  'https://localhost:8787';

export { BACKEND_URL as PUBLIC_PORTFOLIO_BACKEND_URL };

export interface PublicCard {
  id: string;
  name: string;
  year: number;
  company: GradingCompany;
  grade: number;
  sold: boolean;
  listPrice?: number;
  listCurrency?: Currency;
  inPreferredCurrency?: PreferredCurrencyPrices;
  set?: string;
  number?: string;
  certNumber?: string;
  language?: Language;
  isBlackLabel?: boolean;
  frontImage?: string;
  backImage?: string;
  images: string[];
}

export interface PublicPortfolio {
  id: string;
  name: string;
  ownerDisplayName?: string;
  preferredCurrency?: Currency;
  totalsInPreferredCurrency?: PreferredCurrencyPrices;
  conversionRatesAsOf?: string;
  cards: PublicCard[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizePublicCard(raw: any): PublicCard {
  const base = normalizeCard(raw);
  const rawImages = getCardImagesArray(raw)
    .map(imageEntryToUrl)
    .filter((url): url is string => !!url);
  const fallback = [base.frontImage, base.backImage].filter(Boolean) as string[];
  const images = (rawImages.length > 0 ? rawImages : fallback).map(resolveAbsoluteBackendUrl);
  const { buyPrice: _buy, buyCurrency: _cur, inPreferredCurrency: _ipc, createdAt: _at, ...rest } = base;

  return {
    ...rest,
    inPreferredCurrency: base.inPreferredCurrency,
    frontImage: images[0],
    backImage: images[1],
    images,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizePublicPortfolio(raw: any, id: string): PublicPortfolio {
  const cardsRaw: any[] = Array.isArray(raw.cards) ? raw.cards : [];
  const fxMeta = parseCardListFxMeta(raw);
  return {
    id: String(raw.Id ?? raw.id ?? id),
    name: String(raw.Name ?? raw.name ?? ''),
    ownerDisplayName: raw.DisplayName ?? raw.displayName ?? raw.OwnerDisplayName ?? raw.ownerDisplayName ?? undefined,
    preferredCurrency: fxMeta.preferredCurrency,
    totalsInPreferredCurrency: fxMeta.totalsInPreferredCurrency,
    conversionRatesAsOf: fxMeta.conversionRatesAsOf,
    cards: cardsRaw.map(normalizePublicCard),
  };
}

/** IDs of public portfolios — used by `generateStaticParams` for static export. */
export async function fetchPublicPortfolioIdsForBuild(): Promise<string[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/portfolios/public/ids`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const raw = await res.json();
    const payload = raw.data ?? raw;
    const ids: unknown[] = Array.isArray(payload.ids) ? payload.ids : [];
    return ids.map(String).filter(Boolean);
  } catch {
    return [];
  }
}

/** Client-safe fetch for static-export pages (handles 404/403 as null). */
export async function fetchPublicPortfolioForClient(id: string): Promise<PublicPortfolio | null> {
  if (!id) return null;
  try {
    const res = await fetch(
      `${BACKEND_URL.replace(/\/$/, '')}/portfolios/public/${encodeURIComponent(id)}`,
      { cache: 'no-store' },
    );
    if (res.status === 404 || res.status === 403) return null;
    if (!res.ok) return null;
    const raw = await res.json();
    const payload = raw.data ?? raw;
    return normalizePublicPortfolio(payload, id);
  } catch {
    return null;
  }
}

export async function fetchPublicPortfolioRaw(id: string): Promise<PublicPortfolio | null> {
  const res = await fetch(`${BACKEND_URL}/portfolios/public/${encodeURIComponent(id)}`, {
    next: { revalidate: 60 },
  });

  if (res.status === 404 || res.status === 403) return null;
  if (!res.ok) {
    throw new Error(`Failed to fetch public portfolio (${res.status})`);
  }

  const raw = await res.json();
  const payload = raw.data ?? raw;
  return normalizePublicPortfolio(payload, id);
}

export async function fetchPublicPortfolio(id: string): Promise<PublicPortfolio> {
  const portfolio = await fetchPublicPortfolioRaw(id);
  if (!portfolio) notFound();
  return portfolio;
}

/** Strip buy-price fields from a normalized card for public display. */
export function toPublicCard(card: CollectorCard): PublicCard {
  const images = [card.frontImage, card.backImage].filter(Boolean) as string[];
  const { buyPrice: _b, buyCurrency: _c, inPreferredCurrency, createdAt: _a, ...rest } = card;
  return {
    ...rest,
    inPreferredCurrency: inPreferredCurrency?.listPrice != null
      ? { listPrice: inPreferredCurrency.listPrice }
      : undefined,
    images,
  };
}
