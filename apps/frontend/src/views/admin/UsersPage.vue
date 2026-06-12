<template>
  <div class="admin-users">
    <div class="admin-header">
      <h1 class="admin-title">Управление пользователями</h1>
    </div>

    <div v-if="users.length === 0" class="empty-state">
      <span class="empty-state__icon">👥</span>
      <h3>Пользователей пока нет</h3>
      <p>Когда пользователи зарегистрируются, они появятся здесь</p>
    </div>

    <div v-else class="users-list">
      <div v-for="user in users" :key="user.id" class="user-card">
        <div class="user-card__avatar">
          <span class="avatar-text">{{ user.name?.charAt(0)?.toUpperCase() || 'U' }}</span>
        </div>
        <div class="user-card__info">
          <h3 class="user-name">{{ user.name }}</h3>
          <span class="user-email">{{ user.email }}</span>
          <span class="user-date">Регистрация: {{ formatDate(user.createdAt) }}</span>
        </div>
        <div class="user-card__meta">
          <span class="role-badge" :class="user.role === 'admin' ? 'role-badge--admin' : 'role-badge--customer'">
            {{ user.role === 'admin' ? 'Администратор' : 'Покупатель' }}
          </span>
          <select :value="user.role" @change="updateRole(user.id, ($event.target as HTMLSelectElement).value)" class="role-select">
            <option value="customer">Покупатель</option>
            <option value="admin">Администратор</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usersApi } from '../../api/users.api';

interface User { id: string; name: string; email: string; role: string; createdAt: string; }

const users = ref<User[]>([]);

onMounted(async () => { await loadUsers(); });
async function loadUsers() { try { users.value = await usersApi.getAll(); } catch (error) { console.error('Ошибка загрузки пользователей:', error); } }
async function updateRole(id: string, role: string) { try { await usersApi.updateRole(id, role); await loadUsers(); } catch (error) { console.error('Ошибка обновления роли:', error); } }
function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
}
</script>

<style scoped>
.admin-users { padding: 24px; }
.admin-header { margin-bottom: 24px; }
.admin-title { font-family: var(--font-heading); font-weight: 700; font-size: 28px; color: var(--color-text); }

.empty-state { text-align: center; padding: 80px 20px; }
.empty-state__icon { font-size: 48px; display: block; margin-bottom: 16px; }
.empty-state h3 { font-family: var(--font-heading); font-weight: 700; font-size: 20px; color: var(--color-text); margin-bottom: 6px; }
.empty-state p { font-family: var(--font-body); font-size: 15px; color: var(--color-text-muted); }

.users-list { display: flex; flex-direction: column; gap: 12px; }
.user-card {
  display: flex; align-items: center; gap: 16px;
  background: var(--color-surface); border-radius: var(--radius-lg);
  padding: 16px 20px; border: 1px solid var(--color-border);
  box-shadow: var(--shadow-xs); transition: all var(--transition-fast);
}
.user-card:hover { box-shadow: var(--shadow-md); }
.user-card__avatar {
  width: 48px; height: 48px; border-radius: var(--radius-md);
  background: var(--color-primary); display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.avatar-text { font-family: var(--font-heading); font-weight: 700; font-size: 20px; color: #fff; }
.user-card__info { flex: 1; }
.user-name { font-family: var(--font-heading); font-weight: 600; font-size: 16px; color: var(--color-text); margin-bottom: 2px; }
.user-email { display: block; font-size: 13px; color: var(--color-text-muted); }
.user-date { display: block; font-size: 12px; color: var(--color-text-muted); }
.user-card__meta { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.role-badge {
  display: inline-block; padding: 3px 12px; border-radius: var(--radius-full);
  font-family: var(--font-heading); font-weight: 600; font-size: 12px;
}
.role-badge--admin { background: #fce4e4; color: #991b1b; }
.role-badge--customer { background: var(--color-border-light); color: var(--color-text-secondary); }
.role-select {
  padding: 6px 12px; border: 1px solid var(--color-border); border-radius: var(--radius-md);
  font-family: var(--font-body); font-size: 13px; background: var(--color-background);
  cursor: pointer; transition: all var(--transition-fast);
}
.role-select:focus { outline: none; border-color: var(--color-primary); }

@media (max-width: 600px) {
  .admin-users { padding: 16px; }
  .user-card { flex-wrap: wrap; }
  .user-card__meta { width: 100%; justify-content: flex-end; }
}
</style>