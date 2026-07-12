'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { clearOpsSession, hasOpsSession } from '@/lib/grading/admin-api';
import GradingAdminAuth from './components/GradingAdminAuth';
import GradingAdminShell from './components/GradingAdminShell';

export default function GradingAdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    const admFlag = sessionStorage.getItem('aaw-adm') === '1';
    if (admFlag && hasOpsSession()) {
      setUnlocked(true);
    } else if (admFlag && !hasOpsSession()) {
      clearOpsSession();
    }
    setSessionChecked(true);
  }, []);

  const handleUnlock = useCallback(() => setUnlocked(true), []);

  if (!sessionChecked) {
    return (
      <div className="min-h-dvh bg-surface-bg text-text-primary flex items-center justify-center p-6">
        <p className="text-text-muted text-sm">Loading…</p>
      </div>
    );
  }

  if (!unlocked) {
    return <GradingAdminAuth onUnlock={handleUnlock} />;
  }

  return <GradingAdminShell>{children}</GradingAdminShell>;
}

