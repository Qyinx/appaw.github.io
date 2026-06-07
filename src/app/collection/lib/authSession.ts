/** Auth0 scopes required for silent refresh (Refresh Token Rotation). */
export const AUTH0_SCOPE = 'openid profile email offline_access';

export function authAuthorizationParams() {
  const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE;
  return {
    scope: AUTH0_SCOPE,
    ...(audience ? { audience } : {}),
  };
}

/** True when the SDK cannot renew the session without an interactive login. */
export function isAuthSessionError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const e = error as { error?: string; message?: string; error_description?: string };
  const blob = `${e.error ?? ''} ${e.message ?? ''} ${e.error_description ?? ''}`.toLowerCase();
  return (
    e.error === 'login_required' ||
    e.error === 'consent_required' ||
    e.error === 'missing_refresh_token' ||
    e.error === 'invalid_grant' ||
    e.error === 'interaction_required' ||
    blob.includes('missing refresh token') ||
    blob.includes('login required') ||
    blob.includes('consent required')
  );
}

export function currentReturnTo(): string {
  if (typeof window === 'undefined') return '/collection/list';
  return window.location.pathname + window.location.search;
}
