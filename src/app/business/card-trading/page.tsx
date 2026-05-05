import { promises as fs } from 'fs';
import path from 'path';
import type { TradingCard } from '@/types/trading-card';
import { en } from '@/i18n';
import CardTradingPage from './CardTradingClient';

/* ──────────────────────────────────────────
   Server Component — Card Trading Page
   ──────────────────────────────────────────
   Owns all JSON-LD structured data for /business/card-trading/ only.
   Schemas are defined here (not in layout) to prevent them bleeding
   into child routes such as /business/card-trading/[id]/.

   Card data is also read here and forwarded to the interactive
   client component as `initialCards`.
   ────────────────────────────────────────── */

async function getCards(): Promise<TradingCard[]> {
  const filePath = path.join(process.cwd(), 'public', 'data', 'trade-card.json');
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw) as TradingCard[];
}

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

// FAQPage — trading guide Q&As, scoped to /business/card-trading/ only
const tradingFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  publisher: { '@type': 'Organization', name: 'Appaw Store', url: 'https://appaw.store' },
  datePublished: '2024-01-15',
  dateModified: '2026-05-05',
  mainEntity: [
    ...en.tradingGuide.buy.faq.items,
    ...en.tradingGuide.sell.faq.items,
  ].map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
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
      name: 'Message us on WhatsApp with card name and offer price',
      text: 'Send the card name and your offer price to +852-9285-1189 on WhatsApp. We will confirm availability and agree on a final price.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Complete payment',
      text: 'Pay via Cash, FPS, or Wise (HKD settlement). For Hong Kong meetups, payment is made at handover. For international orders, payment is required before shipping.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Receive your card',
      text: 'For Hong Kong meetups, collect your card on the spot. For international orders, we ship via DAP (Delivered At Place) — shipping costs and import duties are borne by the buyer.',
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

export default async function Page() {
  const cards = await getCards();
  const productJsonLd = buildProductJsonLd(cards);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(tradingFaqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buyHowToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(sellHowToJsonLd) }} />
      {/* Server-rendered copy — crawlable by search engines, styled to blend into hero */}
      <div className="sr-only">
        <h1>Buy &amp; Sell PSA Graded Pokémon, Sports &amp; MTG Cards in Hong Kong</h1>
        <p>
          Browse Appaw Store&apos;s curated marketplace of PSA, BGS, and TAG graded trading cards available in Hong Kong
          with international shipping worldwide. We offer zero-fee consignment — list your graded card at no upfront cost
          and pay commission only on a successful sale. Cards available include rare Pokémon, sports cards, and Magic: The
          Gathering (MTG) singles graded by PSA (Professional Sports Authenticator) and BGS (Beckett Grading Services).
          Buy directly via WhatsApp or browse all listings below.
        </p>
      </div>
      <CardTradingPage initialCards={cards} />
    </>
  );
}
