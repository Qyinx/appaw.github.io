import type { Metadata } from 'next';
import { LanguageProvider } from '@/context/LanguageContext';
import { Header, Footer } from '@/components/layout';
import { CookieConsent } from '@/components/CookieConsent';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Appaw Store - PSA Card Aluminum Protector & Grid Store',
    template: '%s | Appaw Store',
  },
  description: 'Premium PSA Card Aluminum Protector with >95% UV-blocking glass, N52 magnetic closure, and precision aluminum frame. Also offering Grid Store (格仔鋪) rental spaces in Hong Kong for collectors and small businesses to showcase and sell products.',
  keywords: [
    // PSA Protector Keywords
    'PSA card protector',
    'PSA card aluminum case',
    'PSA slab protector',
    'aluminum card case',
    'UV protection card case',
    'N52 magnetic card case',
    'Pokemon card protector',
    'sports card protector',
    'trading card display',
    'graded card protection',
    'PSA 10 protector',
    'card collection display',
    // Grid Store Keywords
    'grid store Hong Kong',
    '格仔鋪香港',
    '格仔鋪租',
    'consignment store HK',
    'retail space rental Hong Kong',
    'display grid rental',
    'small business Hong Kong',
    'collectibles store HK',
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
    title: 'Appaw Store - PSA Card Aluminum Protector & Grid Store (格仔鋪)',
    description: 'Premium PSA Card Aluminum Protector with >95% UV-blocking glass and N52 magnetic closure. Grid Store (格仔鋪) rental in Hong Kong for collectors and small businesses.',
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
    title: 'Appaw Store - PSA Card Aluminum Protector & Grid Store',
    description: 'Premium aluminum protector with >95% UV protection for PSA graded cards. Grid Store rental in Hong Kong.',
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

// Structured Data for SEO & AEO
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'Appaw Store',
  alternateName: ['Appaw', 'APPAW Store'],
  description: 'Premium PSA Card Aluminum Protector and Grid Store (格仔鋪) rental in Hong Kong',
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
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+852-9285-1189',
    contactType: 'customer service',
    availableLanguage: ['English', 'Chinese', 'Cantonese'],
    areaServed: ['HK', 'US', 'GB', 'CN', 'TW', 'SG'],
  },
  sameAs: [
    'https://www.instagram.com/appaw.store/',
    'https://www.threads.net/@appaw.store',
    'https://appawstore.etsy.com/',
    'https://www.carousell.com.hk/u/appaw.store/',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Products and Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: 'PSA Card Aluminum Protector',
          description: 'Industrial-grade aluminum protector with >95% UV-blocking glass and N52 magnetic closure for PSA graded cards. Fits standard 35PT PSA slabs including Pokemon, sports cards, and MTG. Features precision aluminum frame, anti-fade glass lens, and magnetic seal without screws.',
          category: 'Card Protection',
          material: ['Aluminum', 'Glass'],
          brand: {
            '@type': 'Brand',
            name: 'Appaw Store',
          },
          offers: {
            '@type': 'Offer',
            price: '17.99',
            priceCurrency: 'USD',
            priceValidUntil: '2026-12-31',
            availability: 'https://schema.org/InStock',
            url: 'https://appaw.store/products/psa-protectors/',
            seller: {
              '@type': 'Organization',
              name: 'Appaw Store',
            },
          },
          additionalProperty: [
            {
              '@type': 'PropertyValue',
              name: 'UV Protection',
              value: '>95%',
            },
            {
              '@type': 'PropertyValue',
              name: 'Dimensions',
              value: '8.7cm x 14.2cm x 0.98cm',
            },
            {
              '@type': 'PropertyValue',
              name: 'Weight',
              value: '74g',
            },
            {
              '@type': 'PropertyValue',
              name: 'Magnet Type',
              value: 'N52',
            },
          ],
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Grid Store Rental (格仔鋪)',
          alternateName: '香港格仔鋪租賃',
          description: 'Display grid space rental service for small businesses and collectors in Hong Kong. Rent a retail display grid to showcase and sell your products without running a physical store. We handle customer transactions and provide prime retail location access.',
          serviceType: 'Retail Space Rental',
          provider: {
            '@type': 'Organization',
            name: 'Appaw Store',
          },
          areaServed: {
            '@type': 'City',
            name: 'Hong Kong',
          },
          offers: {
            '@type': 'Offer',
            availability: 'https://schema.org/InStock',
            url: 'https://appaw.store/business/grid-store/',
          },
        },
      },
    ],
  },
};

// FAQ Schema for Answer Engine Optimization (AEO)
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a PSA Card Aluminum Protector?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The PSA Card Aluminum Protector is a premium protective case for PSA graded card slabs. It features an industrial-grade aluminum frame, UV-blocking glass with >95% protection, and N52 magnetic closure. It protects your valuable graded cards from drops, scratches, UV damage, and dust while providing a gallery-worthy display.',
      },
    },
    {
      '@type': 'Question',
      name: 'What PSA cards fit in the aluminum protector?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The protector fits standard 35PT PSA graded slabs, including Pokemon cards, sports cards (basketball, baseball, football), and Magic: The Gathering cards. It does NOT fit thick memorabilia or jersey cards, BGS slabs, or CGC slabs.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the dimensions and weight of the PSA protector?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The PSA Card Aluminum Protector measures 8.7cm width x 14.2cm length x 0.98cm height and weighs 74g. It is made of aluminum and glass with >95% UV protection.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is a Grid Store (格仔鋪) in Hong Kong?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A Grid Store (格仔鋪) is a retail space rental service where you can rent individual display grid compartments to showcase and sell your products. Located in Hong Kong, it is perfect for small businesses, collectors, and sellers who want retail presence without operating a full store. Appaw Store handles customer transactions and provides access to foot traffic.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does Grid Store rental work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Grid Store rental is simple: (1) Choose your grid space size, (2) Set up your product display in your rented grid, (3) We handle all customer transactions and sales, (4) Collect your earnings regularly. You do not need to be present at the store.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where can I buy PSA Card Aluminum Protectors?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can purchase PSA Card Aluminum Protectors from Appaw Store through our Etsy shop (appawstore.etsy.com) or Carousell Hong Kong (carousell.com.hk/u/appaw.store). You can also contact us via WhatsApp at +852-9285-1189.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does the aluminum protector have UV protection?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, the PSA Card Aluminum Protector features UV-blocking glass with greater than 95% UV protection. This helps preserve the vibrant colors of your chrome, holographic, and vintage cards by blocking harmful ultraviolet light that causes fading.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I contact Appaw Store?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Contact Appaw Store via WhatsApp at +852-9285-1189, Instagram @appaw.store, or through our Etsy and Carousell shops. We serve customers in Hong Kong, USA, UK, and internationally.',
      },
    },
  ],
};

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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        {/* Help AI assistants understand page language context */}
        <meta name="language" content="English, Chinese" />
        <meta name="target-audience" content="Collectors, Small Business Owners, Hong Kong Residents" />
      </head>
      <body className="min-h-screen flex flex-col">
        <LanguageProvider>
          <Header />
          <main className="flex-grow pt-16">
            {children}
          </main>
          <Footer />
          <CookieConsent />
        </LanguageProvider>
      </body>
    </html>
  );
}
