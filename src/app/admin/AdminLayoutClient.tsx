'use client';

import React from 'react';
import AdminOpsAuthGate from '@/components/admin/AdminOpsAuthGate';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <AdminOpsAuthGate title="Admin" description="Staff access for ops tools.">
      {children}
    </AdminOpsAuthGate>
  );
}
