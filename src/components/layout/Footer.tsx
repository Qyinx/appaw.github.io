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
    { href: '/', label: t.nav.home },
    { href: '/about', label: t.nav.about },
    { href: '/business', label: t.nav.business },
  ];

  const socialLinks = [
    { href: 'https://www.threads.com/@appaw.store',        icon: faThreads,   label: 'Threads' },
    { href: 'https://www.instagram.com/appaw.store/',       icon: faInstagram, label: 'Instagram' },
    { href: 'https://appawstore.etsy.com/',                 icon: faEtsy,      label: 'Etsy' },
    { href: 'https://wa.me/85292851189',                    icon: faWhatsapp,  label: 'WhatsApp' },
  ];

  const contactItems = [
    { icon: faEnvelope,    href: 'mailto:support@appaw.store', label: 'support@appaw.store' },
    { icon: faWhatsapp,    href: 'https://wa.me/85292851189',  label: '+852 9285 1189' },
    { icon: faLocationDot, href: null,                         label: 'Hong Kong' },
  ];

  return (
    <footer className="bg-[#09090f] text-white relative overflow-hidden">
      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a843]/25 to-transparent" />
      {/* Ambient radial */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-64 bg-[radial-gradient(ellipse_at_bottom,rgba(212,168,67,0.05),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 group mb-6">
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/10 group-hover:border-[#d4a843]/40 transition-colors duration-300">
                <Image
                  src={getImagePath('/images/logo.png')}
                  alt="Appaw Store Logo"
                  width={36}
                  height={36}
                  className="object-cover"
                />
              </div>
              <span className="font-display font-bold text-base text-white/90 group-hover:text-[#d4a843] transition-colors duration-300 tracking-wide">
                Appaw Store
              </span>
            </Link>
            <p className="text-white/35 text-sm leading-relaxed">
              {t.footer.description}
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2 mt-8">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/8 text-white/35 hover:border-[#d4a843]/50 hover:text-[#d4a843] transition-all duration-200"
                >
                  <FontAwesomeIcon icon={s.icon} className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Spacer on small screens */}
          <div className="hidden lg:block" />

          {/* Quick Links */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-4 h-px bg-[#d4a843]/60" />
              <h3 className="text-white/90 text-xs uppercase tracking-[0.25em] font-medium">{t.footer.quickLinks}</h3>
            </div>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/35 hover:text-[#d4a843] text-sm transition-colors duration-200 group flex items-center gap-2"
                  >
                    <span className="w-0 h-px bg-[#d4a843] group-hover:w-3 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-4 h-px bg-[#d4a843]/60" />
              <h3 className="text-white/90 text-xs uppercase tracking-[0.25em] font-medium">{t.footer.contact}</h3>
            </div>
            <ul className="space-y-4">
              {contactItems.map((item) => (
                <li key={item.label}>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-3 text-white/35 hover:text-[#d4a843] text-sm transition-colors duration-200 group"
                    >
                      <FontAwesomeIcon icon={item.icon} className="w-3.5 h-3.5 text-[#d4a843]/50 group-hover:text-[#d4a843] transition-colors flex-shrink-0" />
                      {item.label}
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 text-white/35 text-sm">
                      <FontAwesomeIcon icon={item.icon} className="w-3.5 h-3.5 text-[#d4a843]/50 flex-shrink-0" />
                      {item.label}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs tracking-wider">
            © {new Date().getFullYear()} Appaw Store. {t.footer.rights}
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-[#d4a843]/40" />
            <span className="text-white/15 text-xs tracking-[0.2em] uppercase">Premium Card Protection</span>
            <div className="w-1 h-1 rounded-full bg-[#d4a843]/40" />
          </div>
        </div>
      </div>
    </footer>
  );
}
