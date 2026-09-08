'use client';

import { useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const TRUSTPILOT_REVIEW_URL = 'https://www.trustpilot.com/review/appaw.store';
const TEMPLATE_ID = '56278e9abfbbba0bdcd568bc';
const BUSINESS_UNIT_ID = '6aa023bb843f7bc64375c165';
const WIDGET_TOKEN = 'd2984a6c-36bd-4b33-9e56-e41b6403d8f7';

type TrustpilotApi = {
  loadFromElement: (element: HTMLElement, force?: boolean) => void;
};

declare global {
  interface Window {
    Trustpilot?: TrustpilotApi;
  }
}

type Props = {
  className?: string;
  /** When false, skip load (e.g. closed sheet). Default true. */
  active?: boolean;
  /** Full TrustBox widget, or compact header link. */
  variant?: 'widget' | 'compact';
  /** Label for compact link (required for compact). */
  compactLabel?: string;
};

export default function TrustpilotReviewCollector({
  className,
  active = true,
  variant = 'widget',
  compactLabel = 'Trustpilot',
}: Props) {
  const { language } = useLanguage();
  const widgetRef = useRef<HTMLDivElement>(null);
  const locale = language === 'zh' ? 'zh-CN' : 'en-US';

  useEffect(() => {
    if (variant !== 'widget' || !active) return;
    const el = widgetRef.current;
    if (!el) return;

    const load = () => {
      window.Trustpilot?.loadFromElement(el, true);
    };

    load();

    // Bootstrap may arrive after first paint (afterInteractive).
    const id = window.setInterval(() => {
      if (window.Trustpilot) {
        load();
        window.clearInterval(id);
      }
    }, 200);

    const timeout = window.setTimeout(() => window.clearInterval(id), 8000);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(timeout);
    };
  }, [locale, active, variant]);

  if (variant === 'compact') {
    return (
      <a
        href={TRUSTPILOT_REVIEW_URL}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {compactLabel}
      </a>
    );
  }

  return (
    <div className={className}>
      <div
        ref={widgetRef}
        className="trustpilot-widget"
        data-locale={locale}
        data-template-id={TEMPLATE_ID}
        data-businessunit-id={BUSINESS_UNIT_ID}
        data-style-height="52px"
        data-style-width="100%"
        data-token={WIDGET_TOKEN}
      >
        <a href={TRUSTPILOT_REVIEW_URL} target="_blank" rel="noopener noreferrer">
          Trustpilot
        </a>
      </div>
    </div>
  );
}
