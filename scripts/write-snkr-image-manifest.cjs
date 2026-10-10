/**
 * Refresh src/lib/snkr-buyback/image-manifest.ts from public/images/snkr-buyback/.
 * Prefer .webp, then .jpg, .jpeg, .png. Called from next.config.js before compile.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const imageDir = path.join(root, 'public/images/snkr-buyback');
const outFile = path.join(root, 'src/lib/snkr-buyback/image-manifest.ts');
const prefer = ['webp', 'jpg', 'jpeg', 'png'];

function writeSnkrImageManifest() {
  const found = new Map();
  if (fs.existsSync(imageDir)) {
    for (const name of fs.readdirSync(imageDir)) {
      const match = name.match(/^([A-Za-z0-9_-]+)\.(webp|jpg|jpeg|png)$/i);
      if (!match) continue;
      const cardId = match[1];
      const ext = match[2].toLowerCase();
      const prev = found.get(cardId);
      if (!prev || prefer.indexOf(ext) < prefer.indexOf(prev)) found.set(cardId, ext);
    }
  }

  const entries = [...found.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  const body =
    entries.length === 0
      ? 'export const SNKR_BUYBACK_IMAGE_EXT: Record<string, SnkrBuybackImageExt> = {};\n'
      : `export const SNKR_BUYBACK_IMAGE_EXT: Record<string, SnkrBuybackImageExt> = {\n${entries
          .map(([id, ext]) => `  '${id}': '${ext}',`)
          .join('\n')}\n};\n`;

  const source = `export type SnkrBuybackImageExt = 'webp' | 'jpg' | 'jpeg' | 'png';

/** Generated from public/images/snkr-buyback/. Do not hand-edit. */
${body}`;

  const previous = fs.existsSync(outFile) ? fs.readFileSync(outFile, 'utf8') : '';
  if (previous !== source) fs.writeFileSync(outFile, source, 'utf8');
}

writeSnkrImageManifest();
module.exports = { writeSnkrImageManifest };
