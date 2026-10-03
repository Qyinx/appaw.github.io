import type { Viewport } from 'next';
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
import { Auth0ProviderWrapper } from '@/providers/Auth0Provider';
import AgentDiscoveryLinks from '@/components/AgentDiscoveryLinks';
import StructuredData from '@/components/StructuredData';
import { webSiteJsonLd, storeJsonLd } from '@/lib/seo';
import { rootMetadata } from '@/lib/seo/metadata';
import '@/styles/globals.css';

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
        {/* GA + Clarity load only after cookie accept (see CookieConsent). */}
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
