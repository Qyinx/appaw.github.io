import type { Metadata } from 'next';
import { collectionAuthMetadata } from '@/lib/seo/metadata';

export const metadata = collectionAuthMetadata;

export default function CollectionAuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
