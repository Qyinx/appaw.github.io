import type { LucideIcon } from 'lucide-react';
import { Box, CheckCircle, Layers, Shield, Sun, Weight } from 'lucide-react';
import type { Translations } from '@/i18n';

export type ProtectorSpecId =
  | 'size'
  | 'weight'
  | 'materials'
  | 'uvProtection'
  | 'compatibility'
  | 'closure';

export interface ProtectorSpecItem {
  id: ProtectorSpecId;
  icon: LucideIcon;
  label: string;
  value: string;
  description: string;
}

const SPEC_ORDER: ProtectorSpecId[] = [
  'size',
  'weight',
  'materials',
  'uvProtection',
  'compatibility',
  'closure',
];

const SPEC_ICONS: Record<ProtectorSpecId, LucideIcon> = {
  size: Box,
  weight: Weight,
  materials: Layers,
  uvProtection: Sun,
  compatibility: CheckCircle,
  closure: Shield,
};

export function getProtectorSpecItems(t: Translations): ProtectorSpecItem[] {
  const s = t.psaProtectorPage.specs;

  const values: Record<ProtectorSpecId, string> = {
    size: s.sizeValue,
    weight: s.weightValue,
    materials: s.materialsValue,
    uvProtection: s.uvProtectionValue,
    compatibility: s.compatibilityValue,
    closure: s.closureValue,
  };

  const descriptions: Record<ProtectorSpecId, string> = {
    size: s.sizeDesc,
    weight: s.weightDesc,
    materials: s.materialsDesc,
    uvProtection: s.uvProtectionDesc,
    compatibility: s.compatibilityDesc,
    closure: s.closureDesc,
  };

  const labels: Record<ProtectorSpecId, string> = {
    size: s.size,
    weight: s.weight,
    materials: s.materials,
    uvProtection: s.uvProtection,
    compatibility: s.compatibility,
    closure: s.closure,
  };

  return SPEC_ORDER.map((id) => ({
    id,
    icon: SPEC_ICONS[id],
    label: labels[id],
    value: values[id],
    description: descriptions[id],
  }));
}
