'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { getClientPageMeta } from '@/lib/seo/client-metadata';

export default function DocumentMeta() {
  const pathname = usePathname();
  const { language } = useLanguage();

  useEffect(() => {
    const meta = getClientPageMeta(pathname, language);
    if (!meta) return;

    document.title = meta.title;
    document.documentElement.lang = language === 'zh' ? 'zh-HK' : 'en';

    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute('content', meta.description);
    }
  }, [pathname, language]);

  return null;
}
