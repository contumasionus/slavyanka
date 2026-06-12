<template>
  <div class="home-page">
    <!-- Hero секция с параллаксом и частицами -->
    <section class="hero">
      <div class="hero__bg">
        <img src="/images/hero-bg.jpg" alt="Магазин Славянка" class="hero__bg-img">
        <div class="hero__overlay"></div>
        <div class="hero__gradient"></div>
        <!-- Плавающие декоративные частицы (колосья) -->
        <div class="hero__particles" aria-hidden="true">
          <span class="particle particle--1">🌾</span>
          <span class="particle particle--2">🌾</span>
          <span class="particle particle--3">🌾</span>
          <span class="particle particle--4">🌾</span>
          <span class="particle particle--5">🌾</span>
          <span class="particle particle--6">✨</span>
        </div>
      </div>
      <div class="hero__content">
        <div class="hero__logo-img">
          <img src="/left.jpg" alt="" class="hero__wheat hero__wheat--left">
          <img src="/right.jpg" alt="" class="hero__wheat hero__wheat--right">
        </div>
        <h1 class="hero__title">Славянка</h1>
        <p class="hero__subtitle">Продуктовый магазин в деревне Курилово</p>
        <p class="hero__desc">Свежие продукты каждый день с <strong>8:00 до 22:00</strong></p>
        <div class="hero__actions">
          <router-link to="/catalog" class="hero__btn hero__btn--primary">Смотреть каталог</router-link>
          <router-link to="/about" class="hero__btn hero__btn--outline">О магазине</router-link>
        </div>
      </div>
    </section>

    <!-- Секция преимуществ (кликабельные карточки) -->
    <section class="section section--features reveal">
      <div class="container">
        <h2 class="section-title">Почему выбирают нас</h2>
        <p class="features-subtitle">Нажмите на карточку, чтобы узнать подробнее</p>
        <div class="features-grid">
          <div
            class="feature-card reveal reveal--left"
            :class="{ 'feature-card--active': selectedFeature?.id === features[0].id }"
            @click="openFeatureModal(features[0])"
          >
            <span class="feature-icon" v-html="features[0].icon"></span>
            <h3>{{ features[0].title }}</h3>
            <p>{{ features[0].short }}</p>
            <span class="feature-card__hint">Нажмите для подробностей →</span>
          </div>
          <div
            class="feature-card reveal"
            :class="{ 'feature-card--active': selectedFeature?.id === features[1].id }"
            @click="openFeatureModal(features[1])"
          >
            <span class="feature-icon" v-html="features[1].icon"></span>
            <h3>{{ features[1].title }}</h3>
            <p>{{ features[1].short }}</p>
            <span class="feature-card__hint">Нажмите для подробностей →</span>
          </div>
          <div
            class="feature-card reveal reveal--right"
            :class="{ 'feature-card--active': selectedFeature?.id === features[2].id }"
            @click="openFeatureModal(features[2])"
          >
            <span class="feature-icon" v-html="features[2].icon"></span>
            <h3>{{ features[2].title }}</h3>
            <p>{{ features[2].short }}</p>
            <span class="feature-card__hint">Нажмите для подробностей →</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Популярные товары -->
    <section class="section section--products">
      <div class="container">
        <div class="section__header">
          <h2 class="section-title">Товары нарасхват</h2>
        </div>
        <div v-if="loading" class="products-grid">
          <div v-for="n in 6" :key="'skeleton-' + n" class="product-card-skeleton">
            <div class="skeleton skeleton--image"></div>
            <div class="skeleton-card-body">
              <div class="skeleton skeleton--title"></div>
              <div class="skeleton skeleton--text" style="width: 40%"></div>
              <div class="skeleton skeleton--button" style="margin: 10px auto 0"></div>
            </div>
          </div>
        </div>
        <div v-else-if="products.length === 0" class="empty-text">Товары скоро появятся</div>
        <div v-else class="products-grid">
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
            @open-modal="openProductModal"
          />
        </div>
        <div class="section__cta" v-if="products.length > 0">
          <router-link to="/catalog" class="cta-link">
            Все товары
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </router-link>
        </div>
      </div>
    </section>

    <ProductModal
      :product="selectedProduct"
      :is-open="isModalOpen"
      @close="closeProductModal"
    />

    <!-- Модальное окно преимущества -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedFeature" class="modal-overlay" @click.self="selectedFeature = null">
          <div class="modal-card" @click.stop>
            <button class="modal-close" @click="selectedFeature = null" aria-label="Закрыть">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            <div class="modal-feature">
              <div class="modal-feature__icon-ring">
                <span class="modal-feature__icon" v-html="selectedFeature.icon"></span>
              </div>
              <h2 class="modal-feature__title">{{ selectedFeature.title }}</h2>
              <p class="modal-feature__detail">{{ selectedFeature.detail }}</p>
              <div class="modal-feature__actions">
                <router-link to="/catalog" class="btn btn--primary" @click="selectedFeature = null">
                  Смотреть товары
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </router-link>
                <router-link to="/about" class="btn btn--outline" @click="selectedFeature = null">
                  О магазине
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ProductCard from '../components/product/ProductCard.vue';
import ProductModal from '../components/product/ProductModal.vue';
import { productsApi } from '../api/products.api';
import { seedProducts } from '../data/seed-products';

interface Product {
  id: string;
  name: string;
  price: number;
  weight?: string;
  imageUrl?: string;
  inStock: boolean;
  description?: string;
  categoryId: string;
  deliveryDate?: string;
  discountPrice?: number;
  discountUntil?: string;
  isPromo?: boolean;
  avgRating?: number;
  reviewCount?: number;
}

interface FeatureItem {
  id: string;
  icon: string;
  title: string;
  short: string;
  detail: string;
}

const products = ref<Product[]>([]);
const loading = ref(true);
const selectedProduct = ref<Product | null>(null);
const isModalOpen = ref(false);

const selectedFeature = ref<FeatureItem | null>(null);

const features: FeatureItem[] = [
  {
    id: 'freshness',
    icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c-4.97 0-9-3.58-9-8 0-3.31 2.69-6 6-6 1.5 0 2.87.53 3.94 1.42C14.08 3.38 19.33 2 22 2c0 3.14-1.07 6.5-3.25 9.39C19.55 12.18 20 13.08 20 14c0 4.42-4.03 8-9 8z"/><path d="M12 14c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/></svg>',
    title: 'Свежесть каждый день',
    short: 'Ежедневные поставки от местных производителей. Только свежие продукты высшего качества.',
    detail: 'Мы работаем напрямую с местными фермерами и пекарнями. Хлеб поступает каждое утро — свежий и ароматный, ещё тёплый. Молочная продукция привозится ежедневно из соседних хозяйств — молоко, творог, сметана и яйца от проверенных поставщиков. Овощи и фрукты — только сезонные, с местных полей. Мы не храним товары неделями: всё, что не продано за день, списывается. Свежесть — наша главная гордость.',
  },
  {
    id: 'selection',
    icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>',
    title: 'Широкий выбор',
    short: 'Более 500 наименований: от свежей выпечки до бытовой химии. Всё для вашего стола и дома.',
    detail: 'В нашем ассортименте более 500 товаров: свежая выпечка, молочка, мясо, рыба, овощи, фрукты, бакалея, крупы, макароны, консервы, напитки, сладости, а также бытовая химия и товары для дома. Мы тщательно подбираем каждую позицию, чтобы вы могли купить всё необходимое в одном месте. Регулярно обновляем ассортимент и добавляем новинки по вашим просьбам. Если чего-то нет — скажите нам, и мы постараемся найти.',
  },
  {
    id: 'location',
    icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    title: 'Удобное расположение',
    short: 'Магазин в центре деревни Курилово. Удобная парковка, работаем без выходных с 8:00 до 22:00.',
    detail: 'Магазин находится в самом центре деревни Курилово по адресу Молодёжная улица, 1В. Рядом удобная парковка, так что вы легко сможете подъехать на машине. Мы работаем без выходных — с 8:00 до 22:00, семь дней в неделю. Заходите за свежими продуктами утром по пути на работу или вечером после неё — мы всегда открыты. А если не можете прийти сами, просто позвоните, и мы поможем с доставкой по деревне.',
  },
];

function openFeatureModal(feature: FeatureItem) {
  selectedFeature.value = feature;
}

function openProductModal(product: Product) {
  selectedProduct.value = product;
  isModalOpen.value = true;
}
function closeProductModal() {
  isModalOpen.value = false;
  selectedProduct.value = null;
}

onMounted(async () => {
  try {
    const fetched = await productsApi.getByCategory('featured');
    const allFromApi = (fetched && fetched.length > 0) ? fetched : [];
    const allSeeds = seedProducts as any;
    const apiIds = new Set(allFromApi.map((p: any) => p.id));
    const needed = 12 - allFromApi.length;
    const additionalSeeds = needed > 0 ? allSeeds.filter((s: any) => !apiIds.has(s.id)).slice(0, needed) : [];
    products.value = [...allFromApi, ...additionalSeeds];
  } catch {
    products.value = seedProducts.slice(0, 12) as any;
  }
  loading.value = false;
});
</script>

<style scoped>
.home-page { overflow-x: hidden; }

/* Hero */
.hero { position: relative; min-height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.hero__bg { position: absolute; inset: 0; }
.hero__bg-img { width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; transition: transform 0.1s linear; }
.hero__overlay { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.55); z-index: 1; }
.hero__gradient { position: absolute; inset: 0; background: linear-gradient(160deg, rgba(26, 26, 46, 0.3) 0%, transparent 40%, transparent 60%, rgba(26, 26, 46, 0.3) 100%); z-index: 1; }

/* Частицы */
.hero__particles { position: absolute; inset: 0; z-index: 1; pointer-events: none; overflow: hidden; }
.particle { position: absolute; font-size: 28px; opacity: 0; animation: particleFloat 8s ease-in infinite; }
.particle--1 { left: 10%; bottom: 20%; animation-delay: 0s; font-size: 22px; }
.particle--2 { left: 85%; bottom: 40%; animation-delay: 2s; font-size: 30px; }
.particle--3 { left: 25%; bottom: 60%; animation-delay: 4s; font-size: 18px; }
.particle--4 { left: 70%; bottom: 15%; animation-delay: 1s; font-size: 26px; }
.particle--5 { left: 45%; bottom: 80%; animation-delay: 3.5s; font-size: 20px; }
.particle--6 { left: 50%; bottom: 50%; animation-delay: 5s; font-size: 16px; }

.hero__content { position: relative; z-index: 2; text-align: center; padding: 40px 20px; animation: heroFadeIn 1.2s ease-out; }
@keyframes heroFadeIn { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
.hero__logo-img { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 20px; }
.hero__wheat { width: 60px; height: 60px; filter: drop-shadow(0 4px 12px rgba(255, 255, 255, 0.3)); animation: wheatWave 3s ease-in-out infinite; }
.hero__wheat--right { animation-delay: 1.5s; }
.hero__title { font-family: var(--font-display); font-size: clamp(48px, 10vw, 96px); color: var(--color-white); text-shadow: 0 4px 30px rgba(0, 0, 0, 0.5); margin: 0 0 12px; letter-spacing: 4px; background: linear-gradient(135deg, #fff 0%, #fde68a 50%, #fff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.hero__subtitle { font-family: var(--font-heading); font-size: clamp(18px, 3vw, 28px); color: rgba(255,255,255,0.9); font-weight: 300; letter-spacing: 1px; margin-bottom: 20px; }

.hero__badges { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-bottom: 16px; }
.hero__badge { padding: 6px 16px; background: rgba(255,255,255,0.12); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.15); border-radius: var(--radius-full); font-size: 14px; color: rgba(255,255,255,0.85); font-weight: 500; animation: fadeInUp 0.5s ease-out both; }
.hero__badge:nth-child(2) { animation-delay: 0.15s; }
.hero__badge:nth-child(3) { animation-delay: 0.3s; }

.hero__desc { font-family: var(--font-body); font-size: 16px; color: rgba(255,255,255,0.6); margin-top: 12px; }
.hero__desc strong { color: #fde68a; }
.hero__actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-top: 40px; }
.hero__btn { padding: 14px 36px; border-radius: var(--radius-full); font-family: var(--font-heading); font-weight: 600; font-size: 16px; transition: all var(--transition-bounce); text-decoration: none; position: relative; overflow: hidden; }
.hero__btn--primary { background: var(--color-primary); color: #fff; box-shadow: 0 8px 30px rgba(211, 84, 0, 0.35); }
.hero__btn--primary:hover { background: var(--color-primary-dark); transform: translateY(-3px); box-shadow: 0 12px 40px rgba(211, 84, 0, 0.45); }
.hero__btn--outline { border: 2px solid rgba(255,255,255,0.25); color: #fff; backdrop-filter: blur(8px); }
.hero__btn--outline:hover { border-color: #fff; background: rgba(255,255,255,0.12); transform: translateY(-3px); }
.hero__scroll-hint { position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 8px; color: rgba(255,255,255,0.4); animation: bounceDown 2s ease-in-out infinite; z-index: 2; }
.hero__scroll-hint span { font-size: 12px; }
@keyframes bounceDown { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(8px); } }

/* Features Section */
.section--features { padding: 100px 20px; background: var(--color-surface); }
.features-subtitle { text-align: center; font-family: var(--font-body); font-size: 14px; color: var(--color-text-muted); margin-top: -28px; margin-bottom: 32px; }
.features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; max-width: 1000px; margin: 0 auto; }
.feature-card { text-align: center; padding: 40px 24px; border-radius: var(--radius-xl); background: #f5f6f8; border: 1px solid var(--color-border); transition: all 0.3s var(--anim-bounce); cursor: pointer; position: relative; }
.feature-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-hover); border-color: var(--color-primary-light); }
.feature-card--active { border-color: var(--color-primary-light); box-shadow: 0 0 0 3px rgba(232,69,69,0.1); }
.feature-icon { display: flex; align-items: center; justify-content: center; width: 64px; height: 64px; margin: 0 auto 16px; color: var(--color-primary); transition: transform var(--transition-bounce); background: linear-gradient(135deg, var(--color-primary-soft) 0%, var(--color-accent-light) 100%); border-radius: 18px; border: 1px solid rgba(232,69,69,0.1); }
.feature-icon :deep(svg) { width: 32px; height: 32px; }
.feature-card:hover .feature-icon { transform: scale(1.15); }
.feature-card h3 { font-family: var(--font-heading); font-weight: 700; font-size: 20px; margin-bottom: 8px; color: var(--color-text); }
.feature-card p { font-family: var(--font-body); font-size: 15px; color: var(--color-text-secondary); line-height: 1.6; }
.feature-card__hint { display: inline-block; font-family: var(--font-body); font-size: 12px; color: var(--color-text-muted); opacity: 0; transform: translateY(4px); transition: all var(--transition-fast); margin-top: 4px; }
.feature-card:hover .feature-card__hint { opacity: 1; transform: translateY(0); color: var(--color-primary); }

/* Section */
.section { padding: 80px 20px; position: relative; z-index: 1; }
.section--products { padding: 80px 0; background: #f5f6f8; }
.section--products .container { max-width: 1440px; margin: 0 auto; padding: 0 40px; }
.section__header { text-align: center; margin-bottom: 40px; }
.section__cta { text-align: center; margin-top: 48px; }
.cta-link { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-heading); font-weight: 600; font-size: 16px; color: var(--color-primary); transition: gap var(--transition-fast); text-decoration: none; }
.cta-link:hover { gap: 14px; }

/* Products Grid */
.products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 28px; justify-items: center; }
.product-card-skeleton { width: 100%; max-width: 320px; background: var(--color-surface); border-radius: var(--radius-xl); border: 1px solid var(--color-border); overflow: hidden; display: flex; flex-direction: column; }
.skeleton-card-body { padding: 16px; display: flex; flex-direction: column; flex: 1; }
.empty-text { text-align: center; color: var(--color-text-muted); font-family: var(--font-body); font-size: 18px; padding: 60px 0; }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 20px;
}
.modal-card {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: 48px 40px 40px;
  width: 100%;
  max-width: 540px;
  position: relative;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--color-border);
}
.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: var(--color-border-light);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-text-muted);
  transition: all var(--transition-fast);
}
.modal-close:hover {
  background: var(--color-error);
  color: #fff;
  transform: scale(1.1);
}
.modal-feature {
  text-align: center;
}
.modal-feature__icon-ring {
  width: 88px;
  height: 88px;
  border-radius: var(--radius-xl);
  background: linear-gradient(135deg, var(--color-primary-soft) 0%, var(--color-accent-light) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  border: 1px solid rgba(232,69,69,0.1);
}
.modal-feature__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
}
.modal-feature__icon :deep(svg) {
  width: 40px;
  height: 40px;
}
.modal-feature__title {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 28px;
  color: var(--color-text);
  margin-bottom: 16px;
}
.modal-feature__detail {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.75;
  color: var(--color-text-secondary);
  text-align: left;
  margin-bottom: 28px;
  padding: 0 16px;
}
.modal-feature__actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
.modal-feature__actions .btn--primary {
  background: var(--color-primary);
  color: #fff;
}
.modal-feature__actions .btn--primary:hover {
  background: var(--color-primary-dark);
  box-shadow: 0 8px 24px rgba(232,69,69,0.25);
}
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 14px 32px;
  border-radius: var(--radius-full);
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 16px;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: all var(--transition-bounce);
}
.btn--outline {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}
.btn--outline:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* Modal transitions */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.25s ease;
}
.modal-enter-active .modal-card, .modal-leave-active .modal-card {
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-card {
  transform: scale(0.9) translateY(20px);
}
.modal-leave-to .modal-card {
  transform: scale(0.9) translateY(20px);
}

@media (max-width: 900px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
  .modal-feature__actions {
    flex-direction: column;
    align-items: center;
  }
  .modal-card {
    padding: 36px 24px 28px;
  }
}

@media (max-width: 768px) {
  .section--products { padding: 60px 16px; }
  .modal-card {
    padding: 28px 18px 22px;
  }
  .modal-feature__title {
    font-size: 24px;
  }
  .modal-feature__detail {
    font-size: 15px;
    padding: 0 8px;
  }
}
</style>
