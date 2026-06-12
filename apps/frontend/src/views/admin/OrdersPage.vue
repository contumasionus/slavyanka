<template>
  <div class="admin-orders">
    <div class="admin-header">
      <h1 class="admin-title">Управление заказами</h1>
      <div class="admin-header__right">
        <button
          @click="showIssuesOnly = !showIssuesOnly"
          class="filter-btn"
          :class="{ 'filter-btn--active': showIssuesOnly }"
        >
          {{ showIssuesOnly ? 'Все заказы' : 'Проблемные заказы' }}
        </button>
        <span class="admin-count">{{ filteredOrders.length }} заказов</span>
      </div>
    </div>

    <!-- Состояние загрузки -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Загрузка заказов...</p>
    </div>

    <!-- Ошибка -->
    <div v-else-if="error" class="error-state">
      <span class="empty-state__icon">⚠️</span>
      <h3>Ошибка загрузки</h3>
      <p>{{ error }}</p>
      <button @click="loadOrders" class="action-btn action-btn--confirm" style="margin-top: 12px;">Повторить</button>
    </div>

    <!-- Пустой список -->
    <div v-else-if="filteredOrders.length === 0" class="empty-state">
      <span class="empty-state__icon">📋</span>
      <h3>Заказов пока нет</h3>
      <p>Когда покупатели оформят заказы через корзину, они появятся здесь</p>
    </div>

    <!-- Список заказов -->
    <div v-else class="orders-list">
      <div v-for="order in filteredOrders" :key="order.id" class="order-card" :class="{ 'order-card--issue': order.status === 'delivery_issue' }">
        <div class="order-card__header">
          <div class="order-card__header-left">
            <span class="order-id">Заказ #{{ order.id.slice(0, 8) }}</span>
            <span class="order-status-badge" :class="'order-status-badge--' + order.status">
              {{ statusLabels[order.status] }}
            </span>
          </div>
          <span class="order-date">{{ formatDate(order.createdAt) }}</span>
        </div>

        <div class="order-card__body">
          <div class="order-card__customer">
            <div class="customer-info">
              <span class="customer-name">{{ order.customerName }}</span>
              <span class="customer-phone">{{ order.customerPhone }}</span>
              <span class="customer-addr" v-if="order.customerAddress">{{ order.customerAddress }}</span>
            </div>
          </div>

          <div class="order-card__payment">
            <template v-if="order.paymentMethod === 'cash'">
              <span class="payment-badge">💵 Оплата наличными при получении</span>
            </template>
            <template v-else>
              <span class="payment-badge" :class="{ 'payment-badge--paid': order.paid }">
                {{ order.paid ? '✅ Оплачено' : '❌ Не оплачено' }}
              </span>
              <span v-if="order.paymentMethod === 'qr'" class="payment-detail">через QR-код</span>
              <span v-else-if="order.paymentMethod === 'card'" class="payment-detail">····{{ order.cardLast4 }}</span>
            </template>
          </div>

          <div class="order-card__items">
            <span v-for="item in order.items" :key="item.id" class="order-item-tag">
              {{ item.name }} ×{{ item.quantity }}
            </span>
          </div>

          <div v-if="order.comment" class="order-card__comment">
            💬 {{ order.comment }}
          </div>
        </div>

        <div class="order-card__footer">
          <div class="order-card__footer-left">
            <button
              v-if="order.status === 'new' || order.status === 'paid'"
              @click="confirmOrder(order.id, order.userId)"
              class="action-btn action-btn--confirm"
              :disabled="updatingOrderId === order.id"
            >
              <template v-if="updatingOrderId === order.id">...</template>
              <template v-else>✅ {{ order.status === 'new' ? 'Принять' : 'Подтвердить' }} заказ</template>
            </button>
            <button
              v-if="order.status !== 'cancelled' && order.status !== 'confirmed' && order.status !== 'received'"
              @click="cancelOrder(order.id)"
              class="action-btn action-btn--cancel"
              :disabled="updatingOrderId === order.id"
            >
              {{ updatingOrderId === order.id ? '...' : '❌ Отменить заказ' }}
            </button>
          </div>
          <span class="order-total">{{ formatPrice(order.total) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ordersApi } from '../../api/orders.api';
import { chatApi } from '../../api/chat.api';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface AdminOrder {
  id: string;
  userId?: string;
  status: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  paid: boolean;
  paymentMethod: string;
  cardLast4: string;
  items: OrderItem[];
  comment: string;
  total: number;
}

const orders = ref<AdminOrder[]>([]);
const loading = ref(true);
const error = ref('');
const updatingOrderId = ref<string | null>(null);

const statusLabels: Record<string, string> = {
  'new': 'Новый',
  'paid': 'Оплачен',
  'confirmed': 'Подтверждён',
  'cancelled': 'Отменён',
  'received': 'Получен покупателем',
  'delivery_issue': 'Проблема с доставкой',
};

const showIssuesOnly = ref(false);

const filteredOrders = computed(() => {
  if (showIssuesOnly.value) {
    return orders.value.filter(o => o.status === 'delivery_issue');
  }
  return orders.value;
});

function mapServerOrder(serverOrder: any): AdminOrder {
  return {
    id: serverOrder.id,
    userId: serverOrder.userId,
    status: serverOrder.status,
    createdAt: serverOrder.createdAt,
    customerName: serverOrder.customerName,
    customerPhone: serverOrder.customerPhone,
    customerAddress: serverOrder.customerAddress,
    paid: serverOrder.paid,
    paymentMethod: serverOrder.paymentMethod || '',
    cardLast4: serverOrder.cardLast4 || '',
    items: (serverOrder.items || []).map((i: any) => ({
      id: i.id,
      name: i.product?.name || 'Товар',
      quantity: i.quantity,
      price: i.price,
    })),
    comment: serverOrder.comment || '',
    total: serverOrder.totalAmount,
  };
}

async function loadOrders() {
  loading.value = true;
  error.value = '';
  try {
    const data = await ordersApi.getAll();
    orders.value = (Array.isArray(data) ? data : []).map(mapServerOrder);
  } catch (e: any) {
    error.value = e?.response?.data?.error || 'Не удалось загрузить заказы';
    orders.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(loadOrders);

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

function formatPrice(p: number) { return `${p.toLocaleString('ru-RU')}₽`; }

async function confirmOrder(orderId: string, userId?: string) {
  updatingOrderId.value = orderId;
  try {
    await ordersApi.updateStatus(orderId, 'confirmed');

    // Отправляем уведомление в чат пользователю
    if (userId) {
      try {
        await chatApi.sendToUser(userId, '✅ Ваш заказ одобрен! Ожидайте курьера в ближайшее время.');
      } catch (e) {
        console.error('Ошибка отправки уведомления в чат:', e);
      }
    }

    await loadOrders();
  } catch (e) {
    console.error('Ошибка подтверждения заказа:', e);
  } finally {
    updatingOrderId.value = null;
  }
}

async function cancelOrder(orderId: string) {
  updatingOrderId.value = orderId;
  try {
    await ordersApi.updateStatus(orderId, 'cancelled');
    await loadOrders();
  } catch (e) {
    console.error('Ошибка отмены заказа:', e);
  } finally {
    updatingOrderId.value = null;
  }
}
</script>

<style scoped>
.admin-orders { padding: 24px; }
.admin-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 24px; flex-wrap: wrap; gap: 12px;
}
.admin-title { font-family: var(--font-heading); font-weight: 700; font-size: 28px; color: var(--color-text); }
.admin-count { font-family: var(--font-body); font-size: 14px; color: var(--color-text-muted); background: var(--color-border-light); padding: 6px 14px; border-radius: var(--radius-full); }

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
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
@keyframes spin { to { transform: rotate(360deg); } }
.loading-state p { font-family: var(--font-body); font-size: 16px; color: var(--color-text-muted); }

.error-state { text-align: center; padding: 80px 20px; }
.error-state h3 { font-family: var(--font-heading); font-weight: 700; font-size: 20px; color: var(--color-text); margin-bottom: 6px; }
.error-state p { font-family: var(--font-body); font-size: 15px; color: var(--color-text-muted); }

.empty-state { text-align: center; padding: 80px 20px; }
.empty-state__icon { font-size: 48px; display: block; margin-bottom: 16px; }
.empty-state h3 { font-family: var(--font-heading); font-weight: 700; font-size: 20px; color: var(--color-text); margin-bottom: 6px; }
.empty-state p { font-family: var(--font-body); font-size: 15px; color: var(--color-text-muted); }

.orders-list { display: flex; flex-direction: column; gap: 16px; }
.order-card {
  background: var(--color-surface); border-radius: var(--radius-lg);
  padding: 20px 24px; border: 1px solid var(--color-border);
  box-shadow: var(--shadow-xs); transition: all var(--transition-fast);
}
.order-card:hover { box-shadow: var(--shadow-md); }
.order-card--issue { border-color: #f87171; background: #fef2f2; }

.order-card__header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 12px; padding-bottom: 10px;
  border-bottom: 1px solid var(--color-border-light);
  flex-wrap: wrap; gap: 8px;
}
.order-card__header-left { display: flex; align-items: center; gap: 10px; }
.order-id { font-family: var(--font-heading); font-weight: 700; font-size: 16px; color: var(--color-text); }
.order-date { font-size: 13px; color: var(--color-text-muted); }

/* Status Badge */
.order-status-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 12px;
  white-space: nowrap;
}
.order-status-badge--new { background: #fef3c7; color: #92400e; }
.order-status-badge--paid { background: #d1fae5; color: #065f46; }
.order-status-badge--confirmed { background: var(--color-primary-soft); color: var(--color-primary-dark); }
.order-status-badge--cancelled { background: #fee2e2; color: #991b1b; }
.order-status-badge--received { background: #d1fae5; color: #065f46; }
.order-status-badge--delivery_issue { background: #fee2e2; color: #991b1b; }

.order-card__body { margin-bottom: 12px; }

.order-card__customer { margin-bottom: 10px; }
.customer-info { display: flex; gap: 16px; flex-wrap: wrap; }
.customer-name { font-family: var(--font-heading); font-weight: 600; font-size: 14px; color: var(--color-text); }
.customer-phone { font-size: 14px; color: var(--color-text-secondary); }
.customer-addr { font-size: 14px; color: var(--color-text-muted); }

/* Payment */
.order-card__payment {
  display: flex; align-items: center; gap: 6px;
  margin-bottom: 10px; padding: 6px 12px;
  background: var(--color-border-light);
  border-radius: var(--radius-md);
  width: fit-content;
}
.payment-badge { font-family: var(--font-body); font-weight: 500; font-size: 13px; color: var(--color-text-muted); }
.payment-badge--paid { color: #065f46; }
.payment-detail {
  font-family: var(--font-body); font-size: 13px;
  color: var(--color-text-secondary); font-weight: 500;
}

.order-card__items { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
.order-item-tag {
  font-size: 12px; background: var(--color-border-light);
  padding: 3px 10px; border-radius: var(--radius-full);
  color: var(--color-text-secondary); font-family: var(--font-body);
}
.order-card__comment {
  font-size: 13px; color: var(--color-text-muted);
  font-style: italic; margin-bottom: 6px;
}

.order-card__footer {
  display: flex; justify-content: space-between; align-items: center;
  padding-top: 12px; border-top: 1px solid var(--color-border-light);
  flex-wrap: wrap; gap: 12px;
}
.order-card__footer-left { display: flex; gap: 8px; flex-wrap: wrap; }

.action-btn {
  padding: 8px 16px;
  border-radius: var(--radius-md);
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  border: none;
  transition: all var(--transition-fast);
  white-space: nowrap;
}
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.action-btn--confirm {
  background: #d1fae5; color: #065f46; border: 1px solid #10b981;
}
.action-btn--confirm:hover:not(:disabled) { background: #10b981; color: #fff; }
.action-btn--cancel {
  background: #fee2e2; color: #991b1b; border: 1px solid #f87171;
}
.action-btn--cancel:hover:not(:disabled) { background: #ef4444; color: #fff; }

.order-total { font-family: var(--font-heading); font-weight: 800; font-size: 20px; color: var(--color-primary); }

.filter-btn { padding: 8px 16px; border-radius: var(--radius-full); font-family: var(--font-heading); font-weight: 600; font-size: 13px; cursor: pointer; border: 1px solid var(--color-border); background: var(--color-surface); color: var(--color-text-secondary); transition: all var(--transition-fast); white-space: nowrap; }
.filter-btn:hover { border-color: var(--color-primary); color: var(--color-primary); }
.filter-btn--active { background: #fee2e2; color: #991b1b; border-color: #f87171; }
.filter-btn--active:hover { background: #fecaca; }

.admin-header__right { display: flex; align-items: center; gap: 12px; }

@media (max-width: 600px) {
  .admin-orders { padding: 16px; }
  .order-card { padding: 16px; }
  .customer-info { flex-direction: column; gap: 4px; }
  .order-card__footer { flex-direction: column; align-items: stretch; }
  .order-card__footer-left { justify-content: center; }
  .action-btn { flex: 1; text-align: center; }
}
</style>