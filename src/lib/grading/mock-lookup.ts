import {
  DEMO_LOOKUP,
  DEMO_REFERENCES,
  getMockSubmission,
  getRelatedSubmissions,
  parseDemoVariant,
} from './mock-data';
import { phonesMatch } from './phone';
import { normalizeBatchReferenceCode } from './batch-reference-code';
import type { GradingDemoVariant, GradingLookupResult } from './types';

const MOCK_DELAY_MS = 700;

const ALL_DEMO_REFS = [
  DEMO_REFERENCES.EXP,
  DEMO_REFERENCES.REG,
  DEMO_REFERENCES.SPX,
  DEMO_REFERENCES.WALK,
];

export function isDemoMatch(phone: string, referenceCode: string): boolean {
  if (!phonesMatch(phone, DEMO_LOOKUP.phoneNumber)) return false;
  const normalized = normalizeBatchReferenceCode(referenceCode);
  if (!normalized) return false;
  return ALL_DEMO_REFS.includes(normalized);
}

export async function mockLookup(
  phone: string,
  referenceCode: string,
  demoVariant: GradingDemoVariant = 'default',
): Promise<GradingLookupResult | null> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

  if (!isDemoMatch(phone, referenceCode)) {
    return null;
  }

  const normalized = normalizeBatchReferenceCode(referenceCode);
  if (!normalized) return null;

  const submission = getMockSubmission(normalized, demoVariant);
  if (!submission) return null;

  const relatedSubmissions = getRelatedSubmissions(normalized);

  return {
    submission,
    relatedSubmissions: relatedSubmissions.length > 0 ? relatedSubmissions : undefined,
  };
}

export { parseDemoVariant };
