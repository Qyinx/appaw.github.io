import { zh } from '@/i18n';
import StructuredData from '@/components/StructuredData';
import {
  buildPsaGradingHubStructuredData,
  type PsaGradingLocale,
} from '@/lib/seo/psa-grading-structured-data';
import { formatPsaTierPriceLine } from '@/lib/grading/psa-pricing';
import PsaGradingHubClient from './PsaGradingHubClient';

type Props = {
  locale?: PsaGradingLocale;
};

export default function PsaGradingHubPageShell({ locale = 'en' }: Props) {
  const structuredData = buildPsaGradingHubStructuredData(locale);
  const zhCopy = zh.psaGradingPage;

  return (
    <>
      <StructuredData data={structuredData} />
      {locale === 'en' ? (
        <div className="sr-only">
          <h2>{zhCopy.hero.title}</h2>
          <p>{zhCopy.hero.definition}</p>
          <p>{zhCopy.aeo.answer}</p>
          <p>{zhCopy.whoThisIsFor.body}</p>
          <p>
            {zhCopy.dropOff.title}: {zhCopy.dropOffAddress}. {zhCopy.dropOff.hoursNote}
          </p>
          <p>{formatPsaTierPriceLine('zh')}</p>
        </div>
      ) : null}
      <PsaGradingHubClient />
    </>
  );
}
