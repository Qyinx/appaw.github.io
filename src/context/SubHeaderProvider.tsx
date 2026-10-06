'use client';

import React from 'react';
import { SubHeaderContext, getSubHeaderStore } from '@/context/sub-header-context';

export function SubHeaderProvider({ children }: { children: React.ReactNode }) {
  const value = getSubHeaderStore();
  return <SubHeaderContext.Provider value={value}>{children}</SubHeaderContext.Provider>;
}
