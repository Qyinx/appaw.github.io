import StructuredData from '@/components/StructuredData';
import GuidesIndex from '@/components/guides/GuidesIndex';
import { breadcrumbJsonLd, itemListJsonLd } from '@/lib/seo';
import { getAllGuides } from '@/lib/guides/registry';
import { guidesIndexMetadata } from '@/lib/guides/metadata';

export const metadata = guidesIndexMetadata;

const breadcrumb = breadcrumbJsonLd([
  { position: 1, name: 'Home', item: 'https://appaw.store/' },
  { position: 2, name: 'Guides', item: 'https://appaw.store/guides/' },
]);

const itemList = itemListJsonLd(
  'Appaw Store Collector Guides',
  getAllGuides('en').map((guide, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: guide.title,
    url: `https://appaw.store/guides/${guide.slug}/`,
  })),
);

export default function GuidesPage() {
  return (
    <>
      <StructuredData data={[breadcrumb, itemList]} />
      <GuidesIndex />
    </>
  );
}
