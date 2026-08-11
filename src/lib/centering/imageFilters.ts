export type ImageFilterMode = 'off' | 'contrast' | 'invert' | 'relief';

export const IMAGE_FILTER_MODES: ImageFilterMode[] = [
  'off',
  'contrast',
  'invert',
  'relief',
];

/** Document SVG filter id — must match the hidden <filter> in the centering tool. */
export const RELIEF_FILTER_ID = 'centering-relief-filter';

/** Max edge length for one-shot loupe emboss bake (mobile memory / CPU). */
export const RELIEF_BAKE_MAX_EDGE = 1536;

/** Temporary loupe look while emboss bitmap is baking. */
export const RELIEF_LOUPE_PENDING_FILTER = 'grayscale(1) contrast(2.2)';

/** CSS filter chain (no drop-shadow) for canvas loupe draws. */
export function cssImageFilter(mode: ImageFilterMode): string {
  switch (mode) {
    case 'contrast':
      return 'grayscale(1) contrast(2.35) brightness(0.9)';
    case 'invert':
      return 'invert(1) contrast(1.12)';
    case 'relief':
      // Prefer baked ImageBitmap in loupes; url() is fallback when bake pending unsupported.
      return `url(#${RELIEF_FILTER_ID})`;
    default:
      return 'none';
  }
}

export function nextImageFilterMode(mode: ImageFilterMode): ImageFilterMode {
  const i = IMAGE_FILTER_MODES.indexOf(mode);
  return IMAGE_FILTER_MODES[(i + 1) % IMAGE_FILTER_MODES.length];
}
