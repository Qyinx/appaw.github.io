import type { Metadata } from 'next';

function resolveTitleString(title: Metadata['title']): string | undefined {
  if (typeof title === 'string') return title;
  if (title && typeof title === 'object' && 'absolute' in title && typeof title.absolute === 'string') {
    return title.absolute;
  }
  if (title && typeof title === 'object' && 'default' in title && typeof title.default === 'string') {
    return title.default;
  }
  return undefined;
}

export function localePaths(enPath: string): { en: string; zh: string } {
  const canonical = enPath.endsWith('/') ? enPath : `${enPath}/`;
  const zh = canonical === '/' ? '/zh/' : `/zh${canonical}`;
  return { en: canonical, zh };
}

/** Add hreflang alternates to English-route metadata. */
export function withLocaleAlternates(metadata: Metadata, enPath: string): Metadata {
  const { en, zh } = localePaths(enPath);
  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      canonical: en,
      languages: { en, 'zh-HK': zh, 'x-default': en },
    },
  };
}

/** Metadata for the matching `/zh/...` route (same UI, Chinese canonical + hreflang). */
export function zhRouteMetadata(
  enMetadata: Metadata,
  enPath: string,
  overrides?: Partial<Metadata>,
): Metadata {
  const { en, zh } = localePaths(enPath);
  const title = overrides?.title ?? enMetadata.title;
  const description = overrides?.description ?? enMetadata.description;
  const titleString = resolveTitleString(title);

  return {
    ...enMetadata,
    ...overrides,
    title,
    description,
    alternates: {
      ...enMetadata.alternates,
      ...overrides?.alternates,
      canonical: zh,
      languages: { en, 'zh-HK': zh, 'x-default': en },
    },
    openGraph: {
      ...enMetadata.openGraph,
      ...overrides?.openGraph,
      title: titleString ?? enMetadata.openGraph?.title,
      description: typeof description === 'string' ? description : enMetadata.openGraph?.description,
      url: `https://appaw.store${zh}`,
      locale: 'zh_HK',
      alternateLocale: ['en_US'],
    },
    twitter: {
      ...enMetadata.twitter,
      ...overrides?.twitter,
      title: titleString ?? enMetadata.twitter?.title,
      description: typeof description === 'string' ? description : enMetadata.twitter?.description,
    },
  };
}
