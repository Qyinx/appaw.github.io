'use client';

import React, { useRef, useState } from 'react';
import LocalLink from '@/components/LocalLink';
import {
  ChevronDown,
  MessageCircle,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Reveal from '@/components/ui/Reveal';
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';
import { useHowToBackgroundScrub } from '@/hooks/useHowToBackgroundScrub';
import ScrollChapter from '@/components/motion/ScrollChapter';
import ChapterNav from '@/components/motion/ChapterNav';
import PsaPricingTable from './components/PsaPricingTable';
import PsaGradingHowToSection from './components/PsaGradingHowToSection';
import PsaGradingAvailabilityBanner from './components/PsaGradingAvailabilityBanner';
import { PSA_HOW_TO_SCENES } from '@/lib/grading/how-to-scenes';

export default function PsaGradingHubClient() {
  const { t } = useLanguage();
  const copy = t.psaGradingPage;
  const pageRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRevealOnScroll<HTMLDivElement>({ threshold: 0.08 });
  const contextRef = useRevealOnScroll<HTMLDivElement>({ threshold: 0.08 });
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useHowToBackgroundScrub(pageRef, PSA_HOW_TO_SCENES.length);

  const chapterNavItems = [
    { id: 'how-to', label: copy.chapters.howTo },
    { id: 'pricing', label: copy.chapters.pricing },
    { id: 'faq', label: copy.chapters.faq },
  ];

  return (
    <div ref={pageRef} className="psa-grading-hub flex flex-col bg-surface-bg">
      <PsaGradingAvailabilityBanner copy={copy.availability} />

      <div className="chapter-nav-shell">
        <div className="container-custom">
          <ChapterNav items={chapterNavItems} />
        </div>
      </div>

      <PsaGradingHowToSection badge={copy.badge} hero={copy.hero} howTo={copy.howTo} aeo={copy.aeo} />

      <section id="service-context" className="border-t border-border-default bg-surface-panel">
        <div ref={contextRef.ref} className="container-custom py-10 md:py-12">
          <Reveal visible={contextRef.visible} dir="up">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
              <div>
                <h2 className="text-lg font-display font-semibold text-text-primary mb-2">
                  {copy.whoThisIsFor.title}
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed">{copy.whoThisIsFor.body}</p>
              </div>
              <div>
                <h2 className="text-lg font-display font-semibold text-text-primary mb-2">
                  {copy.dropOff.title}
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {copy.dropOffAddress}. {copy.dropOff.hoursNote}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <ScrollChapter
        id="pricing"
        title={copy.pricing.title}
        className="relative overflow-x-clip bg-surface-panel page-blueprint !min-h-0"
      >
        <div ref={pricingRef.ref}>
          <Reveal visible={pricingRef.visible} dir="up" delay={40}>
            <PsaPricingTable copy={copy.pricing} />
          </Reveal>
        </div>
      </ScrollChapter>

      <ScrollChapter id="faq" title={copy.faq.title} className="!min-h-0">
        <div className="panel p-0 overflow-hidden">
            <div className="space-y-0 divide-y divide-border-default">
              {copy.faq.items.map((item, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={item.q}>
                    <button
                      type="button"
                      id={`faq-btn-${index}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${index}`}
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left min-h-[44px] hover:bg-surface-raised/80 transition-colors"
                    >
                      <span className="font-medium text-text-primary pr-4">{item.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 shrink-0 text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </button>
                    <div
                      id={`faq-panel-${index}`}
                      role="region"
                      aria-labelledby={`faq-btn-${index}`}
                      hidden={!isOpen}
                      className={`px-5 pb-4 text-sm text-text-secondary leading-relaxed border-t border-border-default pt-4${index === 0 ? ' guide-aeo-answer' : ''}`}
                    >
                      {item.a}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-5 py-6 border-t border-border-default bg-surface-raised/50">
              <h3 className="font-display font-bold text-text-primary mb-3">{copy.relatedReading.title}</h3>
              <ul className="space-y-2 text-sm">
                {copy.relatedReading.guides.map((link) => (
                  <li key={link.href}>
                    <LocalLink href={link.href} className="text-accent-secondary hover:underline">
                      {link.label}
                    </LocalLink>
                  </li>
                ))}
                <li>
                  <LocalLink href={copy.relatedReading.centering.href} className="text-accent-secondary hover:underline">
                    {copy.relatedReading.centering.label}
                  </LocalLink>
                </li>
                <li>
                  <LocalLink href={copy.relatedReading.protectors.href} className="text-accent-secondary hover:underline">
                    {copy.relatedReading.protectors.label}
                  </LocalLink>
                </li>
              </ul>
            </div>

            <div className="panel-raised m-4 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <MessageCircle className="w-6 h-6 text-accent-secondary shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="font-display font-bold text-text-primary">{copy.cta.title}</h3>
                  <p className="text-sm text-text-secondary mt-1 leading-relaxed">{copy.cta.body}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <LocalLink href="/guides/psa-grading-standards" className="btn btn-primary min-h-[44px]">
                  {copy.cta.guide}
                </LocalLink>
                <a
                  href="https://wa.me/85292851189"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary min-h-[44px]"
                >
                  {copy.hero.ctaContact}
                </a>
              </div>
            </div>
          </div>
      </ScrollChapter>

      <footer className="container-custom py-6 text-xs text-text-muted border-t border-border-default">
        {copy.lastUpdatedLabel}: {copy.lastUpdated}
      </footer>
    </div>
  );
}
