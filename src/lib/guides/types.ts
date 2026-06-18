export type GuideLocale = 'en' | 'zh';

export type GuideSpecRow = {
  label: string;
  /** Plain text; use `[label](href)` for inline links and `**bold**` for emphasis. */
  value: string;
};

export type GuideTable = {
  headers: string[];
  /** Each row: [row label, ...cell values matching data columns]. */
  rows: string[][];
};

export type GuideFigure = {
  /** Public path, e.g. `/images-optimized/guides/slug/file.jpg`. */
  src: string;
  caption?: string;
};

export type GuideVideo = GuideFigure;

export type GuideBulletItem = {
  label: string;
  text: string;
  images?: GuideFigure[];
  videos?: GuideFigure[];
};

export type GuideBulletGroup = {
  label: string;
  items: GuideBulletItem[];
};

export type GuideSubsection = {
  title: string;
  level?: 3 | 4;
  paragraphs?: string[];
  bulletGroups?: GuideBulletGroup[];
  images?: GuideFigure[];
  videos?: GuideFigure[];
};

export type GuideSection = {
  id: string;
  title: string;
  /** Plain text; use `[label](href)` for inline links and `**bold**` for emphasis (rendered in GuideProse). */
  paragraphs: string[];
  bulletGroups?: GuideBulletGroup[];
  videos?: GuideFigure[];
  /** Highlighted warning or tip (blockquote). */
  callout?: string;
  subsections?: GuideSubsection[];
  specs?: GuideSpecRow[];
  table?: GuideTable;
};

export type GuideCtaLink = {
  label: string;
  href: string;
};

export type GuideSourceLink = {
  label: string;
  href: string;
};

export type GuideContent = {
  slug: string;
  title: string;
  badge: string;
  lead: string;
  published: string;
  updated: string;
  readTime: string;
  heroImage?: string;
  heroSpecs: GuideSpecRow[];
  sections: GuideSection[];
  cta: {
    title: string;
    body: string;
    primary: GuideCtaLink;
    secondary?: GuideCtaLink;
  };
  relatedSlugs: string[];
  sources?: GuideSourceLink[];
  /** Optional FAQ pairs — rendered as subsections and emitted as FAQPage JSON-LD. */
  faq?: { q: string; a: string }[];
};

export type GuideRegistryEntry = {
  slug: string;
  published: string;
  updated: string;
};
