import { NextRequest, NextResponse } from 'next/server';

/**
 * Restrict /admin/* and /api/admin/* to localhost only.
 * Any request coming from a non-localhost host receives a plain 404
 * so the routes are completely invisible to the public internet.
 */
export function proxy(req: NextRequest) {
  const host = req.headers.get('host') ?? '';
  const isLocal =
    host.startsWith('localhost') ||
    host.startsWith('127.0.0.1') ||
    host.startsWith('::1');

  if (!isLocal) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
