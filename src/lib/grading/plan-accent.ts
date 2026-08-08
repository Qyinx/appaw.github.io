import type { GradingServicePlan } from './reference-code';

/** Raw-card grading tiers share brand pink; Reholder uses link blue. */
export function isReholderPlan(plan: GradingServicePlan): boolean {
  return plan === 'RHLD';
}

/** Shared plan accent for hub board + pricing. */
export function planBoardAccent(plan: GradingServicePlan): {
  edge: string;
  badge: string;
  badgeText: string;
  bar: string;
  phaseCurrent: string;
} {
  if (isReholderPlan(plan)) {
    return {
      edge: 'border-l-accent-link',
      badge: 'text-accent-link border-accent-link/30',
      badgeText: 'text-accent-link',
      bar: 'bg-accent-link',
      phaseCurrent: 'bg-accent-link/10',
    };
  }
  return {
    edge: 'border-l-accent-brand',
    badge: 'text-accent-brand border-accent-brand/30',
    badgeText: 'text-accent-brand',
    bar: 'bg-accent-brand',
    phaseCurrent: 'bg-accent-brand/10',
  };
}

/** Pricing-table row accents — same two families as the open-rounds board. */
export function planPricingAccent(plan: GradingServicePlan): {
  row: string;
  edge: string;
  chip: string;
} {
  if (isReholderPlan(plan)) {
    return {
      row: 'bg-accent-link/10',
      edge: 'border-l-[3px] border-l-accent-link',
      chip: 'text-accent-link border-accent-link/40 bg-accent-link/15',
    };
  }
  return {
    row: 'bg-accent-brand/5',
    edge: 'border-l-[3px] border-l-accent-brand',
    chip: 'text-accent-brand border-accent-brand/40 bg-accent-brand/15',
  };
}
