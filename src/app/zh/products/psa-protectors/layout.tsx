import type { ReactNode } from 'react';
import { PsaProtectorsSeo } from '@/app/products/psa-protectors/PsaProtectorsSeo';
import { zhPsaProtectorsMetadata } from '@/lib/seo/metadata';

export const metadata = zhPsaProtectorsMetadata;

export default function ZhPsaProtectorLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <PsaProtectorsSeo locale="zh" />
      {children}
    </>
  );
}
