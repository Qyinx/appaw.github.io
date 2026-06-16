import type { Metadata } from 'next';
import CollectionSettingsClient from '../CollectionSettingsClient';
import { collectionSettingsMetadata } from '@/lib/seo/metadata';

export const metadata = collectionSettingsMetadata;

export default function CollectionSettingsPage() {
  return <CollectionSettingsClient />;
}
