import type { Metadata } from 'next';
import { Suspense } from 'react';
import { adminTradeMetadata } from '@/lib/seo/metadata';
import GradingDashboardClient from './GradingDashboardClient';

export const metadata: Metadata = {
  ...adminTradeMetadata,
  title: 'PSA Grading Admin | Appaw Store',
};

export default function PsaGradingAdminPage() {
  return (
    <Suspense fallback={<p className="text-text-muted text-sm p-6">Loading…</p>}>
      <GradingDashboardClient />
    </Suspense>
  );
}
