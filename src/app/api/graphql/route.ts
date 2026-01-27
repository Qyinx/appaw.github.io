import { NextRequest, NextResponse } from 'next/server';
import https from 'https';
import http from 'http';
import { URL } from 'url';

/**
 * GraphQL API Proxy Route
 * Proxies GraphQL requests through server-side to handle SSL certificate errors
 * This keeps the SSL bypass secure (server-side only, not exposed to client)
 */

function makeRequest(url: string, options: any, data: string): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;

    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: options.headers,
      rejectUnauthorized: false, // Allow self-signed certificates
    };

    const req = protocol.request(requestOptions, (res) => {
      let body = '';

      res.on('data', (chunk: Buffer) => {
        body += chunk.toString();
      });

      res.on('end', () => {
        resolve({ status: res.statusCode || 500, body });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

export async function POST(request: NextRequest) {
  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;

  if (!endpoint) {
    return NextResponse.json(
      { error: 'GraphQL endpoint not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await request.text();
    
    // Forward all headers from the client request
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body).toString(),
    };

    // Copy authorization and other relevant headers from the incoming request
    const incomingHeaders = request.headers;
    if (incomingHeaders.get('authorization')) {
      headers['authorization'] = incomingHeaders.get('authorization') || '';
    }
    if (incomingHeaders.get('x-requested-with')) {
      headers['x-requested-with'] = incomingHeaders.get('x-requested-with') || '';
    }

    const { status, body: responseBody } = await makeRequest(endpoint, { headers }, body);

    if (status !== 200) {
      console.error(
        `GraphQL endpoint returned status ${status}:`,
        endpoint,
        responseBody
      );
    }

    const data = JSON.parse(responseBody);
    return NextResponse.json(data, { status });
  } catch (error) {
    console.error('GraphQL Proxy Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch from GraphQL endpoint',
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
