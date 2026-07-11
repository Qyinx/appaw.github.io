'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/motion/chapter-scrub';

gsap.registerPlugin(ScrollTrigger);

const SCROLL_BANDS_VH = 0.9;
const END_HOLD_RATIO = 0.18;

function mapSceneProgress(rawProgress: number): number {
  if (rawProgress >= 1 - END_HOLD_RATIO) return 1;
  return rawProgress / (1 - END_HOLD_RATIO);
}

function getScrubMultiplier(): number {
  if (typeof window === 'undefined') return 1;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--motion-chapter-scrub-dur')
    .trim();
  const parsed = parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : 1;
}

function scrollTravelPx(sceneCount: number): number {
  return window.innerHeight * sceneCount * SCROLL_BANDS_VH;
}

function applyScrubUpdate(
  progress: number,
  sceneCount: number,
  layers: HTMLElement[],
  imgs: HTMLElement[],
  stepEls: HTMLElement[],
  section: HTMLElement,
  kenBurns: boolean,
): void {
  const sceneProgress = mapSceneProgress(progress);
  const index = Math.min(
    sceneCount - 1,
    Math.max(0, Math.floor(sceneProgress * sceneCount)),
  );
  setSceneOpacities(layers, sceneProgress, sceneCount);
  if (kenBurns) {
    setKenBurns(imgs, sceneProgress, sceneCount);
  }
  setActiveStep(stepEls, index, section, sceneCount);
}

function setSceneOpacities(
  layers: HTMLElement[],
  progress: number,
  sceneCount: number,
): void {
  if (sceneCount <= 1) {
    if (layers[0]) gsap.set(layers[0], { opacity: 1 });
    return;
  }

  const t = Math.min(sceneCount - 1, Math.max(0, progress * (sceneCount - 1)));
  const i0 = Math.floor(t);
  const i1 = Math.min(i0 + 1, sceneCount - 1);
  const blend = t - i0;

  layers.forEach((layer, i) => {
    let opacity = 0;
    if (i === i0) opacity = 1 - blend;
    if (i === i1) opacity = blend;
    if (progress >= 1) opacity = i === sceneCount - 1 ? 1 : 0;
    gsap.set(layer, { opacity });
  });
}

function setKenBurns(
  imgs: HTMLElement[],
  progress: number,
  sceneCount: number,
): void {
  if (sceneCount <= 1) return;

  const t = Math.min(sceneCount - 1, Math.max(0, progress * (sceneCount - 1)));
  const i0 = Math.floor(t);
  const local = t - i0;

  imgs.forEach((img, i) => {
    if (i !== i0) {
      gsap.set(img, { scale: 1, xPercent: 0, yPercent: 0 });
      return;
    }
    const scale = 1 + local * 0.06;
    const xPercent = local * -1.5;
    const yPercent = local * -0.75;
    gsap.set(img, { scale, xPercent, yPercent, transformOrigin: 'center center' });
  });
}

function setActiveStep(
  stepEls: HTMLElement[],
  index: number,
  section: HTMLElement,
  sceneCount: number,
): void {
  const progress = sceneCount > 1 ? index / (sceneCount - 1) : 0;
  section.style.setProperty('--how-to-rail-progress', String(progress));

  stepEls.forEach((el, i) => {
    const active = i === index;
    const completed = i < index;
    el.classList.toggle('grading-workflow-timeline__item--active', active);
    el.classList.toggle('grading-workflow-timeline__item--completed', completed);
    if (active) {
      el.setAttribute('aria-current', 'step');
    } else {
      el.removeAttribute('aria-current');
    }
  });
}

function enableStaticStage(
  layers: HTMLElement[],
  imgs: HTMLElement[],
  stepEls: HTMLElement[],
  section: HTMLElement,
  sceneCount: number,
): () => void {
  layers.forEach((layer, i) => {
    gsap.set(layer, { opacity: i === 0 ? 1 : 0 });
  });
  imgs.forEach((img) => {
    gsap.set(img, { scale: 1, xPercent: 0, yPercent: 0, clearProps: 'transform' });
  });
  setActiveStep(stepEls, 0, section, sceneCount);
  return () => {};
}

function cleanupScrubState(
  layers: HTMLElement[],
  imgs: HTMLElement[],
  stepEls: HTMLElement[],
  kenBurns: boolean,
  section?: HTMLElement,
): void {
  layers.forEach((layer) => gsap.set(layer, { clearProps: 'opacity' }));
  if (kenBurns) {
    imgs.forEach((img) => gsap.set(img, { clearProps: 'all' }));
  }
  stepEls.forEach((el) => {
    el.classList.remove('grading-workflow-timeline__item--active');
    el.classList.remove('grading-workflow-timeline__item--completed');
    el.removeAttribute('aria-current');
  });
  section?.classList.remove('how-to-scroll-section--pinned');
}

function createPinnedScrubTrigger(
  trigger: HTMLElement,
  section: HTMLElement,
  stage: HTMLElement,
  sceneCount: number,
  layers: HTMLElement[],
  imgs: HTMLElement[],
  stepEls: HTMLElement[],
  kenBurns: boolean,
): ScrollTrigger {
  applyScrubUpdate(0, sceneCount, layers, imgs, stepEls, section, kenBurns);

  return ScrollTrigger.create({
    trigger,
    start: 'top top',
    end: () => `+=${scrollTravelPx(sceneCount)}`,
    pin: stage,
    pinSpacing: true,
    scrub: getScrubMultiplier(),
    invalidateOnRefresh: true,
    anticipatePin: 1,
    onToggle: (self) => {
      section.classList.toggle('how-to-scroll-section--pinned', self.isActive);
    },
    onUpdate: (self) => {
      applyScrubUpdate(self.progress, sceneCount, layers, imgs, stepEls, section, kenBurns);
    },
    onLeave: () => {
      applyScrubUpdate(1, sceneCount, layers, imgs, stepEls, section, kenBurns);
    },
  });
}

function enableMobileStatic(
  layers: HTMLElement[],
  imgs: HTMLElement[],
  stepEls: HTMLElement[],
  section: HTMLElement,
): () => void {
  layers.forEach((layer, i) => {
    gsap.set(layer, { opacity: i === 0 ? 1 : 0 });
  });
  imgs.forEach((img) => {
    gsap.set(img, { scale: 1, xPercent: 0, yPercent: 0, clearProps: 'transform' });
  });
  stepEls.forEach((el) => {
    el.classList.remove('grading-workflow-timeline__item--active');
    el.classList.remove('grading-workflow-timeline__item--completed');
    el.removeAttribute('aria-current');
  });
  section.style.setProperty('--how-to-rail-progress', '0');
  return () => {};
}

/**
 * Pin + scrub on desktop. Mobile: static full content. Reduced motion: static step 1.
 */
export function createHowToBackgroundScrub(
  root: HTMLElement,
  sceneCount: number,
): () => void {
  const section = root.querySelector<HTMLElement>('#how-to');
  const stage = section?.querySelector<HTMLElement>('.how-to-scroll-section__stage');
  const layers = Array.from(
    root.querySelectorAll<HTMLElement>('[data-how-to-scene]'),
  );
  const imgs = Array.from(
    root.querySelectorAll<HTMLElement>('[data-how-to-scene-img]'),
  );
  const stepEls = Array.from(
    root.querySelectorAll<HTMLElement>('#how-to [data-step-index]'),
  );

  if (!section || !stage || !layers.length || sceneCount < 1) {
    return () => {};
  }

  const mm = gsap.matchMedia();
  let scrollTrigger: ScrollTrigger | null = null;

  mm.add('(prefers-reduced-motion: reduce)', () => {
    return enableStaticStage(layers, imgs, stepEls, section, sceneCount);
  });

  mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
    return enableMobileStatic(layers, imgs, stepEls, section);
  });

  mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
    scrollTrigger = createPinnedScrubTrigger(
      stage,
      section,
      stage,
      sceneCount,
      layers,
      imgs,
      stepEls,
      true,
    );

    ScrollTrigger.refresh();

    return () => {
      scrollTrigger?.kill();
      scrollTrigger = null;
      cleanupScrubState(layers, imgs, stepEls, true, section);
    };
  });

  return () => {
    mm.revert();
    ScrollTrigger.refresh();
  };
}

export { prefersReducedMotion };
