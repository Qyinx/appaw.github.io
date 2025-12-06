'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faThreads, faInstagram, faEtsy } from '@fortawesome/free-brands-svg-icons';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  const quickLinks = [
    { href: '/', label: t.nav.home },
    { href: '/about', label: t.nav.about },
    { href: '/business', label: t.nav.business },
  ];

  return (
    <footer className="bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Image
                src="/images/logo.png"
                alt="Appaw Store Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="font-display font-bold text-xl">Appaw Store</span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed">
              {t.footer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t.footer.quickLinks}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-primary-400 transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t.footer.contact}</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-neutral-400 text-sm">
                <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 text-primary-400" />
                <span>support@appaw.store</span>
              </li>
              <li className="flex items-center space-x-3 text-neutral-400 text-sm">
                <a href="https://wa.me/85292851189" className="flex items-center space-x-3 hover:text-primary-400 transition-colors">
                  <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4 text-primary-400" />
                  <span>+852 9285 1189 (WhatsApp)</span>
                </a>
              </li>
              <li className="flex items-start space-x-3 text-neutral-400 text-sm">
                <FontAwesomeIcon icon={faLocationDot} className="w-4 h-4 text-primary-400 mt-0.5" />
                <span>Hong Kong</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t.footer.followUs}</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.threads.com/@appaw.store"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-200"
                aria-label="Threads"
              >
                <FontAwesomeIcon icon={faThreads} className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/appaw.store/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-200"
                aria-label="Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} className="w-5 h-5" />
              </a>
              <a
                href="https://www.carousell.com.hk/u/appaw.store/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-200"
                aria-label="Carousell"
              >
                <Image 
                  src="/images/carousell-icon.png.png" 
                  alt="Carousell" 
                  width={20} 
                  height={20}
                  className="brightness-0 invert"
                />
              </a>
              <a
                href="https://appawstore.etsy.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-200"
                aria-label="Etsy"
              >
                <FontAwesomeIcon icon={faEtsy} className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-neutral-800">
          <p className="text-center text-neutral-500 text-sm">
            © {new Date().getFullYear()} Appaw Store. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
