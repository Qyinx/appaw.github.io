export type PsaFaqAnswer =
  | string
  | {
      intro?: string;
      options: string[];
    };

export type PsaFaqItem = {
  q: string;
  a: PsaFaqAnswer;
};

export type PsaFaqGroup = {
  id: string;
  label: string;
  items: PsaFaqItem[];
};

export function faqAnswerToText(a: PsaFaqAnswer): string {
  if (typeof a === 'string') return a;
  const parts = [...(a.intro ? [a.intro] : []), ...a.options.map((option, index) => `${index + 1}. ${option}`)];
  return parts.join(' ');
}

export function flattenPsaFaqItems(groups: PsaFaqGroup[]): { q: string; a: string }[] {
  return groups.flatMap((group) =>
    group.items.map((item) => ({
      q: item.q,
      a: faqAnswerToText(item.a),
    })),
  );
}

export function countPsaFaqItems(groups: PsaFaqGroup[]): number {
  return groups.reduce((total, group) => total + group.items.length, 0);
}
