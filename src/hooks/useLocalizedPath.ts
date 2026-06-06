'use client';

import { useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { localizedHref } from '@/lib/i18n-routing';

/** Returns a stable callback that prefixes `path` with the active locale. */
export function useLocalizedPath() {
  const { language } = useLanguage();
  return useCallback((path: string) => localizedHref(path, language), [language]);
}
