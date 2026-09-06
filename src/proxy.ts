import { NextRequest, NextResponse } from 'next/server';

const PORTFOLIO_PATH = /^\/(?:zh\/)?collection\/p\/([^/]+)\/?$/;
const CARD_TRADING_PATH = /^\/(?:zh\/)?business\/card-trading\/([^/]+)\/?$/;
const PORTFOLIO_RESERVED = new Set(['view', '_']);
const CARD_TRADING_RESERVED = new Set(['view', 'sell', '_']);

/**
 * Restrict /admin/* and /api/admin/* to localhost only.
 * Any request coming from a non-localhost host receives a plain 404
 * so the routes are completely invisible to the public internet.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Share URLs use `/collection/p/:uuid/` but static export cannot pre-build every uuid.
  // Rewrite to the static `/view/` page (no dynamic segment) — client reads uuid from URL.
  const portfolioMatch = pathname.match(PORTFOLIO_PATH);
  if (portfolioMatch) {
    const segment = portfolioMatch[1];
    if (segment && !PORTFOLIO_RESERVED.has(segment)) {
      const isZh = pathname.startsWith('/zh/');
      const url = req.nextUrl.clone();
      url.pathname = isZh ? '/zh/collection/p/view/' : '/collection/p/view/';
      return NextResponse.rewrite(url);
    }
  }

  const cardMatch = pathname.match(CARD_TRADING_PATH);
  if (cardMatch) {
    const segment = cardMatch[1];
    if (segment && !CARD_TRADING_RESERVED.has(segment)) {
      const isZh = pathname.startsWith('/zh/');
      const url = req.nextUrl.clone();
      url.pathname = isZh ? '/zh/business/card-trading/view/' : '/business/card-trading/view/';
      return NextResponse.rewrite(url);
    }
  }

  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const host = req.headers.get('host') ?? '';
    const isLocal =
      host.startsWith('localhost') ||
      host.startsWith('127.0.0.1') ||
      host.startsWith('::1');

    if (!isLocal) {
      return new NextResponse(null, { status: 404 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/collection/p/:path*',
    '/zh/collection/p/:path*',
    '/business/card-trading/:path*',
    '/zh/business/card-trading/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
