import { brandLogoImageObject, SITE_ORIGIN, SOCIAL_INSTAGRAM_URL, SOCIAL_THREADS_URL } from '@/lib/seo/brand';

// Centralized JSON-LD factories for Appaw Store
export function webSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Appaw Store',
    url: SITE_ORIGIN,
    description: 'Premium Graded Slab UV Glass Protector and TCG trading & brokerage. Based in Hong Kong, shipping worldwide.',
    inLanguage: ['en', 'zh-HK'],
    publisher: {
      '@type': 'Organization',
      name: 'Appaw Store',
      url: SITE_ORIGIN,
      logo: brandLogoImageObject,
    },
  };
}

export function storeJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'Appaw Store',
    legalName: 'Appaw Store',
    alternateName: ['Appaw', 'APPAW Store'],
    description: 'Premium Graded Slab UV Glass Protector and TCG trading & brokerage in Hong Kong',
    slogan: 'Protect What Matters. Display What You Love.',
    foundingDate: '2024',
    url: SITE_ORIGIN,
    logo: brandLogoImageObject,
    image: `${SITE_ORIGIN}/images/og-image.png`,
    priceRange: '$$',
    knowsAbout: [
      'PSA graded trading cards',
      'CGC graded trading cards',
      'Pokémon TCG card preservation',
      'TCG card valuation and brokerage',
      'UV glass slab protector manufacturing',
      'UV protection for trading cards',
      'PSA slab authentication',
      'Counterfeit graded card detection',
      'PSA regrade and reholder decisions',
      'Card centering measurement for graded slabs',
      'PSA 10 centering requirements',
      'PSA submission Hong Kong',
      'PSA card submission proxy service',
      'Hong Kong TCG grading submission',
      'TCG card PSA proxy service',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'HK',
      addressLocality: 'Hong Kong',
    },
    geo: { '@type': 'GeoCoordinates', addressCountry: 'HK' },
    telephone: '+852-9285-1189',
    email: 'support@appaw.store',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '10:00',
      closes: '22:00',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+852-9285-1189',
      contactType: 'customer service',
      availableLanguage: ['English', 'Chinese', 'Cantonese'],
      areaServed: ['HK', 'US', 'GB', 'CN', 'TW', 'SG', 'JP', 'AU'],
    },
    sameAs: [
      SOCIAL_INSTAGRAM_URL,
      SOCIAL_THREADS_URL,
      'https://appawstore.etsy.com/',
      'https://www.carousell.com.hk/u/appaw.store/',
      'https://www.google.com/maps/search/?api=1&query=Shop+9+Basement+Manly+Plaza+995-997+King%27s+Road+Quarry+Bay+Hong+Kong',
    ],
    makesOffer: [
      { '@type': 'Offer', url: 'https://appaw.store/products/psa-protectors/', name: 'Graded Slab UV Glass Protector' },
      { '@type': 'Offer', url: 'https://appaw.store/business/card-trading/', name: 'TCG Trading & Brokerage' },
      { '@type': 'Offer', url: 'https://appaw.store/business/psa-grading/', name: 'PSA Collectibles Submission (Hong Kong)' },
    ],
  };
}

export function webApplicationJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  applicationCategory?: string;
  operatingSystem?: string;
  featureList?: readonly string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    applicationCategory: opts.applicationCategory || 'BusinessApplication',
    operatingSystem: opts.operatingSystem || 'All',
    author: { '@type': 'Organization', name: 'Appaw Store' },
    ...(opts.featureList?.length ? { featureList: [...opts.featureList] } : {}),
  };
}

export function breadcrumbJsonLd(items: { position: number; name: string; item: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it) => ({ '@type': 'ListItem', position: it.position, name: it.name, item: it.item })),
  };
}

export function faqJsonLd(items: { q: string; a: string }[], publisherName = 'Appaw Store') {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    publisher: { '@type': 'Organization', name: publisherName, url: 'https://appaw.store' },
    datePublished: new Date().toISOString().slice(0, 10),
    mainEntity: items.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };
}

export function productJsonLd(product: Record<string, any>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    ...product,
  };
}

export function itemListJsonLd(name: string, items: any[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items,
  };
}

export function howToJsonLd(howto: Record<string, any>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    ...howto,
  };
}

export function organizationJsonLd(opts: Record<string, any>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    ...opts,
  };
}

export function serviceJsonLd(service: Record<string, any>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    ...service,
  };
}

export function webPageJsonLd(page: Record<string, any>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    ...page,
  };
}

export function articleJsonLd(opts: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  inLanguage: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
    url: opts.url,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    inLanguage: opts.inLanguage,
    author: { '@type': 'Organization', name: 'Appaw Store', url: 'https://appaw.store' },
    publisher: {
      '@type': 'Organization',
      name: 'Appaw Store',
      url: 'https://appaw.store',
      logo: brandLogoImageObject,
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': opts.url },
    ...(opts.image ? { image: opts.image } : {}),
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.guide-lead', '.guide-aeo-answer'],
    },
  };
}

export default {
  webSiteJsonLd,
  storeJsonLd,
  webApplicationJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
};
