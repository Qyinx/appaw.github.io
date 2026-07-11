import type { Metadata } from 'next';
import { psaGradingMetadata } from '@/lib/seo/metadata';
import PsaGradingHubPageShell from './PsaGradingHubPageShell';

export const metadata: Metadata = psaGradingMetadata;

export default function PsaGradingPage() {
  return <PsaGradingHubPageShell locale="en" />;
}
