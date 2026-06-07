import type { Metadata } from 'next';
import { PublicPortfolioPageClient } from '@/app/collection/components/PublicPortfolioPageClient';

export const metadata: Metadata = {
  title: '公開組合 | Appaw Store',
  robots: { index: false, follow: false },
};

export default function ZhPublicPortfolioViewPage() {
  return <PublicPortfolioPageClient />;
}
