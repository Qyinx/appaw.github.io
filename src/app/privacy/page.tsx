import type { Metadata } from 'next';
import StructuredData from '@/components/StructuredData';
import { COMPANY } from '@/lib/company';
import { webPageJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { privacyMetadata } from '@/lib/seo/metadata';

export const metadata = privacyMetadata;

const webPage = webPageJsonLd({
  name: 'Privacy Policy – Appaw Store',
  url: 'https://appaw.store/privacy/',
  datePublished: '2026-04-17',
  dateModified: '2026-11-05',
  publisher: { '@type': 'Organization', name: 'Appaw Store', url: 'https://appaw.store' },
  inLanguage: 'en',
});

const breadcrumb = breadcrumbJsonLd([
  { position: 1, name: 'Home', item: 'https://appaw.store/' },
  { position: 2, name: 'Privacy Policy', item: 'https://appaw.store/privacy/' },
]);

function SectionDivider({ num }: { num: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-accent-brand text-xs font-mono uppercase tracking-widest">{num}</span>
      <div className="h-px flex-1 bg-border-default" />
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <StructuredData data={[webPage, breadcrumb]} />

      <section className="relative bg-surface-bg pt-20 pb-12 overflow-hidden border-b border-border-default">

        <div className="container-custom">
          <p className="section-label mb-8">Legal</p>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-text-primary leading-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-text-secondary text-sm">Last updated: 5 November 2026</p>
        </div>
      </section>

      <section className="section-padding bg-surface-bg overflow-x-clip">
        <div className="container-custom max-w-3xl min-w-0">

          <p className="text-text-secondary text-lg leading-relaxed mb-10">
            Appaw Store (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates{' '}
            <a href="https://appaw.store" target="_blank" rel="noopener noreferrer" className="text-accent-link hover:underline">appaw.store</a>.
            This policy explains what data we collect, how we use it, and your rights as a visitor or customer.
          </p>

          <div className="mb-10">
            <SectionDivider num="01" />
            <h2 className="text-2xl font-bold font-display text-text-primary mb-4">Data We Collect</h2>

            <h3 className="text-base font-semibold text-text-primary mb-2">Automatically collected data (Google Analytics 4)</h3>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              When you visit our website, Google Analytics 4 automatically collects:
            </p>
            <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm mb-6">
              <li>Pages visited and time spent</li>
              <li>Approximate geographic location (country / city level)</li>
              <li>Device type, browser, and operating system</li>
              <li>Referral source (how you found us)</li>
            </ul>
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              This analytics data is aggregated and anonymised. Separately, some site features collect limited
              details you choose to submit — for example a registered phone number and reference number on the
              PSA grading track page, and appointment details when you book a drop-off. We do not use analytics
              tools to harvest your name or email from ordinary browsing.
            </p>

            <h3 className="text-base font-semibold text-text-primary mb-2">Automatically collected data (Microsoft Clarity)</h3>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              We partner with Microsoft Clarity to capture how you use and interact with our website through
              behavioral metrics, heatmaps, and session replay to improve our products and website experience.
              Clarity may collect:
            </p>
            <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm mb-4">
              <li>Pages visited, clicks, scrolls, and mouse movements</li>
              <li>Session recordings and heatmap data</li>
              <li>Device type, browser, and screen resolution</li>
              <li>Referral source and approximate geographic location</li>
            </ul>
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              Website usage data is captured using first- and third-party cookies and other tracking technologies
              to determine page popularity and online activity. We use this information for site optimization
              and to understand how visitors navigate our content. For more information about how Microsoft
              collects and uses your data, see the{' '}
              <a href="https://www.microsoft.com/privacy/privacystatement" target="_blank" rel="noopener noreferrer" className="text-accent-link hover:underline">
                Microsoft Privacy Statement
              </a>.
            </p>

            <h3 className="text-base font-semibold text-text-primary mb-2">Data you provide voluntarily</h3>
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              If you contact us via WhatsApp (+852-9285-1189) or email (support@appaw.store), we receive
              the contact details and message content you choose to share. If you use the PSA grading track
              page, you submit a registered phone number and reference number to look up your batch. If you
              book a drop-off appointment, we receive the booking details you enter. This information is used
              solely to respond to your enquiry, provide tracking, or facilitate a transaction.
            </p>

            <h3 className="text-base font-semibold text-text-primary mb-2">Card Centering Tools mobile app</h3>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              The <strong>Card Centering Tools</strong> app (卡牌置中), provided by Appaw Store Limited, measures
              trading-card centering on your device and can track PSA submissions you consign through Appaw Store.
            </p>
            <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm mb-4">
              <li>
                Photos you take or choose for centering stay on the device and are not uploaded to our servers.
              </li>
              <li>
                If you use Track, the phone number you enter is sent to Appaw&apos;s grading API only to find your
                Appaw Store consignments. It is not used for advertising.
              </li>
              <li>
                After a successful lookup, graded-scan images may be shown and cached on the device. On-device data
                may also include the last lookup phone and opened graded state until you clear lookup history in
                Settings (that action also wipes the scan cache).
              </li>
              <li>
                The app shows banner ads through <strong>Google AdMob</strong>. Google may collect device and
                advertising-related data (such as a device advertising identifier, advertising data, and product
                interaction) to deliver and measure ads. See{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-link hover:underline"
                >
                  Google&apos;s Privacy Policy
                </a>
                . The current iOS build does not present an App Tracking Transparency prompt.
              </li>
            </ul>
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              We do not sell your phone number, centering photos, or graded-scan images. AdMob ads are separate
              from Track lookup data.
            </p>

            <h3 className="text-base font-semibold text-text-primary mb-2">Purchase data</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              All purchases are processed through{' '}
              <a href="https://appawstore.etsy.com" target="_blank" rel="noopener noreferrer" className="text-accent-link hover:underline">Etsy</a>{' '}
              or{' '}
              <a href="https://www.carousell.com.hk/u/appaw.store/" target="_blank" rel="noopener noreferrer" className="text-accent-link hover:underline">Carousell</a>.
              We do not process or store payment information on this website. Please refer to each
              platform&apos;s privacy policy for how your purchase data is handled.
            </p>
          </div>

          <div className="mb-10">
            <SectionDivider num="02" />
            <h2 className="text-2xl font-bold font-display text-text-primary mb-4">How We Use Your Data</h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-3">We use analytics data to:</p>
            <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm mb-4">
              <li>Understand which pages and products are most useful to visitors</li>
              <li>Improve website content and user experience</li>
              <li>Monitor site performance</li>
              <li>Review session replays and heatmaps to identify usability issues</li>
            </ul>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              Contact information you share is used only to respond to enquiries and facilitate transactions.
              Phone numbers and graded-scan images used in Card Centering Tools are used only for Appaw Store
              submission tracking and display.
            </p>
            <p className="text-text-secondary text-sm leading-relaxed">
              In the mobile app, Google AdMob uses device and advertising-related data to show and measure banner
              ads. We do not sell or rent your personal data.
            </p>
          </div>

          <div className="mb-10">
            <SectionDivider num="03" />
            <h2 className="text-2xl font-bold font-display text-text-primary mb-4">Third-Party Services</h2>
            <div className="overflow-x-auto panel">
              <table className="w-full text-sm min-w-[480px]">
                <thead>
                  <tr className="border-b border-border-default">
                    <th className="text-left px-4 py-3 text-text-secondary font-semibold">Service</th>
                    <th className="text-left px-4 py-3 text-text-secondary font-semibold">Purpose</th>
                    <th className="text-left px-4 py-3 text-text-secondary font-semibold">Privacy Policy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                  {[
                    { name: 'Google Analytics 4', purpose: 'Website analytics', url: 'https://policies.google.com/privacy', label: 'google.com/policies' },
                    { name: 'Microsoft Clarity', purpose: 'Session replay, heatmaps, and behavioral analytics', url: 'https://www.microsoft.com/privacy/privacystatement', label: 'microsoft.com/privacy' },
                    { name: 'Google AdMob', purpose: 'Banner ads in the Card Centering Tools mobile app', url: 'https://policies.google.com/privacy', label: 'google.com/policies' },
                    { name: 'Etsy', purpose: 'E-commerce platform', url: 'https://www.etsy.com/legal/privacy', label: 'etsy.com/legal/privacy' },
                    { name: 'Carousell', purpose: 'Secondary marketplace', url: 'https://support.carousell.com/hc/en-us/articles/360000045203', label: 'carousell.com/privacy' },
                    { name: 'WhatsApp (Meta)', purpose: 'Customer contact', url: 'https://www.whatsapp.com/legal/privacy-policy', label: 'whatsapp.com/legal' },
                  ].map((row) => (
                    <tr key={row.name} className="hover:bg-surface-raised transition-colors">
                      <td className="px-4 py-3 text-text-primary font-medium">{row.name}</td>
                      <td className="px-4 py-3 text-text-secondary">{row.purpose}</td>
                      <td className="px-4 py-3">
                        <a href={row.url} target="_blank" rel="noopener noreferrer" className="text-accent-link hover:underline text-xs">
                          {row.label}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-10">
            <SectionDivider num="04" />
            <h2 className="text-2xl font-bold font-display text-text-primary mb-4">Cookies</h2>
            <h3 className="text-base font-semibold text-text-primary mb-2">Analytics cookies (Google Analytics 4)</h3>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              On your first visit we ask for your consent before setting analytics cookies. If you decline,
              no analytics cookies are placed. You can change your preference at any time via the cookie
              notice, or opt out globally using Google&apos;s browser add-on at{' '}
              <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-accent-link hover:underline">
                tools.google.com/dlpage/gaoptout
              </a>.
            </p>
            <h3 className="text-base font-semibold text-text-primary mb-2">Analytics cookies (Microsoft Clarity)</h3>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              Microsoft Clarity uses first- and third-party cookies and similar tracking technologies to
              record how you interact with our website, including session replays and heatmaps. Clarity
              loads when you visit our site. Learn more in the{' '}
              <a href="https://www.microsoft.com/privacy/privacystatement" target="_blank" rel="noopener noreferrer" className="text-accent-link hover:underline">
                Microsoft Privacy Statement
              </a>.
            </p>
            <h3 className="text-base font-semibold text-text-primary mb-2">Essential cookies</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              We do not set any additional session or authentication cookies on this website beyond the analytics
              services described above. Website cookies are not used for advertising. Banner advertising in the
              Card Centering Tools mobile app is delivered by Google AdMob and is separate from this website&apos;s
              cookie notice.
            </p>
          </div>

          <div className="mb-10">
            <SectionDivider num="05" />
            <h2 className="text-2xl font-bold font-display text-text-primary mb-4">Data Retention</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Google Analytics 4 data is retained for 14 months, after which it is automatically deleted
              by Google. Microsoft Clarity session recordings and related analytics data are retained
              according to Microsoft&apos;s data retention policies (typically up to 30 days for session
              replays). Contact data shared via WhatsApp or email is retained only as long as necessary
              to fulfil your enquiry or complete a transaction.
            </p>
          </div>

          <div className="mb-10">
            <SectionDivider num="06" />
            <h2 className="text-2xl font-bold font-display text-text-primary mb-4">Your Rights</h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-3">
              If you are based in Hong Kong, the European Economic Area, or the United Kingdom, you have
              the right to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm mb-4">
              <li>Access the personal data we hold about you</li>
              <li>Request correction or deletion of your data</li>
              <li>Withdraw consent for analytics at any time (click &quot;Decline&quot; in our cookie notice)</li>
              <li>Lodge a complaint with your local data protection authority</li>
            </ul>
            <p className="text-text-secondary text-sm leading-relaxed">
              To exercise any of these rights, contact us via WhatsApp:{' '}
              <a href="https://wa.me/85292851189" target="_blank" rel="noopener noreferrer" className="text-accent-link hover:underline">+852-9285-1189</a>{' '}
              or email:{' '}
              <a href="mailto:support@appaw.store" className="text-accent-link hover:underline">support@appaw.store</a>.
            </p>
          </div>

          <div className="mb-10">
            <SectionDivider num="07" />
            <h2 className="text-2xl font-bold font-display text-text-primary mb-4">Data Controller</h2>
            <div className="panel p-6 text-sm text-text-secondary space-y-1">
              <p className="font-semibold text-text-primary">{COMPANY.legalName}</p>
              <p>Business Registration No. {COMPANY.brNumber}</p>
              <p>Hong Kong</p>
              <p>
                WhatsApp:{' '}
                <a href="https://wa.me/85292851189" target="_blank" rel="noopener noreferrer" className="text-accent-link hover:underline">
                  +852-9285-1189
                </a>
              </p>
              <p>
                Email:{' '}
                <a href="mailto:support@appaw.store" className="text-accent-link hover:underline">
                  support@appaw.store
                </a>
              </p>
              <p>
                Website:{' '}
                <a href="https://appaw.store" className="text-accent-link hover:underline">
                  appaw.store
                </a>
              </p>
            </div>
          </div>

          <div className="mb-2">
            <SectionDivider num="08" />
            <h2 className="text-2xl font-bold font-display text-text-primary mb-4">Policy Updates</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              We may update this policy from time to time. The &quot;Last updated&quot; date at the top of
              this page reflects the most recent revision. Continued use of the website after any change
              constitutes your acceptance of the updated policy.
            </p>
          </div>

        </div>
      </section>
    </>
  );
}
