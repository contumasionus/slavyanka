<template>
  <div class="orders-admin">
    <h1 class="orders-admin__title">Управление заказами</h1>
    
    <div class="orders-admin__list">
      <div v-for="order in orders" :key="order.id" class="orders-admin__item">
        <div class="orders-admin__info">
          <h3>Заказ #{{ order.id.slice(0, 8) }}</h3>
          <p>Пользователь: {{ order.user?.name || 'Неизвестно' }}</p>
          <p>Сумма: {{ order.totalAmount }}₽</p>
          <p>Дата: {{ formatDate(order.createdAt) }}</p>
        </div>
        <div class="orders-admin__status">
          <select :value="order.status" @change="updateStatus(order.id, ($event.target as HTMLSelectElement).value)">
            <option value="new">Новый</option>
            <option value="processing">В обработке</option>
            <option value="ready">Готов</option>
            <option value="completed">Завершен</option>
          </select>
        </div>
        <div class="orders-admin__items">
          <h4>Товары:</h4>
          <ul>
            <li v-for="item in order.items" :key="item.id">
              {{ item.product?.name }} x {{ item.quantity }} = {{ item.price * item.quantity }}₽
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ordersApi } from '../../api/orders.api';
import { Order } from '@slavyanka/shared-types';

const orders = ref<Order[]>([]);

onMounted(async () => {
  await loadOrders();
});

async function loadOrders() {
  orders.value = await ordersApi.getAll();
}

async function updateStatus(id: string, status: string) {
  await ordersApi.updateStatus(id, status);
  await loadOrders();
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
</script>

<style scoped>
.orders-admin {
  padding: 20px;
}

.orders-admin__title {
  font-family: var(--font-inter);
  font-weight: 700;
  font-size: 32px;
  color: var(--color-text);
  margin-bottom: 30px;
}

.orders-admin__list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.orders-admin__item {
  background-color: var(--color-white);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.orders-admin__info {
  margin-bottom: 15px;
}

.orders-admin__info h3 {
  font-family: var(--font-inter);
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 10px;
}

.orders-admin__info p {
  font-family: var(--font-inter);
  font-size: 14px;
  color: var(--color-text-light);
  margin-bottom: 5px;
}

.orders-admin__status {
  margin-bottom: 15px;
}

.orders-admin__status select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: var(--font-inter);
  font-size: 14px;
}

.orders-admin__items h4 {
  font-family: var(--font-inter);
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 10px;
}

.orders-admin__items ul {
  list-style: none;
  padding: 0;
}

.orders-admin__items li {
  font-family: var(--font-inter);
  font-size: 14px;
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}

.orders-admin__items li:last-child {
  border-bottom: none;
}

@media (max-width: 768px) {
  .orders-admin__title {
    font-size: 24px;
  }
}
</style>