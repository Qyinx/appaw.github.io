/** Admin / ops: classify buyback card as PSA grade, sealed, or RAW. */

const SEALED_NAME =
  /未開封|sealed|ブースター|ボックス|\bbox\b|\bbooster\b|未開梱/i;

function normalizePsaGrade(grade: string): string {
  const trimmed = grade.trim();
  if (!trimmed) return '';
  const compact = trimmed.replace(/\s+/g, '').toUpperCase();
  if (compact === 'PSA10' || compact === 'PSA１０') return 'PSA10';
  // Keep other PSA grades as written (after light cleanup)
  const m = trimmed.match(/^PSA\s*(\d{1,2}(\.\d)?)$/i);
  if (m) return `PSA${m[1]}`;
  return trimmed;
}

/**
 * Nature label for admin map.
 * - sealed signals in name → 未開封 (only with evidence in the name)
 * - PSA10 / other PSA → that grade
 * - else → RAW
 */
export function snkrCardNature(cardName: string, psaGrade: string): string {
  const name = cardName || '';
  if (SEALED_NAME.test(name)) return '未開封';
  const grade = normalizePsaGrade(psaGrade);
  if (grade) return grade;
  return 'RAW';
}
