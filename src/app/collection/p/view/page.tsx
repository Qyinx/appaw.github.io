import type { Metadata } from 'next';
import { PublicPortfolioPageClient } from '@/app/collection/components/PublicPortfolioPageClient';

export const metadata: Metadata = {
  title: 'Public Portfolio | Appaw Store',
  robots: { index: false, follow: false },
};

/** Static shell — proxy/_redirects map `/collection/p/:id/` here; client reads id from URL. */
export default function PublicPortfolioViewPage() {
  return <PublicPortfolioPageClient />;
}
