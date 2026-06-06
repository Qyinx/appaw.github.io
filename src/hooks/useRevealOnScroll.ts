'use client';

import { useEffect, useRef, useState } from 'react';

export interface UseRevealOnScrollOptions {
  threshold?: number;
  rootMargin?: string;
  /** Fire once when element enters viewport (default). */
  once?: boolean;
}

/**
 * IntersectionObserver hook for scroll-triggered reveals.
 * Pair with `.motion-reveal` / `<Reveal>` and `data-visible`.
 */
export function useRevealOnScroll<T extends HTMLElement = HTMLElement>(
  options: UseRevealOnScrollOptions = {},
) {
  const { threshold = 0.12, rootMargin = '0px', once = true } = options;
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, visible };
}

/** Short mount delay for above-the-fold hero sequences. */
export function useHeroMount(delayMs = 80) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  return mounted;
}
