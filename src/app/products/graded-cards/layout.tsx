import { gradedCardsMetadata } from '@/lib/seo/metadata';

export const metadata = gradedCardsMetadata;

export default function GradedCardsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
