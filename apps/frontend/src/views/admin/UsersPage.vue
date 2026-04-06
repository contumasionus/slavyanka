<template>
  <div class="users-admin">
    <h1 class="users-admin__title">Управление пользователями</h1>
    
    <div class="users-admin__list">
      <div v-for="user in users" :key="user.id" class="users-admin__item">
        <div class="users-admin__info">
          <h3>{{ user.name }}</h3>
          <p>Email: {{ user.email }}</p>
          <p>Роль: {{ user.role === 'admin' ? 'Администратор' : 'Покупатель' }}</p>
          <p>Регистрация: {{ formatDate(user.createdAt) }}</p>
        </div>
        <div class="users-admin__role">
          <select :value="user.role" @change="updateRole(user.id, ($event.target as HTMLSelectElement).value)">
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
import { User } from '@slavyanka/shared-types';

const users = ref<User[]>([]);

onMounted(async () => {
  await loadUsers();
});

async function loadUsers() {
  users.value = await usersApi.getAll();
}

async function updateRole(id: string, role: string) {
  await usersApi.updateRole(id, role);
  await loadUsers();
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
</script>

<style scoped>
.users-admin {
  padding: 20px;
}

.users-admin__title {
  font-family: var(--font-inter);
  font-weight: 700;
  font-size: 32px;
  color: var(--color-text);
  margin-bottom: 30px;
}

.users-admin__list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.users-admin__item {
  background-color: var(--color-white);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.users-admin__info h3 {
  font-family: var(--font-inter);
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 10px;
}

.users-admin__info p {
  font-family: var(--font-inter);
  font-size: 14px;
  color: var(--color-text-light);
  margin-bottom: 5px;
}

.users-admin__role select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: var(--font-inter);
  font-size: 14px;
}

@media (max-width: 768px) {
  .users-admin__title {
    font-size: 24px;
  }
  
  .users-admin__item {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
}
</style>