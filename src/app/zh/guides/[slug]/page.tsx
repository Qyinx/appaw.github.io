import { generateStaticParams, GuideSlugPageContent } from '../../../guides/[slug]/page';
import { zhGuideMetadataForSlug } from '@/lib/guides/metadata';
import type { Metadata } from 'next';

export { generateStaticParams };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return zhGuideMetadataForSlug(slug) ?? {};
}

export default async function ZhGuideSlugPage(props: { params: Promise<{ slug: string }> }) {
  return GuideSlugPageContent({ ...props, locale: 'zh' });
}
