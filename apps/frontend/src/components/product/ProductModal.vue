<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click="closeModal">
        <div class="modal-container" @click.stop>
          <button class="modal-close" @click="closeModal" aria-label="Закрыть">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>

          <div class="modal-content">
            <!-- Левая колонка: фото -->
            <div class="modal-image-section">
              <div class="modal-image-wrapper">
                <div class="modal-image-bg">
                  <div class="modal-image-bg-shape"></div>
                </div>
                <!-- Бейдж скидки -->
                <div v-if="discountPercent" class="modal-badge badge--large">
                  <span class="modal-badge__value">-{{ discountPercent }}%</span>
                  <span class="modal-badge__label">скидка</span>
                </div>
                <!-- Бейдж акции -->
                <div v-else-if="product?.isPromo" class="modal-badge modal-badge--promo badge--large">
                  <span class="modal-badge__value">АКЦИЯ</span>
                </div>
                <img :src="product?.imageUrl || '/images/products/placeholder.svg'" :alt="product?.name" class="modal-image">
              </div>
              <!-- Миниатюры для навигации -->
              <div v-if="hasDiscount" class="modal-price-compare">
                <div class="price-compare-item">
                  <span class="price-compare__label">Обычная цена</span>
                  <span class="price-compare__value price-compare__value--old">{{ formatPrice(product?.price || 0) }}</span>
                </div>
                <div class="price-compare-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
                <div class="price-compare-item price-compare-item--highlight">
                  <span class="price-compare__label">Цена со скидкой</span>
                  <span class="price-compare__value price-compare__value--discount">{{ formatPrice(discountPrice) }}</span>
                </div>
              </div>
            </div>

            <!-- Правая колонка: информация -->
            <div class="modal-info-section">
              <!-- Рейтинг -->
              <div class="modal-rating" v-if="(product?.avgRating ?? 0) > 0">
                <div class="modal-rating-stars">
                  <svg v-for="i in 5" :key="i" width="16" height="16" viewBox="0 0 24 24" :class="{ filled: i <= Math.round(product?.avgRating ?? 0) }">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <span class="modal-rating-value">{{ (product?.avgRating ?? 0).toFixed(1) }}</span>
                <span class="modal-rating-count">({{ product?.reviewCount ?? 0 }} отзывов)</span>
              </div>

              <h2 class="modal-title">{{ product?.name }}</h2>

              <div v-if="!hasDiscount" class="modal-price">{{ formatPrice(product?.price || 0) }}</div>
              <div v-else class="modal-price modal-price--discount-row">
                <span class="modal-price-discounted">{{ formatPrice(discountPrice) }}</span>
                <span class="modal-price-old">{{ formatPrice(product?.price || 0) }}</span>
                <span class="modal-price-save">Экономия {{ formatPrice((product?.price || 0) - (product?.discountPrice || 0)) }}</span>
              </div>

              <!-- Краткие характеристики в чипсах -->
              <div v-if="hasChips" class="modal-chips">
                <span v-if="product?.weight" class="chip">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/></svg>
                  {{ product.weight }}
                </span>
                <span v-if="product?.manufacturer" class="chip chip--brand">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                  {{ product.manufacturer }}
                </span>
                <span v-if="product?.country" class="chip chip--country">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  {{ product.country }}
                </span>
              </div>

              <!-- Вкладки: Описание, Характеристики, Состав, Отзывы -->
              <div class="modal-tabs">
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  class="modal-tab"
                  :class="{ active: activeTab === tab.id }"
                  @click="activeTab = tab.id"
                >
                  {{ tab.label }}
                </button>
              </div>

              <div class="modal-tab-content">
                <!-- Описание -->
                <div v-if="activeTab === 'description'" class="tab-panel">
                  <p v-if="product?.description" class="tab-description-text">{{ product.description }}</p>
                  <p v-else class="tab-empty">Описание отсутствует</p>
                </div>

                <!-- Характеристики -->
                <div v-if="activeTab === 'chars'" class="tab-panel">
                  <div v-if="hasChars" class="chars-grid">
                    <div v-if="product?.manufacturer" class="char-item">
                      <span class="char-item__label">Производитель</span>
                      <span class="char-item__value">{{ product.manufacturer }}</span>
                    </div>
                    <div v-if="product?.country" class="char-item">
                      <span class="char-item__label">Страна</span>
                      <span class="char-item__value">{{ product.country }}</span>
                    </div>
                    <div v-if="product?.shelfLife" class="char-item">
                      <span class="char-item__label">Срок хранения</span>
                      <span class="char-item__value">{{ product.shelfLife }}</span>
                    </div>
                    <div v-if="product?.weight" class="char-item">
                      <span class="char-item__label">Вес / объём</span>
                      <span class="char-item__value">{{ product.weight }}</span>
                    </div>
                  </div>
                  <p v-else class="tab-empty">Характеристики не указаны</p>
                </div>

                <!-- Состав -->
                <div v-if="activeTab === 'composition'" class="tab-panel">
                  <div v-if="product?.composition" class="composition-section">
                    <p class="composition-text">{{ product.composition }}</p>
                    <!-- Пищевая ценность -->
                    <div v-if="hasNutrition" class="nutrition-grid">
                      <div class="nutrition-header">Пищевая ценность на 100 г</div>
                      <div v-if="product?.calories !== undefined" class="nutrition-item">
                        <span class="nutrition-value">{{ product.calories }}</span>
                        <span class="nutrition-label">ккал</span>
                      </div>
                      <div v-if="product?.proteins !== undefined" class="nutrition-item">
                        <span class="nutrition-value">{{ product.proteins }} г</span>
                        <span class="nutrition-label">Белки</span>
                      </div>
                      <div v-if="product?.fats !== undefined" class="nutrition-item">
                        <span class="nutrition-value">{{ product.fats }} г</span>
                        <span class="nutrition-label">Жиры</span>
                      </div>
                      <div v-if="product?.carbohydrates !== undefined" class="nutrition-item">
                        <span class="nutrition-value">{{ product.carbohydrates }} г</span>
                        <span class="nutrition-label">Углеводы</span>
                      </div>
                    </div>
                  </div>
                  <p v-else class="tab-empty">Состав не указан</p>
                </div>

                <!-- Отзывы -->
                <div v-if="activeTab === 'reviews'" class="tab-panel tab-panel--reviews">
                  <ProductReviews :product-id="product?.id || ''" :is-authenticated="authStore.isAuthenticated" />
                </div>
              </div>

              <!-- Статус наличия -->
              <div class="modal-stock">
                <div class="stock-indicator" :class="{ 'low-stock': !product?.inStock }">
                  <span class="stock-dot" :class="{ available: product?.inStock }"></span>
                  <span class="stock-text">
                    {{ product?.inStock ? 'В наличии' : 'Временно отсутствует' }}
                  </span>
                </div>
              </div>

              <!-- Кнопки действий -->
              <div class="modal-actions">
                <button v-if="product?.inStock" class="modal-btn modal-btn--cart" @click="addToCart" :class="{ 'in-cart': isInCartNow }">
                  <span class="btn-icon">
                    <svg v-if="!isInCartNow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                    <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  <span>{{ isInCartNow ? 'В корзине ✓' : 'В корзину' }}</span>
                </button>
                <router-link v-if="product?.inStock" to="/cart" class="modal-btn modal-btn--checkout" @click="closeModal">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  Оформить заказ
                </router-link>
                <button
                  v-if="!product?.inStock && authStore.isAuthenticated"
                  @click="handleNotify"
                  class="modal-btn modal-btn--notify"
                  :class="{ subscribed: isSubscribed }"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                  {{ isSubscribed ? '✓ Подписка оформлена' : 'Сообщить когда появится' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useAuthStore } from '../../stores/auth.store';
import { useCart } from '../../stores/cart.store';
import { notificationsApi } from '../../api/notifications.api';
import ProductReviews from './ProductReviews.vue';

interface CatalogProduct {
  id: string; name: string; price: number; weight?: string; calories?: number;
  proteins?: number; fats?: number; carbohydrates?: number; manufacturer?: string;
  description?: string; imageUrl?: string; inStock: boolean; deliveryDate?: string;
  composition?: string; country?: string; shelfLife?: string;
  discountPrice?: number; discountUntil?: string; isPromo?: boolean;
  avgRating?: number; reviewCount?: number;
}

const props = defineProps<{
  product: CatalogProduct | null;
  isOpen: boolean;
}>();

const emit = defineEmits<{ close: [] }>();

const authStore = useAuthStore();
const { addItem, isInCart } = useCart();
const isSubscribed = ref(false);
const activeTab = ref('description');

const isInCartNow = computed(() => props.product ? isInCart(props.product.id) : false);

const hasDiscount = computed(() => {
  return !!(props.product?.discountPrice && props.product.discountPrice > 0);
});

const discountPrice = computed(() => {
  return props.product?.discountPrice || props.product?.price || 0;
});

const discountPercent = computed(() => {
  if (!hasDiscount.value || !props.product?.discountPrice) return 0;
  return Math.round((1 - props.product.discountPrice / props.product.price) * 100);
});

const tabs = computed(() => {
  const result = [
    { id: 'description', label: 'Описание' },
    { id: 'chars', label: 'Характеристики' },
    { id: 'composition', label: 'Состав' },
    { id: 'reviews', label: `Отзывы${props.product?.reviewCount ? ` (${props.product.reviewCount})` : ''}` },
  ];
  return result;
});

const hasNutrition = computed(() => {
  if (!props.product) return false;
  return props.product.calories !== undefined || props.product.proteins !== undefined ||
         props.product.fats !== undefined || props.product.carbohydrates !== undefined;
});

const hasChars = computed(() => {
  if (!props.product) return false;
  return !!(props.product.manufacturer || props.product.country || props.product.shelfLife || props.product.weight);
});

const hasChips = computed(() => {
  if (!props.product) return false;
  return !!(props.product.weight || props.product.manufacturer || props.product.country);
});

function addToCart() {
  if (!props.product) return;
  addItem({
    id: props.product.id,
    name: props.product.name,
    price: props.product.discountPrice || props.product.price,
    imageUrl: props.product.imageUrl,
    weight: props.product.weight,
  });
}

watch(() => props.product, async (newProduct) => {
  activeTab.value = 'description';
  if (newProduct && authStore.isAuthenticated && !newProduct.inStock) {
    try {
      const result = await notificationsApi.checkSubscription(newProduct.id);
      isSubscribed.value = result.isSubscribed;
    } catch (error) { console.error('Ошибка проверки подписки:', error); }
  }
}, { immediate: true });

function formatPrice(price: number): string { return `${price.toLocaleString('ru-RU')}₽`; }
function closeModal() { emit('close'); }

async function handleNotify() {
  if (!authStore.isAuthenticated || !props.product) return;
  try {
    if (isSubscribed.value) { await notificationsApi.unsubscribe(props.product.id); isSubscribed.value = false; }
    else { await notificationsApi.subscribe(props.product.id); isSubscribed.value = true; }
  } catch (error) { console.error('Ошибка подписки/отписки:', error); }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  z-index: 2000; padding: 20px;
}
.modal-container {
  background: var(--color-surface);
  border-radius: 20px;
  max-width: 1100px; width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 25px 60px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.06);
}
.modal-close {
  position: absolute; top: 14px; right: 14px; z-index: 10;
  background: rgba(0,0,0,0.05); border: none;
  border-radius: 50%; width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--color-text-muted);
  transition: all var(--transition-fast);
  backdrop-filter: blur(8px);
}
.modal-close:hover { background: var(--color-error); color: #fff; transform: scale(1.1); }
.modal-close svg { width: 20px; height: 20px; }

/* ===== Основная сетка: фото + информация ===== */
.modal-content {
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 0;
  padding: 0;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* ===== Левая колонка: фото ===== */
.modal-image-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background: #ffffff;
  border-radius: 20px 0 0 20px;
  overflow: hidden;
}
.modal-image-wrapper {
  width: 100%;
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  margin-bottom: 16px;
}
.modal-image-bg {
  position: absolute;
  inset: 0;
}
.modal-image-bg-shape {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(211,84,0,0.08) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.modal-image {
  position: relative;
  max-width: 100%;
  max-height: 360px;
  object-fit: contain;
  border-radius: var(--radius-md);
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.08));
  transition: transform 0.3s ease;
}
.modal-image-wrapper:hover .modal-image {
  transform: scale(1.05);
}

/* ===== Бейдж в модалке ===== */
.modal-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 14px 7px;
  border-radius: 12px;
  font-family: var(--font-heading);
  line-height: 1.1;
}
.badge--large {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: #fff;
  box-shadow: 0 2px 16px rgba(231,76,60,0.35);
}
.modal-badge--promo {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 2px 16px rgba(245,158,11,0.35);
}
.modal-badge__value {
  font-weight: 800;
  font-size: 18px;
  letter-spacing: 0.5px;
}
.modal-badge__label {
  font-weight: 500;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.85;
}

/* ===== Сравнение цен ===== */
.modal-price-compare {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255,255,255,0.7);
  border-radius: 14px;
  border: 1px solid rgba(0,0,0,0.04);
  width: 100%;
}
.price-compare-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: center;
  flex: 1;
}
.price-compare-item--highlight {
  background: rgba(16,185,129,0.06);
  border-radius: 10px;
  padding: 6px 12px;
}
.price-compare__label {
  font-size: 10px;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.price-compare__value {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 18px;
}
.price-compare__value--old {
  color: #94a3b8;
  text-decoration: line-through;
}
.price-compare__value--discount {
  color: #e74c3c;
}
.price-compare-arrow {
  color: var(--color-primary-light);
  flex-shrink: 0;
}

/* ===== Правая колонка: информация ===== */
.modal-info-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 28px 28px 24px 20px;
  min-width: 0;
  overflow-y: auto;
  min-height: 0;
}

/* Rating */
.modal-rating {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 2px;
}
.modal-rating-stars {
  display: flex;
  gap: 2px;
}
.modal-rating-stars svg {
  fill: #e2e8f0;
  stroke: #e2e8f0;
}
.modal-rating-stars svg.filled {
  fill: #ffb400;
  stroke: #ffb400;
}
.modal-rating-value {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 15px;
  color: var(--color-text);
}
.modal-rating-count {
  font-size: 13px;
  color: var(--color-text-muted);
}

.modal-title {
  font-family: var(--font-display);
  font-size: 28px;
  color: var(--color-text);
  margin: 0;
  line-height: 1.2;
  text-align: left;
  padding-right: 40px;
}

/* Price */
.modal-price {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 32px;
  color: var(--color-text);
  text-align: left;
}
.modal-price--discount-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
}
.modal-price-discounted {
  color: #e74c3c;
}
.modal-price-old {
  font-size: 18px;
  color: #94a3b8;
  text-decoration: line-through;
  font-weight: 500;
}
.modal-price-save {
  font-size: 12px;
  color: #10b981;
  font-weight: 600;
  width: 100%;
}

/* ===== Chips ===== */
.modal-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  background: #f1f5f9;
  border-radius: 20px;
  font-size: 12px;
  color: #475569;
  font-family: var(--font-body);
  font-weight: 500;
  transition: all 0.2s ease;
}
.chip:hover {
  background: #e2e8f0;
}
.chip svg {
  opacity: 0.6;
}

/* ===== Tabs ===== */
.modal-tabs {
  display: flex;
  gap: 2px;
  border-bottom: 1px solid #e2e8f0;
  margin-top: 4px;
  overflow-x: auto;
  scrollbar-width: none;
}
.modal-tabs::-webkit-scrollbar { display: none; }

.modal-tab {
  all: unset;
  cursor: pointer;
  padding: 10px 16px;
  font-family: var(--font-heading);
  font-weight: 500;
  font-size: 13px;
  color: #94a3b8;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.modal-tab:hover {
  color: var(--color-text-secondary);
}
.modal-tab.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
  font-weight: 600;
}

.modal-tab-content {
  min-height: 100px;
  max-height: 260px;
  overflow-y: auto;
}

.tab-panel {
  padding: 12px 0;
}
.tab-panel--reviews {
  max-height: 400px;
  overflow-y: auto;
}

.tab-description-text {
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text-secondary);
  margin: 0;
}

.tab-empty {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--color-text-muted);
  text-align: center;
  padding: 20px 0;
}

/* ===== Chars Grid ===== */
.chars-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.char-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 10px;
}
.char-item__label {
  font-size: 11px;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.char-item__value {
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 14px;
  color: var(--color-text);
}

/* ===== Composition ===== */
.composition-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.composition-text {
  font-family: var(--font-body);
  font-size: 13px;
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin: 0;
}

.nutrition-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 14px;
  background: #f8f9fa;
  border-radius: 12px;
}
.nutrition-header {
  grid-column: 1 / -1;
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 12px;
  color: var(--color-text);
  margin-bottom: 4px;
}
.nutrition-item {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.nutrition-value {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 16px;
  color: var(--color-text);
}
.nutrition-label {
  font-size: 10px;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ===== Stock ===== */
.modal-stock { }
.stock-indicator {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: #ecfdf5;
  border-radius: 20px;
  border: 1px solid #10b981;
  width: fit-content;
}
.stock-indicator.low-stock {
  background: #fff7ed;
  border-color: #f97316;
}
.stock-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #94a3b8;
}
.stock-dot.available {
  background: #10b981;
  box-shadow: 0 0 8px rgba(16,185,129,0.4);
}
.stock-text {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 13px;
  color: #065f46;
  white-space: nowrap;
}
.stock-indicator.low-stock .stock-text { color: #9a3412; }

/* ===== Actions ===== */
.modal-actions {
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-top: 4px;
}
.modal-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex: none;
  padding: 12px 24px;
  border-radius: 14px;
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  border: none;
  text-decoration: none;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}
.modal-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%);
  pointer-events: none;
}
.modal-btn--cart {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #fff;
  box-shadow: 0 2px 8px rgba(245,158,11,0.25);
  flex: 1;
}
.modal-btn--cart:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245,158,11,0.35);
}
.modal-btn--cart:active {
  transform: translateY(0) scale(0.97);
}
.modal-btn--cart.in-cart {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 2px 8px rgba(16,185,129,0.25);
}
.modal-btn--checkout {
  background: var(--color-primary);
  color: #fff;
  box-shadow: 0 4px 14px rgba(211,84,0,0.25);
  flex: 1;
}
.modal-btn--checkout:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(211,84,0,0.35);
}
.modal-btn--checkout:active {
  transform: translateY(0) scale(0.97);
}
.modal-btn--notify {
  width: 100%;
  background: rgba(245,158,11,0.08);
  color: #92400e;
  border: 1px solid rgba(245,158,11,0.25);
}
.modal-btn--notify:hover {
  background: rgba(245,158,11,0.15);
  border-color: #f59e0b;
}
.modal-btn--notify.subscribed {
  background: rgba(16,185,129,0.08);
  color: #065f46;
  border-color: rgba(16,185,129,0.25);
}
.btn-icon {
  display: flex;
  align-items: center;
}
.modal-btn--cart:hover .btn-icon {
  animation: cartBounce 0.4s ease;
}
@keyframes cartBounce {
  0% { transform: scale(1); }
  40% { transform: scale(1.25); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); }
}

/* ===== Modal Transition ===== */
.modal-enter-active, .modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-active .modal-container, .modal-leave-active .modal-container { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-container { transform: scale(0.92) translateY(20px); }
.modal-leave-to .modal-container { transform: scale(0.95) translateY(10px); }

/* ===== Responsive ===== */
@media (max-width: 900px) {
  .modal-content { grid-template-columns: 300px 1fr; }
  .modal-image-section { padding: 20px; }
  .modal-image-wrapper { min-height: 0; }
  .modal-image { max-height: 280px; }
  .modal-info-section { padding: 20px 20px 16px 16px; }
  .modal-title { font-size: 24px; }
  .modal-price { font-size: 28px; }
}

@media (max-width: 768px) {
  .modal-content { grid-template-columns: 1fr; gap: 0; padding: 0; }
  .modal-image-section { border-radius: 20px 20px 0 0; padding: 20px 20px 16px; }
  .modal-image-wrapper { min-height: 0; }
  .modal-image { max-height: 240px; }
  .modal-info-section { padding: 0 20px 20px; }
  .modal-title { font-size: 22px; padding-right: 40px; }
  .modal-price { font-size: 26px; }
  .modal-actions { flex-direction: column; }
  .modal-btn { width: 100%; padding: 12px 18px; }
  .chars-grid { grid-template-columns: 1fr; }
  .nutrition-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 480px) {
  .modal-overlay { padding: 10px; }
  .modal-container { border-radius: 16px; }
  .modal-image-section { padding: 16px; }
  .modal-image-wrapper { min-height: 0; }
  .modal-image { max-height: 200px; }
  .modal-info-section { padding: 0 14px 14px; gap: 10px; }
  .modal-title { font-size: 20px; }
  .modal-price { font-size: 24px; }
  .modal-tab { padding: 8px 12px; font-size: 12px; }
  .modal-actions { flex-direction: column; }
  .modal-btn { width: 100%; }
}
</style>