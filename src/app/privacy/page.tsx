import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Appaw Store',
  description:
    'Learn how Appaw Store collects, uses, and protects your data. We use Google Analytics 4 for site analytics. Purchases are handled securely through Etsy and Carousell.',
  alternates: {
    canonical: '/privacy/',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const LAST_UPDATED = 'April 17, 2026';

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Privacy Policy – Appaw Store',
  url: 'https://appaw.store/privacy/',
  datePublished: '2026-04-17',
  dateModified: '2026-04-17',
  publisher: { '@type': 'Organization', name: 'Appaw Store', url: 'https://appaw.store' },
  inLanguage: 'en',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://appaw.store/' },
      { '@type': 'ListItem', position: 2, name: 'Privacy Policy', item: 'https://appaw.store/privacy/' },
    ],
  },
};

export default function PrivacyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />

      {/* ── Hero ── */}
      <section className="relative bg-[#1e1e2e] pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(212,137,154,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:80px_80px]" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />

        <div className="relative container-custom z-10">
          <div className="inline-flex items-center gap-2.5 border border-[#D4899A]/40 rounded-full px-5 py-2 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4899A]" />
            <span className="text-[#D4899A] text-xs uppercase tracking-[0.25em] font-medium">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-white leading-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-[#9ca3af] text-sm">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-custom max-w-3xl">
          <div className="prose prose-neutral max-w-none prose-headings:font-display prose-headings:text-neutral-900 prose-a:text-[#D4899A] prose-a:no-underline hover:prose-a:underline">

            <p className="lead text-neutral-500 text-lg leading-relaxed mb-10">
              Appaw Store (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates{' '}
              <a href="https://appaw.store" target="_blank" rel="noopener noreferrer">appaw.store</a>.
              This policy explains what data we collect, how we use it, and your rights as a visitor or customer.
            </p>

            {/* ── Section 1 ── */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[#D4899A] text-xs font-black uppercase tracking-widest">01</span>
                <div className="h-px flex-1 bg-neutral-100" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Data We Collect</h2>

              <h3 className="text-base font-semibold text-neutral-800 mb-2">Automatically collected data (Google Analytics 4)</h3>
              <p className="text-neutral-500 text-sm leading-relaxed mb-4">
                When you visit our website, Google Analytics 4 automatically collects:
              </p>
              <ul className="list-disc list-inside space-y-1 text-neutral-500 text-sm mb-6">
                <li>Pages visited and time spent</li>
                <li>Approximate geographic location (country / city level)</li>
                <li>Device type, browser, and operating system</li>
                <li>Referral source (how you found us)</li>
              </ul>
              <p className="text-neutral-500 text-sm leading-relaxed mb-6">
                This data is aggregated and anonymised. We do <strong className="text-neutral-700">not</strong> collect
                your name, email, or contact details through the website itself.
              </p>

              <h3 className="text-base font-semibold text-neutral-800 mb-2">Data you provide voluntarily</h3>
              <p className="text-neutral-500 text-sm leading-relaxed mb-6">
                If you contact us via WhatsApp (+852-9285-1189) or email (support@appaw.store), we receive
                the contact details and message content you choose to share. This information is used solely
                to respond to your enquiry or facilitate a transaction.
              </p>

              <h3 className="text-base font-semibold text-neutral-800 mb-2">Purchase data</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                All purchases are processed through{' '}
                <a href="https://appawstore.etsy.com" target="_blank" rel="noopener noreferrer">Etsy</a>{' '}
                or{' '}
                <a href="https://www.carousell.com.hk/u/appaw.store/" target="_blank" rel="noopener noreferrer">Carousell</a>.
                We do not process or store payment information on this website. Please refer to each
                platform&apos;s privacy policy for how your purchase data is handled.
              </p>
            </div>

            {/* ── Section 2 ── */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[#D4899A] text-xs font-black uppercase tracking-widest">02</span>
                <div className="h-px flex-1 bg-neutral-100" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">How We Use Your Data</h2>
              <p className="text-neutral-500 text-sm leading-relaxed mb-3">We use analytics data to:</p>
              <ul className="list-disc list-inside space-y-1 text-neutral-500 text-sm mb-4">
                <li>Understand which pages and products are most useful to visitors</li>
                <li>Improve website content and user experience</li>
                <li>Monitor site performance</li>
              </ul>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Contact information you share is used only to respond to enquiries and facilitate transactions.
                We do not sell or rent your data to third parties.
              </p>
            </div>

            {/* ── Section 3 ── */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[#D4899A] text-xs font-black uppercase tracking-widest">03</span>
                <div className="h-px flex-1 bg-neutral-100" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Third-Party Services</h2>
              <div className="overflow-x-auto rounded-xl border border-neutral-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-100">
                      <th className="text-left px-4 py-3 text-neutral-600 font-semibold">Service</th>
                      <th className="text-left px-4 py-3 text-neutral-600 font-semibold">Purpose</th>
                      <th className="text-left px-4 py-3 text-neutral-600 font-semibold">Privacy Policy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {[
                      { name: 'Google Analytics 4', purpose: 'Website analytics', url: 'https://policies.google.com/privacy', label: 'google.com/policies' },
                      { name: 'Etsy', purpose: 'E-commerce platform', url: 'https://www.etsy.com/legal/privacy', label: 'etsy.com/legal/privacy' },
                      { name: 'Carousell', purpose: 'Secondary marketplace', url: 'https://support.carousell.com/hc/en-us/articles/360000045203', label: 'carousell.com/privacy' },
                      { name: 'WhatsApp (Meta)', purpose: 'Customer contact', url: 'https://www.whatsapp.com/legal/privacy-policy', label: 'whatsapp.com/legal' },
                    ].map((row) => (
                      <tr key={row.name} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="px-4 py-3 text-neutral-800 font-medium">{row.name}</td>
                        <td className="px-4 py-3 text-neutral-500">{row.purpose}</td>
                        <td className="px-4 py-3">
                          <a href={row.url} target="_blank" rel="noopener noreferrer" className="text-[#D4899A] hover:underline text-xs">
                            {row.label}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Section 4 ── */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[#D4899A] text-xs font-black uppercase tracking-widest">04</span>
                <div className="h-px flex-1 bg-neutral-100" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Cookies</h2>
              <h3 className="text-base font-semibold text-neutral-800 mb-2">Analytics cookies (Google Analytics 4)</h3>
              <p className="text-neutral-500 text-sm leading-relaxed mb-4">
                On your first visit we ask for your consent before setting analytics cookies. If you decline,
                no analytics cookies are placed. You can change your preference at any time via the cookie
                notice, or opt out globally using Google&apos;s browser add-on at{' '}
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
                  tools.google.com/dlpage/gaoptout
                </a>.
              </p>
              <h3 className="text-base font-semibold text-neutral-800 mb-2">Essential cookies</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                We do not set any additional session, authentication, or tracking cookies beyond Google
                Analytics 4. No cookies are used for advertising or profiling purposes.
              </p>
            </div>

            {/* ── Section 5 ── */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[#D4899A] text-xs font-black uppercase tracking-widest">05</span>
                <div className="h-px flex-1 bg-neutral-100" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Data Retention</h2>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Google Analytics 4 data is retained for 14 months, after which it is automatically deleted
                by Google. Contact data shared via WhatsApp or email is retained only as long as necessary
                to fulfil your enquiry or complete a transaction.
              </p>
            </div>

            {/* ── Section 6 ── */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[#D4899A] text-xs font-black uppercase tracking-widest">06</span>
                <div className="h-px flex-1 bg-neutral-100" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Your Rights</h2>
              <p className="text-neutral-500 text-sm leading-relaxed mb-3">
                If you are based in Hong Kong, the European Economic Area, or the United Kingdom, you have
                the right to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-neutral-500 text-sm mb-4">
                <li>Access the personal data we hold about you</li>
                <li>Request correction or deletion of your data</li>
                <li>Withdraw consent for analytics at any time (click &quot;Decline&quot; in our cookie notice)</li>
                <li>Lodge a complaint with your local data protection authority</li>
              </ul>
              <p className="text-neutral-500 text-sm leading-relaxed">
                To exercise any of these rights, contact us via WhatsApp:{' '}
                <a href="https://wa.me/85292851189" target="_blank" rel="noopener noreferrer">+852-9285-1189</a>{' '}
                or email:{' '}
                <a href="mailto:support@appaw.store">support@appaw.store</a>.
              </p>
            </div>

            {/* ── Section 7 ── */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[#D4899A] text-xs font-black uppercase tracking-widest">07</span>
                <div className="h-px flex-1 bg-neutral-100" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Data Controller</h2>
              <div className="bg-neutral-50 rounded-2xl border border-neutral-100 p-6 text-sm text-neutral-600 space-y-1">
                <p className="font-semibold text-neutral-800">Appaw Store</p>
                <p>Hong Kong</p>
                <p>
                  WhatsApp:{' '}
                  <a href="https://wa.me/85292851189" target="_blank" rel="noopener noreferrer" className="text-[#D4899A]">
                    +852-9285-1189
                  </a>
                </p>
                <p>
                  Email:{' '}
                  <a href="mailto:support@appaw.store" className="text-[#D4899A]">
                    support@appaw.store
                  </a>
                </p>
                <p>
                  Website:{' '}
                  <a href="https://appaw.store" className="text-[#D4899A]">
                    appaw.store
                  </a>
                </p>
              </div>
            </div>

            {/* ── Section 8 ── */}
            <div className="mb-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[#D4899A] text-xs font-black uppercase tracking-widest">08</span>
                <div className="h-px flex-1 bg-neutral-100" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Policy Updates</h2>
              <p className="text-neutral-500 text-sm leading-relaxed">
                We may update this policy from time to time. The &quot;Last updated&quot; date at the top of
                this page reflects the most recent revision. Continued use of the website after any change
                constitutes your acceptance of the updated policy.
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
