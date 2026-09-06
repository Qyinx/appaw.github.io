'use client';

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import LocalLink from '@/components/LocalLink';

const COOKIE_CONSENT_KEY = 'appaw-cookie-consent';

export function CookieConsent() {
  const { t } = useLanguage();
  const [showBanner, setShowBanner] = useState(false);
  const noticeRef = useRef<HTMLDivElement>(null);

  const copy = t.cookieConsent;

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
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

    if (typeof window !== 'undefined' && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setShowBanner(false);

    if (typeof window !== 'undefined' && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('consent', 'update', {
        analytics_storage: 'denied',
      });
    }
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