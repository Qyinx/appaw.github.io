import type { Metadata } from 'next';
import CardFormClient from '../../../CardFormClient';

export const metadata: Metadata = {
  title: 'Edit Card | Appaw Store',
  robots: { index: false, follow: false },
};

// Static export: IDs are not known at build time;
// CardFormClient reads the ID from useParams() at runtime.
export function generateStaticParams() {
  return [];
}

export default function EditCardPage() {
  return <CardFormClient />;
}
