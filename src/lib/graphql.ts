/**
 * GraphQL Configuration
 * Centralized configuration for GraphQL API endpoints and settings
 */

export const graphqlConfig = {
  // GraphQL endpoint URL - can be customized via environment variable
  endpoint: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,

  // Default headers for all GraphQL requests
  defaultHeaders: {
    'Content-Type': 'application/json',
  },

  // Timeout for GraphQL requests (in milliseconds)
  timeout: 30000,

  // Whether to include auth token in requests
  withAuth: true,

  /**
   * Get the current GraphQL endpoint
   * Can be overridden programmatically if needed
   */
  getEndpoint: (): string => {
    return graphqlConfig.endpoint;
  },

  /**
   * Set a custom GraphQL endpoint
   * Useful for switching between environments
   */
  setEndpoint: (url: string): void => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('graphql_endpoint', url);
      graphqlConfig.endpoint = url;
    }
  },

  /**
   * Reset to default GraphQL endpoint from environment
   */
  resetEndpoint: (): void => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('graphql_endpoint');
    }
    graphqlConfig.endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;
  },

  /**
   * Load endpoint from session storage if previously set
   */
  loadFromSession: (): void => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('graphql_endpoint');
      if (stored) {
        graphqlConfig.endpoint = stored;
      }
    }
  },
};

/**
 * GraphQL fetch wrapper with error handling
 * Uses proxy route to handle SSL certificate errors in development
 */
export async function graphqlFetch<T = any>(
  query: string,
  variables?: Record<string, any>,
  options?: {
    headers?: Record<string, string>;
    timeout?: number;
  }
): Promise<{ data?: T; errors?: Array<{ message: string }> }> {
  // Use proxy route on client-side, direct endpoint on server-side
  const endpoint =
    typeof window !== 'undefined'
      ? process.env.NEXT_PUBLIC_GRAPHQL_PROXY || '/api/graphql'
      : graphqlConfig.getEndpoint();

  if (!endpoint) {
    throw new Error('GraphQL endpoint is not configured');
  }

  const headers: Record<string, string> = {
    ...graphqlConfig.defaultHeaders,
    ...options?.headers,
  };

  // Add auth token if available and withAuth is true
  if (graphqlConfig.withAuth && typeof window !== 'undefined') {
    const token = localStorage.getItem('auth0_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    options?.timeout || graphqlConfig.timeout
  );

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`GraphQL request failed with status ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred during GraphQL request');
  }
}

/**
 * Alternative: Use API proxy route to bypass SSL on server-side
 * This is more secure as it keeps the SSL bypass server-side only
 * 
 * Create src/app/api/graphql/route.ts:
 */
export function createGraphQLProxyRoute() {
  return `
import { NextRequest, NextResponse } from 'next/server';
import https from 'https';

export async function POST(request: NextRequest) {
  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;
  
  if (!endpoint) {
    return NextResponse.json(
      { error: 'GraphQL endpoint not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();

    // Create HTTPS agent that ignores SSL errors in development
    const agent =
      process.env.NODE_ENV === 'development'
        ? new https.Agent({
            rejectUnauthorized: false,
          })
        : undefined;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      // @ts-ignore
      agent,
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('GraphQL Proxy Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from GraphQL endpoint' },
      { status: 500 }
    );
  }
}
  `;
}
