'use client';

import { useEffect, type RefObject } from 'react';
import {
  animateFormLoading,
  animateLoadingSkeleton,
  animateResultsColumnEnter,
  animateSectionEnter,
} from './grading-track-anime';

export { prefersReducedMotion } from './grading-track-anime';
export {
  animateFormEnter,
  animateFormErrorShake,
  animateErrorAlert,
  animateFieldFill,
  animateButtonPress,
  animateResultsTimeline,
  animateSummaryFields,
  animateReferenceSigil,
  animateTableRows,
  animateTabCrossfade,
  animateSigilFocus,
} from './grading-track-anime';

/** Grid band entrance on mount */
export function useTrackGridEnter(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    return animateSectionEnter(ref.current);
  }, [ref]);
}

/** Form loading + skeleton orchestration */
export function useTrackLoadingState(
  formRef: RefObject<{ getFormElement: () => HTMLFormElement | null } | null>,
  skeletonRef: RefObject<HTMLElement | null>,
  loading: boolean,
) {
  useEffect(() => {
    const formEl = formRef.current?.getFormElement() ?? null;
    const loadingCleanup = animateFormLoading(formEl, skeletonRef.current, loading);

    let skeletonCleanup = () => {};
    if (loading && skeletonRef.current) {
      skeletonCleanup = animateLoadingSkeleton(skeletonRef.current);
    }

    return () => {
      loadingCleanup();
      skeletonCleanup();
    };
  }, [formRef, skeletonRef, loading]);
}

/** Results dossier enter on success */
export function useTrackResultsEnter(
  ref: RefObject<HTMLElement | null>,
  visible: boolean,
) {
  useEffect(() => {
    if (!visible) return;
    return animateResultsColumnEnter(ref.current);
  }, [ref, visible]);
}
