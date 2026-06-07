import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * POST /api/admin/psa-fetch
 *
 * Two modes:
 *
 * 1. Auto-scrape:  { certNumber, cardId }
 *    → Fetches psacard.com/cert/{certNumber}, extracts CloudFront image URLs,
 *      downloads them, and saves into public/images-optimized/trade/{cardId}/
 *
 * 2. Direct URLs:  { cardId, urls: [frontUrl, backUrl?] }
 *    → Downloads the provided image URLs directly (bypasses scraping).
 *      Use this when the cert page is blocked (403).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cardId } = body;

    if (!cardId) {
      return NextResponse.json({ error: 'Missing cardId' }, { status: 400 });
    }

    /* ═══════════════════════════════════════════════════════════════
       MODE 2 — Direct image URLs (fallback / manual paste)
       ═══════════════════════════════════════════════════════════════ */
    if (body.urls && Array.isArray(body.urls) && body.urls.length > 0) {
      return await downloadAndSave(body.urls as string[], cardId);
    }

    /* ═══════════════════════════════════════════════════════════════
       MODE 1 — Auto-scrape PSA cert page
       ═══════════════════════════════════════════════════════════════ */
    const certNumber = body.certNumber;
    if (!certNumber) {
      return NextResponse.json({ error: 'Missing certNumber or urls' }, { status: 400 });
    }

    const html = await fetchCertPage(certNumber);

    if (!html) {
      return NextResponse.json(
        { error: 'blocked', message: 'PSA blocked the request (403). Use manual mode to paste image URLs.' },
        { status: 403 },
      );
    }

    /* ── Extract image URLs by alt text ──────────────────────────── */
    // PSA renders: <img ... alt="Cert image 1" src="..."> (front)
    //              <img ... alt="Cert image 2" src="..."> (back)
    const imageUrls: string[] = [];

    const certImg1 = html.match(/<img[^>]*alt\s*=\s*["']Cert image 1["'][^>]*src\s*=\s*["']([^"']+)["'][^>]*>/i)
      ?? html.match(/<img[^>]*src\s*=\s*["']([^"']+)["'][^>]*alt\s*=\s*["']Cert image 1["'][^>]*>/i);
    if (certImg1) imageUrls.push(certImg1[1]);

    const certImg2 = html.match(/<img[^>]*alt\s*=\s*["']Cert image 2["'][^>]*src\s*=\s*["']([^"']+)["'][^>]*>/i)
      ?? html.match(/<img[^>]*src\s*=\s*["']([^"']+)["'][^>]*alt\s*=\s*["']Cert image 2["'][^>]*>/i);
    if (certImg2) imageUrls.push(certImg2[1]);

    if (imageUrls.length === 0) {
      return NextResponse.json(
        { error: 'no-images', message: 'No card images found on the PSA cert page. The cert may have no photos uploaded.' },
        { status: 404 },
      );
    }

    return await downloadAndSave(imageUrls, cardId);
  } catch (e) {
    console.error('[psa-fetch]', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/* ──────────────────────────────────────────────────────────────────────
   Attempt to fetch the PSA cert HTML with several strategies.
   Returns the HTML string, or null if all strategies are blocked.
   ────────────────────────────────────────────────────────────────────── */
async function fetchCertPage(certNumber: string): Promise<string | null> {
  const urls = [
    `https://www.psacard.com/cert/${certNumber}`,
    `https://www.psacard.com/cert/${certNumber}/psa`,
  ];

  const headerSets: Record<string, string>[] = [
    {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Sec-Ch-Ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
    },
    {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    {
      'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'Accept': 'text/html',
    },
  ];

  for (const url of urls) {
    for (const headers of headerSets) {
      try {
        const res = await fetch(url, {
          headers,
          redirect: 'follow',
        });
        if (res.ok) {
          const text = await res.text();
          // Make sure it's real HTML with cert content (not a challenge page)
          if (text.includes('cloudfront.net/cert/') || text.includes('Cert Number')) {
            return text;
          }
        }
      } catch {
        // try next combination
      }
    }
  }

  return null;
}

/* ──────────────────────────────────────────────────────────────────────
   Download images from URLs and save to images-optimized/trade.
   ────────────────────────────────────────────────────────────────────── */
async function downloadAndSave(imageUrls: string[], cardId: string) {
  const dir = path.join(process.cwd(), 'public', 'images-optimized', 'trade', cardId);
  await fs.mkdir(dir, { recursive: true });

  const result: { front?: string; back?: string } = {};

  for (let i = 0; i < Math.min(imageUrls.length, 2); i++) {
    let url = imageUrls[i].trim();
    if (!url) continue;

    // Try to upgrade to larger image if URL uses /small/ path
    const largeUrl = url.replace('/small/', '/large/');

    const side = i === 0 ? 'front' : 'back';
    const ext = (url.split('.').pop() || 'jpg').split('?')[0].split('#')[0];

    // Try large first, fall back to original URL
    let imgRes = await fetch(largeUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        Referer: 'https://www.psacard.com/',
      },
    });

    if (!imgRes.ok && largeUrl !== url) {
      // Fall back to original URL
      imgRes = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
          Referer: 'https://www.psacard.com/',
        },
      });
    }

    if (!imgRes.ok) {
      console.warn(`[psa-fetch] Failed to download ${side} image (${imgRes.status}): ${url}`);
      continue;
    }

    const buffer = Buffer.from(await imgRes.arrayBuffer());
    const filename = `${side}.${ext}`;

    await fs.writeFile(path.join(dir, filename), buffer);

    result[side] = `/images/trade/${cardId}/${filename}`;
  }

  if (!result.front && !result.back) {
    return NextResponse.json(
      { error: 'Failed to download any images' },
      { status: 500 },
    );
  }

  return NextResponse.json(result);
}
