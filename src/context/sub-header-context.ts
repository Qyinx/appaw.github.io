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
  contentWidth?: 'page' | 'tool';
};

function hasSubHeaderContent(config: SubHeaderConfig): boolean {
  return Boolean(config.content ?? config.leading ?? config.center ?? config.trailing);
}

export type SubHeaderContextValue = {
  getConfig: () => SubHeaderConfig | null;
  setConfig: (config: SubHeaderConfig | null) => void;
  subscribe: (listener: () => void) => () => void;
  getVersion: () => number;
};

export const SubHeaderContext = createContext<SubHeaderContextValue | undefined>(undefined);

export function useSubHeaderContext(): SubHeaderContextValue {
  const ctx = useContext(SubHeaderContext);
  if (!ctx) {
    throw new Error('useSubHeaderContext must be used within SubHeaderProvider');
  }
  return ctx;
}
