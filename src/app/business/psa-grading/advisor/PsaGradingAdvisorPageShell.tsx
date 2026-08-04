import { zh } from '@/i18n';
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
  const zhCopy = zh.psaGradingPage;

  return (
    <>
      <StructuredData data={structuredData} />
      {locale === 'en' ? (
        <div className="sr-only">
          <h2>{zhCopy.advisor.title}</h2>
          <p>{zhCopy.advisor.lead}</p>
          <p>{zhCopy.trust.lead}</p>
          <p>{zhCopy.aftercare.body}</p>
        </div>
      ) : null}
      <PsaGradingAdvisorClient />
    </>
  );
}
