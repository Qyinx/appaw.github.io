'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ALL_GUIDE_HANDLES,
  clampStep,
  GUIDE_DISMISS_KEY,
  isGuideHandle,
  STEP_COUNT,
  stepStateForIndex,
  type CenteringStepIndex,
  type StepState,
} from './centering-guide';

type CenteringGuideContextValue = {
  activeStep: CenteringStepIndex;
  guideDismissed: boolean;
  completedSteps: boolean[];
  touchedGuideHandleCount: number;
  getStepState: (index: number) => StepState;
  advanceStep: () => void;
  setStep: (step: number) => void;
  dismissGuide: () => void;
  restartGuide: () => void;
  markStepComplete: (step: CenteringStepIndex) => void;
  onImageReady: () => void;
  onImageAdjusted: () => void;
  onHandleDrag: (handleName: string) => void;
  onGradeCalculated: () => void;
};

const CenteringGuideContext = createContext<CenteringGuideContextValue | null>(null);

export function CenteringGuideProvider({ children }: { children: React.ReactNode }) {
  const [activeStep, setActiveStep] = useState<CenteringStepIndex>(0);
  const [guideDismissed, setGuideDismissed] = useState(false);
  const [completedFlags, setCompletedFlags] = useState<boolean[]>(() =>
    Array.from({ length: STEP_COUNT }, () => false),
  );
  const [touchedHandles, setTouchedHandles] = useState<Set<string>>(() => new Set());

  // Guide shows on every visit; dismiss lasts for this page load only.
  useEffect(() => {
    try {
      sessionStorage.removeItem(GUIDE_DISMISS_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const markStepComplete = useCallback((step: CenteringStepIndex) => {
    setCompletedFlags((prev) => {
      if (prev[step]) return prev;
      const next = [...prev];
      next[step] = true;
      return next;
    });
  }, []);

  const setStep = useCallback((step: number) => {
    setActiveStep(clampStep(step));
  }, []);

  const advanceStep = useCallback(() => {
    setActiveStep((prev) => clampStep(prev + 1));
  }, []);

  const dismissGuide = useCallback(() => {
    setGuideDismissed(true);
  }, []);

  const restartGuide = useCallback(() => {
    setActiveStep(0);
    setCompletedFlags(Array.from({ length: STEP_COUNT }, () => false));
    setTouchedHandles(new Set());
    setGuideDismissed(false);
  }, []);

  const onImageReady = useCallback(() => {
    setTouchedHandles(new Set());
    markStepComplete(0);
    setActiveStep((prev) => (prev <= 0 ? 1 : prev));
  }, [markStepComplete]);

  const onImageAdjusted = useCallback(() => {
    markStepComplete(1);
    setActiveStep((prev) => (prev <= 1 ? 2 : prev));
  }, [markStepComplete]);

  const onHandleDrag = useCallback(
    (handleName: string) => {
      if (!isGuideHandle(handleName)) return;
      setTouchedHandles((prev) => {
        if (prev.has(handleName)) return prev;
        const next = new Set(prev);
        next.add(handleName);
        if (next.size === ALL_GUIDE_HANDLES.length) {
          markStepComplete(2);
          setActiveStep((step) => (step <= 2 ? 3 : step));
        }
        return next;
      });
    },
    [markStepComplete],
  );

  const onGradeCalculated = useCallback(() => {
    markStepComplete(3);
  }, [markStepComplete]);

  const completedSteps = useMemo(() => {
    return Array.from({ length: STEP_COUNT }, (_, i) => {
      return completedFlags[i] || i < activeStep;
    });
  }, [activeStep, completedFlags]);

  const touchedGuideHandleCount = touchedHandles.size;

  const getStepState = useCallback(
    (index: number) => stepStateForIndex(index, activeStep),
    [activeStep],
  );

  const value = useMemo<CenteringGuideContextValue>(
    () => ({
      activeStep,
      guideDismissed,
      completedSteps,
      touchedGuideHandleCount,
      getStepState,
      advanceStep,
      setStep,
      dismissGuide,
      restartGuide,
      markStepComplete,
      onImageReady,
      onImageAdjusted,
      onHandleDrag,
      onGradeCalculated,
    }),
    [
      activeStep,
      guideDismissed,
      completedSteps,
      touchedGuideHandleCount,
      getStepState,
      advanceStep,
      setStep,
      dismissGuide,
      restartGuide,
      markStepComplete,
      onImageReady,
      onImageAdjusted,
      onHandleDrag,
      onGradeCalculated,
    ],
  );

  return (
    <CenteringGuideContext.Provider value={value}>{children}</CenteringGuideContext.Provider>
  );
}

export function useCenteringGuide(): CenteringGuideContextValue {
  const ctx = useContext(CenteringGuideContext);
  if (!ctx) {
    throw new Error('useCenteringGuide must be used within CenteringGuideProvider');
  }
  return ctx;
}

/** Stable ref bridge for imperative code inside CardCenteringClient useEffect */
export function useCenteringGuideRef() {
  const guide = useCenteringGuide();
  const ref = useRef(guide);
  ref.current = guide;
  return ref;
}
