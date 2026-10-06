import Link from 'next/link';
import { Suspense } from 'react';
import StructuredData from '@/components/StructuredData';
import {
  buildPsaGradingTrackStructuredData,
  type PsaGradingLocale,
} from '@/lib/seo/psa-grading-structured-data';
import PsaGradingTrackClient from './PsaGradingTrackClient';

type Props = {
  locale?: PsaGradingLocale;
};

const PSA_CERT_URL = 'https://www.psacard.com/cert';

/**
 * Static (server-rendered) note for visitors who searched for PSA cert lookup.
 * Kept outside the Suspense boundary so it is in the exported HTML.
 */
function CertLookupNote({ locale }: { locale: PsaGradingLocale }) {
  const linkClass = 'text-accent-secondary hover:underline';
  if (locale === 'zh') {
    return (
      <div className="space-y-1">
        <p>
          如需核對 PSA 證書編號，請前往{' '}
          <a href={PSA_CERT_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
            PSA 官方證書查詢
          </a>
          。
        </p>
        <p>
          證書編號查得到，不代表外殼必然真確，因為假殼常常複製真實編號。詳情可參閱
          <Link href="/zh/guides/identify-fake-psa-slabs/" className={linkClass}>
            辨別假 PSA 外殼指南
          </Link>
          。
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-1">
      <p>
        To check a PSA certificate number, go to{' '}
        <a href={PSA_CERT_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
          PSA official Cert Verification
        </a>
        .
      </p>
      <p>
        A certificate number that checks out does not mean the slab is genuine, because fake slabs
        often copy real certificate numbers. See our{' '}
        <Link href="/guides/identify-fake-psa-slabs/" className={linkClass}>
          guide to spotting fake PSA slabs
        </Link>
        .
      </p>
    </div>
  );
}

export default function PsaGradingTrackPageShell({ locale = 'en' }: Props) {
  const structuredData = buildPsaGradingTrackStructuredData(locale);

  return (
    <>
      <StructuredData data={structuredData} />
      <aside className="bg-surface-bg">
        <div className="container-tool pt-4 text-sm text-text-secondary">
          <CertLookupNote locale={locale} />
        </div>
      </aside>
      <Suspense fallback={null}>
        <PsaGradingTrackClient />
      </Suspense>
    </>
  );
}
