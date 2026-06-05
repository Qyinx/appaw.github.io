import { centeringMetadata } from '@/lib/seo/metadata';
import { en } from '@/i18n';
import CenteringPageContent from './CenteringPageContent';

export const metadata = centeringMetadata;

export default function Page() {
  return (
    <CenteringPageContent
      t={en}
      pageUrl="https://appaw.store/tools/card-centering/"
      homeUrl="https://appaw.store/"
    />
  );
}
