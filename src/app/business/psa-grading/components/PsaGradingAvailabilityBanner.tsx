'use client';

import ServiceAvailabilityBanner from '@/components/business/ServiceAvailabilityBanner';
import type { Translations } from '@/i18n/en';

type Props = {
  copy: Translations['psaGradingPage']['availability'];
};

export default function PsaGradingAvailabilityBanner({ copy }: Props) {
  return <ServiceAvailabilityBanner copy={copy} />;
}
