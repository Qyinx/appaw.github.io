import type { Metadata } from 'next';
import LocalLink from '@/components/LocalLink';
import StructuredData from '@/components/StructuredData';
import { COMPANY } from '@/lib/company';
import { webPageJsonLd, breadcrumbJsonLd, faqJsonLd } from '@/lib/seo';
import { supportMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = supportMetadata;

const APP_NAME = 'Card Centering Tools';

const FAQS = [
  {
    q: 'What does Card Centering Tools do?',
    a: 'Card Centering Tools measures trading-card centering on your iPhone or Android phone and can look up PSA submissions you consign through Appaw Store. Centering photos stay on your device.',
  },
  {
    q: 'How do I contact support?',
    a: 'Email support@appaw.store or message us on WhatsApp at +852-9285-1189. We reply in English and Traditional Chinese (Cantonese).',
  },
  {
    q: 'Where can I read the privacy policy?',
    a: 'See appaw.store/privacy for how the website and Card Centering Tools handle data, including on-device photos, Track lookups, and AdMob ads.',
  },
  {
    q: 'How do I clear Track lookup data on my device?',
    a: 'Open Settings in the app and clear lookup history. That also wipes the graded-scan image cache stored on the device.',
  },
] as const;

const webPage = webPageJsonLd({
  name: 'Support – Card Centering Tools | Appaw Store',
  url: 'https://appaw.store/support/',
  datePublished: '2026-11-07',
  dateModified: '2026-11-07',
  publisher: { '@type': 'Organization', name: 'Appaw Store', url: 'https://appaw.store' },
  inLanguage: 'en',
});

const breadcrumb = breadcrumbJsonLd([
  { position: 1, name: 'Home', item: 'https://appaw.store/' },
  { position: 2, name: 'Support', item: 'https://appaw.store/support/' },
]);

const faq = faqJsonLd([...FAQS]);

function SectionDivider({ num }: { num: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-accent-brand text-xs font-mono uppercase tracking-widest">{num}</span>
      <div className="h-px flex-1 bg-border-default" />
    </div>
  );
}

export default function SupportPage() {
  return (
    <>
      <StructuredData data={[webPage, breadcrumb, faq]} />

      <section className="relative bg-surface-bg pt-20 pb-12 overflow-hidden border-b border-border-default">
        <div className="container-custom">
          <p className="section-label mb-8">Help</p>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-text-primary leading-tight mb-4">
            Support
          </h1>
          <p className="text-text-secondary text-sm max-w-2xl leading-relaxed">
            Help for the <strong className="text-text-primary font-semibold">{APP_NAME}</strong> iOS
            and Android app (卡牌置中) from {COMPANY.brandName}.
          </p>
        </div>
      </section>

      <section className="section-padding bg-surface-bg overflow-x-clip">
        <div className="container-custom max-w-3xl min-w-0">
          <p className="text-text-secondary text-lg leading-relaxed mb-10">
            Need help with centering measurement, Track lookups, or anything else in the app? Reach us
            below — we usually reply within one business day.
          </p>

          <div className="mb-10">
            <SectionDivider num="01" />
            <h2 className="text-2xl font-bold font-display text-text-primary mb-4">Contact us</h2>
            <div className="panel p-6 text-sm text-text-secondary space-y-3">
              <p>
                <span className="font-semibold text-text-primary">Email:</span>{' '}
                <a href="mailto:support@appaw.store" className="text-accent-link hover:underline">
                  support@appaw.store
                </a>
              </p>
              <p>
                <span className="font-semibold text-text-primary">WhatsApp:</span>{' '}
                <a
                  href="https://wa.me/85292851189"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-link hover:underline"
                >
                  +852-9285-1189
                </a>
              </p>
              <p>
                <span className="font-semibold text-text-primary">Languages:</span> English, Traditional
                Chinese, Cantonese
              </p>
              <p className="pt-2 border-t border-border-default">
                When you write in, include your device model and OS version plus a short description of the
                issue. Screenshots help if measurement or Track looks wrong.
              </p>
            </div>
          </div>

          <div className="mb-10">
            <SectionDivider num="02" />
            <h2 className="text-2xl font-bold font-display text-text-primary mb-4">Common questions</h2>
            <div className="space-y-6">
              {FAQS.map((item) => (
                <div key={item.q}>
                  <h3 className="text-base font-semibold text-text-primary mb-2">{item.q}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-10">
            <SectionDivider num="03" />
            <h2 className="text-2xl font-bold font-display text-text-primary mb-4">Policies & tools</h2>
            <ul className="list-disc list-inside space-y-2 text-text-secondary text-sm">
              <li>
                <LocalLink href="/privacy" className="text-accent-link hover:underline">
                  Privacy Policy
                </LocalLink>
                {' — '}how the app and website handle your data
              </li>
              <li>
                <LocalLink href="/terms" className="text-accent-link hover:underline">
                  Terms of Service
                </LocalLink>
                {' — '}Appaw Store services, including PSA grading submission
              </li>
              <li>
                <LocalLink href="/tools/card-centering" className="text-accent-link hover:underline">
                  Web Card Centering Tool
                </LocalLink>
                {' — '}browser version of the centering calculator
              </li>
              <li>
                <LocalLink href="/business/psa-grading/track" className="text-accent-link hover:underline">
                  PSA grading track
                </LocalLink>
                {' — '}look up Appaw Store consignments on the web
              </li>
            </ul>
          </div>

          <div className="mb-2">
            <SectionDivider num="04" />
            <h2 className="text-2xl font-bold font-display text-text-primary mb-4">Publisher</h2>
            <div className="panel p-6 text-sm text-text-secondary space-y-1">
              <p className="font-semibold text-text-primary">{COMPANY.legalName}</p>
              <p>Business Registration No. {COMPANY.brNumber}</p>
              <p>Hong Kong</p>
              <p>
                Website:{' '}
                <a href="https://appaw.store" className="text-accent-link hover:underline">
                  appaw.store
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
