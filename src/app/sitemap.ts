import { MetadataRoute } from 'next';
import { SITEMAP_ICON_URLS, SITEMAP_PUBLIC_PATHS, enUrl, zhUrl } from '@/lib/seo/sitemap-config';
import { GUIDE_SLUGS } from '@/lib/guides/registry';

export const dynamic = 'force-static';

const PRIVACY_LAST_MOD = new Date('2026-04-17');

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const guidePaths = [
    { path: '/guides/', changeFrequency: 'monthly' as const, priority: 0.7 },
    ...GUIDE_SLUGS.map((slug) => ({
      path: `/guides/${slug}/`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  const allPaths = [...SITEMAP_PUBLIC_PATHS, ...guidePaths];

  const pageEntries: MetadataRoute.Sitemap = allPaths.flatMap(({ path, changeFrequency, priority }) => {
    const lastModified = path === '/privacy/' ? PRIVACY_LAST_MOD : now;

    const en = enUrl(path);
    const zh = zhUrl(path);

    const alternates = {
      languages: {
        en,
        'zh-HK': zh,
        'x-default': en,
      },
    };

    return [
      {
        url: en,
        lastModified,
        changeFrequency,
        priority,
        alternates,
      },
      {
        url: zh,
        lastModified,
        changeFrequency,
        priority: Math.max(priority - 0.02, 0.1),
        alternates,
      },
    ];
  });

  const iconEntries: MetadataRoute.Sitemap = SITEMAP_ICON_URLS.map((url) => ({
    url,
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.1,
  }));

  return [...pageEntries, ...iconEntries];
}
