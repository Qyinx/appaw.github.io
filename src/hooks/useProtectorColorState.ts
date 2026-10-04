'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const USER_RESUME_MS = 8000;

export function useProtectorColorState(options?: {
  trackPrice?: boolean;
  autoplayMs?: number;
  colorCount?: number;
}) {
  const trackPrice = options?.trackPrice ?? false;
  const autoplayMs = options?.autoplayMs;
  const colorCount = options?.colorCount ?? 0;

  const [selectedColor, setSelectedColor] = useState(0);
  const [colorSlideAnimated, setColorSlideAnimated] = useState(false);
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('right');
  const [isScanning, setIsScanning] = useState(false);
  const [priceAnimating, setPriceAnimating] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const prevColor = useRef(0);
  const selectedRef = useRef(0);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  selectedRef.current = selectedColor;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const goTo = useCallback((i: number) => {
    const current = selectedRef.current;
    if (i === current) return;

    const last = colorCount > 0 ? colorCount - 1 : Number.POSITIVE_INFINITY;
    const wrappingForward = current === last && i === 0;
    const wrappingBack = current === 0 && i === last;
    const dir: 'left' | 'right' =
      wrappingForward || (!wrappingBack && i > current) ? 'right' : 'left';

    setSlideDir(dir);
    prevColor.current = current;
    setColorSlideAnimated(true);
    setIsScanning(true);
    setSelectedColor(i);
  }, [colorCount]);

  const pauseForUser = useCallback(() => {
    if (!autoplayMs) return;
    setUserPaused(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setUserPaused(false), USER_RESUME_MS);
  }, [autoplayMs]);

  const selectColor = useCallback(
    (i: number) => {
      pauseForUser();
      goTo(i);
    },
    [goTo, pauseForUser],
  );

  useEffect(() => {
    return () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!colorSlideAnimated) return;
    const id = setTimeout(() => setIsScanning(false), 360);
    return () => clearTimeout(id);
  }, [selectedColor, colorSlideAnimated]);

  const prevSelectedRef = useRef(selectedColor);
  useEffect(() => {
    if (!trackPrice || prevSelectedRef.current === selectedColor) return;
    setPriceAnimating(true);
    const id = setTimeout(() => setPriceAnimating(false), 240);
    prevSelectedRef.current = selectedColor;
    return () => clearTimeout(id);
  }, [selectedColor, trackPrice]);

  const isAutoplayActive = Boolean(
    autoplayMs && colorCount > 1 && !reduceMotion && !userPaused && !hoverPaused,
  );

  useEffect(() => {
    if (!isAutoplayActive || !autoplayMs) return;
    const id = setInterval(() => {
      const next = (selectedRef.current + 1) % colorCount;
      goTo(next);
    }, autoplayMs);
    return () => clearInterval(id);
  }, [isAutoplayActive, autoplayMs, colorCount, goTo]);

  return {
    selectedColor,
    previousColorIndex: prevColor.current,
    slideDir,
    colorSlideAnimated,
    isScanning,
    priceAnimating,
    isAutoplayActive,
    selectColor,
    pauseForUser,
    setHoverPaused,
    prevColorRef: prevColor,
  };
}
