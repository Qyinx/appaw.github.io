import type { Viewport } from 'next';
import {
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Playfair_Display,
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

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-sans',
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
  weight: ['600', '700'],
  variable: '--font-syne',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata = rootMetadata;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FBFAF6',
  colorScheme: 'light dark',
};

const fontVariables = [
  ibmPlexSans.variable,
  ibmPlexMono.variable,
  syne.variable,
  playfair.variable,
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
      <body className="bg-surface-bg text-text-primary antialiased">
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
