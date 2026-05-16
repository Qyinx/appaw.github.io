'use client';

import { Auth0Provider, type AppState } from '@auth0/auth0-react';

export function Auth0ProviderWrapper({
  children,
  domain,
  clientId,
  redirectUri,
  audience,
}: {
  children: React.ReactNode;
  domain: string;
  clientId: string;
  redirectUri: string;
  audience?: string;
}) {
  function onRedirectCallback(appState?: AppState) {
    if (typeof window !== 'undefined') {
      window.location.replace(appState?.returnTo ?? '/collection/list');
    }
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
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
