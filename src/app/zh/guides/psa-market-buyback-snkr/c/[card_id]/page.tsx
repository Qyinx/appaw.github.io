import type { Metadata } from 'next';
import { generateStaticParams, SnkrCardRoute } from '../../../../../guides/psa-market-buyback-snkr/c/[card_id]/page';
import { snkrCardMetadata } from '@/lib/snkr-buyback/metadata';

export { generateStaticParams };
export const dynamicParams = false;

type PageProps = {
  params: Promise<{ card_id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { card_id } = await params;
  return snkrCardMetadata(card_id, 'zh');
}

export default function ZhSnkrCardPage(props: PageProps) {
  return SnkrCardRoute({ ...props, locale: 'zh' });
}
