import StructuredData from '@/components/StructuredData';
import {
  buildPsaGradingTrackStructuredData,
  type PsaGradingLocale,
} from '@/lib/seo/psa-grading-structured-data';
import PsaGradingTrackClient from './PsaGradingTrackClient';

type Props = {
  locale?: PsaGradingLocale;
};

export default function PsaGradingTrackPageShell({ locale = 'en' }: Props) {
  const structuredData = buildPsaGradingTrackStructuredData(locale);

  return (
    <>
      <StructuredData data={structuredData} />
      <PsaGradingTrackClient />
    </>
  );
}
