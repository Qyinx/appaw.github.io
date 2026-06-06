import CardCenteringClient from './CardCenteringClient';
import CenteringContent from './CenteringContent';
import StructuredData from '@/components/StructuredData';
import {
  webApplicationJsonLd,
  breadcrumbJsonLd,
  howToJsonLd,
  faqJsonLd,
} from '@/lib/seo';
import type { Translations } from '@/i18n';

type CenteringPageContentProps = {
  t: Translations;
  pageUrl: string;
  homeUrl: string;
};

export default function CenteringPageContent({ t, pageUrl, homeUrl }: CenteringPageContentProps) {
  const { seo, howToSteps, faq } = t.centeringPage;

  const webApp = webApplicationJsonLd({
    name: seo.webAppName,
    description: seo.webAppDescription,
    url: pageUrl,
    applicationCategory: 'UtilitiesApplication',
  });

  const breadcrumb = breadcrumbJsonLd([
    { position: 1, name: seo.breadcrumbHome, item: homeUrl },
    { position: 2, name: seo.breadcrumbTool, item: pageUrl },
  ]);

  const howTo = howToJsonLd({
    name: seo.howToName,
    description: seo.howToDescription,
    totalTime: 'PT2M',
    tool: [{ '@type': 'HowToTool', name: seo.howToTool }],
    step: howToSteps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  });

  const faqSchema = faqJsonLd(faq);

  return (
    <>
      <StructuredData data={[webApp, breadcrumb, howTo, faqSchema]} />
      <div className="flex flex-col w-full min-w-0 bg-surface-bg page-blueprint">
        <CardCenteringClient />
        <CenteringContent />
      </div>
    </>
  );
}
