'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { clearOpsSession, hasOpsSession } from '@/lib/grading/admin-api';
import GradingAdminAuth from './components/GradingAdminAuth';
import GradingAdminShell from './components/GradingAdminShell';

export default function GradingAdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const admFlag = sessionStorage.getItem('aaw-adm') === '1';
    if (admFlag && hasOpsSession()) {
      setUnlocked(true);
      return;
    }
    if (admFlag && !hasOpsSession()) {
      clearOpsSession();
    }
  }, []);

  const handleUnlock = useCallback(() => setUnlocked(true), []);

  if (!unlocked) {
    return <GradingAdminAuth onUnlock={handleUnlock} />;
  }

  return <GradingAdminShell>{children}</GradingAdminShell>;
}
