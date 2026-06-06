'use client';

import React, { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const COOKIE_CONSENT_KEY = 'appaw-cookie-consent';

export function CookieConsent() {
  const { t } = useLanguage();
  const [showBanner, setShowBanner] = useState(false);

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
      className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up pb-[env(safe-area-inset-bottom)]"
      role="dialog"
      aria-label={t.cookieConsent?.title || 'Cookie Notice'}
    >
      <div className="panel border-t-2 border-accent-brand shadow-[var(--shadow-panel)]">
        <div className="container-custom py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 min-w-0">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-11 h-11 bg-accent-brand/15 border border-accent-brand/30 flex items-center justify-center flex-shrink-0">
                <Cookie className="w-5 h-5 text-accent-brand" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-text-primary mb-1">
                  {t.cookieConsent?.title || 'Cookie Notice'}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {t.cookieConsent?.message ||
                    'We use cookies and analytics to improve your experience and understand how you use our site. By clicking "Accept", you agree to our use of cookies and analytics services.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto flex-shrink-0">
              <button
                type="button"
                onClick={handleDecline}
                className="btn btn-ghost flex-1 sm:flex-none min-h-11 px-4 py-2 text-sm"
                aria-label="Decline cookies"
              >
                {t.cookieConsent?.decline || 'Decline'}
              </button>
              <button
                type="button"
                onClick={handleAccept}
                className="btn btn-primary flex-1 sm:flex-none min-h-11 px-6 py-2 text-sm"
                aria-label="Accept cookies"
              >
                {t.cookieConsent?.accept || 'Accept'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
