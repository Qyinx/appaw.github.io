import sharp from 'sharp';
import { readdirSync, statSync, mkdirSync, existsSync } from 'fs';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INPUT_DIR = join(__dirname, '../public/images');
const OUTPUT_DIR = join(__dirname, '../public/images-optimized');

// Image quality settings
const QUALITY = {
  jpeg: 90,
  webp: 90,
  png: 90,
};

// Max dimensions (maintain aspect ratio)
const MAX_WIDTH = 1000;
const MAX_HEIGHT = 1000;
const BACKGROUND_MAX_WIDTH = 1920;
const BACKGROUND_MAX_HEIGHT = 1080;

function getMaxDimensions(relativePath) {
  const normalized = relativePath.replace(/\\/g, '/');
  if (normalized.includes('/background/') || normalized.startsWith('background/')) {
    return { maxWidth: BACKGROUND_MAX_WIDTH, maxHeight: BACKGROUND_MAX_HEIGHT };
  }
  return { maxWidth: MAX_WIDTH, maxHeight: MAX_HEIGHT };
}

async function optimizeImage(inputPath, outputPath, relativePath) {
  const ext = extname(inputPath).toLowerCase();
  const { maxWidth, maxHeight } = getMaxDimensions(relativePath);
  
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Resize if larger than max dimensions
    if (metadata.width > maxWidth || metadata.height > maxHeight) {
      image.resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }
    
    // Optimize based on format
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        await image
          .jpeg({ quality: QUALITY.jpeg, progressive: true })
          .toFile(outputPath);
        break;
      case '.png':
        await image
          .png({ quality: QUALITY.png, compressionLevel: 9 })
          .toFile(outputPath);
        break;
      case '.webp':
        await image
          .webp({ quality: QUALITY.webp })
          .toFile(outputPath);
        break;
      default:
        // Copy other files as-is
        await image.toFile(outputPath);
    }
    
    const inputStats = statSync(inputPath);
    const outputStats = statSync(outputPath);
    const savedPercent = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);
    
    console.log(`✓ ${inputPath.replace(INPUT_DIR, '')}`);
    console.log(`  ${(inputStats.size / 1024).toFixed(1)}KB → ${(outputStats.size / 1024).toFixed(1)}KB (saved ${savedPercent}%)`);
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

console.log('🖼️  Starting image optimization...\n');
console.log(`Input: ${INPUT_DIR}`);
console.log(`Output: ${OUTPUT_DIR}\n`);

await processDirectory(INPUT_DIR, OUTPUT_DIR);

console.log('\n✅ Image optimization complete!');
console.log(`\nOptimized images saved to: ${OUTPUT_DIR}`);
console.log('\nNext steps:');
console.log('1. Review the optimized images');
console.log('2. If satisfied, replace public/images with public/images-optimized');
console.log('3. Or update your imports to use images-optimized folder');
