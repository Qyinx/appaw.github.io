import type { Metadata } from 'next';
import { Suspense } from 'react';
import PsaGradingHubClient from './PsaGradingHubClient';
import { psaGradingMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = psaGradingMetadata;

export default function PsaGradingPage() {
  return <PsaGradingHubClient />;
}
