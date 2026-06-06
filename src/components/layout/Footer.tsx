'use client';

import React from 'react';
import LocalLink from '@/components/LocalLink';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  const quickLinks = [
    { href: '/', label: t.nav.home },
    { href: '/products/psa-protectors', label: t.nav.psaProtector },
    { href: '/business/card-trading', label: t.nav.cardTrading },
    { href: '/collection', label: t.nav.collection },
    { href: '/tools/card-centering', label: t.nav.centeringTool },
    { href: '/guides', label: t.nav.guides },
    { href: '/about', label: t.nav.about },
  ];

  return (
    <footer className="border-t border-border-default bg-surface-panel text-text-secondary">
      <div className="max-w-7xl mx-auto px-[var(--space-page-x)] py-10 md:py-12">
        <div className="grid gap-8 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-5">
            <LocalLink href="/" className="font-display font-bold text-text-primary text-base hover:text-accent-brand transition-colors duration-150">
              Appaw Store
            </LocalLink>
            <p className="mt-3 text-sm leading-relaxed max-w-sm text-text-secondary">
              {t.footer.description}
            </p>
          </div>

          <div className="md:col-span-3">
            <h2 className="section-label mb-4">{t.footer.quickLinks}</h2>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <LocalLink
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150"
                  >
                    {link.label}
                  </LocalLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h2 className="section-label mb-4">{t.footer.contact}</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:support@appaw.store" className="hover:text-text-primary transition-colors duration-150">
                  support@appaw.store
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/85292851189"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-text-primary transition-colors duration-150"
                >
                  +852 9285 1189
                </a>
              </li>
              <li className="text-text-muted">Hong Kong</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border-default flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-text-muted">
          <p>
            © {new Date().getFullYear()} Appaw Store. {t.footer.rights}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <LocalLink href="/privacy" className="hover:text-text-secondary transition-colors duration-150">
              {t.footer.privacy}
            </LocalLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
