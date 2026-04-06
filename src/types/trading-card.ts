/* ──────────────────────────────────────────
   Trading Card Types
   Shared between API layer and UI components
   ────────────────────────────────────────── */

export type GradingCompany = 'PSA' | 'BGS' | 'CGC';

export type GradeTier = 'gem' | 'high' | 'mid' | 'low';

export interface BundleCard {
  name: string;
  image: string;
  imageBack?: string;
  company: GradingCompany;
  grade: number;
  isBlackLabel?: boolean;
  certNumber?: string;
  set?: string;
  number?: string;
  year?: number;
}

export interface TradingCard {
  id: string;
  name: string;
  year: number;
  company: GradingCompany;
  grade: number;
  isBlackLabel?: boolean;
  image?: string;
  imageBack?: string;
  set?: string;
  number?: string;
  certNumber?: string;
  price: number;
  currency: string;
  language?: string;
  notes?: string;          // internal seller notes — NOT shown publicly, NOT used for SEO
  sold?: boolean;
  createdAt?: string;   // ISO 8601 date string, e.g. "2026-04-06T12:00:00.000Z"
  updatedAt?: string;   // ISO 8601 date string, updated on every save
  bundleCards?: BundleCard[];
}
