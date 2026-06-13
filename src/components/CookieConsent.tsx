'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import LocalLink from '@/components/LocalLink';

const COOKIE_CONSENT_KEY = 'appaw-cookie-consent';

export function CookieConsent() {
  const { t } = useLanguage();
  const [showBanner, setShowBanner] = useState(false);

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
      className="cookie-notice"
      role="dialog"
      aria-labelledby="cookie-notice-title"
      aria-live="polite"
    >
      <div className="cookie-notice__bar">
        <div className="cookie-notice__inner">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 min-w-0">
            <p
              id="cookie-notice-title"
              className="flex-1 min-w-0 text-sm text-text-secondary leading-snug text-pretty"
            >
              {copy.message}{' '}
              <LocalLink
                href="/privacy/"
                className="text-accent-link hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-link whitespace-nowrap"
              >
                {copy.privacyLink}
              </LocalLink>
            </p>

            <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleDecline}
                className="btn btn-ghost flex-1 sm:flex-none min-h-11 px-3 text-sm"
              >
                {copy.decline}
              </button>
              <button
                type="button"
                onClick={handleAccept}
                className="btn btn-primary flex-1 sm:flex-none min-h-11 px-4 text-sm"
              >
                {copy.accept}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
