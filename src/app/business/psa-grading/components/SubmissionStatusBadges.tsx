'use client';

import React from 'react';
import { AlertTriangle, Clock, PackageCheck, Truck } from 'lucide-react';
import type { GradingSubmission } from '@/lib/grading/types';
import type { Translations } from '@/i18n/en';

type StatusCopy = Translations['psaGradingTrack']['results']['status'];

type Props = {
  submission: GradingSubmission;
  copy: StatusCopy;
  badgeRefs: React.MutableRefObject<HTMLSpanElement[]>;
};

function StatusBadge({
  tone,
  icon: Icon,
  label,
  badgeRef,
}: {
  tone: 'success' | 'warn' | 'danger' | 'info';
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badgeRef?: (el: HTMLSpanElement | null) => void;
}) {
  const toneClass = {
    success: 'border-accent-success/40 bg-accent-success/10 text-accent-success',
    warn: 'border-accent-warn/40 bg-accent-warn/10 text-accent-warn',
    danger: 'border-accent-danger/40 bg-accent-danger/10 text-accent-danger',
    info: 'border-accent-secondary/40 bg-accent-secondary/10 text-accent-secondary',
  }[tone];

  return (
    <span
      ref={badgeRef}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium border ${toneClass}`}
    >
      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}

export default function SubmissionStatusBadges({ submission, copy, badgeRefs }: Props) {
  const badges: Array<{
    key: string;
    show: boolean;
    tone: 'success' | 'warn' | 'danger' | 'info';
    icon: React.ComponentType<{ className?: string }>;
    label: string;
  }> = [
    { key: 'problem', show: submission.problemOrder, tone: 'danger', icon: AlertTriangle, label: copy.problemOrder },
    { key: 'hold', show: submission.accountingHold, tone: 'warn', icon: AlertTriangle, label: copy.accountingHold },
    {
      key: 'label',
      show: submission.readyForLabelReview && !submission.gradesReady,
      tone: 'info',
      icon: Clock,
      label: copy.readyForLabelReview,
    },
    { key: 'grades', show: submission.gradesReady, tone: 'success', icon: PackageCheck, label: copy.gradesReady },
    { key: 'shipped', show: submission.shipped, tone: 'success', icon: Truck, label: copy.shipped },
  ];

  const visible = badges.filter((b) => b.show);
  if (!visible.length) return null;

  let badgeIndex = 0;

  return (
    <div className="flex flex-wrap gap-2" role="status" aria-live="polite">
      {visible.map((b) => {
        const idx = badgeIndex++;
        return (
          <StatusBadge
            key={b.key}
            tone={b.tone}
            icon={b.icon}
            label={b.label}
            badgeRef={(el) => {
              if (el) badgeRefs.current[idx] = el;
            }}
          />
        );
      })}
    </div>
  );
}
