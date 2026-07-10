import type { Metadata } from 'next';
import { Suspense } from 'react';
import GradingBatchNewClient from './GradingBatchNewClient';

export const metadata: Metadata = {
  title: 'New Batch | PSA Grading Admin',
  robots: { index: false, follow: false },
};

export default function PsaGradingBatchNewPage() {
  return (
    <Suspense fallback={<p className="text-text-muted text-sm">Loading…</p>}>
      <GradingBatchNewClient />
    </Suspense>
  );
}
