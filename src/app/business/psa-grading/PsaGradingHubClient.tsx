'use client';

import React, { useState } from 'react';
import LocalLink from '@/components/LocalLink';
import {
  ArrowRight, Package, Truck, Award, Shield, ChevronDown,
  Search, MessageCircle,
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useLanguage } from '@/context/LanguageContext';
import Reveal from '@/components/ui/Reveal';
import PsaGradingHero from './components/PsaGradingHero';
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';

const STEP_ICONS = [Package, Truck, Award, Shield];

export default function PsaGradingHubClient() {
  const { t } = useLanguage();
  const copy = t.psaGradingPage;
  const howToRef = useRevealOnScroll<HTMLElement>({ threshold: 0.08 });
  const faqRef = useRevealOnScroll<HTMLElement>({ threshold: 0.08 });
  const ctaRef = useRevealOnScroll<HTMLElement>({ threshold: 0.08 });
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="flex flex-col bg-surface-bg">
      <PsaGradingHero
        badge={copy.badge}
        title={copy.hero.title}
        subtitle={copy.hero.definition}
      >
        <LocalLink href="/business/psa-grading/track" className="btn btn-primary group min-h-[44px]">
          <Search className="w-4 h-4" aria-hidden="true" />
          <span>{copy.hero.ctaTrack}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" aria-hidden="true" />
        </LocalLink>
        <a
          href="https://wa.me/85292851189"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary group min-h-[44px]"
        >
          <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4 text-accent-success" />
          <span>{copy.hero.ctaContact}</span>
        </a>
      </PsaGradingHero>

      <section ref={howToRef.ref} className="section-padding border-t border-border-default">
        <div className="container-custom">
          <Reveal visible={howToRef.visible} dir="up">
            <p className="section-label mb-4">{copy.howTo.badge}</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-4">
              {copy.howTo.title}
            </h2>
            <p className="text-text-secondary max-w-2xl mb-12 leading-relaxed">{copy.howTo.subtitle}</p>
          </Reveal>

          <ol className="grid md:grid-cols-2 gap-6 max-w-4xl">
            {copy.howTo.steps.map((step, index) => {
              const Icon = STEP_ICONS[index] ?? Package;
              return (
                <Reveal key={step.title} visible={howToRef.visible} dir="up" delay={index * 60}>
                  <li className="list-none border border-border-default bg-surface-panel p-6 h-full">
                    <div className="flex items-start gap-4">
                      <span className="flex items-center justify-center w-10 h-10 shrink-0 border border-accent-brand/30 text-accent-brand font-mono text-sm">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <Icon className="w-5 h-5 text-accent-brand mb-3" aria-hidden="true" />
                        <h3 className="font-semibold text-text-primary mb-2">{step.title}</h3>
                        <p className="text-sm text-text-secondary leading-relaxed">{step.body}</p>
                      </div>
                    </div>
                  </li>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </section>

      <section ref={faqRef.ref} className="section-padding border-t border-border-default bg-surface-raised/50">
        <div className="container-custom max-w-3xl">
          <Reveal visible={faqRef.visible} dir="up">
            <p className="section-label mb-4">{copy.faq.badge}</p>
            <h2 className="text-3xl font-display font-bold text-text-primary mb-8">{copy.faq.title}</h2>
          </Reveal>

          <div className="space-y-2">
            {copy.faq.items.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <Reveal key={item.q} visible={faqRef.visible} dir="up" delay={index * 40}>
                  <div className="border border-border-default bg-surface-panel">
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
                      className="px-5 pb-4 text-sm text-text-secondary leading-relaxed border-t border-border-default pt-4"
                    >
                      {item.a}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section ref={ctaRef.ref} className="section-padding border-t border-border-default">
        <div className="container-custom">
          <Reveal visible={ctaRef.visible} dir="up">
            <div className="border border-border-default bg-surface-panel p-8 md:p-12 max-w-3xl mx-auto text-center">
              <MessageCircle className="w-8 h-8 text-accent-secondary mx-auto mb-4" aria-hidden="true" />
              <h2 className="text-2xl md:text-3xl font-display font-bold text-text-primary mb-3">
                {copy.cta.title}
              </h2>
              <p className="text-text-secondary mb-8 max-w-lg mx-auto leading-relaxed">{copy.cta.body}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <LocalLink href="/business/psa-grading/track" className="btn btn-primary min-h-[44px]">
                  {copy.cta.track}
                </LocalLink>
                <LocalLink href="/guides/psa-grading-standards" className="btn btn-secondary min-h-[44px]">
                  {copy.cta.guide}
                </LocalLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
