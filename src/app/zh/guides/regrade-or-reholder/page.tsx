'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/** Legacy slug — keep URL working after guide restructure (static export safe). */
export default function ZhLegacyRegradeOrReholderRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/zh/guides/psa-reholder-guide/');
  }, [router]);

  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-text-secondary">
      <p>
        此指南已遷移至新網址。{' '}
        <Link className="text-accent-link underline" href="/zh/guides/psa-reholder-guide/">
          前往 PSA 換殼指南
        </Link>
        。
      </p>
    </main>
  );
}
