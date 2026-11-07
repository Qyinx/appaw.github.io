import type { Metadata } from 'next';
import LocalLink from '@/components/LocalLink';
import StructuredData from '@/components/StructuredData';
import { COMPANY } from '@/lib/company';
import { webPageJsonLd, breadcrumbJsonLd, faqJsonLd } from '@/lib/seo';
import { zhSupportMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = zhSupportMetadata;

const APP_NAME = '卡牌置中（Card Centering Tools）';

const FAQS = [
  {
    q: '卡牌置中 App 有甚麼功能？',
    a: '卡牌置中可於 iPhone 本機量度卡牌置中，亦可查詢經 Appaw Store 代送的 PSA 鑑定進度。置中相片只留在裝置上，不會上傳至我們的伺服器。',
  },
  {
    q: '如何聯絡支援？',
    a: '可電郵 support@appaw.store，或以 WhatsApp 聯絡 +852-9285-1189。我們以英文、繁體中文及廣東話回覆。',
  },
  {
    q: '私隱政策在哪裏？',
    a: '請參閱 appaw.store/zh/privacy，了解網站與卡牌置中 App 如何處理資料，包括本機相片、進度查詢及 AdMob 廣告。',
  },
  {
    q: '如何清除裝置上的進度查詢資料？',
    a: '於 App 的「設定」清除查詢紀錄，同時會清除本機快取的評級掃描圖。',
  },
] as const;

const webPage = webPageJsonLd({
  name: '支援 – 卡牌置中 | Appaw Store',
  url: 'https://appaw.store/zh/support/',
  datePublished: '2026-11-07',
  dateModified: '2026-11-07',
  publisher: { '@type': 'Organization', name: 'Appaw Store', url: 'https://appaw.store' },
  inLanguage: 'zh-HK',
});

const breadcrumb = breadcrumbJsonLd([
  { position: 1, name: '首頁', item: 'https://appaw.store/zh/' },
  { position: 2, name: '支援', item: 'https://appaw.store/zh/support/' },
]);

const faq = faqJsonLd([...FAQS]);

function SectionDivider({ num }: { num: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-accent-brand text-xs font-mono uppercase tracking-widest">{num}</span>
      <div className="h-px flex-1 bg-border-default" />
    </div>
  );
}

export default function ZhSupportPage() {
  return (
    <>
      <StructuredData data={[webPage, breadcrumb, faq]} />

      <section className="relative bg-surface-bg pt-20 pb-12 overflow-hidden border-b border-border-default">
        <div className="container-custom">
          <p className="section-label mb-8">協助</p>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-text-primary leading-tight mb-4">
            支援
          </h1>
          <p className="text-text-secondary text-sm max-w-2xl leading-relaxed">
            {COMPANY.brandName} 的 iOS 應用程式{' '}
            <strong className="text-text-primary font-semibold">{APP_NAME}</strong> 支援頁。
          </p>
        </div>
      </section>

      <section className="section-padding bg-surface-bg overflow-x-clip">
        <div className="container-custom max-w-3xl min-w-0">
          <p className="text-text-secondary text-lg leading-relaxed mb-10">
            如對置中量度、進度查詢或其他 App 功能有疑問，請以下列方式聯絡我們——通常於一個工作天內回覆。
          </p>

          <div className="mb-10">
            <SectionDivider num="01" />
            <h2 className="text-2xl font-bold font-display text-text-primary mb-4">聯絡我們</h2>
            <div className="panel p-6 text-sm text-text-secondary space-y-3">
              <p>
                <span className="font-semibold text-text-primary">電郵：</span>{' '}
                <a href="mailto:support@appaw.store" className="text-accent-link hover:underline">
                  support@appaw.store
                </a>
              </p>
              <p>
                <span className="font-semibold text-text-primary">WhatsApp：</span>{' '}
                <a
                  href="https://wa.me/85292851189"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-link hover:underline"
                >
                  +852-9285-1189
                </a>
              </p>
              <p>
                <span className="font-semibold text-text-primary">語言：</span> 英文、繁體中文、廣東話
              </p>
              <p className="pt-2 border-t border-border-default">
                來信時請附上 iOS 版本與問題簡述；若量度或進度顯示異常，截圖會更有幫助。
              </p>
            </div>
          </div>

          <div className="mb-10">
            <SectionDivider num="02" />
            <h2 className="text-2xl font-bold font-display text-text-primary mb-4">常見問題</h2>
            <div className="space-y-6">
              {FAQS.map((item) => (
                <div key={item.q}>
                  <h3 className="text-base font-semibold text-text-primary mb-2">{item.q}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-10">
            <SectionDivider num="03" />
            <h2 className="text-2xl font-bold font-display text-text-primary mb-4">相關政策與工具</h2>
            <ul className="list-disc list-inside space-y-2 text-text-secondary text-sm">
              <li>
                <LocalLink href="/privacy" className="text-accent-link hover:underline">
                  私隱保護政策
                </LocalLink>
                {' — '}網站與 App 如何處理資料
              </li>
              <li>
                <LocalLink href="/terms" className="text-accent-link hover:underline">
                  服務條款
                </LocalLink>
                {' — '}Appaw Store 服務（包括 PSA評級代送）
              </li>
              <li>
                <LocalLink href="/tools/card-centering" className="text-accent-link hover:underline">
                  網頁版卡牌置中工具
                </LocalLink>
                {' — '}瀏覽器版置中計算器
              </li>
              <li>
                <LocalLink href="/business/psa-grading/track" className="text-accent-link hover:underline">
                  PSA評級進度查詢
                </LocalLink>
                {' — '}於網頁查詢 Appaw Store 代送批次
              </li>
            </ul>
          </div>

          <div className="mb-2">
            <SectionDivider num="04" />
            <h2 className="text-2xl font-bold font-display text-text-primary mb-4">發行者</h2>
            <div className="panel p-6 text-sm text-text-secondary space-y-1">
              <p className="font-semibold text-text-primary">{COMPANY.legalName}</p>
              <p>商業登記號碼 {COMPANY.brNumber}</p>
              <p>香港</p>
              <p>
                網站：{' '}
                <a href="https://appaw.store" className="text-accent-link hover:underline">
                  appaw.store
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
