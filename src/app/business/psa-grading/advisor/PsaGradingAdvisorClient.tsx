'use client';

import React from 'react';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import LocalLink from '@/components/LocalLink';
import PsaGradingHero from '../components/PsaGradingHero';
import PsaAdvisorSection from '../components/PsaAdvisorSection';
import PsaTrustSection from '../components/PsaTrustSection';
import PsaAftercareSection from '../components/PsaAftercareSection';
import { PSA_SUBMISSION_APPOINTMENT_URL } from '@/lib/grading/psa-booking';
import { PSA_GRADING_ADVISOR_SEO } from '@/lib/product-names';

export default function PsaGradingAdvisorClient() {
  const { t, language } = useLanguage();
  const copy = t.psaGradingPage;
  const seo = PSA_GRADING_ADVISOR_SEO[language === 'zh' ? 'zh' : 'en'];

  return (
    <div className="psa-grading-advisor flex flex-col bg-surface-bg sticky-bottom-bar-spacer">
      <PsaGradingHero badge={copy.advisor.badge} title={seo.h1Keyword} subtitle={copy.advisor.lead} variant="compact">
        <a
          href={PSA_SUBMISSION_APPOINTMENT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary min-h-[44px]"
        >
          <CalendarDays className="w-4 h-4" aria-hidden="true" />
          <span>{copy.hero.ctaBook}</span>
        </a>
        <LocalLink href="/business/psa-grading/" className="btn btn-secondary min-h-[44px]">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>{copy.advisorPage.backToHub}</span>
        </LocalLink>
      </PsaGradingHero>

      <PsaAdvisorSection copy={copy.advisor} omitHeader />
      <PsaTrustSection copy={copy.trust} />
      <PsaAftercareSection copy={copy.aftercare} />

      <footer className="container-custom py-6 text-xs text-text-muted border-t border-border-default">
        {copy.lastUpdatedLabel}: {seo.lastUpdated}
      </footer>

      <div
        className="sticky-bottom-bar md:hidden"
        aria-label={copy.mobileSticky.label}
      >
        <a
          href={PSA_SUBMISSION_APPOINTMENT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary w-full min-h-[44px]"
        >
          <CalendarDays className="w-4 h-4" aria-hidden="true" />
          <span>{copy.mobileSticky.book}</span>
        </a>
      </div>
    </div>
  );
}
