import {
  cardReportsImage,
  getCardImageUrlFromRaw,
  resolveStoredCardImageUrl,
} from './lib/cardImages';
import { normalizePreferredCurrency } from '@/lib/collection/currency';

import { getBackendUrl, joinBackendUrl } from '@/lib/collection/backendUrl';

export const BACKEND_URL = getBackendUrl();
export { joinBackendUrl };

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type GradingCompany = 'PSA' | 'BGS' | 'CGC' | 'TAG';
export type Currency = 'HKD' | 'USD' | 'JPY' | 'TWD' | 'SGD';
export type Language = 'Japanese' | 'English' | 'Chinese' | 'Korean' | 'Other';

/** Converted amounts from API `InPreferredCurrency` / `TotalsInPreferredCurrency`. */
export interface PreferredCurrencyPrices {
  buyPrice?: number;
  listPrice?: number;
}

export interface CollectorCard {
  id: string;
  name: string;
  year: number;
  company: GradingCompany;
  grade: number;
  buyPrice: number;
  buyCurrency: Currency;
  /** Server FX conversion into the user's PreferredCurrency (private endpoints). */
  inPreferredCurrency?: PreferredCurrencyPrices;
  sold: boolean;
  listPrice?: number;
  listCurrency?: Currency;
  set?: string;
  number?: string;
  certNumber?: string;
  language?: Language;
  isBlackLabel?: boolean;
  frontImage?: string;
  backImage?: string;
  createdAt: string;
}

/** List-level FX metadata from GET /cards and GET /portfolios/:id. */
export interface CardListFxMeta {
  preferredCurrency?: Currency;
  totalsInPreferredCurrency?: PreferredCurrencyPrices;
  conversionRatesAsOf?: string;
}

export type CardFormState = Omit<CollectorCard, 'id' | 'createdAt' | 'year' | 'grade' | 'buyPrice' | 'listPrice'> & {
  grade: string;
  buyPrice: string;
  listPrice: string;
  year: string;
};

/* ─── Constants ──────────────────────────────────────────────────────────── */

export const COMPANIES: GradingCompany[] = ['PSA', 'BGS', 'CGC', 'TAG'];
export const CURRENCIES: Currency[] = ['HKD', 'USD', 'JPY', 'TWD', 'SGD'];
export const LANGUAGES: Language[] = ['Japanese', 'English', 'Chinese', 'Korean', 'Other'];
export const CURRENT_YEAR = new Date().getFullYear();

/* ─── Helpers ────────────────────────────────────────────────────────────── */

export function emptyForm(): CardFormState {
  return {
    name: '',
    year: String(CURRENT_YEAR),
    company: 'PSA',
    grade: '10',
    buyPrice: '',
    buyCurrency: 'HKD',
    sold: false,
    listPrice: '',
    listCurrency: 'HKD',
    set: '',
    number: '',
    certNumber: '',
    language: 'Japanese',
    isBlackLabel: false,
    frontImage: undefined,
    backImage: undefined,
  };
}

/* ─── Portfolio ──────────────────────────────────────────────────────────── */

export interface Portfolio {
  id: string;
  name: string;
  isPublic: boolean;
  /** Card IDs — populated lazily when a portfolio is selected (from GET /portfolios/:id). */
  cardIds: string[];
  /** Card count — always available from the list API response. */
  count: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizePortfolio(raw: any): Portfolio {
  const cards: any[] = Array.isArray(raw.cards) ? raw.cards : [];
  return {
    id:       String(raw.Id   ?? raw.id   ?? ''),
    name:     String(raw.Name ?? raw.name ?? ''),
    isPublic: raw.IsPublic === 1 || raw.IsPublic === true || raw.isPublic === true,
    cardIds:  cards.map(c => String(c.Id ?? c.id ?? '')),
    count:    raw.Count ?? raw.count ?? cards.length,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parsePreferredCurrencyPrices(raw: any): PreferredCurrencyPrices | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const buyPrice = raw.BuyPrice ?? raw.buyPrice;
  const listPrice = raw.ListPrice ?? raw.listPrice;
  if (buyPrice == null && listPrice == null) return undefined;
  return {
    ...(buyPrice != null ? { buyPrice } : {}),
    ...(listPrice != null ? { listPrice } : {}),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseInPreferredCurrency(raw: any): PreferredCurrencyPrices | undefined {
  const nested = raw?.InPreferredCurrency ?? raw?.inPreferredCurrency;
  if (nested) return parsePreferredCurrencyPrices(nested);

  // Legacy flat display fields (pre-nested API)
  const buyPrice = raw?.BuyPriceDisplay ?? raw?.buyPriceDisplay;
  const listPrice = raw?.ListPriceDisplay ?? raw?.listPriceDisplay;
  if (buyPrice == null && listPrice == null) return undefined;
  return {
    ...(buyPrice != null ? { buyPrice } : {}),
    ...(listPrice != null ? { listPrice } : {}),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeCard(raw: any): CollectorCard {
  const id = String(raw.Id ?? raw.id ?? '');
  const frontCandidate = getCardImageUrlFromRaw(raw, 0);
  const backCandidate = getCardImageUrlFromRaw(raw, 1);

  return {
    id,
    name:         raw.Name         ?? raw.name         ?? '',
    year:         raw.Year         ?? raw.year         ?? new Date().getFullYear(),
    company:      (raw.Company     ?? raw.company      ?? 'PSA') as GradingCompany,
    grade:        raw.Grade        ?? raw.grade        ?? 0,
    buyPrice:     raw.BuyPrice     ?? raw.buyPrice     ?? 0,
    buyCurrency:  (raw.BuyCurrency ?? raw.buyCurrency  ?? 'HKD') as Currency,
    inPreferredCurrency: parseInPreferredCurrency(raw),
    sold:         raw.Sold === 1   || raw.sold === true,
    listPrice:    raw.ListPrice    ?? raw.listPrice,
    listCurrency: (raw.ListCurrency ?? raw.listCurrency) as Currency | undefined,
    set:          raw.Set          ?? raw.set,
    number:       raw.Number       ?? raw.number,
    certNumber:   raw.CertNumber   ?? raw.certNumber,
    language:     (raw.Language    ?? raw.language) as Language | undefined,
    isBlackLabel: raw.IsBlackLabel === 1 || raw.isBlackLabel === true,
    frontImage:   id
      ? resolveStoredCardImageUrl(frontCandidate, id, 0, cardReportsImage(raw, 0) || !!frontCandidate)
      : frontCandidate,
    backImage:    id
      ? resolveStoredCardImageUrl(backCandidate, id, 1, cardReportsImage(raw, 1) || !!backCandidate)
      : backCandidate,
    createdAt:    raw.CreatedAt    ?? raw.createdAt    ?? new Date().toISOString(),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseCardListFxMeta(raw: any): CardListFxMeta {
  const totalsRaw = raw?.TotalsInPreferredCurrency ?? raw?.totalsInPreferredCurrency;
  const preferredCurrency = raw?.PreferredCurrency ?? raw?.preferredCurrency
    ?? raw?.DisplayCurrency ?? raw?.displayCurrency;

  return {
    preferredCurrency: preferredCurrency != null
      ? normalizePreferredCurrency(preferredCurrency)
      : undefined,
    totalsInPreferredCurrency: totalsRaw
      ? parsePreferredCurrencyPrices(totalsRaw)
      : (raw?.BuyTotalDisplay != null || raw?.buyTotalDisplay != null
          || raw?.ListTotalDisplay != null || raw?.listTotalDisplay != null
        ? {
            buyPrice: raw.BuyTotalDisplay ?? raw.buyTotalDisplay,
            listPrice: raw.ListTotalDisplay ?? raw.listTotalDisplay,
          }
        : undefined),
    conversionRatesAsOf: raw?.ConversionRatesAsOf ?? raw?.conversionRatesAsOf
      ?? raw?.FxAsOf ?? raw?.fxAsOf,
  };
}
