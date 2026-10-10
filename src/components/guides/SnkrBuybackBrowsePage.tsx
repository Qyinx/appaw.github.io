'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import LocalLink from '@/components/LocalLink';
import SnkrBuybackGallery from '@/components/guides/SnkrBuybackGallery';
import { useLanguage } from '@/context/LanguageContext';
import { useSubHeader } from '@/hooks/useSubHeader';
import type { GuideLocale } from '@/lib/guides/types';

const UI = {
  en: {
    back: 'SNKR buyback reference',
    badge: 'SNKR buyback reference',
    title: 'Browse cards',
    lead: 'Each card shows its latest posted buyback price. These amounts are not Appaw Store or 138 Arena purchase offers.',
  },
  zh: {
    back: 'SNKR回收價參考',
    badge: 'SNKR回收價參考',
    title: '瀏覽卡牌',
    lead: '每張卡片顯示最近一則公布的買取參考價，並非 Appaw Store 或 138 Arena 的收卡價格。',
  },
} as const;

export default function SnkrBuybackBrowsePage() {
  const { language } = useLanguage();
  const locale: GuideLocale = language === 'zh' ? 'zh' : 'en';
  const ui = UI[locale];

  useSubHeader({
    contentWidth: 'guide',
    content: (
      <div className="flex min-w-0 items-center gap-3">
        <LocalLink
          href="/guides/psa-market-buyback-snkr/"
          className="inline-flex shrink-0 items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors duration-150 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{ui.back}</span>
        </LocalLink>
        <p className="min-w-0 truncate text-sm font-semibold text-text-primary">{ui.title}</p>
      </div>
    ),
  });

  return (
    <article className="flex flex-col bg-surface-bg">
      <header className="border-b border-border-default pt-20 pb-10">
        <div className="container-custom">
          <LocalLink
            href="/guides/psa-market-buyback-snkr/"
            className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{ui.back}</span>
          </LocalLink>
          <p className="section-label mb-6">{ui.badge}</p>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-text-primary leading-tight mb-4 text-balance">
            {ui.title}
          </h1>
          <p className="text-text-secondary text-lg md:text-xl leading-relaxed max-w-2xl">{ui.lead}</p>
        </div>
      </header>
      <div className="section-padding">
        <div className="container-custom">
          <SnkrBuybackGallery />
        </div>
      </div>
    </article>
  );
}
