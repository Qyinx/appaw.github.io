'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import LocalLink from '@/components/LocalLink';
import Reveal from '@/components/ui/Reveal';
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';
import type { Translations } from '@/i18n/en';

type TeaserCopy = Translations['psaGradingPage']['advisorTeaser'];

type Props = {
  copy: TeaserCopy;
};

export default function PsaAdvisorTeaser({ copy }: Props) {
  const reveal = useRevealOnScroll<HTMLDivElement>({ threshold: 0.08 });

  return (
    <section
      id="advisor"
      className="scroll-mt-20 border-t border-border-default bg-surface-bg page-blueprint"
      aria-labelledby="advisor-teaser-title"
    >
      <div ref={reveal.ref} className="container-custom py-8 md:py-10">
        <Reveal visible={reveal.visible} dir="up" delay={40}>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
            <div className="max-w-2xl">
              <p className="section-label mb-2">{copy.badge}</p>
              <h2
                id="advisor-teaser-title"
                className="font-display text-xl md:text-2xl font-bold text-text-primary text-balance mb-2"
              >
                {copy.title}
              </h2>
              <p className="text-sm md:text-base text-text-secondary leading-relaxed">{copy.body}</p>
            </div>
            <LocalLink
              href="/business/psa-grading/advisor/"
              className="btn btn-secondary group min-h-[44px] shrink-0 self-start md:self-auto"
            >
              <span>{copy.cta}</span>
              <ArrowRight
                className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150"
                aria-hidden="true"
              />
            </LocalLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
