import type { ReactNode } from 'react';
import { psaProtectorsMetadata } from '@/lib/seo/metadata';
import { PsaProtectorsSeo } from './PsaProtectorsSeo';

export const metadata = psaProtectorsMetadata;

export default function PSAProtectorLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <PsaProtectorsSeo locale="en" />
      {children}
    </>
  );
}
