const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const discountUntil = new Date('2026-06-30T23:59:59Z');

  // Выбираем товары из разных категорий
  const updates = [
    // 1. Хлебобулочные — хлеб ржаной 68р -> 49р (-28%)
    { id: 'seed-bread-rye', discountPrice: 49, isPromo: true },
    // 2. Молочка — творог 145р -> 119р (-18%)
    { id: 'seed-cottage-cheese', discountPrice: 119, isPromo: true },
    // 3. Овощи — помидоры сливовидные 159р -> 129р (-19%)
    { id: 'seed-tomatoes', discountPrice: 129, isPromo: true },
    // 4. Сладости — шоколад горький 149р -> 119р (-20%)
    { id: 'seed-chocolate-dark', discountPrice: 119, isPromo: true },
    // 5. Напитки — кофе зерновой 390р -> 299р (-23%)
    { id: 'seed-coffee', discountPrice: 299, isPromo: true },
    // 6. Домашнее — грибы белые сушёные 299р -> 239р (-20%)
    { id: 'seed-mushrooms-dried', discountPrice: 239, isPromo: true },
    // 7. Консервы — мёд цветочный 249р -> 199р (-20%)
    { id: 'seed-honey', discountPrice: 199, isPromo: true },
    // 8. Товары для дома — салфетки универсальные 89р -> 69р (-22%)
    { id: 'seed-wipes', discountPrice: 69, isPromo: true },
  ];

  for (const u of updates) {
    const product = await prisma.product.update({
      where: { id: u.id },
      data: {
        discountPrice: u.discountPrice,
        discountUntil,
        isPromo: u.isPromo,
      },
    });
    console.log(`✓ ${product.name}: ${product.price}р -> ${product.discountPrice}р (скидка)`);
  }

  console.log('\n✅ Все товары обновлены!');
  console.log('Теперь на странице /promo будут отображаться эти товары.');
  console.log('А в каталоге и везде они будут со скидкой.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());