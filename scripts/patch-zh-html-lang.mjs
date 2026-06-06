/**
 * Static export shares one root layout with lang="en".
 * Patch pre-rendered /zh/ HTML so crawlers get lang="zh-HK" without JS.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const OUT_DIR = 'out';
const ZH_DIR = join(OUT_DIR, 'zh');
const LANG_EN = /<html lang="en"/g;

function collectHtmlFiles(dir, files = []) {
  if (!statSync(dir, { throwIfNoEntry: false })?.isDirectory()) return files;

  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      collectHtmlFiles(path, files);
    } else if (name.endsWith('.html')) {
      files.push(path);
    }
  }
  return files;
}

const htmlFiles = collectHtmlFiles(ZH_DIR);
if (htmlFiles.length === 0) {
  console.warn('[patch-zh-html-lang] No HTML under out/zh/ — skip (run after next build)');
  process.exit(0);
}

let patched = 0;
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const updated = html.replace(LANG_EN, '<html lang="zh-HK"');
  if (updated !== html) {
    writeFileSync(file, updated);
    patched += 1;
  }
}

const stillEn = htmlFiles.filter((file) => /<html lang="en"/.test(readFileSync(file, 'utf8')));
if (stillEn.length > 0) {
  console.error(`[patch-zh-html-lang] ERROR: ${stillEn.length} file(s) still have lang="en":`);
  stillEn.slice(0, 5).forEach((f) => console.error(`  ${f}`));
  process.exit(1);
}

console.log(`[patch-zh-html-lang] Patched ${patched}/${htmlFiles.length} files; all zh HTML verified`);
