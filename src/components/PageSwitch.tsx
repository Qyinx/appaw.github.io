'use client';

import { useEffect, useLayoutEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const FAILSAFE_MS = 2500;

/**
 * CodePen slice: direction=up bands=6 stagger=0.05 hold=0 duration=0.35
 * ease=power2.inOut (CSS cubic-bezier). CSS @keyframes so Safari compositor
 * keeps the ease; GSAP ticks die on WebKit during router.push.
 */
const DURATION = 0.35;
const STAGGER = 0.05;
const BAND_COUNT = 6;

const BAND_COLORS = [
  '#C94B3E',
  '#3F3832',
  '#F3EBDA',
] as const;

const REVERSE = true;

type Phase = 'idle' | 'covering' | 'hold' | 'revealing';

let hostEl: HTMLDivElement | null = null;
let trackEl: HTMLDivElement | null = null;
let phase: Phase = 'idle';
let routeAtStart = '';
let pendingHref: string | null = null;
let navigateTo: ((href: string) => void) | null = null;
let bands: HTMLDivElement[] = [];
let failsafeTimer: ReturnType<typeof setTimeout> | null = null;
let sliceDoneTimer: ReturnType<typeof setTimeout> | null = null;
let sliceGen = 0;
let clickBound = false;
let viewportBound = false;
let tapStart: { x: number; y: number; anchor: HTMLAnchorElement } | null = null;

function syncHostToViewport() {
  if (!hostEl) return;
  hostEl.style.position = 'fixed';
  hostEl.style.left = '0';
  hostEl.style.top = '0';
  hostEl.style.right = '0';
  hostEl.style.bottom = '0';
  hostEl.style.width = 'auto';
  hostEl.style.height = 'auto';
  hostEl.style.margin = '0';
  hostEl.style.inset = '0';
}

function onViewportChange() {
  if (phase === 'idle') return;
  syncHostToViewport();
}

function bindViewport() {
  if (viewportBound) return;
  viewportBound = true;
  window.visualViewport?.addEventListener('resize', onViewportChange);
  window.visualViewport?.addEventListener('scroll', onViewportChange);
  window.addEventListener('orientationchange', onViewportChange);
}

function eventElement(target: EventTarget | null): Element | null {
  if (target instanceof Element) return target;
  if (target instanceof Node) return target.parentElement;
  return null;
}

function ensureHost(): HTMLDivElement {
  const existing = document.getElementById('page-switch-slice');
  if (existing instanceof HTMLDivElement) {
    hostEl = existing;
    trackEl = existing.querySelector('.page-switch__track');
    bindViewport();
    return existing;
  }

  const host = document.createElement('div');
  host.id = 'page-switch-slice';
  host.className = 'page-switch';
  host.setAttribute('aria-hidden', 'true');
  host.style.pointerEvents = 'none';

  const track = document.createElement('div');
  track.className = 'page-switch__track';
  host.appendChild(track);

  document.documentElement.appendChild(host);
  hostEl = host;
  trackEl = track;
  bindViewport();
  return host;
}

function currentRouteKey(): string {
  return `${window.location.pathname}${window.location.search}`;
}

function hrefFromAnchor(anchor: HTMLAnchorElement): string | null {
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

function afterPaint(fn: () => void) {
  requestAnimationFrame(() => {
    requestAnimationFrame(fn);
  });
}

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

function isFinePointer(): boolean {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

function lockScroll() {
  document.documentElement.classList.add('page-switching');
  if (!isFinePointer()) return;
  window.addEventListener('wheel', blockScrollEvent, { passive: false, capture: true });
  window.addEventListener('keydown', blockScrollKey, { capture: true });
}

function unlockScroll() {
  document.documentElement.classList.remove('page-switching');
  window.removeEventListener('wheel', blockScrollEvent, { capture: true } as EventListenerOptions);
  window.removeEventListener('keydown', blockScrollKey, { capture: true } as EventListenerOptions);
}

function cancelSlice() {
  sliceGen += 1;
  if (sliceDoneTimer) {
    clearTimeout(sliceDoneTimer);
    sliceDoneTimer = null;
  }
}

function hideHost() {
  cancelSlice();
  if (hostEl?.parentNode) {
    hostEl.parentNode.removeChild(hostEl);
  }
  hostEl = null;
  trackEl = null;
  bands = [];
  unlockScroll();
}

function resetIdle() {
  hideHost();
  phase = 'idle';
  pendingHref = null;
}

function clearBandAnimation(band: HTMLDivElement) {
  band.style.removeProperty('animation');
  band.style.removeProperty('animation-delay');
  band.style.removeProperty('-webkit-animation');
  band.style.removeProperty('-webkit-animation-delay');
}

function playSlice(mode: 'cover' | 'reveal', onDone: () => void) {
  const host = hostEl;
  if (!host || !bands.length) {
    onDone();
    return;
  }

  const gen = ++sliceGen;
  host.classList.remove('is-cover', 'is-reveal');
  for (const band of bands) {
    clearBandAnimation(band);
  }
  void host.offsetWidth;

  bands.forEach((band, i) => {
    const delay = `${i * STAGGER}s`;
    band.style.animationDelay = delay;
    band.style.setProperty('-webkit-animation-delay', delay);
  });

  const finished = new Set<EventTarget>();
  const totalMs = (DURATION + STAGGER * (BAND_COUNT - 1)) * 1000 + 80;
  let settled = false;

  const finish = () => {
    if (gen !== sliceGen || settled) return;
    settled = true;
    host.removeEventListener('animationend', onAnim);
    host.removeEventListener('webkitAnimationEnd', onAnim);
    if (sliceDoneTimer) {
      clearTimeout(sliceDoneTimer);
      sliceDoneTimer = null;
    }
    onDone();
  };

  const onAnim = (event: Event) => {
    const target = event.target;
    if (!(target instanceof Element) || !target.classList.contains('page-switch__band')) {
      return;
    }
    finished.add(target);
    if (finished.size >= bands.length) finish();
  };

  host.addEventListener('animationend', onAnim);
  host.addEventListener('webkitAnimationEnd', onAnim);

  if (sliceDoneTimer) clearTimeout(sliceDoneTimer);
  sliceDoneTimer = setTimeout(finish, totalMs);

  host.classList.add(mode === 'cover' ? 'is-cover' : 'is-reveal');
}

function buildBands(): HTMLDivElement[] {
  const host = ensureHost();
  const track = trackEl ?? host;

  host.classList.remove('is-cover', 'is-reveal');
  track.innerHTML = '';
  track.style.flexDirection = 'row';

  const els: HTMLDivElement[] = [];
  for (let i = 0; i < BAND_COUNT; i++) {
    const band = document.createElement('div');
    band.className = 'page-switch__band';
    band.style.background = BAND_COLORS[i % BAND_COLORS.length];
    track.appendChild(band);
    els.push(band);
  }

  const ordered = REVERSE ? [...els].reverse() : els;

  lockScroll();
  syncHostToViewport();
  host.style.display = 'block';
  host.style.visibility = 'visible';
  host.style.pointerEvents = 'none';
  void host.offsetHeight;

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

  if (prefersReducedMotion()) {
    resetIdle();
    return;
  }

  afterPaint(() => {
    if (phase !== 'revealing') return;
    syncHostToViewport();
    playSlice('reveal', () => {
      resetIdle();
    });
  });
}

function onCoverComplete() {
  if (phase !== 'covering') return;

  phase = 'hold';
  commitPendingNav();

  if (currentRouteKey() !== routeAtStart) {
    beginReveal();
  }
}

function beginCover() {
  if (phase !== 'idle') return;

  cancelSlice();
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
    onCoverComplete();
    return;
  }

  afterPaint(() => {
    if (phase !== 'covering') return;
    syncHostToViewport();
    playSlice('cover', onCoverComplete);
  });

  failsafeTimer = setTimeout(() => {
    if (phase === 'covering') onCoverComplete();
    if (phase === 'hold') beginReveal();
  }, FAILSAFE_MS);
}

function onRouteMaybeChanged() {
  if (phase !== 'hold') return;
  if (currentRouteKey() === routeAtStart) return;
  beginReveal();
}

function interceptNav(href: string, event: Event) {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  if (phase !== 'idle') return;

  pendingHref = href;
  beginCover();
}

function onDocumentClick(event: MouseEvent) {
  if (event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const target = eventElement(event.target);
  if (!target) return;
  const anchor = target.closest('a');
  if (!(anchor instanceof HTMLAnchorElement)) return;
  const href = hrefFromAnchor(anchor);
  if (!href) return;
  interceptNav(href, event);
}

function onTouchStart(event: TouchEvent) {
  if (event.touches.length !== 1) {
    tapStart = null;
    return;
  }
  const target = eventElement(event.target);
  const anchor = target?.closest('a');
  if (!(anchor instanceof HTMLAnchorElement)) {
    tapStart = null;
    return;
  }
  const touch = event.touches[0];
  tapStart = { x: touch.clientX, y: touch.clientY, anchor };
}

function onTouchEnd(event: TouchEvent) {
  if (!tapStart) return;
  if (event.touches.length > 0) {
    tapStart = null;
    return;
  }
  const touch = event.changedTouches[0];
  const dx = touch.clientX - tapStart.x;
  const dy = touch.clientY - tapStart.y;
  const anchor = tapStart.anchor;
  tapStart = null;
  if (dx * dx + dy * dy > 16 * 16) return;
  const href = hrefFromAnchor(anchor);
  if (!href) return;
  interceptNav(href, event);
}

function onTouchCancel() {
  tapStart = null;
}

function onPopOrPageShow() {
  if (phase === 'idle') return;
  if (failsafeTimer) clearTimeout(failsafeTimer);
  resetIdle();
}

function bindClick() {
  if (clickBound) return;
  const leftover = document.getElementById('page-switch-slice');
  if (leftover) leftover.remove();
  hostEl = null;
  trackEl = null;
  document.addEventListener('click', onDocumentClick, true);
  document.addEventListener('touchstart', onTouchStart, { capture: true, passive: true });
  document.addEventListener('touchend', onTouchEnd, { capture: true, passive: false });
  document.addEventListener('touchcancel', onTouchCancel, { capture: true, passive: true });
  window.addEventListener('popstate', onPopOrPageShow);
  window.addEventListener('pageshow', onPopOrPageShow);
  clickBound = true;
}

export default function PageSwitch() {
  const pathname = usePathname();
  const router = useRouter();

  useLayoutEffect(() => {
    navigateTo = (href: string) => {
      router.push(href);
    };
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
