'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Next.js 16 preserves scroll on client navigations; fixed site chrome can also
 * prevent the router from scrolling the main content slot (vercel/next.js#79571).
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}
