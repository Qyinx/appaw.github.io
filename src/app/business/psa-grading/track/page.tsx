import type { Metadata } from 'next';
import { psaGradingTrackMetadata } from '@/lib/seo/metadata';
import PsaGradingTrackPageShell from './PsaGradingTrackPageShell';

export const metadata: Metadata = psaGradingTrackMetadata;

export default function PsaGradingTrackPage() {
  return <PsaGradingTrackPageShell locale="en" />;
}
