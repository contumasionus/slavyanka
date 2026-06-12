const { PrismaClient } = require('@prisma/client');
const path = require('path');
process.env.DATABASE_URL = 'file:' + path.resolve(__dirname, '../apps/backend/prisma/dev.db');
const prisma = new PrismaClient();

async function main() {
  const product = await prisma.product.findUnique({ where: { id: 'seed-bun-poppy' } });
  if (product) {
    console.log(`Найден товар: ${product.name}`);
    await prisma.product.delete({ where: { id: 'seed-bun-poppy' } });
    console.log('Товар удалён из базы данных');
  } else {
    console.log('Товар не найден в базе — возможно уже удалён');
  }
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });