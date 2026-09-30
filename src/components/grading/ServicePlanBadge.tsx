import React from 'react';
import type { GradingServicePlan } from '@/lib/grading/reference-code';
import { GRADING_SERVICE_PLAN_LABELS } from '@/lib/grading/reference-code';

type PlanOrUnknown = GradingServicePlan | '—';

/** Distinct hue per plan — shared by admin tables and customer track. */
export const SERVICE_PLAN_HUE: Record<PlanOrUnknown, string> = {
  VBLK: '#64748b', // slate — bulk
  VPLS: '#0ea5e9', // sky
  VMAX: '#16a34a', // green
  STD: '#E85D6F', // brand pink
  REG: '#7c3aed', // violet — priority
  EXP: '#d97706', // amber — express
  SPX: '#ea580c', // orange — super express
  WALK: '#c026d3', // fuchsia — Premier
  RHLD: '#5B6FD6', // indigo/link — reholder
  PRE1: '#0d9488', // teal
  PRE2: '#0891b2', // cyan
  PRE3: '#ca8a04', // gold
  '—': '#94a3b8',
};

type Props = {
  plan: PlanOrUnknown;
  className?: string;
  /** Override label (i18n). Defaults to English GRADING_SERVICE_PLAN_LABELS. */
  label?: string;
};

export default function ServicePlanBadge({ plan, className = '', label }: Props) {
  const resolvedLabel =
    label ?? (plan === '—' ? '—' : GRADING_SERVICE_PLAN_LABELS[plan]);
  const title = plan === '—' ? 'Unknown plan' : `${resolvedLabel} (${plan})`;
  const hue = SERVICE_PLAN_HUE[plan];

  return (
    <span
      title={title}
      aria-label={title}
      data-plan={plan}
      className={`inline-flex items-center text-xs font-medium px-1.5 py-0.5 border whitespace-nowrap ${
        plan === 'PRE3' ? 'font-semibold' : ''
      } ${className}`}
      style={{
        color: hue,
        borderColor: `color-mix(in srgb, ${hue} 50%, transparent)`,
        backgroundColor: `color-mix(in srgb, ${hue} 14%, transparent)`,
      }}
    >
      {resolvedLabel}
    </span>
  );
}
