import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: { absolute: 'Admin | Appaw Store' },
  description: 'Staff ops tools.',
  robots: { index: false, follow: false },
  alternates: {
    canonical: '/zh/admin/',
    languages: {
      'zh-HK': '/zh/admin/',
      en: '/admin/',
      'x-default': '/admin/',
    },
  },
};

const TOOLS = [
  {
    href: '/zh/admin/psa-grading/',
    label: 'PSA 評級代送',
    description: '點收、批次、顧客訂單、PSA sync。',
  },
  {
    href: '/zh/admin/snkr-buyback-images/',
    label: 'SNKR 卡圖對照',
    description: '對照買取 card_id 同卡面檔名。',
  },
] as const;

export default function AdminHubZhPage() {
  return (
    <div className="min-h-dvh bg-surface-bg text-text-primary">
      <div className="container-custom py-10 max-w-xl space-y-6">
        <div>
          <p className="text-accent-brand text-[10px] uppercase tracking-[0.2em] font-semibold mb-1">
            Operations
          </p>
          <h1 className="text-2xl font-semibold">Admin</h1>
          <p className="text-sm text-text-muted mt-1">揀工具。Session 共用所有 admin 路由。</p>
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
