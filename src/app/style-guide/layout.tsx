import type { Metadata } from 'next';
import { styleGuideMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = styleGuideMetadata;

export default function StyleGuideLayout({ children }: { children: React.ReactNode }) {
  return children;
}
