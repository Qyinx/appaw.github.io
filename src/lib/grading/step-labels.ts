import type { GradingProgressStep, PsaProgressStepId } from './types';

/** Human-readable labels for PSA orderProgressSteps.step enum */
export const PSA_STEP_LABELS: Record<PsaProgressStepId, string> = {
  0: 'Order received',
  1: 'Arrived at PSA',
  2: 'Order prep',
  3: 'Grading',
  4: 'Assembly',
  5: 'Quality review',
  6: 'Grades ready',
  7: 'Shipping prep',
  8: 'Shipped',
};

export const APPAW_STEP_LABELS = {
  recorded: 'Card Recorded at 138 Arena',
  sentToPsa: 'Submitted to PSA Hong Kong',
  pickup: 'Ready for Pickup at 138 Arena',
} as const;

export type FullStepLabels = {
  appawRecorded: string;
  appawSentToPsa: string;
  appawPickup: string;
  psa: Record<PsaProgressStepId, string>;
};

export function stepLabel(step: PsaProgressStepId): string {
  return PSA_STEP_LABELS[step];
}

/** Appaw prefix (2) + PSA 0–8 (9) + Appaw postfix (1) */
export const FULL_STEP_COUNT = 12;

/**
 * Build 12-step pipeline.
 * `currentStepIndex` is the **current** stage (0–11): steps before it are done,
 * this index is in progress (track UI "NOW"), later steps are pending.
 * Index 0 = appaw-recorded, 1 = appaw-sent-psa, 2–10 = psa 0–8, 11 = appaw-pickup.
 */
export function buildFullStepList(
  currentStepIndex: number,
  labels: FullStepLabels = {
    appawRecorded: APPAW_STEP_LABELS.recorded,
    appawSentToPsa: APPAW_STEP_LABELS.sentToPsa,
    appawPickup: APPAW_STEP_LABELS.pickup,
    psa: PSA_STEP_LABELS,
  },
): GradingProgressStep[] {
  const current = Math.max(0, Math.min(11, Math.round(Number(currentStepIndex) || 0)));
  const steps: GradingProgressStep[] = [
    {
      id: 'appaw-recorded',
      index: 0,
      kind: 'appaw',
      completed: current > 0,
      label: labels.appawRecorded,
    },
    {
      id: 'appaw-sent-psa',
      index: 1,
      kind: 'appaw',
      completed: current > 1,
      label: labels.appawSentToPsa,
    },
  ];

  ([0, 1, 2, 3, 4, 5, 6, 7, 8] as const).forEach((psaStep, i) => {
    const index = i + 2;
    steps.push({
      id: `psa-${psaStep}`,
      index,
      kind: 'psa',
      psaStep,
      completed: current > index,
      label: labels.psa[psaStep],
    });
  });

  steps.push({
    id: 'appaw-pickup',
    index: 11,
    kind: 'appaw',
    completed: current > 11,
    label: labels.appawPickup,
  });

  return steps;
}

/** Map PSA API step enum (0–8) to timeline index (2–10). */
export function psaStepToTimelineIndex(psaStep: PsaProgressStepId): number {
  return psaStep + 2;
}
