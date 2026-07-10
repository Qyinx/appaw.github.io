'use client';

import { useLayoutEffect, useRef } from 'react';
import { useSubHeaderContext, type SubHeaderConfig } from '@/context/sub-header-context';

function hasSubHeaderContent(config: SubHeaderConfig): boolean {
  return Boolean(config.content ?? config.leading ?? config.center ?? config.trailing);
}

/**
 * Register global sub-header chrome for the current page.
 * Clears on unmount and on route change (provider resets pathname).
 */
export function useSubHeader(config: SubHeaderConfig | null) {
  const { setConfig } = useSubHeaderContext();
  const configRef = useRef(config);
  configRef.current = config;

  useLayoutEffect(() => {
    const next = configRef.current;
    if (!next || !hasSubHeaderContent(next)) {
      setConfig(null);
      return () => setConfig(null);
    }
    setConfig(next);
    return () => setConfig(null);
  });
}
