'use client';

import React, { useRef } from 'react';
import { CalendarDays, Search } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Reveal from '@/components/ui/Reveal';
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';
import { useHowToBackgroundScrub } from '@/hooks/useHowToBackgroundScrub';
import ScrollChapter from '@/components/motion/ScrollChapter';
import ChapterNav from '@/components/motion/ChapterNav';
import LocalLink from '@/components/LocalLink';
import PsaPricingTable from './components/PsaPricingTable';
import PsaGradingHowToSection from './components/PsaGradingHowToSection';
import PsaGradingBookSection from './components/PsaGradingBookSection';
import PsaGradingFaqSection from './components/PsaGradingFaqSection';
import PsaAdvisorTeaser from './components/PsaAdvisorTeaser';
import { PSA_HOW_TO_SCENES } from '@/lib/grading/how-to-scenes';
import { PSA_SUBMISSION_APPOINTMENT_URL } from '@/lib/grading/psa-booking';

export default function PsaGradingHubClient() {
  const { t } = useLanguage();
  const copy = t.psaGradingPage;
  const pageRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRevealOnScroll<HTMLDivElement>({ threshold: 0.08 });

  useHowToBackgroundScrub(pageRef, PSA_HOW_TO_SCENES.length);

  const chapterNavItems = React.useMemo(
    () => [
      { id: 'how-to', label: copy.chapters.howTo },
      { id: 'batches', label: copy.chapters.batches },
      { id: 'advisor', label: copy.chapters.advisor },
      { id: 'book', label: copy.chapters.book },
      { id: 'pricing', label: copy.chapters.pricing },
      { id: 'faq', label: copy.chapters.faq },
    ],
    [copy.chapters],
  );

  return (
    <div ref={pageRef} className="psa-grading-hub flex flex-col bg-surface-bg sticky-bottom-bar-spacer">
      <div className="chapter-nav-shell">
        <div className="container-custom">
          <ChapterNav items={chapterNavItems} />
        </div>
      </div>

      <PsaGradingHowToSection badge={copy.badge} hero={copy.hero} howTo={copy.howTo} aeo={copy.aeo} />

      <PsaAdvisorTeaser copy={copy.advisorTeaser} />

      <PsaGradingBookSection
        copy={copy.bookSection}
        dropOffAddress={copy.dropOffAddress}
        hoursNote={copy.dropOff.hoursNote}
      />

      <ScrollChapter
        id="pricing"
        title={copy.pricing.title}
        className="relative overflow-x-clip bg-surface-bg !min-h-0"
      >
        <div ref={pricingRef.ref}>
          <Reveal visible={pricingRef.visible} dir="up" delay={40}>
            <PsaPricingTable copy={copy.pricing} />
          </Reveal>
        </div>
      </ScrollChapter>

      <section id="faq" className="scroll-mt-20 border-t border-border-default bg-surface-bg">
        <div className="container-custom py-10 md:py-14">
          <PsaGradingFaqSection copy={copy} />
        </div>
      </section>

      <footer className="container-custom py-6 text-xs text-text-muted border-t border-border-default">
        {copy.lastUpdatedLabel}: {copy.lastUpdated}
      </footer>

      <div
        className="sticky-bottom-bar md:hidden"
        aria-label={copy.mobileSticky.label}
      >
        <div className="flex gap-2">
          <a
            href={PSA_SUBMISSION_APPOINTMENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary flex-1 min-h-[44px]"
          >
            <CalendarDays className="w-4 h-4" aria-hidden="true" />
            <span>{copy.mobileSticky.book}</span>
          </a>
          <LocalLink href="/business/psa-grading/track" className="btn btn-secondary flex-1 min-h-[44px]">
            <Search className="w-4 h-4" aria-hidden="true" />
            <span>{copy.mobileSticky.track}</span>
          </LocalLink>
        </div>
      </div>
    </div>
  );
}
