import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: { absolute: 'Redirecting… | Appaw Store' },
  robots: { index: false, follow: true },
  alternates: { canonical: '/zh/products/psa-protectors/' },
};

export default function ZhRedirect() {
  redirect('/zh/products/psa-protectors/');
}
