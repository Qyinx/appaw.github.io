import type { Metadata } from 'next';
import GradingBatchViewClient from './GradingBatchViewClient';

export const metadata: Metadata = {
  title: 'Batch Detail | PSA Grading Admin',
  robots: { index: false, follow: false },
};

/** Static shell — dev rewrites + GitHub Pages 404 fallback map pretty URLs here; client reads code from URL. */
export default function PsaGradingBatchViewPage() {
  return <GradingBatchViewClient />;
}
