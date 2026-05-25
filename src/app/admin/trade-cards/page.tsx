import type { Metadata } from 'next';
import AdminClient from './AdminClient';
import { adminTradeMetadata } from '@/lib/seo/metadata';

export const metadata = adminTradeMetadata;

export default function AdminPage() {
  return <AdminClient />;
}
