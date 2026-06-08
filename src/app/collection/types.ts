import {
  cardReportsImage,
  getCardImageUrlFromRaw,
  resolveStoredCardImageUrl,
} from './lib/cardImages';

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'https://localhost:8787';

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type GradingCompany = 'PSA' | 'BGS' | 'CGC' | 'TAG';
export type Currency = 'HKD' | 'USD' | 'JPY' | 'TWD' | 'SGD';
export type Language = 'Japanese' | 'English' | 'Chinese' | 'Korean' | 'Other';

export interface CollectorCard {
  id: string;
  name: string;
  year: number;
  company: GradingCompany;
  grade: number;
  buyPrice: number;
  buyCurrency: Currency;
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
