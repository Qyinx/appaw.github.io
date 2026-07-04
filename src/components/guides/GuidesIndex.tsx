'use client';

import React from 'react';
import LocalLink from '@/components/LocalLink';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getAllGuides } from '@/lib/guides/registry';
import Reveal, { MotionStagger } from '@/components/ui/Reveal';
import GuideHeroBackground from '@/components/guides/GuideHeroBackground';
import { useHeroMount, useRevealOnScroll } from '@/hooks/useRevealOnScroll';

const UI = {
  en: {
    badge: 'Collector Guides',
    title: 'Slab Protection & Grading Guides',
    subtitle:
      'Real cert numbers, UV tests, and centering math. Skip the wrong step and you pay for it twice.',
    indexLabel: 'Guide Index',
    articleCount: (n: number) => `${n} articles`,
    read: 'Read guide',
  },
  zh: {
    badge: '收藏指南',
    title: '鑑定卡保護與置中指南',
    subtitle:
      '真實證書編號、UV 實測、置中公式。做錯一步，送鑑費與溢價可能一併損失。',
    indexLabel: '指南索引',
    articleCount: (n: number) => `${n} 篇`,
    read: '閱讀指南',
  },
} as const;

function formatIndex(n: number) {
  return String(n).padStart(2, '0');
}

export default function GuidesIndex() {
  const { language } = useLanguage();
  const locale = language === 'zh' ? 'zh' : 'en';
  const guides = getAllGuides(locale);
  const ui = UI[locale];
  const heroMounted = useHeroMount();
  const listReveal = useRevealOnScroll<HTMLElement>();

  return (
    <div className="flex flex-col bg-surface-bg">
      <section className="relative min-h-[45vh] flex items-center overflow-hidden bg-surface-bg pt-20 border-b border-border-default page-blueprint hero-bg-slab">
        <GuideHeroBackground src="/images/background/background.png" />
        <div className="container-custom relative z-[2] max-w-[1080px] py-20">
          <MotionStagger visible={heroMounted} className="max-w-2xl">
            <p className="section-label mb-8 motion-stagger-item">{ui.badge}</p>
            <h1 className="motion-stagger-item text-4xl md:text-5xl font-display font-bold leading-tight text-text-primary mb-6">
              {ui.title}
            </h1>
            <div className="motion-stagger-item w-12 h-px bg-accent-brand mb-7" aria-hidden="true" />
            <p className="motion-stagger-item text-text-secondary text-lg leading-relaxed">{ui.subtitle}</p>
          </MotionStagger>
        </div>
      </section>

      <section ref={listReveal.ref} className="section-padding border-b border-border-default" aria-labelledby="guides-index-heading">
        <div className="container-custom max-w-[1080px]">
          <div className="guides-index panel overflow-hidden">
            <div className="guides-index__header">
              <h2 id="guides-index-heading" className="guides-index__heading">
                {ui.indexLabel}
              </h2>
              <span className="guides-index__count">{ui.articleCount(guides.length)}</span>
            </div>

            <ul className="guides-index__list">
              {guides.map((guide, i) => {
                const keySpec = guide.heroSpecs[0];

                return (
                  <Reveal
                    key={guide.slug}
                    as="li"
                    visible={listReveal.visible}
                    dir="up"
                    delay={i * 40}
                    className="guides-index__item"
                  >
                    <LocalLink
                      href={`/guides/${guide.slug}/`}
                      className="guides-index__row"
                      aria-label={`${ui.read}: ${guide.title}`}
                    >
                      <span className="guides-index__index" aria-hidden="true">
                        {formatIndex(i + 1)}
                      </span>

                      <div className="guides-index__body">
                        <span className="guides-index__badge">{guide.badge}</span>
                        <h3 className="guides-index__title">{guide.title}</h3>
                        <p className="guides-index__desc">{guide.lead}</p>
                        {keySpec ? (
                          <div className="guides-index__spec" aria-hidden="true">
                            <span className="guides-index__spec-label">{keySpec.label}</span>
                            <span className="guides-index__spec-value">{keySpec.value}</span>
                          </div>
                        ) : null}
                      </div>

                      <div className="guides-index__meta">
                        <span className="guides-index__read-time font-tabular">{guide.readTime}</span>
                        <ArrowRight className="guides-index__arrow" aria-hidden="true" />
                      </div>
                    </LocalLink>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
