import { MetadataRoute } from 'next';
import { SITEMAP_PUBLIC_PATHS, enUrl, zhUrl } from '@/lib/seo/sitemap-config';

export const dynamic = 'force-static';

const PRIVACY_LAST_MOD = new Date('2026-04-17');

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return SITEMAP_PUBLIC_PATHS.flatMap(({ path, changeFrequency, priority }) => {
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
}
