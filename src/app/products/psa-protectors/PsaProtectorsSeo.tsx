import { PRODUCT_NAME } from '@/lib/product-names';
import { zh } from '@/i18n';
import StructuredData from '@/components/StructuredData';
import { buildPsaProtectorsStructuredData } from '@/lib/seo/psa-protectors-structured-data';

export function PsaProtectorsSeo({ locale }: { locale: 'en' | 'zh' }) {
  return (
    <>
      <StructuredData data={buildPsaProtectorsStructuredData(locale)} />
      <div className="sr-only">
        <h2>{PRODUCT_NAME.zh.seoH1}</h2>
        <p>35PT Graded Card Protector — &gt;95% UV Tempered Glass, N52 Magnetic Closure for PSA 10 &amp; Investment‑Grade Cards</p>
        <p>
          Appaw Store 35PT 鑑定卡保護殼：防UV強化玻璃 + 金屬邊框與 N52 磁吸閉合，專為標準 35PT PSA 及 CGC 鑑定卡提供防刮耐曬保護。香港設計，全球付運。
        </p>
        {zh.psaProtectorPage.overview.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
        {zh.psaProtectorPage.hkGuide.body.map((para, i) => (
          <p key={`guide-${i}`}>{para}</p>
        ))}
        <p>{PRODUCT_NAME.zh.metaDescription}</p>
        <p>合作場地：{PRODUCT_NAME.shop.zh}（{PRODUCT_NAME.shop.en}）</p>
        <p>
          技術規格：尺寸 8.7 × 14.2 × 0.98 cm，重量 74 g，材質防UV強化玻璃及金屬邊框，N52 釹磁鐵磁吸閉合，兼容寶可夢、運動卡及 MTG 鑑定卡。
        </p>
      </div>
    </>
  );
}
