import { flattenPsaFaqItems } from '@/lib/grading/psa-faq-types';
import { PSA_SUBMISSION_APPOINTMENT_URL } from '@/lib/grading/psa-booking';
import { en, zh } from '@/i18n';
import { GRADING_SERVICE_PLAN_LABELS } from '@/lib/grading/reference-code';
import { PSA_PRICING_ROWS, getPsaDisplayFee } from '@/lib/grading/psa-pricing';
import { PSA_GRADING_SEO } from '@/lib/product-names';
import { SITE_ORIGIN } from '@/lib/seo/brand';
import {
  breadcrumbJsonLd,
  faqJsonLd,
  howToJsonLd,
  serviceJsonLd,
  webApplicationJsonLd,
  webPageJsonLd,
} from '@/lib/seo';

export type PsaGradingLocale = 'en' | 'zh';

function siteRoot(locale: PsaGradingLocale): string {
  return locale === 'zh' ? `${SITE_ORIGIN}/zh` : SITE_ORIGIN;
}

function hubUrl(locale: PsaGradingLocale): string {
  return `${siteRoot(locale)}/business/psa-grading/`;
}

function trackUrl(locale: PsaGradingLocale): string {
  return `${siteRoot(locale)}/business/psa-grading/track/`;
}

export function buildPsaGradingHubStructuredData(locale: PsaGradingLocale) {
  const copy = locale === 'zh' ? zh.psaGradingPage : en.psaGradingPage;
  const seo = PSA_GRADING_SEO[locale];
  const url = hubUrl(locale);

  const service = serviceJsonLd({
    name: seo.h1Keyword,
    description: copy.hero.definition,
    url,
    dateModified: seo.lastUpdated,
    provider: { '@type': 'Organization', name: 'Appaw Store', url: SITE_ORIGIN },
    serviceType: locale === 'zh' ? '香港 TCG 卡牌 PSA 代送鑑定' : 'Hong Kong TCG PSA grading submission',
    areaServed: { '@type': 'City', name: 'Hong Kong' },
    offers: PSA_PRICING_ROWS.filter((row) => row.feeHkd != null).map((row) => {
      const listFee = row.feeHkd!;
      const displayFee = getPsaDisplayFee(row);
      const hasDiscount =
        row.discountedFeeHkd != null &&
        row.discountedFeeHkd > 0 &&
        row.discountedFeeHkd < listFee;

      return {
        '@type': 'Offer',
        name: `PSA ${GRADING_SERVICE_PLAN_LABELS[row.plan]}`,
        price: String(displayFee),
        priceCurrency: 'HKD',
        url: `${url}#pricing`,
        availability: 'https://schema.org/InStock',
        ...(hasDiscount
          ? {
              priceSpecification: {
                '@type': 'UnitPriceSpecification',
                price: String(listFee),
                priceCurrency: 'HKD',
                priceType: 'https://schema.org/ListPrice',
              },
            }
          : {}),
      };
    }),
    potentialAction: {
      '@type': 'ReserveAction',
      target: PSA_SUBMISSION_APPOINTMENT_URL,
      name: locale === 'zh' ? '預約交卡' : 'Book drop-off',
    },
  });

  const breadcrumb = breadcrumbJsonLd([
    { position: 1, name: locale === 'zh' ? '首頁' : 'Home', item: `${siteRoot(locale)}/` },
    { position: 2, name: locale === 'zh' ? '服務' : 'Services', item: `${siteRoot(locale)}/business/` },
    { position: 3, name: seo.breadcrumb, item: url },
  ]);

  const howTo = howToJsonLd({
    name: copy.howTo.title,
    description: copy.howTo.subtitle,
    step: copy.howTo.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.body,
    })),
  });

  const faq = faqJsonLd(flattenPsaFaqItems(copy.faq.groups));

  const webPage = webPageJsonLd({
    name: seo.title,
    description: seo.description,
    url,
    dateModified: seo.lastUpdated,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.psa-grading-aeo-answer', '.guide-aeo-answer'],
    },
  });

  return [service, breadcrumb, howTo, faq, webPage];
}

export function buildPsaGradingTrackStructuredData(locale: PsaGradingLocale) {
  const seo = PSA_GRADING_SEO[locale];
  const url = trackUrl(locale);

  const webApp = webApplicationJsonLd({
    name: seo.webAppName,
    description: seo.trackDescription,
    url,
    applicationCategory: 'BusinessApplication',
    featureList: seo.featureList,
  });

  const breadcrumb = breadcrumbJsonLd([
    { position: 1, name: locale === 'zh' ? '首頁' : 'Home', item: `${siteRoot(locale)}/` },
    { position: 2, name: locale === 'zh' ? '服務' : 'Services', item: `${siteRoot(locale)}/business/` },
    { position: 3, name: seo.breadcrumb, item: hubUrl(locale) },
    { position: 4, name: seo.trackBreadcrumb, item: url },
  ]);

  const webPage = webPageJsonLd({
    name: seo.trackTitle,
    description: seo.trackDescription,
    url,
    dateModified: seo.lastUpdated,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.psa-grading-track-aeo-answer'],
    },
  });

  return [webApp, breadcrumb, webPage];
}
