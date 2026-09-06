import type { Metadata } from 'next';
import { CardTradingViewClient } from './CardTradingViewClient';

export const metadata: Metadata = {
  title: 'Card | Appaw Store',
  robots: { index: false, follow: false },
};

/** Static shell — unknown marketplace IDs rewrite here; client reads id from the URL. */
export default function CardTradingViewPage() {
  return <CardTradingViewClient />;
}
