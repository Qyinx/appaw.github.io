import type { Metadata } from 'next';
import { PublicPortfolioPageClient } from '@/app/collection/components/PublicPortfolioPageClient';

export const metadata: Metadata = {
  title: '公開組合 | Appaw Store',
  robots: { index: false, follow: false },
};

/** Static shell — pretty `/zh/collection/p/:id/` URLs rewrite here. Meta noindex; not in sitemap. */

export default function ZhPublicPortfolioViewPage() {
  return <PublicPortfolioPageClient />;
}
