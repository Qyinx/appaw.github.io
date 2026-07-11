/** HKD display via Intl — inputs stay raw numbers. */
export function formatHkd(n: number): string {
  return new Intl.NumberFormat('en-HK', {
    style: 'currency',
    currency: 'HKD',
    maximumFractionDigits: 0,
  }).format(n);
}
