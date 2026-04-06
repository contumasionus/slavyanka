<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1 class="login-title">Вход в аккаунт</h1>
        <p class="login-subtitle">Войдите, чтобы получить доступ к личному кабинету</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="form-input"
            placeholder="example@email.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Пароль</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="form-input"
            placeholder="Введите пароль"
            required
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="login-button" :disabled="loading">
          {{ loading ? 'Вход...' : 'Войти' }}
        </button>
      </form>

      <div class="login-footer">
        <p>Нет аккаунта? <router-link to="/register" class="link">Зарегистрироваться</router-link></p>
        <p><router-link to="/admin/login" class="link">Вход для администраторов</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  email: '',
  password: '',
});

const error = ref('');
const loading = ref(false);

async function handleLogin() {
  error.value = '';
  loading.value = true;

  try {
    await authStore.login(form.value.email, form.value.password);
    
    if (authStore.isAdmin) {
      router.push('/admin/dashboard');
    } else {
      router.push('/profile');
    }
  } catch (e: any) {
    error.value = e.response?.data?.error || 'Неверный email или пароль';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-background);
  padding: 20px;
}

.login-container {
  background-color: var(--color-white);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-title {
  font-family: var(--font-inter);
  font-weight: 700;
  font-size: 28px;
  color: var(--color-primary);
  margin-bottom: 10px;
}

.login-subtitle {
  font-family: var(--font-inter);
  font-size: 14px;
  color: var(--color-text-light);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-family: var(--font-inter);
  font-weight: 500;
  font-size: 14px;
  color: var(--color-text);
}

.form-input {
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: var(--font-inter);
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.error-message {
  color: #e74c3c;
  font-family: var(--font-inter);
  font-size: 14px;
  text-align: center;
  padding: 10px;
  background-color: #ffeaea;
  border-radius: 8px;
}

.login-button {
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

.login-button:hover:not(:disabled) {
  opacity: 0.9;
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-footer {
  margin-top: 30px;
  text-align: center;
}

.login-footer p {
  font-family: var(--font-inter);
  font-size: 14px;
  color: var(--color-text-light);
  margin-bottom: 10px;
}

.link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-container {
    padding: 30px 20px;
  }
  
  .login-title {
    font-size: 24px;
  }
}
</style>