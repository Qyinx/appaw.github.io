'use client';

import React from 'react';
import type { GradingRelatedSubmission } from '@/lib/grading/types';
import type { GradingServicePlan } from '@/lib/grading/reference-code';
import type { Translations } from '@/i18n/en';
import { ArrowRight } from 'lucide-react';

type RelatedCopy = Translations['psaGradingTrack']['results']['relatedSubmissions'];
type ServicePlanCopy = Translations['psaGradingTrack']['servicePlan'];

type Props = {
  currentReferenceCode: string;
  related: GradingRelatedSubmission[];
  copy: RelatedCopy;
  servicePlanCopy: ServicePlanCopy;
  onSelectReference: (referenceCode: string) => void;
};

function planLabel(plan: GradingServicePlan, copy: ServicePlanCopy): string {
  const map: Record<GradingServicePlan, string> = {
    REG: copy.regular,
    EXP: copy.express,
    SPX: copy.superExpress,
    WALK: copy.walkThrough,
  };
  return map[plan];
}

export default function RelatedSubmissionsStrip({
  currentReferenceCode,
  related,
  copy,
  servicePlanCopy,
  onSelectReference,
}: Props) {
  const filtered = related.filter((r) => r.referenceCode !== currentReferenceCode);
  if (!filtered.length) return null;

  return (
    <div className="border border-border-default bg-surface-raised p-4 md:p-5 space-y-3">
      <p className="text-sm font-medium text-text-primary">{copy.title}</p>
      <ul className="space-y-2">
        {filtered.map((item) => (
          <li key={item.referenceCode}>
            <button
              type="button"
              onClick={() => onSelectReference(item.referenceCode)}
              className="w-full text-left flex flex-wrap items-center gap-2 px-3 py-3 min-h-[44px] border border-border-default bg-surface-panel hover:border-accent-secondary/50 hover:bg-surface-raised transition-colors duration-150"
            >
              <span className="font-mono text-sm text-accent-brand tabular-nums">
                {item.referenceCode}
              </span>
              <span className="text-xs px-2 py-0.5 border border-accent-secondary/30 bg-accent-secondary/10 text-accent-secondary">
                {planLabel(item.servicePlan, servicePlanCopy)}
              </span>
              <span className="text-sm text-text-muted flex-1 min-w-[8rem]">{item.statusSummary}</span>
              <ArrowRight className="w-4 h-4 shrink-0 text-text-muted" aria-hidden="true" />
              <span className="sr-only">{copy.switch}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
