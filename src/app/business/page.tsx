/* ─────────────────────────────────────────────────────
   Server Component — /business/ page
   Owns all JSON-LD structured data for this URL only.
   Interactive content is delegated to BusinessClient.
   ───────────────────────────────────────────────────── */
import BusinessClient from './BusinessClient';

// Services catalog — two core offerings
const servicesCatalogJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Appaw Store Services',
  description: 'Premium PSA card protection products and trusted TCG trading & brokerage services based in Hong Kong.',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'Service',
        name: 'PSA Card Aluminum Protector',
        description: 'Premium aluminum protective case for PSA graded card slabs. Features >95% UV-blocking glass, N52 magnetic closure, and a precision aluminum frame. Fits standard 35PT PSA slabs including Pokémon, sports cards, and MTG.',
        provider: { '@type': 'Organization', name: 'Appaw Store', url: 'https://appaw.store' },
        serviceType: 'Card Protection Product',
        areaServed: [
          { '@type': 'Country', name: 'Hong Kong' },
          { '@type': 'Country', name: 'United States' },
          { '@type': 'Country', name: 'United Kingdom' },
          { '@type': 'Country', name: 'Singapore' },
          { '@type': 'Country', name: 'Taiwan' },
        ],
        url: 'https://appaw.store/products/psa-protectors/',
        offers: {
          '@type': 'Offer',
          price: '17.99',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: 'https://appawstore.etsy.com/',
        },
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'Service',
        name: 'TCG Trading & Brokerage',
        description: 'Trusted buy, sell, and consignment service for PSA and CGC graded trading cards in Hong Kong. Specialising in Pokémon, sports cards, and MTG. Face-to-face transactions only. Commission charged on successful sale only.',
        provider: { '@type': 'Organization', name: 'Appaw Store', url: 'https://appaw.store' },
        serviceType: 'Trading Card Brokerage',
        areaServed: { '@type': 'City', name: 'Hong Kong' },
        url: 'https://appaw.store/business/card-trading/',
        termsOfService: 'Face-to-face delivery in Hong Kong only. No upfront listing fee. Commission charged on successful sale. Quarterly stocktake every 3 months.',
      },
    },
  ],
};

// BreadcrumbList — scoped to /business/ only (not inherited by children)
const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://appaw.store/' },
    { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://appaw.store/business/' },
  ],
};

// FAQPage — service-level Q&As, scoped to /business/ only
const businessFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  publisher: { '@type': 'Organization', name: 'Appaw Store', url: 'https://appaw.store' },
  datePublished: '2024-01-15',
  dateModified: '2026-04-17',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What services does Appaw Store offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Appaw Store offers two services: (1) PSA Card Aluminum Protectors — premium aluminum cases with >95% UV-blocking glass and N52 magnetic closure for PSA graded slabs, shipping worldwide; (2) TCG Trading & Brokerage — a trusted buy, sell, and consignment service for PSA and CGC graded trading cards, conducted face-to-face in Hong Kong.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Appaw Store ship internationally?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — PSA Card Aluminum Protectors ship worldwide, including the USA, UK, Hong Kong, Singapore, and Taiwan. Card trading transactions are Hong Kong in-person only.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I consign my graded cards with Appaw Store?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Appaw Store accepts PSA and CGC graded cards for consignment. There is no upfront listing fee — commission is charged only upon successful sale. Contact us via WhatsApp at +852-9285-1189 to begin.',
      },
    },
    {
      '@type': 'Question',
      name: 'What types of graded cards does Appaw Store trade?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Appaw Store specialises in PSA and CGC graded Pokémon cards, sports cards (basketball, baseball, football), and Magic: The Gathering (MTG) cards. We also consider other trading card games on a case-by-case basis.',
      },
    },
  ],
};

export default function BusinessPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesCatalogJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessFaqJsonLd) }} />
      <BusinessClient />
    </>
  );
}