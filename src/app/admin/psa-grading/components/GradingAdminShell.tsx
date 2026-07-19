'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useSubHeader } from '@/hooks/useSubHeader';

type Props = {
  children: React.ReactNode;
};

const NAV = [
  { href: '/admin/psa-grading', label: 'Dashboard', exact: true },
  { href: '/admin/psa-grading/intake', label: 'New Intake', exact: false },
];

function isActive(pathname: string, href: string, exact: boolean) {
  if (exact) return pathname === href;
  return pathname.startsWith(href);
}

export default function GradingAdminShell({ children }: Props) {
  const pathname = usePathname();

  useSubHeader({
    content: (
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-accent-brand text-[10px] uppercase tracking-[0.2em] font-semibold">
            PSA Grading Ops
          </p>
          <p className="text-sm font-semibold leading-tight text-text-primary">Admin Dashboard</p>
        </div>
        <nav className="flex flex-wrap items-center gap-2" aria-label="PSA grading admin">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm border min-h-[40px] inline-flex items-center transition-colors ${
                  active
                    ? 'border-accent-brand bg-accent-brand/10 text-text-primary'
                    : 'border-border-default bg-surface-bg text-text-secondary hover:text-text-primary'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/admin/psa-grading/batches/new"
            className="btn btn-primary text-sm min-h-[40px]"
          >
            New Batch
          </Link>
        </nav>
      </div>
    ),
    contentWidth: 'page',
  });

  return (
    <div className="min-h-dvh bg-surface-bg text-text-primary">
      <div className="bg-accent-success/10 border-b border-accent-success/25 text-center text-xs py-2 text-text-secondary">
        Live backend — changes persist to D1.
      </div>
      <div className="container-custom py-6">{children}</div>
    </div>
  );
}
