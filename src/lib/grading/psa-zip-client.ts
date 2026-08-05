/**
 * Browser-side PSA ZIP → WebP / base64 pipeline (keeps Worker CPU light).
 */
import { unzipSync } from 'fflate';

export const GRADING_IMAGE_MAX_EDGE = 1200;
export const GRADING_IMAGE_WEBP_QUALITY = 0.75;
export const GRADING_IMAGE_MAX_PER_ITEM = 2;

const IMAGE_EXT_RE = /\.(jpe?g|png|webp|gif)$/i;

export type ExtractedZipImage = {
  name: string;
  bytes: Uint8Array;
};

export type Base64ImagePayload = {
  seq: number;
  contentType: string;
  data: string;
};

/** Direct browser fetch of PSA ZIP URL. Throws on CORS / network / non-OK. */
export async function fetchZipBytesDirect(zipUrl: string): Promise<Uint8Array> {
  const res = await fetch(zipUrl);
  if (!res.ok) throw new Error(`ZIP fetch failed (${res.status})`);
  const buf = new Uint8Array(await res.arrayBuffer());
  if (!buf.byteLength) throw new Error('Empty ZIP');
  return buf;
}

/** List image entries from a ZIP buffer; sorted by path; capped. */
export function extractImageBuffersFromZip(
  zipBytes: Uint8Array,
  maxImages = GRADING_IMAGE_MAX_PER_ITEM,
): ExtractedZipImage[] {
  const entries = unzipSync(zipBytes);
  const names = Object.keys(entries)
    .filter((name) => !name.endsWith('/') && IMAGE_EXT_RE.test(name) && !name.includes('__MACOSX'))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

  return names.slice(0, maxImages).map((name) => ({
    name,
    bytes: entries[name],
  }));
}

/**
 * Resize longest edge + encode WebP via canvas (JPEG fallback).
 */
export async function compressImageToWebpBlob(
  inputBytes: Uint8Array,
  opts?: { maxEdge?: number; quality?: number },
): Promise<Blob> {
  const maxEdge = opts?.maxEdge ?? GRADING_IMAGE_MAX_EDGE;
  const quality = opts?.quality ?? GRADING_IMAGE_WEBP_QUALITY;
  const copy = new Uint8Array(inputBytes);
  const sourceBlob = new Blob([copy]);
  const bitmap = await createImageBitmap(sourceBlob);
  try {
    const longest = Math.max(bitmap.width, bitmap.height);
    let w = bitmap.width;
    let h = bitmap.height;
    if (longest > maxEdge) {
      const scale = maxEdge / longest;
      w = Math.max(1, Math.round(w * scale));
      h = Math.max(1, Math.round(h * scale));
    }
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D unavailable');
    ctx.drawImage(bitmap, 0, 0, w, h);

    const webp = await canvasToBlob(canvas, 'image/webp', quality);
    if (webp && webp.size > 0) return webp;

    const jpeg = await canvasToBlob(canvas, 'image/jpeg', quality);
    if (!jpeg || !jpeg.size) throw new Error('Image encode failed');
    return jpeg;
  } finally {
    bitmap.close();
  }
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

export async function blobToBase64(blob: Blob): Promise<string> {
  const buf = new Uint8Array(await blob.arrayBuffer());
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < buf.length; i += chunk) {
    binary += String.fromCharCode(...buf.subarray(i, i + chunk));
  }
  return btoa(binary);
}

/** Unzip PSA ZIP bytes → base64 image payloads ready for JSON upload. */
export async function zipBytesToBase64Images(zipBytes: Uint8Array): Promise<Base64ImagePayload[]> {
  const extracted = extractImageBuffersFromZip(zipBytes);
  if (!extracted.length) throw new Error('No images found in ZIP');

  const out: Base64ImagePayload[] = [];
  for (let seq = 0; seq < extracted.length; seq++) {
    const file = extracted[seq];
    let blob: Blob;
    try {
      blob = await compressImageToWebpBlob(file.bytes);
    } catch {
      const lower = file.name.toLowerCase();
      const type = lower.endsWith('.png')
        ? 'image/png'
        : lower.endsWith('.webp')
          ? 'image/webp'
          : lower.endsWith('.gif')
            ? 'image/gif'
            : 'image/jpeg';
      const copy = new Uint8Array(file.bytes);
      blob = new Blob([copy], { type });
    }
    out.push({
      seq,
      contentType: blob.type || 'image/webp',
      data: await blobToBase64(blob),
    });
  }
  return out;
}
