import type { Metadata } from 'next';
import { LanguageProvider } from '@/context/LanguageContext';
import { Header, Footer } from '@/components/layout';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Appaw Store - Card Protection & Consignment Services',
  description: 'Your trusted partner for PSA card protectors and professional consignment services for collectors.',
  keywords: 'PSA card protector, card protection, consignment, trading cards, collectibles',
  authors: [{ name: 'Appaw Store' }],
  openGraph: {
    title: 'Appaw Store - Card Protection & Consignment Services',
    description: 'Your trusted partner for PSA card protectors and professional consignment services for collectors.',
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'zh_HK',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <LanguageProvider>
          <Header />
          <main className="flex-grow pt-16">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
