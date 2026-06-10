'use client';

import { useCallback, useEffect, useRef } from 'react';

interface UseHeroColorAutoplayOptions {
  /** Ms between auto-advances (default 4200) */
  intervalMs?: number;
  /** Ms to pause after manual color pick (default 12000) */
  pauseMs?: number;
  enabled?: boolean;
  /** Pause while pointer is over hero (hover) */
  hoverPaused?: boolean;
}

/**
 * Cycles protector colors on an interval. Pauses on user interaction and when
 * prefers-reduced-motion is set.
 */
export function useHeroColorAutoplay(
  colorCount: number,
  selectedColor: number,
  selectColor: (index: number) => void,
  options: UseHeroColorAutoplayOptions = {},
) {
  const { intervalMs = 4200, pauseMs = 12000, enabled = true, hoverPaused = false } = options;
  const pausedUntilRef = useRef(0);
  const selectedRef = useRef(selectedColor);
  selectedRef.current = selectedColor;

  const pause = useCallback(() => {
    pausedUntilRef.current = Date.now() + pauseMs;
  }, [pauseMs]);

  useEffect(() => {
    if (!enabled || colorCount <= 1) return;

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');

    const tick = () => {
      if (media.matches) return;
      if (hoverPaused) return;
      if (Date.now() < pausedUntilRef.current) return;
      const next = (selectedRef.current + 1) % colorCount;
      selectColor(next);
    };

    const id = window.setInterval(tick, intervalMs);
    return () => window.clearInterval(id);
  }, [colorCount, selectColor, intervalMs, enabled, hoverPaused]);

  return { pause };
}
