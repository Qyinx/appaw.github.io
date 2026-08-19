'use client';

import React, { useEffect, useState } from 'react';
import LocalLink from '@/components/LocalLink';
import { ArrowRight, CalendarDays, Search } from 'lucide-react';
import { PSA_HOW_TO_SCENES } from '@/lib/grading/how-to-scenes';
import { PSA_SUBMISSION_APPOINTMENT_URL } from '@/lib/grading/psa-booking';
import type { Translations } from '@/i18n/en';
import PsaGradingHowToScrollBackground from './PsaGradingHowToScrollBackground';
import PsaGradingWorkflowTimeline from './PsaGradingWorkflowTimeline';
import PsaBatchProgressBoard from './PsaBatchProgressBoard';

type HowToCopy = Translations['psaGradingPage']['howTo'];
type HeroCopy = Translations['psaGradingPage']['hero'];
type AeoCopy = Translations['psaGradingPage']['aeo'];

type Props = {
  badge: string;
  hero: HeroCopy;
  howTo: HowToCopy;
  aeo?: AeoCopy;
};

export default function PsaGradingHowToSection({ badge, hero, howTo, aeo }: Props) {
  const [scrollLinked, setScrollLinked] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    const sync = () => setScrollLinked(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const heroBlock = (
    <header className="how-to-scroll-section__hero">
      <p className="section-label mb-3">{badge}</p>
      <h1 id="how-to-title" className="how-to-scroll-section__hero-title">
        {hero.title}
      </h1>
      <p className="how-to-scroll-section__hero-definition text-text-secondary leading-relaxed max-w-xl psa-grading-aeo-answer">
        {hero.definition}
      </p>
      {aeo ? (
        <div className="mt-5 max-w-xl">
          <h2 className="text-base md:text-lg font-display font-semibold text-text-primary mb-2">
            {aeo.title}
          </h2>
          <p className="text-sm md:text-base text-text-secondary leading-relaxed psa-grading-aeo-answer">
            {aeo.answer}
          </p>
        </div>
      ) : null}
      <div className="flex flex-wrap gap-3 mt-4">
        <a
          href={PSA_SUBMISSION_APPOINTMENT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary group min-h-[44px]"
        >
          <CalendarDays className="w-4 h-4" aria-hidden="true" />
          <span>{hero.ctaBook}</span>
        </a>
        <LocalLink href="/business/psa-grading/track" className="btn btn-secondary group min-h-[44px]">
          <Search className="w-4 h-4" aria-hidden="true" />
          <span>{hero.ctaTrack}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" aria-hidden="true" />
        </LocalLink>
      </div>
    </header>
  );

  return (
    <section
      id="how-to"
      className={`how-to-scroll-section scroll-chapter !border-t-0${scrollLinked ? '' : ' how-to-scroll-section--static'}`}
      aria-labelledby="how-to-title"
      style={{
        ['--how-to-scene-count' as string]: PSA_HOW_TO_SCENES.length,
        ['--how-to-rail-progress' as string]: '0',
      }}
    >
      <div className="how-to-scroll-section__hero-band bg-surface-bg border-b border-border-default">
        <div className="container-custom">{heroBlock}</div>
      </div>

      <PsaBatchProgressBoard />

      <div className="how-to-scroll-section__stage">
        <div className="how-to-scroll-section__bg" aria-hidden="true">
          <PsaGradingHowToScrollBackground />
          <div className="how-to-scroll-section__scrim" />
        </div>

        <div className="how-to-scroll-section__foreground">
          <div className="container-custom how-to-scroll-section__content">
            <div className="how-to-scroll-section__workflow">
              <h2 className="chapter-title how-to-scroll-section__workflow-title">
                {howTo.title}
              </h2>
              {howTo.subtitle ? (
                <p className="how-to-scroll-section__workflow-intro text-sm md:text-base text-text-secondary leading-relaxed max-w-2xl">
                  {howTo.subtitle}
                </p>
              ) : null}
              <PsaGradingWorkflowTimeline copy={howTo} scrollLinked={scrollLinked} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
