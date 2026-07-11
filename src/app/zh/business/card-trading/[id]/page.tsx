import Page, {
  generateMetadata as enGenerateMetadata,
} from '../../../../business/card-trading/[id]/page';
import { cardTradingGenerateStaticParams } from '@/lib/marketplace-card-trading-static';
import { zhRouteMetadata } from '@/lib/seo/locale-metadata';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return cardTradingGenerateStaticParams();
}

export async function generateMetadata(
  props: Parameters<typeof enGenerateMetadata>[0],
): Promise<Metadata> {
  const meta = await enGenerateMetadata(props);
  const { id } = await props.params;
  return zhRouteMetadata(meta, `/business/card-trading/${id}/`);
}

export default Page;
