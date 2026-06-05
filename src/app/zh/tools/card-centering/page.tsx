import { zhCenteringMetadata } from '@/lib/seo/metadata';
import { zh } from '@/i18n';
import CenteringPageContent from '../../../tools/card-centering/CenteringPageContent';

export const metadata = zhCenteringMetadata;

export default function Page() {
  return (
    <CenteringPageContent
      t={zh}
      pageUrl="https://appaw.store/zh/tools/card-centering/"
      homeUrl="https://appaw.store/zh/"
    />
  );
}
