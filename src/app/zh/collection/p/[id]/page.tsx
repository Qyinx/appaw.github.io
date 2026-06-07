import Page, {
  generateStaticParams,
  generateMetadata as enGenerateMetadata,
} from '../../../../collection/p/[id]/page';
import { fetchPublicPortfolioRaw } from '@/lib/collection/publicPortfolio';
import { buildPublicPortfolioMetadata } from '@/lib/seo/metadata';
import type { Metadata } from 'next';

export { generateStaticParams };

export async function generateMetadata(
  props: Parameters<typeof enGenerateMetadata>[0],
): Promise<Metadata> {
  const { id } = await props.params;
  const portfolio = await fetchPublicPortfolioRaw(id);
  if (!portfolio) {
    return {
      title: '找不到組合 | Appaw Store',
      robots: { index: false, follow: false },
    };
  }
  return buildPublicPortfolioMetadata(portfolio, id, 'zh');
}

export default Page;
