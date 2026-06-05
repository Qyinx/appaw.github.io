'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { localizedHref } from '@/lib/i18n-routing';

type LocalLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
};

/** Link that keeps the user on the current locale prefix (`/` vs `/zh/`). */
export default function LocalLink({ href, ...props }: LocalLinkProps) {
  const { language } = useLanguage();
  return <Link href={localizedHref(href, language)} {...props} />;
}
