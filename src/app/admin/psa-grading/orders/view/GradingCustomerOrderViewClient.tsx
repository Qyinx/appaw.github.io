'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useBrowserPathname } from '@/hooks/useBrowserPathname';
import GradingCustomerOrderDetailClient from './GradingCustomerOrderDetailClient';

const RESERVED_SEGMENTS = new Set(['view']);

/** Parse order id from `/admin/psa-grading/orders/:id/` or `/zh/admin/...`. */
export function customerOrderIdFromPathname(pathname: string): number | null {
  const match = pathname.match(/\/(?:zh\/)?admin\/psa-grading\/orders\/([^/]+)\/?$/);
  const segment = match?.[1] ?? '';
  if (!segment || RESERVED_SEGMENTS.has(segment)) return null;
  const parsed = Number(segment);
  if (!Number.isFinite(parsed) || parsed < 1) return null;
  return parsed;
}

export default function GradingCustomerOrderViewClient() {
  const pathname = useBrowserPathname();
  const orderId = useMemo(() => customerOrderIdFromPathname(pathname), [pathname]);

  if (orderId === null) {
    return (
      <div className="space-y-3">
        <p className="text-accent-danger text-sm p-6">Invalid customer order id.</p>
        <Link href="/admin/psa-grading" className="text-accent-link text-sm hover:underline px-6">
          ← Dashboard
        </Link>
      </div>
    );
  }

  return <GradingCustomerOrderDetailClient orderId={orderId} />;
}
