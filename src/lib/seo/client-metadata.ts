import { stripZhPrefix } from '@/lib/i18n-routing';
import type { Language } from '@/context/language-context';
import { PAGE_META } from '@/lib/seo/page-meta';

export interface ClientPageMeta {
  title: string;
  description: string;
}

/** Client-side meta overrides when the user switches language (UI toggle). */
export function getClientPageMeta(pathname: string, language: Language): ClientPageMeta | null {
  const path = stripZhPrefix(pathname);
  const meta = PAGE_META[path];
  return meta?.[language] ?? null;
}
