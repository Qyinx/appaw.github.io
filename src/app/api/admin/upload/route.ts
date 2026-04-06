import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const cardId = formData.get('cardId') as string;
    const side = formData.get('side') as string;

    if (!file || !cardId) {
      return NextResponse.json({ error: 'Missing file or cardId' }, { status: 400 });
    }

    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const filename = `${side}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    // Save to both /images/trade/ and /images-optimized/trade/ so getImagePath() works
    const dirs = [
      path.join(process.cwd(), 'public', 'images', 'trade', cardId),
      path.join(process.cwd(), 'public', 'images-optimized', 'trade', cardId),
    ];

    for (const dir of dirs) {
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(path.join(dir, filename), buffer);
    }

    return NextResponse.json({ path: `/images/trade/${cardId}/${filename}` });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
