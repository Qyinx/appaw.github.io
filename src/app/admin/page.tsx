import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: { absolute: 'Admin | Appaw Store' },
  description: 'Staff ops tools.',
  robots: { index: false, follow: false },
  alternates: {
    canonical: '/admin/',
    languages: {
      'zh-HK': '/zh/admin/',
      en: '/admin/',
      'x-default': '/admin/',
    },
  },
};

const TOOLS = [
  {
    href: '/admin/psa-grading/',
    label: 'PSA grading',
    description: 'Intake, batches, customer orders, PSA sync.',
  },
  {
    href: '/admin/snkr-buyback-images/',
    label: 'SNKR card images',
    description: 'Map buyback card_id to image filenames.',
  },
] as const;

export default function AdminHubPage() {
  return (
    <div className="min-h-dvh bg-surface-bg text-text-primary">
      <div className="container-custom py-10 max-w-xl space-y-6">
        <div>
          <p className="text-accent-brand text-[10px] uppercase tracking-[0.2em] font-semibold mb-1">
            Operations
          </p>
          <h1 className="text-2xl font-semibold">Admin</h1>
          <p className="text-sm text-text-muted mt-1">Pick a tool. Session shared across admin routes.</p>
        </div>
        <ul className="space-y-3">
          {TOOLS.map((tool) => (
            <li key={tool.href}>
              <Link
                href={tool.href}
                className="block border border-border-default bg-surface-panel p-4 hover:border-accent-brand transition-colors"
              >
                <p className="font-semibold text-text-primary">{tool.label}</p>
                <p className="text-sm text-text-muted mt-1">{tool.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
