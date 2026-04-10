import type { Metadata } from 'next';
import { LanguageProvider } from '@/context/LanguageContext';
import { Header, Footer } from '@/components/layout';
import { CookieConsent } from '@/components/CookieConsent';
import { ScrollProgressBar } from '@/components/ScrollProgressBar';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Appaw Store - PSA Card Aluminum Protector & TCG Trading',
    template: '%s | Appaw Store',
  },
  description: 'Premium PSA Card Aluminum Protector with >95% UV-blocking glass, N52 magnetic closure, and precision aluminum frame. Trusted TCG trading & brokerage for graded Pokémon, sports, and MTG cards.',
  keywords: [
    // PSA Protector — Core
    'PSA card protector',
    'PSA card aluminum case',
    'PSA slab protector',
    'aluminum card case',
    'UV protection card case',
    'N52 magnetic card case',
    'graded card protection',
    'PSA 10 protector',
    'PSA 10 display case',
    // PSA Protector — Card types
    'Pokemon card protector',
    'Pokemon PSA slab case',
    'sports card protector',
    'baseball card case',
    'basketball card protector',
    'MTG card protector',
    'trading card display case',
    'card collection display',
    // PSA Protector — Long-tail / Intent
    'best PSA card protector',
    'how to protect PSA graded cards',
    'PSA slab scratch protection',
    'premium card case aluminum',
    'magnetic card display case',
    'card protector UV glass',
    'PSA card protector review',
    'aluminum vs acrylic card case',
    // Bilingual / Chinese
    'PSA卡鋁合金保護殼',
    'PSA卡保護套',
    '鋁合金卡片保護殼',
    '評級卡牌買賣',
    '寶可夢卡牌交易',
    // Card Trading
    'buy graded cards',
    'sell PSA cards',
    'TCG trading Hong Kong',
    'Pokemon card trading',
    'sports card broker',
    'graded card marketplace',
    'card consignment service',
    // Brand
    'Appaw Store',
    'appaw.store',
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
    title: 'Appaw Store – PSA Card Aluminum Protector & TCG Trading',
    description: 'Premium PSA Card Aluminum Protector with >95% UV-blocking glass and N52 magnetic closure. Trusted TCG trading & brokerage for graded cards.',
    url: 'https://appaw.store',
    siteName: 'Appaw Store',
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['zh_HK', 'zh_CN'],
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
    title: 'Appaw Store - PSA Card Aluminum Protector & TCG Trading',
    description: 'Premium aluminum protector with >95% UV protection for PSA graded cards. Trusted TCG trading & brokerage.',
    images: ['/images/og-image.png'],
    creator: '@appaw.store',
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

// WebSite schema — enables Sitelinks Searchbox and GEO site-level identity
const webSiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Appaw Store',
  url: 'https://appaw.store',
  description: 'Premium PSA Card Aluminum Protector and TCG trading & brokerage. Based in Hong Kong, shipping worldwide.',
  inLanguage: ['en', 'zh-HK'],
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://appaw.store/business/card-trading/?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

// Structured Data for SEO & AEO
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'Appaw Store',
  alternateName: ['Appaw', 'APPAW Store'],
  description: 'Premium PSA Card Aluminum Protector and TCG trading & brokerage in Hong Kong',
  url: 'https://appaw.store',
  logo: 'https://appaw.store/images/logo.png',
  image: 'https://appaw.store/images/og-image.png',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'HK',
    addressLocality: 'Hong Kong',
  },
  geo: {
    '@type': 'GeoCoordinates',
    addressCountry: 'HK',
  },
  telephone: '+852-9285-1189',
  email: 'support@appaw.store',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '10:00',
    closes: '22:00',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+852-9285-1189',
    contactType: 'customer service',
    availableLanguage: ['English', 'Chinese', 'Cantonese'],
    areaServed: ['HK', 'US', 'GB', 'CN', 'TW', 'SG', 'JP', 'AU'],
  },
  sameAs: [
    'https://www.instagram.com/appaw.store/',
    'https://www.threads.net/@appaw.store',
    'https://appawstore.etsy.com/',
    'https://www.carousell.com.hk/u/appaw.store/',
  ],
  // Full product & service schemas live on their own pages as single sources of truth.
  // Root Store references them by URL only to avoid duplication.
  makesOffer: [
    { '@type': 'Offer', url: 'https://appaw.store/products/psa-protectors/', name: 'PSA Card Aluminum Protector' },
    { '@type': 'Offer', url: 'https://appaw.store/business/card-trading/', name: 'TCG Trading & Brokerage' },
  ],
};

// FAQ Schema intentionally omitted from root layout.
// Each page owns its FAQPage as a single source:
//   /                    → no FAQ (covered by WebSite + Store schemas)
//   /about/              → aboutFaqJsonLd  (brand Q&As)
//   /business/           → businessFaqJsonLd  (service Q&As)
//   /products/psa-protectors/ → psaFaqJsonLd  (product Q&As, single-sourced from i18n)
//   /business/card-trading/   → tradingFaqJsonLd  (trading Q&As, single-sourced from i18n)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Note: Consider making lang dynamic based on user's language selection in future */}
      <head>
        {/* Google Analytics with Cookie Consent */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-MTFS1VS5S4"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              
              // Default consent to denied (GDPR compliance)
              gtag('consent', 'default', {
                'analytics_storage': 'denied'
              });
              
              gtag('config', 'G-MTFS1VS5S4');
            `,
          }}
        />
        
        {/* Structured Data for Search Engines & AI */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Help AI assistants understand page language context */}
        <meta name="language" content="English, Chinese" />
        <meta name="target-audience" content="Collectors, Small Business Owners, Hong Kong Residents" />
      </head>
      <body>
        <ScrollProgressBar />
        <LanguageProvider>
          <Header />
          <main className="pt-16">
            {children}
          </main>
          <Footer />
          <CookieConsent />
        </LanguageProvider>
      </body>
    </html>
  );
}
