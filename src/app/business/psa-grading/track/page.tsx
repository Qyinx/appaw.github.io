import type { Metadata } from 'next';
import { Suspense } from 'react';
import PsaGradingTrackClient from './PsaGradingTrackClient';
import { psaGradingTrackMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = psaGradingTrackMetadata;

export default function PsaGradingTrackPage() {
  return (
    <Suspense fallback={null}>
      <PsaGradingTrackClient />
    </Suspense>
  );
}
