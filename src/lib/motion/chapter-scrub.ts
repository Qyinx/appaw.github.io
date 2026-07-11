'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getScrubMultiplier(): number {
  if (typeof window === 'undefined') return 1;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--motion-chapter-scrub-dur')
    .trim();
  const parsed = parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : 1;
}

function setActiveStep(stepEls: HTMLElement[], index: number): void {
  stepEls.forEach((el, i) => {
    const active = i === index;
    el.classList.toggle('how-to-scrub__step--active', active);
    el.setAttribute('aria-current', active ? 'step' : 'false');
  });
}

function enableStaticSteps(
  root: HTMLElement,
  stepEls: HTMLElement[],
): () => void {
  root.querySelector('[data-how-to-scrub]')?.classList.add('how-to-scrub--static');
  stepEls.forEach((el) => el.classList.add('how-to-scrub__step--active'));
  return () => {
    root.querySelector('[data-how-to-scrub]')?.classList.remove('how-to-scrub--static');
    stepEls.forEach((el) => {
      el.classList.remove('how-to-scrub__step--active');
      el.removeAttribute('aria-current');
    });
  };
}

/**
 * Scroll-linked step highlight on #how-to — no pin (pin caused runaway pinSpacing / blank gaps).
 * Desktop: scrub active step + progress rail. Mobile / reduced-motion: all steps visible.
 */
export function createHowToScrub(root: HTMLElement, stepCount: number): () => void {
  const section = root.querySelector<HTMLElement>('#how-to');
  const scrubContainer = root.querySelector<HTMLElement>('[data-how-to-scrub]');
  const progressFill = root.querySelector<HTMLElement>('[data-how-to-progress]');
  const stepEls = Array.from(
    root.querySelectorAll<HTMLElement>('[data-step-index]'),
  );

  if (!section || !scrubContainer || !stepEls.length || stepCount < 1) {
    return () => {};
  }

  const mm = gsap.matchMedia();
  let scrollTrigger: ScrollTrigger | null = null;

  mm.add('(max-width: 767px), (prefers-reduced-motion: reduce)', () => {
    return enableStaticSteps(root, stepEls);
  });

  mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
    setActiveStep(stepEls, 0);

    if (progressFill) {
      gsap.set(progressFill, { scaleY: 0, transformOrigin: 'top center' });
    }

    scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      end: 'bottom 45%',
      scrub: getScrubMultiplier(),
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const index = Math.min(
          stepCount - 1,
          Math.max(0, Math.floor(self.progress * stepCount)),
        );
        setActiveStep(stepEls, index);

        if (progressFill) {
          gsap.set(progressFill, {
            scaleY: self.progress,
            transformOrigin: 'top center',
          });
        }
      },
    });

    ScrollTrigger.refresh();

    return () => {
      scrollTrigger?.kill();
      scrollTrigger = null;
      stepEls.forEach((el) => {
        el.classList.remove('how-to-scrub__step--active');
        el.removeAttribute('aria-current');
      });
      if (progressFill) {
        gsap.set(progressFill, { clearProps: 'transform' });
      }
    };
  });

  return () => {
    mm.revert();
    ScrollTrigger.refresh();
  };
}
