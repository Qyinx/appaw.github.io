'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getImagePath } from '@/lib/utils';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: t.nav.home },
    // { href: '/products/graded-cards', label: t.nav.products },
    { href: '/business', label: t.nav.business },
    { href: '/about', label: t.nav.about },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-md' 
        : 'bg-white/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <Image
              src={getImagePath('/images/logo.png')}
              alt="Appaw Store Logo"
              width={40}
              height={40}
              className="rounded-lg group-hover:scale-105 transition-transform duration-200"
            />
            <span className="font-display font-bold text-xl text-neutral-800 group-hover:text-primary-600 transition-colors duration-200">
              Appaw Store
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-neutral-600 hover:text-primary-600 font-medium transition-colors duration-200 rounded-lg hover:bg-primary-50"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Language Switcher & Mobile Menu Button */}
          <div className="flex items-center space-x-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-primary-50 hover:bg-primary-100 border border-primary-200 transition-all duration-200"
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-700">
                {language === 'en' ? '中文' : 'EN'}
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-primary-50 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-neutral-700" />
              ) : (
                <Menu className="w-6 h-6 text-neutral-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200 bg-white/95 backdrop-blur-md">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
