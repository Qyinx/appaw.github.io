import type { Metadata } from 'next';
import StructuredData from '@/components/StructuredData';
import SnkrBuybackBrowsePage from '@/components/guides/SnkrBuybackBrowsePage';
import { snkrBrowseMetadata, snkrBrowseStructuredData } from '@/lib/snkr-buyback/metadata';

export function generateMetadata(): Metadata {
  return snkrBrowseMetadata('en');
}

export default function SnkrBrowsePage() {
  return (
    <>
      <StructuredData data={snkrBrowseStructuredData('en')} />
      <SnkrBuybackBrowsePage />
    </>
  );
}
