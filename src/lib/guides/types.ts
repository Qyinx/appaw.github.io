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

/** Styled math / decision formula rendered by GuideFormulaBlock (HTML+CSS, not LaTeX). */
export type GuideFormulaTerm = {
  /** Operator shown before this term: × + − */
  op?: '×' | '+' | '−';
  /** Main expression text, e.g. "PSA 10 市值 × 升分機率" */
  text: string;
  /** Optional secondary hint under the term */
  hint?: string;
};

export type GuideFormula = {
  /** Left-hand result label, e.g. "期望值 (EV)" */
  result: string;
  /** Small header label above the ledger */
  eyebrow?: string;
  terms: GuideFormulaTerm[];
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
  /** Optional styled formula block (HTML+CSS). */
  formula?: GuideFormula;
  /** One-sentence open loop teasing the next section (retention). */
  bridge?: string;
};

export type GuideCtaLink = {
  label: string;
  href: string;
};

export type GuideCtaBlock = {
  title: string;
  body: string;
  primary: GuideCtaLink;
  secondary?: GuideCtaLink;
};

/** Inline CTA inserted after a specific section (P0 retention guides). */
export type GuideMidCta = GuideCtaBlock & {
  afterSectionId: string;
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
  cta: GuideCtaBlock;
  midCta?: GuideMidCta;
  relatedSlugs: string[];
  sources?: GuideSourceLink[];
  /** Optional FAQ pairs — rendered via GuideFaq and emitted as FAQPage JSON-LD. */
  faq?: { q: string; a: string }[];
};

export type GuideRegistryEntry = {
  slug: string;
  published: string;
  updated: string;
};
