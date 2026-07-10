import type { Metadata } from 'next';
import GradingCustomerOrderViewClient from './GradingCustomerOrderViewClient';

export const metadata: Metadata = {
  title: 'Customer Order | PSA Grading Admin',
  robots: { index: false, follow: false },
};

/** Static shell — _redirects map `/admin/psa-grading/orders/:id/` here; client reads id from URL. */
export default function PsaGradingCustomerOrderViewPage() {
  return <GradingCustomerOrderViewClient />;
}
