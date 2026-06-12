<template>
  <div class="admin-login">
    <div class="admin-login__card">
      <div class="admin-login__header">
        <router-link to="/" class="admin-login__logo">Славянка</router-link>
        <h1 class="admin-login__title">Админ-панель</h1>
        <p class="admin-login__subtitle">Вход для администраторов магазина</p>
      </div>
      <form @submit.prevent="handleLogin" class="admin-login__form">
        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="admin@slavyanka.ru" required>
        </div>
        <div class="form-group">
          <label>Пароль</label>
          <input v-model="password" type="password" placeholder="admin123" required>
        </div>
        <p v-if="error" class="alert alert--error">{{ error }}</p>
        <button type="submit" class="btn btn--primary" :disabled="loading">
          {{ loading ? 'Вход...' : 'Войти' }}
        </button>
      </form>
      <div class="admin-login__footer">
        <router-link to="/login" class="admin-login__back">← Обычный вход</router-link>
      </div>
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
  error.value = ''; loading.value = true;
  try { await authStore.login(email.value, password.value); router.push('/admin/dashboard'); }
  catch { error.value = 'Неверный email или пароль'; }
  finally { loading.value = false; }
}
</script>

<style scoped>
.admin-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #0f172a;
}
.admin-login__card {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: 44px 40px;
  width: 100%;
  max-width: 420px;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-xl);
}
.admin-login__header { text-align: center; margin-bottom: 32px; }
.admin-login__logo {
  font-family: var(--font-display);
  font-size: 36px;
  color: var(--color-primary);
  text-decoration: none;
  display: inline-block;
  margin-bottom: 8px;
}
.admin-login__title {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 26px;
  color: var(--color-text);
  margin-bottom: 6px;
}
.admin-login__subtitle {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--color-text-muted);
}
.admin-login__form { display: flex; flex-direction: column; gap: 18px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label {
  font-family: var(--font-heading); font-weight: 600; font-size: 13px;
  color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em;
}
.form-group input {
  padding: 12px 14px; border: 1px solid var(--color-border); border-radius: var(--radius-md);
  font-family: var(--font-body); font-size: 15px; background: var(--color-background);
  color: var(--color-text); transition: all var(--transition-fast);
}
.form-group input:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(232,69,69,0.08); }
.alert { padding: 10px 14px; border-radius: var(--radius-md); font-family: var(--font-body); font-size: 13px; text-align: center; }
.alert--error { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; }
.btn {
  display: flex; align-items: center; justify-content: center; width: 100%;
  padding: 14px; border-radius: var(--radius-full); font-family: var(--font-heading);
  font-weight: 700; font-size: 16px; border: none; cursor: pointer; transition: all var(--transition-fast);
}
.btn--primary { background: var(--color-primary); color: #fff; }
.btn--primary:hover:not(:disabled) { background: var(--color-primary-dark); }
.btn--primary:disabled { opacity: 0.6; cursor: not-allowed; }
.admin-login__footer { margin-top: 24px; text-align: center; }
.admin-login__back {
  font-family: var(--font-body); font-size: 14px;
  color: var(--color-text-muted); text-decoration: none; transition: color var(--transition-fast);
}
.admin-login__back:hover { color: var(--color-primary); }
@media (max-width: 480px) {
  .admin-login__card { padding: 32px 20px; }
}
</style>