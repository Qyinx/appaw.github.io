/**
 * Chinese route segment — metadata alternates live on each page.
 * SSR html lang="zh-HK" is applied post-build via scripts/patch-zh-html-lang.mjs
 * (static export shares a single root layout with lang="en").
 */
export default function ZhLayout({ children }: { children: React.ReactNode }) {
  return children;
}
