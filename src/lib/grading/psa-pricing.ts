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
  /** Show fee as “from {price}” (e.g. Reholder depends on path). */
  feeStartsFrom?: boolean;
  maxDeclaredValueUsd: number;
  turnaroundDays: string;
};

/** Plans with published hub fees. Value / Premium tiers TBD. */
const PRICED_PLANS: GradingServicePlan[] = ['STD', 'REG', 'EXP', 'SPX', 'WALK', 'RHLD'];

/** First calendar day (HKT) of the post–3 Oct 2026 fee schedule. */
export const PSA_PRICING_CUTOVER_HKT = '2026-10-04';

export type PsaPricingSchedule = 'through-2026-10-03' | 'from-2026-10-04';

type FeeMap = Record<GradingServicePlan, Omit<PsaPricingRow, 'plan'>>;

const NULL_FEE: Omit<PsaPricingRow, 'plan'> = {
  feeHkd: null,
  discountedFeeHkd: null,
  maxDeclaredValueUsd: 0,
  turnaroundDays: '—',
};

/** Prices through 3 Oct 2026 (inclusive, HKT). */
const FEE_THROUGH_2026_10_03: FeeMap = {
  VBLK: NULL_FEE,
  VPLS: NULL_FEE,
  VMAX: NULL_FEE,
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
  REG: {
    feeHkd: 790,
    discountedFeeHkd: null,
    maxDeclaredValueUsd: 1500,
    turnaroundDays: '~70-80',
  },
  EXP: {
    feeHkd: 1550,
    discountedFeeHkd: null,
    maxDeclaredValueUsd: 2500,
    turnaroundDays: '~20-30',
  },
  SPX: {
    feeHkd: 3200,
    discountedFeeHkd: null,
    maxDeclaredValueUsd: 5000,
    turnaroundDays: '~7-10',
  },
  WALK: {
    feeHkd: 5200,
    discountedFeeHkd: null,
    maxDeclaredValueUsd: 10000,
    turnaroundDays: '~7',
  },
  RHLD: {
    feeHkd: 550,
    discountedFeeHkd: null,
    feeStartsFrom: true,
    maxDeclaredValueUsd: 5000,
    turnaroundDays: '~65-75',
  },
  PRE1: NULL_FEE,
  PRE2: NULL_FEE,
  PRE3: NULL_FEE,
};

/** Prices from 4 Oct 2026 (HKT). */
const FEE_FROM_2026_10_04: FeeMap = {
  VBLK: NULL_FEE,
  VPLS: NULL_FEE,
  VMAX: NULL_FEE,
  STD: {
    feeHkd: 580,
    discountedFeeHkd: null,
    feeTiers: [
      { minCards: 1, maxCards: 4, feeHkd: 580 },
      { minCards: 5, maxCards: null, feeHkd: 570 },
    ],
    maxDeclaredValueUsd: 1000,
    turnaroundDays: '~90-100',
  },
  REG: {
    feeHkd: 790,
    discountedFeeHkd: null,
    maxDeclaredValueUsd: 1500,
    turnaroundDays: '~70-80',
  },
  EXP: {
    feeHkd: 1850,
    discountedFeeHkd: null,
    maxDeclaredValueUsd: 2500,
    turnaroundDays: '~20-30',
  },
  SPX: {
    feeHkd: 3200,
    discountedFeeHkd: null,
    maxDeclaredValueUsd: 5000,
    turnaroundDays: '~7-10',
  },
  WALK: {
    feeHkd: 5300,
    discountedFeeHkd: null,
    maxDeclaredValueUsd: 10000,
    turnaroundDays: '~7',
  },
  RHLD: {
    feeHkd: 550,
    discountedFeeHkd: null,
    feeStartsFrom: true,
    maxDeclaredValueUsd: 5000,
    turnaroundDays: '~65-75',
  },
  PRE1: NULL_FEE,
  PRE2: NULL_FEE,
  PRE3: NULL_FEE,
};

const FEE_BY_SCHEDULE: Record<PsaPricingSchedule, FeeMap> = {
  'through-2026-10-03': FEE_THROUGH_2026_10_03,
  'from-2026-10-04': FEE_FROM_2026_10_04,
};

/** YYYY-MM-DD in Asia/Hong_Kong. */
export function hongKongCalendarDate(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Hong_Kong',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

export function getActivePsaPricingSchedule(now: Date = new Date()): PsaPricingSchedule {
  return hongKongCalendarDate(now) >= PSA_PRICING_CUTOVER_HKT
    ? 'from-2026-10-04'
    : 'through-2026-10-03';
}

export function getPsaPricingRows(schedule: PsaPricingSchedule = getActivePsaPricingSchedule()): PsaPricingRow[] {
  const fees = FEE_BY_SCHEDULE[schedule];
  return PRICED_PLANS.map((plan) => ({
    plan,
    ...fees[plan],
  }));
}

/** @deprecated Prefer getPsaPricingRows(getActivePsaPricingSchedule()) — kept for call sites that expect a const. */
export const PSA_PRICING_ROWS: PsaPricingRow[] = getPsaPricingRows(getActivePsaPricingSchedule());

function feeMap(schedule: PsaPricingSchedule = getActivePsaPricingSchedule()): FeeMap {
  return FEE_BY_SCHEDULE[schedule];
}

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
export function getPsaFeeForCardCount(
  plan: GradingServicePlan,
  cardCount: number,
  schedule: PsaPricingSchedule = getActivePsaPricingSchedule(),
): number | null {
  const row = feeMap(schedule)[plan];
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
export function getPsaDefaultTotalCost(
  plan: GradingServicePlan,
  schedule: PsaPricingSchedule = getActivePsaPricingSchedule(),
): number | null {
  const row = feeMap(schedule)[plan];
  if (!row) return null;
  if (row.feeTiers && row.feeTiers.length > 0) {
    return row.feeHkd != null && row.feeHkd > 0 ? row.feeHkd : null;
  }
  if (row.discountedFeeHkd != null && row.discountedFeeHkd > 0) {
    return row.discountedFeeHkd;
  }
  return row.feeHkd != null && row.feeHkd > 0 ? row.feeHkd : null;
}

export function getPsaLowestDisplayFee(
  schedule: PsaPricingSchedule = getActivePsaPricingSchedule(),
): number {
  return Math.min(
    ...getPsaPricingRows(schedule)
      .filter((row) => row.feeHkd != null)
      .map((row) => getPsaDisplayFee(row)),
  );
}

export function formatPsaTierPriceLine(
  locale: 'en' | 'zh',
  schedule: PsaPricingSchedule = getActivePsaPricingSchedule(),
): string {
  const prefix = locale === 'zh' ? 'PSA 服務費：' : 'PSA service fees: ';
  const parts = getPsaPricingRows(schedule)
    .filter((row) => row.feeHkd != null)
    .map((row) => {
      const feeLabel =
        row.feeTiers && row.feeTiers.length > 0
          ? formatTierFeeRange(row.feeTiers)
          : String(getPsaDisplayFee(row));
      const from =
        row.feeStartsFrom && locale === 'zh'
          ? '起 '
          : row.feeStartsFrom
            ? 'from '
            : '';
      return `${GRADING_SERVICE_PLAN_LABELS[row.plan]} HKD ${from}${feeLabel}`;
    });
  return prefix + parts.join(' · ');
}
