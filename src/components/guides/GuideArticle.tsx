'use client';

import React from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import LocalLink from '@/components/LocalLink';
import { useLanguage } from '@/context/LanguageContext';
import { useSubHeader } from '@/hooks/useSubHeader';
import { getGuideContent, getRelatedGuides, type GuideSlug } from '@/lib/guides/registry';
import GuideHero from './GuideHero';
import GuideSpecPanel from './GuideSpecPanel';
import GuideToc from './GuideToc';
import GuideProse from './GuideProse';
import GuideSources from './GuideSources';
import GuideCta from './GuideCta';
import GuideRelated from './GuideRelated';
import GuideFaq from './GuideFaq';

const UI = {
  en: {
    backToGuides: 'Back to Guides',
    specTitle: 'At a Glance',
    toc: 'On This Page',
    sources: 'Sources',
    related: 'Related Guides',
    read: 'Read',
    faq: 'Frequently Asked Questions',
    faqBadge: 'Common Questions',
    faqCount: '{n} questions answered',
    midCtaLabel: 'Next step',
  },
  zh: {
    backToGuides: '返回指南',
    specTitle: '規格摘要',
    toc: '本頁目錄',
    sources: '參考來源',
    related: '相關指南',
    read: '閱讀',
    faq: '常見問答',
    faqBadge: '常見疑問',
    faqCount: '共 {n} 個問題',
    midCtaLabel: '下一步',
  },
} as const;

type GuideArticleProps = {
  slug: GuideSlug;
};

export default function GuideArticle({ slug }: GuideArticleProps) {
  const { language } = useLanguage();
  const locale = language === 'zh' ? 'zh' : 'en';
  const guide = getGuideContent(slug, locale);
  const related = getRelatedGuides(slug, locale);
  const ui = UI[locale];

  useSubHeader({
    leading: (
      <LocalLink
        href="/guides"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors duration-150 min-h-[44px]"
      >
        <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>{ui.backToGuides}</span>
      </LocalLink>
    ),
    center: (
      <h1 className="text-text-primary font-semibold text-xs sm:text-sm truncate">{guide.title}</h1>
    ),
  });

  return (
    <article className="flex flex-col bg-surface-bg">
      <GuideHero
        badge={guide.badge}
        title={guide.title}
        lead={guide.lead}
        readTime={guide.readTime}
        updated={guide.updated}
        heroImage={guide.heroImage}
      />

      <section className="section-padding overflow-x-clip">
        <div className="container-custom max-w-[1080px] min-w-0">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_280px] gap-12 lg:gap-16">
            <div className="min-w-0 space-y-12">
              <GuideSpecPanel rows={guide.heroSpecs} title={ui.specTitle} />
              <div className="lg:hidden">
                <details className="guide-toc-mobile panel">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-text-primary marker:content-none [&::-webkit-details-marker]:hidden">
                    <span className="section-label mb-0">{ui.toc}</span>
                    <ChevronDown className="guide-toc-mobile__chevron h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
                  </summary>
                  <div className="border-t border-border-default px-1 pb-2">
                    <GuideToc
                      sections={guide.sections}
                      label={ui.toc}
                      faqTitle={guide.faq?.length ? ui.faq : undefined}
                      compact
                    />
                  </div>
                </details>
              </div>
              <GuideProse sections={guide.sections} midCta={guide.midCta} midCtaLabel={ui.midCtaLabel} />
              {guide.faq?.length ? (
                <GuideFaq items={guide.faq} title={ui.faq} badge={ui.faqBadge} countLabel={ui.faqCount} />
              ) : null}
              {guide.sources ? <GuideSources sources={guide.sources} label={ui.sources} /> : null}
              <GuideCta cta={guide.cta} />
              <GuideRelated guides={related} title={ui.related} readLabel={ui.read} />
            </div>

            <div className="hidden lg:block">
              <div className="sticky-below-site-chrome">
                <GuideToc sections={guide.sections} label={ui.toc} faqTitle={guide.faq?.length ? ui.faq : undefined} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
