import type { Metadata } from 'next';
import { Suspense } from 'react';
import GradingIntakeClient from './GradingIntakeClient';

export const metadata: Metadata = {
  title: 'New Intake | PSA Grading Admin',
  robots: { index: false, follow: false },
};

export default function PsaGradingIntakePage() {
  return (
    <Suspense fallback={<p className="text-text-muted text-sm">Loading…</p>}>
      <GradingIntakeClient />
    </Suspense>
  );
}
