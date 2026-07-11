import type { GradingServicePlan } from './reference-code';
import { GRADING_SERVICE_PLAN_CODES } from './reference-code';

export type PsaPricingRow = {
  plan: GradingServicePlan;
  feeHkd: number | null;
  maxDeclaredValueUsd: number;
  turnaroundDays: string;
};

/** PSA tier data — Appaw HKD service fees. */
export const PSA_PRICING_ROWS: PsaPricingRow[] = GRADING_SERVICE_PLAN_CODES.map((plan) => {
  const byPlan: Record<GradingServicePlan, Omit<PsaPricingRow, 'plan'>> = {
    REG: { feeHkd: 890, maxDeclaredValueUsd: 1500, turnaroundDays: '40–50' },
    EXP: { feeHkd: 1900, maxDeclaredValueUsd: 2500, turnaroundDays: '20–30' },
    SPX: { feeHkd: 3600, maxDeclaredValueUsd: 5000, turnaroundDays: '7–10' },
    WALK: { feeHkd: 5900, maxDeclaredValueUsd: 10000, turnaroundDays: '7' },
  };
  return { plan, ...byPlan[plan] };
});

const WHATSAPP_NUMBER = '85292851189';

export function psaQuoteWhatsAppUrl(planLabel: string): string {
  const text = encodeURIComponent(`PSA ${planLabel} quote`);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
