import type { Metadata } from 'next';
import SnkrCardImageMapAdmin from '@/components/admin/SnkrCardImageMapAdmin';

export const metadata: Metadata = {
  title: { absolute: 'SNKR card images (Admin) | Appaw Store' },
  description: 'Admin-only map of SNKR buyback card_id to image filenames.',
  robots: { index: false, follow: false },
  alternates: {
    canonical: '/admin/snkr-buyback-images/',
    languages: {
      'zh-HK': '/zh/admin/snkr-buyback-images/',
      en: '/admin/snkr-buyback-images/',
      'x-default': '/admin/snkr-buyback-images/',
    },
  },
};

export default function SnkrBuybackImagesAdminPage() {
  return <SnkrCardImageMapAdmin />;
}
