import type { Metadata } from 'next';
import { PublicPortfolioView } from '@/app/collection/components/PublicPortfolioView';
import {
  fetchPublicPortfolio,
  fetchPublicPortfolioIdsForBuild,
  fetchPublicPortfolioRaw,
} from '@/lib/collection/publicPortfolio';
import { buildPublicPortfolioMetadata } from '@/lib/seo/metadata';

interface PageProps {
  params: Promise<{ id: string }>;
}

/** Required for `output: 'export'` — pre-render each public portfolio at build time. */
export async function generateStaticParams() {
  const ids = await fetchPublicPortfolioIdsForBuild();
  return ids.map(id => ({ id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const portfolio = await fetchPublicPortfolioRaw(id);
  if (!portfolio) {
    return {
      title: 'Portfolio Not Found | Appaw Store',
      robots: { index: false, follow: false },
    };
  }
  return buildPublicPortfolioMetadata(portfolio, id, 'en');
}

export default async function PublicPortfolioPage({ params }: PageProps) {
  const { id } = await params;
  const portfolio = await fetchPublicPortfolio(id);
  return <PublicPortfolioView portfolio={portfolio} />;
}
