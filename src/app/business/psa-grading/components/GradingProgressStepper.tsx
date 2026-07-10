'use client';

import React, { useEffect, useRef } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  PackageOpen,
  Send,
  Store,
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
  phases: Record<StepperPhase, string>;
};

type Props = {
  submission: GradingSubmission;
  copy: { stepper: StepperCopy };
  badgeRefs: React.MutableRefObject<HTMLSpanElement[]>;
};

function StepIcon({
  step,
  completed,
  active,
}: {
  step: GradingProgressStep;
  completed: boolean;
  active: boolean;
}) {
  if (step.kind === 'appaw') {
    const Icon =
      step.id === 'appaw-pickup' ? PackageOpen : step.id === 'appaw-sent-psa' ? Send : Store;
    const className = completed
      ? 'w-5 h-5 shrink-0 text-accent-success'
      : active
        ? 'w-5 h-5 shrink-0 text-accent-warn'
        : 'w-5 h-5 shrink-0 text-accent-brand';
    return <Icon className={className} aria-hidden="true" />;
  }

  if (completed) {
    return <CheckCircle2 className="w-5 h-5 shrink-0 text-accent-success" aria-hidden="true" />;
  }
  if (active) {
    return <Clock className="w-5 h-5 shrink-0 text-accent-warn" aria-hidden="true" />;
  }
  return <Circle className="w-5 h-5 shrink-0 text-text-muted" aria-hidden="true" />;
}

function stepPhase(step: GradingProgressStep): StepperPhase {
  if (step.id === 'appaw-pickup') return 'pickup';
  if (step.kind === 'appaw') return 'intake';
  return 'psa';
}

export default function GradingProgressStepper({ submission, copy, badgeRefs }: Props) {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const verticalFillRef = useRef<HTMLDivElement>(null);
  const phaseBarRef = useRef<HTMLDivElement>(null);
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
      barEl: progressBarRef.current,
      verticalFillEl: verticalFillRef.current,
      phaseBarEl: phaseBarRef.current,
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
      icon: <StepIcon step={step} completed={step.completed} active={isActive} />,
      appaw: step.kind === 'appaw',
    };
  });

  const displayStepIndex = activeIndex === -1 ? submission.steps.length : activeIndex + 1;
  const progressSummary = copy.stepper.progress
    .replace('{current}', String(displayStepIndex))
    .replace('{total}', String(submission.steps.length));

  return (
    <Stepper
      items={timelineItems}
      progressPercent={progressPct}
      currentStepIndex={currentIdx}
      progressSummary={progressSummary}
      phaseLabels={copy.stepper.phases}
      progressBarRef={progressBarRef}
      verticalFillRef={verticalFillRef}
      phaseBarRef={phaseBarRef}
      getItemRef={(index) => (el) => {
        if (el) itemRefs.current[index] = el;
      }}
      getActiveIconRef={(el) => {
        if (el) activeIconRef.current = el as HTMLSpanElement;
      }}
    />
  );
}
