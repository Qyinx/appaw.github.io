/**
 * Browser-side PSA ZIP → WebP / base64 pipeline (keeps Worker CPU light).
 */
import { unzipSync } from 'fflate';

export const GRADING_IMAGE_MAX_EDGE = 1200;
export const GRADING_IMAGE_WEBP_QUALITY = 0.75;
export const GRADING_IMAGE_MAX_PER_ITEM = 2;

const IMAGE_EXT_RE = /\.(jpe?g|png|webp|gif)$/i;

/** Session flag: after first CORS/network fail, skip doomed direct fetches. */
let directZipBlocked = false;

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

export function isDirectZipBlocked(): boolean {
  return directZipBlocked;
}

/** @internal test helper */
export function resetDirectZipBlockedForTests(): void {
  directZipBlocked = false;
}

/**
 * Try browser-direct ZIP fetch; on CORS/network fail mark session blocked and use proxy.
 * Later calls skip direct when flag set.
 */
export async function fetchZipBytesWithFallback(
  zipUrl: string,
  proxy: (url: string) => Promise<Uint8Array>,
): Promise<Uint8Array> {
  if (!directZipBlocked) {
    try {
      return await fetchZipBytesDirect(zipUrl);
    } catch (directErr) {
      directZipBlocked = true;
      console.warn('Direct ZIP fetch failed; using Worker proxy for rest of session', directErr);
    }
  }
  return proxy(zipUrl);
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
 * Decode with optional createImageBitmap resize when longest edge exceeds max.
 */
async function decodeBitmapForMaxEdge(sourceBlob: Blob, maxEdge: number): Promise<ImageBitmap> {
  const probe = await createImageBitmap(sourceBlob);
  const longest = Math.max(probe.width, probe.height);
  if (longest <= maxEdge) return probe;

  const scale = maxEdge / longest;
  const w = Math.max(1, Math.round(probe.width * scale));
  const h = Math.max(1, Math.round(probe.height * scale));
  probe.close();

  try {
    return await createImageBitmap(sourceBlob, {
      resizeWidth: w,
      resizeHeight: h,
      resizeQuality: 'high',
    });
  } catch {
    // Fallback: full decode; caller draws scaled via canvas size mismatch — use full + scale draw
    const full = await createImageBitmap(sourceBlob);
    return full;
  }
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
  const bitmap = await decodeBitmapForMaxEdge(sourceBlob, maxEdge);
  try {
    const longest = Math.max(bitmap.width, bitmap.height);
    let w = bitmap.width;
    let h = bitmap.height;
    if (longest > maxEdge) {
      const scale = maxEdge / longest;
      w = Math.max(1, Math.round(bitmap.width * scale));
      h = Math.max(1, Math.round(bitmap.height * scale));
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
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error ?? new Error('FileReader failed'));
    reader.readAsDataURL(blob);
  });
  const comma = dataUrl.indexOf(',');
  if (comma < 0) throw new Error('Invalid data URL');
  return dataUrl.slice(comma + 1);
}

function mimeFromZipName(name: string): string {
  const lower = name.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.gif')) return 'image/gif';
  return 'image/jpeg';
}

async function fileToBase64Payload(file: ExtractedZipImage, seq: number): Promise<Base64ImagePayload> {
  let blob: Blob;
  try {
    blob = await compressImageToWebpBlob(file.bytes);
  } catch {
    const copy = new Uint8Array(file.bytes);
    blob = new Blob([copy], { type: mimeFromZipName(file.name) });
  }
  return {
    seq,
    contentType: blob.type || 'image/webp',
    data: await blobToBase64(blob),
  };
}

/** Unzip PSA ZIP bytes → base64 image payloads ready for JSON upload. */
export async function zipBytesToBase64Images(zipBytes: Uint8Array): Promise<Base64ImagePayload[]> {
  const extracted = extractImageBuffersFromZip(zipBytes);
  if (!extracted.length) throw new Error('No images found in ZIP');

  return Promise.all(extracted.map((file, seq) => fileToBase64Payload(file, seq)));
}
