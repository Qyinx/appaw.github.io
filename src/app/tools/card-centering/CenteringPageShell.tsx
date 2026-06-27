'use client';

import CardCenteringClient from './CardCenteringClient';
import CenteringContent from './CenteringContent';
import { CenteringGuideProvider } from './CenteringGuideContext';

export default function CenteringPageShell() {
  return (
    <CenteringGuideProvider>
      <CardCenteringClient />
      <CenteringContent />
    </CenteringGuideProvider>
  );
}
