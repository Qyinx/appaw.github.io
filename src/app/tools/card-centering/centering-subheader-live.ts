'use client';

import type { QualityTier } from '@/lib/centering';

export type CenteringSubHeaderLive = {
  photoMode: 'raw' | 'slab';
  lr?: number;
  tb?: number;
  zoneLabel: string | null;
  quality?: QualityTier;
  verdictLabel: string | null;
  verdictHint: string | null;
  hasGrade: boolean;
};

const EMPTY_LIVE: CenteringSubHeaderLive = {
  photoMode: 'raw',
  zoneLabel: null,
  verdictLabel: null,
  verdictHint: null,
  hasGrade: false,
};

let live: CenteringSubHeaderLive = EMPTY_LIVE;
let version = 0;
const listeners = new Set<() => void>();

export function setCenteringSubHeaderLive(next: CenteringSubHeaderLive) {
  live = next;
  version += 1;
  listeners.forEach((listener) => listener());
}

export function subscribeCenteringSubHeaderLive(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getCenteringSubHeaderLive() {
  return live;
}

export function getCenteringSubHeaderLiveVersion() {
  return version;
}
