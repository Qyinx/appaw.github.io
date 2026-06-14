import type { CardFace, CenteringTier, GradingCompany } from './types';

/** Published centering tolerances — larger-side % band per axis (e.g. 55/45 → min 45, max 55). */
const THRESHOLDS: Record<GradingCompany, Record<CardFace, CenteringTier[]>> = {
  PSA: {
    front: [
      { id: 'PSA10', min: 45, max: 55, quality: 'excellent' },
      { id: 'PSA9', min: 40, max: 60, quality: 'good' },
      { id: 'PSA8', min: 35, max: 65, quality: 'fair' },
    ],
    back: [
      { id: 'PSA10', min: 25, max: 75, quality: 'excellent' },
      { id: 'PSA9', min: 10, max: 90, quality: 'good' },
      { id: 'PSA8', min: 10, max: 90, quality: 'fair' },
    ],
  },
  BGS: {
    front: [
      { id: 'BGS10Black', min: 49, max: 51, quality: 'excellent' },
      { id: 'BGS10Gold', min: 45, max: 55, quality: 'excellent' },
      { id: 'BGS95', min: 40, max: 60, quality: 'good' },
      { id: 'BGS9', min: 35, max: 65, quality: 'fair' },
      { id: 'BGS85', min: 30, max: 70, quality: 'fair' },
    ],
    back: [
      { id: 'BGS10Black', min: 49, max: 51, quality: 'excellent' },
      { id: 'BGS10Gold', min: 45, max: 55, quality: 'excellent' },
      { id: 'BGS95', min: 40, max: 60, quality: 'good' },
      { id: 'BGS9', min: 35, max: 65, quality: 'fair' },
      { id: 'BGS85', min: 30, max: 70, quality: 'fair' },
    ],
  },
  SGC: {
    front: [
      { id: 'SGC10', min: 45, max: 55, quality: 'excellent' },
      { id: 'SGC95', min: 40, max: 60, quality: 'good' },
      { id: 'SGC9', min: 35, max: 65, quality: 'fair' },
    ],
    back: [
      { id: 'SGC10', min: 30, max: 70, quality: 'excellent' },
      { id: 'SGC95', min: 25, max: 75, quality: 'good' },
      { id: 'SGC9', min: 20, max: 80, quality: 'fair' },
    ],
  },
  CGC: {
    front: [
      { id: 'CGC10', min: 45, max: 55, quality: 'excellent' },
      { id: 'CGC95', min: 40, max: 60, quality: 'good' },
      { id: 'CGC9', min: 35, max: 65, quality: 'fair' },
    ],
    back: [
      { id: 'CGC10', min: 25, max: 75, quality: 'excellent' },
      { id: 'CGC95', min: 15, max: 85, quality: 'good' },
      { id: 'CGC9', min: 10, max: 90, quality: 'fair' },
    ],
  },
};

export function getTiers(company: GradingCompany, face: CardFace): CenteringTier[] {
  return THRESHOLDS[company][face];
}
