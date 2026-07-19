import StructuredData from '@/components/StructuredData';
import {
  buildPsaGradingTrackStructuredData,
  type PsaGradingLocale,
} from '@/lib/seo/psa-grading-structured-data';
import { en, zh } from '@/i18n';
import PsaGradingTrackClient from './PsaGradingTrackClient';

type Props = {
  locale?: PsaGradingLocale;
};

export default function PsaGradingTrackPageShell({ locale = 'en' }: Props) {
  const copy = locale === 'zh' ? zh.psaGradingTrack : en.psaGradingTrack;
  const structuredData = buildPsaGradingTrackStructuredData(locale);

  return (
    <>
      <StructuredData data={structuredData} />
      <div className="sr-only">
        <h1>{copy.title}</h1>
        <p>{copy.subtitle}</p>
        <p>{copy.form.phoneHelper}</p>
        <p>{copy.form.refHelper}</p>
      </div>
      <PsaGradingTrackClient />
    </>
  );
}
