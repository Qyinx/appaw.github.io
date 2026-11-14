import { NextRequest, NextResponse } from 'next/server';

const PORTFOLIO_PATH = /^\/(?:zh\/)?collection\/p\/([^/]+)\/?$/;
const CARD_TRADING_PATH = /^\/(?:zh\/)?business\/card-trading\/([^/]+)\/?$/;
const PORTFOLIO_RESERVED = new Set(['view', '_']);
const CARD_TRADING_RESERVED = new Set(['view', 'sell', '_']);

/**
 * Restrict /admin/* and /api/admin/* to this machine.
 * A public hostname receives a plain 404 so the routes stay invisible on the internet.
 * In dev, phones on the same Wi-Fi may use a private LAN address (192.168.x.x).
 */
function isPrivateLanHost(host: string): boolean {
  const hostname = (host.split(':')[0] ?? '').replace(/^\[|\]$/g, '');
  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname)) return true;
  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) return true;
  return /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(hostname);
}

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

  if (pathname.startsWith('/grading') && process.env.NODE_ENV === 'development') {
    return proxyGradingDev(req);
  }

  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const host = req.headers.get('host') ?? '';
    const isLocal =
      host.startsWith('localhost') ||
      host.startsWith('127.0.0.1') ||
      host.startsWith('[::1]') ||
      host.startsWith('::1') ||
      (process.env.NODE_ENV === 'development' && isPrivateLanHost(host));

    if (!isLocal) {
      return new NextResponse(null, { status: 404 });
    }
  }

  return NextResponse.next();
}

/** Phone pages are HTTPS. The worker is HTTP on :8787, which the phone blocks.
 *  Forward /grading on this dev server to the local worker. */
async function proxyGradingDev(req: NextRequest) {
  const path = req.nextUrl.pathname.replace(/\/+$/, '') || '/grading';
  const dest = new URL(`http://127.0.0.1:8787${path}${req.nextUrl.search}`);
  const headers = new Headers(req.headers);
  headers.delete('host');
  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
  const upstream = await fetch(dest, {
    method: req.method,
    headers,
    body: hasBody ? await req.arrayBuffer() : undefined,
    redirect: 'manual',
  });
  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: upstream.headers,
  });
}

export const config = {
  matcher: [
    '/collection/p/:path*',
    '/zh/collection/p/:path*',
    '/business/card-trading/:path*',
    '/zh/business/card-trading/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
    '/grading/:path*',
  ],
};
