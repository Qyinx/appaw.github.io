import type { Metadata } from 'next';
import HomeClient from './HomeClient';
import { homeMetadata } from '@/lib/seo/metadata';

export const metadata = homeMetadata;

export default function Page() {
  return <HomeClient />;
}
