<template>
  <article
    class="product-card stagger-item"
    :class="{
      'product-card--out': !product.inStock,
      'product-card--discount': hasDiscount
    }"
    @click="openDetail"
  >
    <div class="product-card__glow" aria-hidden="true"></div>

    <div class="product-card__image-wrapper">
      <div class="product-card__image-bg"></div>

      <div class="product-card__image-wrap">
        <button
          class="favorite-btn"
          :class="{ active: isFav }"
          @click.stop="toggleFav"
          :aria-label="isFav ? 'Убрать из избранного' : 'Добавить в избранное'"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span class="fav-tooltip">{{ isFav ? 'Убрать' : 'В избранное' }}</span>
        </button>

        <img
          :src="product.imageUrl || '/images/products/placeholder.svg'"
          :alt="product.name"
          class="product-card__image"
          loading="lazy"
        />
      </div>

      <!-- Бейдж скидки -->
      <div v-if="discountPercent" class="badge badge--discount">
        <span class="badge__value">-{{ discountPercent }}%</span>
        <span class="badge__label">скидка</span>
      </div>

      <!-- Бейдж акции -->
      <div v-else-if="product.isPromo" class="badge badge--promo">
        <span class="badge__value">АКЦИЯ</span>
      </div>

      <!-- Нет в наличии -->
      <div v-if="!product.inStock" class="product-card__out-overlay">
        <span class="out-badge">Нет в наличии</span>
      </div>
    </div>

    <div class="product-card__content">
      <div class="product-card__rating" v-if="(product.avgRating ?? 0) > 0">
        <div class="rating-stars">
          <svg v-for="i in 5" :key="i" width="14" height="14" viewBox="0 0 24 24" :class="{ filled: i <= Math.round(product.avgRating ?? 0) }">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
        <span class="rating-value">{{ (product.avgRating ?? 0).toFixed(1) }}</span>
        <span class="rating-count">({{ product.reviewCount ?? 0 }})</span>
      </div>

      <h3 class="product-card__title">{{ product.name }}</h3>
      <p v-if="product.weight" class="product-card__weight">{{ product.weight }}</p>

      <p v-if="product.description" class="product-card__desc">{{ truncate(product.description, 80) }}</p>

      <div class="product-card__price">
        <div class="price-block">
          <span v-if="hasDiscount" class="price-old">{{ formatPrice(product.price) }}</span>
          <span class="price-current" :class="{ 'price-discount': hasDiscount }">{{ formatPrice(currentPrice) }}</span>
        </div>
        <div v-if="hasDiscount" class="price-saved">Экономия {{ formatPrice(product.price - (product.discountPrice || product.price)) }}</div>
      </div>

      <div class="product-card__actions">
        <button
          v-if="product.inStock"
          class="product-card__btn product-card__btn--cart"
          @click.stop="addToCart"
          :class="{ 'in-cart': isInCartNow }"
        >
          <span class="btn-cart-icon">
            <svg v-if="!isInCartNow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </span>
          <span class="btn-cart-text">{{ isInCartNow ? 'В корзине' : 'В корзину' }}</span>
        </button>
        <button class="product-card__btn product-card__btn--detail" @click.stop="openDetail">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          <span>Подробнее</span>
        </button>
      </div>

      <button
        v-if="!product.inStock && authStore.isAuthenticated"
        @click.stop="handleNotify"
        class="product-card__notify-btn"
        :class="{ subscribed: isSubscribed }"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        {{ isSubscribed ? '✓ Подписка оформлена' : 'Сообщить когда появится' }}
      </button>
    </div>

    <div class="product-card__shimmer" aria-hidden="true"></div>
  </article>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth.store';
import { useFavorites } from '../../stores/favorites.store';
import { useCart } from '../../stores/cart.store';
import { notificationsApi } from '../../api/notifications.api';

interface Product {
  id: string; name: string; price: number; weight?: string; imageUrl?: string;
  inStock: boolean; description?: string; categoryId: string; deliveryDate?: string;
  composition?: string; manufacturer?: string; country?: string; shelfLife?: string;
  calories?: number; proteins?: number; fats?: number; carbohydrates?: number;
  discountPrice?: number; discountUntil?: string; isPromo?: boolean;
  avgRating?: number; reviewCount?: number;
}

const props = defineProps<{ product: Product }>();
const emit = defineEmits<{ 'open-modal': [product: Product] }>();

const authStore = useAuthStore();
const { isFavorite, toggle } = useFavorites();
const { addItem, isInCart } = useCart();

const isFav = computed(() => isFavorite(props.product.id));
const isInCartNow = computed(() => isInCart(props.product.id));
const isSubscribed = ref(false);

const hasDiscount = computed(() => {
  return !!(props.product.discountPrice && props.product.discountPrice > 0);
});

const currentPrice = computed(() => {
  return hasDiscount.value ? (props.product.discountPrice || props.product.price) : props.product.price;
});

const discountPercent = computed(() => {
  if (!hasDiscount.value || !props.product.discountPrice) return 0;
  return Math.round((1 - props.product.discountPrice / props.product.price) * 100);
});

function toggleFav() {
  toggle({
    id: props.product.id,
    name: props.product.name,
    price: props.product.price,
    imageUrl: props.product.imageUrl,
    inStock: props.product.inStock,
    description: props.product.description,
    composition: props.product.composition,
    manufacturer: props.product.manufacturer,
    country: props.product.country,
    shelfLife: props.product.shelfLife,
    weight: props.product.weight,
    calories: props.product.calories,
    proteins: props.product.proteins,
    fats: props.product.fats,
    carbohydrates: props.product.carbohydrates,
    discountPrice: props.product.discountPrice,
    discountUntil: props.product.discountUntil,
    isPromo: props.product.isPromo,
    avgRating: props.product.avgRating,
    reviewCount: props.product.reviewCount,
  });
}

function addToCart() {
  addItem({ id: props.product.id, name: props.product.name, price: currentPrice.value, imageUrl: props.product.imageUrl, weight: props.product.weight });
}

function openDetail() {
  emit('open-modal', props.product);
}

function formatPrice(p: number) { return `${p.toLocaleString('ru-RU')}₽`; }
function truncate(text: string, max: number) { return text.length > max ? text.slice(0, max) + '…' : text; }

async function handleNotify() {
  if (!authStore.isAuthenticated) return;
  try {
    if (isSubscribed.value) {
      await notificationsApi.unsubscribe(props.product.id);
      isSubscribed.value = false;
    } else {
      await notificationsApi.subscribe(props.product.id);
      isSubscribed.value = true;
    }
  } catch (error) { console.error('Ошибка подписки/отписки:', error); }
}

onMounted(async () => {
  if (authStore.isAuthenticated && !props.product.inStock) {
    try { const r = await notificationsApi.checkSubscription(props.product.id); isSubscribed.value = r.isSubscribed; } catch (error) { console.error('Ошибка проверки подписки:', error); }
  }
});
</script>

<style scoped>
.product-card {
  position: relative;
  width: 100%;
  background: var(--color-surface);
  border-radius: 16px;
  border: 1px solid var(--color-border);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all var(--transition-bounce);
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 4px 12px rgba(0, 0, 0, 0.03);
}

.product-card__glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at 30% 20%,
    rgba(211, 84, 0, 0.03) 0%,
    transparent 60%
  );
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--transition-slow);
  z-index: 0;
}

.product-card:hover .product-card__glow {
  opacity: 1;
}

.product-card:hover {
  transform: translateY(-14px) scale(1.02) rotate(0.5deg);
  box-shadow:
    0 25px 50px rgba(211, 84, 0, 0.15),
    0 8px 25px rgba(211, 84, 0, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.04);
  border-color: rgba(211, 84, 0, 0.25);
}

.product-card:active {
  transform: translateY(-6px) scale(0.98);
}

.product-card--out {
  opacity: 0.7;
}

.product-card--out:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
  border-color: var(--color-border);
}

.product-card__shimmer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    105deg,
    transparent 30%,
    rgba(255, 255, 255, 0.15) 45%,
    rgba(255, 255, 255, 0.25) 50%,
    rgba(255, 255, 255, 0.15) 55%,
    transparent 70%
  );
  background-size: 200% 100%;
  opacity: 0;
  transition: opacity var(--transition-slow);
  z-index: 2;
}

.product-card:hover .product-card__shimmer {
  opacity: 1;
  animation: shimmerSlide 1.2s ease-in-out;
}

@keyframes shimmerSlide {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ===== Image Wrapper ===== */
.product-card__image-wrapper {
  position: relative;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  overflow: hidden;
  z-index: 1;
}

/* Белый фон под изображением */
.product-card__image-bg {
  position: absolute;
  inset: 0;
  background: #ffffff;
  z-index: 0;
}

.product-card__image-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  z-index: 1;
  min-height: 0;
}

.product-card__image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform var(--transition-bounce);
}

.product-card:hover .product-card__image {
  transform: scale(1.08);
}

/* ===== Favorite Button ===== */
.favorite-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  color: #cbd5e1;
  transition: all var(--transition-bounce);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.favorite-btn:hover {
  transform: scale(1.15);
  color: #e74c3c;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 16px rgba(231, 76, 60, 0.2);
}

.favorite-btn.active {
  color: #e74c3c;
  background: #fff;
  box-shadow: 0 2px 12px rgba(231, 76, 60, 0.25);
}

.favorite-btn.active svg {
  fill: #e74c3c;
  animation: heartPop var(--transition-bounce);
}

@keyframes heartPop {
  0% { transform: scale(0); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

.fav-tooltip {
  position: absolute;
  top: -28px;
  right: -4px;
  background: rgba(15, 23, 42, 0.8);
  color: #fff;
  font-size: 10px;
  font-family: var(--font-body);
  padding: 3px 8px;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  transform: translateY(4px);
  transition: all var(--transition-fast);
  pointer-events: none;
}

.favorite-btn:hover .fav-tooltip {
  opacity: 1;
  transform: translateY(0);
}

/* ===== Badges ===== */
.badge {
  position: absolute;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 12px 5px;
  border-radius: 10px;
  font-family: var(--font-heading);
  line-height: 1.1;
  animation: badgeIn var(--transition-bounce) both;
}

.badge--discount {
  top: 10px;
  left: 10px;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: #fff;
  box-shadow: 0 2px 12px rgba(231, 76, 60, 0.35);
}

.badge--promo {
  top: 10px;
  left: 10px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #fff;
  box-shadow: 0 2px 12px rgba(245, 158, 11, 0.35);
}

.badge__value {
  font-weight: 800;
  font-size: 15px;
  letter-spacing: 0.5px;
}

.badge__label {
  font-weight: 500;
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.85;
}

@keyframes badgeIn {
  0% { opacity: 0; transform: scale(0.5) translateX(-10px); }
  100% { opacity: 1; transform: scale(1) translateX(0); }
}

/* ===== Out of Stock Overlay ===== */
.product-card__out-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
}

.out-badge {
  background: rgba(231, 76, 60, 0.9);
  color: #fff;
  padding: 8px 18px;
  border-radius: 20px;
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.5px;
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 16px rgba(231, 76, 60, 0.3);
}

/* ===== Content ===== */
.product-card__content {
  position: relative;
  z-index: 1;
  padding: 16px 18px 18px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.product-card__rating {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 6px;
}

.rating-stars {
  display: flex;
  gap: 1px;
}

.rating-stars svg {
  fill: #e2e8f0;
  stroke: #e2e8f0;
  transition: all var(--transition-fast);
}

.rating-stars svg.filled {
  fill: #ffb400;
  stroke: #ffb400;
}

.rating-value {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 13px;
  color: var(--color-text);
  margin-left: 2px;
}

.rating-count {
  font-size: 11px;
  color: var(--color-text-muted);
  font-family: var(--font-body);
}

.product-card__title {
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 16px;
  color: var(--color-text);
  margin-bottom: 2px;
  line-height: 1.3;
  transition: color var(--transition-fast);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-card:hover .product-card__title {
  color: var(--color-primary);
}

.product-card__weight {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-bottom: 4px;
  font-family: var(--font-body);
}

.product-card__desc {
  font-family: var(--font-body);
  font-size: 12px;
  line-height: 1.45;
  color: var(--color-text-muted);
  margin: 0 0 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-card__price {
  margin-bottom: 14px;
  margin-top: auto;
}

.price-block {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.price-old {
  font-size: 13px;
  color: var(--color-text-muted);
  text-decoration: line-through;
  font-family: var(--font-heading);
}

.price-current {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 22px;
  color: var(--color-text);
  line-height: 1.1;
  letter-spacing: -0.5px;
}

.price-discount {
  color: #e74c3c;
}

.price-saved {
  font-size: 10px;
  color: #10b981;
  font-weight: 600;
  font-family: var(--font-body);
  margin-top: 2px;
}

.product-card__actions {
  display: flex;
  gap: 8px;
}

.product-card__btn {
  flex: 1;
  height: 42px;
  border-radius: 12px;
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all var(--transition-bounce);
  position: relative;
  overflow: hidden;
}

.product-card__btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%);
  pointer-events: none;
}

.product-card__btn--cart {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #fff;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.25);
}

.product-card__btn--cart:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.35);
}

.product-card__btn--cart:active {
  transform: translateY(0) scale(0.97);
}

.product-card__btn--cart.in-cart {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
}

.product-card__btn--cart.in-cart:hover {
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.35);
}

.btn-cart-icon {
  display: flex;
  align-items: center;
  transition: transform var(--transition-fast);
}

.product-card__btn--cart:hover .btn-cart-icon {
  animation: cartBounce var(--transition-bounce);
}

@keyframes cartBounce {
  0% { transform: scale(1); }
  40% { transform: scale(1.2); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); }
}

.product-card__btn--detail {
  background: var(--color-surface);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.product-card__btn--detail:hover {
  background: #f8f9fa;
  border-color: var(--color-primary-light);
  color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.product-card__btn--detail:active {
  transform: translateY(0) scale(0.97);
}

.product-card__notify-btn {
  width: 100%;
  height: 38px;
  margin-top: 8px;
  background: rgba(245, 158, 11, 0.08);
  color: #92400e;
  border: 1px solid rgba(245, 158, 11, 0.25);
  border-radius: 12px;
  font-family: var(--font-heading);
  font-weight: 500;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all var(--transition-fast);
}

.product-card__notify-btn:hover {
  background: rgba(245, 158, 11, 0.15);
  border-color: #f59e0b;
}

.product-card__notify-btn.subscribed {
  background: rgba(16, 185, 129, 0.08);
  color: #065f46;
  border-color: rgba(16, 185, 129, 0.25);
}

.product-card__notify-btn.subscribed:hover {
  background: rgba(16, 185, 129, 0.15);
  border-color: #10b981;
}

@media (max-width: 480px) {
  .product-card__image-wrapper {
    height: 180px;
    padding: 8px;
  }

  .product-card__content {
    padding: 12px 14px 14px;
  }

  .product-card__btn {
    height: 38px;
    font-size: 12px;
    border-radius: 10px;
  }

  .price-current {
    font-size: 19px;
  }

  .product-card__title {
    font-size: 14px;
  }

  .badge__value {
    font-size: 13px;
  }
}
</style>