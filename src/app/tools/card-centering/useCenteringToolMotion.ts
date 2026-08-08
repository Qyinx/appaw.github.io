'use client';

import { useEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useCenteringToolMotion({
  emptyPlateRef,
  adjustDockRef,
  gradePillRef,
  adjustOpen,
  showGradePill,
  showEmpty,
}: {
  emptyPlateRef: RefObject<HTMLElement | null>;
  adjustDockRef: RefObject<HTMLElement | null>;
  gradePillRef: RefObject<HTMLElement | null>;
  adjustOpen: boolean;
  showGradePill: boolean;
  showEmpty: boolean;
}) {
  const hadGradePillRef = useRef(false);
  const adjustOpenRef = useRef(adjustOpen);

  useEffect(() => {
    if (!showEmpty) return;
    const el = emptyPlateRef.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(el, { autoAlpha: 1, y: 0 });
      return;
    }

    gsap.killTweensOf(el);
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.26, ease: 'power2.out' },
    );

    return () => {
      gsap.killTweensOf(el);
    };
  }, [showEmpty, emptyPlateRef]);

  useEffect(() => {
    const el = adjustDockRef.current;
    if (!el) return;

    const wasOpen = adjustOpenRef.current;
    adjustOpenRef.current = adjustOpen;

    if (prefersReducedMotion()) {
      gsap.set(el, { autoAlpha: 1, y: 0 });
      return;
    }

    // Skip first paint; only animate state changes after mount.
    if (wasOpen === adjustOpen) return;

    gsap.killTweensOf(el);
    if (adjustOpen) {
      gsap.fromTo(
        el,
        { autoAlpha: 0.92, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.24, ease: 'power2.out', clearProps: 'transform' },
      );
    } else {
      gsap.fromTo(
        el,
        { y: 0 },
        {
          y: 10,
          duration: 0.16,
          ease: 'power2.in',
          onComplete: () => {
            gsap.set(el, { y: 0, clearProps: 'transform' });
          },
        },
      );
    }

    return () => {
      gsap.killTweensOf(el);
    };
  }, [adjustOpen, adjustDockRef]);

  useEffect(() => {
    if (!showGradePill) {
      hadGradePillRef.current = false;
      return;
    }

    const el = gradePillRef.current;
    if (!el) return;

    if (hadGradePillRef.current) return;
    hadGradePillRef.current = true;

    if (prefersReducedMotion()) {
      gsap.set(el, { autoAlpha: 1, scale: 1 });
      return;
    }

    gsap.killTweensOf(el);
    gsap.fromTo(
      el,
      { autoAlpha: 0, scale: 0.96 },
      { autoAlpha: 1, scale: 1, duration: 0.18, ease: 'power2.out' },
    );

    return () => {
      gsap.killTweensOf(el);
    };
  }, [showGradePill, gradePillRef]);
}
