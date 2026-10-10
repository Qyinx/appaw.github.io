/**
 * Port of the SNKRDUNK crawler card_id rule.
 * sha1(normalize(name)[|number]|grade_or_RAW)[:12]
 * normalize = NFKC + strip decorative emoji (keep ☆ and similar marks) + remove whitespace + lower.
 */
import { createHash } from 'node:crypto';

const WS = /\s+/g;

/** Star and similar marks that belong to the printed name. */
const KEEP_MARKS = new Set('☆★✦✧✩✪✫✬✭✮✯✰※＊*');

const DECORATIVE =
  /[\u{1F300}-\u{1FAFF}\u{2700}-\u{27BF}\u{2600}-\u{26FF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}✅🔥⚡💀🆙🟡🟣💛🌊🍄🐚👻🥄🪨❤🐦✌❄]/u;

export function stripDecorative(text) {
  let out = '';
  for (const ch of text || '') {
    if (KEEP_MARKS.has(ch)) {
      out += ch;
      continue;
    }
    if (DECORATIVE.test(ch)) continue;
    const cp = ch.codePointAt(0) ?? 0;
    if (cp >= 0x2600 && cp <= 0x26ff && !KEEP_MARKS.has(ch)) continue;
    out += ch;
  }
  return out;
}

export function normalizeName(cardName) {
  let text = String(cardName || '').normalize('NFKC');
  text = stripDecorative(text);
  text = text.trim().replace(WS, '');
  return text.toLowerCase();
}

export function normalizeNumber(cardNumber) {
  if (!cardNumber || !String(cardNumber).trim()) return '';
  let text = String(cardNumber).normalize('NFKC');
  text = text.trim().replace(WS, '');
  return text.toLowerCase();
}

export function gradeToken(psaGrade) {
  const grade = String(psaGrade || '').trim();
  return grade || 'RAW';
}

/** Visible name: NFKC + strip decorative emoji. Keeps spaces and ☆. */
export function displayCardName(cardName) {
  let text = String(cardName || '').normalize('NFKC');
  text = stripDecorative(text);
  return text.replace(WS, ' ').trim();
}

export function makeCardId(cardName, psaGrade, cardNumber) {
  const name = normalizeName(cardName);
  const number = normalizeNumber(cardNumber);
  const grade = gradeToken(psaGrade);
  const payload = number ? `${name}|${number}|${grade}` : `${name}|${grade}`;
  return createHash('sha1').update(payload, 'utf8').digest('hex').slice(0, 12);
}
