import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { createRequire } from 'module';
import sharp from 'sharp';

const require = createRequire(path.join(process.cwd(), 'package.json'));
const { writeSnkrImageManifest } = require('./scripts/write-snkr-image-manifest.cjs') as {
  writeSnkrImageManifest: () => void;
};

const CARD_ID_RE = /^[a-f0-9]{12}$/i;
const MAX_BYTES = 12 * 1024 * 1024;

function localOnly() {
  return process.env.NODE_ENV !== 'production';
}

export async function POST(req: NextRequest) {
  if (!localOnly()) {
    return NextResponse.json(
      { error: 'Upload is only available during local npm run dev.' },
      { status: 403 },
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const cardIdRaw = formData.get('cardId');
    const cardId = typeof cardIdRaw === 'string' ? cardIdRaw.trim().toLowerCase() : '';

    if (!(file instanceof File) || !cardId) {
      return NextResponse.json({ error: 'Missing file or cardId' }, { status: 400 });
    }
    if (!CARD_ID_RE.test(cardId)) {
      return NextResponse.json({ error: 'Invalid cardId' }, { status: 400 });
    }
    if (file.size <= 0 || file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large or empty (max 12MB)' }, { status: 400 });
    }

    const type = (file.type || '').toLowerCase();
    const name = file.name.toLowerCase();
    const okType =
      type === 'image/webp' ||
      type === 'image/png' ||
      type === 'image/jpeg' ||
      type === 'image/jpg' ||
      type === 'image/gif' ||
      /\.(webp|png|jpe?g|gif)$/i.test(name);
    if (!okType) {
      return NextResponse.json({ error: 'Accept webp, png, or jpg only' }, { status: 400 });
    }

    const input = Buffer.from(await file.arrayBuffer());
    const webp = await sharp(input).rotate().webp({ quality: 86 }).toBuffer();

    const dir = path.join(process.cwd(), 'public', 'images', 'snkr-buyback');
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, `${cardId}.webp`), webp);

    for (const ext of ['jpg', 'jpeg', 'png', 'gif'] as const) {
      try {
        await fs.unlink(path.join(dir, `${cardId}.${ext}`));
      } catch {
        /* ignore */
      }
    }

    writeSnkrImageManifest();

    return NextResponse.json({
      ok: true,
      cardId,
      path: `public/images/snkr-buyback/${cardId}.webp`,
      url: `/images/snkr-buyback/${cardId}.webp`,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
