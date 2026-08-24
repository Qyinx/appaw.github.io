'use client';

import { animate, createTimeline, stagger, type JSAnimation, type Timeline } from 'animejs';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function resetAnimatedStyle(el: HTMLElement) {
  el.style.opacity = '';
  el.style.transform = '';
  el.style.willChange = '';
  el.style.boxShadow = '';
  el.style.letterSpacing = '';
}

function prepEnter(el: HTMLElement, y: number, scale = 1) {
  el.style.willChange = 'transform, opacity';
  el.style.opacity = '0';
  el.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
}

export type AnimeCleanup = () => void;

function toCleanup(anim: JSAnimation | Timeline | undefined): AnimeCleanup {
  return () => {
    anim?.cancel();
  };
}

/** Grid / form panel entrance on mount */
export function animateSectionEnter(el: HTMLElement | null): AnimeCleanup {
  if (!el) return () => {};
  if (prefersReducedMotion()) return () => {};

  prepEnter(el, 20);
  const anim = animate(el, {
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 280,
    delay: 60,
    ease: 'outCubic',
  });
  void anim.then(() => resetAnimatedStyle(el));
  return () => {
    anim.cancel();
    resetAnimatedStyle(el);
  };
}

/** Form card entrance */
export function animateFormEnter(formEl: HTMLElement | null): AnimeCleanup {
  if (!formEl) return () => {};
  if (prefersReducedMotion()) return () => {};

  prepEnter(formEl, 28, 0.98);
  const anim = animate(formEl, {
    opacity: [0, 1],
    translateY: [28, 0],
    scale: [0.98, 1],
    duration: 300,
    delay: 100,
    ease: 'outCubic',
  });
  void anim.then(() => resetAnimatedStyle(formEl));
  return () => {
    anim.cancel();
    resetAnimatedStyle(formEl);
  };
}

/** Dim form while loading; show skeleton */
export function animateFormLoading(
  formEl: HTMLElement | null,
  skeletonEl: HTMLElement | null,
  loading: boolean,
): AnimeCleanup {
  if (!formEl) return () => {};
  if (prefersReducedMotion()) {
    if (skeletonEl) skeletonEl.style.opacity = loading ? '1' : '0';
    return () => {};
  }

  const anims: JSAnimation[] = [];

  anims.push(
    animate(formEl, {
      opacity: loading ? 0.55 : 1,
      scale: loading ? 0.985 : 1,
      duration: 150,
      ease: 'outQuad',
    }),
  );

  if (skeletonEl) {
    if (loading) {
      prepEnter(skeletonEl, 16, 0.98);
      anims.push(
        animate(skeletonEl, {
          opacity: [0, 1],
          translateY: [16, 0],
          scale: [0.98, 1],
          duration: 180,
          ease: 'outCubic',
        }),
      );
    } else {
      anims.push(
        animate(skeletonEl, {
          opacity: 0,
          translateY: -8,
          duration: 90,
          ease: 'outQuad',
        }),
      );
    }
  }

  return () => {
    anims.forEach((a) => a.cancel());
    if (skeletonEl) resetAnimatedStyle(skeletonEl);
  };
}

/** Skeleton pulse loop — returns cleanup that cancels loop */
export function animateLoadingSkeleton(containerEl: HTMLElement | null): AnimeCleanup {
  if (!containerEl) return () => {};
  const items = Array.from(containerEl.querySelectorAll<HTMLElement>('[data-skeleton-item]'));
  if (!items.length) return () => {};

  if (prefersReducedMotion()) return () => {};

  items.forEach((el) => {
    el.style.willChange = 'transform, opacity';
    el.style.opacity = '0';
    el.style.transform = 'translate3d(0, 12px, 0) scaleX(0.92)';
    el.style.transformOrigin = 'left center';
  });

  const enter = animate(items, {
    opacity: [0, 1],
    translateY: [12, 0],
    scaleX: [0.92, 1],
    duration: 280,
    delay: stagger(70),
    ease: 'outCubic',
  });

  let pulse: JSAnimation | undefined;
  void enter.then(() => {
    pulse = animate(items, {
      opacity: [1, 0.45],
      duration: 550,
      delay: stagger(120),
      ease: 'inOutSine',
      loop: true,
      alternate: true,
    });
  });

  return () => {
    enter.cancel();
    pulse?.cancel();
    items.forEach(resetAnimatedStyle);
  };
}

/** Horizontal shake on not-found */
export function animateFormErrorShake(formEl: HTMLElement | null): AnimeCleanup {
  if (!formEl || prefersReducedMotion()) return () => {};

  const anim = animate(formEl, {
    translateX: [-8, 8, -4, 4, 0],
    duration: 400,
    ease: 'inOutQuad',
  });

  formEl.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.35)';
  const fadeShadow = animate(formEl, {
    boxShadow: ['0 0 0 2px rgba(239, 68, 68, 0.35)', '0 0 0 0 rgba(0,0,0,0)'],
    duration: 350,
    delay: 250,
    ease: 'outQuad',
  });

  return () => {
    anim.cancel();
    fadeShadow.cancel();
    resetAnimatedStyle(formEl);
  };
}

/** Not-found alert slide-in */
export function animateErrorAlert(alertEl: HTMLElement | null): AnimeCleanup {
  if (!alertEl) return () => {};
  if (prefersReducedMotion()) return () => {};

  prepEnter(alertEl, -10, 0.97);
  const anim = animate(alertEl, {
    opacity: [0, 1],
    translateY: [-10, 0],
    scale: [0.97, 1],
    duration: 280,
    ease: 'outBack',
  });
  void anim.then(() => resetAnimatedStyle(alertEl));
  return () => {
    anim.cancel();
    resetAnimatedStyle(alertEl);
  };
}

/** Brief highlight when demo credentials fill inputs */
export function animateFieldFill(fields: HTMLElement[]): AnimeCleanup {
  const targets = fields.filter(Boolean);
  if (!targets.length || prefersReducedMotion()) return () => {};

  const anim = animate(targets, {
    boxShadow: [
      '0 0 0 0 rgba(99, 102, 241, 0)',
      '0 0 0 3px rgba(99, 102, 241, 0.28)',
      '0 0 0 0 rgba(99, 102, 241, 0)',
    ],
    duration: 180,
    delay: stagger(60),
    ease: 'outQuad',
  });

  return () => {
    anim.cancel();
    targets.forEach(resetAnimatedStyle);
  };
}

/** Results column slides in when lookup succeeds */
export function animateResultsColumnEnter(resultsEl: HTMLElement | null): AnimeCleanup {
  if (!resultsEl) return () => {};
  if (prefersReducedMotion()) return () => {};

  resultsEl.style.willChange = 'transform, opacity';
  resultsEl.style.opacity = '0';
  resultsEl.style.transform = 'translate3d(24px, 8px, 0)';

  const anim = animate(resultsEl, {
    opacity: [0, 1],
    translateX: [24, 0],
    translateY: [8, 0],
    duration: 300,
    ease: 'outCubic',
  });
  void anim.then(() => resetAnimatedStyle(resultsEl));
  return () => {
    anim.cancel();
    resetAnimatedStyle(resultsEl);
  };
}

/** Orchestrated reveal for result sections */
export function animateResultsTimeline(sections: HTMLElement[]): AnimeCleanup {
  const targets = sections.filter(Boolean);
  if (!targets.length) return () => {};
  if (prefersReducedMotion()) return () => {};

  targets.forEach((el) => prepEnter(el, 22));

  const tl = createTimeline({ defaults: { ease: 'outCubic' } });
  targets.forEach((el, i) => {
    tl.add(
      el,
      {
        opacity: [0, 1],
        translateY: [22, 0],
        duration: 300,
      },
      i === 0 ? 0 : '-=120',
    );
  });

  void tl.then(() => targets.forEach(resetAnimatedStyle));
  return () => {
    tl.cancel();
    targets.forEach(resetAnimatedStyle);
  };
}

/** Summary fields inside results card */
export function animateSummaryFields(fields: HTMLElement[]): AnimeCleanup {
  const targets = fields.filter(Boolean);
  if (!targets.length) return () => {};
  if (prefersReducedMotion()) return () => {};

  targets.forEach((el) => prepEnter(el, 10));

  const anim = animate(targets, {
    opacity: [0, 1],
    translateY: [10, 0],
    duration: 240,
    delay: stagger(50),
    ease: 'outQuad',
  });
  void anim.then(() => targets.forEach(resetAnimatedStyle));
  return toCleanup(anim);
}

/** Reference code sigil reveal on dossier mount */
export function animateReferenceSigil(
  headerEl: HTMLElement | null,
  codeEl: HTMLElement | null,
): AnimeCleanup {
  if (!headerEl) return () => {};
  if (prefersReducedMotion()) return () => {};

  prepEnter(headerEl, 10, 0.98);
  if (codeEl) {
    codeEl.style.opacity = '0';
    codeEl.style.letterSpacing = '0.08em';
  }

  const tl = createTimeline({ defaults: { ease: 'outCubic' } });
  tl.add(headerEl, {
    opacity: [0, 1],
    translateY: [10, 0],
    scale: [0.98, 1],
    duration: 340,
    ease: 'outBack',
  });

  if (codeEl) {
    tl.add(
      codeEl,
      {
        opacity: [0, 1],
        letterSpacing: ['0.08em', '0.1em'],
        duration: 400,
      },
      '-=180',
    );
  }

  return () => {
    tl.cancel();
    resetAnimatedStyle(headerEl);
    if (codeEl) resetAnimatedStyle(codeEl);
  };
}

/** Table row stagger */
export function animateTableRows(rowEls: HTMLElement[]): AnimeCleanup {
  const targets = rowEls.filter(Boolean);
  if (!targets.length) return () => {};
  if (prefersReducedMotion()) return () => {};

  targets.forEach((el) => prepEnter(el, 10));

  const anim = animate(targets, {
    opacity: [0, 1],
    translateY: [10, 0],
    duration: 220,
    delay: stagger(30),
    ease: 'outQuad',
  });
  void anim.then(() => targets.forEach(resetAnimatedStyle));
  return toCleanup(anim);
}

/** Tab panel crossfade */
export function animateTabCrossfade(
  outgoingEl: HTMLElement | null,
  incomingEl: HTMLElement | null,
): AnimeCleanup {
  if (prefersReducedMotion()) return () => {};

  const anims: JSAnimation[] = [];

  if (outgoingEl) {
    anims.push(
      animate(outgoingEl, {
        opacity: [1, 0],
        translateY: [0, -4],
        duration: 160,
        ease: 'outQuad',
      }),
    );
  }

  if (incomingEl) {
    incomingEl.style.opacity = '0';
    incomingEl.style.transform = 'translate3d(0, 6px, 0)';
    anims.push(
      animate(incomingEl, {
        opacity: [0, 1],
        translateY: [6, 0],
        duration: 220,
        delay: outgoingEl ? 80 : 0,
        ease: 'outCubic',
      }),
    );
  }

  return () => {
    anims.forEach((a) => a.cancel());
    if (incomingEl) resetAnimatedStyle(incomingEl);
  };
}

/** Button press feedback */
export function animateButtonPress(btn: HTMLElement | null): void {
  if (!btn || prefersReducedMotion()) return;
  const anim = animate(btn, {
    scale: [1, 0.95, 1],
    duration: 120,
    ease: 'outQuad',
  });
  void anim.then(() => {
    btn.style.transform = '';
    btn.style.willChange = '';
  });
}

/** Sigil field focus glow pulse */
export function animateSigilFocus(fieldEl: HTMLElement | null): AnimeCleanup {
  if (!fieldEl || prefersReducedMotion()) return () => {};

  const anim = animate(fieldEl, {
    boxShadow: [
      '0 0 0 0 color-mix(in srgb, var(--accent-primary) 0%, transparent)',
      '0 0 0 3px color-mix(in srgb, var(--accent-primary) 22%, transparent)',
      '0 0 0 0 color-mix(in srgb, var(--accent-primary) 0%, transparent)',
    ],
    duration: 420,
    ease: 'outQuad',
  });

  return () => {
    anim.cancel();
    fieldEl.style.boxShadow = '';
  };
}
