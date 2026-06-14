import { getTiers } from './thresholds';
import type {
  CardFace,
  CenteringMeasurement,
  CenteringScore,
  CenteringTier,
  GradingCompany,
  QualityTier,
} from './types';

export const BELOW_TIER_ID = 'Below';

export function measureFromGuides(
  outer: { top: number; bottom: number; left: number; right: number },
  inner: { top: number; bottom: number; left: number; right: number },
): CenteringMeasurement {
  const distLeft = inner.left - outer.left;
  const distRight = outer.right - inner.right;
  const distTop = inner.top - outer.top;
  const distBottom = outer.bottom - inner.bottom;

  const totalLR = distLeft + distRight;
  const totalTB = distTop + distBottom;

  let lr = 50;
  let tb = 50;

  if (totalLR > 0) lr = (distLeft / totalLR) * 100;
  if (totalTB > 0) tb = (distTop / totalTB) * 100;

  return { lr, tb };
}

function axisMeetsTier(percent: number, tier: CenteringTier): boolean {
  return percent >= tier.min && percent <= tier.max;
}

function axisZone(percent: number, tiers: CenteringTier[]): string {
  for (const tier of tiers) {
    if (axisMeetsTier(percent, tier)) return tier.id;
  }
  return BELOW_TIER_ID;
}

function overallZone(lr: number, tb: number, tiers: CenteringTier[]): string {
  for (const tier of tiers) {
    if (axisMeetsTier(lr, tier) && axisMeetsTier(tb, tier)) return tier.id;
  }
  return BELOW_TIER_ID;
}

function qualityForTier(tierId: string, tiers: CenteringTier[]): QualityTier {
  if (tierId === BELOW_TIER_ID) return 'poor';
  return tiers.find((t) => t.id === tierId)?.quality ?? 'poor';
}

export function scoreCentering(
  measurement: CenteringMeasurement,
  company: GradingCompany,
  face: CardFace,
): CenteringScore {
  const tiers = getTiers(company, face);
  const { lr, tb } = measurement;
  const lrZone = axisZone(lr, tiers);
  const tbZone = axisZone(tb, tiers);
  const overall = overallZone(lr, tb, tiers);

  return {
    company,
    face,
    overall,
    quality: qualityForTier(overall, tiers),
    lr,
    tb,
    lrZone,
    tbZone,
  };
}

export function getPlotZoneRects(company: GradingCompany, face: CardFace) {
  const tiers = getTiers(company, face);
  const colors: Record<QualityTier, string> = {
    excellent: 'rgba(240,122,134,0.9)',
    good: 'rgba(255,154,166,0.6)',
    fair: 'rgba(255,194,204,0.45)',
    poor: 'rgba(255,255,255,0.08)',
  };
  const tierColors: Record<string, string> = {
    BGS10Black: 'rgba(28,28,32,0.92)',
    BGS10Gold: 'rgba(201,162,39,0.72)',
  };

  return [...tiers].reverse().map((tier) => ({
    name: tier.id,
    min: tier.min,
    max: tier.max,
    color: tierColors[tier.id] ?? colors[tier.quality],
  }));
}
