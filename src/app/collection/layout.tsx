import type { Metadata } from 'next';
import { collectionLayoutMetadata } from '@/lib/seo/metadata';

export const metadata = collectionLayoutMetadata;

export default function CollectionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
