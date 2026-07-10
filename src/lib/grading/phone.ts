/** Strip spaces, dashes, parentheses — keep leading + if present. */
function stripPhoneInput(input: string): string {
  return input.trim().replace(/[\s\-().]/g, '');
}

/**
 * Normalize to E.164-style HK phone (+852XXXXXXXX) when possible.
 * Accepts: +85292851189, 85292851189, 92851189, +852 9285 1189
 */
export function normalizePhone(input: string): string | null {
  const stripped = stripPhoneInput(input);
  if (!stripped) return null;

  const digitsOnly = stripped.replace(/\D/g, '');
  if (digitsOnly.length < 8) return null;

  if (digitsOnly.length === 8) {
    return `+852${digitsOnly}`;
  }

  if (digitsOnly.length === 11 && digitsOnly.startsWith('852')) {
    return `+${digitsOnly}`;
  }

  if (stripped.startsWith('+') && digitsOnly.length >= 10) {
    return `+${digitsOnly}`;
  }

  if (digitsOnly.length >= 10) {
    return `+${digitsOnly}`;
  }

  return null;
}

export function phonesMatch(a: string, b: string): boolean {
  const na = normalizePhone(a);
  const nb = normalizePhone(b);
  if (!na || !nb) return false;
  return na === nb;
}
