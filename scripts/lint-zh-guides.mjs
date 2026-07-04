#!/usr/bin/env node
/**
 * Lint zh-HK guide content for register, terminology, and data issues.
 * Also scans centeringPage strings in src/i18n/zh.ts.
 *   node scripts/lint-zh-guides.mjs
 */
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const zhDir = path.join(root, 'src/lib/guides/content/zh');
const zhI18nPath = path.join(root, 'src/i18n/zh.ts');

const SIMPLIFIED = {
  保护: '保護',
  鉴定: '鑑定',
  视频: '影片',
  软件: '軟件',
  网络: '網絡',
  质量: '質量',
  发现: '發現',
  关于: '關於',
  这个: '這個',
  们: '們',
  国: '國',
  学: '學',
  时: '時',
  为: '為',
  发: '發',
  经: '經',
  体: '體',
  关: '關',
  问: '問',
  题: '題',
  说: '說',
  话: '話',
  过: '過',
  还: '還',
  让: '讓',
  从: '從',
  现: '現',
  实: '實',
  点: '點',
  样: '樣',
  种: '種',
  总: '總',
  无: '無',
  电: '電',
  门: '門',
  开: '開',
  见: '見',
  长: '長',
  风: '風',
  书: '書',
  车: '車',
  东: '東',
  马: '馬',
  鱼: '魚',
  鸟: '鳥',
  龙: '龍',
  万: '萬',
  与: '與',
  专: '專',
  业: '業',
  广: '廣',
  云: '雲',
  产: '產',
  仅: '僅',
  护: '護',
  壳: '殼',
  标: '標',
  签: '簽',
  测: '測',
  试: '試',
  验: '驗',
  证: '證',
  认: '認',
  询: '詢',
  录: '錄',
  处: '處',
  备: '備',
  设: '設',
};

const COLLOQUIAL = [
  { pattern: /唔/, label: '口語：唔' },
  { pattern: /嘅/, label: '口語：嘅' },
  { pattern: /喺/, label: '口語：喺' },
  { pattern: /俾/, label: '口語：俾' },
  { pattern: /睇/, label: '口語：睇' },
  { pattern: /揀/, label: '口語：揀' },
  { pattern: /點樣/, label: '口語：點樣' },
  { pattern: /搞反/, label: '口語：搞反' },
  { pattern: /一齊蝕/, label: '口語：一齊蝕' },
  { pattern: /嗰/, label: '口語：嗰' },
  { pattern: /用緊/, label: '口語：用緊' },
  { pattern: /封咗/, label: '口語：封咗' },
  { pattern: /入得去/, label: '口語：入得去' },
  { pattern: /chase\s*卡/, label: '中英夾雜：chase 卡' },
];

const TERMINOLOGY = [
  { pattern: /評級卡/, label: '術語：評級卡 → 鑑定卡' },
  { pattern: /居中/, label: '術語：居中 → 置中' },
  { pattern: /——|—/, label: '標點：em dash' },
];

function lineOf(text, index) {
  return text.slice(0, index).split('\n').length;
}

function findHeroSpecLabels(source, file) {
  const issues = [];
  const block = source.match(/heroSpecs:\s*\[([\s\S]*?)\],/);
  if (!block) return issues;

  const labels = [...block[1].matchAll(/label:\s*'([^']+)'/g)].map((m) => m[1]);
  const seen = new Map();
  for (const label of labels) {
    seen.set(label, (seen.get(label) ?? 0) + 1);
  }
  for (const [label, count] of seen) {
    if (count > 1) {
      issues.push({ file, line: 0, kind: 'duplicate-heroSpec', message: `重複 heroSpec label「${label}」×${count}` });
    }
  }
  return issues;
}

const files = readdirSync(zhDir)
  .filter((name) => name.endsWith('.ts'))
  .map((name) => path.join(zhDir, name));

function extractCenteringPageBlock(source) {
  const start = source.indexOf('centeringPage:');
  if (start < 0) return null;
  let depth = 0;
  let started = false;
  for (let i = start; i < source.length; i++) {
    const ch = source[i];
    if (ch === '{') {
      depth += 1;
      started = true;
    } else if (ch === '}') {
      depth -= 1;
      if (started && depth === 0) {
        return source.slice(start, i + 1);
      }
    }
  }
  return null;
}

function lintCenteringPage() {
  const file = path.relative(root, zhI18nPath);
  const source = readFileSync(zhI18nPath, 'utf8');
  const block = extractCenteringPageBlock(source);
  if (!block) {
    return [{ file, line: 0, kind: 'missing', message: 'centeringPage block not found in zh.ts' }];
  }
  const blockStart = source.indexOf(block);
  return lintSource(block, file, blockStart);
}

function lintSource(source, file, offset = 0) {
  const issues = findHeroSpecLabels(source, file);

  for (const [simp, trad] of Object.entries(SIMPLIFIED)) {
    let match;
    const re = new RegExp(simp, 'g');
    while ((match = re.exec(source)) !== null) {
      issues.push({
        file,
        line: lineOf(source, match.index),
        kind: 'simplified',
        message: `簡體「${simp}」→ 建議「${trad}」`,
      });
    }
  }

  for (const rule of [...COLLOQUIAL, ...TERMINOLOGY]) {
    let match;
    const re = new RegExp(rule.pattern.source, rule.pattern.flags.includes('g') ? rule.pattern.flags : `${rule.pattern.flags}g`);
    while ((match = re.exec(source)) !== null) {
      issues.push({
        file,
        line: lineOf(source, match.index),
        kind: 'register',
        message: rule.label,
      });
    }
  }

  return issues;
}

function lintFile(filePath) {
  const file = path.relative(root, filePath);
  const source = readFileSync(filePath, 'utf8');
  return lintSource(source, file);
}

const allIssues = [...files.flatMap(lintFile), ...lintCenteringPage()];

if (!allIssues.length) {
  console.log(`lint-zh-guides: OK (${files.length} guide files + centeringPage)`);
  process.exit(0);
}

console.error(`lint-zh-guides: ${allIssues.length} issue(s)\n`);
for (const issue of allIssues) {
  const loc = issue.line ? `${issue.file}:${issue.line}` : issue.file;
  console.error(`  ${loc}  [${issue.kind}] ${issue.message}`);
}
process.exit(1);
