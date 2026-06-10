#!/usr/bin/env node
/**
 * Verify RFC 8288 Link response header on homepage (isitagentready discoverability).
 * Usage: node scripts/verify-link-header.mjs [url]
 * Default url: https://appaw.store/
 */
const url = process.argv[2] ?? 'https://appaw.store/';

const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
const link = res.headers.get('link') ?? res.headers.get('Link');

if (!link) {
  console.error(`FAIL: No Link response header on ${url}`);
  console.error('');
  console.error('GitHub Pages static export cannot emit Link headers.');
  console.error('Add Cloudflare Transform Rule → Modify Response Header:');
  console.error('  Header name:  Link');
  console.error('  Value:        (see public/_headers or docs/cloudflare-link-header.md)');
  process.exit(1);
}

if (!/rel="api-catalog"/i.test(link)) {
  console.error(`FAIL: Link header present but missing rel="api-catalog"`);
  console.error(link);
  process.exit(1);
}

console.log(`PASS: Link header on ${url}`);
console.log(link);
