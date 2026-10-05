import StructuredData from '@/components/StructuredData';
import {
  buildPsaGradingHubStructuredData,
  type PsaGradingLocale,
} from '@/lib/seo/psa-grading-structured-data';
import PsaGradingHubClient from './PsaGradingHubClient';

type Props = {
  locale?: PsaGradingLocale;
};

export default function PsaGradingHubPageShell({ locale = 'en' }: Props) {
  const structuredData = buildPsaGradingHubStructuredData(locale);

  return (
    <>
      <StructuredData data={structuredData} />
      <PsaGradingHubClient />
    </>
  );
}
