import type { Metadata } from 'next';
import { Suspense } from 'react';
import GradingDashboardClient from './GradingDashboardClient';

export const metadata: Metadata = {
  title: 'PSA Grading Admin | Appaw Store',
  robots: { index: false, follow: false },
};

export default function PsaGradingAdminPage() {
  return (
    <Suspense fallback={<p className="text-text-muted text-sm p-6">Loading…</p>}>
      <GradingDashboardClient />
    </Suspense>
  );
}
