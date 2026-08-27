import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: { absolute: 'Redirecting… | Appaw Store' },
  robots: { index: false, follow: false },
  alternates: { canonical: '/zh/products/psa-protectors/' },
};

/** Legacy URL — product moved to /zh/products/psa-protectors/. */
export default function ZhPSAProtectorRedirect() {
  redirect('/zh/products/psa-protectors/');
}
