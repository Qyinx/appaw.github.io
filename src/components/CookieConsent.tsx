'use client';

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import LocalLink from '@/components/LocalLink';

const COOKIE_CONSENT_KEY = 'appaw-cookie-consent';
const CLARITY_ID = 'sm2b2ujusi';
const GA_ID = 'G-MTFS1VS5S4';

function loadClarity(): void {
  if (typeof window === 'undefined') return;
  const w = window as Window & { clarity?: (...args: unknown[]) => void };
  if (w.clarity) return;

  const c = w as Window & {
    clarity: ((...args: unknown[]) => void) & { q?: unknown[] };
  };
  c.clarity =
    c.clarity ||
    function (...args: unknown[]) {
      (c.clarity.q = c.clarity.q || []).push(args);
    };
  const t = document.createElement('script');
  t.async = true;
  t.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
  const y = document.getElementsByTagName('script')[0];
  y?.parentNode?.insertBefore(t, y);
}

function loadGoogleAnalytics(): void {
  if (typeof window === 'undefined') return;
  const w = window as Window & {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };
  if (w.gtag) {
    w.gtag('consent', 'update', { analytics_storage: 'granted' });
    return;
  }

  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag(...args: unknown[]) {
    w.dataLayer!.push(args);
  };
  w.gtag('js', new Date());
  w.gtag('consent', 'default', { analytics_storage: 'denied' });
  w.gtag('consent', 'update', { analytics_storage: 'granted' });
  w.gtag('config', GA_ID);

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

function loadAnalyticsSuite(): void {
  loadGoogleAnalytics();
  loadClarity();
}

export function CookieConsent() {
  const { t } = useLanguage();
  const [showBanner, setShowBanner] = useState(false);
  const noticeRef = useRef<HTMLDivElement>(null);

  const copy = t.cookieConsent;

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (consent === 'accepted') {
      const schedule =
        typeof window.requestIdleCallback === 'function'
          ? (cb: () => void) => window.requestIdleCallback(cb, { timeout: 4000 })
          : (cb: () => void) => window.setTimeout(cb, 2000);
      schedule(() => loadAnalyticsSuite());
      return;
    }
    if (!consent) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  useLayoutEffect(() => {
    const root = document.documentElement;

    if (!showBanner) {
      root.classList.remove('cookie-notice-visible');
      root.style.removeProperty('--cookie-notice-offset');
      return;
    }

    root.classList.add('cookie-notice-visible');

    const el = noticeRef.current;
    if (!el) return;

    const syncOffset = () => {
      const next = `${el.offsetHeight}px`;
      if (root.style.getPropertyValue('--cookie-notice-offset') !== next) {
        root.style.setProperty('--cookie-notice-offset', next);
      }
    };

    syncOffset();
    const observer = new ResizeObserver(syncOffset);
    observer.observe(el);

    return () => {
      observer.disconnect();
      root.classList.remove('cookie-notice-visible');
      root.style.removeProperty('--cookie-notice-offset');
    };
  }, [showBanner]);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setShowBanner(false);
    loadAnalyticsSuite();
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      ref={noticeRef}
      className="cookie-notice"
      role="dialog"
      aria-labelledby="cookie-notice-title"
      aria-live="polite"
    >
      <div className="cookie-notice__bar">
        <div className="cookie-notice__inner">
          <p
            id="cookie-notice-title"
            className="cookie-notice__copy"
          >
            {copy.message}{' '}
            <LocalLink
              href="/privacy/"
              className="text-accent-link hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-link whitespace-nowrap"
            >
              {copy.privacyLink}
            </LocalLink>
          </p>

          <div className="cookie-notice__actions">
            <button
              type="button"
              onClick={handleDecline}
              className="btn btn-secondary cookie-notice__btn cookie-notice__btn--decline"
            >
              {copy.decline}
            </button>
            <button
              type="button"
              onClick={handleAccept}
              className="btn btn-primary cookie-notice__btn"
            >
              {copy.accept}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
