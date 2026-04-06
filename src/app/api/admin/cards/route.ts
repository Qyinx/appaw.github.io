import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'public', 'data', 'trade-card.json');

export async function POST(req: NextRequest) {
  try {
    const { cards } = await req.json();
    await fs.writeFile(DATA_PATH, JSON.stringify(cards, null, 2));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
