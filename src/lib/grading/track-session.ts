import type { GradingRelatedSubmission, GradingSubmission } from './types';

const STORAGE_KEY = 'appaw.psa-grading.track.session';
/** Keep last successful lookup across F5 for a day. */
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

type ResultsTab = 'status' | 'cards';

export type TrackLookupSession = {
  phone: string;
  referenceCode: string;
  submission: GradingSubmission;
  relatedSubmissions: GradingRelatedSubmission[];
  resultsTab: ResultsTab;
  savedAt: number;
};

function storage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function isResultsTab(value: unknown): value is ResultsTab {
  return value === 'status' || value === 'cards';
}

function isSubmission(value: unknown): value is GradingSubmission {
  if (!value || typeof value !== 'object') return false;
  const s = value as Record<string, unknown>;
  const idOk = typeof s.id === 'string' || typeof s.id === 'number';
  return (
    idOk &&
    typeof s.referenceCode === 'string' &&
    s.referenceCode.length > 0 &&
    Array.isArray(s.steps) &&
    Array.isArray(s.items)
  );
}

function normalizeSubmission(raw: GradingSubmission): GradingSubmission {
  return {
    ...raw,
    id: String(raw.id),
  };
}

export function readTrackLookupSession(): TrackLookupSession | null {
  const store = storage();
  if (!store) return null;
  try {
    const raw = store.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<TrackLookupSession>;
    const savedAt = typeof parsed.savedAt === 'number' ? parsed.savedAt : 0;
    if (!savedAt || Date.now() - savedAt > SESSION_TTL_MS) {
      store.removeItem(STORAGE_KEY);
      return null;
    }
    if (
      typeof parsed.phone !== 'string' ||
      typeof parsed.referenceCode !== 'string' ||
      !isSubmission(parsed.submission) ||
      !isResultsTab(parsed.resultsTab)
    ) {
      store.removeItem(STORAGE_KEY);
      return null;
    }
    const related = Array.isArray(parsed.relatedSubmissions)
      ? parsed.relatedSubmissions
      : [];
    return {
      phone: parsed.phone,
      referenceCode: parsed.referenceCode,
      submission: normalizeSubmission(parsed.submission),
      relatedSubmissions: related,
      resultsTab: parsed.resultsTab,
      savedAt,
    };
  } catch {
    try {
      store?.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    return null;
  }
}

export function writeTrackLookupSession(
  session: Omit<TrackLookupSession, 'savedAt'>,
): void {
  const store = storage();
  if (!store) return;
  try {
    const payload: TrackLookupSession = {
      ...session,
      submission: normalizeSubmission(session.submission),
      relatedSubmissions: session.relatedSubmissions ?? [],
      savedAt: Date.now(),
    };
    store.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* quota / private mode — skip silently */
  }
}

export function clearTrackLookupSession(): void {
  const store = storage();
  if (!store) return;
  try {
    store.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
