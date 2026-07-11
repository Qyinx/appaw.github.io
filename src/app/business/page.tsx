/* ─────────────────────────────────────────────────────
   Server Component — /business/ page
   Owns all JSON-LD structured data for this URL only.
   Interactive content is delegated to BusinessClient.
   ───────────────────────────────────────────────────── */
import BusinessClient from './BusinessClient';
import StructuredData from '@/components/StructuredData';
import { itemListJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { PROTECTOR_PRICING } from '@/lib/products/protector-pricing';

const services = itemListJsonLd('Appaw Store Services', [
  {
    '@type': 'ListItem',
    position: 1,
    item: {
      '@type': 'Service',
      name: 'Graded Slab UV Glass Protector',
      description: 'Premium UV glass protective case for PSA and CGC graded card slabs. Features tempered UV-blocking glass, N52 magnetic closure, and a rigid metal frame. Fits standard 35PT PSA and CGC slabs including Pokémon, sports cards, and MTG.',
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
        price: String(PROTECTOR_PRICING.single),
        priceCurrency: PROTECTOR_PRICING.currency,
        availability: 'https://schema.org/InStock',
        url: 'https://appaw.store/products/psa-protectors/',
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
  {
    '@type': 'ListItem',
    position: 3,
    item: {
      '@type': 'Service',
      name: 'PSA Collectibles Submission',
      description:
        'Face-to-face PSA grading submission proxy at partner store 138 Arena, Causeway Bay. Drop-off and pickup in person only. Online batch tracking by phone and BAT reference code. Pokémon, sports cards, and MTG accepted.',
      provider: { '@type': 'Organization', name: 'Appaw Store', url: 'https://appaw.store' },
      serviceType: 'PSA Grading Submission',
      areaServed: { '@type': 'City', name: 'Hong Kong' },
      url: 'https://appaw.store/business/psa-grading/',
    },
  },
]);

const breadcrumb = breadcrumbJsonLd([
  { position: 1, name: 'Home', item: 'https://appaw.store/' },
  { position: 2, name: 'Services', item: 'https://appaw.store/business/' },
]);

export default function BusinessPage() {
  return (
    <>
      <StructuredData data={[services, breadcrumb]} />
      <BusinessClient />
    </>
  );
}