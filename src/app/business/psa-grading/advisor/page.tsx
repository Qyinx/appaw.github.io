import type { Metadata } from 'next';
import { psaGradingAdvisorMetadata } from '@/lib/seo/metadata';
import PsaGradingAdvisorPageShell from './PsaGradingAdvisorPageShell';

export const metadata: Metadata = psaGradingAdvisorMetadata;

export default function PsaGradingAdvisorPage() {
  return <PsaGradingAdvisorPageShell locale="en" />;
}
