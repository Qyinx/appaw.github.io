import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Collection | Appaw Store',
  description: 'Manage your personal graded card collection — track buy prices, grades, cert numbers, and more.',
  robots: { index: false, follow: false },
};

export default function CollectionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
