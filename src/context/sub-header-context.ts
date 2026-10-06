'use client';

import { createContext, useContext } from 'react';

export type SubHeaderWidth = 'wide' | 'narrow';
export type SubHeaderLayout = 'bar' | 'form' | 'sidebar';

export type SubHeaderConfig = {
  width?: SubHeaderWidth;
  layout?: SubHeaderLayout;
  variant?: 'default' | 'tool';
  leading?: React.ReactNode;
  center?: React.ReactNode;
  trailing?: React.ReactNode;
  /** Full-width panel (e.g. marketplace filters). Replaces leading/center/trailing when set. */
  content?: React.ReactNode;
  contentWidth?: 'page' | 'tool' | 'guide';
};

export type SubHeaderContextValue = {
  getConfig: () => SubHeaderConfig | null;
  setConfig: (config: SubHeaderConfig | null) => void;
  subscribe: (listener: () => void) => () => void;
  getVersion: () => number;
  claim: symbol | null;
};

const STORE_KEY = '__appawSubHeaderStore';

function createSubHeaderStore(): SubHeaderContextValue {
  let config: SubHeaderConfig | null = null;
  let version = 0;
  let claim: symbol | null = null;
  const listeners = new Set<() => void>();

  const notify = () => {
    version += 1;
    listeners.forEach((listener) => listener());
  };

  return {
    get claim() {
      return claim;
    },
    set claim(next) {
      claim = next;
    },
    getConfig: () => config,
    getVersion: () => version,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    setConfig: (next) => {
      config = next;
      notify();
    },
  };
}

/** Singleton so HMR chunks share one slot. */
export function getSubHeaderStore(): SubHeaderContextValue {
  const g = globalThis as typeof globalThis & { [STORE_KEY]?: SubHeaderContextValue };
  g[STORE_KEY] ??= createSubHeaderStore();
  return g[STORE_KEY];
}

export const SubHeaderContext = createContext<SubHeaderContextValue | undefined>(undefined);

export function useSubHeaderContext(): SubHeaderContextValue {
  const ctx = useContext(SubHeaderContext);
  if (!ctx) {
    throw new Error('useSubHeaderContext must be used within SubHeaderProvider');
  }
  return ctx;
}
