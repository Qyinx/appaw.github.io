'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faThreads, faInstagram, faEtsy } from '@fortawesome/free-brands-svg-icons';
import { useLanguage } from '@/context/LanguageContext';
import { getImagePath } from '@/lib/utils';

export default function Footer() {
  const { t } = useLanguage();

  const quickLinks = [
    { href: '/',                          label: t.nav.home },
    { href: '/business',                  label: t.nav.business },
    { href: '/business/card-trading',     label: 'Card Trading' },
    { href: '/products/psa-protectors',   label: 'PSA Protectors' },
    { href: '/about',                     label: t.nav.about },
  ];

  const socialLinks = [
    { href: 'https://www.threads.com/@appaw.store',      icon: faThreads,   label: 'Threads',   color: '#ffffff' },
    { href: 'https://www.instagram.com/appaw.store/',    icon: faInstagram, label: 'Instagram', color: '#E1306C' },
    { href: 'https://appawstore.etsy.com/',              icon: faEtsy,      label: 'Etsy',      color: '#F1641E' },
    { href: 'https://wa.me/85292851189',                 icon: faWhatsapp,  label: 'WhatsApp',  color: '#25D366' },
  ];

  const contactItems = [
    { icon: faEnvelope,    href: 'mailto:support@appaw.store', label: 'support@appaw.store' },
    { icon: faWhatsapp,    href: 'https://wa.me/85292851189',  label: '+852 9285 1189' },
    { icon: faLocationDot, href: null,                         label: 'Hong Kong' },
  ];

  return (
    <footer
      className="relative text-white"
      style={{ background: '#09090f' }}
    >
      {/* ── Decorative layer (own stacking context, no overflow-hidden on parent) ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Left gold ambient */}
        <div
          className="absolute -left-32 top-0 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(212,168,67,0.07) 0%, transparent 70%)' }}
        />
        {/* Right emerald ambient */}
        <div
          className="absolute -right-32 bottom-0 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)' }}
        />
      </div>

      {/* ── Gold top border ── */}
      <div className="relative">
        <div className="h-px bg-gradient-to-r from-transparent via-[#d4a843]/40 to-transparent" />
        <div className="h-px bg-gradient-to-r from-transparent via-[#d4a843]/10 to-transparent mt-px" />
      </div>

      {/* ── Main content ── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Upper section: brand + nav + contact ── */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-12">

          {/* Brand column — xl: 4 cols */}
          <div className="xl:col-span-4 flex flex-col">
            <Link href="/" className="inline-flex items-center gap-3 group w-fit mb-5">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 group-hover:border-[#d4a843]/50 transition-colors duration-300 flex-shrink-0">
                <Image
                  src={getImagePath('/images/logo.png')}
                  alt="Appaw Store Logo"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <span className="font-display font-bold text-lg text-white group-hover:text-[#d4a843] transition-colors duration-300 tracking-wide">
                Appaw Store
              </span>
            </Link>

            <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-[260px]">
              {t.footer.description}
            </p>

            {/* Service badges */}
            <div className="flex flex-wrap gap-2 mb-8">
              <Link
                href="/products/psa-protectors"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#d4a843]/25 bg-[#d4a843]/5 hover:bg-[#d4a843]/10 hover:border-[#d4a843]/50 transition-all duration-200 group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] group-hover:scale-125 transition-transform" />
                <span className="text-[#d4a843]/80 text-xs font-medium tracking-wide">PSA Protector</span>
              </Link>
              <Link
                href="/business/card-trading"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#10b981]/25 bg-[#10b981]/5 hover:bg-[#10b981]/10 hover:border-[#10b981]/50 transition-all duration-200 group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] group-hover:scale-125 transition-transform" />
                <span className="text-[#10b981]/80 text-xs font-medium tracking-wide">Card Trading</span>
              </Link>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2 mt-auto">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/8 text-white/35 transition-all duration-200"
                  style={{ '--hover-color': s.color } as React.CSSProperties}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = s.color + '60';
                    (e.currentTarget as HTMLElement).style.color = s.color;
                    (e.currentTarget as HTMLElement).style.background = s.color + '12';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = '';
                    (e.currentTarget as HTMLElement).style.color = '';
                    (e.currentTarget as HTMLElement).style.background = '';
                  }}
                >
                  <FontAwesomeIcon icon={s.icon} className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation — xl: 3 cols */}
          <div className="xl:col-span-3 xl:col-start-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-4 h-px bg-[#d4a843]/50" />
              <h3 className="text-white/60 text-[10px] uppercase tracking-[0.3em] font-semibold">
                {t.footer.quickLinks}
              </h3>
            </div>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2.5 text-white/40 hover:text-white text-sm transition-colors duration-200 group w-fit"
                  >
                    <span className="w-0 h-px bg-[#d4a843] group-hover:w-4 transition-all duration-300 flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — xl: 4 cols */}
          <div className="xl:col-span-4 xl:col-start-9">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-4 h-px bg-[#d4a843]/50" />
              <h3 className="text-white/60 text-[10px] uppercase tracking-[0.3em] font-semibold">
                {t.footer.contact}
              </h3>
            </div>
            <ul className="space-y-4 mb-8">
              {contactItems.map((item) => (
                <li key={item.label}>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex items-start gap-3 text-white/40 hover:text-white text-sm transition-colors duration-200 group"
                    >
                      <FontAwesomeIcon
                        icon={item.icon}
                        className="w-3.5 h-3.5 mt-0.5 text-[#d4a843]/50 group-hover:text-[#d4a843] transition-colors flex-shrink-0"
                      />
                      {item.label}
                    </a>
                  ) : (
                    <div className="flex items-start gap-3 text-white/30 text-sm">
                      <FontAwesomeIcon icon={item.icon} className="w-3.5 h-3.5 mt-0.5 text-[#d4a843]/40 flex-shrink-0" />
                      {item.label}
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {/* Highlight CTA */}
            <a
              href="https://wa.me/85292851189"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-[#25D366]/25 bg-[#25D366]/5 hover:bg-[#25D366]/10 hover:border-[#25D366]/50 text-[#25D366]/80 hover:text-[#25D366] text-sm font-medium transition-all duration-200"
            >
              <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
              Chat with us
            </a>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/6 to-transparent" />

        {/* ── Bottom bar ── */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs tracking-wider order-2 sm:order-1">
            © {new Date().getFullYear()} Appaw Store. {t.footer.rights}
          </p>

          {/* Centre badge */}
          <div className="order-1 sm:order-2 flex items-center gap-3">
            <div className="w-6 h-px bg-[#d4a843]/20" />
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#d4a843]/40" />
              <span className="text-white/15 text-[10px] tracking-[0.25em] uppercase font-medium">Premium · HK</span>
              <span className="w-1 h-1 rounded-full bg-[#10b981]/40" />
            </div>
            <div className="w-6 h-px bg-[#10b981]/20" />
          </div>

          <div className="order-3 flex items-center gap-4">
            <Link href="/about" className="text-white/15 hover:text-white/40 text-xs transition-colors duration-200">
              About
            </Link>
            <div className="w-px h-3 bg-white/10" />
            <a href="mailto:support@appaw.store" className="text-white/15 hover:text-white/40 text-xs transition-colors duration-200">
              support@appaw.store
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

