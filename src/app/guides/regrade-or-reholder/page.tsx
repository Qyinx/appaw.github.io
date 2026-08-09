'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/** Legacy slug — keep URL working after guide restructure (static export safe). */
export default function LegacyRegradeOrReholderRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/guides/psa-reholder-guide/');
  }, [router]);

  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-text-secondary">
      <p>
        This guide moved.{' '}
        <Link className="text-accent-link underline" href="/guides/psa-reholder-guide/">
          Continue to the PSA Reholder guide
        </Link>
        .
      </p>
    </main>
  );
}
