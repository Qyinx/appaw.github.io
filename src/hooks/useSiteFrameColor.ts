'use client';

import { useEffect } from 'react';

/** Drive the site-frame (body padding) from a product finish. */
export function useSiteFrameColor(hex: string | undefined, hex2?: string) {
  useEffect(() => {
    if (!hex) return;
    const root = document.documentElement;
    root.style.setProperty('--surface-frame', hex);
    if (hex2) {
      root.style.setProperty(
        '--surface-frame-image',
        `linear-gradient(160deg, ${hex} 0%, ${hex2} 100%)`,
      );
    } else {
      root.style.setProperty('--surface-frame-image', 'none');
    }
    return () => {
      root.style.removeProperty('--surface-frame');
      root.style.removeProperty('--surface-frame-image');
    };
  }, [hex, hex2]);
}
