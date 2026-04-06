<template>
  <div class="admin-layout">
    <aside class="admin-layout__sidebar">
      <div class="admin-layout__logo">
        <h2>Славянка</h2>
        <span>Админ-панель</span>
      </div>
      <nav class="admin-layout__nav">
        <router-link to="/admin/dashboard" class="admin-layout__link">Дашборд</router-link>
        <router-link to="/admin/products" class="admin-layout__link">Товары</router-link>
        <router-link to="/admin/categories" class="admin-layout__link">Категории</router-link>
        <router-link to="/admin/orders" class="admin-layout__link">Заказы</router-link>
        <router-link to="/admin/users" class="admin-layout__link">Пользователи</router-link>
      </nav>
      <button @click="handleLogout" class="admin-layout__logout">Выйти</button>
    </aside>
    <main class="admin-layout__content">
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
}

.admin-layout__sidebar {
  width: 250px;
  background-color: var(--color-primary);
  color: var(--color-white);
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.admin-layout__logo {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.admin-layout__logo h2 {
  font-family: var(--font-kurale);
  font-size: 28px;
  margin-bottom: 5px;
}

.admin-layout__logo span {
  font-family: var(--font-inter);
  font-size: 14px;
  opacity: 0.8;
}

.admin-layout__nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.admin-layout__link {
  padding: 12px 16px;
  border-radius: 8px;
  font-family: var(--font-inter);
  font-size: 16px;
  color: var(--color-white);
  text-decoration: none;
  transition: background-color 0.3s;
}

.admin-layout__link:hover,
.admin-layout__link.router-link-active {
  background-color: rgba(255, 255, 255, 0.1);
}

.admin-layout__logout {
  margin-top: auto;
  padding: 12px 16px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: var(--color-white);
  font-family: var(--font-inter);
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.admin-layout__logout:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.admin-layout__content {
  flex: 1;
  padding: 30px;
  background-color: var(--color-background);
  overflow-y: auto;
}

@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
  }
  
  .admin-layout__sidebar {
    width: 100%;
    flex-direction: row;
    align-items: center;
    padding: 15px;
  }
  
  .admin-layout__logo {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
    margin-right: 20px;
  }
  
  .admin-layout__nav {
    flex-direction: row;
    gap: 5px;
    flex: 1;
  }
  
  .admin-layout__link {
    padding: 8px 12px;
    font-size: 14px;
  }
  
  .admin-layout__logout {
    margin-top: 0;
    margin-left: 10px;
  }
  
  .admin-layout__content {
    padding: 20px;
  }
}
</style>