/** Official marketplace listings — staff email only. Public consign via 138 Arena. */

export function isMarketplaceSellerEmail(mail: string | null | undefined): boolean {
  if (typeof mail !== 'string') return false;
  return mail.trim().toLowerCase().endsWith('@appaw.store');
}
