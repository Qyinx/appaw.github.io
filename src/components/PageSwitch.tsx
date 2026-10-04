'use client';

import { useEffect, useLayoutEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';

const FAILSAFE_MS = 8000;

/**
 * CodePen Transition Lab slice:
 * direction=up bands=6 stagger=0.05 hold=0 duration=0.35 ease=power2.inOut
 */
const DURATION = 0.35;
const STAGGER = 0.05;
const EASE = 'power2.inOut';
const BAND_COUNT = 6;

const BAND_COLORS = [
  '#C44536', // accent-primary
  '#1A140E', // ink
  '#F3EBDA', // cream
] as const;

/** DIRECTIONS.up — vertical columns, sweep from bottom. */
const VERTICAL = true;
const SIGN = -1;
const REVERSE = true;

type Phase = 'idle' | 'covering' | 'hold' | 'revealing';

let hostEl: HTMLDivElement | null = null;
let trackEl: HTMLDivElement | null = null;
let phase: Phase = 'idle';
let routeAtStart = '';
let pendingHref: string | null = null;
let navigateTo: ((href: string) => void) | null = null;
let bands: HTMLDivElement[] = [];
let coverTl: gsap.core.Timeline | null = null;
let revealTl: gsap.core.Timeline | null = null;
let failsafeTimer: ReturnType<typeof setTimeout> | null = null;
let clickBound = false;

function sliceProp(): 'yPercent' | 'xPercent' {
  return VERTICAL ? 'yPercent' : 'xPercent';
}

function sliceFrom(): number {
  return SIGN < 0 ? 100 : -100;
}

function ensureHost(): HTMLDivElement {
  const existing = document.getElementById('page-switch-slice');
  if (existing instanceof HTMLDivElement) {
    hostEl = existing;
    trackEl = existing.querySelector('.page-switch__track');
    return existing;
  }

  const host = document.createElement('div');
  host.id = 'page-switch-slice';
  host.className = 'page-switch';
  host.setAttribute('aria-hidden', 'true');
  Object.assign(host.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '2147483000',
    display: 'none',
    overflow: 'hidden',
    pointerEvents: 'none',
  });

  const track = document.createElement('div');
  track.className = 'page-switch__track';
  Object.assign(track.style, {
    position: 'absolute',
    inset: '0',
    display: 'flex',
    flexDirection: VERTICAL ? 'row' : 'column',
  });
  host.appendChild(track);

  document.body.appendChild(host);
  hostEl = host;
  trackEl = track;
  return host;
}

function currentRouteKey(): string {
  return `${window.location.pathname}${window.location.search}`;
}

function internalNavHref(anchor: HTMLAnchorElement, event: MouseEvent): string | null {
  if (event.button !== 0) return null;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
  if (anchor.target && anchor.target !== '_self') return null;
  if (anchor.hasAttribute('download')) return null;

  const href = anchor.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return null;
  }

  let url: URL;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return null;
  }

  if (url.origin !== window.location.origin) return null;
  if (url.pathname === window.location.pathname && url.search === window.location.search) {
    return null;
  }

  return `${url.pathname}${url.search}${url.hash}`;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Freeze scroll WITHOUT hiding the scrollbar.
 * overflow:hidden removes the bar for a frame and changes page width —
 * block wheel/touch/keys instead so layout width stays constant.
 */
function blockScrollEvent(event: Event) {
  event.preventDefault();
}

function blockScrollKey(event: KeyboardEvent) {
  const keys = [
    ' ',
    'Spacebar',
    'ArrowUp',
    'ArrowDown',
    'PageUp',
    'PageDown',
    'Home',
    'End',
  ];
  if (keys.includes(event.key)) event.preventDefault();
}

function lockScroll() {
  document.documentElement.classList.add('page-switching');
  window.addEventListener('wheel', blockScrollEvent, { passive: false, capture: true });
  window.addEventListener('touchmove', blockScrollEvent, { passive: false, capture: true });
  window.addEventListener('keydown', blockScrollKey, { capture: true });
}

function unlockScroll() {
  document.documentElement.classList.remove('page-switching');
  window.removeEventListener('wheel', blockScrollEvent, { capture: true } as EventListenerOptions);
  window.removeEventListener('touchmove', blockScrollEvent, { capture: true } as EventListenerOptions);
  window.removeEventListener('keydown', blockScrollKey, { capture: true } as EventListenerOptions);
}

function hideHost() {
  if (hostEl) {
    hostEl.style.display = 'none';
    hostEl.style.pointerEvents = 'none';
  }
  if (trackEl) trackEl.innerHTML = '';
  bands = [];
  unlockScroll();
}

function resetIdle() {
  hideHost();
  phase = 'idle';
  pendingHref = null;
}

function buildBands(): HTMLDivElement[] {
  const host = ensureHost();
  const track = trackEl ?? host;
  const from = sliceFrom();

  track.innerHTML = '';
  track.style.flexDirection = VERTICAL ? 'row' : 'column';

  const els: HTMLDivElement[] = [];
  for (let i = 0; i < BAND_COUNT; i++) {
    const band = document.createElement('div');
    band.className = 'page-switch__band';
    band.style.background = BAND_COLORS[i % BAND_COLORS.length];
    band.style.flex = '1 1 0';
    band.style.minWidth = '0';
    band.style.minHeight = '0';
    band.style.willChange = 'transform';
    track.appendChild(band);
    els.push(band);
  }

  const ordered = REVERSE ? [...els].reverse() : els;
  gsap.set(ordered, { [sliceProp()]: from });

  // Freeze scroll but keep scrollbar painted — no width jump at start/end.
  lockScroll();
  host.style.display = 'block';
  host.style.pointerEvents = 'auto';
  void host.offsetWidth;

  bands = ordered;
  return ordered;
}

function commitPendingNav() {
  const href = pendingHref;
  pendingHref = null;
  if (!href) return;
  if (navigateTo) navigateTo(href);
  else window.history.pushState({}, '', href);
}

function beginReveal() {
  if (phase !== 'hold') return;
  if (!bands.length) {
    resetIdle();
    return;
  }

  phase = 'revealing';
  const from = sliceFrom();

  if (prefersReducedMotion()) {
    resetIdle();
    return;
  }

  revealTl?.kill();
  revealTl = gsap.timeline({
    onComplete: () => {
      revealTl = null;
      resetIdle();
    },
  });

  revealTl.to(bands, {
    [sliceProp()]: -from,
    duration: DURATION,
    ease: EASE,
    stagger: STAGGER,
  });
}

function onCoverComplete() {
  coverTl = null;
  if (phase !== 'covering') return;

  phase = 'hold';
  commitPendingNav();

  if (currentRouteKey() !== routeAtStart) {
    beginReveal();
  }
}

function beginCover() {
  if (phase !== 'idle') return;

  coverTl?.kill();
  revealTl?.kill();
  if (failsafeTimer) clearTimeout(failsafeTimer);

  phase = 'covering';
  routeAtStart = currentRouteKey();

  const nextBands = buildBands();
  if (!nextBands.length) {
    commitPendingNav();
    resetIdle();
    return;
  }

  if (prefersReducedMotion()) {
    gsap.set(nextBands, { [sliceProp()]: 0 });
    onCoverComplete();
    return;
  }

  coverTl = gsap.timeline({ onComplete: onCoverComplete });
  coverTl.to(nextBands, {
    [sliceProp()]: 0,
    duration: DURATION,
    ease: EASE,
    stagger: STAGGER,
  });

  failsafeTimer = setTimeout(() => {
    if (phase === 'covering') {
      coverTl?.kill();
      onCoverComplete();
    }
    if (phase === 'hold') beginReveal();
  }, FAILSAFE_MS);
}

function onRouteMaybeChanged() {
  if (phase !== 'hold') return;
  if (currentRouteKey() === routeAtStart) return;
  beginReveal();
}

function onDocumentClick(event: MouseEvent) {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const anchor = target.closest('a');
  if (!(anchor instanceof HTMLAnchorElement)) return;
  const href = internalNavHref(anchor, event);
  if (!href) return;

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  if (phase !== 'idle') return;

  pendingHref = href;
  beginCover();
}

function bindClick() {
  if (clickBound) return;
  window.addEventListener('click', onDocumentClick, true);
  clickBound = true;
}

/**
 * Slice wipe: cover current page with bands, then push route, then uncover.
 * Overlay lives on document.body so App Router remounts cannot hide it.
 */
export default function PageSwitch() {
  const pathname = usePathname();
  const router = useRouter();

  useLayoutEffect(() => {
    navigateTo = (href: string) => {
      router.push(href);
    };
    ensureHost();
    bindClick();
    return () => {
      navigateTo = (href: string) => {
        router.push(href);
      };
    };
  }, [router]);

  useEffect(() => {
    onRouteMaybeChanged();
  }, [pathname]);

  return null;
}
