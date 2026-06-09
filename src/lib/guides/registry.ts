import type { GuideContent, GuideLocale, GuideRegistryEntry } from './types';
import choose35ptEn from './content/en/choose-35pt-slab-protector';
import uvProtectionEn from './content/en/uv-protection-graded-cards';
import psa10CenteringEn from './content/en/psa-10-centering-requirements';
import gradeOrProtectEn from './content/en/grade-or-protect-first';
import identifyFakePsaEn from './content/en/identify-fake-psa-slabs';
import displayGradedEn from './content/en/display-graded-cards';
import choose35ptZh from './content/zh/choose-35pt-slab-protector';
import uvProtectionZh from './content/zh/uv-protection-graded-cards';
import psa10CenteringZh from './content/zh/psa-10-centering-requirements';
import gradeOrProtectZh from './content/zh/grade-or-protect-first';
import identifyFakePsaZh from './content/zh/identify-fake-psa-slabs';
import displayGradedZh from './content/zh/display-graded-cards';

export const GUIDE_SLUGS = [
  'choose-35pt-slab-protector',
  'uv-protection-graded-cards',
  'psa-10-centering-requirements',
  'grade-or-protect-first',
  'identify-fake-psa-slabs',
  'display-graded-cards',
] as const;

export type GuideSlug = (typeof GUIDE_SLUGS)[number];

export const GUIDE_REGISTRY: GuideRegistryEntry[] = [
  { slug: 'choose-35pt-slab-protector', published: '2026-06-07', updated: '2026-06-07' },
  { slug: 'uv-protection-graded-cards', published: '2026-06-07', updated: '2026-06-07' },
  { slug: 'psa-10-centering-requirements', published: '2026-06-07', updated: '2026-06-07' },
  { slug: 'grade-or-protect-first', published: '2026-06-07', updated: '2026-06-07' },
  { slug: 'identify-fake-psa-slabs', published: '2026-06-08', updated: '2026-06-08' },
  { slug: 'display-graded-cards', published: '2026-06-09', updated: '2026-06-09' },
];

const CONTENT: Record<GuideLocale, Record<GuideSlug, GuideContent>> = {
  en: {
    'choose-35pt-slab-protector': choose35ptEn,
    'uv-protection-graded-cards': uvProtectionEn,
    'psa-10-centering-requirements': psa10CenteringEn,
    'grade-or-protect-first': gradeOrProtectEn,
    'identify-fake-psa-slabs': identifyFakePsaEn,
    'display-graded-cards': displayGradedEn,
  },
  zh: {
    'choose-35pt-slab-protector': choose35ptZh,
    'uv-protection-graded-cards': uvProtectionZh,
    'psa-10-centering-requirements': psa10CenteringZh,
    'grade-or-protect-first': gradeOrProtectZh,
    'identify-fake-psa-slabs': identifyFakePsaZh,
    'display-graded-cards': displayGradedZh,
  },
};

export function isGuideSlug(slug: string): slug is GuideSlug {
  return (GUIDE_SLUGS as readonly string[]).includes(slug);
}

export function getGuideContent(slug: GuideSlug, locale: GuideLocale): GuideContent {
  return CONTENT[locale][slug];
}

export function getAllGuides(locale: GuideLocale): GuideContent[] {
  return GUIDE_SLUGS.map((slug) => CONTENT[locale][slug]);
}

export function getRelatedGuides(slug: GuideSlug, locale: GuideLocale): GuideContent[] {
  const current = CONTENT[locale][slug];
  return current.relatedSlugs
    .filter(isGuideSlug)
    .map((related) => CONTENT[locale][related]);
}
