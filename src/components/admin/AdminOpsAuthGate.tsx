'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { hasOpsSession } from '@/lib/grading/admin-api';
import AdminOpsAuth from './AdminOpsAuth';

type Props = {
  children: React.ReactNode;
  title?: string;
  description?: string;
};

export default function AdminOpsAuthGate({ children, title, description }: Props) {
  const [unlocked, setUnlocked] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    setUnlocked(hasOpsSession());
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
    return <AdminOpsAuth onUnlock={handleUnlock} title={title} description={description} />;
  }

  return <>{children}</>;
}
