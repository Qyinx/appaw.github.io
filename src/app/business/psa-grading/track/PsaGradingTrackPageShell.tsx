import Link from 'next/link';
import { Suspense } from 'react';
import StructuredData from '@/components/StructuredData';
import LocalLink from '@/components/LocalLink';
import { en, zh } from '@/i18n';
import {
  buildPsaGradingTrackStructuredData,
  type PsaGradingLocale,
} from '@/lib/seo/psa-grading-structured-data';
import TrackWorkspaceClient from './TrackWorkspaceClient';

type Props = {
  locale?: PsaGradingLocale;
};

const PSA_CERT_URL = 'https://www.psacard.com/cert';

/**
 * Static (server-rendered) note for visitors who searched for PSA cert lookup.
 * Kept outside the Suspense boundary so it is in the exported HTML.
 */
function CertLookupNote({ locale }: { locale: PsaGradingLocale }) {
  const copy = (locale === 'zh' ? zh : en).psaGradingTrack.certNote;
  const fakeGuideHref =
    locale === 'zh' ? '/zh/guides/identify-fake-psa-slabs/' : '/guides/identify-fake-psa-slabs/';

  return (
    <div className="grading-track-notes">
      <article className="panel p-5 grading-track-note grading-track-note--cert">
        <h2 className="grading-track-note__title font-display text-lg font-bold text-text-primary mb-2">
          {copy.certTitle}
        </h2>
        <p className="grading-track-note__body text-sm text-text-secondary leading-relaxed mb-3">
          {copy.certBody}
        </p>
        <a
          href={PSA_CERT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="grading-track-note__link text-sm font-semibold text-accent-secondary underline underline-offset-2"
        >
          {copy.certLink}
        </a>
      </article>
      <article className="panel p-5 grading-track-note grading-track-note--warn">
        <h2 className="grading-track-note__title font-display text-lg font-bold text-text-primary mb-2">
          {copy.authenticityTitle}
        </h2>
        <p className="grading-track-note__body text-sm text-text-secondary leading-relaxed mb-3">
          {copy.authenticityBody}
        </p>
        <Link
          href={fakeGuideHref}
          className="grading-track-note__link text-sm font-semibold text-accent-secondary underline underline-offset-2"
        >
          {copy.authenticityLink}
        </Link>
      </article>
    </div>
  );
}

export default function PsaGradingTrackPageShell({ locale = 'en' }: Props) {
  const structuredData = buildPsaGradingTrackStructuredData(locale);
  const copy = (locale === 'zh' ? zh : en).psaGradingTrack;

  return (
    <>
      <StructuredData data={structuredData} />
      <div className="bg-surface-bg grading-track-page">
        <div className="container-tool pt-10 md:pt-14 pb-10 md:pb-14">
          <header className="grading-track-hero mb-8 md:mb-10 flex flex-col items-start">
            <LocalLink
              href="/business/psa-grading"
              className="grading-track-hero__back inline-flex items-center text-sm text-text-secondary hover:text-text-primary transition-colors min-h-11 mb-6"
            >
              {copy.backToHub}
            </LocalLink>
            <p className="section-label mb-4">{copy.badge}</p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary leading-[1.06] tracking-tight text-balance">
              {copy.title}
            </h1>
            <p className="mt-4 text-base md:text-lg text-text-secondary leading-relaxed max-w-xl psa-grading-track-aeo-answer">
              {copy.subtitle}
            </p>
          </header>

          <div className="grading-track-lookup">
            <Suspense
              fallback={
                <div
                  className="grading-track-lookup__form grading-track-skeleton min-h-[12rem]"
                  aria-hidden="true"
                />
              }
            >
              <TrackWorkspaceClient />
            </Suspense>
            <aside className="grading-track-lookup__aside">
              <CertLookupNote locale={locale} />
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
