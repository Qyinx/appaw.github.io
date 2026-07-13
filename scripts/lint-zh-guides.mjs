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

const REGISTER = [
  { pattern: /雖(已|進步|封|可|有)/, label: '書面語：雖X → 雖然X' },
  { pattern: /(?<!請|切)勿(用|平放|以|信任|單)/, label: '書面語：勿… → 請勿…' },
  { pattern: /定期再生/, label: '用語：定期再生 → 定期再更換' },
  { pattern: /追卡/, label: '口語：追卡 → 重點收藏的卡牌/重點單張' },
];

const ABBREV = [
  { pattern: /勿等(?!待)/, label: '縮略：勿等 → 請勿等待' },
  { pattern: /白付費用|費用白付/, label: '縮略：白付費用 → 白白付出成本' },
  { pattern: /面交交卡/, label: '縮略：面交交卡 → 面交評估卡況及提交' },
  { pattern: /盲目送鑑/, label: '縮略：盲目送鑑 → 未完成置中評估前提交鑑定' },
  { pattern: /不稀奇/, label: '口語：不稀奇 → 並不罕見' },
  { pattern: /一併損失/, label: '縮略：一併損失 → 一併蒙受損失' },
  { pattern: /付送鑑費/, label: '縮略：付送鑑費 → 支付鑑定費用' },
  { pattern: /(?<!代)送鑑(?!定)/, label: '縮略：送鑑 → 提交鑑定（服務名 代送鑑定 除外）' },
];

const MARKETING = [
  { pattern: /展館級|媲美藝廊|完美結合|市面上最強/, label: '宣傳用語：改為具體規格' },
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

function extractI18nBlock(source, key) {
  const start = source.indexOf(`${key}:`);
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

function lintI18nBlock(key) {
  const file = path.relative(root, zhI18nPath);
  const source = readFileSync(zhI18nPath, 'utf8');
  const block = extractI18nBlock(source, key);
  if (!block) {
    return [{ file, line: 0, kind: 'missing', message: `${key} block not found in zh.ts` }];
  }
  return lintSource(block, file);
}

function lintCenteringPage() {
  return lintI18nBlock('centeringPage');
}

function lintPsaGradingPage() {
  return lintI18nBlock('psaGradingPage');
}

function lintPsaProtectorOverview() {
  const file = path.relative(root, zhI18nPath);
  const source = readFileSync(zhI18nPath, 'utf8');
  const match = source.match(/overview:\s*\{[\s\S]*?body:\s*\[([\s\S]*?)\],/);
  if (!match) return [];
  return lintSource(match[0], file);
}

function lintSource(source, file) {
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

  for (const rule of [...COLLOQUIAL, ...TERMINOLOGY, ...ABBREV, ...MARKETING, ...REGISTER]) {
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

const allIssues = [
  ...files.flatMap(lintFile),
  ...lintCenteringPage(),
  ...lintPsaGradingPage(),
  ...lintPsaProtectorOverview(),
];

if (!allIssues.length) {
  console.log(`lint-zh-guides: OK (${files.length} guide files + zh.ts blocks)`);
  process.exit(0);
}

console.error(`lint-zh-guides: ${allIssues.length} issue(s)\n`);
for (const issue of allIssues) {
  const loc = issue.line ? `${issue.file}:${issue.line}` : issue.file;
  console.error(`  ${loc}  [${issue.kind}] ${issue.message}`);
}
process.exit(1);
