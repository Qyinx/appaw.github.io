import { createHash } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const skillPath = join(root, 'public/.well-known/agent-skills/appaw-site-overview/SKILL.md');
const indexPath = join(root, 'public/.well-known/agent-skills/index.json');

const body = readFileSync(skillPath);
const digest = `sha256:${createHash('sha256').update(body).digest('hex')}`;

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const skill = index.skills?.find((s) => s.name === 'appaw-site-overview');
if (skill) {
  skill.digest = digest;
  writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);
  console.log(`Updated digest: ${digest}`);
} else {
  console.error('appaw-site-overview skill not found in index.json');
  process.exit(1);
}
