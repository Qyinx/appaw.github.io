'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getImagePath } from '@/lib/utils';

type UserProfile = {
  id?: string;
  name?: string;
  roles?: string[];
};

// Cache profile for the session to avoid repeat fetches on navigation
let cachedProfile: UserProfile | null = null;

function getProfileFromLocalStorage(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('auth0_user');
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    const roles = Array.isArray(parsed.roles)
      ? parsed.roles
      : parsed.roles
      ? [parsed.roles]
      : undefined;

    return {
      id: parsed.id,
      name: parsed.name || parsed.mail,
      roles,
    };
  } catch (err) {
    console.warn('Failed to parse auth0_user', err);
    return null;
  }
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(cachedProfile);
  const [loadingProfile, setLoadingProfile] = useState(!cachedProfile);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (cachedProfile) {
      setProfile(cachedProfile);
      setLoadingProfile(false);
      return;
    }

    const profileFromStorage = getProfileFromLocalStorage();
    if (profileFromStorage) {
      cachedProfile = profileFromStorage;
      setProfile(profileFromStorage);
    }
    setLoadingProfile(false);
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

  const pathname = usePathname();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: isScrolled
          ? 'rgba(9,9,15,0.96)'
          : 'rgba(9,9,15,0.75)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        borderBottom: isScrolled ? '1px solid rgba(212,168,67,0.12)' : '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/10 group-hover:border-[#d4a843]/40 transition-colors duration-300">
              <Image
                src={getImagePath('/images/logo.png')}
                alt="Appaw Store Logo"
                width={36}
                height={36}
                className="object-cover"
              />
            </div>
            <span className="font-display font-bold text-base tracking-wide text-white/90 group-hover:text-[#d4a843] transition-colors duration-300">
              Appaw Store
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium transition-colors duration-200 group"
                  style={{ color: isActive ? '#d4a843' : 'rgba(255,255,255,0.55)' }}
                >
                  <span className="group-hover:text-white transition-colors duration-200" style={{ color: 'inherit' }}>
                    {link.label}
                  </span>
                  {/* Active underline */}
                  <span
                    className="absolute bottom-0 left-4 right-4 h-px bg-[#d4a843] transition-transform duration-300 origin-left"
                    style={{ transform: isActive ? 'scaleX(1)' : 'scaleX(0)' }}
                  />
                  {/* Hover underline */}
                  {!isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-px bg-white/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Profile badge */}
            {profile && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4a843]" />
                <span className="text-white/70 text-xs font-medium">{profile.name}</span>
                {profile.roles?.length ? (
                  <span className="text-white/35 text-xs">{profile.roles.join(', ')}</span>
                ) : null}
              </div>
            )}

            {/* Language switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#d4a843]/30 hover:border-[#d4a843]/70 text-[#d4a843] text-xs font-medium tracking-[0.12em] uppercase transition-all duration-200 hover:bg-[#d4a843]/5"
              aria-label="Toggle language"
            >
              {language === 'en' ? '中文' : 'EN'}
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 hover:border-[#d4a843]/40 text-white/60 hover:text-white transition-all duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen
                ? <X className="w-4 h-4" />
                : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className="md:hidden overflow-hidden transition-all duration-300"
          style={{ maxHeight: isMenuOpen ? '400px' : '0px', opacity: isMenuOpen ? 1 : 0 }}
        >
          <div className="py-4 border-t border-white/8">
            {profile && (
              <div className="px-4 py-3 mb-2 flex items-center gap-2 rounded-xl border border-white/8 bg-white/4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4a843]" />
                <span className="text-white/70 text-sm font-medium">{profile.name}</span>
                {profile.roles?.length ? (
                  <span className="text-white/35 text-xs">{profile.roles.join(', ')}</span>
                ) : null}
              </div>
            )}
            <nav className="flex flex-col">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between px-4 py-3 rounded-xl transition-colors duration-200 group"
                    style={{ color: isActive ? '#d4a843' : 'rgba(255,255,255,0.5)' }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="font-medium text-sm group-hover:text-white transition-colors" style={{ color: 'inherit' }}>{link.label}</span>
                    {isActive && <span className="w-1 h-1 rounded-full bg-[#d4a843]" />}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
