import type { Translations } from '@/i18n/en';

export interface ProtectorColorVariant {
  name: string;
  hex: string;
  hex2?: string;
  accent: string;
  glow: string;
  ring: string;
  image: string;
}

/** Ordered: warm solids → warm gradients → cool gradients → cool solids */
export function buildProtectorColors(t: Translations): ProtectorColorVariant[] {
  const c = t.psaProtectorPage.colorVariants.colors;
  return [
    { name: c.gold, hex: '#f0c96a', accent: '#f8de98', glow: 'rgba(240,200,106,0.16)', ring: 'rgba(240,200,106,0.6)', image: '/images/describe/color/color-gold.png' },
    { name: c.silver, hex: '#d4b800', accent: '#ffe033', glow: 'rgba(210,180,0,0.22)', ring: 'rgba(255,220,0,0.7)', image: '/images/describe/color/color-yellow.png' },
    { name: c.goldenEmberRed, hex: '#d4a030', hex2: '#b82020', accent: '#e07040', glow: 'rgba(192,80,32,0.16)', ring: 'rgba(220,120,60,0.6)', image: '/images/describe/color/color-golden-ember-red.png' },
    { name: c.blueDarkGrey, hex: '#4a76a8', hex2: '#404858', accent: '#5080b0', glow: 'rgba(46,64,96,0.18)', ring: 'rgba(100,140,180,0.5)', image: '/images/describe/color/color-blue-dark-grey.png' },
    { name: c.roseTintedBlue, hex: '#c86888', hex2: '#4868b8', accent: '#b090c8', glow: 'rgba(128,96,152,0.14)', ring: 'rgba(180,140,200,0.5)', image: '/images/describe/color/color-rose-tinted-bule.png' },
    { name: c.navy, hex: '#6b3fa0', accent: '#9b6fd4', glow: 'rgba(107,63,160,0.18)', ring: 'rgba(155,111,212,0.55)', image: '/images/describe/color/color-purple.png' },
    { name: c.forestGreen, hex: '#2d5a3d', accent: '#3b9c5d', glow: 'rgba(45,90,61,0.14)', ring: 'rgba(61,122,82,0.6)', image: '/images/describe/color/color-green.png' },
    { name: c.dark, hex: '#1a1a2e', accent: '#565677', glow: 'rgba(26,26,46,.28)', ring: 'rgba(80,80,110,0.55)', image: '/images/describe/color/color-dark.png' },
  ];
}

export function protectorVariantId(index: number) {
  return `APP-C${String(index + 1).padStart(2, '0')}`;
}

export function protectorSlotLabel(index: number, total: number) {
  return `${String(index + 1).padStart(2, '0')}/${String(total).padStart(2, '0')}`;
}
