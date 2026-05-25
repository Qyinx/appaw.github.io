import type { Metadata } from 'next';
import { businessMetadata } from '@/lib/seo/metadata';

export const metadata = businessMetadata;

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
