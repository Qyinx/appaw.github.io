import { joinBackendUrl } from '@/lib/collection/backendUrl';
import type { GradingLookupResult } from './types';

function lookupEndpoint() {
  return joinBackendUrl('/grading/lookup');
}

export async function lookupGradingSubmission(
  phoneNumber: string,
  referenceCode: string,
): Promise<GradingLookupResult | null> {
  const response = await fetch(lookupEndpoint(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber, referenceCode }),
  });

  if (response.status === 404) {
    return null;
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error(`Lookup failed: ${response.status}`);
  }

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload && 'error' in payload
        ? String((payload as { error: unknown }).error)
        : `Lookup failed: ${response.status}`;
    throw new Error(message);
  }

  if (
    !payload ||
    typeof payload !== 'object' ||
    !('submission' in payload)
  ) {
    throw new Error('Lookup response missing submission payload');
  }

  return payload as GradingLookupResult;
}
