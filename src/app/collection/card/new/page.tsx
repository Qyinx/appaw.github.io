import type { Metadata } from 'next';
import CardFormClient from '../../CardFormClient';
import { newCardMetadata } from '@/lib/seo/metadata';

export const metadata = newCardMetadata;

export default function NewCardPage() {
  return <CardFormClient />;
}
