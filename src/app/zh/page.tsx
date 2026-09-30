import HomeClient from '../HomeClient';
import { zhHomeMetadata } from '@/lib/seo/metadata';
import { getImagePath } from '@/lib/utils';

export const metadata = zhHomeMetadata;

const HERO_LCP_SRC = getImagePath('/images/describe/color/color-gold.png');

export default function ZhHomePage() {
  return (
    <>
      <link rel="preload" as="image" href={HERO_LCP_SRC} fetchPriority="high" />
      <HomeClient />
    </>
  );
}
