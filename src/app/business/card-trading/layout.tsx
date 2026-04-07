import type { Metadata } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import type { TradingCard } from '@/types/trading-card';

export const metadata: Metadata = {
  title: 'Trading Card Showcase – Buy Graded Cards | Appaw Store',
  description:
    'Browse PSA, BGS, and CGC graded trading cards for sale. Filter by grading company, grade score, and card name. Trusted TCG marketplace in Hong Kong.',
  keywords: [
    'buy graded cards',
    'PSA graded cards for sale',
    'BGS graded cards',
    'CGC graded cards',
    'Pokemon card marketplace',
    'graded card shop Hong Kong',
    'PSA 10 Pokemon cards',
    'trading card marketplace',
    'TCG trading Hong Kong',
    // Bilingual
    '評級卡牌買賣',
    '寶可夢卡牌',
    'PSA 評級卡',
  ],
  alternates: {
    canonical: '/business/card-trading/',
  },
  openGraph: {
    title: 'Trading Card Showcase – Browse & Buy Graded Cards | Appaw Store',
    description:
      'Explore our curated inventory of PSA, BGS, and CGC graded trading cards. Filter by grade, company, and more.',
    url: 'https://appaw.store/business/card-trading/',
    type: 'website',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Appaw Store – Trading Card Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trading Card Showcase | Appaw Store',
    description:
      'Browse PSA, BGS, and CGC graded cards for sale. Trusted TCG marketplace in Hong Kong.',
    images: ['/images/og-image.png'],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://appaw.store/' },
    { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://appaw.store/business/' },
    { '@type': 'ListItem', position: 3, name: 'Card Trading', item: 'https://appaw.store/business/card-trading/' },
  ],
};

const tradingFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Where can we meet for a card transaction in Hong Kong?',
      acceptedAnswer: { '@type': 'Answer', text: 'We arrange meetup locations across Hong Kong. WhatsApp us first at +852-9285-1189 and we will confirm a convenient spot and time.' },
    },
    {
      '@type': 'Question',
      name: 'What grading companies do you accept for card consignment?',
      acceptedAnswer: { '@type': 'Answer', text: 'We currently accept PSA and CGC graded cards for consignment. Other grading companies may be considered on a case-by-case basis.' },
    },
    {
      '@type': 'Question',
      name: 'How is the card consignment commission rate determined?',
      acceptedAnswer: { '@type': 'Answer', text: 'Commission varies depending on card value and current market conditions. Contact us via WhatsApp at +852-9285-1189 for a personalised quote before submitting your card.' },
    },
    {
      '@type': 'Question',
      name: 'Can I get my unsold consigned card back?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes — as long as we have contacted you during the quarterly stocktake and you request its return, we will arrange a face-to-face handback at a convenient Hong Kong location.' },
    },
    {
      '@type': 'Question',
      name: 'What happens if my card fails the authenticity check?',
      acceptedAnswer: { '@type': 'Answer', text: 'We will notify you immediately and return the card at the next meetup. No fees are charged for declined submissions.' },
    },
    {
      '@type': 'Question',
      name: 'What payment methods do you accept when buying graded cards?',
      acceptedAnswer: { '@type': 'Answer', text: 'We only accept Cash or FPS (Faster Payment System) at the time of in-person handover. We do not accept credit cards, bank transfers, or instalment payments.' },
    },
    {
      '@type': 'Question',
      name: 'Do you offer postal delivery for card purchases or consignments?',
      acceptedAnswer: { '@type': 'Answer', text: 'No. All transactions are conducted face-to-face in Hong Kong only. We do not offer postal or courier delivery for card purchases or sales.' },
    },
  ],
};

const buyHowToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Buy a Graded Trading Card from Appaw Store',
  description: 'Step-by-step guide to purchasing PSA or CGC graded trading cards from Appaw Store in Hong Kong.',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Contact via WhatsApp',
      text: 'Message us on WhatsApp at +852-9285-1189 to inquire about the card. All transactions are in Hong Kong only.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Arrange a face-to-face meetup',
      text: 'We confirm a convenient Hong Kong meetup location. The payer and recipient must be the same person — third-party pickups are not accepted.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Pay and collect your card',
      text: 'Payment by Cash or FPS only at handover. The card is yours upon payment confirmation.',
    },
  ],
};

const sellHowToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Sell or Consign a Graded Trading Card with Appaw Store in Hong Kong',
  description: 'Step-by-step guide to selling or consigning your PSA or CGC graded trading card through Appaw Store in Hong Kong.',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Contact us and get a quote',
      text: 'WhatsApp +852-9285-1189 to initiate consignment. Cards undergo authenticity inspection — we may decline where authenticity cannot be confirmed.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Deliver your card face-to-face',
      text: 'Bring the card to an agreed Hong Kong meetup location. No postal submissions accepted.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Your card is listed with no upfront fee',
      text: 'We list your card on the marketplace. No listing fee — commission only on successful sale. Request a price change anytime; updates go live within 48 hours.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Quarterly stocktake',
      text: 'Every 3 months we contact you to confirm whether to continue listing. No response within 2 months is treated as transfer of ownership to Appaw Store.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Receive payment upon sale',
      text: 'Once sold, we arrange payment to you after deducting the agreed commission fee.',
    },
  ],
};

function buildProductJsonLd(cards: TradingCard[]) {
  const BASE = 'https://appaw.store';

  const items = cards.map((card, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Product',
      name: `${card.name} — ${card.company} ${Number.isInteger(card.grade) ? card.grade : card.grade.toFixed(1)}${card.isBlackLabel ? ' Black Label' : ''}`,
      description: `${card.company} ${Number.isInteger(card.grade) ? card.grade : card.grade.toFixed(1)} graded ${card.name}${card.set ? ` from ${card.set}` : ''}${card.language ? `, ${card.language} edition` : ''}`,
      image: card.image
        ? `${BASE}${card.image}`
        : card.bundleCards?.[0]?.image
          ? `${BASE}${card.bundleCards[0].image}`
          : undefined,
      brand: { '@type': 'Brand', name: card.company },
      category: 'Graded Trading Cards',
      offers: {
        '@type': 'Offer',
        price: card.price,
        priceCurrency: card.currency,
        availability: card.sold ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
        url: `${BASE}/business/card-trading/${card.id}/`,
        seller: { '@type': 'Organization', name: 'Appaw Store' },
      },
      ...(card.certNumber ? { gtin: card.certNumber } : {}),
    },
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Graded Trading Cards for Sale',
    numberOfItems: items.length,
    itemListElement: items,
  };
}

async function getCards(): Promise<TradingCard[]> {
  const filePath = path.join(process.cwd(), 'public', 'data', 'trade-card.json');
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw) as TradingCard[];
}

export default async function CardTradingLayout({ children }: { children: React.ReactNode }) {
  const cards = await getCards();
  const productJsonLd = buildProductJsonLd(cards);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(tradingFaqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buyHowToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(sellHowToJsonLd) }} />
      {children}
    </>
  );
}
