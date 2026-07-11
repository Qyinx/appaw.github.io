import { zh } from '@/i18n';
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
          <p>
            PSA 服務費：Regular HKD 890 · Express HKD 1900 · Super Express HKD 3600 · Walk-Through HKD 5900
          </p>
        </div>
      ) : null}
      <PsaGradingHubClient />
    </>
  );
}
