import type { GradingServicePlan } from './reference-code';
import { GRADING_SERVICE_PLAN_LABELS } from './reference-code';

export type PsaPricingRow = {
  plan: GradingServicePlan;
  /** List / standard Appaw service fee (HKD). */
  feeHkd: number | null;
  /** Optional promotional fee — when set and lower than feeHkd, table shows discount + struck list price. */
  discountedFeeHkd: number | null;
  maxDeclaredValueUsd: number;
  turnaroundDays: string;
};

/** Plans with published hub fees. Value / Premium tiers TBD. */
const PRICED_PLANS: GradingServicePlan[] = ['REG', 'EXP', 'SPX', 'WALK', 'RHLD'];

const FEE_BY_PLAN: Record<GradingServicePlan, Omit<PsaPricingRow, 'plan'>> = {
  VBLK: { feeHkd: null, discountedFeeHkd: null, maxDeclaredValueUsd: 0, turnaroundDays: '—' },
  VPLS: { feeHkd: null, discountedFeeHkd: null, maxDeclaredValueUsd: 0, turnaroundDays: '—' },
  VMAX: { feeHkd: null, discountedFeeHkd: null, maxDeclaredValueUsd: 0, turnaroundDays: '—' },
  REG: { feeHkd: 890, discountedFeeHkd: 850, maxDeclaredValueUsd: 1500, turnaroundDays: '~40–50' },
  EXP: { feeHkd: 1900, discountedFeeHkd: 1800, maxDeclaredValueUsd: 2500, turnaroundDays: '~20–30' },
  SPX: { feeHkd: 3600, discountedFeeHkd: 3400, maxDeclaredValueUsd: 5000, turnaroundDays: '~7–10' },
  WALK: { feeHkd: 5900, discountedFeeHkd: 5500, maxDeclaredValueUsd: 10000, turnaroundDays: '~7' },
  RHLD: { feeHkd: 550, discountedFeeHkd: 550, maxDeclaredValueUsd: 5000, turnaroundDays: '~65–75' },
  PRE1: { feeHkd: null, discountedFeeHkd: null, maxDeclaredValueUsd: 0, turnaroundDays: '—' },
  PRE2: { feeHkd: null, discountedFeeHkd: null, maxDeclaredValueUsd: 0, turnaroundDays: '—' },
  PRE3: { feeHkd: null, discountedFeeHkd: null, maxDeclaredValueUsd: 0, turnaroundDays: '—' },
};

/** PSA tier data — Appaw HKD service fees (published rows only). */
export const PSA_PRICING_ROWS: PsaPricingRow[] = PRICED_PLANS.map((plan) => ({
  plan,
  ...FEE_BY_PLAN[plan],
}));

/** Effective fee shown in pricing table and SEO — promo when set and lower than list. */
export function getPsaDisplayFee(row: PsaPricingRow): number {
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

/** Default card totalCost for admin drafts — promo fee when published, else null. */
export function getPsaDefaultTotalCost(plan: GradingServicePlan): number | null {
  const fee = FEE_BY_PLAN[plan]?.discountedFeeHkd;
  return fee != null && fee > 0 ? fee : null;
}

export function getPsaLowestDisplayFee(): number {
  return Math.min(
    ...PSA_PRICING_ROWS.filter((row) => row.feeHkd != null).map((row) => getPsaDisplayFee(row)),
  );
}

export function formatPsaTierPriceLine(locale: 'en' | 'zh'): string {
  const prefix = locale === 'zh' ? 'PSA 服務費：' : 'PSA service fees: ';
  const parts = PSA_PRICING_ROWS.filter((row) => row.feeHkd != null).map(
    (row) => `${GRADING_SERVICE_PLAN_LABELS[row.plan]} HKD ${getPsaDisplayFee(row)}`,
  );
  return prefix + parts.join(' · ');
}
