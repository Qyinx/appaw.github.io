import type { GradeTier, GradingCompany } from '@/types/trading-card';

export type MarketplaceSortKey =
  | 'newest'
  | 'gradeHigh'
  | 'gradeLow'
  | 'priceHigh'
  | 'priceLow'
  | 'nameAZ';

export const MARKETPLACE_PAGE_SIZE = 24;

export const MARKETPLACE_LANGUAGES = ['Japanese', 'English', 'Chinese', 'Korean'] as const;

export interface MarketplaceQuery {
  q: string;
  companies: GradingCompany[];
  grade: GradeTier | null;
  sort: MarketplaceSortKey;
  page: number;
  minPrice: number | null;
  maxPrice: number | null;
  minYear: number | null;
  maxYear: number | null;
  languages: string[];
  includeSold: boolean;
  blackLabel: boolean;
  limit: number;
}

export function emptyMarketplaceQuery(): MarketplaceQuery {
  return {
    q: '',
    companies: [],
    grade: null,
    sort: 'newest',
    page: 1,
    minPrice: null,
    maxPrice: null,
    minYear: null,
    maxYear: null,
    languages: [],
    includeSold: false,
    blackLabel: false,
    limit: MARKETPLACE_PAGE_SIZE,
  };
}

export function gradeTierToMinMax(tier: GradeTier | null): { minGrade?: number; maxGrade?: number } {
  switch (tier) {
    case 'gem':
      return { minGrade: 10, maxGrade: 10 };
    case 'high':
      return { minGrade: 8, maxGrade: 9.5 };
    case 'mid':
      return { minGrade: 5, maxGrade: 7.5 };
    case 'low':
      return { maxGrade: 4.5 };
    case null:
      return {};
    default: {
      const _never: never = tier;
      return _never;
    }
  }
}

export function sortToApi(sort: MarketplaceSortKey): { sort: string; order: 'asc' | 'desc' } {
  switch (sort) {
    case 'newest':
      return { sort: 'created', order: 'desc' };
    case 'gradeHigh':
      return { sort: 'grade', order: 'desc' };
    case 'gradeLow':
      return { sort: 'grade', order: 'asc' };
    case 'priceHigh':
      return { sort: 'price', order: 'desc' };
    case 'priceLow':
      return { sort: 'price', order: 'asc' };
    case 'nameAZ':
      return { sort: 'name', order: 'asc' };
    default: {
      const _never: never = sort;
      return _never;
    }
  }
}

const GRADE_TIERS: GradeTier[] = ['gem', 'high', 'mid', 'low'];
const SORT_KEYS: MarketplaceSortKey[] = [
  'newest',
  'gradeHigh',
  'gradeLow',
  'priceHigh',
  'priceLow',
  'nameAZ',
];
const COMPANIES: GradingCompany[] = ['PSA', 'BGS', 'CGC', 'TAG'];

function parseGradeTier(raw: string | null): GradeTier | null {
  if (!raw) return null;
  return GRADE_TIERS.includes(raw as GradeTier) ? (raw as GradeTier) : null;
}

function parseSort(raw: string | null): MarketplaceSortKey {
  if (raw && SORT_KEYS.includes(raw as MarketplaceSortKey)) return raw as MarketplaceSortKey;
  return 'newest';
}

function parseOptionalNumber(raw: string | null): number | null {
  if (raw == null || raw === '') return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function parseCompanies(raw: string | null): GradingCompany[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((s) => s.trim().toUpperCase())
    .filter((s): s is GradingCompany => COMPANIES.includes(s as GradingCompany));
}

export function parseMarketplaceSearchParams(params: URLSearchParams): MarketplaceQuery {
  const page = Math.max(parseInt(params.get('page') ?? '1', 10) || 1, 1);
  return {
    q: (params.get('q') ?? '').trim(),
    companies: parseCompanies(params.get('company')),
    grade: parseGradeTier(params.get('grade')),
    sort: parseSort(params.get('sort')),
    page,
    minPrice: parseOptionalNumber(params.get('minPrice')),
    maxPrice: parseOptionalNumber(params.get('maxPrice')),
    minYear: parseOptionalNumber(params.get('minYear')),
    maxYear: parseOptionalNumber(params.get('maxYear')),
    languages: (params.get('language') ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    includeSold: params.get('sold') === 'true' || params.get('sold') === '1',
    blackLabel: params.get('blackLabel') === 'true' || params.get('blackLabel') === '1',
    limit: MARKETPLACE_PAGE_SIZE,
  };
}

export function marketplaceQueryToSearchParams(query: MarketplaceQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.q) params.set('q', query.q);
  if (query.companies.length) params.set('company', query.companies.join(','));
  if (query.grade) params.set('grade', query.grade);
  if (query.sort !== 'newest') params.set('sort', query.sort);
  if (query.page > 1) params.set('page', String(query.page));
  if (query.minPrice != null) params.set('minPrice', String(query.minPrice));
  if (query.maxPrice != null) params.set('maxPrice', String(query.maxPrice));
  if (query.minYear != null) params.set('minYear', String(query.minYear));
  if (query.maxYear != null) params.set('maxYear', String(query.maxYear));
  if (query.languages.length) params.set('language', query.languages.join(','));
  if (query.includeSold) params.set('sold', 'true');
  if (query.blackLabel) params.set('blackLabel', 'true');
  return params;
}

export function marketplaceQueryHasFilters(query: MarketplaceQuery): boolean {
  return (
    !!query.q ||
    query.companies.length > 0 ||
    query.grade != null ||
    query.minPrice != null ||
    query.maxPrice != null ||
    query.minYear != null ||
    query.maxYear != null ||
    query.languages.length > 0 ||
    query.includeSold ||
    query.blackLabel
  );
}

export function buildPublicCardsSearchParams(query: MarketplaceQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.q) params.set('q', query.q);
  if (query.companies.length) params.set('company', query.companies.join(','));
  const gradeRange = gradeTierToMinMax(query.grade);
  if (gradeRange.minGrade != null) params.set('minGrade', String(gradeRange.minGrade));
  if (gradeRange.maxGrade != null) params.set('maxGrade', String(gradeRange.maxGrade));
  const { sort, order } = sortToApi(query.sort);
  params.set('sort', sort);
  params.set('order', order);
  params.set('page', String(query.page));
  params.set('limit', String(query.limit));
  if (query.minPrice != null) params.set('minPrice', String(query.minPrice));
  if (query.maxPrice != null) params.set('maxPrice', String(query.maxPrice));
  if (query.minYear != null) params.set('minYear', String(query.minYear));
  if (query.maxYear != null) params.set('maxYear', String(query.maxYear));
  if (query.languages.length) params.set('language', query.languages.join(','));
  if (query.includeSold) params.set('sold', 'true');
  if (query.blackLabel) params.set('blackLabel', 'true');
  return params;
}
