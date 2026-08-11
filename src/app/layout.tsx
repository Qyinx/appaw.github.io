import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { LanguageProvider } from '@/context/LanguageContext';
import { SiteShell, Footer } from '@/components/layout';
import { CookieConsent } from '@/components/CookieConsent';
import DocumentMeta from '@/components/DocumentMeta';
import ScrollToTop from '@/components/ScrollToTop';
import { ScrollProgressBar } from '@/components/ScrollProgressBar';
import { Auth0ProviderWrapper } from '@/providers/Auth0Provider';
import AgentDiscoveryLinks from '@/components/AgentDiscoveryLinks';
import StructuredData from '@/components/StructuredData';
import { webSiteJsonLd, storeJsonLd } from '@/lib/seo';
import { rootMetadata } from '@/lib/seo/metadata';
import { LOCALE_BOOTSTRAP_SCRIPT } from '@/lib/locale-preference';
import '@/styles/globals.css';

export const metadata = rootMetadata;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FBFAF6',
  colorScheme: 'light dark',
};

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
        {/* First-visit locale detect before hydrate (static export — no middleware). */}
        <Script id="locale-bootstrap" strategy="beforeInteractive">
          {LOCALE_BOOTSTRAP_SCRIPT}
        </Script>
        {/* Structured Data for Search Engines & AI */}
        <StructuredData data={[webSiteJsonLd(), storeJsonLd()]} />
        <AgentDiscoveryLinks />
        {/* Language declared via <html lang> and hreflang <link> tags (generated from alternates.languages above) */}
      </head>
      <body className="bg-surface-bg text-text-primary antialiased">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MTFS1VS5S4"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              // Default consent to denied (GDPR compliance)
              gtag('consent', 'default', {
                'analytics_storage': 'denied'
              });

              gtag('config', 'G-MTFS1VS5S4');
            `}
        </Script>
        <Script id="ms-clarity" strategy="afterInteractive">
          {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "sm2b2ujusi");
            `}
        </Script>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ScrollProgressBar />
        <Auth0ProviderWrapper
          domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
          clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
          redirectUri={process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI!}
          audience={process.env.NEXT_PUBLIC_AUTH0_AUDIENCE}
        >
          <LanguageProvider>
            <DocumentMeta />
            <ScrollToTop />
            <SiteShell>{children}</SiteShell>
            <Footer />
            <CookieConsent />
          </LanguageProvider>
        </Auth0ProviderWrapper>
      </body>
    </html>
  );
}
