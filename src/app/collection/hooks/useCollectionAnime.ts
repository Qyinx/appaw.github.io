'use client';

import { useEffect, type RefObject } from 'react';
import { animate, stagger, type JSAnimation } from 'animejs';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function resetAnimatedStyle(el: HTMLElement) {
  el.style.opacity = '';
  el.style.transform = '';
  el.style.willChange = '';
}

type StaggerOptions = {
  selector?: string;
  disabled?: boolean;
  duration?: number;
  staggerMs?: number;
  translateY?: number;
};

/** Stagger fade/slide for `[data-collection-animate]` descendants. */
export function useCollectionStagger(
  containerRef: RefObject<HTMLElement | null>,
  deps: ReadonlyArray<unknown>,
  options: StaggerOptions = {},
) {
  const {
    selector = '[data-collection-animate]',
    disabled = false,
    duration = 280,
    staggerMs = 36,
    translateY = 10,
  } = options;

  useEffect(() => {
    if (disabled || prefersReducedMotion()) return;
    const root = containerRef.current;
    if (!root) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>(selector));
    if (!targets.length) return;

    targets.forEach(el => {
      el.style.willChange = 'transform, opacity';
      el.style.opacity = '0';
      el.style.transform = translateY ? `translate3d(0, ${translateY}px, 0)` : 'none';
    });

    let anim: JSAnimation | undefined;
    let cancelled = false;
    anim = animate(targets, {
      opacity: [0, 1],
      ...(translateY ? { translateY: [translateY, 0] } : {}),
      duration,
      delay: stagger(staggerMs),
      ease: 'outCubic',
    });

    void anim.then(() => {
      if (cancelled) return;
      targets.forEach(resetAnimatedStyle);
    });

    return () => {
      cancelled = true;
      anim?.cancel();
      targets.forEach(resetAnimatedStyle);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Single block enter (hero, toolbar, form panel). */
export function useCollectionEnter(
  ref: RefObject<HTMLElement | null>,
  deps: ReadonlyArray<unknown> = [],
  options: { disabled?: boolean; delay?: number; duration?: number } = {},
) {
  const { disabled = false, delay = 0, duration = 300 } = options;

  useEffect(() => {
    if (disabled || prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;

    el.style.willChange = 'transform, opacity';
    el.style.opacity = '0';
    el.style.transform = 'translate3d(0, 8px, 0)';

    let anim: JSAnimation | undefined;
    let cancelled = false;
    anim = animate(el, {
      opacity: [0, 1],
      translateY: [8, 0],
      duration,
      delay,
      ease: 'outCubic',
    });

    void anim.then(() => {
      if (cancelled) return;
      resetAnimatedStyle(el);
    });

    return () => {
      cancelled = true;
      anim?.cancel();
      resetAnimatedStyle(el);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Crossfade when async content replaces skeleton/spinner. */
export function useCollectionReveal(
  ref: RefObject<HTMLElement | null>,
  visible: boolean,
  options: { disabled?: boolean } = {},
) {
  const { disabled = false } = options;

  useEffect(() => {
    if (disabled || !visible || prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;

    let anim: JSAnimation | undefined;
    anim = animate(el, {
      opacity: [0, 1],
      translateY: [6, 0],
      duration: 260,
      ease: 'outCubic',
    });

    return () => {
      anim?.cancel();
    };
  }, [disabled, visible]);
}
