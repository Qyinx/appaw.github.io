/** Canonical recommended retail prices — Graded Slab UV Glass Protector */
export const PROTECTOR_PRICING = {
  currency: 'HKD',
  single: 120,
  gradient: 140,
} as const;

export function formatProtectorPrice(amount: number): string {
  return `HK$${amount}`;
}

export function protectorPriceLabels() {
  return {
    single: formatProtectorPrice(PROTECTOR_PRICING.single),
    gradient: formatProtectorPrice(PROTECTOR_PRICING.gradient),
  };
}

export function protectorPriceValidUntil(): string {
  return `${new Date().getFullYear()}-12-31`;
}
