'use client';

import React from 'react';
import LocalLink from '@/components/LocalLink';
import { useLanguage } from '@/context/LanguageContext';

const TOOL_HREF = '/tools/card-centering';

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  const sitemapGroups = [
    {
      label: t.footer.sitemapShop,
      links: [
        { href: '/products/psa-protectors', label: t.nav.psaProtector },
        { href: '/business/card-trading', label: t.nav.cardTrading },
        { href: '/collection', label: t.nav.collection },
      ],
    },
    {
      label: t.footer.sitemapTools,
      links: [{ href: TOOL_HREF, label: t.nav.centeringTool, highlight: true }],
    },
    {
      label: t.footer.sitemapInfo,
      links: [
        { href: '/', label: t.nav.home },
        { href: '/guides', label: t.nav.guides },
        { href: '/about', label: t.nav.about },
      ],
    },
  ];

  return (
    <footer className="site-footer">
      <div className="container-custom site-footer__inner">
        <div className="site-footer__panel panel">
          <nav className="site-footer__sitemap" aria-label={t.footer.sitemap}>
            <div className="site-footer__sitemap-header">
              <span className="site-footer__sitemap-title">{t.footer.sitemap}</span>
            </div>
            {sitemapGroups.map((group) => (
              <div key={group.label} className="site-footer__sitemap-row">
                <span className="site-footer__sitemap-label">{group.label}</span>
                <ul className="site-footer__sitemap-links">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <LocalLink
                        href={link.href}
                        className={`site-footer__link${'highlight' in link && link.highlight ? ' site-footer__link--tool' : ''}`}
                      >
                        {link.label}
                      </LocalLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="site-footer__specs">
            <div className="spec-row">
              <span className="spec-row__label">{t.footer.email}</span>
              <a href="mailto:support@appaw.store" className="spec-row__value site-footer__link">
                support@appaw.store
              </a>
            </div>
            <div className="spec-row">
              <span className="spec-row__label">{t.footer.phone}</span>
              <a
                href="https://wa.me/85292851189"
                target="_blank"
                rel="noopener noreferrer"
                className="spec-row__value site-footer__link font-tabular"
              >
                +852 9285 1189
              </a>
            </div>
            <div className="spec-row">
              <span className="spec-row__label">{t.footer.location}</span>
              <span className="spec-row__value">{t.footer.locationValue}</span>
            </div>
          </div>

          <div className="site-footer__bar">
            <p className="site-footer__bar-text">
              <span translate="no">© {year} Appaw Store</span>
              <span aria-hidden="true"> · </span>
              {t.footer.rights}
            </p>
            <LocalLink href="/privacy" className="site-footer__bar-link">
              {t.footer.privacy}
            </LocalLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
