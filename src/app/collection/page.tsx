import type { Metadata } from 'next';
import CollectionLandingClient from './CollectionLandingClient';

export const metadata: Metadata = {
  title: 'My Collection | Appaw Store',
  description: 'Track your personal graded card collection — log buy prices, grades, cert numbers, and listing prices in one private dashboard.',
  robots: { index: false, follow: false },
};

export default function CollectionPage() {
  return <CollectionLandingClient />;
}
