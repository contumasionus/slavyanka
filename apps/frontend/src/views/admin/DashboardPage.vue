<template>
  <div class="dashboard">
    <div class="dashboard__header">
      <div>
        <h1 class="dashboard__title">Дашборд</h1>
        <p class="dashboard__subtitle">Обзор магазина «Славянка»</p>
      </div>
      <router-link to="/" class="dashboard__site-link" title="На сайт">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        <span>На сайт</span>
      </router-link>
    </div>

    <!-- Статистика -->
    <div class="stats-grid">
      <div class="stat-card stat-card--red">
        <div class="stat-card__icon-ring">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
        </div>
        <div class="stat-card__info">
          <span class="stat-card__value">{{ stats.products }}</span>
          <span class="stat-card__label">Товаров</span>
        </div>
        <div class="stat-card__bg"></div>
      </div>
      <div class="stat-card stat-card--red2">
        <div class="stat-card__icon-ring">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div class="stat-card__info">
          <span class="stat-card__value">{{ stats.categories }}</span>
          <span class="stat-card__label">Категорий</span>
        </div>
        <div class="stat-card__bg"></div>
      </div>
      <div class="stat-card stat-card--gold">
        <div class="stat-card__icon-ring">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <div class="stat-card__info">
          <span class="stat-card__value">{{ stats.orders }}</span>
          <span class="stat-card__label">Заказов</span>
        </div>
        <div class="stat-card__bg"></div>
      </div>
      <div class="stat-card stat-card--red3">
        <div class="stat-card__icon-ring">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
        </div>
        <div class="stat-card__info">
          <span class="stat-card__value">{{ stats.users }}</span>
          <span class="stat-card__label">Пользователей</span>
        </div>
        <div class="stat-card__bg"></div>
      </div>
    </div>

    <!-- Быстрые действия -->
    <div class="quick-actions">
      <h2 class="quick-actions__title">Быстрые действия</h2>
      <div class="quick-actions__grid">
        <router-link to="/admin/products" class="action-card">
          <span class="action-card__icon">📦</span>
          <span class="action-card__text">Управление товарами</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </router-link>
        <router-link to="/admin/categories" class="action-card">
          <span class="action-card__icon">📂</span>
          <span class="action-card__text">Управление категориями</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </router-link>
        <router-link to="/admin/orders" class="action-card">
          <span class="action-card__icon">📋</span>
          <span class="action-card__text">Просмотр заказов</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </router-link>
        <router-link to="/admin/users" class="action-card">
          <span class="action-card__icon">👥</span>
          <span class="action-card__text">Пользователи</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { productsApi } from '../../api/products.api';
import { categoriesApi } from '../../api/categories.api';
import { ordersApi } from '../../api/orders.api';

const stats = ref({ products: 0, categories: 0, orders: 0, users: 0 });

onMounted(async () => {
  try {
    const [products, categories, orders] = await Promise.all([
      productsApi.getAll(),
      categoriesApi.getAll(),
      ordersApi.getAll()
    ]);
    stats.value = { products: products.length, categories: categories.length, orders: orders.length, users: 0 };
  } catch (error) { console.error('Ошибка загрузки статистики:', error); }
});
</script>

<style scoped>
.dashboard {
  padding: 32px;
  max-width: 1100px;
}

.dashboard__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}
.dashboard__title {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 30px;
  color: var(--color-text);
  margin-bottom: 4px;
}
.dashboard__subtitle {
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--color-text-muted);
}
.dashboard__site-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-family: var(--font-heading);
  font-weight: 500;
  font-size: 13px;
  transition: all var(--transition-fast);
}
.dashboard__site-link:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 36px;
}
.stat-card {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: 24px;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-xs);
  position: relative;
  overflow: hidden;
  transition: all var(--transition-normal);
}
.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
.stat-card__icon-ring {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}
.stat-card--red .stat-card__icon-ring { background: var(--color-primary-soft); color: var(--color-primary-dark); }
.stat-card--red2 .stat-card__icon-ring { background: #fce4e4; color: #c0392b; }
.stat-card--gold .stat-card__icon-ring { background: var(--color-accent-light); color: #b45309; }
.stat-card--red3 .stat-card__icon-ring { background: #fde8e8; color: var(--color-primary); }
.stat-card__info { position: relative; z-index: 1; }
.stat-card__value {
  display: block;
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 36px;
  color: var(--color-text);
  line-height: 1;
}
.stat-card__label {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--color-text-muted);
  margin-top: 4px;
  display: block;
}
.stat-card__bg {
  position: absolute;
  top: -30px;
  right: -30px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  opacity: 0.08;
}
.stat-card--red .stat-card__bg { background: var(--color-primary); }
.stat-card--red2 .stat-card__bg { background: #c0392b; }
.stat-card--gold .stat-card__bg { background: var(--color-accent); }
.stat-card--red3 .stat-card__bg { background: var(--color-primary); }

/* Quick Actions */
.quick-actions__title {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 20px;
  color: var(--color-text);
  margin-bottom: 16px;
}
.quick-actions__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.action-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  text-decoration: none;
  font-family: var(--font-heading);
  font-weight: 500;
  font-size: 14px;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-xs);
}
.action-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary-light);
  color: var(--color-primary);
}
.action-card__icon { font-size: 22px; flex-shrink: 0; }
.action-card__text { flex: 1; }
.action-card svg { color: var(--color-text-muted); flex-shrink: 0; }
.action-card:hover svg { color: var(--color-primary); }

@media (max-width: 900px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .quick-actions__grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .dashboard { padding: 20px 16px; }
  .stats-grid { grid-template-columns: 1fr; }
  .quick-actions__grid { grid-template-columns: 1fr; }
  .dashboard__header { flex-direction: column; gap: 12px; }
}
</style>