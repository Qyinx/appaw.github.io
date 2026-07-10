'use client';

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { SubHeaderContext, type SubHeaderConfig } from '@/context/sub-header-context';

export function SubHeaderProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const configRef = useRef<SubHeaderConfig | null>(null);
  const versionRef = useRef(0);
  const listenersRef = useRef(new Set<() => void>());

  const subscribe = useCallback((listener: () => void) => {
    listenersRef.current.add(listener);
    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  const getVersion = useCallback(() => versionRef.current, []);

  const notify = useCallback(() => {
    versionRef.current += 1;
    listenersRef.current.forEach((listener) => listener());
  }, []);

  const getConfig = useCallback(() => configRef.current, []);

  const setConfig = useCallback((next: SubHeaderConfig | null) => {
    configRef.current = next;
    notify();
  }, [notify]);

  useEffect(() => {
    configRef.current = null;
    notify();
  }, [pathname, notify]);

  const value = useMemo(
    () => ({ getConfig, setConfig, subscribe, getVersion }),
    [getConfig, setConfig, subscribe, getVersion],
  );

  return (
    <SubHeaderContext.Provider value={value}>
      {children}
    </SubHeaderContext.Provider>
  );
}
