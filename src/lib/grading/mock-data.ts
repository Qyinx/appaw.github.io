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
  phoneNumber: '+85291234567',
  /** Primary demo: Express plan, July 2026 batch 99 */
  referenceCode: formatBatchReferenceCode(2026, 7, 'EXP', 99),
} as const;

/** All demo BAT reference codes for the same customer/month. */
export const DEMO_REFERENCES: Record<GradingServicePlan, string> = {
  VBLK: formatBatchReferenceCode(2026, 7, 'VBLK', 99),
  VPLS: formatBatchReferenceCode(2026, 7, 'VPLS', 99),
  VMAX: formatBatchReferenceCode(2026, 7, 'VMAX', 99),
  EXP: formatBatchReferenceCode(2026, 7, 'EXP', 99),
  REG: formatBatchReferenceCode(2026, 7, 'REG', 99),
  SPX: formatBatchReferenceCode(2026, 7, 'SPX', 99),
  WALK: formatBatchReferenceCode(2026, 7, 'WALK', 99),
  RHLD: formatBatchReferenceCode(2026, 7, 'RHLD', 99),
  PRE1: formatBatchReferenceCode(2026, 7, 'PRE1', 99),
  PRE2: formatBatchReferenceCode(2026, 7, 'PRE2', 99),
  PRE3: formatBatchReferenceCode(2026, 7, 'PRE3', 99),
};

const BASE_ITEMS_EXP = [
  {
    id: 'item-exp-1',
    description: '2024 Pokémon SV8a GEM PACK — Umbreon ex SAR',
    certNumber: null as string | null,
    grade: null as string | null,
    images: [
      {
        seq: 1,
        url: '/images-optimized/guides/identify-fake-psa-slabs/appaw-store-real-psa-front-old-label.jpg',
      },
      {
        seq: 2,
        url: '/images-optimized/guides/identify-fake-psa-slabs/appaw-store-real-psa-back-old-label.jpg',
      },
    ],
  },
  {
    id: 'item-exp-2',
    description: '2023 Pokémon SV2a — Charizard ex #199',
    certNumber: null as string | null,
    grade: null as string | null,
    images: [
      {
        seq: 1,
        url: '/images-optimized/guides/identify-fake-psa-slabs/appaw-store-real-psa-front-old-label.jpg',
      },
      {
        seq: 2,
        url: '/images-optimized/guides/identify-fake-psa-slabs/appaw-store-real-psa-back-old-label.jpg',
      },
    ],
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
      return 5;
    case 'shipped':
      return 9;
    case 'pickup':
      return 10;
    default:
      return 5;
  }
}

function buildSteps(variant: GradingDemoVariant): GradingProgressStep[] {
  return buildFullStepList(completedIndexForVariant(variant));
}

const DEMO_NOTES =
  '<p>Your batch is on schedule. We will WhatsApp you when cards are ready for pickup at 138 Arena.</p>';

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
    notes: DEMO_NOTES,
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
      statusSummary: 'Completing',
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

function buildReholderSubmission(): GradingSubmission {
  const base = baseSubmission('sub-demo-rhld', DEMO_REFERENCES.RHLD, 'RHLD', 'default');
  return {
    ...base,
    statusSummary: 'Submitted to PSA — Reholder in progress',
    gradesReady: false,
    shipped: false,
    readyForLabelReview: false,
    shipCarrier: null,
    shipTrackingNumber: null,
    items: [
      {
        id: 'item-rhld-1',
        description: '2021 Pokémon SWSH — Umbreon VMAX #215',
        certNumber: '82345671',
        grade: null,
        images: [
          {
            seq: 1,
            url: '/images-optimized/guides/identify-fake-psa-slabs/appaw-store-real-psa-front-old-label.jpg',
          },
          {
            seq: 2,
            url: '/images-optimized/guides/identify-fake-psa-slabs/appaw-store-real-psa-back-old-label.jpg',
          },
        ],
      },
      {
        id: 'item-rhld-2',
        description: '2019 Pokémon SM — Mewtwo GX #76',
        certNumber: '82345672',
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
  [DEMO_REFERENCES.RHLD]: () => buildReholderSubmission(),
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
    {
      referenceCode: DEMO_REFERENCES.RHLD,
      servicePlan: 'RHLD',
      statusSummary: 'Submitted to PSA — Reholder in progress',
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
