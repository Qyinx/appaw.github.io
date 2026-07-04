import type { Metadata } from 'next';
import { withLocaleAlternates, zhRouteMetadata } from '@/lib/seo/locale-metadata';
import { getGuideContent, GUIDE_SLUGS, type GuideSlug } from './registry';
import type { GuideContent, GuideLocale } from './types';

const GUIDE_KEYWORDS: Partial<Record<GuideSlug, string[]>> = {
  'psa-grading-standards': [
    'PSA grading standards',
    'PSA 10 Gem Mint',
    'PSA qualifier',
    'PSA OC off-center',
    'PSA grade scale',
    'graded card record sale',
    'PSA 鑑定標準',
    'PSA 10 Gem Mint',
    'PSA 置中要求',
    'PSA Qualifier',
    '裸卡送鑑',
    '寶可夢 PSA 鑑定',
  ],
  'identify-fake-psa-slabs': [
    'fake PSA slab',
    'PSA cert verification',
    'UV blacklight PSA slab',
    'PSA label hologram',
    'PSA microtext',
    'counterfeit graded card',
    'psacard cert lookup',
    '假 PSA 鑑定殼',
    'PSA 證書查詢',
    'UV 黑光燈 鑑定卡',
    '假鑑定卡辨識',
    'PSA 全息標籤',
  ],
  'psa-10-centering-requirements': [
    'PSA 10 centering',
    'PSA 55/45 centering',
    'PSA 10 vs PSA 9',
    'card centering tool',
    'Gem Mint centering',
    'PSA 10 置中',
    'PSA 55/45',
    'PSA 10 對中要求',
    '置中測量',
    '裸卡送鑑',
  ],
  'grade-or-protect-first': [
    'grade vs protect cards',
    'when to submit PSA',
    'graded slab protection',
    'raw card grading',
    'PSA submit threshold',
    '裸卡送鑑',
    '鑑定卡保護',
    '先送鑑還是保護',
    'PSA 10 保護殼',
  ],
  'uv-protection-graded-cards': [
    'UV protection graded cards',
    'PSA slab UV damage',
    'graded card humidity',
    'Hong Kong card storage',
    '鑑定卡防 UV',
    '鑑定卡防潮',
    '香港卡牌收納',
    'UV 保護殼',
  ],
  'display-graded-cards': [
    'display graded cards',
    'PSA slab display',
    'graded card shelf setup',
    'slab display case',
    '鑑定卡展示',
    'PSA 展示架',
    '鑑定卡陳列',
  ],
  'regrade-or-reholder': [
    'PSA regrade',
    'PSA reholder',
    'regrade downgrade risk',
    'PSA slab refresh',
    'PSA重評',
    'PSA換殼',
    'Regrade 降分',
    '鑑定卡換殼',
  ],
  'choose-35pt-slab-protector': [
    '35PT slab protector',
    'PSA slab case size',
    'graded card case fit',
    'PSA CGC protector',
    '35PT 保護殼',
    '鑑定卡保護殼',
    'PSA 磚尺寸',
    '35PT 鑑定殼',
  ],
};

function guideOgImage(guide: GuideContent): string {
  if (guide.heroImage) {
    return guide.heroImage.replace('/images/', '/images-optimized/');
  }
  return '/images/og-image.png';
}

const guidesIndexBase: Metadata = {
  title: { absolute: 'Collector Guides – Slab Protection & Grading Tips | Appaw Store' },
  description:
    'Practical guides on 35PT slab protectors, UV storage, PSA 10 centering, fake PSA slab checks, regrade vs reholder, and when to grade vs protect. Stakes-first copy for Hong Kong and worldwide TCG collectors.',
  keywords: [
    'graded card display case',
    'display graded cards',
    'PSA slab display',
    'graded card case',
    'PSA card protector',
    '35PT slab case',
    'PSA centering guide',
    'UV protection graded cards',
    'PSA卡殼',
    '鑑定卡殼',
    'PSA卡保護殼',
    '鑑定卡保護',
    '鑑定卡防潮',
    'PSA 10 置中',
    'fake PSA slab',
    'PSA cert verification',
    'UV blacklight PSA authentication',
    'PSA label hologram',
    'PSA microtext CLCT',
    '假 PSA 鑑定殼',
    'PSA regrade',
    'PSA reholder',
    'regrade downgrade',
    'PSA重評',
    'PSA換殼',
  ],
  alternates: { canonical: '/guides/' },
  openGraph: {
    title: 'Collector Guides – Slab Protection & Grading Tips | Appaw Store',
    description:
      'Evergreen how-to guides on slab cases, UV storage, PSA 10 centering, fake PSA authentication (cert #43 UV, #27/#5xxxxxxx label eras), and grading decisions for Pokémon, sports, and TCG collectors.',
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
    '35PT PSA卡殼、鑑定卡殼及 PSA卡保護殼選購指南，另含防 UV 收納、PSA 10 置中標準、假 PSA 鑑定殼辨識（#43 UV、#27/#5xxxxxxx 標籤世代）、鑑定 vs 先保護。適用香港及全球 TCG 收藏家。',
});

export function guideMetadata(slug: GuideSlug, locale: GuideLocale): Metadata {
  const guide = getGuideContent(slug, locale);
  const path = `/guides/${slug}/`;
  const ogImage = guideOgImage(guide);
  const keywords = GUIDE_KEYWORDS[slug];

  const base: Metadata = {
    title: { absolute: `${guide.title} | Appaw Store` },
    description: guide.lead,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: path },
    openGraph: {
      title: guide.title,
      description: guide.lead,
      url: `https://appaw.store${path}`,
      type: 'article',
      publishedTime: guide.published,
      modifiedTime: guide.updated,
      images: [{ url: ogImage, width: 1200, height: 630, alt: guide.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.title,
      description: guide.lead,
      images: [ogImage],
    },
  };

  if (locale === 'zh') {
    return zhRouteMetadata(base, path, {
      title: { absolute: `${guide.title} | Appaw Store` },
      description: guide.lead,
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
