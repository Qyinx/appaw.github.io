'use client';

import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { LogIn, Package, AlertCircle } from 'lucide-react';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';
import { authAuthorizationParams } from '@/app/collection/lib/authSession';
import { CollectionLoadingSkeleton } from '@/app/collection/components/CollectionLoadingSkeleton';
import { CollectionAnimeEnter } from '@/app/collection/components/CollectionAnimeEnter';

function AuthPanel({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <CollectionAnimeEnter className={`w-full max-w-sm panel p-8 text-center ${className}`}>
      {children}
    </CollectionAnimeEnter>
  );
}

export default function CollectionAuthPage() {
  const localize = useLocalizedPath();
  const {
    isAuthenticated,
    isLoading,
    error,
    loginWithRedirect,
  } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      window.location.replace(localize('/collection/list'));
    }
  }, [isAuthenticated, localize]);

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-surface-bg collection-workspace page-blueprint flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <CollectionLoadingSkeleton variant="form" rows={4} label="Loading" />
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-dvh bg-surface-bg collection-workspace page-blueprint flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <CollectionLoadingSkeleton variant="form" rows={3} label="Redirecting" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-dvh bg-surface-bg collection-workspace page-blueprint flex items-center justify-center p-4 overflow-x-clip">
        <AuthPanel>
          <div className="w-12 h-12 border border-accent-danger/30 bg-accent-danger/10 flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-6 h-6 text-accent-danger" aria-hidden="true" />
          </div>
          <h2 className="text-text-primary font-bold text-lg mb-2">Sign-in Failed</h2>
          <p className="text-text-secondary text-sm mb-1 leading-relaxed">{error.message}</p>
          <p className="text-text-muted text-xs mb-6">
            {(error as Error & { error?: string }).error === 'access_denied'
              ? 'The API audience may not be registered in Auth0. Contact the site owner.'
              : 'Please try again or contact support.'}
          </p>
          <button
            type="button"
            onClick={() => loginWithRedirect({
              appState: { returnTo: localize('/collection/list') },
              authorizationParams: authAuthorizationParams(),
            })}
            className="collection-action-pill collection-action-pill--primary collection-action-pill--block min-h-11 w-full justify-center"
          >
            <LogIn className="w-4 h-4" aria-hidden="true" />
            Try Again
          </button>
        </AuthPanel>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-surface-bg collection-workspace page-blueprint flex items-center justify-center p-4 overflow-x-clip">
      <AuthPanel>
        <div className="w-12 h-12 border border-accent-link/30 bg-accent-link/10 flex items-center justify-center mx-auto mb-5">
          <Package className="w-6 h-6 text-accent-link" aria-hidden="true" />
        </div>
        <h1 className="text-text-primary font-bold text-lg mb-1">My Collection</h1>
        <p className="text-text-secondary text-sm mb-6 leading-relaxed">
          Track your graded card collection. Log buy prices, grades, cert numbers,
          and listing prices in one private dashboard.
        </p>
        <button
          type="button"
          onClick={() => loginWithRedirect({
            appState: { returnTo: localize('/collection/list') },
            authorizationParams: authAuthorizationParams(),
          })}
          className="collection-action-pill collection-action-pill--primary collection-action-pill--block min-h-11 w-full justify-center"
        >
          <LogIn className="w-4 h-4" aria-hidden="true" />
          Sign In to Continue
        </button>
        <p className="text-text-muted text-xs text-center mt-4">
          Powered by Auth0. Your data stays private.
        </p>
      </AuthPanel>
    </div>
  );
}
