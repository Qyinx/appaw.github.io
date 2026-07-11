'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { createHowToScrub } from '@/lib/motion/chapter-scrub';

/**
 * Scope ScrollTrigger chapter scrub to a container and revert on unmount.
 * Mirrors useGradingTrackMotion cleanup pattern.
 */
export function useChapterScrub(
  containerRef: React.RefObject<HTMLElement | null>,
  stepCount: number,
) {
  useEffect(() => {
    const root = containerRef.current;
    if (!root || stepCount < 1) return;

    const ctx = gsap.context(() => {}, root);
    const cleanupScrub = createHowToScrub(root, stepCount);

    return () => {
      cleanupScrub();
      ctx.revert();
    };
  }, [containerRef, stepCount]);
}
