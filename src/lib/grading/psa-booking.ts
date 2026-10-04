/** Canonical Google Calendar appointment link for PSA drop-off at 138 Arena. */
export const PSA_SUBMISSION_APPOINTMENT_URL =
  'https://calendar.app.google/zq1mn6H7d8GGtQpq9';

/** Questions only — not intake or quotes. */
export const PSA_SUBMISSION_WHATSAPP_URL = 'https://wa.me/85292851189';

/** Google Maps link for 138 Arena drop-off. */
export const PSA_DROP_OFF_MAPS_URL =
  'https://maps.app.goo.gl/Gybs958UrANZSM3Z7';

/** 138 Arena pin used by the embed (WGS84). */
export const ARENA_MAP_COORDS = {
  lat: 22.281091907715602,
  lng: 114.1827235657966,
} as const;

/**
 * Official Google Maps embed for 138 Arena.
 * Tile colors / feature visibility / cloud themes need a Maps JS Map ID —
 * the public iframe cannot take those. Surrounding chrome uses Appaw tokens.
 */
const ARENA_MAPS_EMBED_BASE =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d548.8069322674481!2d114.1827235657966!3d22.281091907715602!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f15.1!3m3!1m2!1s0x340401004013c9fd%3A0xb9fa0b70b85717f7!2s138%20Arena';

export function arenaMapsEmbedSrc(language: 'en' | 'zh'): string {
  if (language === 'zh') {
    return `${ARENA_MAPS_EMBED_BASE}!5e0!3m2!1szh-HK!2shk!4v1791111206878!5m2!1szh-HK!2shk`;
  }
  return `${ARENA_MAPS_EMBED_BASE}!5e0!3m2!1sen!2shk!4v1791111206878!5m2!1sen!2shk`;
}
