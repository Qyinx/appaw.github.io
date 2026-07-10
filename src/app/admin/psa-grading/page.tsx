import type { Metadata } from 'next';
import { adminTradeMetadata } from '@/lib/seo/metadata';
import GradingDashboardClient from './GradingDashboardClient';

export const metadata: Metadata = {
  ...adminTradeMetadata,
  title: 'PSA Grading Admin | Appaw Store',
};

export default function PsaGradingAdminPage() {
  return <GradingDashboardClient />;
}
