import type { Metadata } from 'next';
import { withLocaleAlternates, zhRouteMetadata } from '@/lib/seo/locale-metadata';
import { getGuideContent, GUIDE_SLUGS, type GuideSlug } from './registry';
import type { GuideLocale } from './types';

const guidesIndexBase: Metadata = {
  title: { absolute: 'Collector Guides – Slab Protection & Grading Tips | Appaw Store' },
  description:
    'Practical guides on 35PT slab protectors, UV storage, PSA 10 centering, and when to grade vs protect your cards. Written for Hong Kong and worldwide TCG collectors.',
  keywords: [
    'graded card guide',
    '35PT slab protector',
    'PSA centering guide',
    'UV protection graded cards',
    '鑑定卡保護',
    '鑑定卡防潮',
    'PSA 10 置中',
  ],
  alternates: { canonical: '/guides/' },
  openGraph: {
    title: 'Collector Guides – Slab Protection & Grading Tips | Appaw Store',
    description:
      'Evergreen how-to guides on slab cases, UV storage, PSA 10 centering, and grading decisions for Pokémon, sports, and TCG collectors.',
    url: 'https://appaw.store/guides/',
    type: 'website',
    images: [{ url: '/images/og-image.png', width: 1200, height: 630, alt: 'Appaw Store Collector Guides' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Collector Guides | Appaw Store',
    description: 'Slab protection, UV storage, PSA centering, and grading tips for TCG collectors.',
    images: ['/images/og-image.png'],
  },
};

export const guidesIndexMetadata = withLocaleAlternates(guidesIndexBase, '/guides/');

export const zhGuidesIndexMetadata = zhRouteMetadata(guidesIndexBase, '/guides/', {
  title: { absolute: '收藏指南 – 鑑定卡保護與置中技巧 | Appaw Store' },
  description:
    '35PT 鑑定卡保護殼選購、防 UV 收納、PSA 10 置中標準、鑑定 vs 先保護的實用指南。適用香港及全球 TCG 收藏家。',
});

export function guideMetadata(slug: GuideSlug, locale: GuideLocale): Metadata {
  const guide = getGuideContent(slug, locale);
  const path = `/guides/${slug}/`;

  const base: Metadata = {
    title: { absolute: `${guide.title} | Appaw Store` },
    description: guide.description,
    alternates: { canonical: path },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: `https://appaw.store${path}`,
      type: 'article',
      publishedTime: guide.published,
      modifiedTime: guide.updated,
      images: [{ url: '/images/og-image.png', width: 1200, height: 630, alt: guide.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.title,
      description: guide.description,
      images: ['/images/og-image.png'],
    },
  };

  if (locale === 'zh') {
    return zhRouteMetadata(base, path, {
      title: { absolute: `${guide.title} | Appaw Store` },
      description: guide.description,
    });
  }

  return withLocaleAlternates(base, path);
}

export function guideMetadataForSlug(slug: string): Metadata | undefined {
  if (!(GUIDE_SLUGS as readonly string[]).includes(slug)) return undefined;
  return guideMetadata(slug as GuideSlug, 'en');
}

export function zhGuideMetadataForSlug(slug: string): Metadata | undefined {
  if (!(GUIDE_SLUGS as readonly string[]).includes(slug)) return undefined;
  return guideMetadata(slug as GuideSlug, 'zh');
}
