import type { Metadata } from 'next';
import { Suspense } from 'react';
import { psaGradingTrackMetadata } from '@/lib/seo/metadata';
import PsaGradingTrackPageShell from './PsaGradingTrackPageShell';

export const metadata: Metadata = psaGradingTrackMetadata;

export default function PsaGradingTrackPage() {
  return (
    <Suspense fallback={null}>
      <PsaGradingTrackPageShell locale="en" />
    </Suspense>
  );
}
