<template>
  <div class="auth-page">
    <!-- Декоративные фоновые элементы -->
    <div class="auth-decor">
      <div class="auth-decor__circle auth-decor__circle--1"></div>
      <div class="auth-decor__circle auth-decor__circle--2"></div>
      <div class="auth-decor__circle auth-decor__circle--3"></div>
      <svg class="auth-decor__wheat auth-decor__wheat--left" viewBox="0 0 100 200" fill="none">
        <path d="M50 200 L50 80 M50 80 C30 60 10 70 10 50 C10 30 30 20 50 30 M50 80 C70 60 90 70 90 50 C90 30 70 20 50 30" stroke="rgba(211,84,0,0.08)" stroke-width="3" stroke-linecap="round"/>
        <circle cx="50" cy="25" r="4" fill="rgba(211,84,0,0.06)"/>
        <circle cx="25" cy="45" r="3" fill="rgba(211,84,0,0.06)"/>
        <circle cx="75" cy="45" r="3" fill="rgba(211,84,0,0.06)"/>
      </svg>
      <svg class="auth-decor__wheat auth-decor__wheat--right" viewBox="0 0 100 200" fill="none">
        <path d="M50 200 L50 80 M50 80 C30 60 10 70 10 50 C10 30 30 20 50 30 M50 80 C70 60 90 70 90 50 C90 30 70 20 50 30" stroke="rgba(211,84,0,0.08)" stroke-width="3" stroke-linecap="round"/>
        <circle cx="50" cy="25" r="4" fill="rgba(211,84,0,0.06)"/>
        <circle cx="25" cy="45" r="3" fill="rgba(211,84,0,0.06)"/>
        <circle cx="75" cy="45" r="3" fill="rgba(211,84,0,0.06)"/>
      </svg>
    </div>

    <div class="auth-card">
      <div class="auth-header">
        <router-link to="/" class="auth-logo">
          <span class="auth-logo__text">Славянка</span>
        </router-link>
        <h1 class="auth-title">Добро пожаловать!</h1>
        <p class="auth-subtitle">Войдите в аккаунт, чтобы управлять заказами</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="input-group">
          <div class="input-group__icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <input
            v-model="form.email"
            type="email"
            required
            placeholder="example@email.com"
            class="input-group__input"
            :class="{ 'input--invalid': emailError }"
            @focus="focusedField = 'email'"
            @blur="onBlurEmail"
            @input="emailError = ''"
          >
          <label class="input-group__label" :class="{ 'label--up': form.email || focusedField === 'email' }">Email</label>
          <span v-if="emailError" class="input-group__error-msg">{{ emailError }}</span>
        </div>

        <div class="input-group">
          <div class="input-group__icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            required
            placeholder="Введите пароль"
            class="input-group__input"
            @focus="focusedField = 'password'"
            @blur="focusedField = ''"
          >
          <label class="input-group__label" :class="{ 'label--up': form.password || focusedField === 'password' }">Пароль</label>
          <button type="button" class="input-group__toggle" @click="showPassword = !showPassword">
            <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          </button>
        </div>

        <div class="auth-form__options">
          <label class="checkbox-wrap">
            <input type="checkbox" v-model="rememberMe" class="checkbox-hidden">
            <span class="checkbox-custom"></span>
            <span class="checkbox-label">Запомнить меня</span>
          </label>
          <a href="#" class="auth-form__forgot">Забыли пароль?</a>
        </div>

        <div v-if="error" class="alert alert--error shake">{{ error }}</div>

        <button type="submit" class="btn btn--primary" :disabled="loading">
          <span v-if="loading" class="btn-loading">
            <span class="spinner"></span> Вход...
          </span>
          <span v-else class="btn-content">
            Войти
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </span>
        </button>
      </form>

      <!-- Социальный вход (заглушки) -->
      <div class="social-section">
        <div class="social-divider">
          <span>или войдите через</span>
        </div>
        <div class="social-buttons">
          <button class="social-btn social-btn--google" disabled>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          </button>
          <button class="social-btn social-btn--vk" disabled>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M15.684 0H8.316C2.675 0 0 2.675 0 8.316v7.368C0 21.326 2.675 24 8.316 24h7.368C21.326 24 24 21.326 24 15.684V8.316C24 2.675 21.326 0 15.684 0zm3.477 17.13h-1.472c-.608 0-.803-.445-1.908-1.553-.96-.931-1.383-1.056-1.62-1.056-.326 0-.43.115-.43.665v1.054c0 .473-.155.668-1.44.668-2.12 0-4.462-1.29-6.106-3.698-2.12-2.898-2.738-5.04-2.738-5.474 0-.208.115-.317.445-.317h1.475c.445 0 .613.178.806.688.81 2.33 2.178 4.377 2.738 4.377.194 0 .298-.104.298-.688v-2.685c-.07-1.244-.736-1.346-.736-1.79 0-.208.173-.416.445-.416h2.353c.347 0 .475.173.475.597v3.214c0 .38.162.49.267.49.194 0 .384-.11.605-.328.843-.93 1.594-2.522 1.594-2.522.162-.297.326-.436.734-.436h1.474c.498 0 .603.256.498.665-.704 1.953-2.422 3.807-2.422 3.807-.173.208-.194.332 0 .554.162.208.904.888 1.362 1.414.498.576.973 1.054.973 1.35.016.383-.18.607-.534.607z"/></svg>
          </button>
          <button class="social-btn social-btn--yandex" disabled>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3.6 19.2h-2.4v-5.7h-2.4c-1.6 0-2.9-.5-3.8-1.4-.9-.9-1.4-2.1-1.4-3.5 0-1.4.5-2.5 1.4-3.4s2.2-1.4 3.8-1.4h5.2v15.4h-2.4V14.5zm0-7.2h-2.4v-3h2.4c.8 0 1.4.2 1.8.6s.6.9.6 1.5c0 .6-.2 1-.6 1.4s-1 .4-1.8.4z"/></svg>
          </button>
        </div>
      </div>

      <div class="auth-footer">
        <p>Нет аккаунта? <router-link to="/register" class="link">Зарегистрироваться</router-link></p>
        <p><router-link to="/admin/login" class="link link--muted">Вход для администраторов</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { isValidWhitelistedEmail, sanitizeInput, getWhitelistedEmailError } from '../utils/validation';

const router = useRouter();
const authStore = useAuthStore();
const form = ref({ email: '', password: '' });
const error = ref('');
const loading = ref(false);
const showPassword = ref(false);
const rememberMe = ref(false);
const focusedField = ref('');
const emailError = ref('');

function onBlurEmail() {
  focusedField.value = '';
  form.value.email = sanitizeInput(form.value.email);
  if (form.value.email) {
    emailError.value = getWhitelistedEmailError(form.value.email) || '';
  }
}

async function handleLogin() {
  error.value = '';
  emailError.value = '';
  
  form.value.email = sanitizeInput(form.value.email);
  
  if (!form.value.email || !isValidWhitelistedEmail(form.value.email)) {
    error.value = 'Неверно введена почта';
    return;
  }
  if (!form.value.password) {
    error.value = 'Введите пароль';
    return;
  }
  
  loading.value = true;
  try {
    await authStore.login(form.value.email, form.value.password);
    router.push(authStore.isAdmin ? '/admin/dashboard' : '/profile');
  } catch (e: any) {
    error.value = e.response?.data?.error || 'Неверный email или пароль';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* ── Декоративные элементы ── */
.auth-decor {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.auth-decor__circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
}
.auth-decor__circle--1 {
  width: 500px;
  height: 500px;
  background: rgba(211,84,0,0.04);
  top: -200px;
  right: -100px;
  animation: floatCircle 15s ease-in-out infinite alternate;
}
.auth-decor__circle--2 {
  width: 400px;
  height: 400px;
  background: rgba(243,156,18,0.03);
  bottom: -150px;
  left: -100px;
  animation: floatCircle 12s ease-in-out infinite alternate-reverse;
}
.auth-decor__circle--3 {
  width: 200px;
  height: 200px;
  background: rgba(232,69,69,0.03);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulseCircle 8s ease-in-out infinite;
}
@keyframes floatCircle {
  from { transform: translate(0, 0) scale(1); }
  to { transform: translate(30px, -20px) scale(1.1); }
}
@keyframes pulseCircle {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
  50% { transform: translate(-50%, -50%) scale(1.3); opacity: 1; }
}

.auth-decor__wheat {
  position: absolute;
  width: 80px;
  height: 160px;
  opacity: 0.6;
}
.auth-decor__wheat--left {
  left: 10%;
  top: 20%;
  transform: rotate(-15deg);
  animation: wheatSway 8s ease-in-out infinite;
}
.auth-decor__wheat--right {
  right: 10%;
  bottom: 25%;
  transform: rotate(15deg) scaleX(-1);
  animation: wheatSway 8s ease-in-out infinite reverse;
}
@keyframes wheatSway {
  0%, 100% { transform: rotate(-15deg); }
  50% { transform: rotate(-5deg); }
}

/* ── Card ── */
.auth-card {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: 48px 44px;
  width: 100%;
  max-width: 420px;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-xl);
  position: relative;
  z-index: 1;
  animation: cardFloat 0.6s ease;
}
@keyframes cardFloat {
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.auth-header { text-align: center; margin-bottom: 32px; }

.auth-logo {
  display: inline-block;
  text-decoration: none;
  margin-bottom: 12px;
}
.auth-logo__text {
  font-family: var(--font-display);
  font-size: 40px;
  color: var(--color-primary);
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.auth-title {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 26px;
  color: var(--color-text);
  margin-bottom: 6px;
}
.auth-subtitle {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--color-text-muted);
}

/* ── Input Groups ── */
.auth-form { display: flex; flex-direction: column; gap: 18px; }

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}
.input-group__icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  z-index: 2;
  pointer-events: none;
  transition: color 0.2s ease;
}
.input-group:focus-within .input-group__icon {
  color: var(--color-primary);
}

.input-group__input {
  width: 100%;
  padding: 16px 44px 16px 46px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 15px;
  background: var(--color-background);
  color: var(--color-text);
  transition: all 0.2s ease;
  position: relative;
  z-index: 1;
}
.input-group__input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(232,69,69,0.08), inset 0 0 0 1px var(--color-primary-light);
  background: var(--color-surface);
}
.input-group__input::placeholder { color: transparent; }
.input-group__input.input--valid { border-color: #10b981; background: #f0fdf4; }
.input-group__input.input--invalid { border-color: #ef4444; background: #fef2f2; }

.input-group__label {
  position: absolute;
  left: 46px;
  top: 50%;
  transform: translateY(-50%);
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--color-text-muted);
  pointer-events: none;
  transition: all 0.2s ease;
  z-index: 2;
  background: transparent;
  padding: 0 2px;
}
.input-group:focus-within .input-group__label,
.label--up {
  top: 0;
  transform: translateY(-50%);
  font-size: 11px;
  color: var(--color-primary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: var(--color-surface);
}
.input-group:focus-within .input-group__label {
  background: var(--color-surface);
}

.input-group__toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-muted);
  padding: 6px;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
  z-index: 2;
}
.input-group__toggle:hover { color: var(--color-text); background: var(--color-border-light); }

.input-group__error-msg {
  position: absolute;
  bottom: -18px;
  left: 46px;
  font-family: var(--font-body);
  font-size: 11px;
  color: #ef4444;
  font-weight: 500;
  white-space: nowrap;
  z-index: 2;
  animation: fadeInUp 0.2s ease;
}
@keyframes fadeInUp { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

/* ── Options Row ── */
.auth-form__options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.checkbox-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.checkbox-hidden {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid var(--color-border);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}
.checkbox-hidden:checked + .checkbox-custom {
  background: var(--color-primary);
  border-color: var(--color-primary);
}
.checkbox-hidden:checked + .checkbox-custom::after {
  content: '✓';
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}
.checkbox-label {
  font-family: var(--font-body);
  color: var(--color-text-secondary);
  user-select: none;
}
.checkbox-wrap:hover .checkbox-custom {
  border-color: var(--color-primary-light);
}

.auth-form__forgot {
  font-family: var(--font-body);
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}
.auth-form__forgot:hover {
  text-decoration: underline;
  color: var(--color-primary-dark);
}

/* ── Alert ── */
.alert {
  padding: 12px 16px;
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 13px;
  text-align: center;
  animation: shake 0.4s ease;
}
.alert--error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}

/* ── Button ── */
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 14px;
  border-radius: var(--radius-full);
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 16px;
  border: none;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}
.btn--primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: #fff;
  box-shadow: 0 4px 14px rgba(211,84,0,0.3);
}
.btn--primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(211,84,0,0.4);
}
.btn--primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-content {
  display: flex;
  align-items: center;
  gap: 8px;
}
.btn-loading { display: flex; align-items: center; gap: 8px; }

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: inline-block;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Social Section ── */
.social-section {
  margin-top: 24px;
}
.social-divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}
.social-divider::before,
.social-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border);
}
.social-divider span {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--color-text-muted);
  white-space: nowrap;
}

.social-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}
.social-btn {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.5;
}
.social-btn--google:hover:not(:disabled) { background: #f1f3f4; border-color: #dadce0; }
.social-btn--vk:hover:not(:disabled) { background: #4a76a8; color: #fff; border-color: #4a76a8; }
.social-btn--yandex:hover:not(:disabled) { background: #fc3f1d; color: #fff; border-color: #fc3f1d; }
.social-btn:hover:not(:disabled) { opacity: 1; transform: translateY(-2px); }
.social-btn:disabled { cursor: not-allowed; }

/* ── Footer ── */
.auth-footer {
  margin-top: 28px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.auth-footer p {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--color-text-muted);
}
.link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}
.link:hover { text-decoration: underline; color: var(--color-primary-dark); }
.link--muted { color: var(--color-text-muted); font-size: 13px; }

/* ── Responsive ── */
@media (max-width: 480px) {
  .auth-card { padding: 32px 20px; }
  .auth-title { font-size: 22px; }
  .auth-logo__text { font-size: 32px; }
  .auth-decor__wheat { display: none; }
}
</style>