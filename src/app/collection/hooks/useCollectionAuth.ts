'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { BACKEND_URL } from '../types';
import {
  authAuthorizationParams,
  currentReturnTo,
  isAuthSessionError,
} from '../lib/authSession';

/**
 * Collection API auth — silent refresh via offline_access + iframe fallback.
 * On unrecoverable expiry, redirects to Auth0 login preserving return path.
 */
export function useCollectionAuth() {
  const { getAccessTokenSilently, loginWithRedirect } = useAuth0();

  const getTokenRef = useRef(getAccessTokenSilently);
  const loginRef = useRef(loginWithRedirect);
  useEffect(() => { getTokenRef.current = getAccessTokenSilently; }, [getAccessTokenSilently]);
  useEffect(() => { loginRef.current = loginWithRedirect; }, [loginWithRedirect]);

  const recoverSession = useCallback(async () => {
    await loginRef.current({
      appState: { returnTo: currentReturnTo() },
      authorizationParams: authAuthorizationParams(),
    });
  }, []);

  const getAccessToken = useCallback(async (): Promise<string> => {
    try {
      return await getTokenRef.current({
        authorizationParams: authAuthorizationParams(),
        cacheMode: 'on',
      });
    } catch (error) {
      if (isAuthSessionError(error)) {
        await recoverSession();
      }
      throw error;
    }
  }, [recoverSession]);

  const apiFetch = useCallback(async (path: string, options?: RequestInit) => {
    let token: string;
    try {
      token = await getAccessToken();
    } catch (error) {
      if (isAuthSessionError(error)) {
        throw new Error('Session expired. Redirecting to sign in…');
      }
      throw error;
    }

    const res = await fetch(`${BACKEND_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options?.headers ?? {}),
      },
    });

    if (res.status === 401) {
      await recoverSession();
      throw new Error('Session expired. Redirecting to sign in…');
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      throw new Error(err.error ?? `HTTP ${res.status}`);
    }
    return res.json();
  }, [getAccessToken, recoverSession]);

  return { getAccessToken, apiFetch, recoverSession };
}
