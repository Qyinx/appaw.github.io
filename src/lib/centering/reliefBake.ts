import { RELIEF_BAKE_MAX_EDGE, RELIEF_FILTER_ID } from './imageFilters';

/**
 * Emboss kernel matching the SVG feConvolveMatrix (bias 0.5 → +128).
 * Never call from RAF / pointermove — one-shot bake only.
 */
const EMBOSS_KERNEL = [-2, -1, 0, -1, 1, 1, 0, 1, 2] as const;
const CONTRAST_SLOPE = 1.35;
const CONTRAST_INTERCEPT = -0.1 * 255;

function clampByte(n: number): number {
  return n < 0 ? 0 : n > 255 ? 255 : n | 0;
}

function luma(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/** CPU emboss — grayscale → 3×3 convolve → light contrast (matches SVG filter). */
export function embossImageData(src: ImageData): ImageData {
  const { width: w, height: h, data } = src;
  const out = new ImageData(w, h);
  const dst = out.data;
  const gray = new Float32Array(w * h);

  for (let i = 0, p = 0; i < gray.length; i++, p += 4) {
    gray[i] = luma(data[p], data[p + 1], data[p + 2]);
  }

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0;
      let ki = 0;
      for (let ky = -1; ky <= 1; ky++) {
        const yy = y + ky;
        const row = yy < 0 ? 0 : yy >= h ? h - 1 : yy;
        for (let kx = -1; kx <= 1; kx++) {
          const xx = x + kx;
          const col = xx < 0 ? 0 : xx >= w ? w - 1 : xx;
          sum += gray[row * w + col] * EMBOSS_KERNEL[ki++];
        }
      }
      let v = sum + 128;
      v = v * CONTRAST_SLOPE + CONTRAST_INTERCEPT;
      const c = clampByte(v);
      const o = (y * w + x) * 4;
      dst[o] = c;
      dst[o + 1] = c;
      dst[o + 2] = c;
      dst[o + 3] = data[o + 3];
    }
  }

  return out;
}

function probeCanvasSvgFilter(): boolean {
  if (typeof document === 'undefined') return false;
  if (!document.getElementById(RELIEF_FILTER_ID)) return false;
  try {
    const probe = document.createElement('canvas');
    probe.width = 4;
    probe.height = 4;
    const ctx = probe.getContext('2d', { willReadFrequently: true });
    if (!ctx || typeof ctx.filter === 'undefined') {
      return false;
    }
    // Draw a horizontal ramp so emboss must change center pixels if applied.
    const g = ctx.createLinearGradient(0, 0, 4, 0);
    g.addColorStop(0, '#000');
    g.addColorStop(1, '#fff');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 4, 4);
    const before = ctx.getImageData(0, 0, 4, 4).data;

    const src = document.createElement('canvas');
    src.width = 4;
    src.height = 4;
    const sctx = src.getContext('2d')!;
    sctx.fillStyle = g;
    sctx.fillRect(0, 0, 4, 4);

    ctx.clearRect(0, 0, 4, 4);
    ctx.filter = `url(#${RELIEF_FILTER_ID})`;
    ctx.drawImage(src, 0, 0);
    ctx.filter = 'none';
    const after = ctx.getImageData(0, 0, 4, 4).data;

    for (let i = 0; i < before.length; i++) {
      if (before[i] !== after[i]) return true;
    }
    return false;
  } catch {
    return false;
  }
}

let canvasSvgFilterOk: boolean | null = null;

function canvasSupportsSvgFilter(): boolean {
  if (canvasSvgFilterOk === null) canvasSvgFilterOk = probeCanvasSvgFilter();
  return canvasSvgFilterOk;
}

export type ReliefBakeSource = HTMLImageElement | ImageBitmap | HTMLCanvasElement;

/**
 * One-shot relief bitmap for loupes. Cap edge at RELIEF_BAKE_MAX_EDGE.
 * Prefer canvas SVG filter when the browser actually applies it; else CPU emboss.
 */
export async function bakeReliefImageBitmap(source: ReliefBakeSource): Promise<ImageBitmap> {
  const sw =
    'naturalWidth' in source && source.naturalWidth
      ? source.naturalWidth
      : source.width;
  const sh =
    'naturalHeight' in source && source.naturalHeight
      ? source.naturalHeight
      : source.height;
  const scale = Math.min(1, RELIEF_BAKE_MAX_EDGE / Math.max(sw, sh, 1));
  const w = Math.max(1, Math.round(sw * scale));
  const h = Math.max(1, Math.round(sh * scale));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('relief bake: 2d context unavailable');

  if (canvasSupportsSvgFilter()) {
    ctx.filter = `url(#${RELIEF_FILTER_ID})`;
    ctx.drawImage(source, 0, 0, w, h);
    ctx.filter = 'none';
  } else {
    ctx.drawImage(source, 0, 0, w, h);
    const raw = ctx.getImageData(0, 0, w, h);
    ctx.putImageData(embossImageData(raw), 0, 0);
  }

  return createImageBitmap(canvas);
}

export function releaseReliefBitmap(bitmap: ImageBitmap | null | undefined): void {
  if (bitmap && typeof bitmap.close === 'function') {
    try {
      bitmap.close();
    } catch {
      /* already closed */
    }
  }
}

/** Schedule bake off the critical path (idle when available). */
export function scheduleReliefBake(run: () => void): () => void {
  let cancelled = false;
  const wrap = () => {
    if (!cancelled) run();
  };

  if (typeof requestIdleCallback === 'function') {
    const id = requestIdleCallback(wrap, { timeout: 400 });
    return () => {
      cancelled = true;
      cancelIdleCallback(id);
    };
  }

  const t = window.setTimeout(wrap, 0);
  return () => {
    cancelled = true;
    window.clearTimeout(t);
  };
}
