import type { GradingCompany } from '@/types/trading-card';

/* ──────────────────────────────────────────
   Shared Card Helpers
   Used by the marketplace grid page and
   individual card detail pages.
   ────────────────────────────────────────── */

export function getGradeColor(grade: number, isBlackLabel?: boolean) {
  if (isBlackLabel) return { bg: 'bg-gradient-to-r from-[#1a1a2e] to-[#16213e]', text: 'text-white', border: 'border-[#D4899A]', glow: 'shadow-[0_0_12px_rgba(212,137,154,0.4)]' };
  if (grade >= 10)  return { bg: 'bg-gradient-to-r from-[#D4899A] to-[#E8A3B2]', text: 'text-[#1e1e2e]', border: 'border-[#D4899A]', glow: 'shadow-[0_0_12px_rgba(212,137,154,0.3)]' };
  if (grade >= 9)   return { bg: 'bg-gradient-to-r from-emerald-500 to-green-400', text: 'text-white', border: 'border-emerald-400', glow: '' };
  if (grade >= 8)   return { bg: 'bg-gradient-to-r from-blue-500 to-cyan-400', text: 'text-white', border: 'border-blue-400', glow: '' };
  if (grade >= 5)   return { bg: 'bg-gradient-to-r from-slate-400 to-slate-300', text: 'text-slate-800', border: 'border-slate-300', glow: '' };
  return { bg: 'bg-slate-200', text: 'text-slate-600', border: 'border-slate-200', glow: '' };
}

export function getCompanyStyle(company: GradingCompany) {
  switch (company) {
    case 'PSA': return { background: 'rgb(238, 4, 3)', color: '#ffffff', shadow: '0 2px 8px rgba(238,4,3,0.3)' };
    case 'BGS': return { background: 'linear-gradient(180deg, #ccb080, #caaf72 41.15%, #e2c489 77.6%, #ccb080)', color: '#1a1a1a', shadow: '0 2px 8px rgba(204,176,128,0.3)' };
    case 'CGC': return { background: 'rgb(201, 0, 0)', color: '#ffffff', shadow: '0 2px 8px rgba(201,0,0,0.3)' };
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
