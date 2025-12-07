'use client';

import React, { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const COOKIE_CONSENT_KEY = 'appaw-cookie-consent';

export function CookieConsent() {
  const { t } = useLanguage();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted/declined
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setShowBanner(false);
    
    // Enable Google Analytics if user accepts
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setShowBanner(false);
    
    // Disable Google Analytics if user declines
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'denied',
      });
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="bg-white border-t-2 border-primary-500 shadow-2xl">
        <div className="container-custom py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Content */}
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Cookie className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-neutral-900 mb-1">
                  {t.cookieConsent?.title || 'Cookie Notice'}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {t.cookieConsent?.message || 
                    'We use cookies and analytics to improve your experience and understand how you use our site. By clicking "Accept", you agree to our use of cookies and analytics services.'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleDecline}
                className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-800 transition-colors"
                aria-label="Decline cookies"
              >
                {t.cookieConsent?.decline || 'Decline'}
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 sm:flex-none px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:scale-105"
                aria-label="Accept cookies"
              >
                {t.cookieConsent?.accept || 'Accept'}
              </button>
              <button
                onClick={handleDecline}
                className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors sm:hidden"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
