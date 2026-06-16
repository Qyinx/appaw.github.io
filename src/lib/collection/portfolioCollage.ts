import type { CollageExport } from '@/lib/collection/membership';
import type { CollectorCard } from '@/app/collection/types';
import type { PublicCard } from '@/lib/collection/publicPortfolio';

export interface CollageCard {
  name: string;
  company: string;
  grade: number;
  listPrice?: number;
  listCurrency?: string;
  certNumber?: string;
  sold: boolean;
  frontImage?: string;
}

export interface CollageOptions {
  portfolioName: string;
  ownerName?: string;
  portfolioUrl?: string;
  activeOnly?: boolean;
  watermark?: CollageExport;
}

const TILE_W = 320;
const TILE_H = 420;
const PAD = 24;
const HEADER_H = 72;
const FOOTER_H = 48;

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function colsForCount(n: number): number {
  if (n <= 2) return n;
  if (n <= 4) return 2;
  if (n <= 9) return 3;
  return 4;
}

function toCollageCard(card: CollectorCard | PublicCard): CollageCard {
  return {
    name: card.name,
    company: card.company,
    grade: card.grade,
    listPrice: card.listPrice,
    listCurrency: card.listCurrency,
    certNumber: card.certNumber,
    sold: card.sold,
    frontImage: card.frontImage,
  };
}

export function cardsToCollageInput(cards: (CollectorCard | PublicCard)[]): CollageCard[] {
  return cards.map(toCollageCard);
}

export async function generatePortfolioCollage(
  cards: CollageCard[],
  options: CollageOptions,
): Promise<Blob | null> {
  const filtered = options.activeOnly ? cards.filter(c => !c.sold) : cards;
  if (filtered.length === 0) return null;

  const cols = colsForCount(filtered.length);
  const rows = Math.ceil(filtered.length / cols);
  const width = PAD * 2 + cols * TILE_W + (cols - 1) * 12;
  const height = PAD * 2 + HEADER_H + rows * TILE_H + (rows - 1) * 12 + FOOTER_H;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#FAFAF8';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#0F1419';
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.fillText(options.portfolioName, PAD, PAD + 28);

  ctx.fillStyle = '#64748b';
  ctx.font = '14px ui-monospace, monospace';
  const sub = [options.ownerName, options.portfolioUrl].filter(Boolean).join(' · ');
  if (sub) ctx.fillText(sub.slice(0, 80), PAD, PAD + 52);

  const images = await Promise.all(
    filtered.map(c => (c.frontImage ? loadImage(c.frontImage) : Promise.resolve(null))),
  );

  filtered.forEach((card, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = PAD + col * (TILE_W + 12);
    const y = PAD + HEADER_H + row * (TILE_H + 12);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, TILE_W, TILE_H);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, TILE_W - 1, TILE_H - 1);

    const img = images[i];
    const imgH = 220;
    if (img) {
      ctx.drawImage(img, x + 12, y + 12, TILE_W - 24, imgH);
    } else {
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(x + 12, y + 12, TILE_W - 24, imgH);
    }

    ctx.fillStyle = card.sold ? '#94a3b8' : '#0F1419';
    ctx.font = '600 13px system-ui, sans-serif';
    const name = card.name.length > 28 ? `${card.name.slice(0, 26)}…` : card.name;
    ctx.fillText(name, x + 12, y + imgH + 32);

    ctx.fillStyle = '#5B6FD6';
    ctx.font = 'bold 12px ui-monospace, monospace';
    ctx.fillText(`${card.company} ${card.grade}`, x + 12, y + imgH + 52);

    if (card.certNumber) {
      ctx.fillStyle = '#64748b';
      ctx.font = '11px ui-monospace, monospace';
      ctx.fillText(`#${card.certNumber}`, x + 12, y + imgH + 70);
    }

    if (card.listPrice != null) {
      ctx.fillStyle = card.sold ? '#94a3b8' : '#E85D6F';
      ctx.font = 'bold 14px ui-monospace, monospace';
      const price = `${card.listCurrency ?? 'HKD'} ${card.listPrice.toLocaleString()}`;
      ctx.fillText(card.sold ? `SOLD · ${price}` : price, x + 12, y + TILE_H - 16);
    }
  });

  if (options.watermark === 'watermarked') {
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = '#0F1419';
    ctx.font = 'bold 48px system-ui, sans-serif';
    ctx.translate(width / 2, height / 2);
    ctx.rotate(-Math.PI / 6);
    ctx.textAlign = 'center';
    ctx.fillText('Appaw Store', 0, 0);
    ctx.restore();
  }

  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px ui-monospace, monospace';
  ctx.fillText('appaw.store/collection', PAD, height - PAD);

  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(blob), 'image/png');
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
