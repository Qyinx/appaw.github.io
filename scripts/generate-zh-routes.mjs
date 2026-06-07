import fs from 'fs';
import path from 'path';

const routes = [
  { slug: 'about', layout: true, meta: 'zhAboutMetadata' },
  { slug: 'privacy', layout: false, meta: 'zhPrivacyMetadata' },
  { slug: 'products/psa-protectors', layout: true, meta: 'zhPsaProtectorsMetadata' },
  { slug: 'business', layout: true, meta: 'zhBusinessMetadata' },
  { slug: 'business/card-trading', layout: true, meta: 'zhCardTradingMetadata' },
  { slug: 'business/psa-protector', redirect: '/zh/products/psa-protectors/' },
  { slug: 'tools/card-centering', layout: false, meta: 'zhCenteringMetadata' },
  { slug: 'guides', layout: true, meta: 'zhGuidesIndexMetadata' },
  { slug: 'collection', layout: true, meta: 'zhCollectionMetadata' },
  { slug: 'collection/list', layout: false, meta: 'zhCollectionListMetadata' },
  { slug: 'collection/auth', layout: false, meta: 'zhCollectionMetadata' },
  { slug: 'collection/card/new', layout: false, meta: 'zhNewCardMetadata' },
  { slug: 'collection/card/edit', layout: false, meta: 'zhEditCardMetadata' },
  { slug: 'style-guide', layout: false, meta: 'zhStyleGuideMetadata' },
  { slug: 'admin/trade-cards', layout: false, meta: 'zhAdminTradeMetadata' },
];

const root = 'src/app';

function importPath(slug) {
  const depth = slug.split('/').length + 1;
  return `${'../'.repeat(depth)}${slug}`;
}

for (const r of routes) {
  const zhDir = path.join(root, 'zh', r.slug);
  fs.mkdirSync(zhDir, { recursive: true });
  const enImport = importPath(r.slug);

  if (r.redirect) {
    fs.writeFileSync(
      path.join(zhDir, 'page.tsx'),
      `'use client';\n\nimport { redirect } from 'next/navigation';\n\nexport default function ZhRedirect() {\n  redirect('${r.redirect}');\n}\n`,
    );
    continue;
  }

  if (r.layout) {
    fs.writeFileSync(
      path.join(zhDir, 'layout.tsx'),
      `export { default } from '${enImport}/layout';\nexport { ${r.meta} as metadata } from '@/lib/seo/metadata';\n`,
    );
    fs.writeFileSync(path.join(zhDir, 'page.tsx'), `export { default } from '${enImport}/page';\n`);
  } else {
    fs.writeFileSync(
      path.join(zhDir, 'page.tsx'),
      `export { default } from '${enImport}/page';\nexport { ${r.meta} as metadata } from '@/lib/seo/metadata';\n`,
    );
  }
}

const idDir = path.join(root, 'zh/business/card-trading/[id]');
fs.mkdirSync(idDir, { recursive: true });
fs.writeFileSync(
  path.join(idDir, 'page.tsx'),
  `import Page, {
  generateStaticParams,
  generateMetadata as enGenerateMetadata,
} from '../../../../business/card-trading/[id]/page';
import { zhRouteMetadata } from '@/lib/seo/locale-metadata';
import type { Metadata } from 'next';

export { generateStaticParams };

export async function generateMetadata(
  props: Parameters<typeof enGenerateMetadata>[0],
): Promise<Metadata> {
  const meta = await enGenerateMetadata(props);
  const { id } = await props.params;
  return zhRouteMetadata(meta, \`/business/card-trading/\${id}/\`);
}

export default Page;
`,
);

const guideSlugDir = path.join(root, 'zh/guides/[slug]');
fs.mkdirSync(guideSlugDir, { recursive: true });
fs.writeFileSync(
  path.join(guideSlugDir, 'page.tsx'),
  `import Page, { generateStaticParams } from '../../../guides/[slug]/page';
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

export default Page;
`,
);

const publicPortfolioDir = path.join(root, 'zh/collection/p/[id]');
fs.mkdirSync(publicPortfolioDir, { recursive: true });
fs.writeFileSync(
  path.join(publicPortfolioDir, 'page.tsx'),
  `import Page, {
  generateStaticParams,
  generateMetadata as enGenerateMetadata,
} from '../../../../collection/p/[id]/page';
import { fetchPublicPortfolioRaw } from '@/lib/collection/publicPortfolio';
import { buildPublicPortfolioMetadata } from '@/lib/seo/metadata';
import type { Metadata } from 'next';

export { generateStaticParams };

export async function generateMetadata(
  props: Parameters<typeof enGenerateMetadata>[0],
): Promise<Metadata> {
  const { id } = await props.params;
  const portfolio = await fetchPublicPortfolioRaw(id);
  if (!portfolio) {
    return {
      title: '找不到組合 | Appaw Store',
      robots: { index: false, follow: false },
    };
  }
  return buildPublicPortfolioMetadata(portfolio, id, 'zh');
}

export default Page;
`,
);

console.log('zh mirror routes generated');
