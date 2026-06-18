export type ImageFilterMode = 'off' | 'grayscale' | 'contrast' | 'invert';

export const IMAGE_FILTER_MODES: ImageFilterMode[] = ['off', 'grayscale', 'contrast', 'invert'];

/** CSS filter chain (no drop-shadow) for canvas loupe draws. */
export function cssImageFilter(mode: ImageFilterMode): string {
  switch (mode) {
    case 'grayscale':
      return 'grayscale(1) contrast(1.35) brightness(1.04)';
    case 'contrast':
      return 'grayscale(1) contrast(2.35) brightness(0.9)';
    case 'invert':
      return 'invert(1) contrast(1.12)';
    default:
      return 'none';
  }
}

export function nextImageFilterMode(mode: ImageFilterMode): ImageFilterMode {
  const i = IMAGE_FILTER_MODES.indexOf(mode);
  return IMAGE_FILTER_MODES[(i + 1) % IMAGE_FILTER_MODES.length];
}
