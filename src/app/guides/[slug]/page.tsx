import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StructuredData from '@/components/StructuredData';
import GuideArticle from '@/components/guides/GuideArticle';
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from '@/lib/seo';
import { GUIDE_SLUGS, getGuideContent, isGuideSlug, type GuideSlug } from '@/lib/guides/registry';
import { guideMetadataForSlug } from '@/lib/guides/metadata';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return GUIDE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return guideMetadataForSlug(slug) ?? {};
}

export default async function GuideSlugPage({ params }: PageProps) {
  const { slug } = await params;

  if (!isGuideSlug(slug)) {
    notFound();
  }

  const guide = getGuideContent(slug, 'en');
  const pageUrl = `https://appaw.store/guides/${slug}/`;

  const article = articleJsonLd({
    headline: guide.title,
    description: guide.lead,
    url: pageUrl,
    datePublished: guide.published,
    dateModified: guide.updated,
    inLanguage: 'en',
    image: guide.heroImage
      ? `https://appaw.store${guide.heroImage.replace('/images/', '/images-optimized/')}`
      : 'https://appaw.store/images/og-image.png',
  });

  const breadcrumb = breadcrumbJsonLd([
    { position: 1, name: 'Home', item: 'https://appaw.store/' },
    { position: 2, name: 'Guides', item: 'https://appaw.store/guides/' },
    { position: 3, name: guide.title, item: pageUrl },
  ]);

  const structuredData: Record<string, unknown>[] = [article, breadcrumb];
  if (guide.faq?.length) {
    structuredData.push(faqJsonLd(guide.faq));
  }

  return (
    <>
      <StructuredData data={structuredData} />
      <GuideArticle slug={slug} />
    </>
  );
}
