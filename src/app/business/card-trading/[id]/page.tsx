import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import type { TradingCard } from '@/types/trading-card';
import type { Language } from '@/context/language-context';
import CardDetailClient from './CardDetailClient';
import LocalLink from '@/components/LocalLink';
import StructuredData from '@/components/StructuredData';
import { productJsonLd, breadcrumbJsonLd, faqJsonLd } from '@/lib/seo';
import { localizedHref } from '@/lib/i18n-routing';
import {
  CARD_TRADING_PLACEHOLDER_ID,
  cardTradingGenerateStaticParams,
} from '@/lib/marketplace-card-trading-static';
import { fetchPublicMarketplaceCard } from '@/lib/marketplace/publicCards';
import { absoluteMarketplaceImageUrl } from '@/lib/marketplace/cardImage';

function buildSeoDescription(card: TradingCard): string {
  const grade = Number.isInteger(card.grade) ? String(card.grade) : card.grade.toFixed(1);
  const bl = card.isBlackLabel ? ' Black Label' : '';
  const gradeName = card.grade >= 10 ? 'Gem Mint' : card.grade >= 9 ? 'Mint' : card.grade >= 7 ? 'Near Mint' : '';
  const parts: string[] = [
    `${card.company} ${grade}${bl}${gradeName ? ` (${gradeName})` : ''} graded ${card.name}`,
  ];
  if (card.set) parts.push(`from the ${card.set} set`);
  if (card.number) parts.push(`card #${card.number}`);
  if (card.language && card.language !== 'English') parts.push(`${card.language} edition`);
  if (card.year) parts.push(`(${card.year})`);
  parts.push(
    card.sold
      ? 'This card has been sold. Contact us about similar cards.'
      : `Available at ${card.currency} ${card.price.toLocaleString()}. Contact via WhatsApp.`,
  );
  parts.push('Appaw Store, Hong Kong.');
  return parts.join(', ');
}

function gradeExplanation(card: TradingCard, grade: string, gradeLabel: string): string {
  switch (card.company) {
    case 'PSA':
      return `PSA ${grade} ${gradeLabel} means the card has been independently verified by Professional Sports Authenticator to be in ${gradeLabel.toLowerCase()} condition — no significant surface wear, centering issues, or print defects.`;
    case 'BGS':
      return `BGS ${grade} ${gradeLabel} is a Beckett Grading Services composite score across four sub-grades: centering, corners, edges, and surface — all assessed at the ${gradeLabel.toLowerCase()} level.`;
    case 'CGC':
      return `CGC ${grade} ${gradeLabel} means the card has been authenticated and encapsulated by Certified Guaranty Company at the ${gradeLabel.toLowerCase()} tier.`;
    case 'TAG':
      return `TAG ${grade} ${gradeLabel} means the card has been authenticated and encapsulated by TAG at the ${gradeLabel.toLowerCase()} tier.`;
    default: {
      const _never: never = card.company;
      return _never;
    }
  }
}

export async function generateStaticParams() {
  return cardTradingGenerateStaticParams();
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
): Promise<Metadata> {
  const { id } = await params;
  const card = await fetchPublicMarketplaceCard(id);
  if (!card) return { title: 'Card Not Found | Appaw Store', robots: { index: false, follow: false } };

  const grade = Number.isInteger(card.grade) ? String(card.grade) : card.grade.toFixed(1);
  const bl = card.isBlackLabel ? ' Black Label' : '';
  const title = `${card.name} — ${card.company} ${grade}${bl} | Appaw Store`;
  const description = buildSeoDescription(card);
  const image = absoluteMarketplaceImageUrl(card.image || card.bundleCards?.[0]?.image) || '/images/og-image.png';

  return {
    title,
    description,
    alternates: { canonical: `/business/card-trading/${id}/` },
    openGraph: {
      title,
      description,
      url: `https://appaw.store/business/card-trading/${id}/`,
      type: 'website',
      images: [{ url: image, width: 600, height: 800, alt: card.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${card.name} — ${card.company} ${grade}${bl}`,
      description,
      images: [image],
    },
  };
}

export async function CardDetailPageContent(
  { params, language = 'en' }: { params: Promise<{ id: string }>; language?: Language },
) {
  const { id } = await params;
  if (id === CARD_TRADING_PLACEHOLDER_ID) {
    redirect(localizedHref('/business/card-trading/', language));
  }

  const card = await fetchPublicMarketplaceCard(id);

  if (!card) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-surface-bg text-text-primary">
        <h1 className="text-2xl font-bold mb-4">Card Not Found</h1>
        <LocalLink href="/business/card-trading/" className="text-[#d4a843] hover:underline">← Back to Marketplace</LocalLink>
      </div>
    );
  }

  const grade = Number.isInteger(card.grade) ? String(card.grade) : card.grade.toFixed(1);
  const bl = card.isBlackLabel ? ' Black Label' : '';
  const seoDesc = buildSeoDescription(card);
  const cardUrl = `https://appaw.store/business/card-trading/${id}/`;
  const image = absoluteMarketplaceImageUrl(card.image || card.bundleCards?.[0]?.image);

  const hasListPrice = typeof card.price === 'number' && Number.isFinite(card.price);

  const productLd = productJsonLd({
    name: `${card.name} — ${card.company} ${grade}${bl}`,
    description: seoDesc,
    url: cardUrl,
    ...(image ? { image } : {}),
    brand: { '@type': 'Brand', name: card.set || 'Appaw Store' },
    category: 'Graded Trading Cards',
    sku: card.id,
    ...(card.certNumber ? { mpn: card.certNumber } : {}),
    itemCondition: 'https://schema.org/UsedCondition',
    additionalProperty: [
      ...(card.set ? [{ '@type': 'PropertyValue', name: 'Set', value: card.set }] : []),
      ...(card.number ? [{ '@type': 'PropertyValue', name: 'Card Number', value: card.number }] : []),
      ...(card.language ? [{ '@type': 'PropertyValue', name: 'Language', value: card.language }] : []),
      { '@type': 'PropertyValue', name: 'Year', value: String(card.year) },
      { '@type': 'PropertyValue', name: 'Grading Company', value: card.company },
      { '@type': 'PropertyValue', name: 'Grade', value: grade },
      ...(card.isBlackLabel ? [{ '@type': 'PropertyValue', name: 'Designation', value: 'Black Label' }] : []),
      ...(card.certNumber ? [{ '@type': 'PropertyValue', name: 'Cert Number', value: card.certNumber }] : []),
    ],
    ...(hasListPrice
      ? {
          offers: {
            '@type': 'Offer',
            price: card.price,
            priceCurrency: card.currency || 'HKD',
            availability: card.sold ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/UsedCondition',
            url: cardUrl,
            image: image || undefined,
            seller: { '@type': 'Organization', name: 'Appaw Store' },
          },
        }
      : {}),
  });

  const breadcrumb = breadcrumbJsonLd([
    { position: 1, name: 'Home', item: 'https://appaw.store/' },
    { position: 2, name: 'Services', item: 'https://appaw.store/business/' },
    { position: 3, name: 'Card Trading', item: 'https://appaw.store/business/card-trading/' },
    { position: 4, name: card.name, item: cardUrl },
  ]);

  const gradeLabel = card.grade >= 10 ? 'Gem Mint' : card.grade >= 9 ? 'Mint' : card.grade >= 7 ? 'Near Mint' : `Grade ${grade}`;

  const faqLd = faqJsonLd([
    {
      q: `Is the ${card.name} (${card.company} ${grade}) available for purchase?`,
      a: card.sold
        ? `This ${card.name} (${card.company} ${grade}) has been sold. Contact Appaw Store via WhatsApp to inquire about similar cards or upcoming inventory.`
        : `Yes. The ${card.name} graded ${card.company} ${grade} is currently in stock at ${card.currency} ${card.price.toLocaleString()}. Contact Appaw Store via WhatsApp to purchase.`,
    },
    {
      q: `What does ${card.company} ${grade} mean?`,
      a: gradeExplanation(card, grade, gradeLabel),
    },
    {
      q: 'How do I buy a graded card from Appaw Store?',
      a: 'Contact Appaw Store directly via WhatsApp. All transactions are handled personally by our team in Hong Kong to ensure a secure and transparent purchase experience.',
    },
    ...(card.set
      ? [
          {
            q: `What set is this ${card.name} from?`,
            a: `This card is from the ${card.set}${card.number ? `, card number ${card.number}` : ''}${card.year ? `, released in ${card.year}` : ''}.`,
          },
        ]
      : []),
    ...(card.language
      ? [
          {
            q: `What language is this ${card.name} card?`,
            a: `This is a ${card.language} language edition of the ${card.name}${card.set ? ` from ${card.set}` : ''}.`,
          },
        ]
      : []),
  ]);

  return (
    <>
      <StructuredData data={[productLd, breadcrumb, faqLd]} />
      <CardDetailClient card={card} />
    </>
  );
}

export default async function CardDetailPage(
  props: { params: Promise<{ id: string }> },
) {
  return CardDetailPageContent({ ...props, language: 'en' });
}
