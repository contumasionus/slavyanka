<template>
  <div class="catalog-page">
    <!-- Hero баннер -->
    <section class="catalog-hero">
      <div class="catalog-hero__bg">
        <img src="/images/catalog-bg.jpg" alt="" class="catalog-hero__bg-img">
        <div class="catalog-hero__overlay"></div>
        <div class="catalog-hero__gradient"></div>
        <div class="catalog-hero__particles" aria-hidden="true">
          <span class="particle particle--1">🛒</span>
          <span class="particle particle--2">🥖</span>
          <span class="particle particle--3">🌾</span>
          <span class="particle particle--4">✨</span>
          <span class="particle particle--5">🥛</span>
          <span class="particle particle--6">⭐</span>
        </div>
      </div>
      <div class="container">
        <div class="catalog-hero__content">
          <h1 class="catalog-hero__title">Каталог товаров</h1>
          <p class="catalog-hero__subtitle">Выберите категорию и найдите всё, что нужно — от свежей выпечки до товаров для дома</p>
          <div class="catalog-hero__breadcrumbs">
            <router-link to="/" class="breadcrumb-link">Главная</router-link>
            <span class="breadcrumb-sep">/</span>
            <span class="breadcrumb-current">Каталог</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Баннер получения промокода -->
    <PromoCodeBanner />

    <!-- Основной контент: сайдбар категорий + товары -->
    <div class="catalog-layout">
      <!-- Сайдбар категорий -->
      <aside class="catalog-sidebar">
        <div class="sidebar-inner">
          <h3 class="sidebar-title">Категории</h3>
          <nav class="sidebar-nav">
            <button
              class="sidebar-item"
              :class="{ active: selectedCategory === null && categoryProducts.length > 0 }"
              @click="showAllProducts"
            >
              <span class="sidebar-item__icon">🛒</span>
              <span class="sidebar-item__name">Все товары</span>
            </button>
            <button
              v-for="cat in sortedCategories"
              :key="cat.id"
              class="sidebar-item"
              :class="{ active: selectedCategory?.id === cat.id }"
              @click="toggleCategory(cat)"
            >
              <span class="sidebar-item__icon">{{ getCategoryEmoji(cat.slug) }}</span>
              <span class="sidebar-item__name">{{ cat.name }}</span>
            </button>
          </nav>
        </div>
      </aside>

      <!-- Товары -->
      <main class="catalog-main" ref="productsSection">
        <div v-if="categoryProducts.length > 0" class="section section--products">
          <div class="category-header">
            <div class="category-header__info">
              <h2 class="category-title">{{ selectedCategory ? selectedCategory.name : 'Все товары' }}</h2>
            </div>
            <div class="category-header__count">
              <span class="count-badge">{{ sortedProducts.length }} товаров</span>
            </div>
          </div>

          <div class="toolbar">
            <div class="search-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input v-model="searchQuery" type="text" placeholder="Поиск товаров..." class="search-input">
              <button v-if="searchQuery" @click="searchQuery = ''" class="search-clear">✕</button>
            </div>
            <div class="sort-btns">
              <span class="sort-label">Сортировка:</span>
              <button @click="toggleSort('price')" class="sort-btn" :class="{ active: sortBy === 'price' }">
                По цене {{ sortBy === 'price' ? (sortAsc ? '↑' : '↓') : '' }}
              </button>
              <button @click="toggleSort('name')" class="sort-btn" :class="{ active: sortBy === 'name' }">
                По алфавиту {{ sortBy === 'name' ? (sortAsc ? 'А-Я' : 'Я-А') : '' }}
              </button>
            </div>
          </div>

          <div v-if="sortedProducts.length === 0" class="empty-state">
            <span class="empty-state__icon">🔍</span>
            <h3>Ничего не найдено</h3>
            <p>Попробуйте изменить поисковый запрос</p>
            <button @click="searchQuery = ''" class="btn btn--surface">Сбросить поиск</button>
          </div>

          <div v-else class="products-grid">
            <ProductCard
              v-for="product in sortedProducts"
              :key="product.id"
              :product="product"
              @open-modal="openModal"
            />
          </div>
        </div>
      </main>
    </div>

    <ProductModal :product="selectedProduct" :is-open="isModalOpen" @close="closeModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ProductCard from '../components/product/ProductCard.vue';
import ProductModal from '../components/product/ProductModal.vue';
import PromoCodeBanner from '../components/promo/PromoCodeBanner.vue';
import { productsApi } from '../api/products.api';
import { categoriesApi } from '../api/categories.api';
import { seedCategories, seedProducts } from '../data/seed-products';

interface Product {
  id: string; name: string; price: number; weight?: string; imageUrl?: string;
  inStock: boolean; description?: string; categoryId: string; deliveryDate?: string;
  discountPrice?: number; discountUntil?: string; isPromo?: boolean;
  avgRating?: number; reviewCount?: number;
}
interface Category {
  id: string; name: string; slug: string; description?: string; imageUrl?: string;
}

const route = useRoute();
const router = useRouter();

const categories = ref<Category[]>([]);
const selectedCategory = ref<Category | null>(null);
const categoryProducts = ref<Product[]>([]);
const searchQuery = ref('');
const sortBy = ref<'price' | 'name' | ''>('');
const sortAsc = ref(true);
const selectedProduct = ref<Product | null>(null);
const isModalOpen = ref(false);
const productsSection = ref<HTMLElement | null>(null);

// Порядок категорий как в макете
const categoryOrder: Record<string, number> = {
  'homemade': 1,
  'conserves': 2,
  'dairy': 3,
  'drinks': 4,
  'vegetables': 5,
  'sweets': 6,
  'household': 7,
  'fruits': 8,
  'bakery': 9,
};

const sortedCategories = computed(() => {
  return [...categories.value].sort((a, b) => {
    const orderA = categoryOrder[a.slug] ?? 99;
    const orderB = categoryOrder[b.slug] ?? 99;
    return orderA - orderB;
  });
});

// Маппинг slug -> seed categoryId
const slugToSeedCatId: Record<string, string> = {
  'bakery': 'cat-bakery',
  'dairy': 'cat-dairy',
  'vegetables': 'cat-vegetables',
  'fruits': 'cat-vegetables', // Фрукты в seed лежат в vegetables
  'conserves': 'cat-conserves',
  'homemade': 'cat-homemade',
  'sweets': 'cat-sweets',
  'drinks': 'cat-drinks',
  'household': 'cat-household',
};

const categoryEmojis: Record<string, string> = {
  'bakery': '🥖', 'dairy': '🥛', 'vegetables': '🥕', 'fruits': '🍎',
  'conserves': '🥫', 'homemade': '🥒', 'sweets': '🍬', 'drinks': '🥤', 'featured': '⭐', 'household': '🏠',
};

function getCategoryEmoji(slug: string): string {
  return categoryEmojis[slug] || '🛒';
}

const sortedProducts = computed(() => {
  let result = [...categoryProducts.value];
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(q));
  }
  if (sortBy.value === 'price') {
    result.sort((a, b) => sortAsc.value ? a.price - b.price : b.price - a.price);
  } else if (sortBy.value === 'name') {
    result.sort((a, b) => {
      const cmp = a.name.localeCompare(b.name, 'ru');
      return sortAsc.value ? cmp : -cmp;
    });
  }
  return result;
});

function toggleSort(f: 'price' | 'name') {
  if (sortBy.value === f) { sortAsc.value = !sortAsc.value; }
  else { sortBy.value = f; sortAsc.value = true; }
}

function openModal(p: Product) { selectedProduct.value = p; isModalOpen.value = true; }
function closeModal() { isModalOpen.value = false; selectedProduct.value = null; }

// Расширенные описания для API-товаров
const longDescriptions: Record<string, string> = {
  'alpen': 'Нежный молочный шоколад Alpen Gold с цельным фундуком — это изысканное лакомство, которое дарит moments истинного удовольствия. Кусочки хрустящего ореха в сочетании с тающей молочной текстурой создают неповторимый вкус. Идеально подходит для перекуса, поднятия настроения и угощения гостей. Богат антиоксидантами и кальцием.',
  'meinl': 'Кофе Julius Meinl Президент классическая коллекция в зернах — это венская классика высочайшего качества. Тщательно отобранные зерна арабики проходят бережную обжарку, раскрывающую богатый букет с шоколадными и ореховыми нотами. Идеален для приготовления эспрессо, капучино и френч-пресса. Насыщенный аромат и бархатистый вкус с легкой фруктовой кислинкой.',
  'zewa': 'Туалетная бумага Zewa Deluxe 3-слойная — это премиальная мягкость и надежность для всей семьи. Три нежных слоя обеспечивают прочность и комфорт при использовании. Деликатная текстура бережно заботится о коже. Разработана специально для тех, кто ценит качество и комфорт в повседневной жизни.',
  'borjomi': 'Минеральная вода Borjomi природная лечебно-столовая газированная — уникальная вода из грузинского источника с многовековой историей. Естественная минерализация и природное насыщение углекислым газом придают ей неповторимый вкус. Благодаря богатому минеральному составу способствует улучшению пищеварения и обмена веществ.',
  'inarctica': 'Лосось Мурманск Inarctica охлажденный — это свежайшая рыба премиум-качества, выращенная в чистых водах Баренцева моря. Нежное мясо с характерным розовым цветом и тонким вкусом. Богато омега-3 жирными кислотами и легкоусвояемым белком. Идеален для запекания, жарки, приготовления стейков и салатов.',
  'global': 'Напиток Global Village Гранатовый сад сокосодержащий — освежающий напиток из натурального гранатового сока высшего качества. Обладает богатым терпким вкусом с легкой сладостью и характерной гранатовой кислинкой. Богат антиоксидантами и витамином C. Идеально подходит для укрепления иммунитета и утоления жажды.',
  'му-у': 'Молоко Му-у ультрапастеризованное 3.2% БЗМЖ — это свежее молоко высшего качества, произведенное по современной технологии ультрапастеризации. Без добавления сухого молока и консервантов. Имеет насыщенный сливочный вкус и оптимальную жирность. Идеально для каш, кофе, какао и приготовления десертов.',
  'дядя': 'Корнишоны Дядя Ваня по-французски — это хрустящие маринованные огурчики, приготовленные по традиционному французскому рецепту. Небольшие упругие плоды в ароматном маринаде с пряностями. Идеальная закуска к мясным блюдам, дополнение к бутербродам и основа для салатов. Без искусственных красителей.',
  'бондюэль': 'Фасоль консервированная Бондюэль белая в томатном соусе — это отборная фасоль в насыщенном томатном соусе с итальянскими травами. Полностью готова к употреблению, не требует разогрева. Идеальна как самостоятельное блюдо, гарнир к мясу или основа для супов и рагу. Богата растительным белком и клетчаткой.',
  'империя': 'Ветчина Империя вкуса из индейки — это нежное мясное изделие высшего качества из отборного филе индейки. Произведена по классической технологии с соблюдением всех стандартов. Имеет нежную сочную текстуру и приятный вкус. Идеально подходит для бутербродов, салатов и закусок.',
};

function enrichProduct(p: any): any {
  // Если у товара короткое описание (< 50 символов) — добавляем расширенное
  if (!p.description || p.description.length < 50) {
    // Ищем по ключевым словам
    for (const [key, desc] of Object.entries(longDescriptions)) {
      if (p.name?.toLowerCase().includes(key)) {
        return { ...p, description: desc };
      }
    }
  }
  return p;
}

function getSeedCategoryId(cat: Category): string {
  return slugToSeedCatId[cat.slug] || '';
}

async function selectCategory(cat: Category) {
  selectedCategory.value = cat;
  searchQuery.value = '';
  const seedCatId = getSeedCategoryId(cat);
  try {
    const fetched = await productsApi.getByCategory(cat.slug);
    const allFromApi = (fetched && fetched.length > 0) ? fetched.map(enrichProduct) : [];
    const seedsForCat = seedCatId ? seedProducts.filter(p => p.categoryId === seedCatId) as any : [];
    const apiIds = new Set(allFromApi.map((p: any) => p.id));
    categoryProducts.value = [...allFromApi, ...seedsForCat.filter((s: any) => !apiIds.has(s.id))];
  } catch {
    categoryProducts.value = seedCatId ? seedProducts.filter(p => p.categoryId === seedCatId) as any : [];
  }
  router.replace({ query: { category: cat.slug } });
  // Скролл к секции товаров, а не наверх
  setTimeout(() => {
    productsSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function toggleCategory(cat: Category) {
  if (selectedCategory.value?.id === cat.id) {
    showAllProducts();
  } else {
    selectCategory(cat);
  }
}

async function showAllProducts() {
  selectedCategory.value = null;
  searchQuery.value = '';
  router.replace({ query: {} });
  // Собираем товары из всех категорий (API + seed)
  try {
    const fetched = await productsApi.getAll();
    const allFromApi = (fetched && fetched.length > 0) ? fetched.map(enrichProduct) : [];
    const apiIds = new Set(allFromApi.map((p: any) => p.id));
    const extraSeeds = seedProducts.filter((s: any) => !apiIds.has(s.id));
    categoryProducts.value = [...allFromApi, ...extraSeeds];
  } catch {
    categoryProducts.value = seedProducts as any;
  }
}

watch(() => route.query.category, async (newSlug) => {
  if (!newSlug || typeof newSlug !== 'string') return;
  if (categories.value.length === 0) return;
  const cat = categories.value.find(c => c.slug === newSlug);
  if (cat) await selectCategory(cat);
}, { immediate: true });

onMounted(async () => {
  try {
    const all = await categoriesApi.getAll();
    const filtered = all.filter((c: Category) => c.slug !== 'featured');
    const apiSlugs = new Set(filtered.map((c: Category) => c.slug));
    const extraSeedCats = seedCategories.filter(sc => !apiSlugs.has(sc.slug) && sc.slug !== 'featured');
    categories.value = [...filtered, ...extraSeedCats];
  } catch {
    categories.value = seedCategories;
  }
  // После загрузки категорий проверяем query-параметр
  if (route.query.category && typeof route.query.category === 'string') {
    const cat = categories.value.find(c => c.slug === route.query.category);
    if (cat) {
      await selectCategory(cat);
      return;
    }
  }
  // Если нет query-параметра или категория не найдена — показываем все товары
  await showAllProducts();
});
</script>

<style scoped>
.catalog-page { position: relative; overflow: hidden; background: #ffffff; }

/* ========== Hero ========== */
.catalog-hero { position: relative; padding: 110px 20px 100px; overflow: hidden; min-height: 420px; display: flex; align-items: center; }
.catalog-hero__bg { position: absolute; inset: 0; pointer-events: none; }
.catalog-hero__bg-img { width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; }
.catalog-hero__overlay { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.55); z-index: 1; }
.catalog-hero__gradient { position: absolute; inset: 0; background: linear-gradient(160deg, rgba(26, 26, 46, 0.3) 0%, transparent 40%, transparent 60%, rgba(26, 26, 46, 0.3) 100%); z-index: 1; }

/* Particles */
.catalog-hero__particles { position: absolute; inset: 0; z-index: 1; pointer-events: none; overflow: hidden; }
.catalog-hero__particles .particle { position: absolute; font-size: 26px; opacity: 0; animation: particleFloat 8s ease-in infinite; }
.catalog-hero__particles .particle--1 { left: 10%; bottom: 20%; animation-delay: 0s; }
.catalog-hero__particles .particle--2 { left: 85%; bottom: 40%; animation-delay: 2s; font-size: 20px; }
.catalog-hero__particles .particle--3 { left: 25%; bottom: 60%; animation-delay: 4s; font-size: 18px; }
.catalog-hero__particles .particle--4 { left: 70%; bottom: 15%; animation-delay: 1s; font-size: 22px; }
.catalog-hero__particles .particle--5 { left: 45%; bottom: 80%; animation-delay: 3.5s; font-size: 24px; }
.catalog-hero__particles .particle--6 { left: 55%; bottom: 50%; animation-delay: 5s; font-size: 16px; }
@keyframes particleFloat { 0% { opacity: 0; transform: translateY(20px) rotate(0deg); } 20% { opacity: 0.7; } 80% { opacity: 0.7; } 100% { opacity: 0; transform: translateY(-120px) rotate(20deg); } }

.catalog-hero__content { position: relative; z-index: 2; text-align: center; animation: heroFade 0.7s ease-out both; }
@keyframes heroFade { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.catalog-hero__title {
  font-family: var(--font-display);
  font-size: clamp(38px, 7vw, 56px);
  color: #fff;
  margin-bottom: 16px;
  letter-spacing: 2px;
  background: linear-gradient(135deg, #fff 0%, #fde68a 50%, #fff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
}
.catalog-hero__subtitle { font-family: var(--font-body); font-size: 18px; color: rgba(255,255,255,0.7); max-width: 580px; margin: 0 auto 28px; line-height: 1.6; }
.catalog-hero__breadcrumbs { display: flex; align-items: center; justify-content: center; gap: 8px; font-family: var(--font-body); font-size: 14px; }
.breadcrumb-link { color: rgba(255,255,255,0.5); text-decoration: none; transition: color var(--transition-fast); }
.breadcrumb-link:hover { color: #fff; }
.breadcrumb-sep { color: rgba(255,255,255,0.3); }
.breadcrumb-current { color: rgba(255,255,255,0.8); }

/* ========== Layout: Sidebar + Main ========== */
.catalog-layout {
  display: flex;
  gap: 32px;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 20px;
  background: #ffffff;
}

/* ========== Sidebar ========== */
.catalog-sidebar {
  flex: 0 0 240px;
  min-width: 240px;
}
.sidebar-inner {
  position: sticky;
  top: 24px;
  background: #f8f9fa;
  border-radius: var(--radius-xl);
  border: 1px solid #e9ecef;
  padding: 20px 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  max-height: calc(100vh - 48px);
  overflow-y: auto;
}
.sidebar-title {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 15px;
  color: #495057;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0 20px 14px;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 6px;
}
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 8px;
}
.sidebar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 14px;
  border: none;
  border-radius: var(--radius-lg);
  background: transparent;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  font-family: var(--font-heading);
  font-size: 14px;
  font-weight: 500;
  color: #6c757d;
  text-align: left;
  width: 100%;
  position: relative;
  overflow: hidden;
}
.sidebar-item:active {
  transform: scale(0.95);
}
.sidebar-item:hover {
  background: rgba(232, 69, 69, 0.06);
  color: var(--color-primary);
  transform: translateX(4px);
}
.sidebar-item.active {
  background: var(--color-primary);
  color: #fff;
  box-shadow: 0 2px 8px rgba(232,69,69,0.25);
}
.sidebar-item.active:active {
  transform: scale(0.95);
}
.sidebar-item__icon {
  font-size: 18px;
  flex-shrink: 0;
  width: 28px;
  text-align: center;
}
.sidebar-item__name {
  font-weight: 600;
}

/* ========== Main Content ========== */
.catalog-main {
  flex: 1;
  min-width: 0;
}
.section { padding: 32px 0; position: relative; z-index: 1; }
.section--products { min-height: 70vh; padding-top: 0; }

/* ========== Category Header ========== */
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  padding-top: 32px;
  animation: headerFadeIn 0.4s ease-out both;
}
@keyframes headerFadeIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
.category-title { font-family: var(--font-display); font-size: clamp(28px, 4vw, 38px); color: var(--color-primary); margin: 0; position: relative; }
.category-title::after { content: ''; display: block; width: 48px; height: 3px; background: var(--color-primary); border-radius: 2px; margin-top: 8px; }
.category-desc { font-family: var(--font-body); font-size: 16px; color: var(--color-text-muted); margin-top: 8px; max-width: 500px; }
.count-badge { display: inline-flex; align-items: center; gap: 4px; padding: 8px 18px; background: #f8f9fa; color: #495057; border-radius: var(--radius-full); font-family: var(--font-heading); font-weight: 600; font-size: 14px; white-space: nowrap; border: 1px solid #e9ecef; }

/* ========== Toolbar ========== */
.toolbar { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; flex-wrap: wrap; background: #ffffff; border-radius: var(--radius-xl); padding: 10px 16px; border: 1px solid #e9ecef; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
.search-wrap { flex: 1; min-width: 200px; position: relative; display: flex; align-items: center; }
.search-icon { position: absolute; left: 14px; color: var(--color-text-muted); pointer-events: none; }
.search-input { width: 100%; padding: 11px 40px 11px 42px; border: 1px solid #dee2e6; border-radius: var(--radius-full); font-family: var(--font-body); font-size: 14px; background: #f8f9fa; transition: all var(--transition-fast); color: #1a1a2e; }
.search-input::placeholder { color: #6c7580; opacity: 1; }
.search-input:focus { outline: none; border-color: var(--color-primary); background: #ffffff; box-shadow: 0 0 0 3px rgba(232,69,69,0.08); color: #1a1a2e; }
.search-clear { position: absolute; right: 10px; background: #e9ecef; border: none; border-radius: 50%; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #6c757d; font-size: 12px; transition: all var(--transition-fast); }
.search-clear:hover { background: #dee2e6; color: var(--color-text); }
.sort-btns { display: flex; align-items: center; gap: 6px; }
.sort-label { font-size: 13px; color: #6c757d; font-family: var(--font-body); display: none; }
.sort-btn {
  padding: 9px 18px;
  border: 1px solid #dee2e6;
  border-radius: var(--radius-full);
  background: #f8f9fa;
  font-family: var(--font-heading);
  font-size: 13px;
  font-weight: 500;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  white-space: nowrap;
}
.sort-btn:active { transform: scale(0.95); }
.sort-btn:hover { border-color: var(--color-primary-light); color: var(--color-primary); transform: translateY(-1px); background: #ffffff; }
.sort-btn.active { background: var(--color-primary); color: #fff; border-color: var(--color-primary); box-shadow: 0 2px 8px rgba(232,69,69,0.2); }
.sort-btn.active:active { transform: scale(0.95); }
.sort-btn.active:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(232,69,69,0.3); }
@media (min-width: 600px) { .sort-label { display: inline; } }

/* ========== Products Grid ========== */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 24px;
  animation: gridFadeIn 0.5s ease-out;
}
@keyframes gridFadeIn { from { opacity: 0; } to { opacity: 1; } }

/* Stagger animation for product cards */
.products-grid > :deep(.product-card) {
  animation: cardStaggerIn 0.5s ease-out both;
}
.products-grid > :deep(.product-card:nth-child(1)) { animation-delay: 0.03s; }
.products-grid > :deep(.product-card:nth-child(2)) { animation-delay: 0.06s; }
.products-grid > :deep(.product-card:nth-child(3)) { animation-delay: 0.09s; }
.products-grid > :deep(.product-card:nth-child(4)) { animation-delay: 0.12s; }
.products-grid > :deep(.product-card:nth-child(5)) { animation-delay: 0.15s; }
.products-grid > :deep(.product-card:nth-child(6)) { animation-delay: 0.18s; }
.products-grid > :deep(.product-card:nth-child(7)) { animation-delay: 0.21s; }
.products-grid > :deep(.product-card:nth-child(8)) { animation-delay: 0.24s; }
.products-grid > :deep(.product-card:nth-child(9)) { animation-delay: 0.27s; }
.products-grid > :deep(.product-card:nth-child(10)) { animation-delay: 0.30s; }
.products-grid > :deep(.product-card:nth-child(11)) { animation-delay: 0.33s; }
.products-grid > :deep(.product-card:nth-child(12)) { animation-delay: 0.36s; }

@keyframes cardStaggerIn {
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* ========== Empty State ========== */
.empty-state { text-align: center; padding: 80px 20px; background: #f8f9fa; border-radius: var(--radius-xl); border: 1px solid #e9ecef; }
.empty-state__icon { font-size: 52px; display: block; margin-bottom: 16px; }
.empty-state h3 { font-family: var(--font-heading); font-weight: 700; font-size: 20px; color: var(--color-text); margin-bottom: 6px; }
.empty-state p { font-family: var(--font-body); font-size: 15px; color: #6c757d; margin-bottom: 20px; }
.btn--surface { display: inline-flex; align-items: center; justify-content: center; padding: 10px 24px; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: var(--radius-full); font-family: var(--font-heading); font-weight: 600; font-size: 14px; color: #6c757d; cursor: pointer; transition: all var(--transition-fast); }
.btn--surface:active { transform: scale(0.95); }
.btn--surface:hover { border-color: var(--color-primary); color: var(--color-primary); }

/* ========== Responsive ========== */
@media (max-width: 1100px) {
  .catalog-layout {
    flex-direction: column;
    gap: 0;
  }
  .catalog-sidebar {
    flex: none;
    min-width: unset;
    width: 100%;
  }
  .sidebar-inner {
    position: static;
    max-height: none;
    border-radius: var(--radius-lg);
    margin-top: 20px;
  }
  .sidebar-nav {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 4px;
  }
  .sidebar-item {
    width: auto;
    padding: 8px 14px;
    font-size: 13px;
  }
  .sidebar-item:hover {
    transform: none;
  }
  .sidebar-item:active {
    transform: scale(0.95);
  }
  .sidebar-item__icon {
    font-size: 16px;
    width: 22px;
  }
  .sidebar-title {
    display: none;
  }
}

@media (max-width: 900px) {
  .catalog-hero { padding: 90px 20px 80px; min-height: auto; }
}
@media (max-width: 600px) {
  .catalog-hero { padding: 80px 16px 70px; }
  .catalog-hero__title { font-size: 32px; }
  .catalog-hero__subtitle { font-size: 15px; }
  .catalog-layout { padding: 0 12px; }
  .section { padding: 24px 0; }
  .toolbar { flex-direction: column; align-items: stretch; padding: 12px; gap: 12px; }
  .sort-btns { justify-content: center; }
  .products-grid { grid-template-columns: 1fr; justify-items: center; gap: 16px; }
  .category-header { flex-direction: column; align-items: flex-start; }
  .category-title::after { margin-left: 0; }
}
</style>
