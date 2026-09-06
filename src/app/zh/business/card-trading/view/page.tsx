import type { Metadata } from 'next';
import { CardTradingViewClient } from '@/app/business/card-trading/view/CardTradingViewClient';

export const metadata: Metadata = {
  title: '卡牌 | Appaw Store',
  robots: { index: false, follow: false },
};

export default function ZhCardTradingViewPage() {
  return <CardTradingViewClient />;
}
