'use client';

import React from 'react';
import GradingAdminShell from './components/GradingAdminShell';

export default function GradingAdminLayoutClient({ children }: { children: React.ReactNode }) {
  return <GradingAdminShell>{children}</GradingAdminShell>;
}
