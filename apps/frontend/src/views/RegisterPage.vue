<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-header">
        <h1 class="register-title">Регистрация</h1>
        <p class="register-subtitle">Создайте аккаунт для доступа к личному кабинету</p>
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="name" class="form-label">Имя</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            class="form-input"
            placeholder="Введите ваше имя"
            required
          />
        </div>

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
            placeholder="Минимум 6 символов"
            required
            minlength="6"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword" class="form-label">Подтвердите пароль</label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            class="form-input"
            placeholder="Повторите пароль"
            required
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="register-button" :disabled="loading">
          {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
        </button>
      </form>

      <div class="register-footer">
        <p>Уже есть аккаунт? <router-link to="/login" class="link">Войти</router-link></p>
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
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const error = ref('');
const loading = ref(false);

async function handleRegister() {
  error.value = '';

  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Пароли не совпадают';
    return;
  }

  if (form.value.password.length < 6) {
    error.value = 'Пароль должен содержать минимум 6 символов';
    return;
  }

  loading.value = true;

  try {
    await authStore.register(form.value.email, form.value.password, form.value.name);
    router.push('/profile');
  } catch (e: any) {
    error.value = e.response?.data?.error || 'Ошибка регистрации';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-background);
  padding: 20px;
}

.register-container {
  background-color: var(--color-white);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-title {
  font-family: var(--font-inter);
  font-weight: 700;
  font-size: 28px;
  color: var(--color-primary);
  margin-bottom: 10px;
}

.register-subtitle {
  font-family: var(--font-inter);
  font-size: 14px;
  color: var(--color-text-light);
}

.register-form {
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

.register-button {
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

.register-button:hover:not(:disabled) {
  opacity: 0.9;
}

.register-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.register-footer {
  margin-top: 30px;
  text-align: center;
}

.register-footer p {
  font-family: var(--font-inter);
  font-size: 14px;
  color: var(--color-text-light);
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
  .register-container {
    padding: 30px 20px;
  }
  
  .register-title {
    font-size: 24px;
  }
}
</style>