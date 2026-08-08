import React from 'react';
import type { GradingServicePlan } from '@/lib/grading/reference-code';
import { GRADING_SERVICE_PLAN_LABELS } from '@/lib/grading/reference-code';

type PlanOrUnknown = GradingServicePlan | '—';

const PLAN_BADGE_CLASS: Record<PlanOrUnknown, string> = {
  VBLK: 'border-text-secondary/40 bg-surface-raised text-text-primary',
  VPLS: 'border-accent-link/40 bg-accent-link/10 text-accent-link',
  VMAX: 'border-accent-success/40 bg-accent-success/10 text-accent-success',
  /** Raw-card grading family — brand pink (matches hub board + pricing). */
  REG: 'border-accent-brand/40 bg-accent-brand/10 text-accent-brand',
  EXP: 'border-accent-brand/45 bg-accent-brand/12 text-accent-brand',
  SPX: 'border-accent-brand/50 bg-accent-brand/15 text-accent-brand',
  WALK: 'border-accent-brand/55 bg-accent-brand/18 text-accent-brand',
  /** Reholder — link blue (matches hub board + pricing). */
  RHLD: 'border-accent-link/50 bg-accent-link/15 text-accent-link',
  PRE1: 'border-accent-brand/30 bg-accent-brand/10 text-accent-brand',
  PRE2: 'border-accent-brand/45 bg-accent-brand/15 text-accent-brand',
  PRE3: 'border-accent-brand/60 bg-accent-brand/25 text-accent-brand font-semibold',
  '—': 'border-border-default bg-surface-bg text-text-muted',
};

type Props = {
  plan: PlanOrUnknown;
  className?: string;
};

export default function ServicePlanBadge({ plan, className = '' }: Props) {
  const label = plan === '—' ? '—' : GRADING_SERVICE_PLAN_LABELS[plan];
  const title = plan === '—' ? 'Unknown plan' : `${label} (${plan})`;

  return (
    <span
      title={title}
      aria-label={title}
      className={`inline-flex items-center text-xs font-medium px-1.5 py-0.5 border whitespace-nowrap ${PLAN_BADGE_CLASS[plan]} ${className}`}
    >
      {label}
    </span>
  );
}
