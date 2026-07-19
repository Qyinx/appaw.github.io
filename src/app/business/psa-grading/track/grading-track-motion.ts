'use client';

import gsap from 'gsap';

const ENTER_EASE = 'power2.out';
const ENTER_EASE_SOFT = 'power3.out';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function motionDuration(ms: number): number {
  return prefersReducedMotion() ? 0 : ms / 1000;
}

function setVisible(targets: HTMLElement[], props: gsap.TweenVars = {}): void {
  gsap.set(targets, { autoAlpha: 1, y: 0, x: 0, scale: 1, visibility: 'visible', ...props });
}

/** Hero badge / title / subtitle stagger on mount */
export function animateHeroEntrance(
  elements: HTMLElement[],
  onComplete?: () => void,
): gsap.core.Tween | void {
  const targets = elements.filter(Boolean);
  if (!targets.length) return;

  if (prefersReducedMotion()) {
    setVisible(targets);
    onComplete?.();
    return;
  }

  gsap.set(targets, { autoAlpha: 0, y: 16, visibility: 'visible' });
  return gsap.to(targets, {
    autoAlpha: 1,
    y: 0,
    duration: motionDuration(240) || 0.001,
    stagger: 0.05,
    ease: ENTER_EASE_SOFT,
    onComplete,
  });
}

/** Content band below hero */
export function animateSectionEntrance(sectionEl: HTMLElement | null): gsap.core.Tween | void {
  if (!sectionEl) return;

  if (prefersReducedMotion()) {
    gsap.set(sectionEl, { autoAlpha: 1, y: 0 });
    return;
  }

  gsap.set(sectionEl, { autoAlpha: 0, y: 20 });
  return gsap.to(sectionEl, {
    autoAlpha: 1,
    y: 0,
    duration: motionDuration(280) || 0.001,
    delay: 0.06,
    ease: ENTER_EASE_SOFT,
  });
}

/** Form card entrance */
export function animateFormEntrance(formEl: HTMLElement | null): gsap.core.Tween | void {
  if (!formEl) return;

  if (prefersReducedMotion()) {
    gsap.set(formEl, { autoAlpha: 1, y: 0, scale: 1 });
    return;
  }

  gsap.set(formEl, { autoAlpha: 0, y: 28, scale: 0.98 });
  return gsap.to(formEl, {
    autoAlpha: 1,
    y: 0,
    scale: 1,
    duration: motionDuration(300) || 0.001,
    delay: 0.1,
    ease: ENTER_EASE_SOFT,
  });
}

/** Dim form while loading; show skeleton */
export function animateFormLoading(
  formEl: HTMLElement | null,
  skeletonEl: HTMLElement | null,
  loading: boolean,
): gsap.core.Timeline | void {
  if (!formEl) return;
  const dur = motionDuration(150) || 0.001;

  if (prefersReducedMotion()) {
    gsap.set(formEl, { autoAlpha: 1, scale: 1 });
    if (skeletonEl) gsap.set(skeletonEl, { autoAlpha: loading ? 1 : 0 });
    return;
  }

  const tl = gsap.timeline();
  tl.to(formEl, {
    autoAlpha: loading ? 0.55 : 1,
    scale: loading ? 0.985 : 1,
    duration: dur,
    ease: ENTER_EASE,
  });

  if (skeletonEl) {
    if (loading) {
      tl.fromTo(
        skeletonEl,
        { autoAlpha: 0, y: 16, scale: 0.98 },
        { autoAlpha: 1, y: 0, scale: 1, duration: dur * 1.2, ease: ENTER_EASE_SOFT },
        '<',
      );
    } else {
      tl.to(skeletonEl, { autoAlpha: 0, y: -8, duration: dur * 0.6, ease: ENTER_EASE }, 0);
    }
  }

  return tl;
}

/** Stagger skeleton placeholder blocks + subtle pulse loop */
export function animateLoadingSkeleton(
  containerEl: HTMLElement | null,
): gsap.core.Timeline | void {
  if (!containerEl) return;

  const items = Array.from(
    containerEl.querySelectorAll<HTMLElement>('[data-skeleton-item]'),
  );
  if (!items.length) return;

  if (prefersReducedMotion()) {
    setVisible(items);
    return;
  }

  gsap.set(items, { autoAlpha: 0, y: 12, scaleX: 0.92, transformOrigin: 'left center' });
  const tl = gsap.timeline();
  tl.to(items, {
    autoAlpha: 1,
    y: 0,
    scaleX: 1,
    duration: motionDuration(280) || 0.001,
    stagger: 0.07,
    ease: ENTER_EASE_SOFT,
  });
  tl.to(
    items,
    {
      autoAlpha: 0.45,
      duration: 0.55,
      stagger: { each: 0.12, yoyo: true, repeat: -1 },
      ease: 'sine.inOut',
    },
    '+=0.05',
  );
  return tl;
}

/** Horizontal shake on validation / not-found */
export function animateFormErrorShake(formEl: HTMLElement | null): gsap.core.Timeline | void {
  if (!formEl || prefersReducedMotion()) return;

  const tl = gsap.timeline();
  tl.to(formEl, {
    keyframes: [{ x: -8 }, { x: 8 }, { x: -4 }, { x: 4 }, { x: 0 }],
    duration: 0.4,
    ease: 'power1.inOut',
  });
  tl.to(
    formEl,
    {
      boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.35)',
      duration: 0.15,
    },
    0,
  );
  tl.to(formEl, { boxShadow: '0 0 0 0px rgba(0,0,0,0)', duration: 0.35 }, 0.25);
  return tl;
}

/** Not-found alert slide-in */
export function animateErrorAlert(alertEl: HTMLElement | null): gsap.core.Tween | void {
  if (!alertEl) return;

  if (prefersReducedMotion()) {
    gsap.set(alertEl, { autoAlpha: 1, y: 0, scale: 1 });
    return;
  }

  gsap.set(alertEl, { autoAlpha: 0, y: -10, scale: 0.97 });
  return gsap.to(alertEl, {
    autoAlpha: 1,
    y: 0,
    scale: 1,
    duration: motionDuration(280) || 0.001,
    ease: 'back.out(1.5)',
  });
}

/** Reference code ticket reveal — card pop + code emphasis */
export function animateReferenceReveal(
  cardEl: HTMLElement | null,
  codeEl: HTMLElement | null,
): gsap.core.Timeline | void {
  if (!cardEl) return;

  if (prefersReducedMotion()) {
    gsap.set(cardEl, { autoAlpha: 1, y: 0, scale: 1 });
    if (codeEl) gsap.set(codeEl, { autoAlpha: 1, letterSpacing: '0.14em' });
    return;
  }

  gsap.set(cardEl, { autoAlpha: 0, y: 10, scale: 0.98 });
  if (codeEl) gsap.set(codeEl, { autoAlpha: 0, letterSpacing: '0.08em' });

  const tl = gsap.timeline();
  tl.to(cardEl, {
    autoAlpha: 1,
    y: 0,
    scale: 1,
    duration: motionDuration(340) || 0.001,
    ease: 'back.out(1.35)',
  });
  if (codeEl) {
    tl.to(
      codeEl,
      {
        autoAlpha: 1,
        letterSpacing: '0.14em',
        duration: motionDuration(400) || 0.001,
        ease: ENTER_EASE_SOFT,
      },
      '-=0.18',
    );
  }
  tl.fromTo(
    cardEl,
    { boxShadow: '0 0 0 0 color-mix(in srgb, var(--accent-brand) 0%, transparent)' },
    {
      boxShadow: '0 0 0 3px color-mix(in srgb, var(--accent-brand) 18%, transparent)',
      duration: 0.28,
      yoyo: true,
      repeat: 1,
      ease: ENTER_EASE,
    },
    '-=0.2',
  );
  return tl;
}

/** Brief highlight when demo credentials fill inputs */
export function animateFieldFill(fields: HTMLElement[]): gsap.core.Tween | void {
  const targets = fields.filter(Boolean);
  if (!targets.length || prefersReducedMotion()) return;

  return gsap.fromTo(
    targets,
    { boxShadow: '0 0 0 0 rgba(99, 102, 241, 0)' },
    {
      boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.28)',
      duration: 0.18,
      stagger: 0.06,
      yoyo: true,
      repeat: 1,
      ease: ENTER_EASE,
    },
  );
}

/** Results column slides in when lookup succeeds */
export function animateResultsColumnEnter(
  resultsEl: HTMLElement | null,
  formEl: HTMLElement | null,
): gsap.core.Timeline | void {
  if (!resultsEl) return;

  if (prefersReducedMotion()) {
    gsap.set(resultsEl, { autoAlpha: 1, x: 0, y: 0 });
    return;
  }

  gsap.set(resultsEl, { autoAlpha: 0, x: 24, y: 8 });
  const tl = gsap.timeline();
  tl.to(resultsEl, {
    autoAlpha: 1,
    x: 0,
    y: 0,
    duration: motionDuration(300) || 0.001,
    ease: ENTER_EASE_SOFT,
  });
  if (formEl) {
    tl.to(
      formEl,
      {
        boxShadow: '0 0 0 1px color-mix(in srgb, var(--accent-secondary) 35%, transparent)',
        duration: 0.2,
      },
      0.08,
    );
    tl.to(formEl, { boxShadow: '0 0 0 0px transparent', duration: 0.28 }, 0.35);
  }
  return tl;
}

/** Orchestrated reveal for result sections */
export function animateResultsTimeline(
  sections: HTMLElement[],
): gsap.core.Timeline | void {
  const targets = sections.filter(Boolean);
  if (!targets.length) return;

  if (prefersReducedMotion()) {
    setVisible(targets);
    return;
  }

  gsap.set(targets, { autoAlpha: 0, y: 22 });
  const tl = gsap.timeline({ defaults: { ease: ENTER_EASE_SOFT } });
  targets.forEach((el, i) => {
    tl.to(
      el,
      { autoAlpha: 1, y: 0, duration: motionDuration(300) || 0.001 },
      i === 0 ? 0 : `-=${0.12}`,
    );
  });
  return tl;
}

/** Summary ref + status labels inside results card */
export function animateSummaryFields(fields: HTMLElement[]): gsap.core.Tween | void {
  const targets = fields.filter(Boolean);
  if (!targets.length) return;

  if (prefersReducedMotion()) {
    setVisible(targets);
    return;
  }

  gsap.set(targets, { autoAlpha: 0, y: 10 });
  return gsap.to(targets, {
    autoAlpha: 1,
    y: 0,
    duration: motionDuration(240) || 0.001,
    stagger: 0.05,
    ease: ENTER_EASE,
  });
}

/** Results panel entrance (legacy single-block) */
export function animateResultsReveal(panelEl: HTMLElement | null): gsap.core.Tween | void {
  if (!panelEl) return;

  if (prefersReducedMotion()) {
    gsap.set(panelEl, { autoAlpha: 1, y: 0 });
    return;
  }

  gsap.set(panelEl, { autoAlpha: 0, y: 20 });
  return gsap.to(panelEl, {
    autoAlpha: 1,
    y: 0,
    duration: motionDuration(280) || 0.001,
    ease: ENTER_EASE,
  });
}

/** Progress bar → vertical rail → phase bar → steps → badges sequence */
export function animateStepperSequence(opts: {
  barEl: HTMLElement | null;
  verticalFillEl: HTMLElement | null;
  phaseBarEl: HTMLElement | null;
  stepEls: HTMLElement[];
  badgeEls: HTMLElement[];
  activeIconEl: HTMLElement | null;
  percent: number;
}): (() => void) | void {
  const { barEl, verticalFillEl, phaseBarEl, stepEls, badgeEls, activeIconEl, percent } = opts;
  const steps = stepEls.filter(Boolean);
  const badges = badgeEls.filter(Boolean);
  const scale = Math.min(100, Math.max(0, percent)) / 100;

  const setPhaseBarInstant = () => {
    if (!phaseBarEl) return;
    setVisible(Array.from(phaseBarEl.querySelectorAll<HTMLElement>('[data-phase-node]')));
  };

  if (prefersReducedMotion()) {
    if (barEl) gsap.set(barEl, { scaleX: scale, transformOrigin: 'left center' });
    if (verticalFillEl) gsap.set(verticalFillEl, { scaleY: scale, transformOrigin: 'top center' });
    setPhaseBarInstant();
    setVisible(steps);
    setVisible(badges, { scale: 1 });
    return;
  }

  const buildTimeline = (includePhaseBar: boolean): gsap.core.Timeline => {
    const tl = gsap.timeline();

    if (barEl) {
      gsap.set(barEl, { scaleX: 0, transformOrigin: 'left center' });
      tl.to(barEl, {
        scaleX: scale,
        duration: motionDuration(400) || 0.001,
        ease: ENTER_EASE,
      });
    }

    if (verticalFillEl) {
      gsap.set(verticalFillEl, { scaleY: 0, transformOrigin: 'top center' });
      tl.to(
        verticalFillEl,
        {
          scaleY: scale,
          duration: motionDuration(400) || 0.001,
          ease: ENTER_EASE,
        },
        barEl ? '-=0.28' : 0,
      );
    }

    if (includePhaseBar && phaseBarEl) {
      const phaseNodes = Array.from(
        phaseBarEl.querySelectorAll<HTMLElement>('[data-phase-node]'),
      );

      if (phaseNodes.length) {
        gsap.set(phaseNodes, { autoAlpha: 0, y: 8 });
        tl.to(
          phaseNodes,
          {
            autoAlpha: 1,
            y: 0,
            duration: motionDuration(220) || 0.001,
            stagger: 0.08,
            ease: ENTER_EASE,
          },
          '-=0.2',
        );
      }
    }

    if (steps.length) {
      gsap.set(steps, { autoAlpha: 0, y: 12 });
      tl.to(
        steps,
        {
          autoAlpha: 1,
          y: 0,
          duration: motionDuration(260) || 0.001,
          stagger: 0.04,
          ease: ENTER_EASE,
        },
        '-=0.12',
      );
    }

    if (badges.length) {
      gsap.set(badges, { autoAlpha: 0, scale: 0.85 });
      tl.to(
        badges,
        {
          autoAlpha: 1,
          scale: 1,
          duration: motionDuration(150) || 0.001,
          stagger: 0.06,
          ease: 'back.out(1.4)',
        },
        '-=0.08',
      );
    }

    if (activeIconEl) {
      tl.add(() => {
        animateActiveStepIcon(activeIconEl);
      }, '-=0.05');
    }

    return tl;
  };

  const mm = gsap.matchMedia();

  mm.add('(min-width: 768px)', () => {
    const tl = buildTimeline(true);
    return () => {
      tl.kill();
    };
  });

  mm.add('(max-width: 767px)', () => {
    const tl = buildTimeline(true);
    return () => {
      tl.kill();
    };
  });

  return () => {
    mm.revert();
  };
}

/** Progress bar fill (transform scaleX only) */
export function animateProgressBar(
  barEl: HTMLElement | null,
  percent: number,
): gsap.core.Tween | void {
  if (!barEl) return;

  const scale = Math.min(100, Math.max(0, percent)) / 100;

  if (prefersReducedMotion()) {
    gsap.set(barEl, { scaleX: scale, transformOrigin: 'left center' });
    return;
  }

  gsap.set(barEl, { scaleX: 0, transformOrigin: 'left center' });
  return gsap.to(barEl, {
    scaleX: scale,
    duration: motionDuration(400) || 0.001,
    ease: ENTER_EASE,
  });
}

/** Stagger step nodes */
export function animateStepStagger(stepEls: HTMLElement[]): gsap.core.Tween | void {
  const targets = stepEls.filter(Boolean);
  if (!targets.length) return;

  if (prefersReducedMotion()) {
    setVisible(targets);
    return;
  }

  gsap.set(targets, { autoAlpha: 0, y: 12 });
  return gsap.to(targets, {
    autoAlpha: 1,
    y: 0,
    duration: motionDuration(260) || 0.001,
    stagger: 0.04,
    ease: ENTER_EASE,
  });
}

/** Status badge pop-in */
export function animateBadgeStagger(badgeEls: HTMLElement[]): gsap.core.Tween | void {
  const targets = badgeEls.filter(Boolean);
  if (!targets.length) return;

  if (prefersReducedMotion()) {
    setVisible(targets, { scale: 1 });
    return;
  }

  gsap.set(targets, { autoAlpha: 0, scale: 0.85 });
  return gsap.to(targets, {
    autoAlpha: 1,
    scale: 1,
    duration: motionDuration(150) || 0.001,
    stagger: 0.06,
    ease: 'back.out(1.4)',
  });
}

/** Pulse active step icon */
export function animateActiveStepIcon(iconEl: HTMLElement | null): gsap.core.Tween | void {
  if (!iconEl || prefersReducedMotion()) return;

  return gsap.fromTo(
    iconEl,
    { scale: 1 },
    { scale: 1.08, duration: 0.2, yoyo: true, repeat: 1, ease: ENTER_EASE },
  );
}

/** Table row stagger when visible */
export function animateTableRows(rowEls: HTMLElement[]): gsap.core.Tween | void {
  const targets = rowEls.filter(Boolean);
  if (!targets.length) return;

  if (prefersReducedMotion()) {
    setVisible(targets);
    return;
  }

  gsap.set(targets, { autoAlpha: 0, y: 10 });
  return gsap.to(targets, {
    autoAlpha: 1,
    y: 0,
    duration: motionDuration(220) || 0.001,
    stagger: 0.03,
    ease: ENTER_EASE,
  });
}

/** Button press feedback */
export function animateButtonPress(btn: HTMLElement | null): void {
  if (!btn || prefersReducedMotion()) return;
  gsap.fromTo(
    btn,
    { scale: 1 },
    { scale: 0.95, duration: 0.06, yoyo: true, repeat: 1, ease: ENTER_EASE },
  );
}
