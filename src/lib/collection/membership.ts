import type { MemberLevel } from '@/app/collection/components/shared';

export type CollageExport = 'none' | 'watermarked' | 'clean';

export interface MembershipLimits {
  cards: number;
  portfolios: number;
  publicPortfolios: number;
  scansPerMonth: number | null;
}

export interface MembershipFeatures {
  wtsMode: boolean;
  collageExport: CollageExport;
  contactOnPublic: boolean;
  shareButtons: boolean;
  richOg: boolean;
  removeBranding: boolean;
}

export function getMembershipLimits(level?: MemberLevel): MembershipLimits {
  if (level === 'Foil') return { cards: 200, portfolios: 5, publicPortfolios: 3, scansPerMonth: null };
  if (level === 'Prism') return { cards: 1000, portfolios: 20, publicPortfolios: 10, scansPerMonth: null };
  if (level === 'Aurora') return { cards: 5000, portfolios: 100, publicPortfolios: 999, scansPerMonth: null };
  return { cards: 50, portfolios: 2, publicPortfolios: 1, scansPerMonth: 3 };
}

export function getMembershipFeatures(level?: MemberLevel): MembershipFeatures {
  if (level === 'Aurora') {
    return {
      wtsMode: true,
      collageExport: 'clean',
      contactOnPublic: true,
      shareButtons: true,
      richOg: true,
      removeBranding: true,
    };
  }
  if (level === 'Prism') {
    return {
      wtsMode: true,
      collageExport: 'clean',
      contactOnPublic: true,
      shareButtons: true,
      richOg: true,
      removeBranding: false,
    };
  }
  if (level === 'Foil') {
    return {
      wtsMode: true,
      collageExport: 'clean',
      contactOnPublic: false,
      shareButtons: true,
      richOg: false,
      removeBranding: false,
    };
  }
  return {
    wtsMode: false,
    collageExport: 'watermarked',
    contactOnPublic: false,
    shareButtons: false,
    richOg: false,
    removeBranding: false,
  };
}
