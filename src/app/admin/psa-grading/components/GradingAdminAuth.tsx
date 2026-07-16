'use client';

import React, { useState } from 'react';
import { verifyGradingAdminAuth } from '@/lib/grading/admin-api';
import TurnstileWidget from '@/components/TurnstileWidget';

type Props = {
  onUnlock: () => void;
};

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? '';

export default function GradingAdminAuth({ onUnlock }: Props) {
  const [password, setPassword] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [resetSignal, setResetSignal] = useState(0);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const resetTurnstile = () => {
    setTurnstileToken('');
    setResetSignal((n) => n + 1);
  };

  const unlock = async () => {
    setAuthError('');
    if (!SITE_KEY) {
      setAuthError('Turnstile site key not configured (NEXT_PUBLIC_TURNSTILE_SITE_KEY).');
      return;
    }
    if (!turnstileToken) {
      setAuthError('Complete the security check first.');
      return;
    }
    setLoading(true);
    try {
      await verifyGradingAdminAuth(password, turnstileToken);
      sessionStorage.setItem('aaw-adm', '1');
      onUnlock();
      setPassword('');
      resetTurnstile();
    } catch (e) {
      resetTurnstile();
      const message = e instanceof Error ? e.message : String(e);
      if (message.includes('GRADING_ADMIN_PASS_HASH not configured')) {
        setAuthError('Admin password not configured on backend.');
      } else if (message.includes('TURNSTILE_SECRET_KEY not configured')) {
        setAuthError('Turnstile not configured on backend.');
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
      } else if (message.includes('Turnstile token required')) {
        setAuthError('Complete the security check first.');
      } else if (message.includes('Turnstile verification failed')) {
        setAuthError('Security check failed. Try again.');
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
        {SITE_KEY ? (
          <TurnstileWidget
            siteKey={SITE_KEY}
            onToken={setTurnstileToken}
            onExpire={() => setTurnstileToken('')}
            onError={() => {
              setTurnstileToken('');
              setAuthError('Security check failed to load. Refresh and try again.');
            }}
            resetSignal={resetSignal}
          />
        ) : (
          <p className="text-accent-danger text-sm">
            Turnstile site key missing. Set NEXT_PUBLIC_TURNSTILE_SITE_KEY.
          </p>
        )}
        <button
          type="button"
          className="btn btn-primary w-full min-h-[44px]"
          onClick={() => void unlock()}
          disabled={loading || !SITE_KEY || !turnstileToken}
        >
          {loading ? 'Unlocking…' : 'Unlock'}
        </button>
        {authError && <p className="text-accent-danger text-sm">{authError}</p>}
      </div>
    </div>
  );
}
