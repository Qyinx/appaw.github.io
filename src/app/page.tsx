import HomeClient from './HomeClient';
import { homeMetadata } from '@/lib/seo/metadata';
import { getImagePath } from '@/lib/utils';

export const metadata = homeMetadata;

const HERO_LCP_SRC = getImagePath('/images/describe/color/color-gold.png');

export default function Page() {
  return (
    <>
      <link rel="preload" as="image" href={HERO_LCP_SRC} fetchPriority="high" />
      <HomeClient />
    </>
  );
}
