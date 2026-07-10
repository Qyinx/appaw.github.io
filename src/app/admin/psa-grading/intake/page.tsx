import type { Metadata } from 'next';
import GradingIntakeClient from './GradingIntakeClient';

export const metadata: Metadata = {
  title: 'New Intake | PSA Grading Admin',
  robots: { index: false, follow: false },
};

export default function PsaGradingIntakePage() {
  return <GradingIntakeClient />;
}
