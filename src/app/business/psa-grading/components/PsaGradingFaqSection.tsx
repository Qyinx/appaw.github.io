'use client';

import React, { useMemo } from 'react';
import LocalLink from '@/components/LocalLink';
import { CalendarDays, ChevronDown } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';
import {
  PSA_SUBMISSION_APPOINTMENT_URL,
  PSA_SUBMISSION_WHATSAPP_URL,
} from '@/lib/grading/psa-booking';
import { countPsaFaqItems } from '@/lib/grading/psa-faq-types';
import type { Translations } from '@/i18n/en';
import PsaFaqAnswer from './PsaFaqAnswer';

type Props = {
  copy: Translations['psaGradingPage'];
};

export default function PsaGradingFaqSection({ copy }: Props) {
  const sectionRef = useRevealOnScroll<HTMLDivElement>({ threshold: 0.08 });
  const faqCount = countPsaFaqItems(copy.faq.groups);

  const globalIndexByKey = useMemo(() => {
    const map = new Map<string, number>();
    let index = 0;
    for (const group of copy.faq.groups) {
      for (const item of group.items) {
        map.set(`${group.id}:${item.q}`, index);
        index += 1;
      }
    }
    return map;
  }, [copy.faq.groups]);

  return (
    <div ref={sectionRef.ref} className="psa-grading-faq" aria-labelledby="psa-faq-heading">
      <div className="grid lg:grid-cols-[5fr_7fr] gap-12 xl:gap-16 items-start">
          <Reveal visible={sectionRef.visible} dir="left" className="lg:sticky lg:top-28 space-y-8">
            <div>
              <p className="section-label mb-3">{copy.faq.badge}</p>
              <h2 id="psa-faq-heading" className="font-display text-2xl md:text-3xl font-bold text-text-primary text-balance mb-3">
                {copy.faq.title}
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">{copy.faq.subtitle}</p>
            </div>

            <div className="guide-faq__stat" aria-hidden="true">
              <span className="guide-faq__stat-num">{faqCount}</span>
              <span className="guide-faq__stat-label">{copy.faq.statLabel}</span>
            </div>

            <div className="panel p-5 space-y-3">
              <h3 className="font-mono text-xs uppercase tracking-wide text-text-muted">{copy.faq.quickLinks.title}</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href={PSA_SUBMISSION_APPOINTMENT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-secondary hover:underline min-h-[44px] inline-flex items-center"
                  >
                    {copy.faq.quickLinks.book}
                  </a>
                </li>
                <li>
                  <LocalLink href="/business/psa-grading/track" className="text-accent-secondary hover:underline min-h-[44px] inline-flex items-center">
                    {copy.faq.quickLinks.track}
                  </LocalLink>
                </li>
                <li>
                  <a href="#pricing" className="text-accent-secondary hover:underline min-h-[44px] inline-flex items-center">
                    {copy.faq.quickLinks.pricing}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-display font-semibold text-text-primary mb-3">{copy.relatedReading.title}</h3>
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
          </Reveal>

          <Reveal visible={sectionRef.visible} dir="right" delay={80} className="min-w-0">
            <div className="space-y-8">
              {copy.faq.groups.map((group) => (
                <div key={group.id} className="psa-grading-faq__group">
                  <p className="psa-grading-faq__group-label">{group.label}</p>
                  <div className="guide-faq__list divide-y divide-border-default border border-border-default">
                    {group.items.map((item) => {
                      const globalIndex = globalIndexByKey.get(`${group.id}:${item.q}`) ?? 0;
                      const isFirst = globalIndex === 0;
                      const withProtectorLink = group.id === 'fees' && typeof item.a !== 'string';

                      return (
                        <details
                          key={item.q}
                          className="guide-faq__item group bg-surface-panel"
                          open={isFirst}
                        >
                          <summary className="guide-faq__summary">
                            <span className="guide-faq__index">{String(globalIndex + 1).padStart(2, '0')}</span>
                            <span className="guide-faq__question">{item.q}</span>
                            <span className="guide-faq__chevron-wrap" aria-hidden="true">
                              <ChevronDown className="guide-faq__chevron" strokeWidth={2.5} />
                            </span>
                          </summary>
                          <div className="guide-faq__answer-wrap">
                            <div className="guide-faq__answer-inner">
                              <div className="guide-faq__answer-rail" aria-hidden="true" />
                              <PsaFaqAnswer
                                answer={item.a}
                                isAeo={isFirst}
                                withProtectorLink={withProtectorLink}
                              />
                            </div>
                          </div>
                        </details>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="panel-raised mt-10 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <CalendarDays className="w-6 h-6 text-accent-secondary shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="font-display font-bold text-text-primary">{copy.cta.title}</h3>
              <p className="text-sm text-text-secondary mt-1 leading-relaxed">{copy.cta.body}</p>
              <p className="text-xs text-text-muted mt-2">
                {copy.cta.questionsPrefix}{' '}
                <a
                  href={PSA_SUBMISSION_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-secondary hover:underline"
                >
                  {copy.cta.questionsWhatsApp}
                </a>
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href={PSA_SUBMISSION_APPOINTMENT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary min-h-[44px]"
            >
              <CalendarDays className="w-4 h-4" aria-hidden="true" />
              <span>{copy.cta.book}</span>
            </a>
            <LocalLink href="/guides/psa-grading-standards/" className="btn btn-secondary min-h-[44px]">
              {copy.cta.guide}
            </LocalLink>
          </div>
        </div>
    </div>
  );
}
