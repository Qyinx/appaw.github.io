import { formatBatchReferenceCode } from './batch-reference-code';
import type { GradingServicePlan } from './reference-code';
import { buildFullStepList } from './step-labels';
import type {
  GradingDemoVariant,
  GradingProgressStep,
  GradingRelatedSubmission,
  GradingSubmission,
} from './types';

export const DEMO_INTAKE_GROUP_ID = 'intake-demo-2026-07-05';

export const DEMO_LOOKUP = {
  phoneNumber: '+85292851189',
  /** Primary demo: Express plan, July 2026 batch 3 */
  referenceCode: formatBatchReferenceCode(2026, 7, 'EXP', 3),
} as const;

/** All demo BAT reference codes for the same customer/month. */
export const DEMO_REFERENCES: Record<GradingServicePlan, string> = {
  EXP: formatBatchReferenceCode(2026, 7, 'EXP', 3),
  REG: formatBatchReferenceCode(2026, 7, 'REG', 3),
  SPX: formatBatchReferenceCode(2026, 7, 'SPX', 3),
  WALK: formatBatchReferenceCode(2026, 7, 'WALK', 3),
};

const BASE_ITEMS_EXP = [
  {
    id: 'item-exp-1',
    description: '2024 Pokémon SV8a GEM PACK — Umbreon ex SAR',
    certNumber: null as string | null,
    grade: null as string | null,
  },
  {
    id: 'item-exp-2',
    description: '2023 Pokémon SV2a — Charizard ex #199',
    certNumber: null as string | null,
    grade: null as string | null,
  },
];

const BASE_ITEMS_REG = [
  {
    id: 'item-reg-1',
    description: '2021 Pokémon SWSH — Pikachu VMAX #188',
    certNumber: null as string | null,
    grade: null as string | null,
  },
  {
    id: 'item-reg-2',
    description: '2020 Pokémon SWSH — Charizard V #154',
    certNumber: null as string | null,
    grade: null as string | null,
  },
  {
    id: 'item-reg-3',
    description: '2019 Pokémon SM — Mewtwo & Mew GX #242',
    certNumber: null as string | null,
    grade: null as string | null,
  },
];

function completedIndexForVariant(variant: GradingDemoVariant): number {
  switch (variant) {
    case 'awaiting':
      return 0;
    case 'default':
      return 6;
    case 'shipped':
      return 10;
    case 'pickup':
      return 11;
    default:
      return 6;
  }
}

function buildSteps(variant: GradingDemoVariant): GradingProgressStep[] {
  return buildFullStepList(completedIndexForVariant(variant));
}

function baseSubmission(
  id: string,
  referenceCode: string,
  servicePlan: GradingServicePlan | null,
  variant: GradingDemoVariant,
): Omit<GradingSubmission, 'statusSummary' | 'gradesReady' | 'shipped' | 'readyForLabelReview' | 'shipCarrier' | 'shipTrackingNumber' | 'items'> {
  return {
    id,
    referenceCode,
    phoneNumber: DEMO_LOOKUP.phoneNumber,
    customerName: 'Alex Collector',
    servicePlan,
    intakeGroupId: DEMO_INTAKE_GROUP_ID,
    psaOrderNumber: variant === 'awaiting' ? null : 'PSA-DEMO-88421',
    problemOrder: false,
    accountingHold: false,
    lastSyncedAt: '2026-07-05T04:00:00.000Z',
    steps: buildSteps(variant),
  };
}

function buildExpressSubmission(variant: GradingDemoVariant): GradingSubmission {
  const base = baseSubmission('sub-demo-exp', DEMO_REFERENCES.EXP, 'EXP', variant);

  if (variant === 'awaiting') {
    return {
      ...base,
      statusSummary: 'Card recorded — awaiting PSA batch',
      gradesReady: false,
      shipped: false,
      readyForLabelReview: false,
      shipCarrier: null,
      shipTrackingNumber: null,
      items: BASE_ITEMS_EXP.map((item) => ({ ...item })),
    };
  }

  if (variant === 'pickup') {
    return {
      ...base,
      statusSummary: 'Ready to pickup in store',
      gradesReady: true,
      shipped: true,
      readyForLabelReview: false,
      shipCarrier: null,
      shipTrackingNumber: null,
      items: [
        { ...BASE_ITEMS_EXP[0], certNumber: '91234567', grade: '10' },
        { ...BASE_ITEMS_EXP[1], certNumber: '91234568', grade: '9' },
      ],
    };
  }

  if (variant === 'shipped') {
    return {
      ...base,
      statusSummary: 'Shipped — on the way back',
      gradesReady: true,
      shipped: true,
      readyForLabelReview: false,
      shipCarrier: 'FedEx',
      shipTrackingNumber: '7946 1234 5678',
      items: [
        { ...BASE_ITEMS_EXP[0], certNumber: '91234567', grade: '10' },
        { ...BASE_ITEMS_EXP[1], certNumber: '91234568', grade: '9' },
      ],
    };
  }

  return {
    ...base,
    statusSummary: 'Grading in progress',
    gradesReady: false,
    shipped: false,
    readyForLabelReview: true,
    shipCarrier: null,
    shipTrackingNumber: null,
    items: BASE_ITEMS_EXP.map((item) => ({ ...item })),
  };
}

function buildRegularSubmission(): GradingSubmission {
  const base = baseSubmission('sub-demo-reg', DEMO_REFERENCES.REG, 'REG', 'awaiting');
  return {
    ...base,
    statusSummary: 'Card recorded — awaiting PSA batch',
    gradesReady: false,
    shipped: false,
    readyForLabelReview: false,
    shipCarrier: null,
    shipTrackingNumber: null,
    items: BASE_ITEMS_REG.map((item) => ({ ...item })),
  };
}

function buildWalkSubmission(): GradingSubmission {
  const base = baseSubmission('sub-demo-walk', DEMO_REFERENCES.WALK, 'WALK', 'default');
  return {
    ...base,
    statusSummary: 'Quality review at PSA',
    gradesReady: false,
    shipped: false,
    readyForLabelReview: false,
    shipCarrier: null,
    shipTrackingNumber: null,
    items: [
      {
        id: 'item-walk-1',
        description: '2016 Pokémon XY — Charizard Holo #11',
        certNumber: null,
        grade: null,
      },
    ],
  };
}

const SUBMISSION_BUILDERS: Record<string, (variant: GradingDemoVariant) => GradingSubmission> = {
  [DEMO_REFERENCES.EXP]: buildExpressSubmission,
  [DEMO_REFERENCES.REG]: () => buildRegularSubmission(),
  [DEMO_REFERENCES.SPX]: (variant) => ({
    ...buildExpressSubmission(variant),
    id: 'sub-demo-spx',
    referenceCode: DEMO_REFERENCES.SPX,
    servicePlan: 'SPX' as const,
  }),
  [DEMO_REFERENCES.WALK]: () => buildWalkSubmission(),
};

export function getMockSubmission(
  referenceCode: string,
  variant: GradingDemoVariant = 'default',
): GradingSubmission | null {
  const builder = SUBMISSION_BUILDERS[referenceCode];
  if (!builder) return null;
  return builder(variant);
}

export function getRelatedSubmissions(
  referenceCode: string,
): GradingRelatedSubmission[] {
  const current = getMockSubmission(referenceCode, 'default');
  if (!current?.intakeGroupId) return [];

  const siblings: GradingRelatedSubmission[] = [
    {
      referenceCode: DEMO_REFERENCES.REG,
      servicePlan: 'REG',
      statusSummary: 'Card recorded — awaiting PSA batch',
    },
    {
      referenceCode: DEMO_REFERENCES.SPX,
      servicePlan: 'SPX',
      statusSummary: 'Grading in progress',
    },
    {
      referenceCode: DEMO_REFERENCES.WALK,
      servicePlan: 'WALK',
      statusSummary: 'Quality review at PSA',
    },
  ];

  return siblings.filter((s) => s.referenceCode !== referenceCode);
}

export function parseDemoVariant(value: string | null | undefined): GradingDemoVariant {
  if (value === 'shipped' || value === 'awaiting' || value === 'pickup') return value;
  return 'default';
}

export function submissionProgressPercent(steps: GradingProgressStep[]): number {
  if (steps.length === 0) return 0;
  const completed = steps.filter((s) => s.completed).length;
  return Math.round((completed / steps.length) * 100);
}
