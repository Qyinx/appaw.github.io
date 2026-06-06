import {
  CardDetailPageContent,
  generateStaticParams,
  generateMetadata as enGenerateMetadata,
} from '../../../../business/card-trading/[id]/page';
import { zhRouteMetadata } from '@/lib/seo/locale-metadata';
import type { Metadata } from 'next';

export { generateStaticParams };

export async function generateMetadata(
  props: Parameters<typeof enGenerateMetadata>[0],
): Promise<Metadata> {
  const meta = await enGenerateMetadata(props);
  const { id } = await props.params;
  return zhRouteMetadata(meta, `/business/card-trading/${id}/`);
}

export default async function ZhCardDetailPage(
  props: { params: Promise<{ id: string }> }
) {
  return CardDetailPageContent({ ...props, language: 'zh' });
}
