'use client';

import Link from 'next/link';
import React from 'react';
import { customerOrderDetailHref } from '@/lib/grading/admin-routes';

type Props = {
  orderId: number | null | undefined;
};

export default function CustomerOrderLink({ orderId }: Props) {
  if (orderId === null || orderId === undefined) {
    return <span className="text-text-muted">—</span>;
  }

  return (
    <Link
      href={customerOrderDetailHref(orderId)}
      className="font-mono text-xs text-accent-link hover:underline"
    >
      {orderId}
    </Link>
  );
}
