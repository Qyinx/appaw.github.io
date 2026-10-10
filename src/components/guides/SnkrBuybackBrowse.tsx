'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import SnkrBuybackGallery from '@/components/guides/SnkrBuybackGallery';
import SnkrBuybackPrices from '@/components/guides/SnkrBuybackPrices';

const UI = {
  en: { rows: 'All price rows' },
  zh: { rows: '全部文字價列' },
} as const;

export default function SnkrBuybackBrowse() {
  const { language } = useLanguage();
  const ui = language === 'zh' ? UI.zh : UI.en;

  return (
    <div className="mt-6 space-y-8">
      <SnkrBuybackGallery />
      <details className="panel">
        <summary className="flex min-h-11 cursor-pointer list-none items-center px-4 py-3 text-sm font-semibold text-text-primary marker:content-none [&::-webkit-details-marker]:hidden">
          {ui.rows}
        </summary>
        <div className="border-t border-border-default px-4 pb-4">
          <SnkrBuybackPrices />
        </div>
      </details>
    </div>
  );
}
