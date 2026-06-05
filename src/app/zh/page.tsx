import type { Metadata } from 'next';
import HomeClient from '../HomeClient';
import { zhHomeMetadata } from '@/lib/seo/metadata';

export const metadata = zhHomeMetadata;

export default function ZhHomePage() {
  return <HomeClient />;
}
