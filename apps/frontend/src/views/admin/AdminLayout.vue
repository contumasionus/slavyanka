<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="sidebar__header">
        <router-link to="/" class="sidebar__logo">Славянка</router-link>
        <span class="sidebar__badge">Админ-панель</span>
      </div>
      <nav class="sidebar__nav">
        <router-link to="/admin/dashboard" class="sidebar__link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          Дашборд
        </router-link>
        <router-link to="/admin/products" class="sidebar__link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
          Товары
        </router-link>
        <router-link to="/admin/categories" class="sidebar__link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          Категории
        </router-link>
        <router-link to="/admin/orders" class="sidebar__link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          Заказы
        </router-link>
        <router-link to="/admin/chats" class="sidebar__link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Чаты
        </router-link>
        <router-link to="/admin/messages" class="sidebar__link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="14" y2="13"/></svg>
          Отзывы
        </router-link>
        <router-link to="/admin/users" class="sidebar__link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Пользователи
        </router-link>
      </nav>
      <div class="sidebar__footer">
        <div class="sidebar__user">
          <div class="sidebar__avatar">{{ authStore.user?.name?.charAt(0) || 'A' }}</div>
          <div class="sidebar__user-info">
            <span class="sidebar__user-name">{{ authStore.user?.name || 'Администратор' }}</span>
            <span class="sidebar__user-role">Админ</span>
          </div>
        </div>
        <button @click="handleLogout" class="sidebar__logout">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Выйти
        </button>
      </div>
    </aside>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();

function handleLogout() {
  authStore.logout();
  router.push('/admin/login');
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f1f5f9;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: #ffffff;
  color: var(--color-text);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  border-right: 1px solid var(--color-border);
}

.sidebar__header {
  padding: 28px 24px 20px;
  border-bottom: 1px solid var(--color-border-light);
}
.sidebar__logo {
  font-family: var(--font-display);
  font-size: 28px;
  color: var(--color-primary);
  text-decoration: none;
  display: block;
  margin-bottom: 2px;
}
.sidebar__badge {
  font-family: var(--font-heading);
  font-size: 11px;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* Nav */
.sidebar__nav {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
}
.sidebar__link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 16px;
  border-radius: var(--radius-md);
  font-family: var(--font-heading);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: all var(--transition-fast);
  position: relative;
}
.sidebar__link svg {
  flex-shrink: 0;
  opacity: 0.6;
  transition: opacity var(--transition-fast);
}
.sidebar__link:hover {
  color: var(--color-text);
  background: var(--color-primary-soft);
}
.sidebar__link:hover svg { opacity: 1; }
.sidebar__link.router-link-active {
  color: var(--color-primary-dark);
  background: var(--color-primary-soft);
  font-weight: 600;
}
.sidebar__link.router-link-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 3px;
  background: var(--color-primary);
  border-radius: 0 3px 3px 0;
}
.sidebar__link.router-link-active svg {
  color: var(--color-primary);
  opacity: 1;
}

/* Footer */
.sidebar__footer {
  padding: 16px 12px;
  border-top: 1px solid var(--color-border-light);
}
.sidebar__user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  margin-bottom: 8px;
}
.sidebar__avatar {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
}
.sidebar__user-info {
  display: flex;
  flex-direction: column;
}
.sidebar__user-name {
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 13px;
  color: var(--color-text);
  line-height: 1.2;
}
.sidebar__user-role {
  font-size: 11px;
  color: var(--color-text-muted);
}
.sidebar__logout {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-family: var(--font-heading);
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.sidebar__logout:hover {
  background: #fef2f2;
  border-color: var(--color-error);
  color: var(--color-error);
}

/* Main */
.main-content {
  flex: 1;
  margin-left: 260px;
  min-height: 100vh;
}

@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
  }
  .sidebar {
    position: static;
    width: 100%;
    flex-direction: row;
    align-items: center;
    padding: 12px 16px;
    gap: 12px;
    overflow-x: auto;
    border-right: none;
    border-bottom: 1px solid var(--color-border);
  }
  .sidebar__header {
    padding: 0;
    border-bottom: none;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sidebar__logo { font-size: 20px; }
  .sidebar__badge { font-size: 10px; }
  .sidebar__nav {
    flex-direction: row;
    padding: 0;
    gap: 4px;
    flex: 1;
  }
  .sidebar__link {
    padding: 8px 12px;
    font-size: 13px;
    gap: 6px;
    white-space: nowrap;
  }
  .sidebar__link svg { width: 16px; height: 16px; }
  .sidebar__link.router-link-active::before { display: none; }
  .sidebar__footer {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0;
    border-top: none;
  }
  .sidebar__user { display: none; }
  .sidebar__logout { width: auto; padding: 8px 12px; }
  .main-content { margin-left: 0; }
}
</style>