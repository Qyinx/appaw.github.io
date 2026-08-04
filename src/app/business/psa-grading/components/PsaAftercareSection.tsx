'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import LocalLink from '@/components/LocalLink';
import Reveal from '@/components/ui/Reveal';
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';
import type { Translations } from '@/i18n/en';

type AftercareCopy = Translations['psaGradingPage']['aftercare'];

type Props = {
  copy: AftercareCopy;
};

export default function PsaAftercareSection({ copy }: Props) {
  const reveal = useRevealOnScroll<HTMLDivElement>({ threshold: 0.08 });

  return (
    <section
      id="aftercare"
      className="scroll-mt-20 border-t border-border-default bg-surface-panel page-blueprint"
      aria-labelledby="aftercare-title"
    >
      <div ref={reveal.ref} className="container-custom py-10 md:py-14 max-w-3xl">
        <Reveal visible={reveal.visible} dir="up" delay={40}>
          <p className="section-label mb-3">{copy.badge}</p>
          <h2 id="aftercare-title" className="font-display text-2xl md:text-3xl font-bold text-text-primary text-balance mb-3">
            {copy.title}
          </h2>
          <p className="text-sm md:text-base text-text-secondary leading-relaxed mb-6">{copy.body}</p>
          <LocalLink href={copy.ctaHref} className="btn btn-secondary min-h-[44px] group">
            <span>{copy.cta}</span>
            <ArrowRight
              className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150"
              aria-hidden="true"
            />
          </LocalLink>
        </Reveal>
      </div>
    </section>
  );
}
