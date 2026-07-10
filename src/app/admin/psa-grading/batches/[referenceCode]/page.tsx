import type { Metadata } from 'next';
import GradingBatchDetailClient from './GradingBatchDetailClient';

export const metadata: Metadata = {
  title: 'Batch Detail | PSA Grading Admin',
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ referenceCode: string }>;
};

export default async function PsaGradingBatchDetailPage({ params }: Props) {
  const { referenceCode } = await params;
  return <GradingBatchDetailClient referenceCode={referenceCode} />;
}
