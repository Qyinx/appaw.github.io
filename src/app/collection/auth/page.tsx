'use client';

import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Loader2, LogIn, Package, AlertCircle } from 'lucide-react';

export default function CollectionAuthPage() {
  const {
    isAuthenticated,
    isLoading,
    error,
    loginWithRedirect,
  } = useAuth0();

  // Once authenticated: go straight to the collection list.
  // Registration is handled lazily there if the backend returns "User not registered on this app".
  useEffect(() => {
    if (isAuthenticated) {
      window.location.replace('/collection/list');
    }
  }, [isAuthenticated]);

  /* ── SDK initialising / processing ?code= callback ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1e1e2e] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#9B7EBF] animate-spin" />
      </div>
    );
  }

  /* ── Authenticated — redirecting ── */
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1e1e2e] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#9B7EBF] animate-spin" />
      </div>
    );
  }

  /* ── Auth0 error (e.g. access_denied) ── */
  if (error) {
    return (
      <div className="min-h-screen bg-[#1e1e2e] flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white/[0.03] border border-red-500/20 rounded-2xl p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <h2 className="text-white font-bold text-lg mb-2">Sign-in Failed</h2>
          <p className="text-white/40 text-sm mb-1 leading-relaxed">{error.message}</p>
          <p className="text-white/40 text-xs mb-6">
            {(error as Error & { error?: string }).error === 'access_denied'
              ? 'The API audience may not be registered in Auth0. Contact the site owner.'
              : 'Please try again or contact support.'}
          </p>
          <button
            type="button"
            onClick={() => loginWithRedirect({ appState: { returnTo: '/collection/list' } })}
            className="w-full py-2.5 rounded-xl bg-[#9B7EBF] text-[#1e1e2e] text-sm font-bold hover:bg-[#AF97D3] transition-colors flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* ── Not authenticated — login wall ── */
  return (
    <div className="min-h-screen bg-[#1e1e2e] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-[#9B7EBF]/10 border border-[#9B7EBF]/25 flex items-center justify-center mx-auto mb-5">
          <Package className="w-6 h-6 text-[#9B7EBF]" />
        </div>
        <h1 className="text-white font-bold text-lg mb-1">My Collection</h1>
        <p className="text-white/40 text-sm mb-6 leading-relaxed">
          Track your graded card collection — log buy prices, grades, cert numbers,
          and listing prices all in one private dashboard.
        </p>
        <button
          type="button"
          onClick={() => loginWithRedirect({ appState: { returnTo: '/collection/list' } })}
          className="w-full py-2.5 rounded-xl bg-[#9B7EBF] text-[#1e1e2e] text-sm font-bold hover:bg-[#AF97D3] transition-colors flex items-center justify-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          Sign In to Continue
        </button>
        <p className="text-white/40 text-[10px] text-center mt-4">
          Powered by Auth0 — your data stays private.
        </p>
      </div>
    </div>
  );
}
