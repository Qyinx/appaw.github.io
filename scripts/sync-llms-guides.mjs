#!/usr/bin/env node
/**
 * Regenerate the Collector guides table in public/llms.txt from GUIDE_SLUGS.
 * Run after adding a slug to src/lib/guides/registry.ts:
 *   node scripts/sync-llms-guides.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = path.join(root, 'src/lib/guides/registry.ts');
const llmsPath = path.join(root, 'public/llms.txt');

const TOPICS = {
  'choose-35pt-slab-protector': 'How to choose a 35PT PSA/CGC slab protector',
  'uv-protection-graded-cards': 'UV blocking and humidity storage for graded slabs',
  'psa-10-centering-requirements':
    'PSA 10 centering — 55/45 front, 75/25 back, grade table, free centering tool',
  'grade-or-protect-first':
    'Raw card to protected slab — sequential grading then outer case, $25+ threshold, two-path workflow',
  'identify-fake-psa-slabs':
    'PSA slab authentication — five-step cert lookup, UV blacklight (#43+), label eras, physical verification refs',
  'display-graded-cards':
    'Graded slab display — binder, magnetic case, wall/cabinet setup, UV protection table',
  'regrade-or-reholder':
    'PSA regrade vs reholder — comparison table, fees, downgrade risk, when to choose each',
  'psa-grading-standards':
    'PSA 1–10 grade scale, Qualifier codes (OC/ST/PD), and record sale premiums',
};

const registry = readFileSync(registryPath, 'utf8');
const slugMatch = registry.match(/export const GUIDE_SLUGS = \[([\s\S]*?)\] as const;/);
if (!slugMatch) {
  console.error('Could not parse GUIDE_SLUGS from registry.ts');
  process.exit(1);
}

const slugs = [...slugMatch[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
const missingTopics = slugs.filter((slug) => !TOPICS[slug]);
if (missingTopics.length) {
  console.error('Add TOPICS entries for:', missingTopics.join(', '));
  process.exit(1);
}

const rows = slugs
  .map((slug) => {
    const topic = TOPICS[slug];
    return `| ${slug} | https://appaw.store/guides/${slug}/ | https://appaw.store/zh/guides/${slug}/ | ${topic} |`;
  })
  .join('\n');

const table = `## Collector guides

| Slug | EN URL | ZH URL | Topic |
|------|--------|--------|-------|
${rows}`;

let llms = readFileSync(llmsPath, 'utf8');
const startMarker = '## Collector guides';
const endMarker = '## Purchase channels';
const startIdx = llms.indexOf(startMarker);
const endIdx = llms.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
  console.error('Could not find guides section markers in llms.txt');
  process.exit(1);
}

llms = llms.slice(0, startIdx) + table + '\n\n' + llms.slice(endIdx);
writeFileSync(llmsPath, llms, 'utf8');
console.log(`Updated llms.txt with ${slugs.length} guide(s).`);
