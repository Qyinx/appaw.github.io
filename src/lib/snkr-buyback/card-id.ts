import { displayCardName as displayCardNameJs, makeCardId as makeCardIdJs } from './card-id.mjs';

/** Visible name: NFKC + strip decorative emoji. Keeps spaces and marks such as ☆. */
export function displayCardName(cardName: string): string {
  return displayCardNameJs(cardName);
}

/** sha1(normalize(name)[|number]|grade_or_RAW)[:12]. Matches the crawler. */
export function makeCardId(cardName: string, psaGrade?: string | null, cardNumber?: string | null): string {
  return makeCardIdJs(cardName, psaGrade, cardNumber);
}
