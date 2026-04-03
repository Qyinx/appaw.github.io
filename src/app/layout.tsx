import type { Metadata } from 'next';
import { LanguageProvider } from '@/context/LanguageContext';
import { Header, Footer } from '@/components/layout';
import { CookieConsent } from '@/components/CookieConsent';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Appaw Store - PSA Card Aluminum Protector',
    template: '%s | Appaw Store',
  },
  description: 'Premium PSA Card Aluminum Protector with >95% UV-blocking glass, N52 magnetic closure, and precision aluminum frame. Designed for collectors to showcase and protect their prized graded cards.',
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
    title: 'Appaw Store – PSA Card Aluminum Protector',
    description: 'Premium PSA Card Aluminum Protector with >95% UV-blocking glass and N52 magnetic closure. Designed for collectors to protect and display their prized graded cards.',
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
    title: 'Appaw Store - PSA Card Aluminum Protector',
    description: 'Premium aluminum protector with >95% UV protection for PSA graded cards. Designed for collectors.',
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
  description: 'Premium PSA Card Aluminum Protector for collectors in Hong Kong',
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
          image: 'https://appaw.store/images-optimized/describe/sell%205.png',
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
            shippingDetails: {
              '@type': 'OfferShippingDetails',
              shippingRate: {
                '@type': 'MonetaryAmount',
                value: '0',
                currency: 'USD',
              },
              shippingDestination: {
                '@type': 'DefinedRegion',
                addressCountry: 'US',
              },
              deliveryTime: {
                '@type': 'ShippingDeliveryTime',
                handlingTime: {
                  '@type': 'QuantitativeValue',
                  minValue: 1,
                  maxValue: 7,
                  unitText: 'Day',
                },
                transitTime: {
                  '@type': 'QuantitativeValue',
                  minValue: 3,
                  maxValue: 7,
                  unitText: 'Day',
                },
              },
            },
            hasMerchantReturnPolicy: {
              '@type': 'MerchantReturnPolicy',
              applicableCountry: 'HK',
              returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
              merchantReturnDays: 15,
              returnMethod: 'https://schema.org/ReturnByMail',
              returnFees: 'https://schema.org/FreeReturn',
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
