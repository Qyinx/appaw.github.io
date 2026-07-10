'use client';

import React, { useState } from 'react';
import { verifyGradingAdminAuth } from '@/lib/grading/admin-api';

type Props = {
  onUnlock: () => void;
};

export default function GradingAdminAuth({ onUnlock }: Props) {
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const unlock = async () => {
    setAuthError('');
    setLoading(true);
    try {
      await verifyGradingAdminAuth(password);
      sessionStorage.setItem('aaw-adm', '1');
      onUnlock();
      setPassword('');
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      if (message.includes('GRADING_ADMIN_PASS_HASH not configured')) {
        setAuthError('Admin password not configured on backend.');
      } else if (message.includes('Cannot reach grading backend')) {
        setAuthError('Cannot reach grading backend. Is the Worker running on :8787?');
      } else if (message.includes('Auth response missing token')) {
        setAuthError('Login succeeded but no ops token returned. Check POST /grading/auth.');
      } else if (message.includes('Session expired')) {
        setAuthError('Session expired — log in again.');
      } else if (message.includes('Invalid password')) {
        setAuthError('Wrong password.');
      } else if (message.includes('Password required')) {
        setAuthError('Password required.');
      } else {
        setAuthError(message || 'Unlock failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-surface-bg text-text-primary flex items-center justify-center p-6">
      <div className="w-full max-w-md border border-border-default bg-surface-panel p-6 space-y-4">
        <div>
          <p className="text-accent-brand text-[10px] uppercase tracking-[0.2em] font-semibold mb-1">
            Operations
          </p>
          <h1 className="text-xl font-semibold">PSA Grading Admin</h1>
          <p className="text-sm text-text-muted mt-1">Staff access for intake and batch tracking.</p>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full border border-border-default bg-surface-bg px-3 py-2.5 min-h-[44px]"
          onKeyDown={(e) => {
            if (e.key === 'Enter') void unlock();
          }}
        />
        <button
          type="button"
          className="btn btn-primary w-full min-h-[44px]"
          onClick={() => void unlock()}
          disabled={loading}
        >
          {loading ? 'Unlocking…' : 'Unlock'}
        </button>
        {authError && <p className="text-accent-danger text-sm">{authError}</p>}
      </div>
    </div>
  );
}
