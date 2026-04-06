<template>
  <div class="login">
    <div class="login__container">
      <h1 class="login__title">Вход в админ-панель</h1>
      <form @submit.prevent="handleLogin" class="login__form">
        <div class="login__field">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="admin@slavyanka.ru"
            required
          />
        </div>
        <div class="login__field">
          <label for="password">Пароль</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="admin123"
            required
          />
        </div>
        <p v-if="error" class="login__error">{{ error }}</p>
        <button type="submit" class="login__btn" :disabled="loading">
          {{ loading ? 'Загрузка...' : 'Войти' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('admin@slavyanka.ru');
const password = ref('admin123');
const error = ref('');
const loading = ref(false);

async function handleLogin() {
  error.value = '';
  loading.value = true;
  
  try {
    await authStore.login(email.value, password.value);
    router.push('/admin/dashboard');
  } catch (e) {
    error.value = 'Неверный email или пароль';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-background);
  padding: 20px;
}

.login__container {
  background-color: var(--color-white);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.login__title {
  font-family: var(--font-inter);
  font-weight: 700;
  font-size: 24px;
  color: var(--color-primary);
  text-align: center;
  margin-bottom: 30px;
}

.login__form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.login__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.login__field label {
  font-family: var(--font-inter);
  font-weight: 500;
  font-size: 14px;
  color: var(--color-text);
}

.login__field input {
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: var(--font-inter);
  font-size: 16px;
  transition: border-color 0.3s;
}

.login__field input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.login__error {
  color: #e74c3c;
  font-family: var(--font-inter);
  font-size: 14px;
  text-align: center;
}

.login__btn {
  background-color: var(--color-primary);
  color: var(--color-white);
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-family: var(--font-inter);
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.login__btn:hover:not(:disabled) {
  opacity: 0.9;
}

.login__btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .login__container {
    padding: 30px 20px;
  }
  
  .login__title {
    font-size: 20px;
  }
}
</style>