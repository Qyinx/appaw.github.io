import type { Metadata } from 'next';
import CollectionLandingClient from './CollectionLandingClient';
import StructuredData from '@/components/StructuredData';
import { webApplicationJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { collectionMetadata } from '@/lib/seo/metadata';

export const metadata = collectionMetadata;

// Page JSON-LD will be generated via the centralized factories below

export default function CollectionPage() {
  const webApp = webApplicationJsonLd({
    name: 'Appaw Collection Manager',
    description: 'Secure dashboard to add, organize and value trading card collections.',
    url: 'https://appaw.store/collection/',
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'All',
  })

  const breadcrumb = breadcrumbJsonLd([
    { position: 1, name: 'Home', item: 'https://appaw.store/' },
    { position: 2, name: 'My Collection', item: 'https://appaw.store/collection/' },
  ])

  return (
    <>
      <StructuredData data={[webApp, breadcrumb]} />
      <CollectionLandingClient />
    </>
  );
}
