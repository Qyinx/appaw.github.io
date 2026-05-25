// Centralized JSON-LD factories for Appaw Store
export function webSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Appaw Store',
    url: 'https://appaw.store',
    description: 'Premium PSA Card Aluminum Protector and TCG trading & brokerage. Based in Hong Kong, shipping worldwide.',
    inLanguage: ['en', 'zh-HK'],
  };
}

export function storeJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'Appaw Store',
    legalName: 'Appaw Store',
    alternateName: ['Appaw', 'APPAW Store'],
    description: 'Premium PSA Card Aluminum Protector and TCG trading & brokerage in Hong Kong',
    slogan: 'Protect What Matters. Display What You Love.',
    foundingDate: '2024',
    url: 'https://appaw.store',
    logo: 'https://appaw.store/images/logo.png',
    image: 'https://appaw.store/images/og-image.png',
    priceRange: '$$',
    knowsAbout: [
      'PSA graded trading cards',
      'CGC graded trading cards',
      'Pokémon TCG card preservation',
      'TCG card valuation and brokerage',
      'Aluminum card case manufacturing',
      'UV protection for trading cards',
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
      'https://www.instagram.com/appaw.store/',
      'https://www.threads.net/@appaw.store',
      'https://appawstore.etsy.com/',
      'https://www.carousell.com.hk/u/appaw.store/',
    ],
    makesOffer: [
      { '@type': 'Offer', url: 'https://appaw.store/products/psa-protectors/', name: 'PSA Card Aluminum Protector' },
      { '@type': 'Offer', url: 'https://appaw.store/business/card-trading/', name: 'TCG Trading & Brokerage' },
    ],
  };
}

export function webApplicationJsonLd(opts: { name: string; description: string; url: string; applicationCategory?: string; operatingSystem?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    applicationCategory: opts.applicationCategory || 'BusinessApplication',
    operatingSystem: opts.operatingSystem || 'All',
    author: { '@type': 'Organization', name: 'Appaw Store' },
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

export default {
  webSiteJsonLd,
  storeJsonLd,
  webApplicationJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
};
