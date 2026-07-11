export const STEP_COUNT = 4;
export const GUIDE_DISMISS_KEY = 'centering-guide-dismissed';

export type CenteringStepIndex = 0 | 1 | 2 | 3;
export type StepState = 'completed' | 'current' | 'upcoming';

export const STEP_IDS = ['upload', 'adjust', 'align', 'read'] as const;
export type CenteringStepId = (typeof STEP_IDS)[number];

export const OUTER_HANDLES = ['outerTop', 'outerBottom', 'outerLeft', 'outerRight'] as const;
export const INNER_HANDLES = ['innerTop', 'innerBottom', 'innerLeft', 'innerRight'] as const;
export const ALL_GUIDE_HANDLES = [...OUTER_HANDLES, ...INNER_HANDLES] as const;
export type GuideHandleName = (typeof ALL_GUIDE_HANDLES)[number];

export function isOuterHandle(name: string): boolean {
  return name.startsWith('outer');
}

export function isInnerHandle(name: string): boolean {
  return name.startsWith('inner');
}

export function isGuideHandle(name: string): name is GuideHandleName {
  return (ALL_GUIDE_HANDLES as readonly string[]).includes(name);
}

export function stepStateForIndex(index: number, activeStep: number): StepState {
  if (index < activeStep) return 'completed';
  if (index === activeStep) return 'current';
  return 'upcoming';
}

export function clampStep(step: number): CenteringStepIndex {
  return Math.max(0, Math.min(STEP_COUNT - 1, step)) as CenteringStepIndex;
}

export type CenteringContentStep = { title: string; body: string };
export type CenteringHowToStep = { name: string; text: string };

/** Map page content steps to HowTo schema / in-app guide shape (single source of truth). */
export function centeringHowToSteps(steps: readonly CenteringContentStep[]): CenteringHowToStep[] {
  return steps.map(({ title, body }) => ({ name: title, text: body }));
}
