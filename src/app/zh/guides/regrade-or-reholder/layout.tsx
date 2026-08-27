import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Redirecting… | Appaw Store' },
  robots: { index: false, follow: true },
  alternates: { canonical: '/zh/guides/psa-reholder-guide/' },
};

export default function ZhLegacyRegradeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
