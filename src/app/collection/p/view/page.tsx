import type { Metadata } from 'next';
import { PublicPortfolioPageClient } from '@/app/collection/components/PublicPortfolioPageClient';

export const metadata: Metadata = {
  title: 'Public Portfolio | Appaw Store',
  robots: { index: false, follow: false },
};

/** Static shell — pretty `/collection/p/:id/` URLs rewrite here. Meta noindex; not in sitemap. */
export default function PublicPortfolioViewPage() {
  return <PublicPortfolioPageClient />;
}
