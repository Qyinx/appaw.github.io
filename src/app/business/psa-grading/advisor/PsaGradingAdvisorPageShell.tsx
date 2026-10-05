import StructuredData from '@/components/StructuredData';
import {
  buildPsaGradingAdvisorStructuredData,
  type PsaGradingLocale,
} from '@/lib/seo/psa-grading-structured-data';
import PsaGradingAdvisorClient from './PsaGradingAdvisorClient';

type Props = {
  locale?: PsaGradingLocale;
};

export default function PsaGradingAdvisorPageShell({ locale = 'en' }: Props) {
  const structuredData = buildPsaGradingAdvisorStructuredData(locale);

  return (
    <>
      <StructuredData data={structuredData} />
      <PsaGradingAdvisorClient />
    </>
  );
}
