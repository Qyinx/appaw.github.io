/* ─────────────────────────────────────────────────────
   Server Component — /business/ page
   Owns all JSON-LD structured data for this URL only.
   Interactive content is delegated to BusinessClient.
   ───────────────────────────────────────────────────── */
import BusinessClient from './BusinessClient';
import StructuredData from '@/components/StructuredData';
import { itemListJsonLd, breadcrumbJsonLd, faqJsonLd } from '@/lib/seo';

const services = itemListJsonLd('Appaw Store Services', [
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
]);

const breadcrumb = breadcrumbJsonLd([
  { position: 1, name: 'Home', item: 'https://appaw.store/' },
  { position: 2, name: 'Services', item: 'https://appaw.store/business/' },
]);

const businessFaq = faqJsonLd([
  {
    q: 'What services does Appaw Store offer?',
    a: 'Appaw Store offers two services: (1) PSA Card Aluminum Protectors — premium aluminum cases with >95% UV-blocking glass and N52 magnetic closure for PSA graded slabs, shipping worldwide; (2) TCG Trading & Brokerage — a trusted buy, sell, and consignment service for PSA and CGC graded trading cards, conducted face-to-face in Hong Kong.',
  },
  {
    q: 'Does Appaw Store ship internationally?',
    a: 'Yes — PSA Card Aluminum Protectors ship worldwide, including the USA, UK, Hong Kong, Singapore, and Taiwan. Card trading transactions are Hong Kong in-person only.',
  },
  {
    q: 'Can I consign my graded cards with Appaw Store?',
    a: 'Yes. Appaw Store accepts PSA and CGC graded cards for consignment. There is no upfront listing fee — commission is charged only upon successful sale. Contact us via WhatsApp at +852-9285-1189 to begin.',
  },
  {
    q: 'What types of graded cards does Appaw Store trade?',
    a: 'Appaw Store specialises in PSA and CGC graded Pokémon cards, sports cards (basketball, baseball, football), and Magic: The Gathering (MTG) cards. We also consider other trading card games on a case-by-case basis.',
  },
]);

export default function BusinessPage() {
  return (
    <>
      <StructuredData data={[services, breadcrumb, businessFaq]} />
      <BusinessClient />
    </>
  );
}