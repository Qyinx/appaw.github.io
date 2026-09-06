import type { TradingCard } from '@/types/trading-card';
import { en } from '@/i18n';
import CardTradingPage from './CardTradingClient';
import StructuredData from '@/components/StructuredData';
import { itemListJsonLd, faqJsonLd, howToJsonLd, webPageJsonLd } from '@/lib/seo';
import { fetchPublicMarketplaceCardsForBuild } from '@/lib/marketplace/publicCards';
import { absoluteMarketplaceImageUrl } from '@/lib/marketplace/cardImage';
import { Suspense } from 'react';

const BASE = 'https://appaw.store';

function buildItems(cards: TradingCard[]) {
  return cards.map((card, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Product',
      name: `${card.name} — ${card.company} ${Number.isInteger(card.grade) ? card.grade : card.grade.toFixed(1)}${card.isBlackLabel ? ' Black Label' : ''}`,
      description: `${card.company} ${Number.isInteger(card.grade) ? card.grade : card.grade.toFixed(1)} graded ${card.name}${card.set ? ` from ${card.set}` : ''}${card.language ? `, ${card.language} edition` : ''}`,
      image: absoluteMarketplaceImageUrl(card.image || card.bundleCards?.[0]?.image),
      brand: { '@type': 'Brand', name: card.set || 'Appaw Store' },
      category: 'Graded Trading Cards',
      ...(card.certNumber ? { mpn: card.certNumber } : {}),
      offers: {
        '@type': 'Offer',
        price: card.price,
        priceCurrency: card.currency,
        availability: card.sold ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/UsedCondition',
        url: `${BASE}/business/card-trading/${card.id}/`,
        seller: { '@type': 'Organization', name: 'Appaw Store' },
      },
    },
  }));
}

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
  name: 'How to Consign a Graded Trading Card with 138 Arena in Hong Kong',
  description: 'Step-by-step guide to consigning a PSA or CGC graded trading card through 138 Arena, Appaw Store’s partner venue.',
  step: [
    { position: 1, '@type': 'HowToStep', name: 'Contact 138 Arena', text: 'Message 138 Arena on Instagram @138arena. Consignment intake is at 1/F, 522 Jaffe Road, Causeway Bay. Cards undergo authenticity inspection.' },
    { position: 2, '@type': 'HowToStep', name: 'Deliver your card', text: 'Bring the card to 138 Arena in Causeway Bay. Confirm hours on Instagram @138arena.' },
    { position: 3, '@type': 'HowToStep', name: 'Listed at a flat 5%', text: 'Your card is listed on the marketplace. Commission is a flat 5% of the sale price, including listing fees and payment-processor fees. Request a price change anytime; updates go live within 48 hours.' },
    { position: 4, '@type': 'HowToStep', name: 'Quarterly stocktake', text: 'Every 3 months we contact you to confirm whether to continue listing. No response within 2 months is treated as transfer of ownership to Appaw Store.' },
    { position: 5, '@type': 'HowToStep', name: 'Receive payment upon sale', text: 'Once sold, payment is arranged after deducting the 5% commission.' },
  ],
});

export default async function Page() {
  const cards = await fetchPublicMarketplaceCardsForBuild();
  const structuredData = [
    itemListJsonLd('Graded Trading Cards for Sale', buildItems(cards)),
    tradingFaqJsonLd,
    buyHowToJsonLd,
    sellHowToJsonLd,
  ];

  const webPage = webPageJsonLd({
    name: 'Graded Trading Card Marketplace | Appaw Store',
    description: en.cardMarketplace.aeoAnswer,
    url: `${BASE}/business/card-trading/`,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.marketplace-aeo-answer'],
    },
    mainEntity: {
      '@type': 'CollectionPage',
      name: 'Graded Trading Cards for Sale',
      url: `${BASE}/business/card-trading/`,
    },
  });

  return (
    <>
      <StructuredData data={[webPage, ...structuredData]} />
      <Suspense fallback={null}>
        <CardTradingPage />
      </Suspense>
    </>
  );
}
