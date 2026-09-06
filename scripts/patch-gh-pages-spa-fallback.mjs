/**
 * GitHub Pages has no rewrite support. Dynamic admin/collection URLs 404 unless
 * 404.html loads the matching /view/ shell while preserving the browser path.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT_404 = join('out', '404.html');
const MARKER = 'id="gh-pages-spa-fallback"';

const FALLBACK_SCRIPT = `<script ${MARKER}>(function(){
var p=location.pathname;
var q=location.search;
var h=location.hash;
var m;
if(/^\\/(?:zh\\/)?guides\\/regrade-or-reholder\\/?$/.test(p)){
  location.replace((p.indexOf('/zh/')===0?'/zh/guides/psa-reholder-guide/':'/guides/psa-reholder-guide/')+q+h);
  return;
}
if((m=p.match(/^\\/(?:zh\\/)?admin\\/psa-grading\\/orders\\/(?!view)([^/]+)\\/?$/))){
  var zh=p.indexOf('/zh/')===0;
  location.replace((zh?'/zh/admin/psa-grading/orders/view/?id=':'/admin/psa-grading/orders/view/?id=')+encodeURIComponent(m[1])+(q?'&'+q.slice(1):'')+h);
  return;
}
if((m=p.match(/^\\/(?:zh\\/)?admin\\/psa-grading\\/batches\\/(?!view|new)([^/]+)\\/?$/))){
  var zh=p.indexOf('/zh/')===0;
  location.replace((zh?'/zh/admin/psa-grading/batches/view/?ref=':'/admin/psa-grading/batches/view/?ref=')+encodeURIComponent(m[1])+(q?'&'+q.slice(1):'')+h);
  return;
}
var d=null;
if(/^\\/(?:zh\\/)?collection\\/p\\/(?!view|_)[^/]+\\/?$/.test(p))d=(p.indexOf('/zh/')===0?'/zh/collection/p/view/':'/collection/p/view/');
if(!d && /^\\/(?:zh\\/)?business\\/card-trading\\/(?!view|sell|_)[^/]+\\/?$/.test(p))d=(p.indexOf('/zh/')===0?'/zh/business/card-trading/view/':'/business/card-trading/view/');
if(!d)return;
document.documentElement.style.visibility='hidden';
fetch(d).then(function(r){if(!r.ok)throw new Error(r.status);return r.text()}).then(function(html){
history.replaceState(null,'',p+location.search+location.hash);
document.open();document.write(html);document.close();
}).catch(function(){document.documentElement.style.visibility='';});
})();</script>`;

let html;
try {
  html = readFileSync(OUT_404, 'utf8');
} catch {
  console.warn('[patch-gh-pages-spa-fallback] out/404.html missing — skip (run after next build)');
  process.exit(0);
}

if (html.includes(MARKER)) {
  console.log('[patch-gh-pages-spa-fallback] Already patched');
  process.exit(0);
}

const headIdx = html.indexOf('<head>');
if (headIdx === -1) {
  console.error('[patch-gh-pages-spa-fallback] ERROR: no <head> in out/404.html');
  process.exit(1);
}

const insertAt = headIdx + '<head>'.length;
const updated = html.slice(0, insertAt) + FALLBACK_SCRIPT + html.slice(insertAt);
writeFileSync(OUT_404, updated);
console.log('[patch-gh-pages-spa-fallback] Patched out/404.html for dynamic view shells');
