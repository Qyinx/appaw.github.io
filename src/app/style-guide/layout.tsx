import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Style Guide | Appaw Store',
  description: 'Appaw Store design system reference — tokens, typography, panels, and engineering UI patterns.',
  robots: { index: true, follow: true },
};

export default function StyleGuideLayout({ children }: { children: React.ReactNode }) {
  return children;
}
