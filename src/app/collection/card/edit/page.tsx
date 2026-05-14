import type { Metadata } from 'next';
import CardFormClient from '../../CardFormClient';

export const metadata: Metadata = {
  title: 'Edit Card | Appaw Store',
  robots: { index: false, follow: false },
};

export default function EditCardPage() {
  return <CardFormClient />;
}
