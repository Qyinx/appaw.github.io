export type GradingCompany = 'PSA' | 'BGS' | 'SGC' | 'CGC';

export type CardFace = 'front' | 'back';

export type QualityTier = 'excellent' | 'good' | 'fair' | 'poor';

export interface CenteringTier {
  id: string;
  min: number;
  max: number;
  quality: QualityTier;
}

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
