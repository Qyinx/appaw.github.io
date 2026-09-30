import sharp from 'sharp';
import { readdirSync, statSync, mkdirSync, existsSync } from 'fs';
import { join, extname, dirname, parse } from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INPUT_DIR = join(__dirname, '../public/images');
const OUTPUT_DIR = join(__dirname, '../public/images-optimized');

const QUALITY = {
  jpeg: 85,
  webp: 72,
  webpBackground: 70,
  webpHero: 70,
  png: 85,
};

const MAX_WIDTH = 1000;
const MAX_HEIGHT = 1000;
const HERO_COLOR_MAX = 480;
const LOGO_MAX = 96;
const BACKGROUND_MAX_WIDTH = 1600;
const BACKGROUND_MAX_HEIGHT = 900;

function keepOriginalFormat(relativePath) {
  const normalized = relativePath.replace(/\\/g, '/');
  if (normalized.includes('/og/') || normalized.startsWith('og/')) return true;
  if (normalized === 'logo.png' || normalized === 'og-image.png') return true;
  return false;
}

function getMaxDimensions(relativePath) {
  const normalized = relativePath.replace(/\\/g, '/');
  if (normalized === 'logo.png' || normalized.endsWith('/logo.png')) {
    return { maxWidth: LOGO_MAX, maxHeight: LOGO_MAX };
  }
  if (normalized.includes('/background/') || normalized.startsWith('background/')) {
    return { maxWidth: BACKGROUND_MAX_WIDTH, maxHeight: BACKGROUND_MAX_HEIGHT };
  }
  if (normalized.includes('/og/') || normalized.startsWith('og/')) {
    return { maxWidth: 1200, maxHeight: 630 };
  }
  if (
    normalized.includes('/describe/color/') ||
    normalized.startsWith('describe/color/')
  ) {
    return { maxWidth: HERO_COLOR_MAX, maxHeight: HERO_COLOR_MAX };
  }
  return { maxWidth: MAX_WIDTH, maxHeight: MAX_HEIGHT };
}

function webpQualityFor(relativePath) {
  const normalized = relativePath.replace(/\\/g, '/');
  if (normalized.includes('/background/') || normalized.startsWith('background/')) {
    return QUALITY.webpBackground;
  }
  if (
    normalized.includes('/describe/color/') ||
    normalized.startsWith('describe/color/')
  ) {
    return QUALITY.webpHero;
  }
  return QUALITY.webp;
}

sharp.concurrency(Math.max(1, os.cpus().length - 1));
sharp.cache({ items: 100 });

function resizedPipeline(inputPath, maxWidth, maxHeight) {
  return sharp(inputPath)
    .metadata()
    .then((metadata) => {
      let image = sharp(inputPath);
      if (metadata.width > maxWidth || metadata.height > maxHeight) {
        image = image.resize(maxWidth, maxHeight, {
          fit: 'inside',
          withoutEnlargement: true,
        });
      }
      return image;
    });
}

async function writeOptimizedOriginal(image, ext, outputPath) {
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      await image
        .jpeg({ quality: QUALITY.jpeg, progressive: true, mozjpeg: true })
        .toFile(outputPath);
      break;
    case '.png':
      await image
        .png({ quality: QUALITY.png, compressionLevel: 9, adaptiveFiltering: true })
        .toFile(outputPath);
      break;
    case '.webp':
      await image.webp({ quality: QUALITY.webp }).toFile(outputPath);
      break;
    default:
      await image.toFile(outputPath);
  }
}

async function optimizeImage(inputPath, outputPath, relativePath) {
  const ext = extname(inputPath).toLowerCase();
  const { maxWidth, maxHeight } = getMaxDimensions(relativePath);
  const outDir = dirname(outputPath);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  try {
    const inputStats = statSync(inputPath);
    const parsed = parse(outputPath);
    const webpPath = join(parsed.dir, `${parsed.name}.webp`);
    const normalized = relativePath.replace(/\\/g, '/');
    const isLogo = normalized === 'logo.png' || normalized.endsWith('/logo.png');

    const webpMax = isLogo ? LOGO_MAX : maxWidth;
    const webpImage = await resizedPipeline(inputPath, webpMax, webpMax);
    await webpImage
      .webp({ quality: webpQualityFor(relativePath) })
      .toFile(webpPath);

    const webpStats = statSync(webpPath);
    console.log(`✓ ${inputPath.replace(INPUT_DIR, '')} → webp`);
    console.log(
      `  ${(inputStats.size / 1024).toFixed(1)}KB → ${(webpStats.size / 1024).toFixed(1)}KB WebP`,
    );

    if (keepOriginalFormat(relativePath) || ext !== '.webp') {
      const origMax = isLogo ? 512 : maxWidth;
      const origMaxH = isLogo ? 512 : maxHeight;
      const originalImage = await resizedPipeline(inputPath, origMax, origMaxH);
      await writeOptimizedOriginal(originalImage, ext, outputPath);
      if (existsSync(outputPath) && outputPath !== webpPath) {
        const outStats = statSync(outputPath);
        console.log(
          `  + ${ext.slice(1)} ${(outStats.size / 1024).toFixed(1)}KB (compat)`,
        );
      }
    }
  } catch (error) {
    console.error(`✗ Error processing ${inputPath}:`, error.message);
  }
}

async function processDirectory(inputDir, outputDir, relativeDir = '') {
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const items = readdirSync(inputDir);

  for (const item of items) {
    const inputPath = join(inputDir, item);
    const outputPath = join(outputDir, item);
    const stats = statSync(inputPath);
    const relativePath = join(relativeDir, item);

    if (stats.isDirectory()) {
      await processDirectory(inputPath, outputPath, relativePath);
    } else if (stats.isFile()) {
      const ext = extname(item).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        await optimizeImage(inputPath, outputPath, relativePath);
      }
    }
  }
}

async function generateOgImage() {
  const logoPath = join(INPUT_DIR, 'logo.png');
  const ogPath = join(INPUT_DIR, 'og-image.png');

  if (!existsSync(logoPath)) {
    console.log('⚠ logo.png missing — skipping og-image.png generation');
    return;
  }

  await sharp(logoPath)
    .resize(480, 480, { fit: 'contain', background: { r: 250, g: 250, b: 248, alpha: 1 } })
    .extend({ top: 75, bottom: 75, left: 360, right: 360, background: { r: 250, g: 250, b: 248, alpha: 1 } })
    .png({ compressionLevel: 9 })
    .toFile(ogPath);

  console.log('✓ Generated og-image.png (1200×630) from logo.png');
}

console.log('🖼️  Starting image optimization (linux)...\n');
console.log(`Input: ${INPUT_DIR}`);
console.log(`Output: ${OUTPUT_DIR}\n`);

await generateOgImage();
await processDirectory(INPUT_DIR, OUTPUT_DIR);

console.log('\n✅ Image optimization complete!');
