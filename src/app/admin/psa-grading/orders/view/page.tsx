import type { Metadata } from 'next';
import GradingCustomerOrderViewClient from './GradingCustomerOrderViewClient';

export const metadata: Metadata = {
  title: 'Customer Order | PSA Grading Admin',
  robots: { index: false, follow: false },
};

/** Static shell — dev rewrites + GitHub Pages 404 fallback map pretty URLs here; client reads id from URL. */
export default function PsaGradingCustomerOrderViewPage() {
  return <GradingCustomerOrderViewClient />;
}
