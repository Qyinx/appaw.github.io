'use client';

import React, { useEffect, useRef } from 'react';
import LocalLink from '@/components/LocalLink';
import HeaderScrambleText, { useHeaderScrambleTrigger } from '@/components/layout/HeaderScrambleText';
import { useLanguage } from '@/context/LanguageContext';

function FooterScrambleLink({
  href,
  label,
  segmentIndex,
  external = false,
  className = '',
  target,
  rel,
}: {
  href: string;
  label: string;
  segmentIndex: number;
  external?: boolean;
  className?: string;
  target?: string;
  rel?: string;
}) {
  const { scrambleRef, onPointerEnter, onPointerLeave, onFocus, onBlur } = useHeaderScrambleTrigger();
  const segmentStyle = { '--footer-segment-i': segmentIndex } as React.CSSProperties;
  const scramble = (
    <HeaderScrambleText ref={scrambleRef} text={label} className="site-footer__scramble" />
  );
  const linkClass = `site-footer__link site-footer__segment${className ? ` ${className}` : ''}`;

  if (external) {
    return (
      <a
        href={href}
        className={linkClass}
        style={segmentStyle}
        target={target}
        rel={rel}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        {scramble}
      </a>
    );
  }

  return (
    <LocalLink
      href={href}
      className={linkClass}
      style={segmentStyle}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {scramble}
    </LocalLink>
  );
}

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute('data-visible', '');
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={footerRef} className="site-footer">
      <div className="container-custom site-footer__inner">
        <div className="site-footer__panel panel">
          <p className="site-footer__line">
            <span className="site-footer__prompt" aria-hidden="true">
              &gt;
            </span>
            <span className="site-footer__segment" style={{ '--footer-segment-i': 0 } as React.CSSProperties}>
              <span translate="no">© {year} Appaw Store</span>
            </span>
            <span className="site-footer__sep" aria-hidden="true">
              {' · '}
            </span>
            <span className="site-footer__segment" style={{ '--footer-segment-i': 1 } as React.CSSProperties}>
              {t.footer.locationValue}
            </span>
            <span className="site-footer__sep" aria-hidden="true">
              {' · '}
            </span>
            <FooterScrambleLink
              href="mailto:support@appaw.store"
              label="support@appaw.store"
              segmentIndex={2}
              external
            />
            <span className="site-footer__sep" aria-hidden="true">
              {' · '}
            </span>
            <FooterScrambleLink
              href="https://wa.me/85292851189"
              label={t.footer.phoneDisplay}
              segmentIndex={3}
              className="font-tabular"
              external
              target="_blank"
              rel="noopener noreferrer"
            />
            <span className="site-footer__sep" aria-hidden="true">
              {' · '}
            </span>
            <FooterScrambleLink href="/privacy" label={t.footer.privacy} segmentIndex={4} />
            <span className="site-footer__cursor" aria-hidden="true" />
          </p>
        </div>
      </div>
    </footer>
  );
}
