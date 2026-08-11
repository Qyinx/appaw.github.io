'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { en, zh } from '@/i18n';
import { routeLanguage, toggleLocalePath } from '@/lib/i18n-routing';
import {
  ensureLocalePreference,
  readLocalePreference,
} from '@/lib/locale-preference';
import { LanguageContext, type Language } from './language-context';

const translations = { en, zh } as const;

export function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const urlLanguage = routeLanguage(pathname);
  const [language, setLanguageState] = useState<Language>(urlLanguage);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLanguageState(urlLanguage);
  }, [urlLanguage]);

  // First-visit safety net if bootstrap script did not run.
  useEffect(() => {
    if (readLocalePreference() !== null) return;
    const preferred = ensureLocalePreference();
    if (preferred === 'zh' && urlLanguage === 'en' && pathname) {
      router.replace(toggleLocalePath(pathname, preferred));
    }
    // Only on initial mount — first visit detect once.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional mount-once
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = translations[language];

  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ language: urlLanguage, setLanguage, t: translations[urlLanguage] }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
