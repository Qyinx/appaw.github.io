'use client';

import React from 'react';
import { CalendarDays, ExternalLink, MapPin } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';
import {
  PSA_DROP_OFF_MAPS_URL,
  PSA_SUBMISSION_APPOINTMENT_URL,
  PSA_SUBMISSION_WHATSAPP_URL,
} from '@/lib/grading/psa-booking';
import type { Translations } from '@/i18n/en';

type Props = {
  copy: Translations['psaGradingPage']['bookSection'];
  dropOffAddress: string;
  hoursNote: string;
};

export default function PsaGradingBookSection({ copy, dropOffAddress, hoursNote }: Props) {
  const sectionRef = useRevealOnScroll<HTMLElement>({ threshold: 0.08 });

  return (
    <section
      id="book"
      ref={sectionRef.ref}
      className="scroll-mt-20 border-t border-border-default bg-surface-bg"
      aria-labelledby="book-section-title"
    >
      <div className="container-custom py-10 md:py-14">
        <Reveal visible={sectionRef.visible} dir="up">
            <p className="section-label mb-3">{copy.badge}</p>
            <h2 id="book-section-title" className="font-display text-2xl md:text-3xl font-bold text-text-primary mb-8">
              {copy.title}
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="panel-raised p-6 space-y-5">
                <h3 className="font-display font-semibold text-text-primary">{copy.checklistTitle}</h3>
                <ol className="space-y-4 text-sm text-text-secondary leading-relaxed list-decimal list-inside">
                  {copy.checklistItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </div>

              <div className="panel p-6 flex flex-col gap-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-text-primary">
                    <MapPin className="w-4 h-4 text-accent-secondary shrink-0" aria-hidden="true" />
                    <h3 className="font-display font-semibold">{copy.locationTitle}</h3>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">{dropOffAddress}</p>
                  <p className="text-xs text-text-muted">{hoursNote}</p>
                </div>

                <a
                  href={PSA_DROP_OFF_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-accent-secondary hover:underline min-h-[44px]"
                >
                  <span>{copy.directionsLink}</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>

                <a
                  href={PSA_SUBMISSION_APPOINTMENT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary min-h-[44px] mt-auto"
                >
                  <CalendarDays className="w-4 h-4" aria-hidden="true" />
                  <span>{copy.ctaBook}</span>
                </a>

                <p className="text-xs text-text-muted">
                  {copy.questionsPrefix}{' '}
                  <a
                    href={PSA_SUBMISSION_WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-secondary hover:underline"
                  >
                    {copy.questionsWhatsApp}
                  </a>
                </p>
              </div>
            </div>
        </Reveal>
      </div>
    </section>
  );
}
