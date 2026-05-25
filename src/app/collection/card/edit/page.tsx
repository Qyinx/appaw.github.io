import type { Metadata } from 'next';
import CardFormClient from '../../CardFormClient';
import { editCardMetadata } from '@/lib/seo/metadata';

export const metadata = editCardMetadata;

export default function EditCardPage() {
  return <CardFormClient />;
}
