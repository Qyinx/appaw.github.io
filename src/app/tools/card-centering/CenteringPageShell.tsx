'use client';

import CardCenteringClient from './CardCenteringClient';
import CenteringContent from './CenteringContent';
import CenteringFollowCta from './CenteringFollowCta';
import { CenteringGuideProvider } from './CenteringGuideContext';

export default function CenteringPageShell() {
  return (
    <CenteringGuideProvider>
      <CardCenteringClient />
      <CenteringFollowCta variant="strip" />
      <CenteringContent />
    </CenteringGuideProvider>
  );
}
