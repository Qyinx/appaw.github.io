import type { GradingServicePlan } from './reference-code';
import { GRADING_SERVICE_PLAN_LABELS } from './reference-code';

export type PsaFeeTier = {
  minCards: number;
  /** null = no upper bound */
  maxCards: number | null;
  feeHkd: number;
};

export type PsaPricingRow = {
  plan: GradingServicePlan;
  /** List / standard Appaw service fee (HKD). For tiered plans, 1–4 / intake default. */
  feeHkd: number | null;
  /** Optional promotional fee — when set and lower than feeHkd, table shows discount + struck list price. */
  discountedFeeHkd: number | null;
  /** Optional per-card-count fee tiers (e.g. Standard 1–4 vs 5+). */
  feeTiers?: PsaFeeTier[];
  maxDeclaredValueUsd: number;
  turnaroundDays: string;
};

/** Plans with published hub fees. Value / Premium tiers TBD. */
const PRICED_PLANS: GradingServicePlan[] = ['STD', 'REG', 'EXP', 'SPX', 'WALK', 'RHLD'];

const FEE_BY_PLAN: Record<GradingServicePlan, Omit<PsaPricingRow, 'plan'>> = {
  VBLK: { feeHkd: null, discountedFeeHkd: null, maxDeclaredValueUsd: 0, turnaroundDays: '—' },
  VPLS: { feeHkd: null, discountedFeeHkd: null, maxDeclaredValueUsd: 0, turnaroundDays: '—' },
  VMAX: { feeHkd: null, discountedFeeHkd: null, maxDeclaredValueUsd: 0, turnaroundDays: '—' },
  STD: {
    feeHkd: 560,
    discountedFeeHkd: null,
    feeTiers: [
      { minCards: 1, maxCards: 4, feeHkd: 560 },
      { minCards: 5, maxCards: null, feeHkd: 550 },
    ],
    maxDeclaredValueUsd: 1000,
    turnaroundDays: '~90-100',
  },
  REG: { feeHkd: 790, discountedFeeHkd: 790, maxDeclaredValueUsd: 1500, turnaroundDays: '~70-80' },
  EXP: { feeHkd: 1550, discountedFeeHkd: 1550, maxDeclaredValueUsd: 2500, turnaroundDays: '~20-30' },
  SPX: { feeHkd: 3200, discountedFeeHkd: 3200, maxDeclaredValueUsd: 5000, turnaroundDays: '~7-10' },
  WALK: { feeHkd: 5200, discountedFeeHkd: 5200, maxDeclaredValueUsd: 10000, turnaroundDays: '~7' },
  RHLD: { feeHkd: 550, discountedFeeHkd: 550, maxDeclaredValueUsd: 5000, turnaroundDays: '~65-75' },
  PRE1: { feeHkd: null, discountedFeeHkd: null, maxDeclaredValueUsd: 0, turnaroundDays: '—' },
  PRE2: { feeHkd: null, discountedFeeHkd: null, maxDeclaredValueUsd: 0, turnaroundDays: '—' },
  PRE3: { feeHkd: null, discountedFeeHkd: null, maxDeclaredValueUsd: 0, turnaroundDays: '—' },
};

/** PSA tier data — Appaw HKD service fees (published rows only). */
export const PSA_PRICING_ROWS: PsaPricingRow[] = PRICED_PLANS.map((plan) => ({
  plan,
  ...FEE_BY_PLAN[plan],
}));

function lowestTierFee(tiers: PsaFeeTier[]): number {
  return Math.min(...tiers.map((t) => t.feeHkd));
}

function formatTierFeeRange(tiers: PsaFeeTier[]): string {
  const fees = tiers.map((t) => t.feeHkd);
  const min = Math.min(...fees);
  const max = Math.max(...fees);
  return min === max ? String(min) : `${min}–${max}`;
}

/** Fee for a plan at a given card count (per card). Falls back to feeHkd. */
export function getPsaFeeForCardCount(plan: GradingServicePlan, cardCount: number): number | null {
  const row = FEE_BY_PLAN[plan];
  if (!row) return null;
  if (row.feeTiers && row.feeTiers.length > 0) {
    const tier = row.feeTiers.find(
      (t) => cardCount >= t.minCards && (t.maxCards == null || cardCount <= t.maxCards),
    );
    if (tier) return tier.feeHkd;
  }
  if (row.feeHkd == null) return null;
  if (
    row.discountedFeeHkd != null &&
    row.discountedFeeHkd > 0 &&
    row.discountedFeeHkd < row.feeHkd
  ) {
    return row.discountedFeeHkd;
  }
  return row.feeHkd;
}

/** Effective fee shown in pricing table and SEO — lowest tier or promo when set. */
export function getPsaDisplayFee(row: PsaPricingRow): number {
  if (row.feeTiers && row.feeTiers.length > 0) {
    return lowestTierFee(row.feeTiers);
  }
  if (row.feeHkd == null) return 0;
  if (
    row.discountedFeeHkd != null &&
    row.discountedFeeHkd > 0 &&
    row.discountedFeeHkd < row.feeHkd
  ) {
    return row.discountedFeeHkd;
  }
  return row.feeHkd;
}

/** Default card totalCost for admin drafts — intake default (1–4 / list), else promo. */
export function getPsaDefaultTotalCost(plan: GradingServicePlan): number | null {
  const row = FEE_BY_PLAN[plan];
  if (!row) return null;
  if (row.feeTiers && row.feeTiers.length > 0) {
    return row.feeHkd != null && row.feeHkd > 0 ? row.feeHkd : null;
  }
  if (row.discountedFeeHkd != null && row.discountedFeeHkd > 0) {
    return row.discountedFeeHkd;
  }
  return row.feeHkd != null && row.feeHkd > 0 ? row.feeHkd : null;
}

export function getPsaLowestDisplayFee(): number {
  return Math.min(
    ...PSA_PRICING_ROWS.filter((row) => row.feeHkd != null).map((row) => getPsaDisplayFee(row)),
  );
}

export function formatPsaTierPriceLine(locale: 'en' | 'zh'): string {
  const prefix = locale === 'zh' ? 'PSA 服務費：' : 'PSA service fees: ';
  const parts = PSA_PRICING_ROWS.filter((row) => row.feeHkd != null).map((row) => {
    const feeLabel =
      row.feeTiers && row.feeTiers.length > 0
        ? formatTierFeeRange(row.feeTiers)
        : String(getPsaDisplayFee(row));
    return `${GRADING_SERVICE_PLAN_LABELS[row.plan]} HKD ${feeLabel}`;
  });
  return prefix + parts.join(' · ');
}
