'use client';

import React, { useState, useEffect, useRef } from 'react';
import LocalLink from '@/components/LocalLink';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { stripZhPrefix, toggleLocalePath } from '@/lib/i18n-routing';
import { writeLocalePreference } from '@/lib/locale-preference';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getImagePath } from '@/lib/utils';

type UserProfile = {
  id?: string;
  name?: string;
  roles?: string[];
};

let cachedProfile: UserProfile | null = null;

function HeaderLanguageToggle({
  language,
  groupLabel,
  onSelect,
}: {
  language: 'en' | 'zh';
  groupLabel: string;
  onSelect: (next: 'en' | 'zh') => void;
}) {
  const isZh = language === 'zh';

  return (
    <button
      type="button"
      className="header-lang-toggle"
      aria-pressed={isZh}
      aria-label={groupLabel}
      title={isZh ? 'Switch to English' : 'Switch to 中文'}
      onClick={() => onSelect(isZh ? 'en' : 'zh')}
    >
      <span className="header-lang-toggle__scene" aria-hidden="true">
        <span className="header-lang-toggle__motif header-lang-toggle__motif--west">
          <svg
            className="header-lang-toggle__svg"
            viewBox="0 0 72 44"
            fill="currentColor"
          >
            {/* Ground steps */}
            <rect x="1" y="39" width="70" height="2.5" opacity="0.4" />
            <rect x="8" y="36.5" width="56" height="2" opacity="0.25" />
            {/* Left ruin / small column */}
            <g opacity="0.5">
              <rect x="4" y="18" width="9" height="2" />
              <rect x="5.5" y="20" width="6" height="16" />
              <rect x="3" y="36" width="11" height="2" />
            </g>
            {/* Main Ionic column */}
            <path d="M22 6h28l-5-4H27l-5 4z" opacity="0.55" />
            <rect x="24" y="6" width="24" height="3.5" />
            <rect x="27" y="9.5" width="18" height="2.5" />
            <path d="M28 12h5c0 2.5-2 4-2 4s-2-1.5-2-4zm16 0h-5c0 2.5 2 4 2 4s2-1.5 2-4z" />
            <rect x="31" y="16" width="10" height="20" />
            <rect x="29.5" y="18" width="2" height="16" opacity="0.4" />
            <rect x="40.5" y="18" width="2" height="16" opacity="0.4" />
            <rect x="27" y="36" width="18" height="2.5" />
            <rect x="23" y="38.5" width="26" height="3" />
            {/* Laurel */}
            <path
              d="M52 20c5-7 12-9 17-8-4 3-6 9-7 14 3-1 6-1 9 1-5 2-11 2-16-2z"
              opacity="0.55"
            />
            <path
              d="M53 26c4-2 9-2 13 0-3 2-6 4-10 5 2 1 4 2 7 2-5 1-11 0-14-3z"
              opacity="0.4"
            />
            {/* Birds */}
            <path d="M58 7l2.5 1.8L63 7" fill="none" stroke="currentColor" strokeWidth="1.3" opacity="0.65" />
            <path d="M64 12l1.8 1.2L67.5 12" fill="none" stroke="currentColor" strokeWidth="1.1" opacity="0.45" />
            {/* Arch accent */}
            <path
              d="M10 20v16h3V24c0-3 2-5 5-5s5 2 5 5v12h3V20c0-5-4-8-8-8s-8 3-8 8z"
              opacity="0.35"
            />
          </svg>
        </span>
        <span className="header-lang-toggle__motif header-lang-toggle__motif--east">
          <svg
            className="header-lang-toggle__svg"
            viewBox="0 0 72 44"
            fill="currentColor"
          >
            {/* Stars */}
            <circle cx="6" cy="6" r="1.3" opacity="0.75" />
            <circle cx="16" cy="3.5" r="1" opacity="0.55" />
            <circle cx="26" cy="8" r="1.2" opacity="0.65" />
            <circle cx="11" cy="13" r="0.8" opacity="0.45" />
            <circle cx="33" cy="5" r="0.7" opacity="0.4" />
            {/* 祥云 */}
            <path
              d="M2 17c4-4 9-4 13-1 3-4 8-5 12-2-5 1-7 4-7 4h6c-5 1-9 3-13 6-4-3-8-4-11-7z"
              opacity="0.5"
            />
            <path
              d="M46 5c4-3 9-2 12 1 2-3 6-3 9-1-3 1-4 3-4 3h5c-4 2-8 3-12 5-4-3-7-4-10-8z"
              opacity="0.42"
            />
            {/* Small lantern */}
            <g opacity="0.55">
              <rect x="9" y="15" width="1.75" height="3.5" />
              <path d="M4 18.5h12l-1.5 2H5.5L4 18.5z" />
              <ellipse cx="10" cy="26" rx="7" ry="7" />
              <rect x="7.5" y="20" width="1.5" height="10" opacity="0.45" />
              <path d="M4.5 32.5h11l-1.5 2H6l-1.5-2z" />
              <rect x="9" y="34.5" width="2" height="3.5" />
              <circle cx="10" cy="39" r="1.6" />
            </g>
            {/* Main lantern */}
            <rect x="42" y="6" width="2.5" height="5" />
            <path d="M34 11h18.5l-2.5 3H36.5L34 11z" />
            <ellipse cx="43.25" cy="24" rx="12" ry="11.5" />
            <rect x="37" y="16" width="2" height="14" opacity="0.45" />
            <rect x="47.5" y="16" width="2" height="14" opacity="0.45" />
            <path d="M32 34h22.5l-2.5 3H34.5L32 34z" />
            <rect x="42" y="37" width="2.5" height="4" />
            <circle cx="43.25" cy="42" r="2.2" />
            {/* Ground */}
            <rect x="1" y="41" width="70" height="2" opacity="0.35" />
          </svg>
        </span>
      </span>
      <span className="header-lang-toggle__thumb" aria-hidden="true" />
      <span className="header-lang-toggle__labels" aria-hidden="true">
        <span
          className={`header-lang-toggle__label${language === 'en' ? ' is-active' : ''}`}
        >
          EN
        </span>
        <span
          className={`header-lang-toggle__label header-lang-toggle__label--zh${language === 'zh' ? ' is-active' : ''}`}
        >
          中文
        </span>
      </span>
    </button>
  );
}

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
  'relative px-3 py-2 text-[15px] font-semibold text-text-secondary hover:text-text-primary underline-offset-4 hover:underline';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBusinessOpen, setIsBusinessOpen] = useState(false);
  const [isMobileBusinessOpen, setIsMobileBusinessOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(cachedProfile);
  const { language, setLanguage, t } = useLanguage();
  const menuToggleRef = useRef<HTMLButtonElement>(null);

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

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsMenuOpen(false);
    setIsMobileBusinessOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setIsMobileBusinessOpen(false);
        menuToggleRef.current?.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isMenuOpen]);

  const navLinks = [
    { href: '/', label: t.nav.home },
    {
      href: '/business',
      label: t.nav.business,
      children: [
        { href: '/business/psa-grading', label: t.nav.psaGrading },
        { href: '/products/psa-protectors', label: t.nav.psaProtector },
        { href: '/business/card-trading', label: t.nav.cardTrading },
        { href: '/collection', label: t.nav.collection },
      ],
    },
    { href: '/tools/card-centering', label: t.nav.centeringTool, highlight: true },
    { href: '/guides', label: t.nav.guides },
    { href: '/about', label: t.nav.about },
  ];

  const selectLanguage = (next: 'en' | 'zh') => {
    if (next === language) return;
    writeLocalePreference(next);
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
      className="site-header"
      data-chrome="sheet"
    >
      <div className="max-w-7xl mx-auto px-[var(--space-page-x)]">
        <div className="flex items-center justify-between gap-2 min-w-0 h-[var(--site-header-height)]">

          <LocalLink href="/" className="flex shrink-0 items-center gap-2 sm:gap-3 group min-w-0">
            <div className="w-9 h-9 shrink-0 overflow-hidden border-2 border-border-strong">
              <Image
                src={getImagePath('/images/logo.png')}
                alt="Appaw Store Logo"
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="hidden sm:inline font-serif italic text-[16px] sm:text-[17px] font-medium tracking-normal whitespace-nowrap text-text-primary">
              Appaw Store
            </span>
          </LocalLink>

          <nav className="hidden lg:flex items-center justify-center gap-0 min-w-0 flex-1 overflow-visible" aria-label="Main">
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
                      className={`${linkBase} flex items-center gap-1 ${isActive ? 'text-text-primary underline' : ''}`}
                      aria-expanded={isBusinessOpen}
                      aria-haspopup="true"
                    >
                      {link.label}
                      <ChevronDown
                        className="w-3.5 h-3.5 shrink-0"
                        style={{ transform: isBusinessOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        aria-hidden="true"
                      />
                    </LocalLink>
                    <div
                      className={`absolute top-full left-0 z-[60] pt-1 ${isBusinessOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
                    >
                      <div className="min-w-[220px] panel border-2 border-border-strong bg-surface-panel py-1 shadow-[var(--shadow-press)]">
                        {link.children.map((child) => {
                          const isChildActive = isActivePath(child.href);
                          return (
                            <LocalLink
                              key={child.href}
                              href={child.href}
                              className={`relative block px-4 py-2.5 text-[15px] font-semibold text-text-secondary hover:bg-surface-raised hover:text-text-primary ${isChildActive ? 'text-text-primary' : ''}`}
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

              return (
                <LocalLink
                  key={link.href}
                  href={link.href}
                  className={`${linkBase} ${isActive ? 'text-text-primary underline' : ''}`}
                >
                  {link.label}
                </LocalLink>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <div className="hidden lg:block">
              <HeaderLanguageToggle
                language={language}
                groupLabel={t.nav.language}
                onSelect={selectLanguage}
              />
            </div>
            <LocalLink
              href="/products/psa-protectors"
              className="btn btn-primary header-bar-cta"
            >
              {t.home.hero.cta}
            </LocalLink>

            <button
              ref={menuToggleRef}
              type="button"
              className="lg:hidden relative min-w-11 min-h-11 w-11 h-11 flex items-center justify-center border-2 border-border-strong text-text-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="site-mobile-nav"
            >
              {isMenuOpen ? (
                <X className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Menu className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <div
          id="site-mobile-nav"
          className={`lg:hidden transition-[max-height,opacity] duration-200 ${
            isMenuOpen
              ? 'max-h-[min(80dvh,calc(100dvh-var(--site-header-height)))] opacity-100 overflow-y-auto overscroll-contain'
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="py-4 border-t-2 border-border-strong pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
            {profile && (
              <div className="px-4 py-3 mb-2 flex items-center gap-2 panel-raised">
                <span className="text-text-secondary text-[15px] font-medium">{profile.name}</span>
              </div>
            )}
            <nav className="flex flex-col" aria-label="Mobile">
              <div className="px-4 py-3">
                <HeaderLanguageToggle
                  language={language}
                  groupLabel={t.nav.language}
                  onSelect={selectLanguage}
                />
              </div>
              {navLinks.map((link) => {
                const isActive = isActivePath(link.href);
                if (link.children) {
                  return (
                    <div key={link.href}>
                      <button
                        type="button"
                        className={`relative w-full text-left px-4 py-3 text-[15px] font-semibold min-h-11 ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}
                        onClick={() => setIsMobileBusinessOpen(!isMobileBusinessOpen)}
                        aria-expanded={isMobileBusinessOpen}
                      >
                        <span className="flex w-full items-center justify-between gap-2">
                          {link.label}
                          <ChevronDown
                            className="w-4 h-4 shrink-0"
                            style={{ transform: isMobileBusinessOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                            aria-hidden="true"
                          />
                        </span>
                      </button>
                      <div
                        className={`overflow-hidden ${
                          isMobileBusinessOpen
                            ? 'max-h-[min(50dvh,20rem)] opacity-100 overflow-y-auto'
                            : 'max-h-0 opacity-0'
                        }`}
                      >
                        {link.children.map((child) => {
                          const isChildActive = isActivePath(child.href);
                          return (
                            <LocalLink
                              key={child.href}
                              href={child.href}
                              className={`relative block pl-8 pr-4 py-3 text-[15px] min-h-11 ${isChildActive ? 'text-text-primary font-semibold' : 'text-text-secondary'}`}
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
                    className={`relative block px-4 py-3 text-[15px] font-semibold min-h-11 ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}
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
