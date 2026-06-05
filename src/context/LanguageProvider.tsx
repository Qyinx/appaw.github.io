'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { en, zh } from '@/i18n';
import { routeLanguage } from '@/lib/i18n-routing';
import { LanguageContext, type Language } from './language-context';

const translations = { en, zh } as const;

export function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const urlLanguage = routeLanguage(pathname);
  const [language, setLanguageState] = useState<Language>(urlLanguage);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLanguageState(urlLanguage);
  }, [urlLanguage]);

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
