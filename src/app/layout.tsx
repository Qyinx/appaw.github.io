import type { Viewport } from 'next';
import Script from 'next/script';
import {
  IBM_Plex_Mono,
  Inter,
  Newsreader,
  Syne,
} from 'next/font/google';
import { LanguageProvider } from '@/context/LanguageContext';
import { SiteShell, Footer } from '@/components/layout';
import { CookieConsent } from '@/components/CookieConsent';
import DocumentMeta from '@/components/DocumentMeta';
import ScrollToTop from '@/components/ScrollToTop';
import { ScrollProgressBar } from '@/components/ScrollProgressBar';
import PageSwitch from '@/components/PageSwitch';
import { Auth0ProviderWrapper } from '@/providers/Auth0Provider';
import AgentDiscoveryLinks from '@/components/AgentDiscoveryLinks';
import StructuredData from '@/components/StructuredData';
import { webSiteJsonLd, storeJsonLd } from '@/lib/seo';
import { rootMetadata } from '@/lib/seo/metadata';
import '@/styles/globals.css';

const GA_ID = 'G-MTFS1VS5S4';
const CLARITY_ID = 'sm2b2ujusi';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
  display: 'swap',
});

export const metadata = rootMetadata;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F3EBDA',
  colorScheme: 'light dark',
};

const fontVariables = [
  inter.variable,
  ibmPlexMono.variable,
  syne.variable,
  newsreader.variable,
].join(' ');

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <StructuredData data={[webSiteJsonLd(), storeJsonLd()]} />
        <AgentDiscoveryLinks />
      </head>
      <body className="bg-surface-frame text-text-primary antialiased">
        {/* GA always loads; Consent Mode defaults denied until CookieConsent grants. */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('consent', 'default', { analytics_storage: 'denied' });
            gtag('config', '${GA_ID}');
          `}
        </Script>
        <Script id="ms-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_ID}");
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
            <PageSwitch />
            <SiteShell>{children}</SiteShell>
            <Footer />
            <CookieConsent />
          </LanguageProvider>
        </Auth0ProviderWrapper>
      </body>
    </html>
  );
}
