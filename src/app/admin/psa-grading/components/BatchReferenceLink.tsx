'use client';

import Link from 'next/link';
import React from 'react';

type Props = {
  referenceCode: string | null | undefined;
};

export default function BatchReferenceLink({ referenceCode }: Props) {
  if (!referenceCode) {
    return <span className="text-text-muted">—</span>;
  }

  return (
    <Link
      href={`/admin/psa-grading/batches/${encodeURIComponent(referenceCode)}`}
      className="font-mono text-xs text-accent-link hover:underline"
    >
      {referenceCode}
    </Link>
  );
}
