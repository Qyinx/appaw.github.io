import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StructuredData from '@/components/StructuredData';
import GuideArticle from '@/components/guides/GuideArticle';
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd, howToJsonLd } from '@/lib/seo';
import { GUIDE_SLUGS, getGuideContent, isGuideSlug, type GuideSlug } from '@/lib/guides/registry';
import { guideMetadataForSlug } from '@/lib/guides/metadata';
import type { GuideLocale } from '@/lib/guides/types';

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

function guideStructuredData(slug: GuideSlug, locale: GuideLocale) {
  const guide = getGuideContent(slug, locale);
  const isZh = locale === 'zh';
  const pageUrl = isZh
    ? `https://appaw.store/zh/guides/${slug}/`
    : `https://appaw.store/guides/${slug}/`;

  const article = articleJsonLd({
    headline: guide.title,
    description: guide.lead,
    url: pageUrl,
    datePublished: guide.published,
    dateModified: guide.updated,
    inLanguage: isZh ? 'zh-HK' : 'en',
    image: guide.heroImage
      ? `https://appaw.store${guide.heroImage.replace('/images/', '/images-optimized/')}`
      : 'https://appaw.store/images/og-image.png',
  });

  const breadcrumb = breadcrumbJsonLd([
    { position: 1, name: isZh ? '首頁' : 'Home', item: isZh ? 'https://appaw.store/zh/' : 'https://appaw.store/' },
    {
      position: 2,
      name: isZh ? '指南' : 'Guides',
      item: isZh ? 'https://appaw.store/zh/guides/' : 'https://appaw.store/guides/',
    },
    { position: 3, name: guide.title, item: pageUrl },
  ]);

  const structuredData: Record<string, unknown>[] = [article, breadcrumb];
  if (guide.faq?.length) {
    structuredData.push(faqJsonLd(guide.faq));
  }

  if (slug === 'identify-fake-psa-slabs') {
    structuredData.push(
      howToJsonLd({
        name: guide.title,
        description: guide.lead,
        step: isZh
          ? [
              {
                '@type': 'HowToStep',
                name: '線上證書查詢',
                text: '至 psacard.com/cert 輸入認證編號，核對照片、年份、角色、等級與特殊標記是否與實物一致。',
              },
              {
                '@type': 'HowToStep',
                name: 'UV 黑光燈測試',
                text: '以 UV 燈檢查標籤正反面。#43 後正面應有隱藏 PSA 字樣；背面應有六個微型標誌。',
              },
              {
                '@type': 'HowToStep',
                name: '外殼觸感與結構',
                text: '確認立體 Logo、「21」字樣、內槽直角與平整焊接邊。',
              },
              {
                '@type': 'HowToStep',
                name: '放大鏡檢查標籤',
                text: '依證書編號世代傾斜標籤，放大確認 CLCT 或 PSA 微型小字。',
              },
              {
                '@type': 'HowToStep',
                name: '卡片、賣家與交易檢查',
                text: '檢查卡面品相、賣家警示訊號，高價交易優先選有爭議保障的平台。',
              },
            ]
          : [
              {
                '@type': 'HowToStep',
                name: 'Online cert lookup',
                text: 'Enter the cert number at psacard.com/cert and confirm photo, year, subject, grade, and marks match the slab.',
              },
              {
                '@type': 'HowToStep',
                name: 'UV blacklight test',
                text: 'Check label front and back under UV. Post-#43 fronts show hidden PSA text; backs show six micro logos.',
              },
              {
                '@type': 'HowToStep',
                name: 'Shell feel and build',
                text: 'Verify raised logo, "21" stamp, square inner corners, and flat welded edges.',
              },
              {
                '@type': 'HowToStep',
                name: 'Label under magnification',
                text: 'Tilt and magnify hologram microtext by cert era (CLCT vs PSA transition window).',
              },
              {
                '@type': 'HowToStep',
                name: 'Card, seller, and purchase checks',
                text: 'Inspect card quality, seller red flags, and buy through platforms with dispute protection when stakes are high.',
              },
            ],
      }),
    );
  }

  if (slug === 'psa-10-centering-requirements') {
    structuredData.push(
      howToJsonLd({
        name: isZh ? '量度卡牌置中是否達 PSA 10' : 'Measure card centering for PSA 10',
        description: guide.lead,
        step: isZh
          ? [
              {
                '@type': 'HowToStep',
                name: '平整拍攝',
                text: '正面與背面用平整掃描或正上方照片。斜角會扭曲邊框比例。',
              },
              {
                '@type': 'HowToStep',
                name: '量度水平邊框',
                text: '較寬側 ÷（左+右）×100。正面兩軸需 ≤55/45。',
              },
              {
                '@type': 'HowToStep',
                name: '量度垂直邊框',
                text: '量度上下邊框。背面需 ≤75/25 才符合 PSA 10。',
              },
              {
                '@type': 'HowToStep',
                name: '對照等級門檻',
                text: '用置中工具或卡尺比對 PSA 10、9、8 門檻再送鑑。',
              },
            ]
          : [
              {
                '@type': 'HowToStep',
                name: 'Photograph flat',
                text: 'Use a flat scan or straight-on photo for front and back. Angled shots skew border ratios.',
              },
              {
                '@type': 'HowToStep',
                name: 'Measure horizontal borders',
                text: 'Divide the wider left or right border by total horizontal border width. Front must be ≤55/45.',
              },
              {
                '@type': 'HowToStep',
                name: 'Measure vertical borders',
                text: 'Repeat for top and bottom. Back must be ≤75/25 for PSA 10.',
              },
              {
                '@type': 'HowToStep',
                name: 'Compare to grade targets',
                text: 'Use the centering tool or calipers to read pass/fail against PSA 10, 9, and 8 thresholds before submitting.',
              },
            ],
      }),
    );
  }

  return structuredData;
}

export async function GuideSlugPageContent({
  params,
  locale,
}: PageProps & { locale: GuideLocale }) {
  const { slug } = await params;

  if (!isGuideSlug(slug)) {
    notFound();
  }

  return (
    <>
      <StructuredData data={guideStructuredData(slug, locale)} />
      <GuideArticle slug={slug} />
    </>
  );
}

export default async function GuideSlugPage(props: PageProps) {
  return GuideSlugPageContent({ ...props, locale: 'en' });
}
