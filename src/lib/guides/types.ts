export type GuideLocale = 'en' | 'zh';

export type GuideSpecRow = {
  label: string;
  value: string;
};

export type GuideSection = {
  id: string;
  title: string;
  paragraphs: string[];
  specs?: GuideSpecRow[];
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
  description: string;
  badge: string;
  lead: string;
  published: string;
  updated: string;
  readTime: string;
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
};

export type GuideRegistryEntry = {
  slug: string;
  published: string;
  updated: string;
};
