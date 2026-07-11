import { Suspense } from 'react';
import PsaGradingTrackPageShell from '../../../../business/psa-grading/track/PsaGradingTrackPageShell';

export default function ZhPsaGradingTrackPage() {
  return (
    <Suspense fallback={null}>
      <PsaGradingTrackPageShell locale="zh" />
    </Suspense>
  );
}
