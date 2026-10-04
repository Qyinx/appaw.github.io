import StructuredData from '@/components/StructuredData';
import { buildPsaProtectorsStructuredData } from '@/lib/seo/psa-protectors-structured-data';

export function PsaProtectorsSeo({ locale }: { locale: 'en' | 'zh' }) {
  return <StructuredData data={buildPsaProtectorsStructuredData(locale)} />;
}
