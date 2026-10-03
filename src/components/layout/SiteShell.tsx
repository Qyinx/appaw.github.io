'use client';

import React from 'react';
import { SubHeaderProvider } from '@/context/SubHeaderProvider';
import Header from '@/components/layout/Header';
import SiteSubHeader from '@/components/layout/SiteSubHeader';

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <SubHeaderProvider>
      <Header />
      <SiteSubHeader />
      {/* Reserves flow height for fixed header (+ measured subheader). */}
      <div className="site-chrome-flow-spacer" aria-hidden="true" />
      <main id="main-content" className="site-main bg-surface-bg" tabIndex={-1}>
        {children}
      </main>
    </SubHeaderProvider>
  );
}
