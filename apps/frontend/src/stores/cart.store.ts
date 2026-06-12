import { ref, computed, watch } from 'vue';

const GUEST_STORAGE_KEY = 'slavyanka-cart-guest';
const ORDERS_STORAGE_KEY = 'slavyanka-orders';

let storageKey = GUEST_STORAGE_KEY;

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  weight?: string;
  quantity: number;
}

export type OrderStatus = 'new' | 'paid' | 'confirmed' | 'cancelled' | 'received' | 'delivery_issue';

export interface OrderData {
  id: string;
  items: CartItem[];
  total: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  comment: string;
  createdAt: string;
  paid: boolean;
  paymentMethod: 'card' | 'cash' | '';
  cardLast4: string;
  status: OrderStatus;
}

const items = ref<CartItem[]>([]);

function loadCart() {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      items.value = JSON.parse(saved);
    } else {
      items.value = [];
    }
  } catch (e) {
    console.error('Failed to load cart:', e);
    items.value = [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(items.value));
  } catch (e) {
    console.error('Failed to save cart:', e);
  }
}

// Загружаем изначально (гость или последний пользователь)
loadCart();

// Сохраняем изменения
watch(items, () => {
  saveCart();
}, { deep: true });

/** Сброс корзины в памяти */
export function resetCart() {
  items.value = [];
}

/** Привязать корзину к userId (или null для гостя) */
export function setCartUserId(userId: string | null) {
  const newKey = userId ? `slavyanka-cart-${userId}` : GUEST_STORAGE_KEY;
  if (newKey !== storageKey) {
    storageKey = newKey;
    loadCart();
  }
}

// События для анимаций корзины
type CartEvent = { type: 'added' | 'removed' | 'updated'; itemId: string };
const cartEvent = ref<CartEvent | null>(null);

export function emitCartEvent(event: CartEvent) {
  cartEvent.value = event;
  setTimeout(() => { cartEvent.value = null; }, 300);
}

export function useCart() {
  const count = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0));
  const total = computed(() => items.value.reduce((sum, item) => sum + item.price * item.quantity, 0));
  const allItems = computed(() => [...items.value]);

  const freeShippingThreshold = 1500;
  const freeShippingProgress = computed(() => {
    const t = total.value;
    if (t >= freeShippingThreshold) return 100;
    return Math.round((t / freeShippingThreshold) * 100);
  });
  const freeShippingRemaining = computed(() => {
    const rem = freeShippingThreshold - total.value;
    return rem > 0 ? rem : 0;
  });

  function addItem(product: { id: string; name: string; price: number; imageUrl?: string; weight?: string }, quantity: number = 1) {
    const existing = items.value.find(i => i.id === product.id);
    if (existing) {
      existing.quantity += quantity;
      emitCartEvent({ type: 'updated', itemId: product.id });
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        weight: product.weight,
        quantity,
      });
      emitCartEvent({ type: 'added', itemId: product.id });
    }
  }

  function removeItem(id: string) {
    const index = items.value.findIndex(i => i.id === id);
    if (index !== -1) {
      items.value.splice(index, 1);
      emitCartEvent({ type: 'removed', itemId: id });
    }
  }

  function updateQuantity(id: string, quantity: number) {
    const item = items.value.find(i => i.id === id);
    if (item) {
      if (quantity <= 0) {
        removeItem(id);
      } else {
        item.quantity = quantity;
        emitCartEvent({ type: 'updated', itemId: id });
      }
    }
  }

  function clearCart() {
    items.value = [];
  }

  function isInCart(id: string): boolean {
    return items.value.some(i => i.id === id);
  }

  function getItemQuantity(id: string): number {
    const item = items.value.find(i => i.id === id);
    return item ? item.quantity : 0;
  }

  // Сохранение заказа в localStorage (имитация отправки на сервер)
  function placeOrder(customerData: { name: string; phone: string; address: string; comment?: string }, paymentInfo?: { method: 'card' | 'cash'; cardLast4?: string }): OrderData {
    const order: OrderData = {
      id: 'order-' + Date.now(),
      items: [...items.value.map(i => ({ ...i }))],
      total: total.value,
      customerName: customerData.name,
      customerPhone: customerData.phone,
      customerAddress: customerData.address,
      comment: customerData.comment || '',
      createdAt: new Date().toISOString(),
      paid: paymentInfo ? true : false,
      paymentMethod: paymentInfo?.method || '',
      cardLast4: paymentInfo?.cardLast4 || '',
      status: paymentInfo ? 'paid' : 'new',
    };

    // Сохраняем в историю заказов
    const existingOrders: OrderData[] = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
    existingOrders.unshift(order);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(existingOrders));

    // Очищаем корзину
    clearCart();

    return order;
  }

  // Получить историю заказов
  function getOrderHistory(): OrderData[] {
    try {
      const orders = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
      return orders.map((o: any) => ({
        ...o,
        paid: o.paid !== undefined ? o.paid : (o.status === 'paid' || o.status === 'confirmed'),
        paymentMethod: o.paymentMethod || '',
        cardLast4: o.cardLast4 || '',
        status: o.status || 'new',
      }));
    } catch {
      return [];
    }
  }

  // Обновить статус заказа
  function updateOrderStatus(orderId: string, newStatus: OrderStatus): boolean {
    try {
      const existingOrders: OrderData[] = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
      const index = existingOrders.findIndex(o => o.id === orderId);
      if (index === -1) return false;
      existingOrders[index].status = newStatus;
      if (newStatus === 'paid') existingOrders[index].paid = true;
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(existingOrders));
      return true;
    } catch {
      return false;
    }
  }

  function markOrderReceived(orderId: string): boolean {
    return updateOrderStatus(orderId, 'received');
  }

  function markOrderNotDelivered(orderId: string): boolean {
    return updateOrderStatus(orderId, 'delivery_issue');
  }

  return {
    items: allItems,
    count,
    total,
    freeShippingThreshold,
    freeShippingProgress,
    freeShippingRemaining,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
    placeOrder,
    getOrderHistory,
    updateOrderStatus,
    markOrderReceived,
    markOrderNotDelivered,
    cartEvent,
  };
}