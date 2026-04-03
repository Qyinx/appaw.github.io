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
}

export interface TradingCard {
  id: string;
  name: string;
  year: number;
  company: GradingCompany;
  grade: number;
  isBlackLabel?: boolean;
  image: string;
  imageBack?: string;
  set?: string;
  number?: string;
  certNumber?: string;
  price: number;
  currency: string;
  language?: string;
  description?: string;
  bundleCards?: BundleCard[];
}
