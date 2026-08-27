import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: { absolute: 'Redirecting… | Appaw Store' },
  robots: { index: false, follow: false },
  alternates: { canonical: '/products/psa-protectors/' },
};

/** Legacy URL — product moved to /products/psa-protectors/. */
export default function PSAProtectorRedirect() {
  redirect('/products/psa-protectors/');
}
