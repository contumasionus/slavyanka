const { PrismaClient } = require('@prisma/client');
const path = require('path');
process.chdir(path.join(__dirname, 'apps', 'backend'));
const prisma = new PrismaClient();

async function main() {
  // 1. Все категории
  const cats = await prisma.category.findMany();
  console.log('=== КАТЕГОРИИ ===');
  console.log(`Всего: ${cats.length}`);
  for (const c of cats) {
    const count = await prisma.product.count({ where: { categoryId: c.id } });
    console.log(`  ${c.slug} (${c.id}): ${count} товаров`);
  }
  
  // 2. Товары без категории
  const allCatIds = cats.map(c => c.id);
  const productsNoCat = await prisma.product.findMany({
    where: { NOT: { categoryId: { in: allCatIds } } },
    include: { category: true },
  });
  console.log(`\n=== ТОВАРЫ БЕЗ КАТЕГОРИИ (categoryId не найден) ===`);
  console.log(`Всего: ${productsNoCat.length}`);
  for (const p of productsNoCat) {
    console.log(`  ${p.id} - ${p.name} (categoryId: ${p.categoryId})`);
  }
  
  // 3. Все продукты по категориям seed
  const seedCatCounts = await prisma.product.groupBy({
    by: ['categoryId'],
    _count: { id: true },
  });
  console.log(`\n=== ВСЕ ТОВАРЫ ПО ID КАТЕГОРИЙ ===`);
  for (const g of seedCatCounts) {
    const cat = cats.find(c => c.id === g.categoryId);
    console.log(`  ${g.categoryId} (${cat ? cat.slug : 'UNKNOWN'}): ${g._count.id} товаров`);
  }
  
  await prisma.$disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });