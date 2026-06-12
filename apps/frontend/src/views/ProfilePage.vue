<template>
  <div class="profile-page">
    <div class="container">
      <!-- Состояние загрузки -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Загружаем ваш профиль...</p>
      </div>

      <!-- Ошибка -->
      <div v-else-if="error" class="error-state">{{ error }}</div>

      <template v-else>
        <!-- ===== HERO-СЕКЦИЯ ПРОФИЛЯ ===== -->
        <section class="profile-hero">
          <div class="profile-hero__bg">
            <div class="profile-hero__blob profile-hero__blob--1"></div>
            <div class="profile-hero__blob profile-hero__blob--2"></div>
          </div>
          <div class="profile-hero__content">
            <div class="profile-hero__avatar-wrap">
              <div class="profile-hero__avatar-ring">
                <div class="profile-hero__avatar">
                  <span class="profile-hero__avatar-text">{{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}</span>
                </div>
                <span class="profile-hero__status-dot"></span>
              </div>
            </div>
            <div class="profile-hero__info">
              <h1 class="profile-hero__name">{{ user?.name }}</h1>
              <span class="profile-hero__email">{{ user?.email }}</span>
              <span class="profile-hero__date">На сайте с {{ formatDate(user?.createdAt) }}</span>
            </div>
            <div class="profile-hero__actions">
              <button @click="openEditDrawer" class="btn btn--glass">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Редактировать
              </button>
              <button @click="handleLogout" class="btn btn--ghost-danger">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Выйти
              </button>
            </div>
          </div>
          <!-- Статистика -->
          <div class="profile-hero__stats">
            <div class="stat-card stat-card--clickable reveal reveal--scale" @click="activeTab = 'orders'">
              <div class="stat-card__icon">🛒</div>
              <div class="stat-card__values">
                <span class="stat-card__number" ref="statOrdersRef">{{ animatedOrders }}</span>
                <span class="stat-card__label">Заказов</span>
              </div>
            </div>
            <div class="stat-card stat-card--clickable reveal reveal--scale" style="animation-delay: 0.1s;" @click="activeTab = 'favorites'">
              <div class="stat-card__icon">❤️</div>
              <div class="stat-card__values">
                <span class="stat-card__number">{{ favoritesItems.length }}</span>
                <span class="stat-card__label">В избранном</span>
              </div>
            </div>
            <div class="stat-card stat-card--clickable reveal reveal--scale" style="animation-delay: 0.2s;" @click="activeTab = 'subscriptions'">
              <div class="stat-card__icon">🔔</div>
              <div class="stat-card__values">
                <span class="stat-card__number">{{ notifications.length }}</span>
                <span class="stat-card__label">Подписки</span>
              </div>
            </div>
            <div v-if="isAdmin" class="stat-card reveal reveal--scale" style="animation-delay: 0.3s;">
              <div class="stat-card__icon">👁️</div>
              <div class="stat-card__values">
                <span class="stat-card__number">{{ visitStats?.totalVisits || 0 }}</span>
                <span class="stat-card__label">Визитов</span>
              </div>
            </div>
          </div>
        </section>

        <!-- ===== TAB-НАВИГАЦИЯ ===== -->
        <div class="profile-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="profile-tab"
            :class="{ 'profile-tab--active': activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            <span class="profile-tab__icon">{{ tab.icon }}</span>
            <span class="profile-tab__label">{{ tab.label }}</span>
            <span v-if="tab.count !== undefined" class="profile-tab__count">{{ tab.count }}</span>
          </button>
        </div>

        <!-- ===== КОНТЕНТ ПО ТАБАМ ===== -->
        <div class="profile-content">
          <transition name="tab-fade" mode="out-in">
            <div :key="activeTab" class="tab-content">
              <!-- ═══ ТАБ: ЗАКАЗЫ ═══ -->
              <div v-if="activeTab === 'orders'">
                <div v-if="orders.length === 0" class="empty-block">
                  <div class="empty-block__icon">📦</div>
                  <h3>У вас пока нет заказов</h3>
                  <p>Перейдите в каталог, чтобы выбрать товары</p>
                  <router-link to="/catalog" class="btn btn--primary">Перейти в каталог</router-link>
                </div>
                <div v-else class="orders-list">
                  <div
                    v-for="order in orders"
                    :key="order.id"
                    class="order-card stagger-item"
                  >
                    <div class="order-card__timeline" :class="'order-card__timeline--' + order.status"></div>
                    <div class="order-card__body">
                      <div class="order-card__header">
                        <div class="order-card__meta">
                          <span class="order-card__id">Заказ #{{ order.id.replace('order-', '').slice(0, 8) }}</span>
                          <span class="order-card__date">{{ formatDate(order.createdAt) }}</span>
                        </div>
                        <div class="order-card__status">
                          <span class="status-badge" :class="'status-badge--' + order.status">
                            {{ statusIcon[order.status as OrderStatus] }} {{ statusLabels[order.status as OrderStatus] }}
                          </span>
                        </div>
                      </div>
                      <div class="order-card__products">
                        <div v-for="item in order.items.slice(0, 3)" :key="item.id" class="order-product-chip">
                          <span class="order-product-chip__name">{{ item.name }}</span>
                          <span class="order-product-chip__qty">x{{ item.quantity }}</span>
                        </div>
                        <div v-if="order.items.length > 3" class="order-product-chip order-product-chip--more">
                          +{{ order.items.length - 3 }}
                        </div>
                      </div>
                      <div class="order-card__footer">
                        <div class="order-card__total">
                          <span class="order-card__total-label">Итого</span>
                          <span class="order-card__total-value">{{ formatPrice(order.total) }}</span>
                        </div>
                        <div class="order-card__actions" v-if="order.status === 'paid' || order.status === 'confirmed'">
                          <button @click="handleReceived(order.id)" class="action-chip action-chip--success">✓ Получен</button>
                          <button @click="openDeliveryIssueModal(order.id)" class="action-chip action-chip--danger">✕ Не доставлен</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ═══ ТАБ: ИЗБРАННОЕ ═══ -->
              <div v-if="activeTab === 'favorites'">
                <div v-if="favoritesItems.length === 0" class="empty-block">
                  <div class="empty-block__icon">❤️</div>
                  <h3>В избранном пока пусто</h3>
                  <p>Добавляйте товары в избранное, чтобы не потерять</p>
                  <router-link to="/catalog" class="btn btn--primary">Перейти в каталог</router-link>
                </div>
                <div v-else class="favorites-grid">
                  <div
                    v-for="item in favoritesItems"
                    :key="item.id"
                    class="fav-card"
                  >
                    <div class="fav-card__img-wrap">
                      <img :src="item.imageUrl || '/images/products/placeholder.svg'" :alt="item.name" class="fav-card__img">
                      <button @click.stop="removeFavorite(item.id)" class="fav-card__remove" title="Убрать из избранного">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      </button>
                    </div>
                    <div class="fav-card__info">
                      <span class="fav-card__name">{{ item.name }}</span>
                      <span class="fav-card__price">{{ formatPrice(item.discountPrice || item.price) }}</span>
                      <span :class="item.inStock ? 'fav-card__stock fav-card__stock--in' : 'fav-card__stock fav-card__stock--out'">
                        {{ item.inStock ? 'В наличии' : 'Нет в наличии' }}
                      </span>
                    </div>
                    <div class="fav-card__actions">
                      <button v-if="item.inStock" class="fav-card__cart-btn" @click.stop="addFavoriteToCart(item)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                        В корзину
                      </button>
                      <button class="fav-card__remove-btn" @click.stop="removeFavorite(item.id)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        Убрать
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ═══ ТАБ: ПОДПИСКИ ═══ -->
              <div v-if="activeTab === 'subscriptions'">
                <div v-if="notifications.length === 0" class="empty-block">
                  <div class="empty-block__icon">🔔</div>
                  <h3>Нет активных подписок</h3>
                  <p>Подпишитесь на товары, чтобы узнавать о поступлении</p>
                </div>
                <div v-else class="subs-list">
                  <div
                    v-for="n in notifications"
                    :key="n.id"
                    class="sub-card stagger-item"
                  >
                    <div class="sub-card__img-wrap">
                      <img :src="n.product?.imageUrl || '/images/products/placeholder.svg'" :alt="n.product?.name" class="sub-card__img">
                    </div>
                    <div class="sub-card__info">
                      <span class="sub-card__name">{{ n.product?.name || 'Товар' }}</span>
                      <span class="sub-card__date">Подписаны с {{ formatDate(n.createdAt) }}</span>
                    </div>
                    <button @click="unsubscribeFromProduct(n.productId)" class="btn btn--danger-outline">
                      Отписаться
                    </button>
                  </div>
                </div>
              </div>

              <!-- ═══ ТАБ: НАСТРОЙКИ ═══ -->
              <div v-if="activeTab === 'settings'">
                <!-- Информация о пользователе -->
                <div class="settings-card">
                  <h3 class="settings-card__title">Информация об аккаунте</h3>
                  <div class="settings-info">
                    <div class="settings-info__row">
                      <span class="settings-info__label">Имя пользователя</span>
                      <span class="settings-info__value">{{ user?.name }}</span>
                    </div>
                    <div class="settings-info__row">
                      <span class="settings-info__label">Email</span>
                      <span class="settings-info__value">{{ user?.email }}</span>
                    </div>
                    <div class="settings-info__row">
                      <span class="settings-info__label">На сайте с</span>
                      <span class="settings-info__value">{{ formatDate(user?.createdAt) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Редактирование профиля -->
                <div class="settings-card">
                  <h3 class="settings-card__title">Редактировать профиль</h3>
                  <form @submit.prevent="updateProfile" class="settings-form">
                    <div class="form-field">
                      <label class="form-field__label">Имя</label>
                      <input v-model="editForm.name" type="text" required class="form-field__input" :class="{ 'input--invalid': editErrors.name }" @input="onEditNameInput" @blur="onEditNameBlur">
                      <span v-if="editErrors.name" class="form-field__error">{{ editErrors.name }}</span>
                    </div>
                    <div class="form-field">
                      <label class="form-field__label">Email</label>
                      <input v-model="editForm.email" type="email" required class="form-field__input" :class="{ 'input--invalid': editErrors.email }" @blur="onEditEmailBlur" @input="editErrors.email = ''">
                      <span v-if="editErrors.email" class="form-field__error">{{ editErrors.email }}</span>
                    </div>
                    <div class="settings-form__actions">
                      <button type="submit" class="btn btn--primary" :disabled="updating">
                        <span v-if="updating" class="btn-loading">
                          <span class="spinner spinner--sm"></span> Сохранение...
                        </span>
                        <span v-else>Сохранить изменения</span>
                      </button>
                    </div>
                  </form>
                </div>

                <!-- Админ-панель -->
                <div v-if="isAdmin" class="settings-card settings-card--admin">
                  <h3 class="settings-card__title">Панель управления</h3>
                  <p class="settings-card__desc">У вас есть права администратора</p>
                  <router-link to="/admin/products" class="btn btn--primary" style="width: auto;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z"/></svg>
                    Панель администратора
                  </router-link>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </template>
    </div>

    <!-- ===== DRAWER РЕДАКТИРОВАНИЯ ===== -->
    <teleport to="body">
      <transition name="drawer">
        <div v-if="showEditDrawer" class="drawer-overlay" @click.self="closeEditDrawer">
          <div class="drawer-panel">
            <div class="drawer-header">
              <h3 class="drawer-title">Редактировать профиль</h3>
              <button @click="closeEditDrawer" class="drawer-close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div class="drawer-body">
              <form @submit.prevent="updateProfile" class="drawer-form">
                <div class="drawer-field">
                  <label class="form-field__label">Имя пользователя</label>
                  <input v-model="editForm.name" type="text" required class="form-field__input" :class="{ 'input--invalid': editErrors.name }" @input="onEditNameInput" @blur="onEditNameBlur">
                  <span v-if="editErrors.name" class="form-field__error">{{ editErrors.name }}</span>
                </div>
                <div class="drawer-field">
                  <label class="form-field__label">Email</label>
                  <input v-model="editForm.email" type="email" required class="form-field__input" :class="{ 'input--invalid': editErrors.email }" @blur="onEditEmailBlur" @input="editErrors.email = ''">
                  <span v-if="editErrors.email" class="form-field__error">{{ editErrors.email }}</span>
                </div>
                <div class="drawer-actions">
                  <button type="button" @click="closeEditDrawer" class="btn btn--outline">Отмена</button>
                  <button type="submit" class="btn btn--primary" :disabled="updating">
                    {{ updating ? 'Сохранение...' : 'Сохранить' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- ===== TOAST "ЗАКАЗ НЕ ДОСТАВЛЕН" ===== -->
    <teleport to="body">
      <transition name="toast-slide">
        <div v-if="showDeliveryToast" class="toast-overlay">
          <div class="toast-card">
            <div class="toast-icon">⚠️</div>
            <div class="toast-content">
              <h4 class="toast-title">Заказ не доставлен?</h4>
              <p class="toast-text">Свяжитесь с нами: <strong>+7 (925) 483 12 91</strong></p>
              <p class="toast-text">Мы оперативно решим вопрос.</p>
            </div>
            <div class="toast-actions">
              <button @click="closeDeliveryToast" class="btn btn--outline btn--sm">Понятно</button>
              <button @click="submitDeliveryIssue" class="btn btn--primary btn--sm" :disabled="updatingIssue">
                {{ updatingIssue ? 'Отправка...' : 'Уведомить' }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { useFavorites } from '../stores/favorites.store';
import { useCart } from '../stores/cart.store';
import type { OrderStatus } from '../stores/cart.store';
import { usersApi } from '../api/users.api';
import { isValidEmail, isValidWhitelistedEmail, isValidRussianName, sanitizeRussianName, sanitizeInput, isValidName, getRussianNameError, getWhitelistedEmailError } from '../utils/validation';
import { notificationsApi } from '../api/notifications.api';
import { visitsApi } from '../api/visits.api';
import { ordersApi } from '../api/orders.api';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const isAdmin = computed(() => authStore.isAdmin);
const { getAll: getAllFavorites, remove: removeFav } = useFavorites();
const { addItem } = useCart();

const user = ref<any>(null);
const visitStats = ref<any>(null);
const notifications = ref<any[]>([]);
const orders = ref<any[]>([]);
const loading = ref(true);
const error = ref('');
const showEditDrawer = ref(false);
const updating = ref(false);
const showDeliveryToast = ref(false);
const updatingIssue = ref(false);
const pendingIssueOrderId = ref<string | null>(null);
const activeTab = ref('orders');
const focusedField = ref('');

const editForm = ref({ name: '', email: '' });
const editErrors = ref({ name: '', email: '' });
const favoritesItems = computed(() => getAllFavorites());

function addFavoriteToCart(item: any) {
  addItem({
    id: item.id,
    name: item.name,
    price: item.discountPrice || item.price,
    imageUrl: item.imageUrl,
    weight: item.weight,
  });
}

// Анимация счётчика заказов
const animatedOrders = ref(0);
const statOrdersRef = ref<HTMLElement | null>(null);
let ordersAnimFrame: number | null = null;

const tabs = computed(() => [
  { id: 'orders', icon: '🛒', label: 'Заказы', count: orders.value.length },
  { id: 'favorites', icon: '❤️', label: 'Избранное', count: favoritesItems.value.length },
  { id: 'subscriptions', icon: '🔔', label: 'Подписки', count: notifications.value.length },
  { id: 'settings', icon: '⚙️', label: 'Настройки' },
]);

const statusLabels: Record<OrderStatus, string> = {
  'new': 'Новый',
  'paid': 'Оплачен',
  'confirmed': 'Подтверждён',
  'cancelled': 'Отменён',
  'received': 'Получен',
  'delivery_issue': 'Проблема с доставкой',
};

const statusIcon: Record<string, string> = {
  'new': '🕐',
  'paid': '✅',
  'confirmed': '✅',
  'cancelled': '❌',
  'received': '🎉',
  'delivery_issue': '⚠️',
};

function removeFavorite(id: string) { removeFav(id); }
function formatPrice(p: number) { return `${p.toLocaleString('ru-RU')}₽`; }
function formatDate(dateString: string) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Анимация счётчика
function animateCounter(target: number) {
  if (ordersAnimFrame) cancelAnimationFrame(ordersAnimFrame);
  const duration = 800;
  const start = performance.now();
  const initial = animatedOrders.value;

  function step(now: number) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    animatedOrders.value = Math.round(initial + (target - initial) * easeOut);
    if (progress < 1) {
      ordersAnimFrame = requestAnimationFrame(step);
    }
  }
  ordersAnimFrame = requestAnimationFrame(step);
}

async function loadProfileData() {
  loading.value = true;
  try {
    const [profileData, visitData, notificationsData, ordersData] = await Promise.all([
      usersApi.getProfile(),
      visitsApi.getStats(),
      notificationsApi.getMyNotifications(),
      ordersApi.getMyOrders(),
    ]);
    user.value = profileData;
    visitStats.value = visitData;
    notifications.value = notificationsData;
    orders.value = ordersData.map((o: any) => ({
      ...o,
      total: o.totalAmount,
      items: o.items.map((i: any) => ({
        id: i.productId || i.id,
        name: i.product?.name || 'Товар',
        price: i.price,
        quantity: i.quantity,
        imageUrl: i.product?.imageUrl || undefined,
        weight: i.product?.weight || undefined,
      })),
    }));
    editForm.value.name = profileData.name;
    editForm.value.email = profileData.email;

    // Анимация счётчика
    animateCounter(orders.value.length);
  } catch (e: any) {
    error.value = e.response?.data?.error || 'Ошибка загрузки профиля';
  } finally {
    loading.value = false;
  }
}

// Валидация имени в форме редактирования
function onEditNameInput(e: Event) {
  const target = e.target as HTMLInputElement;
  target.value = sanitizeRussianName(target.value);
  editForm.value.name = target.value;
  editErrors.value.name = '';
}

function onEditNameBlur() {
  editForm.value.name = sanitizeRussianName(editForm.value.name);
  if (editForm.value.name) {
    editErrors.value.name = getRussianNameError(editForm.value.name) || '';
  }
}

function onEditEmailBlur() {
  editForm.value.email = sanitizeInput(editForm.value.email);
  if (editForm.value.email) {
    editErrors.value.email = getWhitelistedEmailError(editForm.value.email) || '';
  }
}

async function updateProfile() {
  updating.value = true;
  error.value = '';
  editErrors.value = { name: '', email: '' };
  
  editForm.value.name = sanitizeRussianName(editForm.value.name);
  editForm.value.email = sanitizeInput(editForm.value.email).toLowerCase().trim();
  
  if (!isValidRussianName(editForm.value.name)) {
    editErrors.value.name = 'Имя должно содержать только русские буквы и начинаться с заглавной';
    updating.value = false;
    return;
  }
  if (!isValidWhitelistedEmail(editForm.value.email)) {
    editErrors.value.email = 'Неверно введена почта';
    updating.value = false;
    return;
  }
  
  try {
    await usersApi.updateProfile(editForm.value);
    user.value.name = editForm.value.name;
    user.value.email = editForm.value.email;
    closeEditDrawer();
  } catch (e: any) { error.value = e.response?.data?.error || 'Ошибка обновления'; }
  finally { updating.value = false; }
}

async function unsubscribeFromProduct(productId: string) {
  try {
    await notificationsApi.unsubscribe(productId);
    notifications.value = notifications.value.filter(n => n.productId !== productId);
  } catch (error) { console.error('Ошибка отписки:', error); }
}

function handleLogout() { authStore.logout(); router.push('/'); }

async function handleReceived(orderId: string) {
  try {
    await ordersApi.markReceived(orderId);
    const ordersData = await ordersApi.getMyOrders();
    orders.value = ordersData.map((o: any) => ({
      ...o,
      total: o.totalAmount,
      items: o.items.map((i: any) => ({
        id: i.productId || i.id,
        name: i.product?.name || 'Товар',
        price: i.price,
        quantity: i.quantity,
        imageUrl: i.product?.imageUrl || undefined,
        weight: i.product?.weight || undefined,
      })),
    }));
  } catch (e) {
    console.error('Ошибка отметки заказа полученным:', e);
  }
}

function openDeliveryIssueModal(orderId: string) {
  pendingIssueOrderId.value = orderId;
  showDeliveryToast.value = true;
}

function closeDeliveryToast() {
  showDeliveryToast.value = false;
  pendingIssueOrderId.value = null;
}

async function submitDeliveryIssue() {
  if (!pendingIssueOrderId.value) return;
  updatingIssue.value = true;
  try {
    await ordersApi.markNotDelivered(pendingIssueOrderId.value);
    const ordersData = await ordersApi.getMyOrders();
    orders.value = ordersData.map((o: any) => ({
      ...o,
      total: o.totalAmount,
      items: o.items.map((i: any) => ({
        id: i.productId || i.id,
        name: i.product?.name || 'Товар',
        price: i.price,
        quantity: i.quantity,
        imageUrl: i.product?.imageUrl || undefined,
        weight: i.product?.weight || undefined,
      })),
    }));
  } catch (e) {
    console.error('Ошибка отметки не доставлен:', e);
  }
  updatingIssue.value = false;
  closeDeliveryToast();
}

function openEditDrawer() { showEditDrawer.value = true; }
function closeEditDrawer() { showEditDrawer.value = false; }

onMounted(async () => {
  await loadProfileData();
  // Если в URL есть ?tab=favorites, переключаемся на вкладку избранного
  if (route.query.tab === 'favorites') {
    activeTab.value = 'favorites';
  }
  try { await visitsApi.track(); } catch (error) { console.error('Ошибка трекинга:', error); }
});

onUnmounted(() => {
  if (ordersAnimFrame) cancelAnimationFrame(ordersAnimFrame);
});
</script>

<style scoped>
/* ═══════════════════════════════════════════
   PROFILE PAGE — MODERN REDESIGN
   ═══════════════════════════════════════════ */

.profile-page {
  padding: 40px 0 80px;
  min-height: 80vh;
}

/* ── Loading ── */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 20px;
}
.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--color-border-light);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
.loading-state p {
  font-family: var(--font-body);
  font-size: 16px;
  color: var(--color-text-muted);
}
@keyframes spin { to { transform: rotate(360deg); } }

.error-state {
  text-align: center;
  padding: 80px 20px;
  font-size: 18px;
  color: var(--color-error);
  font-family: var(--font-body);
}

/* ── HERO ── */
.profile-hero {
  position: relative;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 50%, var(--color-accent) 100%);
  border-radius: var(--radius-xl);
  padding: 40px;
  overflow: hidden;
  margin-bottom: 32px;
}
.profile-hero__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.profile-hero__blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.15;
}
.profile-hero__blob--1 {
  width: 400px;
  height: 400px;
  background: #fff;
  top: -100px;
  right: -100px;
}
.profile-hero__blob--2 {
  width: 300px;
  height: 300px;
  background: var(--color-accent-light);
  bottom: -80px;
  left: -80px;
}

.profile-hero__content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 28px;
}

.profile-hero__avatar-wrap {
  flex-shrink: 0;
}
.profile-hero__avatar-ring {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  padding: 4px;
  background: conic-gradient(from 0deg, rgba(255,255,255,0.8), rgba(255,255,255,0.2), rgba(255,255,255,0.8));
  animation: avatarSpin 6s linear infinite;
}
@keyframes avatarSpin {
  to { transform: rotate(360deg); }
}
.profile-hero__avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}
.profile-hero__avatar-text {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 40px;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.profile-hero__status-dot {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #10b981;
  border: 3px solid var(--color-primary);
  box-shadow: 0 0 0 2px rgba(16,185,129,0.3);
  animation: pulse-dot 2s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%, 100% { box-shadow: 0 0 0 2px rgba(16,185,129,0.3); }
  50% { box-shadow: 0 0 0 6px rgba(16,185,129,0.1); }
}

.profile-hero__info {
  flex: 1;
}
.profile-hero__name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 32px;
  color: #fff;
  margin-bottom: 4px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.profile-hero__email {
  display: block;
  font-family: var(--font-body);
  font-size: 15px;
  color: rgba(255,255,255,0.8);
  margin-bottom: 2px;
}
.profile-hero__date {
  display: block;
  font-family: var(--font-body);
  font-size: 13px;
  color: rgba(255,255,255,0.6);
}

.profile-hero__actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

/* Glass button */
.btn--glass {
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.25);
  color: #fff;
  padding: 10px 20px;
  border-radius: var(--radius-full);
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
}
.btn--glass:hover {
  background: rgba(255,255,255,0.25);
  transform: translateY(-2px);
}

.btn--ghost-danger {
  background: rgba(239,68,68,0.35);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(239,68,68,0.55);
  color: #fff;
  padding: 10px 20px;
  border-radius: var(--radius-full);
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
}
.btn--ghost-danger:hover {
  background: rgba(239,68,68,0.55);
  border-color: rgba(239,68,68,0.8);
  transform: translateY(-2px);
}

/* ── Stats Row ── */
.profile-hero__stats {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 28px;
}

.stat-card {
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: var(--radius-lg);
  padding: 18px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: all 0.3s ease;
}
.stat-card--clickable {
  cursor: pointer;
}
.stat-card:hover {
  background: rgba(255,255,255,0.18);
  transform: translateY(-2px);
}
.stat-card__icon {
  font-size: 28px;
  flex-shrink: 0;
}
.stat-card__values {
  display: flex;
  flex-direction: column;
}
.stat-card__number {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 28px;
  color: #fff;
  line-height: 1;
}
.stat-card__label {
  font-family: var(--font-body);
  font-size: 13px;
  color: rgba(255,255,255,0.7);
  margin-top: 2px;
}

/* ── Tabs ── */
.profile-tabs {
  display: flex;
  gap: 4px;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 6px;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-xs);
  margin-bottom: 28px;
  overflow-x: auto;
}

.profile-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: var(--radius-md);
  border: none;
  background: none;
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 14px;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  position: relative;
}
.profile-tab:hover {
  color: var(--color-primary);
  background: var(--color-primary-soft);
}
.profile-tab--active {
  color: var(--color-primary);
  background: var(--color-primary-soft);
}
.profile-tab--active::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 20px;
  right: 20px;
  height: 2px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  border-radius: 2px;
}
.profile-tab__icon { font-size: 18px; }
.profile-tab__count {
  background: var(--color-border-light);
  padding: 1px 8px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-muted);
}
.profile-tab--active .profile-tab__count {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

/* ── Tab Content ── */
.tab-content {
  min-height: 300px;
}
.tab-fade-enter-active { animation: tabEnter 0.3s ease; }
.tab-fade-leave-active { animation: tabLeave 0.2s ease; }
@keyframes tabEnter {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes tabLeave {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-8px); }
}

/* ── Empty Block ── */
.empty-block {
  text-align: center;
  padding: 60px 20px;
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
}
.empty-block__icon { font-size: 56px; margin-bottom: 16px; }
.empty-block h3 {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 22px;
  color: var(--color-text);
  margin-bottom: 8px;
}
.empty-block p {
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--color-text-muted);
  margin-bottom: 20px;
}

/* ── Stagger ── */
.stagger-item {
  opacity: 0;
  animation: fadeInUp 0.4s ease forwards;
}
.stagger-item:nth-child(1) { animation-delay: 0.04s; }
.stagger-item:nth-child(2) { animation-delay: 0.08s; }
.stagger-item:nth-child(3) { animation-delay: 0.12s; }
.stagger-item:nth-child(4) { animation-delay: 0.16s; }
.stagger-item:nth-child(5) { animation-delay: 0.20s; }
.stagger-item:nth-child(6) { animation-delay: 0.24s; }
.stagger-item:nth-child(7) { animation-delay: 0.28s; }
.stagger-item:nth-child(8) { animation-delay: 0.32s; }
.stagger-item:nth-child(9) { animation-delay: 0.36s; }
.stagger-item:nth-child(10) { animation-delay: 0.40s; }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ═══════════════════════════════════════════
   ORDERS
   ═══════════════════════════════════════════ */

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.order-card {
  display: flex;
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  transition: all 0.25s ease;
}
.order-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.order-card__timeline {
  width: 5px;
  flex-shrink: 0;
  background: var(--color-border);
}
.order-card__timeline--paid { background: #10b981; }
.order-card__timeline--confirmed { background: #3b82f6; }
.order-card__timeline--received { background: #059669; }
.order-card__timeline--cancelled { background: #ef4444; }
.order-card__timeline--delivery_issue { background: #f59e0b; }
.order-card__timeline--new { background: #f59e0b; }

.order-card__body {
  flex: 1;
  padding: 20px;
}

.order-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
  gap: 12px;
}

.order-card__meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.order-card__id {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 16px;
  color: var(--color-text);
}
.order-card__date {
  font-size: 13px;
  color: var(--color-text-muted);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 12px;
  white-space: nowrap;
}
.status-badge--received { background: #d1fae5; color: #065f46; }
.status-badge--delivery_issue { background: #fef3c7; color: #92400e; }
.status-badge--cancelled { background: #fee2e2; color: #991b1b; }
.status-badge--new { background: #fef3c7; color: #92400e; }
.status-badge--paid { background: #d1fae5; color: #065f46; }
.status-badge--confirmed { background: #dbeafe; color: #1e40af; }

.order-card__products {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
}

.order-product-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: var(--color-border-light);
  border-radius: var(--radius-md);
  font-size: 13px;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}
.order-product-chip__name { font-weight: 500; }
.order-product-chip__qty { color: var(--color-text-muted); font-size: 12px; }
.order-product-chip--more { background: var(--color-primary-soft); color: var(--color-primary); border-color: var(--color-primary-light); font-weight: 600; }

.order-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.order-card__total {
  text-align: left;
}
.order-card__total-label {
  display: block;
  font-size: 12px;
  color: var(--color-text-muted);
}
.order-card__total-value {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 20px;
  color: var(--color-text);
}
.order-card__actions {
  display: flex;
  gap: 8px;
}

.action-chip {
  padding: 6px 14px;
  border-radius: var(--radius-full);
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  border: 1px solid;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.action-chip--success {
  background: #d1fae5;
  color: #065f46;
  border-color: #10b981;
}
.action-chip--success:hover { background: #10b981; color: #fff; }
.action-chip--danger {
  background: #fee2e2;
  color: #991b1b;
  border-color: #f87171;
}
.action-chip--danger:hover { background: #ef4444; color: #fff; }

/* ═══════════════════════════════════════════
   FAVORITES — GRID
   ═══════════════════════════════════════════ */

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.fav-card {
  position: relative;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  overflow: hidden;
  box-shadow: var(--shadow-card);
}
.fav-card__img-wrap {
  position: relative;
  width: 100%;
  height: 160px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.fav-card__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}
.fav-card:hover .fav-card__img { transform: scale(1.08); }

.fav-card__remove {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255,255,255,0.9);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-text-muted);
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
  opacity: 0;
  transform: scale(0.8);
}
.fav-card:hover .fav-card__remove {
  opacity: 1;
  transform: scale(1);
}
.fav-card__remove:hover { color: var(--color-error); background: #fee2e2; }

.fav-card__info {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.fav-card__name {
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 15px;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.fav-card__price {
  font-weight: 700;
  font-size: 16px;
  color: var(--color-primary);
}
.fav-card__stock {
  font-size: 12px;
  font-weight: 500;
}
.fav-card__stock--in { color: #065f46; }
.fav-card__stock--out { color: #991b1b; }

/* ===== Favorites Actions ===== */
.fav-card__actions {
  display: flex;
  gap: 6px;
  padding: 0 14px 14px;
}
.fav-card__cart-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 12px;
  border-radius: 10px;
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  border: none;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #fff;
  box-shadow: 0 2px 8px rgba(245,158,11,0.2);
  transition: all 0.2s ease;
}
.fav-card__cart-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245,158,11,0.3);
}
.fav-card__cart-btn:active {
  transform: translateY(0) scale(0.97);
}
.fav-card__remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 10px 12px;
  border-radius: 10px;
  font-family: var(--font-heading);
  font-weight: 500;
  font-size: 12px;
  cursor: pointer;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-muted);
  transition: all 0.2s ease;
  white-space: nowrap;
}
.fav-card__remove-btn:hover {
  background: #fee2e2;
  border-color: #fca5a5;
  color: var(--color-error);
}

/* ═══════════════════════════════════════════
   SUBSCRIPTIONS
   ═══════════════════════════════════════════ */

.subs-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sub-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 16px;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-card);
  transition: all 0.25s ease;
}
.sub-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.sub-card__img-wrap {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-border-light);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid var(--color-border);
}
.sub-card__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.sub-card__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.sub-card__name {
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 15px;
  color: var(--color-text);
}
.sub-card__date {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--color-text-muted);
}

.btn--danger-outline {
  padding: 8px 18px;
  border-radius: var(--radius-full);
  background: none;
  border: 1px solid #fecaca;
  color: var(--color-error);
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}
.btn--danger-outline:hover {
  background: #fee2e2;
  border-color: #f87171;
}

/* ═══════════════════════════════════════════
   SETTINGS
   ═══════════════════════════════════════════ */

.settings-card {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: 28px;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-card);
  margin-bottom: 16px;
}
.settings-card--admin {
  background: var(--color-primary-soft);
  border-color: var(--color-primary-light);
}
.settings-card__title {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 20px;
  color: var(--color-text);
  margin-bottom: 20px;
}
.settings-card__desc {
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 420px;
}

.settings-form__actions {
  padding-top: 8px;
}

/* Settings info rows */
.settings-info {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.settings-info__row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 16px;
  background: var(--color-border-light);
  border-radius: var(--radius-md);
}
.settings-info__label {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--color-text-muted);
  font-weight: 500;
  min-width: 140px;
  flex-shrink: 0;
}
.settings-info__value {
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 15px;
  color: var(--color-text);
}

/* Settings form fields */
.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-field__label {
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 13px;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.form-field__input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 15px;
  background: var(--color-background);
  color: var(--color-text);
  transition: all 0.2s ease;
}
.form-field__input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(232,69,69,0.08);
}
.form-field__input.input--invalid {
  border-color: #ef4444;
  background: #fef2f2;
}
.form-field__error {
  font-family: var(--font-body);
  font-size: 11px;
  color: #ef4444;
  font-weight: 500;
  animation: fadeInUp 0.2s ease;
}

/* Floating label groups */
.floating-group {
  position: relative;
}
.floating-group input {
  width: 100%;
  padding: 16px 16px 6px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 15px;
  background: var(--color-background);
  transition: all 0.2s ease;
}
.floating-group input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(232,69,69,0.08);
}
.floating-group label {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--color-text-muted);
  pointer-events: none;
  transition: all 0.2s ease;
}
.floating-group input:focus + label,
.floating-group .label--float {
  top: 8px;
  transform: translateY(0);
  font-size: 11px;
  color: var(--color-primary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ── Base Buttons ── */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: var(--radius-full);
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.25s ease;
  text-decoration: none;
  position: relative;
  overflow: hidden;
}
.btn--primary {
  background: var(--color-primary);
  color: #fff;
  box-shadow: 0 4px 14px rgba(211,84,0,0.3);
}
.btn--primary:hover:not(:disabled) {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(211,84,0,0.4);
}
.btn--primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn--outline {
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}
.btn--outline:hover { border-color: var(--color-primary); color: var(--color-primary); }
.btn--sm { padding: 8px 18px; font-size: 13px; }
.btn-loading { display: flex; align-items: center; gap: 8px; }
.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: inline-block;
}
.spinner--sm { width: 14px; height: 14px; border-width: 2px; }

/* ═══════════════════════════════════════════
   DRAWER (Slide-in панель)
   ═══════════════════════════════════════════ */

.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.4);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  justify-content: flex-end;
}

.drawer-panel {
  width: 100%;
  max-width: 420px;
  background: var(--color-surface);
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-shadow: -8px 0 32px rgba(0,0,0,0.1);
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid var(--color-border);
}
.drawer-title {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 20px;
  color: var(--color-text);
}
.drawer-close {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-border-light);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-text-muted);
  transition: all 0.2s ease;
}
.drawer-close:hover { background: var(--color-border); color: var(--color-text); }

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}
.drawer-form { display: flex; flex-direction: column; gap: 20px; }
.drawer-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.drawer-actions { display: flex; gap: 12px; padding-top: 8px; }
.drawer-actions .btn { flex: 1; }

/* Drawer transitions */
.drawer-enter-active { transition: opacity 0.3s ease; }
.drawer-leave-active { transition: opacity 0.25s ease; }
.drawer-enter-from, .drawer-leave-to { opacity: 0; }
.drawer-enter-active .drawer-panel { animation: drawerIn 0.3s ease; }
.drawer-leave-active .drawer-panel { animation: drawerIn 0.25s ease reverse; }
@keyframes drawerIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

/* ═══════════════════════════════════════════
   TOAST
   ═══════════════════════════════════════════ */

.toast-overlay {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 3000;
  max-width: 400px;
}
.toast-card {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: 24px;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.toast-icon { font-size: 32px; text-align: center; }
.toast-content { text-align: center; }
.toast-title {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 18px;
  color: var(--color-text);
  margin-bottom: 8px;
}
.toast-text {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.5;
}
.toast-text strong { color: var(--color-primary); }
.toast-actions { display: flex; gap: 8px; justify-content: center; }
.toast-actions .btn { flex: 0 1 auto; min-width: 100px; }

.toast-slide-enter-active { animation: toastIn 0.4s ease; }
.toast-slide-leave-active { animation: toastIn 0.3s ease reverse; }
@keyframes toastIn {
  from { opacity: 0; transform: translateX(60px); }
  to { opacity: 1; transform: translateX(0); }
}

/* ═══════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════ */

@media (max-width: 992px) {
  .profile-hero__stats { grid-template-columns: repeat(2, 1fr); }
  .favorites-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
}

@media (max-width: 768px) {
  .profile-hero { padding: 28px 20px; }
  .profile-hero__content { flex-direction: column; text-align: center; gap: 16px; }
  .profile-hero__actions { justify-content: center; }
  .profile-hero__name { font-size: 24px; }
  .profile-hero__stats { grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 20px; }
  .profile-tabs { gap: 2px; padding: 4px; }
  .profile-tab { padding: 10px 14px; font-size: 13px; }
  .profile-tab__label { display: none; }
  .order-card__header { flex-direction: column; }
  .order-card__actions { flex-wrap: wrap; }
  .favorites-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .fav-card__img-wrap { height: 120px; }
  .drawer-panel { max-width: 100%; }
  .toast-overlay { left: 16px; right: 16px; bottom: 16px; }
}

@media (max-width: 480px) {
  .profile-page { padding: 20px 0 60px; }
  .profile-hero { padding: 20px 16px; }
  .profile-hero__avatar-ring { width: 72px; height: 72px; }
  .profile-hero__avatar-text { font-size: 28px; }
  .stat-card { padding: 12px; gap: 10px; }
  .stat-card__number { font-size: 22px; }
  .favorites-grid { grid-template-columns: 1fr 1fr; gap: 8px; }
  .fav-card__img-wrap { height: 100px; }
}
</style>