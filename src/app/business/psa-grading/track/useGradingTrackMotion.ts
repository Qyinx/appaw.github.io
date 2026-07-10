'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export {
  animateHeroEntrance,
  animateSectionEntrance,
  animateFormEntrance,
  animateFormLoading,
  animateLoadingSkeleton,
  animateFormErrorShake,
  animateErrorAlert,
  animateFieldFill,
  animateResultsColumnEnter,
  animateResultsTimeline,
  animateSummaryFields,
  animateResultsReveal,
  animateStepperSequence,
  animateProgressBar,
  animateStepStagger,
  animateBadgeStagger,
  animateActiveStepIcon,
  animateTableRows,
  animateButtonPress,
  prefersReducedMotion,
} from './grading-track-motion';

/**
 * Scope GSAP tweens to a container and revert matchMedia on unmount.
 * Motion helpers read prefers-reduced-motion at call time.
 */
export function useGradingTrackMotion(containerRef: React.RefObject<HTMLElement | null>) {
  const contextRef = useRef<gsap.Context | null>(null);
  const matchMediaRef = useRef<gsap.MatchMedia | null>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    matchMediaRef.current = gsap.matchMedia();
    contextRef.current = gsap.context(() => {}, root);

    return () => {
      matchMediaRef.current?.revert();
      contextRef.current?.revert();
    };
  }, [containerRef]);
}
