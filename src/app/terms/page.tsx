import StructuredData from '@/components/StructuredData';
import TermsClient from './TermsClient';
import { webPageJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { termsMetadata } from '@/lib/seo/metadata';

export const metadata = termsMetadata;

const webPage = webPageJsonLd({
  name: 'Terms of Service – Appaw Store',
  url: 'https://appaw.store/terms/',
  datePublished: '2026-08-30',
  dateModified: '2026-08-30',
  publisher: { '@type': 'Organization', name: 'Appaw Store', url: 'https://appaw.store' },
  inLanguage: 'en',
});

const breadcrumb = breadcrumbJsonLd([
  { position: 1, name: 'Home', item: 'https://appaw.store/' },
  { position: 2, name: 'Terms of Service', item: 'https://appaw.store/terms/' },
]);

export default function TermsPage() {
  return (
    <>
      <StructuredData data={[webPage, breadcrumb]} />
      <TermsClient />
    </>
  );
}
