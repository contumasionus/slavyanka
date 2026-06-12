import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const PRODUCTS_DIR = path.resolve(__dirname, '../apps/frontend/public/products');
const UPLOADS_DIR = path.resolve(__dirname, '../apps/frontend/public/images/uploads');
const SEED_IMAGES_DIR = path.resolve(__dirname, '../apps/frontend/public/images/products');

async function main() {
  // Ensure target dir exists
  if (!fs.existsSync(PRODUCTS_DIR)) {
    fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
  }

  const products = await prisma.product.findMany({
    where: { imageUrl: { not: null } },
    select: { id: true, imageUrl: true, name: true },
  });

  console.log(`Found ${products.length} products with images\n`);

  let exported = 0;
  let skipped = 0;
  let errors = 0;

  for (const product of products) {
    const image = product.imageUrl!;
    const ext = image.startsWith('data:image/png') ? '.png'
      : image.startsWith('data:image/jpeg') || image.startsWith('data:image/jpg') ? '.jpg'
      : image.startsWith('data:image/gif') ? '.gif'
      : image.startsWith('data:image/webp') ? '.webp'
      : image.startsWith('data:image/svg') ? '.svg'
      : path.extname(image) || '.jpg';

    const filename = `product-${product.id}${ext}`;
    const targetPath = path.join(PRODUCTS_DIR, filename);
    const targetUrl = `/products/${filename}`;

    // Skip if already exported
    if (fs.existsSync(targetPath)) {
      console.log(`  SKIP  ${product.name} — already exists at ${targetUrl}`);
      skipped++;
      // Still update DB if path is not the new one
      if (image !== targetUrl) {
        await prisma.product.update({
          where: { id: product.id },
          data: { imageUrl: targetUrl },
        });
        console.log(`  DB    ${product.name} — path updated to ${targetUrl}`);
      }
      continue;
    }

    try {
      if (image.startsWith('data:image/')) {
        // Base64 decode
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        fs.writeFileSync(targetPath, buffer);
        console.log(`  OK    ${product.name} — exported base64 → ${targetUrl} (${buffer.length} bytes)`);
      } else if (image.startsWith('http://') || image.startsWith('https://')) {
        // Download remote file (skip — we can't reliably download)
        console.log(`  SKIP  ${product.name} — remote URL, skipping download: ${image.slice(0, 80)}`);
        skipped++;
        continue;
      } else {
        // Relative path — try to copy from existing files
        const possibleSources = [
          path.resolve(__dirname, '..', image.replace(/^\//, '')),  // from project root
          path.join(SEED_IMAGES_DIR, path.basename(image)),
          path.join(UPLOADS_DIR, path.basename(image)),
          path.join(PRODUCTS_DIR, path.basename(image)),
        ];

        let copied = false;
        for (const src of possibleSources) {
          if (fs.existsSync(src)) {
            fs.copyFileSync(src, targetPath);
            console.log(`  OK    ${product.name} — copied ${path.relative(path.resolve(__dirname, '..'), src)} → ${targetUrl}`);
            copied = true;
            break;
          }
        }

        if (!copied) {
          console.log(`  WARN  ${product.name} — source not found for: ${image}`);
          const fallbackSrc = path.join(SEED_IMAGES_DIR, 'placeholder.svg');
          if (fs.existsSync(fallbackSrc)) {
            fs.copyFileSync(fallbackSrc, targetPath);
            console.log(`  FALLBACK used for ${product.name}`);
          }
        }
      }

      // Update DB
      await prisma.product.update({
        where: { id: product.id },
        data: { imageUrl: targetUrl },
      });
      console.log(`  DB    ${product.name} — imageUrl set to ${targetUrl}`);
      exported++;
    } catch (err: any) {
      console.error(`  ERROR ${product.name}: ${err.message}`);
      errors++;
    }

    console.log('');
  }

  console.log('='.repeat(60));
  console.log(`Exported: ${exported}`);
  console.log(`Skipped:  ${skipped}`);
  console.log(`Errors:   ${errors}`);
  console.log('='.repeat(60));

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});