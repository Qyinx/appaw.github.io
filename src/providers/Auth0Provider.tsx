'use client';

import { Auth0Provider, type AppState } from '@auth0/auth0-react';

export function Auth0ProviderWrapper({ children }: { children: React.ReactNode }) {
  // If the env var is already a full URL (starts with http), use it directly.
  // If it's a path, compose with the current origin so it works on any host.
  const rawUri = process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI ?? '/collection/auth';
  const redirectUri = rawUri.startsWith('http')
    ? rawUri
    : (typeof window !== 'undefined' ? window.location.origin : '') + rawUri;

  const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE;

  // Called after code/state exchange completes. Send to the dedicated auth page
  // which handles registration and then redirects to /collection.
  function onRedirectCallback(appState?: AppState) {
    if (typeof window !== 'undefined') {
      window.location.replace(appState?.returnTo ?? '/collection/list');
    }
  }

  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
      authorizationParams={{
        redirect_uri: redirectUri,
        ...(audience ? { audience } : {}),
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
      useRefreshTokens
    >
      {children}
    </Auth0Provider>
  );
}
