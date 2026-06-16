import type { Currency } from '@/app/collection/types';
import type { MemberLevel } from '@/app/collection/components/shared';
import { normalizePreferredCurrency } from '@/lib/collection/currency';

export interface UserProfile {
  displayName: string;
  mail: string;
  preferredCurrency: Currency;
  membership?: MemberLevel;
}

export interface UserProfileForm {
  displayName: string;
  mail: string;
  preferredCurrency: Currency;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeUserProfile(raw: any): UserProfile {
  const membership = raw.Membership ?? raw.membership;
  const level: MemberLevel | undefined =
    membership === 'Foil' || membership === 'Prism' || membership === 'Aurora'
      ? membership
      : undefined;

  return {
    displayName: String(raw.DisplayName ?? raw.displayName ?? ''),
    mail: String(raw.Mail ?? raw.mail ?? ''),
    preferredCurrency: normalizePreferredCurrency(raw.PreferredCurrency ?? raw.preferredCurrency),
    ...(level ? { membership: level } : {}),
  };
}
