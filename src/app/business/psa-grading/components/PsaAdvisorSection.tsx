'use client';

import React from 'react';
import { Gauge, ShieldAlert, Microscope } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';
import type { Translations } from '@/i18n/en';

type AdvisorCopy = Translations['psaGradingPage']['advisor'];

type Props = {
  copy: AdvisorCopy;
  /** When page hero already carried badge/title/lead */
  omitHeader?: boolean;
};

const ICONS = [Microscope, ShieldAlert, Gauge] as const;

export default function PsaAdvisorSection({ copy, omitHeader = false }: Props) {
  const reveal = useRevealOnScroll<HTMLDivElement>({ threshold: 0.08 });

  return (
    <section
      id="advisor"
      className="scroll-mt-20 border-t border-border-default bg-surface-panel page-blueprint"
      aria-labelledby={omitHeader ? undefined : 'advisor-title'}
      aria-label={omitHeader ? copy.title : undefined}
    >
      <div ref={reveal.ref} className="container-custom py-10 md:py-14">
        <Reveal visible={reveal.visible} dir="up" delay={40}>
          {omitHeader ? null : (
            <>
              <p className="section-label mb-3">{copy.badge}</p>
              <h2
                id="advisor-title"
                className="font-display text-2xl md:text-3xl font-bold text-text-primary text-balance mb-3"
              >
                {copy.title}
              </h2>
              <p className="text-sm md:text-base text-text-secondary leading-relaxed max-w-3xl mb-8 md:mb-10">
                {copy.lead}
              </p>
            </>
          )}
          <ul className="grid gap-6 md:grid-cols-3">
            {copy.items.map((item, index) => {
              const Icon = ICONS[index] ?? Microscope;
              return (
                <li key={item.title} className="space-y-3">
                  <Icon className="w-5 h-5 text-accent-brand" aria-hidden="true" />
                  <h3 className="font-display font-semibold text-text-primary">{item.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{item.body}</p>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
