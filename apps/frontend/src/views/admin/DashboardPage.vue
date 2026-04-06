<template>
  <div class="dashboard">
    <h1 class="dashboard__title">Дашборд</h1>
    
    <div class="dashboard__stats">
      <div class="dashboard__stat">
        <h3>Товары</h3>
        <p class="dashboard__stat-value">{{ stats.products }}</p>
      </div>
      <div class="dashboard__stat">
        <h3>Категории</h3>
        <p class="dashboard__stat-value">{{ stats.categories }}</p>
      </div>
      <div class="dashboard__stat">
        <h3>Заказы</h3>
        <p class="dashboard__stat-value">{{ stats.orders }}</p>
      </div>
      <div class="dashboard__stat">
        <h3>Пользователи</h3>
        <p class="dashboard__stat-value">{{ stats.users }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { productsApi } from '../../api/products.api';
import { categoriesApi } from '../../api/categories.api';
import { ordersApi } from '../../api/orders.api';

const stats = ref({
  products: 0,
  categories: 0,
  orders: 0,
  users: 0
});

onMounted(async () => {
  try {
    const [products, categories, orders] = await Promise.all([
      productsApi.getAll(),
      categoriesApi.getAll(),
      ordersApi.getAll()
    ]);
    
    stats.value = {
      products: products.length,
      categories: categories.length,
      orders: orders.length,
      users: 0
    };
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
});
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.dashboard__title {
  font-family: var(--font-inter);
  font-weight: 700;
  font-size: 32px;
  color: var(--color-text);
  margin-bottom: 30px;
}

.dashboard__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.dashboard__stat {
  background-color: var(--color-white);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dashboard__stat h3 {
  font-family: var(--font-inter);
  font-weight: 500;
  font-size: 14px;
  color: var(--color-text-light);
  margin-bottom: 8px;
}

.dashboard__stat-value {
  font-family: var(--font-inter);
  font-weight: 700;
  font-size: 36px;
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .dashboard__stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .dashboard__stats {
    grid-template-columns: 1fr;
  }
  
  .dashboard__title {
    font-size: 24px;
  }
}
</style>