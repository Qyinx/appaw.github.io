'use client';

import React, { useEffect, useRef } from 'react';
import {
  Award,
  BadgeCheck,
  ClipboardList,
  FileStack,
  Layers,
  Package,
  PackageCheck,
  PackageOpen,
  ScanSearch,
  Send,
  ShieldCheck,
} from 'lucide-react';
import type { GradingProgressStep, GradingSubmission } from '@/lib/grading/types';
import { submissionProgressPercent } from '@/lib/grading/mock-data';
import Stepper, { type StepperItem, type StepperPhase } from '@/components/ui/Stepper';
import { animateStepperSequence } from '../track/grading-track-motion';

type StepperCopy = {
  currentStep: string;
  completed: string;
  pending: string;
  progress: string;
  progressLabel: string;
  phaseCodes: Record<StepperPhase, string>;
  phases: Record<StepperPhase, string>;
};

type Props = {
  submission: GradingSubmission;
  copy: { stepper: StepperCopy };
  badgeRefs: React.MutableRefObject<HTMLSpanElement[]>;
};

const STEP_ICONS: Record<string, React.ReactNode> = {
  'appaw-recorded': <ClipboardList className="w-4 h-4" aria-hidden="true" />,
  'appaw-sent-psa': <Send className="w-4 h-4" aria-hidden="true" />,
  'psa-1': <Package className="w-4 h-4" aria-hidden="true" />,
  'psa-2': <FileStack className="w-4 h-4" aria-hidden="true" />,
  'psa-3': <ScanSearch className="w-4 h-4" aria-hidden="true" />,
  'psa-4': <Award className="w-4 h-4" aria-hidden="true" />,
  'psa-5': <Layers className="w-4 h-4" aria-hidden="true" />,
  'psa-6': <ShieldCheck className="w-4 h-4" aria-hidden="true" />,
  'psa-7': <BadgeCheck className="w-4 h-4" aria-hidden="true" />,
  'psa-8': <PackageCheck className="w-4 h-4" aria-hidden="true" />,
  'appaw-pickup': <PackageOpen className="w-4 h-4" aria-hidden="true" />,
};

function stepPhase(step: GradingProgressStep): StepperPhase {
  if (step.id === 'appaw-pickup') return 'pickup';
  if (step.kind === 'appaw') return 'intake';
  return 'psa';
}

export default function GradingProgressStepper({ submission, copy, badgeRefs }: Props) {
  const verticalFillRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<HTMLElement[]>([]);
  const activeIconRef = useRef<HTMLSpanElement>(null);

  const activeIndex = submission.steps.findIndex((s) => !s.completed);
  const currentIdx = activeIndex === -1 ? submission.steps.length - 1 : activeIndex;
  const progressPct = submissionProgressPercent(submission.steps);

  useEffect(() => {
    itemRefs.current = [];
  }, [submission.id]);

  useEffect(() => {
    const stepEls = itemRefs.current.filter(Boolean);

    const cleanup = animateStepperSequence({
      barEl: null,
      verticalFillEl: verticalFillRef.current,
      phaseBarEl: null,
      stepEls,
      badgeEls: badgeRefs.current.filter(Boolean),
      activeIconEl: activeIconRef.current,
      percent: progressPct,
    });

    return () => {
      cleanup?.();
    };
  }, [submission, progressPct, currentIdx, badgeRefs]);

  const timelineItems: StepperItem[] = submission.steps.map((step: GradingProgressStep, index) => {
    const isActive = index === currentIdx && !step.completed;
    const stateLabel = step.completed
      ? copy.stepper.completed
      : isActive
        ? copy.stepper.currentStep
        : copy.stepper.pending;

    return {
      id: step.id,
      title: step.label,
      caption: stateLabel,
      state: step.completed ? 'complete' : isActive ? 'active' : 'pending',
      phase: stepPhase(step),
      appaw: step.kind === 'appaw',
      icon: STEP_ICONS[step.id],
    };
  });

  const displayStepIndex = activeIndex === -1 ? submission.steps.length : activeIndex + 1;
  const progressSummary = copy.stepper.progress
    .replace('{current}', String(displayStepIndex).padStart(2, '0'))
    .replace('{total}', String(submission.steps.length).padStart(2, '0'));

  return (
    <Stepper
      items={timelineItems}
      progressPercent={progressPct}
      currentStepIndex={currentIdx}
      progressSummary={progressSummary}
      progressLabel={copy.stepper.progressLabel}
      phaseLabels={copy.stepper.phases}
      phaseCodes={copy.stepper.phaseCodes}
      statusWords={{
        complete: copy.stepper.completed,
        active: copy.stepper.currentStep,
        pending: copy.stepper.pending,
      }}
      verticalFillRef={verticalFillRef}
      getItemRef={(index) => (el) => {
        if (el) itemRefs.current[index] = el;
      }}
      getActiveIconRef={(el) => {
        if (el) activeIconRef.current = el as HTMLSpanElement;
      }}
    />
  );
}
