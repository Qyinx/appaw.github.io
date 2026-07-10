import type { Metadata } from 'next';
import GradingCustomerOrderDetailClient from './GradingCustomerOrderDetailClient';

export const metadata: Metadata = {
  title: 'Customer Order | PSA Grading Admin',
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ orderId: string }>;
};

export default async function PsaGradingCustomerOrderPage({ params }: Props) {
  const { orderId } = await params;
  const parsed = Number(orderId);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return <p className="text-accent-danger text-sm p-6">Invalid customer order id.</p>;
  }
  return <GradingCustomerOrderDetailClient orderId={parsed} />;
}
