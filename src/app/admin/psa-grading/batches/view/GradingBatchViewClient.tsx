'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useBrowserPathname } from '@/hooks/useBrowserPathname';
import GradingBatchDetailClient from './GradingBatchDetailClient';

const RESERVED_SEGMENTS = new Set(['view', 'new']);

/** Parse batch reference from `/admin/psa-grading/batches/:code/` or `/zh/admin/...`. */
export function batchReferenceFromPathname(pathname: string): string {
  const match = pathname.match(/\/(?:zh\/)?admin\/psa-grading\/batches\/([^/]+)\/?$/);
  const segment = match?.[1] ?? '';
  if (!segment || RESERVED_SEGMENTS.has(segment)) return '';
  return decodeURIComponent(segment);
}

export default function GradingBatchViewClient() {
  const pathname = useBrowserPathname();
  const referenceCode = useMemo(() => batchReferenceFromPathname(pathname), [pathname]);

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
