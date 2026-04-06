import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@slavyanka.ru' },
    update: {},
    create: {
      email: 'admin@slavyanka.ru',
      password: adminPassword,
      name: 'Администратор',
      role: 'admin',
    },
  });

  // Create categories
  const categories = [
    { name: 'Хлебобулочные', slug: 'bakery', description: 'Свежий хлеб, булки, лаваш — печём каждый день.', imageUrl: '/images/categories/category-bakery.png' },
    { name: 'Овощи', slug: 'vegetables', description: 'Сезонные овощи с местных грядок — без химии.', imageUrl: '/images/categories/category-vegetables.png' },
    { name: 'Фрукты', slug: 'fruits', description: 'Яблоки, груши, сливы — от соседей и фермеров.', imageUrl: '/images/categories/category-fruits.png' },
    { name: 'Молочка', slug: 'dairy', description: 'Молоко, творог, сметана — от проверенных хозяйств.', imageUrl: '/images/categories/category-dairy.png' },
    { name: 'Консервы и сухофрукты', slug: 'conserves', description: 'Рыба, огурцы, сушёные ягоды — на зиму и в дорогу.', imageUrl: '/images/categories/category-conserves.png' },
    { name: 'Домашнее', slug: 'homemade', description: 'Квашеная капуста, компоты, варенье — как у бабушки.', imageUrl: '/images/categories/category-homemade.png' },
    { name: 'Рекомендуемые', slug: 'featured', description: 'Товары на расхват — лучшие предложения.', imageUrl: '/images/categories/category-featured.png' },
  ];

  console.log('Создание категорий...');
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { imageUrl: category.imageUrl },
      create: category,
    });
    console.log(`Категория создана: ${category.name}`);
  }

  // Проверка что категории создались
  const allCategories = await prisma.category.findMany();
  console.log('Всего категорий в базе:', allCategories.length);
  if (allCategories.length === 0) {
    throw new Error('Категории не создались! Проверь seed.');
  }

  // Get categories for products
  const bakery = await prisma.category.findUnique({ where: { slug: 'bakery' } });
  const vegetables = await prisma.category.findUnique({ where: { slug: 'vegetables' } });
  const fruits = await prisma.category.findUnique({ where: { slug: 'fruits' } });
  const dairy = await prisma.category.findUnique({ where: { slug: 'dairy' } });
  const conserves = await prisma.category.findUnique({ where: { slug: 'conserves' } });
  const homemade = await prisma.category.findUnique({ where: { slug: 'homemade' } });
  const featured = await prisma.category.findUnique({ where: { slug: 'featured' } });

  // Create products
  if (bakery && vegetables && fruits && dairy && conserves && homemade && featured) {
    // Удаляем все существующие товары
    await prisma.product.deleteMany({});
    
    // Товары для главной страницы (рекомендуемые)
    const featuredProducts = [
      { name: 'Ветчина Империя вкуса из индейки', description: 'Нежная ветчина из индейки высшего качества', price: 187.99, weight: '400г', categoryId: featured.id, imageUrl: '/images/products/product-ham.png' },
      { name: 'Фасоль консервированная Бондюэль белая в томатном соусе', description: 'Консервированная фасоль в ароматном томатном соусе', price: 129.99, weight: '400г', categoryId: featured.id, imageUrl: '/images/products/product-beans.png' },
      { name: 'Корнишоны Дядя Ваня по-французски', description: 'Хрустящие корнишоны по традиционному французскому рецепту', price: 236.99, weight: '460г', categoryId: featured.id, imageUrl: '/images/products/product-gherkins.png' },
      { name: 'Молоко Му-у ультрапастеризованное 3.2% БЗМЖ', description: 'Свежее ультрапастеризованное молоко 3.2% жирности', price: 119.99, weight: '925мл', categoryId: featured.id, imageUrl: '/images/products/product-milk.png' },
      { name: 'Напиток Global Village Гранатовый сад сокосодержащий', description: 'Освежающий гранатовый напиток с натуральным соком', price: 134.90, weight: '1.93л', categoryId: featured.id, imageUrl: '/images/products/product-juice.png' },
      { name: 'Лосось Мурманск Inarctica охлажденный', description: 'Свежий охлажденный лосось из Мурманска', price: 1459, weight: '2-3 кг', categoryId: featured.id, imageUrl: '/images/products/product-salmon.png' },
      { name: 'Вода Borjomi минеральная природная лечебно-столовая газированная', description: 'Минеральная вода Borjomi с лечебными свойствами', price: 1138.80, weight: '500мл x 12 шт', categoryId: featured.id, imageUrl: '/images/products/product-water.png' },
      { name: 'Туалетная бумага Zewa Deluxe 3-слойная', description: 'Мягкая трехслойная туалетная бумага премиум качества', price: 499.99, weight: '12 рулонов', categoryId: featured.id, imageUrl: '/images/products/product-toilet-paper.png' },
      { name: 'Кофе Julius Meinl Президент классическая коллекция в зернах', description: 'Ароматный кофе в зернах классической обжарки', price: 2299, weight: '1кг', categoryId: featured.id, imageUrl: '/images/products/product-coffee.png' },
      { name: 'Шоколад молочный Alpen Gold с фундуком', description: 'Нежный молочный шоколад с цельным фундуком', price: 119, weight: '80г', categoryId: featured.id, imageUrl: '/images/products/product-chocolate.png' },
    ];
    
    // Товары для каталога
    const catalogProducts = [
      // Хлебобулочные
      { name: 'Хлеб белый нарезной', description: 'Свежий белый хлеб, идеален для бутербродов', price: 45.99, weight: '400г', categoryId: bakery.id, imageUrl: '/images/products/product-bread-white.svg' },
      { name: 'Хлеб ржаной бородинский', description: 'Ароматный ржаной хлеб по традиционному рецепту', price: 52.99, weight: '400г', categoryId: bakery.id, imageUrl: '/images/products/product-bread-rye.svg' },
      { name: 'Булочка с маком', description: 'Нежная булочка с маковой начинкой', price: 25.99, weight: '80г', categoryId: bakery.id, imageUrl: '/images/products/product-bun-poppy.svg' },
      { name: 'Лаваш армянский', description: 'Тонкий армянский лаваш, выпеченный в тандыре', price: 89.99, weight: '300г', categoryId: bakery.id, imageUrl: '/images/products/product-lavash.svg' },
      
      // Овощи
      { name: 'Помидоры красные', description: 'Спелые красные помидоры с грядки', price: 189.99, weight: '1кг', categoryId: vegetables.id, imageUrl: '/images/products/product-tomatoes.svg' },
      { name: 'Огурцы свежие', description: 'Хрустящие свежие огурцы', price: 129.99, weight: '1кг', categoryId: vegetables.id, imageUrl: '/images/products/product-cucumbers.svg' },
      { name: 'Картошка молодая', description: 'Молодая картошка с фермы', price: 69.99, weight: '1кг', categoryId: vegetables.id, imageUrl: '/images/products/product-potatoes.svg' },
      { name: 'Морковь столовая', description: 'Сладкая столовая морковь', price: 49.99, weight: '1кг', categoryId: vegetables.id, imageUrl: '/images/products/product-carrots.svg' },
      
      // Фрукты
      { name: 'Яблоки сезонные', description: 'Свежие сезонные яблоки местных садов', price: 159.99, weight: '1кг', categoryId: fruits.id, imageUrl: '/images/products/product-apples.svg' },
      { name: 'Груши спелые', description: 'Сладкие спелые груши', price: 199.99, weight: '1кг', categoryId: fruits.id, imageUrl: '/images/products/product-pears.svg' },
      { name: 'Бананы спелые', description: 'Спелые бананы из экватора', price: 89.99, weight: '1кг', categoryId: fruits.id, imageUrl: '/images/products/product-bananas.svg' },
      { name: 'Апельсины сочные', description: 'Сочные апельсины с витамином С', price: 179.99, weight: '1кг', categoryId: fruits.id, imageUrl: '/images/products/product-oranges.svg' },
      
      // Молочка (дополнительные)
      { name: 'Кефир 2.5%', description: 'Натуральный кефир 2.5% жирности', price: 89.99, weight: '900мл', categoryId: dairy.id, imageUrl: '/images/products/product-kefir.svg' },
      { name: 'Сметана 20%', description: 'Густая сметана 20% жирности', price: 129.99, weight: '300г', categoryId: dairy.id, imageUrl: '/images/products/product-sour-cream.svg' },
      { name: 'Творог 5%', description: 'Нежирный творог 5% жирности', price: 159.99, weight: '200г', categoryId: dairy.id, imageUrl: '/images/products/product-cottage-cheese.svg' },
      { name: 'Йогурт натуральный', description: 'Натуральный йогурт без добавок', price: 79.99, weight: '300г', categoryId: dairy.id, imageUrl: '/images/products/product-yogurt.svg' },
      
      // Консервы и сухофрукты (дополнительные)
      { name: 'Тунец консервированный', description: 'Консервированный тунец в собственном соку', price: 189.99, weight: '185г', categoryId: conserves.id, imageUrl: '/images/products/product-tuna.svg' },
      { name: 'Кукуруза консервированная', description: 'Сладкая консервированная кукуруза', price: 89.99, weight: '340г', categoryId: conserves.id, imageUrl: '/images/products/product-corn.svg' },
      { name: 'Изюм кишмиш', description: 'Сладкий изюм кишмиш без косточек', price: 299.99, weight: '200г', categoryId: conserves.id, imageUrl: '/images/products/product-raisins.svg' },
      { name: 'Курага', description: 'Сушеные абрикосы без косточек', price: 399.99, weight: '200г', categoryId: conserves.id, imageUrl: '/images/products/product-dried-apricots.svg' },
      
      // Домашнее
      { name: 'Квашеная капуста', description: 'Домашняя квашеная капуста по бабушкиному рецепту', price: 149.99, weight: '500г', categoryId: homemade.id, imageUrl: '/images/products/product-sauerkraut.svg' },
      { name: 'Компот яблочный', description: 'Натуральный яблочный компот', price: 129.99, weight: '1л', categoryId: homemade.id, imageUrl: '/images/products/product-apple-compote.svg' },
      { name: 'Варенье из клубники', description: 'Домашнее варенье из свежей клубники', price: 249.99, weight: '300г', categoryId: homemade.id, imageUrl: '/images/products/product-strawberry-jam.svg' },
      { name: 'Мед натуральный', description: 'Натуральный мед с пасеки', price: 599.99, weight: '250г', categoryId: homemade.id, imageUrl: '/images/products/product-honey.svg' },
    ];

    // Создаем все товары
    console.log('Создание товаров...');
    const allProducts = [...featuredProducts, ...catalogProducts];
    for (const product of allProducts) {
      await prisma.product.create({
        data: product,
      });
      console.log(`Товар создан: ${product.name}`);
    }

    // Проверка что товары создались
    const allProductsInDb = await prisma.product.findMany();
    console.log('Всего товаров в базе:', allProductsInDb.length);
    if (allProductsInDb.length === 0) {
      throw new Error('Товары не создались! Проверь seed.');
    }
  } else {
    console.error('Не удалось найти все категории!');
    throw new Error('Категории не найдены');
  }

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });