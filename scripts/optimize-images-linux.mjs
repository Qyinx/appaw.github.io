#!/usr/bin/env node
import sharp from 'sharp';
import { readdirSync, statSync, mkdirSync, existsSync } from 'fs';
import { join, extname, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use a separate output folder to avoid clobbering the original images
const INPUT_DIR = join(__dirname, '../public/images');
const OUTPUT_DIR = join(__dirname, '../public/images-optimized');

// Linux-optimized defaults
const QUALITY = {
  jpeg: 85,
  webp: 85,
  png: 90,
};

// Max dimensions (maintain aspect ratio)
const MAX_WIDTH = 1400;
const MAX_HEIGHT = 1400;

// Tune concurrency to make use of available CPUs on Linux systems
sharp.concurrency(Math.max(1, os.cpus().length - 1));
sharp.cache({ items: 100 });

let filesProcessed = 0;
let totalSaved = 0;

async function optimizeImage(inputPath, outputPath) {
  const ext = extname(inputPath).toLowerCase();

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Resize if larger than max dimensions
    if (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT) {
      image.resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Ensure output dir exists
    const outDir = dirname(outputPath);
    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

    // Optimize based on format (Linux-tuned options)
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
        await image
          .webp({ quality: QUALITY.webp, nearLossless: false })
          .toFile(outputPath);
        break;
      default:
        // For other types, write as-is (sharp will convert internally)
        await image.toFile(outputPath);
    }

    const inputStats = statSync(inputPath);
    const outputStats = statSync(outputPath);
    const saved = inputStats.size - outputStats.size;
    const savedPercent = inputStats.size > 0 ? ((saved / inputStats.size) * 100).toFixed(1) : '0.0';

    filesProcessed += 1;
    totalSaved += Math.max(0, saved);

    console.log(`✓ ${basename(inputPath)} — ${(inputStats.size / 1024).toFixed(1)}KB → ${(outputStats.size / 1024).toFixed(1)}KB (saved ${savedPercent}%)`);
  } catch (error) {
    console.error(`✗ Error processing ${inputPath}:`, error.message);
  }
}

async function processDirectory(inputDir, outputDir) {
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const items = readdirSync(inputDir);

  for (const item of items) {
    const inputPath = join(inputDir, item);
    const outputPath = join(outputDir, item);
    const stats = statSync(inputPath);

    if (stats.isDirectory()) {
      await processDirectory(inputPath, outputPath);
    } else if (stats.isFile()) {
      const ext = extname(item).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        await optimizeImage(inputPath, outputPath);
      }
    }
  }
}

console.log('🖼️  Starting Linux-optimized image optimization...\n');
console.log(`Input: ${INPUT_DIR}`);
console.log(`Output: ${OUTPUT_DIR}\n`);

await processDirectory(INPUT_DIR, OUTPUT_DIR);

console.log('\n✅ Image optimization complete!');
console.log(`Files processed: ${filesProcessed}`);
console.log(`Total saved: ${(totalSaved / 1024).toFixed(1)} KB`);
console.log(`\nOptimized images saved to: ${OUTPUT_DIR}`);
console.log('\nNext steps:');
console.log('1. Review the optimized images');
console.log('2. If satisfied, replace `public/images` with `public/images-optimized` or update your imports');
