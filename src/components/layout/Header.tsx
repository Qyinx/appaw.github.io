'use client';

import React, { useState, useEffect } from 'react';
import LocalLink from '@/components/LocalLink';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { stripZhPrefix, toggleLocalePath } from '@/lib/i18n-routing';
import { Menu, X, ChevronDown } from 'lucide-react';
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
  const [isBusinessOpen, setIsBusinessOpen] = useState(false);
  const [isMobileBusinessOpen, setIsMobileBusinessOpen] = useState(false);
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
    {
      href: '/business',
      label: t.nav.business,
      children: [
        { href: '/business/psa-protector', label: t.nav.psaProtector },
        { href: '/collection', label: t.nav.collection },
      ],
    },
    { href: '/tools/card-centering', label: t.nav.centeringTool, highlight: true },
    { href: '/about', label: t.nav.about },
  ];

  const pathname = usePathname();
  const router = useRouter();
  // trailingSlash: true in next.config.js means pathname may end with /
  // Normalize so /business/ matches link.href /business
  const normalizedPath = pathname.replace(/\/$/, '') || '/';

  const toggleLanguage = () => {
    const next = language === 'en' ? 'zh' : 'en';
    setLanguage(next);
    router.push(toggleLocalePath(pathname, next));
  };

  const pathWithoutLocale = stripZhPrefix(pathname);

  const isActivePath = (href: string) =>
    href === '/'
      ? pathWithoutLocale === '/'
      : pathWithoutLocale === href || pathWithoutLocale.startsWith(href + '/');

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: isScrolled
          ? 'rgba(30,30,46,0.96)'
          : 'rgba(30,30,46,0.75)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        borderBottom: isScrolled ? '1px solid rgba(212,137,154,0.12)' : '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <LocalLink href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/10 group-hover:border-[#D4899A]/40 transition-colors duration-300">
              <Image
                src={getImagePath('/images/logo.png')}
                alt="Appaw Store Logo"
                width={36}
                height={36}
                className="object-cover"
              />
            </div>
            <span className="font-display font-bold text-base tracking-wide text-white/90 group-hover:text-[#D4899A] transition-colors duration-300">
              Appaw Store
            </span>
          </LocalLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = isActivePath(link.href);
              if (link.children) {
                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => setIsBusinessOpen(true)}
                    onMouseLeave={() => setIsBusinessOpen(false)}
                  >
                    <LocalLink
                      href={link.href}
                      className="relative flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors duration-200 group"
                      style={{ color: isActive ? '#D4899A' : 'rgba(255,255,255,0.55)' }}
                    >
                      <span className="group-hover:text-white transition-colors duration-200" style={{ color: 'inherit' }}>
                        {link.label}
                      </span>
                      <ChevronDown
                        className="w-3.5 h-3.5 transition-transform duration-200"
                        style={{ transform: isBusinessOpen ? 'rotate(180deg)' : 'rotate(0deg)', color: 'inherit' }}
                      />
                      {/* Active underline */}
                      <span
                        className="absolute bottom-0 left-4 right-4 h-px bg-[#D4899A] transition-transform duration-300 origin-left"
                        style={{ transform: isActive ? 'scaleX(1)' : 'scaleX(0)' }}
                      />
                      {!isActive && (
                        <span className="absolute bottom-0 left-4 right-4 h-px bg-white/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                      )}
                    </LocalLink>
                    {/* Dropdown */}
                    <div
                      className="absolute top-full left-0 pt-1 transition-all duration-200"
                      style={{ opacity: isBusinessOpen ? 1 : 0, pointerEvents: isBusinessOpen ? 'auto' : 'none', transform: isBusinessOpen ? 'translateY(0)' : 'translateY(-4px)' }}
                    >
                      <div
                        className="min-w-[180px] rounded-xl border border-white/10 py-1 overflow-hidden"
                        style={{ background: 'rgba(30,30,46,0.97)', backdropFilter: 'blur(20px)' }}
                      >
                        {link.children.map((child) => {
                          const isChildActive = isActivePath(child.href);
                          return (
                            <LocalLink
                              key={child.href}
                              href={child.href}
                              className="flex items-center px-4 py-2.5 text-sm font-medium hover:bg-white/5 transition-colors duration-150"
                              style={{ color: isChildActive ? '#D4899A' : 'rgba(255,255,255,0.6)' }}
                              onClick={() => setIsBusinessOpen(false)}
                            >
                              {isChildActive && <span className="w-1 h-1 rounded-full bg-[#D4899A] mr-2 flex-shrink-0" />}
                              {child.label}
                            </LocalLink>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <LocalLink
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium transition-colors duration-200 group"
                  style={
                    'highlight' in link && link.highlight
                      ? {
                          color: isActive ? '#0B0C0D' : '#F59E0B',
                          background: isActive ? '#F59E0B' : 'rgba(245,158,11,0.12)',
                          border: '1px solid rgba(245,158,11,0.45)',
                          borderRadius: '9999px',
                          marginLeft: '6px',
                        }
                      : { color: isActive ? '#D4899A' : 'rgba(255,255,255,0.55)' }
                  }
                >
                  <span
                    className={'highlight' in link && link.highlight ? '' : 'group-hover:text-white transition-colors duration-200'}
                    style={{ color: 'inherit' }}
                  >
                    {link.label}
                  </span>
                  {/* Active underline (non-highlighted links only) */}
                  {!('highlight' in link && link.highlight) && (
                    <>
                      <span
                        className="absolute bottom-0 left-4 right-4 h-px bg-[#D4899A] transition-transform duration-300 origin-left"
                        style={{ transform: isActive ? 'scaleX(1)' : 'scaleX(0)' }}
                      />
                      {!isActive && (
                        <span className="absolute bottom-0 left-4 right-4 h-px bg-white/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                      )}
                    </>
                  )}
                </LocalLink>
              );
            })}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D4899A]/30 hover:border-[#D4899A]/70 text-[#D4899A] text-xs font-medium tracking-[0.12em] uppercase transition-all duration-200 hover:bg-[#D4899A]/5"
              aria-label="Toggle language"
            >
              {language === 'en' ? '中文' : 'EN'}
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 hover:border-[#D4899A]/40 text-white/60 hover:text-white transition-all duration-200"
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
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4899A]" />
                <span className="text-white/70 text-sm font-medium">{profile.name}</span>
              </div>
            )}
            <nav className="flex flex-col">
              {navLinks.map((link) => {
                const isActive = isActivePath(link.href);
                if (link.children) {
                  return (
                    <div key={link.href}>
                      <button
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors duration-200"
                        style={{ color: isActive ? '#D4899A' : 'rgba(255,255,255,0.5)' }}
                        onClick={() => setIsMobileBusinessOpen(!isMobileBusinessOpen)}
                      >
                        <span className="font-medium text-sm" style={{ color: 'inherit' }}>{link.label}</span>
                        <ChevronDown
                          className="w-4 h-4 transition-transform duration-200"
                          style={{ transform: isMobileBusinessOpen ? 'rotate(180deg)' : 'rotate(0deg)', color: 'inherit' }}
                        />
                      </button>
                      <div
                        className="overflow-hidden transition-all duration-300"
                        style={{ maxHeight: isMobileBusinessOpen ? '200px' : '0px', opacity: isMobileBusinessOpen ? 1 : 0 }}
                      >
                        {link.children.map((child) => {
                          const isChildActive = isActivePath(child.href);
                          return (
                            <LocalLink
                              key={child.href}
                              href={child.href}
                              className="flex items-center gap-2 pl-8 pr-4 py-2.5 rounded-xl transition-colors duration-200"
                              style={{ color: isChildActive ? '#D4899A' : 'rgba(255,255,255,0.45)' }}
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <span className="w-1 h-1 rounded-full bg-current opacity-60 flex-shrink-0" />
                              <span className="font-medium text-sm" style={{ color: 'inherit' }}>{child.label}</span>
                            </LocalLink>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
                return (
                  <LocalLink
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between px-4 py-3 rounded-xl transition-colors duration-200 group"
                    style={{ color: isActive ? '#D4899A' : 'rgba(255,255,255,0.5)' }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="font-medium text-sm group-hover:text-white transition-colors" style={{ color: 'inherit' }}>{link.label}</span>
                    {isActive && <span className="w-1 h-1 rounded-full bg-[#D4899A]" />}
                  </LocalLink>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
