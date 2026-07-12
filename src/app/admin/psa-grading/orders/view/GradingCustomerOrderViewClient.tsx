'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useBrowserPathname } from '@/hooks/useBrowserPathname';
import { useBrowserSearch } from '@/hooks/useBrowserSearch';
import { customerOrderIdFromLocation } from '@/lib/grading/admin-routes';
import GradingCustomerOrderDetailClient from './GradingCustomerOrderDetailClient';

export { customerOrderIdFromLocation as customerOrderIdFromPathname } from '@/lib/grading/admin-routes';

export default function GradingCustomerOrderViewClient() {
  const [locationReady, setLocationReady] = useState(false);
  const pathname = useBrowserPathname();
  const search = useBrowserSearch();

  useEffect(() => {
    setLocationReady(true);
  }, []);

  const orderId = useMemo(
    () => (locationReady ? customerOrderIdFromLocation(pathname, search) : null),
    [locationReady, pathname, search],
  );

  if (!locationReady) {
    return <p className="text-text-muted text-sm p-6">Loading…</p>;
  }

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
