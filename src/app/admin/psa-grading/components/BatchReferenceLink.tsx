'use client';

import Link from 'next/link';
import React from 'react';
import { batchDetailHref } from '@/lib/grading/admin-routes';

type Props = {
  referenceCode: string | null | undefined;
};

export default function BatchReferenceLink({ referenceCode }: Props) {
  if (!referenceCode) {
    return <span className="text-text-muted">—</span>;
  }

  return (
    <Link
      href={batchDetailHref(referenceCode)}
      className="font-mono text-xs text-accent-link hover:underline"
    >
      {referenceCode}
    </Link>
  );
}
