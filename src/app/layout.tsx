import type { Metadata } from 'next';
import { LanguageProvider } from '@/context/LanguageContext';
import { Header, Footer } from '@/components/layout';
import { CookieConsent } from '@/components/CookieConsent';
import DocumentMeta from '@/components/DocumentMeta';
import { ScrollProgressBar } from '@/components/ScrollProgressBar';
import { Auth0ProviderWrapper } from '@/providers/Auth0Provider';
import StructuredData from '@/components/StructuredData';
import { webSiteJsonLd, storeJsonLd } from '@/lib/seo';
import { rootMetadata } from '@/lib/seo/metadata';
import '@/styles/globals.css';

export const metadata = rootMetadata;

// Site-level structured data is rendered via `src/lib/seo` factories and the
// `StructuredData` server component to centralize schema handling.

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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
        <StructuredData data={[webSiteJsonLd(), storeJsonLd()]} />
        {/* Language declared via <html lang> and hreflang <link> tags (generated from alternates.languages above) */}
      </head>
      <body>
        <ScrollProgressBar />
        <Auth0ProviderWrapper
          domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
          clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
          redirectUri={process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI!}
          audience={process.env.NEXT_PUBLIC_AUTH0_AUDIENCE}
        >
          <LanguageProvider>
            <DocumentMeta />
            <Header />
            <main className="pt-16">
              {children}
            </main>
            <Footer />
            <CookieConsent />
          </LanguageProvider>
        </Auth0ProviderWrapper>
      </body>
    </html>
  );
}
