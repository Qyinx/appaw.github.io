import type { Metadata } from 'next';
import SnkrCardImageMapAdmin from '@/components/admin/SnkrCardImageMapAdmin';

export const metadata: Metadata = {
  title: { absolute: 'SNKR 卡圖對照（Admin）| Appaw Store' },
  description: 'Admin 專用：SNKR 買取卡 card_id 與卡面檔名對照。',
  robots: { index: false, follow: false },
  alternates: {
    canonical: '/zh/admin/snkr-buyback-images/',
    languages: {
      'zh-HK': '/zh/admin/snkr-buyback-images/',
      en: '/admin/snkr-buyback-images/',
      'x-default': '/admin/snkr-buyback-images/',
    },
  },
};

export default function SnkrBuybackImagesAdminZhPage() {
  return <SnkrCardImageMapAdmin />;
}
