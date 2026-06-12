<template>
  <div class="cart-page">
    <section class="section">
      <div class="container">
        <!-- Заголовок -->
        <div class="cart-header">
          <h2 class="section-title">🛒 Корзина</h2>
          <transition name="fade">
            <span v-if="cartItems.length > 0" class="cart-header__count">{{ cartCount }} {{ pluralize(cartCount) }}</span>
          </transition>
        </div>

        <!-- Пустая корзина -->
        <transition name="empty" mode="out-in">
          <div v-if="cartItems.length === 0" class="empty-cart" key="empty">
            <div class="empty-cart__illustration">
              <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="100" r="90" fill="var(--color-primary-soft)" opacity="0.5"/>
                <path d="M60 70h80l-10 60H70l-10-60z" fill="var(--color-primary-light)" opacity="0.3"/>
                <circle cx="80" cy="150" r="8" fill="var(--color-primary)" opacity="0.4"/>
                <circle cx="120" cy="150" r="8" fill="var(--color-primary)" opacity="0.4"/>
                <circle class="float-particle p1" cx="50" cy="60" r="4" fill="var(--color-accent)" opacity="0.5"/>
                <circle class="float-particle p2" cx="150" cy="50" r="3" fill="var(--color-primary-light)" opacity="0.4"/>
                <circle class="float-particle p3" cx="140" cy="80" r="5" fill="var(--color-primary)" opacity="0.2"/>
                <circle class="float-particle p4" cx="40" cy="110" r="3.5" fill="var(--color-accent)" opacity="0.3"/>
              </svg>
            </div>
            <h3 class="empty-cart__title">Ваша корзина пуста</h3>
            <p class="empty-cart__text">Вдохновляйтесь нашими свежими продуктами<br>и добавьте что-нибудь вкусное!</p>
            <router-link to="/catalog" class="empty-cart__btn">
              <span>Перейти в каталог</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
            </router-link>
          </div>

          <!-- Наполненная корзина -->
          <div v-else class="cart-layout" key="full">
            <!-- Левая колонка: товары -->
            <div class="cart-items">
              <div
                v-for="(item, index) in cartItems"
                :key="item.id"
                class="cart-item"
                :class="{ 'cart-item--removing': removingId === item.id, 'cart-item--added': recentAddedId === item.id }"
                :style="{ '--delay': index * 0.05 + 's' }"
              >
                <!-- Чекбокс -->
                <label class="cart-item__checkbox">
                  <input type="checkbox" v-model="selectedIds" :value="item.id" class="checkbox-input">
                  <span class="checkbox-custom"></span>
                </label>

                <!-- Изображение -->
                <div class="cart-item__img-wrap">
                  <img :src="item.imageUrl || '/images/products/placeholder.svg'" :alt="item.name" class="cart-item__img" loading="lazy">
                </div>

                <!-- Информация -->
                <div class="cart-item__info">
                  <h4 class="cart-item__name">{{ item.name }}</h4>
                  <p v-if="item.weight" class="cart-item__weight">{{ item.weight }}</p>
                  <span class="cart-item__price">{{ formatPrice(item.price) }}</span>
                </div>

                <!-- Quantity stepper -->
                <div class="cart-item__qty">
                  <button @click="decreaseQuantity(item)" class="qty-btn" :disabled="item.quantity <= 1" :aria-label="'Уменьшить количество'">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/></svg>
                  </button>
                  <span class="qty-value" :key="item.quantity">{{ item.quantity }}</span>
                  <button @click="increaseQuantity(item)" class="qty-btn" :aria-label="'Увеличить количество'">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                  </button>
                </div>

                <!-- Итого за позицию -->
                <div class="cart-item__total">
                  <span class="cart-item__total-value" :key="'total-' + item.quantity">
                    {{ formatPrice(item.price * item.quantity) }}
                  </span>
                </div>

                <!-- Кнопка удаления -->
                <button @click="confirmRemove(item)" class="cart-item__remove" title="Удалить товар">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                </button>

                <!-- Undo уведомление -->
                <transition name="undo">
                  <div v-if="undoItem && undoItem.id === item.id" class="cart-item__undo" @click="undoRemove(item)">
                    <span>Удалено</span>
                    <button class="undo-btn">Отменить</button>
                  </div>
                </transition>
              </div>

              <!-- Выбор всех и массовые действия -->
              <div class="cart-bulk" v-if="cartItems.length > 0">
                <label class="cart-bulk__checkbox">
                  <input type="checkbox" :checked="allSelected" @change="toggleAll" class="checkbox-input">
                  <span class="checkbox-custom"></span>
                  <span>Выбрать всё</span>
                </label>
                <button v-if="selectedIds.length > 0" @click="removeSelected" class="cart-bulk__remove">
                  Удалить выбранные ({{ selectedIds.length }})
                </button>
              </div>
            </div>

            <!-- Правая колонка: итоги -->
            <div class="cart-sidebar">
              <!-- Free shipping progress -->
              <div class="cart-sidebar__card cart-sidebar__shipping">
                <div class="shipping-progress">
                  <div class="shipping-progress__icon">🚚</div>
                  <div v-if="freeShippingRemaining > 0" class="shipping-progress__text">
                    Ещё <strong>{{ formatPrice(freeShippingRemaining) }}</strong> до бесплатной доставки
                  </div>
                  <div v-else class="shipping-progress__text shipping-progress__text--free">
                    🎉 Бесплатная доставка!
                  </div>
                </div>
                <div class="shipping-progress__bar">
                  <div class="shipping-progress__fill" :style="{ width: freeShippingProgress + '%' }"></div>
                </div>
              </div>

              <!-- Промокод -->
              <div class="cart-sidebar__card cart-sidebar__promo">
                <div class="promo-input-wrap" :class="{ 'promo-input-wrap--success': promoApplied, 'promo-input-wrap--error': promoError }">
                  <input
                    v-model="promoCode"
                    @keyup.enter="applyPromo"
                    placeholder="Промокод"
                    class="promo-input"
                    :disabled="promoApplied"
                  >
                  <button
                    v-if="!promoApplied"
                    @click="applyPromo"
                    class="promo-apply"
                    :disabled="!promoCode.trim()"
                  >
                    Применить
                  </button>
                  <button v-else @click="removePromo" class="promo-remove">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
                  </button>
                </div>
                <transition name="fade">
                  <div v-if="promoApplied" class="promo-success">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                    <span>Промокод применён — скидка 10%</span>
                  </div>
                  <div v-else-if="promoError" class="promo-error">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6"/><path d="M9 9l6 6"/></svg>
                    <span>Неверный промокод</span>
                  </div>
                </transition>
              </div>

              <!-- Итого -->
              <div class="cart-sidebar__card cart-sidebar__summary">
                <div class="summary-row">
                  <span class="summary-row__label">Товары ({{ cartCount }} шт.)</span>
                  <span class="summary-row__value">{{ formatPrice(subtotal) }}</span>
                </div>
                <div v-if="discount > 0" class="summary-row summary-row--discount">
                  <span class="summary-row__label">Скидка</span>
                  <span class="summary-row__value">−{{ formatPrice(discount) }}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-row__label">Доставка</span>
                  <span class="summary-row__value" :class="{ 'summary-row__value--free': freeShippingProgress >= 100 }">
                    {{ freeShippingProgress >= 100 ? 'Бесплатно' : 'Рассчитывается' }}
                  </span>
                </div>
                <div class="summary-divider"></div>
                <div class="summary-row summary-row--total">
                  <span class="summary-row__label">Итого</span>
                  <span class="summary-row__value" :key="'total-' + cartTotal">{{ formatPrice(cartTotal) }}</span>
                </div>

                <!-- Secure badge -->
                <div class="secure-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  <span>Безопасная оплата</span>
                </div>

                <button @click="openOrderForm" class="checkout-btn pulse-glow">
                  <span>Оформить заказ</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                </button>

                <button @click="clearCart" class="clear-btn">Очистить корзину</button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </section>

    <!-- Мобильный sticky bottom bar -->
    <transition name="slide-up">
      <div v-if="cartItems.length > 0 && !showOrderForm" class="mobile-bottom-bar">
        <div class="mobile-bottom-bar__info">
          <span class="mobile-bottom-bar__total">{{ formatPrice(cartTotal) }}</span>
          <span class="mobile-bottom-bar__count">{{ cartCount }} {{ pluralize(cartCount) }}</span>
        </div>
        <button @click="openOrderForm" class="mobile-bottom-bar__btn pulse-glow">
          Оформить заказ
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </transition>

    <!-- ═══════════ МОДАЛКА ОФОРМЛЕНИЯ ═══════════ -->
    <teleport to="body">
      <transition name="modal">
        <div v-if="showOrderForm" class="modal-overlay" @click.self="closeOrderModal">
          <div class="modal-content" :class="{ 'modal-content--wide': orderStep >= 2 }">
            <button class="modal-close" @click="closeOrderModal" aria-label="Закрыть">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
            </button>

            <h3 class="modal-title">{{ modalTitle }}</h3>

            <!-- Step progress -->
            <div v-if="orderStep <= 3" class="step-progress">
              <div class="step-dot" :class="{ active: orderStep >= 1, done: orderStep > 1 }">
                <span v-if="orderStep > 1" class="step-dot__check">✓</span>
                <span v-else class="step-dot__num">1</span>
              </div>
              <div class="step-line" :class="{ active: orderStep >= 2 }"></div>
              <div class="step-dot" :class="{ active: orderStep >= 2, done: orderStep > 2 }">
                <span v-if="orderStep > 2" class="step-dot__check">✓</span>
                <span v-else class="step-dot__num">2</span>
              </div>
              <div class="step-line" :class="{ active: orderStep >= 3 }"></div>
              <div class="step-dot" :class="{ active: orderStep >= 3 }">
                <span class="step-dot__num">3</span>
              </div>
              <div class="step-labels">
                <span :class="{ active: orderStep >= 1 }">Данные</span>
                <span :class="{ active: orderStep >= 2 }">Оплата</span>
                <span :class="{ active: orderStep >= 3 }">Готово</span>
              </div>
            </div>

            <!-- ═══ Шаг 4: Успех ═══ -->
            <div v-if="orderStep === 4" class="order-success">
              <div class="order-success__animation">
                <svg class="success-check" width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="40" r="36" fill="var(--color-success)" opacity="0.1"/>
                  <circle class="success-check__circle" cx="40" cy="40" r="36" stroke="var(--color-success)" stroke-width="4" stroke-linecap="round"/>
                  <path class="success-check__path" d="M24 40l10 10 22-22" stroke="var(--color-success)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h4 class="order-success__title">Заказ оформлен!</h4>
              <p class="order-success__id">№ {{ orderSuccess?.id }}</p>
              <div class="order-success__payment">
                <template v-if="orderSuccess?.paymentMethod === 'cash'">
                  <span class="payment-icon">💵</span>
                  <span>Оплата наличными при получении</span>
                </template>
              </div>
              <p class="order-success__text">Мы свяжемся с вами в ближайшее время для подтверждения заказа.</p>
              <router-link to="/profile" class="order-success__btn" @click="showOrderForm = false">
                Перейти в профиль
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
              </router-link>
            </div>

            <!-- ═══ Шаг 1: Данные покупателя ═══ -->
            <form v-else-if="orderStep === 1" @submit.prevent="goToPayment" class="order-form">
              <div class="form-group form-group--floating" :data-filled="!!orderForm.name">
                <input v-model="orderForm.name" @input="onNameInput" type="text" required class="form-input">
                <label class="form-label">Ваше имя *</label>
                <div class="form-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
              </div>

              <div class="form-group form-group--floating" :data-filled="!!orderForm.phone">
                <input v-model="orderForm.phone" type="tel" required maxlength="18" class="form-input" @input="onPhoneInput" @blur="onPhoneBlur">
                <label class="form-label">Телефон *</label>
                <div class="form-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
              </div>

              <div class="form-group">
                <label class="address-label">Адрес доставки *</label>
                <AddressAutocomplete v-model="orderForm.address" />
              </div>

              <div class="form-group form-group--floating" :data-filled="!!orderForm.comment">
                <textarea v-model="orderForm.comment" rows="2" maxlength="500" class="form-input form-textarea"></textarea>
                <label class="form-label">Комментарий</label>
              </div>

              <div class="order-form__summary">
                <div class="order-form__summary-row">
                  <span>Товары ({{ cartCount }} шт.)</span>
                  <span>{{ formatPrice(subtotal) }}</span>
                </div>
                <div class="order-form__summary-row order-form__summary-row--total">
                  <span>Итого к оплате</span>
                  <span>{{ formatPrice(cartTotal) }}</span>
                </div>
              </div>

              <div class="modal-actions">
                <button type="button" @click="closeOrderModal" class="btn-cancel">Отмена</button>
                <button type="submit" class="btn-submit">
                  Продолжить
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            </form>

            <!-- ═══ Шаг 2: Выбор оплаты ═══ -->
            <div v-else-if="orderStep === 2" class="payment-step">
              <div class="payment-methods">
                <label class="payment-method" :class="{ active: paymentMethod === 'qr' }">
                  <input type="radio" v-model="paymentMethod" value="qr" class="payment-radio">
                  <div class="payment-method__content">
                    <span class="payment-method__icon">🟣</span>
                    <div>
                      <span class="payment-method__title">По QR-коду</span>
                      <span class="payment-method__desc">Оплата онлайн через СБП по QR-коду</span>
                    </div>
                  </div>
                  <span class="payment-method__check">✓</span>
                </label>

                <label class="payment-method" :class="{ active: paymentMethod === 'cash' }">
                  <input type="radio" v-model="paymentMethod" value="cash" class="payment-radio">
                  <div class="payment-method__content">
                    <span class="payment-method__icon">💵</span>
                    <div>
                      <span class="payment-method__title">Наличными при получении</span>
                      <span class="payment-method__desc">Оплата курьеру или в магазине</span>
                    </div>
                  </div>
                  <span class="payment-method__check">✓</span>
                </label>
              </div>

              <!-- QR-код (только для qr) -->
              <transition name="fade-expand">
                <div v-if="paymentMethod === 'qr'" class="qr-section">
                  <div class="qr-code">
                    <img src="/qr-code.png" alt="QR-код для оплаты" class="qr-code__img" />
                  </div>
                  <p class="qr-hint">Отсканируйте для оплаты</p>
                </div>
              </transition>

              <!-- Текст для наличных -->
              <transition name="fade-expand">
                <div v-if="paymentMethod === 'cash'" class="cash-section">
                  <div class="cash-info">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" stroke-width="1.5" stroke-linecap="round">
                      <rect x="2" y="6" width="20" height="12" rx="2"/>
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M2 10h2"/>
                      <path d="M20 14h2"/>
                    </svg>
                    <p class="cash-info__text">Вы сможете оплатить заказ наличными курьеру или при самовывозе из магазина</p>
                  </div>
                </div>
              </transition>

              <div class="order-form__summary">
                <div class="order-form__summary-row order-form__summary-row--total">
                  <span>К оплате</span>
                  <span>{{ formatPrice(cartTotal) }}</span>
                </div>
              </div>

              <div class="modal-actions">
                <button type="button" @click="orderStep = 1" class="btn-cancel">← Назад</button>
                <button @click="processPayment" class="btn-submit" :disabled="isPaying">
                  <template v-if="isPaying">
                    <span class="btn-spinner"></span>
                    Оформляем...
                  </template>
                  <template v-else>
                    {{ paymentMethod === 'cash' ? 'Заказать' : 'Оплатить ' + formatPrice(cartTotal) }}
                  </template>
                </button>
              </div>
            </div>

            <!-- ═══ Шаг 3: Обработка ═══ -->
            <div v-else-if="orderStep === 3" class="payment-processing">
              <div class="processing-animation">
                <div class="processing-spinner">
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                    <circle cx="30" cy="30" r="26" stroke="var(--color-border)" stroke-width="4"/>
                    <circle class="processing-arc" cx="30" cy="30" r="26" stroke="var(--color-primary)" stroke-width="4" stroke-linecap="round" stroke-dasharray="163" stroke-dashoffset="130"/>
                  </svg>
                </div>
                <h4 class="processing-title">Обработка платежа...</h4>
                <p class="processing-text">Пожалуйста, подождите, не закрывайте окно</p>

                <!-- Анимация "успешных" чекпоинтов -->
                <div class="processing-checkpoints">
                  <div class="checkpoint" :class="{ done: cpLevel >= 1 }">
                    <span class="checkpoint__icon">{{ cpLevel >= 1 ? '✓' : '○' }}</span>
                    <span class="checkpoint__text">Проверка данных</span>
                  </div>
                  <div class="checkpoint" :class="{ done: cpLevel >= 2 }">
                    <span class="checkpoint__icon">{{ cpLevel >= 2 ? '✓' : '○' }}</span>
                    <span class="checkpoint__text">Связь с банком</span>
                  </div>
                  <div class="checkpoint" :class="{ done: cpLevel >= 3 }">
                    <span class="checkpoint__icon">{{ cpLevel >= 3 ? '✓' : '○' }}</span>
                    <span class="checkpoint__text">Подтверждение</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCart, type OrderData } from '../stores/cart.store';
import { useAuthStore } from '../stores/auth.store';
import { promoApi } from '../api/promo.api';
import { ordersApi } from '../api/orders.api';
import { formatPhone, isValidPhone, sanitizeInput, isValidPromoCode } from '../utils/validation';
import AddressAutocomplete from '../components/order/AddressAutocomplete.vue';

const router = useRouter();
const authStore = useAuthStore();

const {
  items,
  count,
  total,
  freeShippingProgress,
  freeShippingRemaining,
  removeItem,
  updateQuantity,
  clearCart,
  cartEvent,
} = useCart();

const cartItems = computed(() => items.value);
const cartCount = computed(() => count.value);
const subtotal = computed(() => total.value);
const cartTotal = computed(() => {
  if (promoApplied.value) return Math.round(total.value * 0.9);
  return total.value;
});
const discount = computed(() => {
  return promoApplied.value ? Math.round(total.value * 0.1) : 0;
});

// Выбор товаров
const selectedIds = ref<string[]>([]);
const allSelected = computed(() => cartItems.value.length > 0 && selectedIds.value.length === cartItems.value.length);

function toggleAll() {
  if (allSelected.value) {
    selectedIds.value = [];
  } else {
    selectedIds.value = cartItems.value.map(i => i.id);
  }
}

function removeSelected() {
  selectedIds.value.forEach(id => removeItem(id));
  selectedIds.value = [];
}

// Watcher для авто-выбора при добавлении
watch(cartItems, () => {
  selectedIds.value = selectedIds.value.filter(id => cartItems.value.some(i => i.id === id));
}, { deep: true });

// Undo удаление
const removingId = ref<string | null>(null);
const recentAddedId = ref<string | null>(null);
const undoItem = ref<{ id: string; name: string; price: number; imageUrl?: string; weight?: string } | null>(null);

function confirmRemove(item: any) {
  removingId.value = item.id;
  undoItem.value = item;
  setTimeout(() => {
    if (undoItem.value?.id === item.id) {
      removeItem(item.id);
      undoItem.value = null;
      removingId.value = null;
    }
  }, 3000);
}

function undoRemove(item: any) {
  undoItem.value = null;
  removingId.value = null;
}

// Слушаем события корзины
watch(cartEvent, (evt) => {
  if (evt?.type === 'added') {
    recentAddedId.value = evt.itemId;
    setTimeout(() => { recentAddedId.value = null; }, 600);
  }
});

// Промокод
const promoCode = ref('');
const promoApplied = ref(false);
const promoError = ref(false);
const promoApplying = ref(false);

async function applyPromo() {
  const code = sanitizeInput(promoCode.value);
  if (!code || !isValidPromoCode(code)) {
    promoError.value = true;
    setTimeout(() => { promoError.value = false; }, 3000);
    return;
  }

  promoApplying.value = true;
  promoError.value = false;

  try {
    const result = await promoApi.validate(code);

    if (result.valid) {
      promoApplied.value = true;
      promoError.value = false;
    } else {
      promoApplied.value = false;
      promoError.value = true;
      setTimeout(() => { promoError.value = false; }, 3000);
    }
  } catch {
    promoApplied.value = false;
    promoError.value = true;
    setTimeout(() => { promoError.value = false; }, 3000);
  } finally {
    promoApplying.value = false;
  }
}

function removePromo() {
  promoApplied.value = false;
  promoCode.value = '';
}

// Форматирование
function formatPrice(p: number) { return `${p.toLocaleString('ru-RU')}₽`; }

function pluralize(count: number): string {
  if (count % 10 === 1 && count % 100 !== 11) return 'товар';
  if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) return 'товара';
  return 'товаров';
}

function onNameInput(e: Event) {
  const input = e.target as HTMLInputElement;
  // Удаляем всё кроме русских букв
  let value = input.value.replace(/[^А-Яа-яЁё]/g, '');
  // Первая буква заглавная
  if (value.length > 0) {
    value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
  orderForm.name = value;
}

function onPhoneInput(e: Event) {
  const input = e.target as HTMLInputElement;
  const clean = input.value.replace(/[^\d+]/g, '');
  orderForm.phone = formatPhone(clean);
}

function onPhoneBlur() {
  if (orderForm.phone && !isValidPhone(orderForm.phone)) {
    orderForm.phone = '';
  }
}

// Quantity
function increaseQuantity(item: any) {
  updateQuantity(item.id, item.quantity + 1);
}

function decreaseQuantity(item: any) {
  if (item.quantity > 1) {
    updateQuantity(item.id, item.quantity - 1);
  }
}

// Модалка
const showOrderForm = ref(false);
const orderSuccess = ref<OrderData | null>(null);
const orderStep = ref(1);
const paymentMethod = ref<'qr' | 'cash'>('qr');
const isPaying = ref(false);
const checkpoint = ref(0);
const cpLevel = computed(() => checkpoint.value);

const modalTitle = computed(() => {
  if (orderStep.value === 1) return 'Оформление заказа';
  if (orderStep.value === 2) return 'Способ оплаты';
  if (orderStep.value === 3) return 'Оплата';
  return 'Заказ оформлен';
});

const orderForm = reactive({
  name: '',
  phone: '',
  address: '',
  comment: '',
});

function openOrderForm() {
  if (!authStore.isAuthenticated) {
    router.push('/login?redirect=/cart');
    return;
  }
  showOrderForm.value = true;
}

function goToPayment() {
  orderStep.value = 2;
}

function closeOrderModal() {
  showOrderForm.value = false;
  orderStep.value = 1;
  orderSuccess.value = null;
  isPaying.value = false;
  checkpoint.value = 0;
}

async function processPayment() {
  isPaying.value = true;
  orderStep.value = 3;

  const checkpointInterval = setInterval(() => {
    checkpoint.value++;
    if (checkpoint.value >= 3) {
      clearInterval(checkpointInterval);
    }
  }, 500);

  setTimeout(async () => {
    try {
      const order = await ordersApi.create({
        items: items.value.map(i => ({
          productId: i.id,
          quantity: i.quantity,
          price: i.price,
        })),
        totalAmount: cartTotal.value,
        customerName: orderForm.name,
        customerPhone: orderForm.phone,
        customerAddress: orderForm.address,
        comment: sanitizeInput(orderForm.comment),
        deliveryType: 'delivery',
        paymentMethod: paymentMethod.value,
        cardLast4: '',
      });

      orderSuccess.value = order;
      clearCart();
    } catch (e) {
      console.error('Ошибка создания заказа:', e);
    }

    isPaying.value = false;
    orderStep.value = 4;
    selectedIds.value = [];

    orderForm.name = '';
    orderForm.phone = '';
    orderForm.address = '';
    orderForm.comment = '';
  }, 1800);
}
</script>

<style scoped>
/* ───────────── GENERAL ───────────── */
.cart-page {
  min-height: 70vh;
  padding-bottom: 100px;
}

.section {
  padding: 100px 20px 60px;
  background: var(--color-surface);
}

.cart-header {
  text-align: center;
  margin-bottom: 40px;
}

.cart-header .section-title {
  margin-bottom: 8px;
}

.cart-header__count {
  display: inline-block;
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--color-text-muted);
  animation: fadeInDown 0.3s ease;
}

/* ───────────── EMPTY CART ───────────── */
.empty-cart {
  text-align: center;
  padding: 60px 20px;
  animation: fadeInUp 0.5s ease;
}

.empty-cart__illustration {
  margin-bottom: 24px;
  display: inline-block;
}

.float-particle {
  animation: floatParticle 3s ease-in-out infinite;
}

.p1 { animation-delay: 0s; }
.p2 { animation-delay: 0.6s; }
.p3 { animation-delay: 1.2s; }
.p4 { animation-delay: 1.8s; }

@keyframes floatParticle {
  0%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
  50% { transform: translateY(-20px) scale(1.2); opacity: 0.8; }
}

.empty-cart__title {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 28px;
  color: var(--color-text);
  margin-bottom: 12px;
}

.empty-cart__text {
  font-family: var(--font-body);
  font-size: 16px;
  color: var(--color-text-muted);
  margin-bottom: 32px;
  line-height: 1.6;
}

.empty-cart__btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  background: var(--color-primary);
  color: #fff;
  border-radius: var(--radius-full);
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 16px;
  text-decoration: none;
  transition: all var(--transition-bounce);
  box-shadow: 0 4px 16px rgba(211,84,0,0.3);
}

.empty-cart__btn:hover {
  background: var(--color-primary-dark);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(211,84,0,0.4);
}

.empty-cart__btn svg {
  transition: transform var(--transition-normal);
}

.empty-cart__btn:hover svg {
  transform: translateX(4px);
}

/* ───────────── CART LAYOUT ───────────── */
.cart-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 32px;
  align-items: start;
  animation: fadeInUp 0.4s ease;
}

/* ───────────── ITEMS ───────────── */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 16px 20px;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-xs);
  transition: all var(--transition-normal);
  animation: fadeInUp 0.4s ease forwards;
  animation-delay: var(--delay);
  opacity: 0;
  position: relative;
  overflow: hidden;
}

.cart-item:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary-light);
}

.cart-item--removing {
  animation: slideOutRight 0.3s ease forwards;
}

.cart-item--added {
  animation: addedPop 0.5s var(--anim-bounce) forwards;
}

@keyframes slideOutRight {
  to { opacity: 0; transform: translateX(40px); }
}

@keyframes addedPop {
  0% { background: var(--color-primary-soft); }
  100% { background: var(--color-surface); }
}

/* Checkbox */
.cart-item__checkbox {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  cursor: pointer;
  flex-shrink: 0;
}

.checkbox-input:checked + .checkbox-custom {
  background: var(--color-primary);
  border-color: var(--color-primary);
  position: relative;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}

.checkbox-input:focus-visible + .checkbox-custom {
  box-shadow: 0 0 0 3px rgba(211,84,0,0.2);
}

/* Image */
.cart-item__img-wrap {
  width: 88px;
  height: 88px;
  flex-shrink: 0;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 0 1px var(--color-border);
}

.cart-item__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform var(--transition-normal);
}

.cart-item:hover .cart-item__img {
  transform: scale(1.08);
}

/* Info */
.cart-item__info {
  flex: 1;
  min-width: 0;
}

.cart-item__name {
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 16px;
  color: var(--color-text);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cart-item__weight {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-bottom: 4px;
}

.cart-item__price {
  font-size: 14px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

/* Quantity stepper */
.cart-item__qty {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.qty-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.qty-btn:hover:not(:disabled) {
  background: var(--color-primary-soft);
  border-color: var(--color-primary-light);
  color: var(--color-primary);
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-value {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 16px;
  min-width: 28px;
  text-align: center;
  color: var(--color-text);
}

/* Total per item */
.cart-item__total {
  text-align: right;
  min-width: 90px;
  flex-shrink: 0;
}

.cart-item__total-value {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 18px;
  color: var(--color-text);
  display: block;
  animation: countPop 0.3s var(--anim-bounce);
}

/* Remove button */
.cart-item__remove {
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 8px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.cart-item__remove:hover {
  color: var(--color-error);
  background: #fef2f2;
  transform: scale(1.1);
}

/* Undo */
.cart-item__undo {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(4px);
  color: #fff;
  font-size: 14px;
  border-radius: var(--radius-lg);
  z-index: 2;
}

.undo-btn {
  background: var(--color-surface);
  color: var(--color-text);
  border: none;
  padding: 8px 16px;
  border-radius: var(--radius-md);
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.undo-btn:hover {
  background: var(--color-primary);
  color: #fff;
}

.undo-enter-active { animation: fadeInUp 0.2s ease; }
.undo-leave-active { animation: fadeInUp 0.15s ease reverse; }

/* Bulk actions */
.cart-bulk {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  margin-top: 8px;
}

.cart-bulk__checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.cart-bulk__remove {
  background: none;
  border: none;
  color: var(--color-error);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.cart-bulk__remove:hover {
  background: #fef2f2;
}

/* ───────────── SIDEBAR ───────────── */
.cart-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 100px;
}

.cart-sidebar__card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 20px;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}

.cart-sidebar__card:hover {
  box-shadow: var(--shadow-md);
}

/* Shipping progress */
.shipping-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.shipping-progress__icon {
  font-size: 28px;
  flex-shrink: 0;
}

.shipping-progress__text {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.4;
}

.shipping-progress__text strong {
  color: var(--color-primary);
  font-weight: 700;
}

.shipping-progress__text--free {
  color: var(--color-success);
  font-weight: 600;
}

.shipping-progress__bar {
  height: 6px;
  background: var(--color-border-light);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.shipping-progress__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary-light), var(--color-primary));
  border-radius: var(--radius-full);
  transition: width 0.6s var(--anim-bounce);
}

/* Promo */
.promo-input-wrap {
  display: flex;
  gap: 8px;
  transition: all var(--transition-fast);
}

.promo-input-wrap--success {
  border-color: var(--color-success);
}

.promo-input-wrap--error {
  animation: shake 0.4s ease;
}

.promo-input {
  flex: 1;
  min-width: 0;
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 14px;
  background: var(--color-background);
  color: var(--color-text);
  transition: all var(--transition-fast);
}

.promo-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(211,84,0,0.08);
}

.promo-input:disabled {
  opacity: 0.6;
}

.promo-apply {
  padding: 10px 18px;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: normal;
  flex-shrink: 0;
}

.promo-apply:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.promo-apply:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.promo-remove {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--color-text-muted);
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.promo-remove:hover {
  color: var(--color-error);
  border-color: var(--color-error);
}

.promo-success,
.promo-error {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  font-size: 13px;
  padding: 8px 12px;
  border-radius: var(--radius-md);
}

.promo-success {
  color: var(--color-success);
  background: rgba(16, 185, 129, 0.08);
}

.promo-error {
  color: var(--color-error);
  background: rgba(231, 76, 60, 0.08);
}

/* Summary */
.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 10px;
}

.summary-row--discount .summary-row__value {
  color: var(--color-success);
}

.summary-row__value--free {
  color: var(--color-success);
  font-weight: 600;
}

.summary-divider {
  height: 1px;
  background: var(--color-border);
  margin: 12px 0;
}

.summary-row--total {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 20px;
  color: var(--color-text);
  margin-bottom: 0;
}

.summary-row--total .summary-row__value {
  color: var(--color-primary);
}

.secure-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 16px;
  font-size: 12px;
  color: var(--color-text-muted);
}

.checkout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 16px;
  margin-top: 16px;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-full);
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all var(--transition-bounce);
  box-shadow: 0 4px 16px rgba(211,84,0,0.3);
}

.checkout-btn:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(211,84,0,0.4);
}

.checkout-btn svg {
  transition: transform var(--transition-normal);
}

.checkout-btn:hover svg {
  transform: translateX(4px);
}

.clear-btn {
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.clear-btn:hover {
  border-color: var(--color-error);
  color: var(--color-error);
}

.pulse-glow {
  animation: pulseGlowBtn 2.5s ease-in-out infinite;
}

@keyframes pulseGlowBtn {
  0%, 100% { box-shadow: 0 4px 16px rgba(211,84,0,0.3); }
  50% { box-shadow: 0 4px 24px rgba(211,84,0,0.5), 0 0 40px rgba(211,84,0,0.1); }
}

/* ───────────── MOBILE BOTTOM BAR ───────────── */
.mobile-bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10000;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  padding: 12px 20px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.06);
}

.mobile-bottom-bar__info {
  display: flex;
  flex-direction: column;
}

.mobile-bottom-bar__total {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 20px;
  color: var(--color-primary);
}

.mobile-bottom-bar__count {
  font-size: 13px;
  color: var(--color-text-muted);
}

.mobile-bottom-bar__btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-full);
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: 0 4px 16px rgba(211,84,0,0.3);
}

.mobile-bottom-bar__btn:hover {
  background: var(--color-primary-dark);
}

.slide-up-enter-active { animation: slideUp 0.3s ease; }
.slide-up-leave-active { animation: slideUp 0.25s ease reverse; }

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

/* ───────────── MODAL ───────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.5);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-content {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: 40px 36px 36px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: var(--shadow-xl);
}

.modal-content--wide {
  max-width: 560px;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: var(--color-border-light);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-text-muted);
  transition: all var(--transition-fast);
}

.modal-close:hover {
  background: var(--color-border);
  color: var(--color-text);
}

.modal-title {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 24px;
  color: var(--color-text);
  margin-bottom: 24px;
  text-align: center;
}

/* Step progress */
.step-progress {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
  position: relative;
  padding-bottom: 24px;
}

.step-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  border: 2px solid var(--color-border);
  color: var(--color-text-muted);
  background: var(--color-surface);
  z-index: 1;
  transition: all var(--transition-normal);
}

.step-dot.active {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-soft);
}

.step-dot.done {
  border-color: var(--color-success);
  background: var(--color-success);
  color: #fff;
}

.step-line {
  flex: 1;
  height: 2px;
  background: var(--color-border);
  margin: 0 4px;
  transition: background var(--transition-normal);
}

.step-line.active {
  background: var(--color-primary);
}

.step-labels {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 4px;
}

.step-labels span {
  font-size: 11px;
  color: var(--color-text-muted);
  font-weight: 500;
}

.step-labels span.active {
  color: var(--color-primary);
  font-weight: 600;
}

/* Form */
.order-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group--floating {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 20px 16px 6px 40px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 15px;
  background: var(--color-background);
  color: var(--color-text);
  transition: all var(--transition-fast);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(211,84,0,0.08);
}

.form-input:focus + .form-label,
.form-group--floating[data-filled="true"] .form-label {
  transform: translateY(-16px) scale(0.72);
  color: var(--color-primary);
  font-weight: 600;
}

.form-label {
  position: absolute;
  left: 40px;
  top: 18px;
  font-size: 14px;
  color: var(--color-text-muted);
  pointer-events: none;
  transition: all var(--transition-fast);
  transform-origin: left;
}

.form-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
}

.form-textarea {
  resize: vertical;
  min-height: 60px;
  padding-top: 24px;
}

.form-textarea + .form-label {
  top: 18px;
}

.form-textarea:focus + .form-label,
.form-group--floating[data-filled="true"] .form-label {
  transform: translateY(-18px) scale(0.72);
  font-weight: 600;
}

.order-form__summary {
  background: var(--color-border-light);
  border-radius: var(--radius-md);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.order-form__summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.order-form__summary-row--total {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 16px;
  color: var(--color-text);
  padding-top: 8px;
  border-top: 1px solid var(--color-border);
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 4px;
}

.btn-cancel {
  flex: 1;
  padding: 14px;
  background: var(--color-border-light);
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 15px;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-cancel:hover {
  background: var(--color-border);
}

.btn-submit {
  flex: 1;
  padding: 14px;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-submit:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* Payment */
.payment-step {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.payment-method {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: var(--radius-lg);
  border: 2px solid var(--color-border);
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
}

.payment-method:hover {
  border-color: var(--color-primary-light);
}

.payment-method.active {
  border-color: var(--color-primary);
  background: var(--color-primary-soft);
}

.payment-radio {
  display: none;
}

.payment-method__content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.payment-method__icon {
  font-size: 28px;
}

.payment-method__title {
  display: block;
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 15px;
  color: var(--color-text);
}

.payment-method__desc {
  display: block;
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--color-text-muted);
  margin-top: 2px;
}

.payment-method__check {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-border-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
  color: transparent;
  transition: all var(--transition-fast);
}

.payment-method.active .payment-method__check {
  background: var(--color-primary);
  color: #fff;
}

/* Address label */
.address-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-secondary, #6b5f55);
  margin-bottom: 8px;
}

.form-group {
  margin-bottom: 0;
}

/* QR code image */
.qr-code__img {
  display: block;
  width: 160px;
  height: 160px;
  object-fit: contain;
  margin: 0 auto;
}

/* Cash section */
.cash-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.cash-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 20px;
  background: var(--color-border-light);
  border-radius: var(--radius-lg);
  max-width: 360px;
  width: 100%;
}

.cash-info svg {
  flex-shrink: 0;
}

.cash-info__text {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0;
}

/* QR */
.qr-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.qr-code {
  background: white;
  padding: 16px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.qr-hint {
  font-family: var(--font-heading);
  font-size: 16px;
  color: var(--color-text-secondary);
}

/* Processing */
.payment-processing {
  text-align: center;
  padding: 20px 0;
}

.processing-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.processing-spinner {
  animation: pulseScale 1.5s ease-in-out infinite;
}

@keyframes pulseScale {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.processing-arc {
  animation: arcRotate 1.2s ease-in-out infinite;
  transform-origin: center;
}

@keyframes arcRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.processing-title {
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 20px;
  color: var(--color-text);
}

.processing-text {
  font-size: 14px;
  color: var(--color-text-muted);
}

.processing-checkpoints {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 8px;
  width: 100%;
  max-width: 220px;
}

.checkpoint {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: var(--color-text-muted);
  transition: all var(--transition-normal);
}

.checkpoint.done {
  color: var(--color-success);
}

.checkpoint__icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  border-radius: 50%;
  border: 2px solid currentColor;
  flex-shrink: 0;
}

.checkpoint.done .checkpoint__icon {
  background: var(--color-success);
  color: #fff;
  border-color: var(--color-success);
}

/* Success */
.order-success {
  text-align: center;
  padding: 16px 0;
}

.order-success__animation {
  margin-bottom: 20px;
}

.success-check__circle {
  stroke-dasharray: 226;
  stroke-dashoffset: 226;
  animation: drawCircle 0.6s ease forwards 0.2s;
}

.success-check__path {
  stroke-dasharray: 60;
  stroke-dashoffset: 60;
  animation: drawCheckPath 0.4s ease forwards 0.8s;
}

@keyframes drawCircle {
  to { stroke-dashoffset: 0; }
}

@keyframes drawCheckPath {
  to { stroke-dashoffset: 0; }
}

.order-success__title {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 24px;
  color: var(--color-text);
  margin-bottom: 8px;
}

.order-success__id {
  font-family: var(--font-heading);
  font-size: 16px;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
  letter-spacing: 0.5px;
}

.order-success__payment {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--color-border-light);
  border-radius: var(--radius-md);
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
}

.payment-icon {
  font-size: 20px;
}

.order-success__text {
  font-size: 14px;
  color: var(--color-text-muted);
  margin-bottom: 24px;
  line-height: 1.5;
}

.order-success__btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: var(--color-primary);
  color: #fff;
  border-radius: var(--radius-full);
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 15px;
  text-decoration: none;
  transition: all var(--transition-fast);
  box-shadow: 0 4px 16px rgba(211,84,0,0.3);
}

.order-success__btn:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
}

.order-success__btn svg {
  transition: transform var(--transition-normal);
}

.order-success__btn:hover svg {
  transform: translateX(4px);
}

/* ───────────── TRANSITIONS ───────────── */
.modal-enter-active { animation: modalIn 0.3s ease; }
.modal-leave-active { animation: modalIn 0.25s ease reverse; }

@keyframes modalIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-enter-active .modal-content { animation: modalSlide 0.3s ease; }
.modal-leave-active .modal-content { animation: modalSlide 0.25s ease reverse; }

@keyframes modalSlide {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-expand-enter-active,
.fade-expand-leave-active {
  transition: opacity 0.2s ease, max-height 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.fade-expand-enter-from,
.fade-expand-leave-to {
  opacity: 0;
  max-height: 0;
}

/* ───────────── RESPONSIVE ───────────── */
@media (max-width: 1024px) {
  .cart-layout {
    grid-template-columns: 1fr 320px;
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .section {
    padding: 80px 16px 80px;
  }

  .cart-layout {
    grid-template-columns: 1fr;
  }

  .cart-sidebar {
    position: static;
  }

  .cart-item {
    flex-wrap: wrap;
    padding: 14px;
    gap: 12px;
  }

  .cart-item__info {
    flex: 1 1 calc(100% - 120px);
  }

  .cart-item__qty {
    order: 1;
    margin-left: auto;
  }

  .cart-item__total {
    order: 2;
    min-width: auto;
  }

  .cart-item__remove {
    position: absolute;
    top: 8px;
    right: 8px;
  }

  .modal-content {
    padding: 32px 20px 24px;
    margin: 10px;
    max-height: 85vh;
  }

  .modal-title {
    font-size: 20px;
    margin-bottom: 20px;
  }

  .empty-cart__title {
    font-size: 24px;
  }

  .cart-bulk {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .cart-item__img-wrap {
    width: 72px;
    height: 72px;
  }

  .qty-btn {
    width: 32px;
    height: 32px;
  }

  .qty-value {
    font-size: 14px;
    min-width: 24px;
  }

  .checkout-btn {
    padding: 14px;
    font-size: 15px;
  }
}
</style>