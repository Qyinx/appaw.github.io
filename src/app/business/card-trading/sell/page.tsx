import { cardTradingSellMetadata } from '@/lib/seo/metadata';
import SellClient from './SellClient';

export const metadata = cardTradingSellMetadata;

export default function CardTradingSellPage() {
  return <SellClient />;
}
