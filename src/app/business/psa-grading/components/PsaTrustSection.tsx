'use client';

import React from 'react';
import { Eye, MapPin, Search } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';
import type { Translations } from '@/i18n/en';

type TrustCopy = Translations['psaGradingPage']['trust'];

type Props = {
  copy: TrustCopy;
};

const ICONS = [MapPin, Search, Eye] as const;

export default function PsaTrustSection({ copy }: Props) {
  const reveal = useRevealOnScroll<HTMLDivElement>({ threshold: 0.08 });

  return (
    <section
      id="trust"
      className="scroll-mt-20 border-t border-border-default bg-surface-bg"
      aria-labelledby="trust-title"
    >
      <div ref={reveal.ref} className="container-custom py-10 md:py-14">
        <Reveal visible={reveal.visible} dir="up" delay={40}>
          <p className="section-label mb-3">{copy.badge}</p>
          <h2 id="trust-title" className="font-display text-2xl md:text-3xl font-bold text-text-primary text-balance mb-3">
            {copy.title}
          </h2>
          <p className="text-sm md:text-base text-text-secondary leading-relaxed max-w-3xl mb-8 md:mb-10">
            {copy.lead}
          </p>
          <ul className="grid gap-6 md:grid-cols-3 mb-8">
            {copy.items.map((item, index) => {
              const Icon = ICONS[index] ?? Eye;
              return (
                <li key={item.title} className="space-y-3">
                  <Icon className="w-5 h-5 text-accent-secondary" aria-hidden="true" />
                  <h3 className="font-display font-semibold text-text-primary">{item.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{item.body}</p>
                </li>
              );
            })}
          </ul>
          <a
            href={copy.igHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-secondary hover:underline min-h-[44px] inline-flex items-center text-sm"
          >
            {copy.igLabel}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
