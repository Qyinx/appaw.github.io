import type { Metadata } from 'next';
import GradingBatchViewClient from './GradingBatchViewClient';

export const metadata: Metadata = {
  title: 'Batch Detail | PSA Grading Admin',
  robots: { index: false, follow: false },
};

/** Static shell — _redirects map `/admin/psa-grading/batches/:code/` here; client reads code from URL. */
export default function PsaGradingBatchViewPage() {
  return <GradingBatchViewClient />;
}
