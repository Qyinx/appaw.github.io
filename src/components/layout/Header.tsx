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

const linkBase =
  'relative px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-150';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBusinessOpen, setIsBusinessOpen] = useState(false);
  const [isMobileBusinessOpen, setIsMobileBusinessOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(cachedProfile);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    if (cachedProfile) {
      setProfile(cachedProfile);
      return;
    }

    const profileFromStorage = getProfileFromLocalStorage();
    if (profileFromStorage) {
      cachedProfile = profileFromStorage;
      setProfile(profileFromStorage);
    }
  }, []);

  const navLinks = [
    { href: '/', label: t.nav.home },
    {
      href: '/business',
      label: t.nav.business,
      children: [
        { href: '/products/psa-protectors', label: t.nav.psaProtector },
        { href: '/business/card-trading', label: t.nav.cardTrading },
        { href: '/collection', label: t.nav.collection },
      ],
    },
    { href: '/tools/card-centering', label: t.nav.centeringTool, highlight: true },
    { href: '/guides', label: t.nav.guides },
    { href: '/about', label: t.nav.about },
  ];

  const pathname = usePathname();
  const router = useRouter();
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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border-default bg-surface-panel">
      <div className="max-w-7xl mx-auto px-[var(--space-page-x)]">
        <div className="flex items-center justify-between h-16">

          <LocalLink href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 overflow-hidden border border-border-strong group-hover:border-accent-brand transition-colors duration-150">
              <Image
                src={getImagePath('/images/logo.png')}
                alt="Appaw Store Logo"
                width={36}
                height={36}
                className="object-cover"
              />
            </div>
            <span className="font-display font-bold text-sm tracking-wide text-text-primary group-hover:text-accent-brand transition-colors duration-150">
              Appaw Store
            </span>
          </LocalLink>

          <nav className="hidden md:flex items-center gap-0.5" aria-label="Main">
            {navLinks.map((link) => {
              const isActive = isActivePath(link.href);
              if (link.children) {
                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => setIsBusinessOpen(true)}
                    onMouseLeave={() => setIsBusinessOpen(false)}
                    onFocus={() => setIsBusinessOpen(true)}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        setIsBusinessOpen(false);
                      }
                    }}
                  >
                    <LocalLink
                      href={link.href}
                      className={`${linkBase} flex items-center gap-1 ${isActive ? 'text-accent-brand' : ''}`}
                      aria-expanded={isBusinessOpen}
                      aria-haspopup="true"
                    >
                      {link.label}
                      <ChevronDown
                        className="w-3.5 h-3.5 transition-transform duration-150"
                        style={{ transform: isBusinessOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        aria-hidden="true"
                      />
                    </LocalLink>
                    <div
                      className={`absolute top-full left-0 pt-1 transition-opacity duration-150 ${isBusinessOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                    >
                      <div className="min-w-[200px] panel py-1 border border-border-strong">
                        {link.children.map((child) => {
                          const isChildActive = isActivePath(child.href);
                          return (
                            <LocalLink
                              key={child.href}
                              href={child.href}
                              className={`flex items-center px-4 py-2.5 text-sm hover:bg-surface-raised transition-colors duration-150 ${isChildActive ? 'text-accent-brand' : 'text-text-secondary'}`}
                              onClick={() => setIsBusinessOpen(false)}
                            >
                              {child.label}
                            </LocalLink>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              if ('highlight' in link && link.highlight) {
                return (
                  <LocalLink
                    key={link.href}
                    href={link.href}
                    className={`ml-2 px-3 py-1.5 text-xs font-mono uppercase tracking-wider border transition-colors duration-150 ${
                      isActive
                        ? 'bg-accent-warn text-surface-bg border-accent-warn'
                        : 'border-accent-warn/50 text-accent-warn hover:bg-accent-warn/10'
                    }`}
                  >
                    {link.label}
                  </LocalLink>
                );
              }

              return (
                <LocalLink
                  key={link.href}
                  href={link.href}
                  className={`${linkBase} ${isActive ? 'text-accent-brand' : ''}`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-px bg-accent-brand" aria-hidden="true" />
                  )}
                </LocalLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleLanguage}
              className="btn btn-secondary px-3 py-1.5 text-xs font-mono uppercase tracking-wider"
              aria-label="Toggle language"
            >
              {language === 'en' ? '中文' : 'EN'}
            </button>

            <button
              type="button"
              className="md:hidden min-w-11 min-h-11 w-11 h-11 flex items-center justify-center border border-border-default text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors duration-150"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-4 h-4" aria-hidden="true" /> : <Menu className="w-4 h-4" aria-hidden="true" />}
            </button>
          </div>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-200 ${isMenuOpen ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="py-4 border-t border-border-default">
            {profile && (
              <div className="px-4 py-3 mb-2 flex items-center gap-2 panel-raised">
                <span className="w-1.5 h-1.5 bg-accent-brand" aria-hidden="true" />
                <span className="text-text-secondary text-sm font-medium">{profile.name}</span>
              </div>
            )}
            <nav className="flex flex-col" aria-label="Mobile">
              {navLinks.map((link) => {
                const isActive = isActivePath(link.href);
                if (link.children) {
                  return (
                    <div key={link.href}>
                      <button
                        type="button"
                        className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium ${isActive ? 'text-accent-brand' : 'text-text-secondary'}`}
                        onClick={() => setIsMobileBusinessOpen(!isMobileBusinessOpen)}
                        aria-expanded={isMobileBusinessOpen}
                      >
                        {link.label}
                        <ChevronDown
                          className="w-4 h-4 transition-transform duration-150"
                          style={{ transform: isMobileBusinessOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                          aria-hidden="true"
                        />
                      </button>
                      <div className={`overflow-hidden transition-[max-height,opacity] duration-200 ${isMobileBusinessOpen ? 'max-h-56 opacity-100' : 'max-h-0 opacity-0'}`}>
                        {link.children.map((child) => {
                          const isChildActive = isActivePath(child.href);
                          return (
                            <LocalLink
                              key={child.href}
                              href={child.href}
                              className={`block pl-8 pr-4 py-2.5 text-sm ${isChildActive ? 'text-accent-brand' : 'text-text-secondary'}`}
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {child.label}
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
                    className={`block px-4 py-3 text-sm font-medium ${isActive ? 'text-accent-brand' : 'text-text-secondary'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
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
