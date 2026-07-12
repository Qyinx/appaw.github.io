'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useBrowserPathname } from '@/hooks/useBrowserPathname';
import { useBrowserSearch } from '@/hooks/useBrowserSearch';
import { batchReferenceFromLocation } from '@/lib/grading/admin-routes';
import GradingBatchDetailClient from './GradingBatchDetailClient';

export { batchReferenceFromLocation as batchReferenceFromPathname } from '@/lib/grading/admin-routes';

export default function GradingBatchViewClient() {
  const pathname = useBrowserPathname();
  const search = useBrowserSearch();
  const referenceCode = useMemo(
    () => batchReferenceFromLocation(pathname, search),
    [pathname, search],
  );

  if (!referenceCode) {
    return (
      <div className="space-y-3">
        <p className="text-accent-danger text-sm p-6">Invalid batch reference.</p>
        <Link href="/admin/psa-grading" className="text-accent-link text-sm hover:underline px-6">
          ← Dashboard
        </Link>
      </div>
    );
  }

  return <GradingBatchDetailClient referenceCode={referenceCode} />;
}
