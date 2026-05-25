import type { Metadata } from 'next';
import CollectionClient from '../CollectionClient';
import { collectionListMetadata } from '@/lib/seo/metadata';

export const metadata = collectionListMetadata;

export default function CollectionListPage() {
  return <CollectionClient />;
}
