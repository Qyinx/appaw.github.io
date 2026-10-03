'use client';

import React from 'react';
import LocalLink from '@/components/LocalLink';
import { useLanguage } from '@/context/LanguageContext';
import { COMPANY } from '@/lib/company';

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container-custom site-footer__inner">
        <p className="site-footer__line">
          <span translate="no">© {year} Appaw Store</span>
          <span className="site-footer__sep" aria-hidden="true">
            {' · '}
          </span>
          <span>{t.footer.locationValue}</span>
          <span className="site-footer__sep" aria-hidden="true">
            {' · '}
          </span>
          <span translate="no">
            {COMPANY.legalName} · {t.footer.brLabel} {COMPANY.brNumber}
          </span>
          <span className="site-footer__sep" aria-hidden="true">
            {' · '}
          </span>
          <a href="mailto:support@appaw.store" className="site-footer__link">
            support@appaw.store
          </a>
          <span className="site-footer__sep" aria-hidden="true">
            {' · '}
          </span>
          <a
            href="https://wa.me/85292851189"
            className="site-footer__link font-tabular"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.footer.phoneDisplay}
          </a>
          <span className="site-footer__sep" aria-hidden="true">
            {' · '}
          </span>
          <LocalLink href="/privacy" className="site-footer__link">
            {t.footer.privacy}
          </LocalLink>
          <span className="site-footer__sep" aria-hidden="true">
            {' · '}
          </span>
          <LocalLink href="/terms" className="site-footer__link">
            {t.footer.terms}
          </LocalLink>
        </p>
      </div>
    </footer>
  );
}
