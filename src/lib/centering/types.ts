export type GradingCompany = 'PSA' | 'BGS' | 'SGC' | 'CGC';

export type CardFace = 'front' | 'back';

export type QualityTier = 'excellent' | 'good' | 'fair' | 'poor';

/** Standard L/R + T/B, or e-Series T/R + B/L (dot-code strip). */
export type CenteringMeasureMode = 'standard' | 'eseries';

export interface CenteringTier {
  id: string;
  min: number;
  max: number;
  quality: QualityTier;
}

/**
 * Axis slots for scoring/plot.
 * - standard: `lr` = left/(left+right), `tb` = top/(top+bottom)
 * - eseries: `lr` = top/(top+right), `tb` = bottom/(bottom+left)
 */
export interface CenteringMeasurement {
  lr: number;
  tb: number;
}

export interface CenteringScore {
  company: GradingCompany;
  face: CardFace;
  overall: string;
  quality: QualityTier;
  lr: number;
  tb: number;
  lrZone: string;
  tbZone: string;
}

export const GRADING_COMPANIES: GradingCompany[] = ['PSA', 'BGS', 'SGC', 'CGC'];

export const CARD_FACES: CardFace[] = ['front', 'back'];

export const CENTERING_MEASURE_MODES: CenteringMeasureMode[] = ['standard', 'eseries'];
