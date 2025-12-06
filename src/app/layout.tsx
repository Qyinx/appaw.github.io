import type { Metadata } from 'next';
import { LanguageProvider } from '@/context/LanguageContext';
import { Header, Footer } from '@/components/layout';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Appaw Store - PSA Card Aluminum Protector & Grid Store',
    template: '%s | Appaw Store',
  },
  description: 'Premium PSA Card Aluminum Protector with UV-blocking glass and N52 magnetic closure. Also offering grid store rental spaces in Hong Kong for small businesses.',
  keywords: [
    'PSA card protector',
    'aluminum card case',
    'PSA slab protector',
    'card protection',
    'UV protection card case',
    'magnetic card case',
    'grid store Hong Kong',
    '格仔鋪',
    'Pokemon card protector',
    'sports card protector',
    'trading card display',
    'collectibles',
  ],
  authors: [{ name: 'Appaw Store' }],
  creator: 'Appaw Store',
  publisher: 'Appaw Store',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  metadataBase: new URL('https://appaw.store'),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/',
      'zh-HK': '/',
    },
  },
  openGraph: {
    title: 'Appaw Store - PSA Card Aluminum Protector & Grid Store',
    description: 'Premium PSA Card Aluminum Protector with UV-blocking glass and N52 magnetic closure. Grid store rental in Hong Kong.',
    url: 'https://appaw.store',
    siteName: 'Appaw Store',
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'zh_HK',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Appaw Store - PSA Card Aluminum Protector',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Appaw Store - PSA Card Aluminum Protector',
    description: 'Premium PSA Card Aluminum Protector with UV-blocking glass and N52 magnetic closure.',
    images: ['/images/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes when you have them
    // google: 'your-google-verification-code',
  },
};

// Structured Data for SEO
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'Appaw Store',
  description: 'Premium PSA Card Aluminum Protector and Grid Store rental in Hong Kong',
  url: 'https://appaw.store',
  logo: 'https://appaw.store/images/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+852-9285-1189',
    contactType: 'customer service',
    availableLanguage: ['English', 'Chinese'],
  },
  sameAs: [
    'https://www.instagram.com/appaw.store/',
    'https://www.threads.net/@appaw.store',
    'https://appawstore.etsy.com/',
    'https://www.carousell.com.hk/u/appaw.store/',
  ],
  offers: {
    '@type': 'Offer',
    name: 'PSA Card Aluminum Protector',
    description: 'Industrial-grade aluminum protector with UV-blocking glass and N52 magnetic closure',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
