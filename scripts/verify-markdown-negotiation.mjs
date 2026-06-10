#!/usr/bin/env node
/**
 * Verify Accept: text/markdown content negotiation on homepage (isitagentready).
 * Usage: node scripts/verify-markdown-negotiation.mjs [url]
 * Default url: https://appaw.store/
 */
const url = process.argv[2] ?? 'https://appaw.store/';

const res = await fetch(url, {
  method: 'HEAD',
  redirect: 'follow',
  headers: { Accept: 'text/markdown, text/html;q=0.9' },
});

const contentType = res.headers.get('content-type') ?? '';
const vary = res.headers.get('vary') ?? '';
const tokens = res.headers.get('x-markdown-tokens');

if (!/text\/markdown/i.test(contentType)) {
  console.error(`FAIL: ${url} with Accept: text/markdown returned Content-Type: ${contentType || '(none)'}`);
  console.error('');
  console.error('Static GitHub Pages cannot negotiate by Accept header.');
  console.error('Enable Cloudflare Markdown for Agents (AI Crawl Control):');
  console.error('  docs/cloudflare-markdown-negotiation.md');
  console.error('');
  console.error('Fallback without negotiation: https://appaw.store/index.md');
  process.exit(1);
}

console.log(`PASS: Markdown negotiation on ${url}`);
console.log(`  Content-Type: ${contentType.trim()}`);
if (vary) console.log(`  Vary: ${vary}`);
if (tokens) console.log(`  x-markdown-tokens: ${tokens}`);
else console.log('  x-markdown-tokens: (not set — optional; Cloudflare adds when enabled)');
