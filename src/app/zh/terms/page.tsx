import StructuredData from '@/components/StructuredData';
import TermsClient from '../../terms/TermsClient';
import { webPageJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { zhTermsMetadata } from '@/lib/seo/metadata';

export const metadata = zhTermsMetadata;

const webPage = webPageJsonLd({
  name: '服務條款 – Appaw Store',
  url: 'https://appaw.store/zh/terms/',
  datePublished: '2026-08-30',
  dateModified: '2026-08-30',
  publisher: { '@type': 'Organization', name: 'Appaw Store', url: 'https://appaw.store' },
  inLanguage: 'zh-HK',
});

const breadcrumb = breadcrumbJsonLd([
  { position: 1, name: '首頁', item: 'https://appaw.store/zh/' },
  { position: 2, name: '服務條款', item: 'https://appaw.store/zh/terms/' },
]);

export default function ZhTermsPage() {
  return (
    <>
      <StructuredData data={[webPage, breadcrumb]} />
      <TermsClient />
    </>
  );
}
