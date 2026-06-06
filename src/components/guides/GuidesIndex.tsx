'use client';

import React from 'react';
import LocalLink from '@/components/LocalLink';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getAllGuides } from '@/lib/guides/registry';
import Reveal, { MotionStagger } from '@/components/ui/Reveal';
import { useHeroMount, useRevealOnScroll } from '@/hooks/useRevealOnScroll';

const UI = {
  en: {
    badge: 'Collector Guides',
    title: 'Slab Protection & Grading Guides',
    subtitle:
      'Evergreen how-to articles on 35PT cases, UV storage, PSA 10 centering, and when to grade vs protect. Written for Hong Kong and worldwide TCG collectors.',
    read: 'Read guide',
  },
  zh: {
    badge: '收藏指南',
    title: '鑑定卡保護與置中指南',
    subtitle:
      '關於35PT卡盒、UV保存、PSA 10卡牌居中以及何時評級何時保護等實用技巧文章，常青推薦。專為香港及全球集換式卡牌遊戲收藏家撰寫。',
    read: '閱讀指南',
  },
} as const;

export default function GuidesIndex() {
  const { language } = useLanguage();
  const locale = language === 'zh' ? 'zh' : 'en';
  const guides = getAllGuides(locale);
  const ui = UI[locale];
  const heroMounted = useHeroMount();
  const listReveal = useRevealOnScroll<HTMLElement>();

  return (
    <div className="flex flex-col bg-surface-bg">
      <section className="relative min-h-[45vh] flex items-center overflow-hidden bg-surface-bg pt-20 border-b border-border-default page-blueprint">
        <div className="container-custom max-w-[1080px] py-20">
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

      <section ref={listReveal.ref} className="section-padding border-b border-border-default">
        <div className="container-custom max-w-[1080px]">
          <ul className="grid sm:grid-cols-2 gap-px bg-border-default border border-border-default">
            {guides.map((guide, i) => (
              <li key={guide.slug}>
                <Reveal visible={listReveal.visible} dir="up" delay={i * 40}>
                  <LocalLink
                    href={`/guides/${guide.slug}/`}
                    className="block bg-surface-panel p-8 h-full hover:border-accent-brand border border-transparent transition-colors duration-150 group"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-3">{guide.badge}</p>
                    <h2 className="text-lg font-bold text-text-primary mb-3 group-hover:text-accent-brand transition-colors duration-150">
                      {guide.title}
                    </h2>
                    <p className="text-text-secondary text-sm leading-relaxed mb-5">{guide.description}</p>
                    <span className="inline-flex items-center gap-2 text-sm text-accent-link font-semibold">
                      {ui.read}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-150" aria-hidden="true" />
                    </span>
                  </LocalLink>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
