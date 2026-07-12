'use client';

import ServiceAvailabilityBanner from '@/components/business/ServiceAvailabilityBanner';
import { PSA_SUBMISSION_APPOINTMENT_URL } from '@/lib/grading/psa-booking';
import type { Translations } from '@/i18n/en';

type Props = {
  copy: Translations['psaGradingPage']['availability'];
};

export default function PsaGradingAvailabilityBanner({ copy }: Props) {
  return (
    <ServiceAvailabilityBanner
      copy={copy}
      ctaHref={PSA_SUBMISSION_APPOINTMENT_URL}
      ctaIcon="calendar"
    />
  );
}
