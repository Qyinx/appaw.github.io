import type { GradingCompany } from '@/types/trading-card';

/* ──────────────────────────────────────────
   Shared Card Helpers
   Used by the marketplace grid page and
   individual card detail pages.
   ────────────────────────────────────────── */

export function getGradeColor(grade: number, isBlackLabel?: boolean) {
  if (isBlackLabel) {
    return {
      bg: 'bg-surface-raised',
      text: 'text-text-primary',
      border: 'border-accent-brand',
      glow: 'shadow-[inset_0_0_0_1px_var(--accent-primary)]',
    };
  }
  if (grade >= 10) {
    return {
      bg: 'bg-accent-brand/20',
      text: 'text-accent-brand',
      border: 'border-accent-brand',
      glow: '',
    };
  }
  if (grade >= 9) {
    return {
      bg: 'bg-accent-success/15',
      text: 'text-accent-success',
      border: 'border-accent-success/40',
      glow: '',
    };
  }
  if (grade >= 8) {
    return {
      bg: 'bg-accent-link/15',
      text: 'text-accent-link',
      border: 'border-accent-link/40',
      glow: '',
    };
  }
  if (grade >= 5) {
    return {
      bg: 'bg-surface-raised',
      text: 'text-text-secondary',
      border: 'border-border-strong',
      glow: '',
    };
  }
  return {
    bg: 'bg-surface-raised',
    text: 'text-text-muted',
    border: 'border-border-default',
    glow: '',
  };
}

export function getCompanyStyle(company: GradingCompany) {
  switch (company) {
    case 'PSA':
      return { background: 'rgb(238, 4, 3)', color: '#ffffff', shadow: '0 2px 8px rgba(238,4,3,0.3)' };
    case 'BGS':
      return { background: 'linear-gradient(180deg, #ccb080, #caaf72 41.15%, #e2c489 77.6%, #ccb080)', color: '#1a1a1a', shadow: '0 2px 8px rgba(204,176,128,0.3)' };
    case 'CGC':
      return { background: 'rgb(201, 0, 0)', color: '#ffffff', shadow: '0 2px 8px rgba(201,0,0,0.3)' };
    case 'TAG':
      return { background: '#111111', color: '#f5f5f5', shadow: '0 2px 8px rgba(0,0,0,0.35)' };
    default: {
      const _never: never = company;
      return _never;
    }
  }
}

export function formatPrice(price: number, currency: string) {
  const symbol = currency === 'HKD' ? 'HK$' : currency === 'USD' ? 'US$' : '$';
  return `${symbol} ${price.toLocaleString()}`;
}

export function formatGrade(grade: number, isBlackLabel?: boolean) {
  const g = Number.isInteger(grade) ? String(grade) : grade.toFixed(1);
  return isBlackLabel ? `${g} BL` : g;
}
