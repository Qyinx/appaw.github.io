'use client';

import { Auth0Provider, type AppState } from '@auth0/auth0-react';
import { localizedHref, routeLanguage } from '@/lib/i18n-routing';
import { AUTH0_SCOPE } from '@/app/collection/lib/authSession';

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
      const lang = routeLanguage(window.location.pathname);
      const returnTo = appState?.returnTo ?? '/collection/list';
      window.location.replace(localizedHref(returnTo, lang));
    }
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        scope: AUTH0_SCOPE,
        ...(audience ? { audience } : {}),
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
      useRefreshTokens
      useRefreshTokensFallback
    >
      {children}
    </Auth0Provider>
  );
}
