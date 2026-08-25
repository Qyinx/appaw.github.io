import type { GradingProgressStep, PsaProgressStepId } from './types';

/** Friendly labels for PSA API index 1–8 (our timeline steps 2–9) */
export const PSA_STEP_LABELS: Record<PsaProgressStepId, string> = {
  1: 'Order Arrived',
  2: 'Order Prep',
  3: 'Research & ID',
  4: 'Grading',
  5: 'Assembly',
  6: 'QA Checks',
  7: 'Grades Ready',
  8: 'Completing',
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

/** Appaw (0, 1) + PSA 1–8 (2–9) + Appaw pickup (10) */
export const FULL_STEP_COUNT = 11;

/**
 * Build 11-step pipeline (indices 0–10).
 * `currentStepIndex` is the **current** stage: steps before it are done,
 * this index is in progress (track UI "NOW"), later steps are pending.
 * Index 0–1 Appaw, 2–9 PSA, 10 Appaw pickup.
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
  const current = Math.max(0, Math.min(10, Math.round(Number(currentStepIndex) || 0)));
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

  ([1, 2, 3, 4, 5, 6, 7, 8] as const).forEach((psaStep) => {
    const index = psaStep + 1;
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
    index: 10,
    kind: 'appaw',
    completed: current > 10,
    label: labels.appawPickup,
  });

  return steps;
}

/** Map PSA API index (1–8) to timeline index (2–9). */
export function psaStepToTimelineIndex(psaStep: PsaProgressStepId): number {
  return psaStep + 1;
}
