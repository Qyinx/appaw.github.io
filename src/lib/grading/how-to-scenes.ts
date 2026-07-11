/** Scene stills for PSA hub how-to scroll background (Phase 1). */
export const PSA_HOW_TO_SCENES = [
  {
    id: 'intake',
    src: '/psa-grading/how-to/scene-0-intake.webp',
    alt: '138 Arena intake counter with sealed card sleeves',
  },
  {
    id: 'outbound',
    src: '/psa-grading/how-to/scene-1-outbound.webp',
    alt: 'Batch consolidation and outbound shipping crate',
  },
  {
    id: 'grading',
    src: '/psa-grading/how-to/scene-2-grading.webp',
    alt: 'Grading bench with magnifier lamp and slab case',
  },
  {
    id: 'pickup',
    src: '/psa-grading/how-to/scene-3-pickup.webp',
    alt: 'Return shelf with graded slabs at pickup counter',
  },
] as const;

/** Optional MP4 legs for Phase 2 video upgrade — same order as scenes. */
export const PSA_HOW_TO_VIDEO_LEGS = [
  '/psa-grading/how-to/leg-0-intake.mp4',
  '/psa-grading/how-to/leg-1-outbound.mp4',
  '/psa-grading/how-to/leg-2-grading.mp4',
  '/psa-grading/how-to/leg-3-pickup.mp4',
] as const;
