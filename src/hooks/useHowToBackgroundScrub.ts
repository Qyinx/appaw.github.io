'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { createHowToBackgroundScrub } from '@/lib/motion/how-to-background-scrub';

export function useHowToBackgroundScrub(
  containerRef: React.RefObject<HTMLElement | null>,
  sceneCount: number,
) {
  useEffect(() => {
    const root = containerRef.current;
    if (!root || sceneCount < 1) return;

    const ctx = gsap.context(() => {}, root);
    const cleanup = createHowToBackgroundScrub(root, sceneCount);

    return () => {
      cleanup();
      ctx.revert();
    };
  }, [containerRef, sceneCount]);
}
