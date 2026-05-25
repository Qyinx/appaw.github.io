import { promises as fs } from 'fs';
import path from 'path';
import type { TradingCard } from '@/types/trading-card';
import { en } from '@/i18n';
import CardTradingPage from './CardTradingClient';
import StructuredData from '@/components/StructuredData';
import { itemListJsonLd, faqJsonLd, howToJsonLd } from '@/lib/seo';

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

function buildItems(cards: TradingCard[]) {
  const BASE = 'https://appaw.store';

  return cards.map((card, i) => ({
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
}

// FAQPage — trading guide Q&As, scoped to /business/card-trading/ only
const tradingFaqJsonLd = faqJsonLd([
  ...en.tradingGuide.buy.faq.items,
  ...en.tradingGuide.sell.faq.items,
]);

const buyHowToJsonLd = howToJsonLd({
  name: 'How to Buy a Graded Trading Card from Appaw Store',
  description: 'Step-by-step guide to purchasing PSA or CGC graded trading cards from Appaw Store in Hong Kong.',
  step: [
    { position: 1, '@type': 'HowToStep', name: 'Message us on WhatsApp with card name and offer price', text: 'Send the card name and your offer price to +852-9285-1189 on WhatsApp. We will confirm availability and agree on a final price.' },
    { position: 2, '@type': 'HowToStep', name: 'Complete payment', text: 'Pay via Cash, FPS, or Wise (HKD settlement). For Hong Kong meetups, payment is made at handover. For international orders, payment is required before shipping.' },
    { position: 3, '@type': 'HowToStep', name: 'Receive your card', text: 'For Hong Kong meetups, collect your card on the spot. For international orders, we ship via DAP (Delivered At Place) — shipping costs and import duties are borne by the buyer.' },
  ],
});

const sellHowToJsonLd = howToJsonLd({
  name: 'How to Sell or Consign a Graded Trading Card with Appaw Store in Hong Kong',
  description: 'Step-by-step guide to selling or consigning your PSA or CGC graded trading card through Appaw Store in Hong Kong.',
  step: [
    { position: 1, '@type': 'HowToStep', name: 'Contact us and get a quote', text: 'WhatsApp +852-9285-1189 to initiate consignment. Cards undergo authenticity inspection — we may decline where authenticity cannot be confirmed.' },
    { position: 2, '@type': 'HowToStep', name: 'Deliver your card face-to-face', text: 'Bring the card to an agreed Hong Kong meetup location. No postal submissions accepted.' },
    { position: 3, '@type': 'HowToStep', name: 'Your card is listed with no upfront fee', text: 'We list your card on the marketplace. No listing fee — commission only on successful sale. Request a price change anytime; updates go live within 48 hours.' },
    { position: 4, '@type': 'HowToStep', name: 'Quarterly stocktake', text: 'Every 3 months we contact you to confirm whether to continue listing. No response within 2 months is treated as transfer of ownership to Appaw Store.' },
    { position: 5, '@type': 'HowToStep', name: 'Receive payment upon sale', text: 'Once sold, we arrange payment to you after deducting the agreed commission fee.' },
  ],
});

export default async function Page() {
  const cards = await getCards();
  const items = buildItems(cards);
  const itemList = itemListJsonLd('Graded Trading Cards for Sale', items);

  return (
    <>
      <StructuredData data={[itemList, tradingFaqJsonLd, buyHowToJsonLd, sellHowToJsonLd]} />
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
        <p>
          Appaw Store specialises in high-value and investment-grade graded cards — from grail Pokémon singles to
          blue-chip sports cards. Our zero-fee consignment service is trusted by serious collectors and alternative
          asset investors across Hong Kong and internationally. Face-to-face meetups available in Hong Kong;
          DAP international shipping accepted worldwide.
        </p>
      </div>
      <CardTradingPage initialCards={cards} />
    </>
  );
}
