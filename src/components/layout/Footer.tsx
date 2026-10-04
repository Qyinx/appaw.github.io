'use client';

import Image from 'next/image';
import LocalLink from '@/components/LocalLink';
import { useLanguage } from '@/context/LanguageContext';
import { COMPANY } from '@/lib/company';
import { getImagePath } from '@/lib/utils';

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container-custom site-footer__inner">
        <div className="site-footer__upper">
          <LocalLink href="/" className="site-footer__brand">
            <span className="site-footer__mark">
              <Image
                src={getImagePath('/images/logo.png')}
                alt="Appaw Store Logo"
                width={32}
                height={32}
                className="site-footer__logo"
              />
            </span>
            <span className="site-footer__wordmark" translate="no">
              {COMPANY.brandName}
            </span>
          </LocalLink>

          <div className="site-footer__contact">
            <p className="site-footer__location">{t.footer.locationValue}</p>
            <div className="site-footer__contact-links">
              <a href="mailto:support@appaw.store" className="site-footer__link">
                support@appaw.store
              </a>
              <span className="site-footer__sep" aria-hidden="true">
                ·
              </span>
              <a
                href="https://wa.me/85292851189"
                className="site-footer__link font-tabular"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.footer.phoneDisplay}
              </a>
            </div>
          </div>
        </div>

        <div className="site-footer__legal">
          <p className="site-footer__legal-meta">
            <span translate="no">© {year} {COMPANY.brandName}</span>
            <span className="site-footer__sep" aria-hidden="true">
              ·
            </span>
            <span translate="no">
              {COMPANY.legalName} · {t.footer.brLabel} {COMPANY.brNumber}
            </span>
          </p>
          <nav className="site-footer__legal-nav" aria-label="Legal">
            <LocalLink href="/privacy" className="site-footer__link">
              {t.footer.privacy}
            </LocalLink>
            <span className="site-footer__sep" aria-hidden="true">
              ·
            </span>
            <LocalLink href="/terms" className="site-footer__link">
              {t.footer.terms}
            </LocalLink>
          </nav>
        </div>
      </div>
    </footer>
  );
}
