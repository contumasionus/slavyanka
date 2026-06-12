const { PrismaClient } = require('@prisma/client');
const path = require('path');
process.chdir(path.join(__dirname, 'apps', 'backend'));
const prisma = new PrismaClient();

// Frontend seed-products.ts uses these seed category IDs
// We need to identify which products came from which seed category
const seedCatIdToSlug = {
  'cat-bakery': 'bakery',
  'cat-dairy': 'dairy',
  'cat-vegetables': 'vegetables',
  'cat-conserves': 'conserves',
  'cat-sweets': 'sweets',    // Will be created
  'cat-drinks': 'drinks',    // Will be created
  'cat-homemade': 'homemade',
  'cat-household': 'household',
};

// Seed product IDs for sweets and drinks that need to be moved
const sweetsSeedIds = [
  'seed-chocolate', 'seed-chocolate-dark', 'seed-strawberry-jam',
  'seed-cookies-oatmeal', 'seed-cookies-sugar', 'seed-waffles', 'seed-marmalade'
];

const drinksSeedIds = [
  'seed-juice', 'seed-juice-multifruit', 'seed-coffee', 'seed-coffee-ground',
  'seed-water', 'seed-water-sparkling'
];

async function main() {
  console.log('=== ТЕКУЩЕЕ СОСТОЯНИЕ ===');
  
  const cats = await prisma.category.findMany();
  console.log(`Категорий: ${cats.length}`);
  
  // 1. Create new categories
  console.log('\n=== ДОБАВЛЕНИЕ НОВЫХ КАТЕГОРИЙ ===');
  
  const newCategories = [
    { 
      name: 'Сладости', 
      slug: 'sweets', 
      description: 'Конфеты, печенье, мёд, варенье и домашняя выпечка',
      imageUrl: null,
    },
    { 
      name: 'Напитки', 
      slug: 'drinks', 
      description: 'Соки, вода, чай, кофе и прохладительные напитки',
      imageUrl: null,
    },
  ];
  
  const createdCats = [];
  for (const cat of newCategories) {
    const existing = cats.find(c => c.slug === cat.slug);
    if (existing) {
      console.log(`  УЖЕ СУЩЕСТВУЕТ: ${cat.name} (${cat.slug})`);
      createdCats.push(existing);
    } else {
      const created = await prisma.category.create({ data: cat });
      console.log(`  СОЗДАНА: ${created.name} (${created.slug}) - id: ${created.id}`);
      createdCats.push(created);
    }
  }
  
  // 2. Move sweets products from conserves to sweets
  console.log('\n=== ПЕРЕНОС ТОВАРОВ ===');
  
  const sweetsCat = createdCats.find(c => c.slug === 'sweets');
  const drinksCat = createdCats.find(c => c.slug === 'drinks');
  const conservesCat = cats.find(c => c.slug === 'conserves');
  
  // Move sweets
  if (sweetsCat && conservesCat) {
    const movedSweets = await prisma.product.updateMany({
      where: { id: { in: sweetsSeedIds }, categoryId: conservesCat.id },
      data: { categoryId: sweetsCat.id },
    });
    console.log(`  Перемещено сладостей: ${movedSweets.count}`);
    
    // Show what was moved
    const sweetsProducts = await prisma.product.findMany({
      where: { id: { in: sweetsSeedIds } },
    });
    console.log('  Товары в категории "Сладости":');
    for (const p of sweetsProducts) {
      console.log(`    - ${p.name}`);
    }
  }
  
  // Move drinks
  if (drinksCat && conservesCat) {
    const movedDrinks = await prisma.product.updateMany({
      where: { id: { in: drinksSeedIds }, categoryId: conservesCat.id },
      data: { categoryId: drinksCat.id },
    });
    console.log(`  Перемещено напитков: ${movedDrinks.count}`);
    
    const drinksProducts = await prisma.product.findMany({
      where: { id: { in: drinksSeedIds } },
    });
    console.log('  Товары в категории "Напитки":');
    for (const p of drinksProducts) {
      console.log(`    - ${p.name}`);
    }
  }
  
  // 3. Show final state
  console.log('\n=== ИТОГОВОЕ СОСТОЯНИЕ ===');
  const allCats = await prisma.category.findMany();
  console.log(`Категорий: ${allCats.length}`);
  for (const c of allCats) {
    const count = await prisma.product.count({ where: { categoryId: c.id } });
    console.log(`  ${c.slug}: ${count} товаров`);
  }
  
  const total = await prisma.product.count();
  console.log(`\nВсего товаров: ${total}`);
  
  await prisma.$disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });