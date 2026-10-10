import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StructuredData from '@/components/StructuredData';
import SnkrBuybackDetail from '@/components/guides/SnkrBuybackDetail';
import { getSnkrCard, snkrCardIds } from '@/lib/snkr-buyback/cards';
import { snkrCardMetadata, snkrCardStructuredData } from '@/lib/snkr-buyback/metadata';
import type { GuideLocale } from '@/lib/guides/types';

type PageProps = {
  params: Promise<{ card_id: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return snkrCardIds().map((card_id) => ({ card_id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { card_id } = await params;
  return snkrCardMetadata(card_id, 'en');
}

export async function SnkrCardRoute({
  params,
  locale,
}: PageProps & { locale: GuideLocale }) {
  const { card_id } = await params;
  if (!getSnkrCard(card_id)) notFound();

  return (
    <>
      <StructuredData data={snkrCardStructuredData(card_id, locale)} />
      <SnkrBuybackDetail cardId={card_id} />
    </>
  );
}

export default function SnkrCardPage(props: PageProps) {
  return SnkrCardRoute({ ...props, locale: 'en' });
}
