<template>
  <div class="promo-page">
    <!-- Hero -->
    <section class="promo-hero">
      <div class="promo-hero__bg">
        <img src="/images/promo-bg.jpg" alt="" class="promo-hero__bg-img">
        <div class="promo-hero__overlay"></div>
        <div class="promo-hero__gradient"></div>
      </div>
      <div class="container">
        <div class="promo-hero__content">
          <h1 class="promo-hero__title">Акции и скидки</h1>
          <p class="promo-hero__subtitle">Не упустите выгодные предложения! Специальные цены на любимые товары</p>
        </div>
      </div>
    </section>

    <div v-if="!loading && products.length > 0">
      <!-- Статистика -->
      <section class="promo-stats">
        <div class="container">
          <div class="promo-stats__grid">
            <button class="promo-stats__item" @click="openStatModal('products')">
              <span class="promo-stats__value">{{ products.length }}</span>
              <span class="promo-stats__label">товаров со скидкой</span>
              <span class="promo-stats__hint">Нажмите, чтобы увидеть все →</span>
            </button>
            <button class="promo-stats__item" @click="openStatModal('discount')">
              <span class="promo-stats__value">до {{ maxDiscount }}%</span>
              <span class="promo-stats__label">максимальная скидка</span>
              <span class="promo-stats__hint">Нажмите, чтобы увидеть товар →</span>
            </button>
            <button class="promo-stats__item" @click="openStatModal('categories')">
              <span class="promo-stats__value">{{ uniqueCategoryCount }}</span>
              <span class="promo-stats__label">категорий в акции</span>
              <span class="promo-stats__hint">Нажмите подробнее →</span>
            </button>
            <button class="promo-stats__item" @click="openStatModal('timer')">
              <span class="promo-stats__value" v-if="timeLeft">{{ timeLeft }}</span>
              <span class="promo-stats__label">до окончания акций</span>
              <span class="promo-stats__hint">Успейте купить →</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Баннер топ-скидки -->
      <section class="promo-banner" v-if="topDeal">
        <div class="container">
          <div class="promo-banner__card" @click="openModal(topDeal)">
            <div class="promo-banner__discount">-{{ topDeal.percent }}%</div>
            <div class="promo-banner__info">
              <p class="promo-banner__label">🔥 Самая большая скидка</p>
              <h3 class="promo-banner__title">{{ topDeal.name }}</h3>
              <div class="promo-banner__prices">
                <span class="promo-banner__old">{{ formatPrice(topDeal.price) }}</span>
                <span class="promo-banner__new">{{ formatPrice(topDeal.discountPrice ?? topDeal.price) }}</span>
              </div>
              <span class="promo-banner__cta">Посмотреть товар →</span>
            </div>
            <div class="promo-banner__image-wrapper">
              <img :src="topDeal.imageUrl || '/images/products/placeholder.svg'" :alt="topDeal.name" class="promo-banner__image">
            </div>
          </div>
        </div>
      </section>

      <!-- Сетка товаров -->
      <section class="section section--promo" id="promo-products">
        <div class="container">
          <h2 class="section__title">Все акционные товары</h2>
          <div class="products-grid">
            <ProductCard
              v-for="(product, index) in products"
              :key="product.id"
              :product="product"
              :style="{ animationDelay: `${index * 0.08}s` }"
              class="promo-card-animated"
              @open-modal="openModal"
            />
          </div>
        </div>
      </section>
    </div>

    <!-- Скелетон -->
    <div v-else-if="loading" class="section">
      <div class="container">
        <div class="products-grid">
          <div v-for="n in 4" :key="'skeleton-'+n" class="product-card-skeleton">
            <div class="skeleton skeleton--image"></div>
            <div class="skeleton-card-body"><div class="skeleton skeleton--title"></div><div class="skeleton skeleton--text" style="width:40%"></div></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Пустое состояние -->
    <div v-else class="section">
      <div class="container">
        <div class="empty-state">
          <span class="empty-state__icon">🏷️</span>
          <h3>Акций пока нет</h3>
          <p>Следите за обновлениями — скоро появятся выгодные предложения</p>
          <router-link to="/catalog" class="btn-primary">Перейти в каталог</router-link>
        </div>
      </div>
    </div>

    <!-- Модальное окно статистики -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedStat" class="modal-overlay" @click.self="selectedStat = null">
          <div class="modal-card" @click.stop>
            <button class="modal-close" @click="selectedStat = null" aria-label="Закрыть">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            <div class="modal-feature">
              <div class="modal-feature__icon-ring" :style="{ background: selectedStat.gradient }">
                <span class="modal-feature__icon">{{ selectedStat.icon }}</span>
              </div>
              <h2 class="modal-feature__title">{{ selectedStat.title }}</h2>
              <p class="modal-feature__detail">{{ selectedStat.detail }}</p>
              <div class="modal-feature__actions">
                <router-link v-if="selectedStat.link" :to="selectedStat.link" class="btn btn--primary" @click="selectedStat = null">
                  {{ selectedStat.linkText }}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </router-link>
                <button class="btn btn--outline" @click="selectedStat = null">Закрыть</button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <ProductModal :product="selectedProduct" :is-open="isModalOpen" @close="closeModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import ProductCard from '../components/product/ProductCard.vue';
import ProductModal from '../components/product/ProductModal.vue';
import { productsApi } from '../api/products.api';

interface Product {
  id: string; name: string; price: number; discountPrice?: number; discountUntil?: string;
  imageUrl?: string; weight?: string; inStock: boolean; description?: string;
  categoryId: string; deliveryDate?: string;
}

interface StatModal {
  icon: string;
  title: string;
  detail: string;
  gradient: string;
  link?: string;
  linkText?: string;
}

const products = ref<Product[]>([]);
const loading = ref(true);
const selectedProduct = ref<any>(null);
const isModalOpen = ref(false);
const selectedStat = ref<StatModal | null>(null);
let timerInterval: ReturnType<typeof setInterval> | null = null;
const timeLeft = ref('');

function openModal(p: any) { selectedProduct.value = p; isModalOpen.value = true; }
function closeModal() { isModalOpen.value = false; selectedProduct.value = null; }

function formatPrice(p: number) { return `${p.toLocaleString('ru-RU')}₽`; }

const maxDiscount = computed(() => {
  if (!products.value.length) return 0;
  const percents = products.value
    .filter(p => p.discountPrice && p.discountPrice > 0)
    .map(p => Math.round((1 - p.discountPrice! / p.price) * 100));
  return percents.length ? Math.max(...percents) : 0;
});

const uniqueCategoryCount = computed(() => {
  const cats = new Set(products.value.map(p => p.categoryId));
  return cats.size;
});

const topDeal = computed(() => {
  if (!products.value.length) return null;
  const withDiscount = products.value
    .filter(p => p.discountPrice && p.discountPrice > 0)
    .map(p => ({
      ...p,
      percent: Math.round((1 - p.discountPrice! / p.price) * 100),
    }))
    .sort((a, b) => b.percent - a.percent);
  return withDiscount.length ? withDiscount[0] : null;
});

function openStatModal(type: 'products' | 'discount' | 'categories' | 'timer') {
  const top = topDeal.value;
  const cats = ['🥖 Хлебобулочные', '🥛 Молочка', '🍅 Овощи', '🍫 Сладости', '☕ Напитки', '🍄 Домашнее', '🍯 Консервы и сухофрукты', '🧹 Товары для дома'];

  const modals: Record<string, StatModal> = {
    products: {
      icon: '🏷️',
      title: `${products.value.length} товаров со скидкой`,
      detail: `В акции участвует ${products.value.length} товаров из разных категорий. Все они уже представлены ниже на этой странице — листайте вниз и выбирайте самые выгодные предложения! Скидки достигают ${maxDiscount.value}%, а это значит, что вы можете сэкономить на любимых продуктах. Не упустите момент — акция ограничена по времени.`,
      gradient: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
      link: '#promo-products',
      linkText: 'Смотреть все товары',
    },
    discount: {
      icon: '📉',
      title: `Скидка до ${maxDiscount.value}%`,
      detail: top
        ? `Максимальная скидка в этой акции — ${maxDiscount.value}%! Она действует на товар «${top.name}». Всего ${formatPrice(top.discountPrice!)} вместо ${formatPrice(top.price)} — выгода очевидна. Торопитесь, количество товара ограничено, а акция действует до ${timeLeft.value ? 'окончания таймера' : 'конца месяца'}.`
        : 'В этой акции представлены товары со скидками до 28%. Проверьте список акционных товаров и выберите то, что нужно именно вам.',
      gradient: 'linear-gradient(135deg, #fef2f2, #fecaca)',
      link: '/catalog',
      linkText: 'Перейти в каталог',
    },
    categories: {
      icon: '🎉',
      title: `${uniqueCategoryCount.value} категорий в акции`,
      detail: `Скидки распространяются на ${uniqueCategoryCount.value} категорий товаров:\n\n${cats.join('\n')}\n\nЭто значит, что вы можете сэкономить на самых разных продуктах — от свежих овощей до сладостей и товаров для дома. Выбирайте любимые категории и покупайте с выгодой!`,
      gradient: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
      link: '/catalog',
      linkText: 'Смотреть категории',
    },
    timer: {
      icon: '⏳',
      title: 'Торопитесь!',
      detail: timeLeft.value
        ? `До окончания акции осталось ${timeLeft.value}. Успейте купить любимые товары по выгодным ценам! После завершения акции все цены вернутся к обычным. Не откладывайте покупки на потом — сейчас самое лучшее время запастись продуктами со скидкой.`
        : 'Акция уже завершена, но следите за обновлениями — скоро появятся новые выгодные предложения!',
      gradient: 'linear-gradient(135deg, #fef3cd, #fde68a)',
      link: '#promo-products',
      linkText: 'Выбрать товары',
    },
  };

  selectedStat.value = modals[type];
}

function updateCountdown() {
  const now = new Date();
  const dates = products.value
    .filter(p => p.discountUntil)
    .map(p => new Date(p.discountUntil!))
    .filter(d => d > now);
  if (!dates.length) return;
  const earliest = new Date(Math.min(...dates.map(d => d.getTime())));
  const diff = earliest.getTime() - now.getTime();
  if (diff <= 0) { timeLeft.value = 'Завершено'; return; }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 0) {
    timeLeft.value = `${days}д ${hours}ч ${minutes}м`;
  } else {
    timeLeft.value = `${hours}ч ${minutes}м`;
  }
}

onMounted(async () => {
  try {
    products.value = await productsApi.getPromo();
    if (products.value.length) {
      updateCountdown();
      timerInterval = setInterval(updateCountdown, 60000);
    }
  } catch { /* ignore */ }
  loading.value = false;
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<style scoped>
.promo-page { overflow-x: hidden; }

/* Hero */
.promo-hero {
  position: relative; padding: 100px 20px 80px;
  overflow: hidden;
}
.promo-hero__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.promo-hero__bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
.promo-hero__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.45);
}
.promo-hero__gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.4));
}
.promo-hero__content {
  position: relative;
  z-index: 1;
  text-align: center;
  animation: heroFade 0.7s ease-out both;
}
@keyframes heroFade { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
.promo-hero__title {
  font-family: var(--font-heading); font-weight: 800; font-size: clamp(36px,6vw,52px);
  color: #fff;
  text-shadow: 0 2px 12px rgba(0,0,0,0.3);
  margin-bottom: 16px;
}
.promo-hero__subtitle { font-family: var(--font-body); font-size: 17px; color: rgba(255,255,255,0.9); max-width: 560px; margin: 0 auto; line-height: 1.5; text-shadow: 0 1px 6px rgba(0,0,0,0.2); }

/* Статистика */
.promo-stats {
  padding: 32px 20px;
  background: #f5f6f8;
}
.promo-stats__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.promo-stats__item {
  all: unset;
  text-align: center;
  padding: 20px 12px;
  border-radius: var(--radius-lg);
  background: #fff;
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all var(--transition-normal);
  display: block;
}
.promo-stats__item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
  border-color: var(--color-primary-light);
}
.promo-stats__item:active {
  transform: translateY(-2px);
}
.promo-stats__value {
  display: block;
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 24px;
  color: var(--color-text);
  line-height: 1.2;
}
.promo-stats__label {
  display: block;
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--color-text-muted);
  margin-top: 2px;
}
.promo-stats__hint {
  display: block;
  font-family: var(--font-body);
  font-size: 11px;
  color: var(--color-primary);
  margin-top: 6px;
  opacity: 0;
  transition: opacity var(--transition-fast);
}
.promo-stats__item:hover .promo-stats__hint {
  opacity: 1;
}

/* Баннер топ-скидки */
.promo-banner {
  padding: 0 20px;
  background: #f5f6f8;
}
.promo-banner__card {
  display: flex;
  align-items: center;
  gap: 24px;
  background: linear-gradient(135deg, #fef2f2, #fee2e2, #fecaca);
  border-radius: var(--radius-xl);
  padding: 28px 32px;
  cursor: pointer;
  transition: all var(--transition-normal);
  border: 1px solid #fca5a5;
  position: relative;
  overflow: hidden;
}
.promo-banner__card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(220,38,38,0.15);
  border-color: #f87171;
}
.promo-banner__discount {
  font-family: var(--font-heading);
  font-weight: 900;
  font-size: 48px;
  color: #dc2626;
  line-height: 1;
  flex-shrink: 0;
  text-shadow: 2px 2px 0 rgba(220,38,38,0.1);
}
.promo-banner__info { flex: 1; }
.promo-banner__label {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #dc2626;
  margin-bottom: 4px;
}
.promo-banner__title {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 22px;
  color: #7f1d1d;
  margin-bottom: 8px;
}
.promo-banner__prices { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.promo-banner__old { font-size: 16px; color: #dc2626; text-decoration: line-through; }
.promo-banner__new { font-family: var(--font-heading); font-weight: 800; font-size: 28px; color: #991b1b; }
.promo-banner__cta {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  color: #dc2626;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.promo-banner__image-wrapper {
  width: 140px;
  height: 140px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: rgba(255,255,255,0.7);
}
.promo-banner__image { width: 100%; height: 100%; object-fit: contain; }

/* Секция с товарами */
.section {
  padding: 64px 20px;
  min-height: 50vh;
  background: #f5f6f8;
}
.section--promo { padding-top: 24px; }
.section__title {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 24px;
  color: var(--color-text);
  margin-bottom: 24px;
}

/* Анимированное появление карточек */
.products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px,1fr)); gap: 20px; }
.promo-card-animated {
  opacity: 0;
  animation: cardSlideUp 0.5s ease-out forwards;
}
@keyframes cardSlideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Скелетон */
.product-card-skeleton { border-radius: var(--radius-xl); overflow: hidden; border: 1px solid var(--color-border); background: var(--color-surface); }
.skeleton-card-body { padding: 16px; }

/* Пустое состояние */
.empty-state { text-align: center; padding: 80px 20px; }
.empty-state__icon { font-size: 48px; display: block; margin-bottom: 16px; }
.empty-state h3 { font-family: var(--font-heading); font-weight: 700; font-size: 20px; margin-bottom: 6px; }
.empty-state p { font-family: var(--font-body); font-size: 15px; color: var(--color-text-muted); margin-bottom: 20px; }
.btn-primary { display: inline-block; padding: 12px 32px; background: var(--color-primary); color: #fff; border-radius: var(--radius-full); text-decoration: none; font-weight: 600; transition: all var(--transition-fast); }
.btn-primary:hover { background: var(--color-primary-dark); transform: translateY(-2px); }

/* Модальное окно */
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
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  border: 1px solid rgba(0,0,0,0.06);
}
.modal-feature__icon {
  font-size: 40px;
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
  white-space: pre-line;
}
.modal-feature__actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
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
.btn--primary {
  background: var(--color-primary);
  color: #fff;
}
.btn--primary:hover {
  background: var(--color-primary-dark);
  box-shadow: 0 8px 24px rgba(232,69,69,0.25);
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

/* Адаптив */
@media (max-width: 900px) {
  .promo-stats__grid { grid-template-columns: repeat(2, 1fr); }
  .promo-banner__card { flex-direction: column; text-align: center; padding: 24px; }
  .promo-banner__image-wrapper { width: 100px; height: 100px; }
  .promo-banner__discount { font-size: 36px; }
  .modal-feature__actions { flex-direction: column; align-items: center; }
  .modal-card { padding: 36px 24px 28px; }
}
@media (max-width: 600px) {
  .promo-hero { padding: 80px 16px 60px; }
  .promo-stats { padding: 20px 16px; }
  .promo-stats__grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .promo-stats__item { padding: 14px 8px; }
  .promo-stats__value { font-size: 20px; }
  .section { padding: 32px 16px; }
  .promo-banner__title { font-size: 18px; }
  .promo-banner__new { font-size: 22px; }
  .modal-card { padding: 28px 18px 22px; }
  .modal-feature__title { font-size: 24px; }
  .modal-feature__detail { font-size: 15px; padding: 0 8px; }
}
</style>