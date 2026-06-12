<template>
  <div class="auth-page">
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
      <div class="auth-progress">
        <div class="auth-progress__steps">
          <div class="auth-progress__step" :class="{ 'active': regStep >= 1, 'done': regStep > 1 }">
            <div class="auth-progress__circle">
              <svg v-if="regStep > 1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
              <span v-else>1</span>
            </div>
            <span class="auth-progress__label">Данные</span>
          </div>
          <div class="auth-progress__line" :class="{ 'filled': regStep >= 2 }"></div>
          <div class="auth-progress__step" :class="{ 'active': regStep >= 2, 'done': regStep > 2 }">
            <div class="auth-progress__circle">
              <svg v-if="regStep > 2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
              <span v-else>2</span>
            </div>
            <span class="auth-progress__label">Код</span>
          </div>
          <div class="auth-progress__line" :class="{ 'filled': regStep >= 3 }"></div>
          <div class="auth-progress__step" :class="{ 'active': regStep >= 3 }">
            <div class="auth-progress__circle">
              <span>3</span>
            </div>
            <span class="auth-progress__label">Завершение</span>
          </div>
        </div>
      </div>

      <div class="auth-header">
        <router-link to="/" class="auth-logo">
          <span class="auth-logo__text">Славянка</span>
        </router-link>
        <h1 class="auth-title">Создать аккаунт</h1>
        <p class="auth-subtitle">Заполните форму для регистрации</p>
      </div>

      <!-- Шаг 1: Данные -->
      <form v-if="regStep === 1" @submit.prevent="handleSendCode" class="auth-form">
        <div class="input-group">
          <div class="input-group__icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <input v-model="form.name" type="text" required placeholder=" " maxlength="30" class="input-group__input" :class="{ 'input--valid': form.name && !nameError && isValidRussianName(form.name), 'input--invalid': nameError }" @input="onNameInput" @focus="focusedField = 'name'" @blur="onBlurName">
          <label class="input-group__label" :class="{ 'label--up': form.name || focusedField === 'name' }">Имя</label>
          <span v-if="form.name && !nameError && isValidRussianName(form.name)" class="input-group__check">✓</span>
          <span v-if="nameError" class="input-group__error-msg">{{ nameError }}</span>
        </div>

        <div class="input-group">
          <div class="input-group__icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <input v-model="form.email" type="email" required placeholder=" " class="input-group__input" :class="{ 'input--valid': form.email && !emailError && isValidWhitelistedEmail(form.email), 'input--invalid': emailError }" @focus="focusedField = 'email'" @blur="onBlurEmail">
          <label class="input-group__label" :class="{ 'label--up': form.email || focusedField === 'email' }">Email</label>
          <span v-if="form.email && !emailError && isValidWhitelistedEmail(form.email)" class="input-group__check">✓</span>
          <span v-if="emailError" class="input-group__error-msg">{{ emailError }}</span>
        </div>

        <div class="input-group">
          <div class="input-group__icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <input v-model="form.password" :type="showPassword ? 'text' : 'password'" required minlength="6" maxlength="128" placeholder=" " class="input-group__input" @input="checkPasswordStrength" @focus="focusedField = 'password'" @blur="focusedField = ''">
          <label class="input-group__label" :class="{ 'label--up': form.password || focusedField === 'password' }">Пароль</label>
          <button type="button" class="input-group__toggle" @click="showPassword = !showPassword">
            <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          </button>
        </div>

        <div v-if="form.password.length > 0" class="password-strength">
          <div class="password-strength__bars">
            <div class="strength-segment" :class="strengthClass(1)"></div>
            <div class="strength-segment" :class="strengthClass(2)"></div>
            <div class="strength-segment" :class="strengthClass(3)"></div>
            <div class="strength-segment" :class="strengthClass(4)"></div>
          </div>
          <span class="password-strength__text" :class="'text--' + passwordLevel">{{ passwordText }}</span>
        </div>

        <div class="input-group">
          <div class="input-group__icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <input v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" required placeholder=" " class="input-group__input" :class="{ 'input--valid': form.confirmPassword && form.password === form.confirmPassword, 'input--invalid': form.confirmPassword && form.password !== form.confirmPassword }" @focus="focusedField = 'confirm'" @blur="focusedField = ''">
          <label class="input-group__label" :class="{ 'label--up': form.confirmPassword || focusedField === 'confirm' }">Подтвердите пароль</label>
          <button type="button" class="input-group__toggle" @click="showConfirmPassword = !showConfirmPassword">
            <svg v-if="!showConfirmPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          </button>
          <span v-if="form.confirmPassword && form.password === form.confirmPassword" class="input-group__check">✓</span>
          <span v-if="form.confirmPassword && form.password !== form.confirmPassword" class="input-group__cross">✕</span>
        </div>

        <div v-if="form.confirmPassword.length > 0 && form.password.length > 0" class="match-indicator" :class="form.password === form.confirmPassword ? 'match' : 'no-match'">
          {{ form.password === form.confirmPassword ? '✓ Пароли совпадают' : '✕ Пароли не совпадают' }}
        </div>

        <div v-if="error" class="alert alert--error shake">{{ error }}</div>

        <label class="terms-checkbox">
          <input type="checkbox" v-model="agreeToTerms" class="terms-checkbox__input">
          <span class="terms-checkbox__custom"></span>
          <span class="terms-checkbox__text">
            Я принимаю условия
            <a href="#" class="terms-checkbox__link" @click.prevent="showPrivacyPolicy = true">Политики конфиденциальности</a>
            и даю согласие на обработку персональных данных
          </span>
        </label>

        <button type="submit" class="btn btn--primary" :disabled="!agreeToTerms || sendingCode">
          <span v-if="sendingCode" class="btn-loading">
            <span class="spinner"></span> Отправка кода...
          </span>
          <span v-else>
            Продолжить
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </span>
        </button>
      </form>

      <!-- Шаг 2: Ввод кода -->
      <div v-else-if="regStep === 2" class="code-step">
        <div class="code-step__icon">📧</div>
        <h3 class="code-step__title">Подтвердите email</h3>
        <p class="code-step__text">
          Мы отправили код на <strong>{{ form.email }}</strong>
        </p>

        <div class="code-input-wrap">
          <input
            v-model="verificationCode"
            type="text"
            maxlength="6"
            placeholder="000000"
            class="code-input"
            :class="{ 'code-input--error': codeError }"
            @input="codeError = ''"
            autofocus
          >
        </div>

        <div v-if="codeError" class="alert alert--error shake">{{ codeError }}</div>

        <button @click="handleVerifyCode" class="btn btn--primary" :disabled="!verificationCode || verificationCode.length < 6 || verifyingCode">
          <span v-if="verifyingCode" class="btn-loading">
            <span class="spinner"></span> Проверка...
          </span>
          <span v-else>Подтвердить</span>
        </button>

        <button @click="handleResendCode" class="btn btn--outline code-step__resend" :disabled="resendCooldown > 0 || resendingCode">
          <span v-if="resendingCode">Отправка...</span>
          <span v-else-if="resendCooldown > 0">Отправить повторно через {{ resendCooldown }}с</span>
          <span v-else>Отправить код повторно</span>
        </button>
      </div>

      <!-- Шаг 3: Подтверждение данных -->
      <div v-else-if="regStep === 3" class="confirm-step">
        <div class="confirm-step__summary">
          <div class="confirm-step__row">
            <span class="confirm-step__label">Имя</span>
            <span class="confirm-step__value">{{ form.name }}</span>
          </div>
          <div class="confirm-step__row">
            <span class="confirm-step__label">Email</span>
            <span class="confirm-step__value">{{ form.email }}</span>
          </div>
          <div class="confirm-step__row">
            <span class="confirm-step__label">Пароль</span>
            <span class="confirm-step__value">••••••••</span>
          </div>
          <div class="confirm-step__row">
            <span class="confirm-step__label">Email подтверждён</span>
            <span class="confirm-step__value confirm-step__value--success">✓ Да</span>
          </div>
        </div>

        <div v-if="error" class="alert alert--error shake">{{ error }}</div>

        <div class="confirm-step__actions">
          <button @click="regStep = 1" class="btn btn--outline">← Назад</button>
          <button @click="handleRegister" class="btn btn--primary" :disabled="loading">
            <span v-if="loading" class="btn-loading">
              <span class="spinner"></span> Регистрация...
            </span>
            <span v-else>Зарегистрироваться</span>
          </button>
        </div>
      </div>

      <!-- Шаг 4: Успех -->
      <div v-else-if="regStep === 4" class="success-step">
        <div class="success-step__icon-wrap">
          <svg class="success-step__check" viewBox="0 0 52 52" width="80" height="80">
            <circle cx="26" cy="26" r="24" fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-dasharray="160" stroke-dashoffset="160" class="success-step__circle"/>
            <polyline points="16,26 23,33 36,19" fill="none" stroke="var(--color-primary)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="30" stroke-dashoffset="30" class="success-step__checkmark"/>
          </svg>
        </div>
        <h2 class="success-step__title">Регистрация завершена!</h2>
        <p class="success-step__text">Добро пожаловать, {{ form.name }}!<br>Теперь вы можете пользоваться личным кабинетом.</p>
        <router-link to="/profile" class="btn btn--primary">
          Перейти в профиль
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </router-link>
      </div>

      <div v-if="regStep < 4" class="auth-footer">
        <p>Уже есть аккаунт? <router-link to="/login" class="link">Войти</router-link></p>
      </div>
    </div>

    <!-- Модалка Политики конфиденциальности -->
    <teleport to="body">
      <transition name="policy-fade">
        <div v-if="showPrivacyPolicy" class="policy-overlay" @click.self="showPrivacyPolicy = false">
          <div class="policy-modal">
            <button class="policy-close" @click="showPrivacyPolicy = false">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
            </button>
            <h2 class="policy-title">Политика конфиденциальности</h2>
            <div class="policy-content">
              <p>Настоящая Политика конфиденциальности регулирует отношения между интернет-магазином «Славянка» и пользователем в части обработки персональных данных.</p>
              <h3>1. Какие данные мы собираем</h3>
              <p>При оформлении заказа и регистрации на Сайте Покупатель предоставляет: ФИО (имя), адрес электронной почты, номер контактного телефона, адрес доставки.</p>
              <h3>2. Цели обработки</h3>
              <p>Регистрация и идентификация, оформление и доставка заказов, связь по вопросам заказа, улучшение качества обслуживания.</p>
              <h3>3. Правовые основания</h3>
              <p>Согласие пользователя и договор купли-продажи.</p>
              <h3>4. Сроки хранения</h3>
              <p>В течение срока действия договора и 3 лет после.</p>
              <h3>5. Передача данных</h3>
              <p>Только службам доставки, платёжным системам и в случаях, предусмотренных законом РФ.</p>
              <h3>6. Права пользователя</h3>
              <p>Получить информацию о данных, требовать уточнения/блокирования/удаления, отозвать согласие.</p>
              <h3>7. Защита данных</h3>
              <p>Принимаем все организационные и технические меры для защиты данных.</p>
              <h3>8. Контакты</h3>
              <p>privacy@slavyanka.ru</p>
            </div>
            <button class="btn btn--primary policy-accept-btn" @click="showPrivacyPolicy = false">Закрыть</button>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { authApi } from '../api/auth.api';
import { isValidEmail, isValidWhitelistedEmail, isValidRussianName, sanitizeRussianName, sanitizeInput, isValidName, getRussianNameError, getWhitelistedEmailError, truncate } from '../utils/validation';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({ name: '', email: '', password: '', confirmPassword: '' });
const error = ref('');
const loading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const focusedField = ref('');
const regStep = ref(1);
const agreeToTerms = ref(false);
const showPrivacyPolicy = ref(false);
const nameError = ref('');
const emailError = ref('');

// Верификация
const verificationCode = ref('');
const codeError = ref('');
const sendingCode = ref(false);
const verifyingCode = ref(false);
const resendingCode = ref(false);
const emailVerified = ref(false);
const resendCooldown = ref(0);
let resendTimer: number | null = null;

const passwordScore = ref(0);
const passwordLevel = ref<'weak' | 'medium' | 'strong' | 'very-strong'>('weak');
const passwordText = ref('');

function onNameInput(e: Event) {
  const target = e.target as HTMLInputElement;
  target.value = sanitizeRussianName(target.value);
  form.value.name = target.value;
  nameError.value = '';
}

function onBlurName() {
  focusedField.value = '';
  form.value.name = sanitizeRussianName(form.value.name);
  if (form.value.name) {
    nameError.value = getRussianNameError(form.value.name) || '';
  } else {
    nameError.value = 'Имя обязательно для заполнения';
  }
}

function onBlurEmail() {
  focusedField.value = '';
  form.value.email = sanitizeInput(form.value.email);
  if (form.value.email) {
    emailError.value = getWhitelistedEmailError(form.value.email) || '';
  }
}

function checkPasswordStrength() {
  const password = form.value.password;
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  passwordScore.value = score;

  if (score <= 1) { passwordLevel.value = 'weak'; passwordText.value = 'Слабый'; }
  else if (score === 2) { passwordLevel.value = 'medium'; passwordText.value = 'Средний'; }
  else if (score <= 3) { passwordLevel.value = 'strong'; passwordText.value = 'Хороший'; }
  else { passwordLevel.value = 'very-strong'; passwordText.value = 'Очень надёжный'; }
}

function strengthClass(segment: number): string {
  const filled = passwordScore.value;
  const levels = ['', 'weak', 'medium', 'strong', 'very-strong'];
  if (segment <= filled) return 'segment--' + levels[filled] || levels[filled];
  return '';
}

function startResendCooldown() {
  resendCooldown.value = 60;
  if (resendTimer) clearInterval(resendTimer);
  resendTimer = window.setInterval(() => {
    resendCooldown.value--;
    if (resendCooldown.value <= 0) {
      if (resendTimer) clearInterval(resendTimer);
      resendTimer = null;
    }
  }, 1000);
}

async function handleSendCode() {
  // Принудительная очистка и капитализация
  form.value.name = sanitizeRussianName(form.value.name);
  form.value.email = sanitizeInput(form.value.email).toLowerCase().trim();

  if (!form.value.name) {
    error.value = 'Имя обязательно для заполнения';
    return;
  }
  if (!isValidRussianName(form.value.name)) {
    error.value = 'Имя должно содержать только русские буквы и начинаться с заглавной';
    return;
  }
  if (!form.value.email || !isValidWhitelistedEmail(form.value.email)) {
    error.value = 'Неверно введена почта';
    return;
  }
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Пароли не совпадают';
    return;
  }
  if (form.value.password.length < 6) {
    error.value = 'Пароль должен содержать минимум 6 символов';
    return;
  }

  sendingCode.value = true;
  error.value = '';
  try {
    await authApi.sendVerification(form.value.email);
    regStep.value = 2;
    startResendCooldown();
  } catch (e: any) {
    error.value = e.response?.data?.error || 'Ошибка отправки кода';
  } finally {
    sendingCode.value = false;
  }
}

async function handleVerifyCode() {
  if (verificationCode.value.length < 6) return;

  verifyingCode.value = true;
  codeError.value = '';
  try {
    await authApi.verifyCode(form.value.email, verificationCode.value);
    emailVerified.value = true;
    regStep.value = 3;
  } catch (e: any) {
    codeError.value = e.response?.data?.error || 'Неверный код';
  } finally {
    verifyingCode.value = false;
  }
}

async function handleResendCode() {
  resendingCode.value = true;
  try {
    await authApi.sendVerification(form.value.email);
    startResendCooldown();
  } catch (e: any) {
    codeError.value = e.response?.data?.error || 'Ошибка отправки кода';
  } finally {
    resendingCode.value = false;
  }
}

async function handleRegister() {
  error.value = '';
  loading.value = true;
  try {
    await authStore.register(form.value.email, form.value.password, form.value.name);
    regStep.value = 4;
    setTimeout(() => {
      document.querySelector('.success-step__circle')?.classList.add('animate');
      document.querySelector('.success-step__checkmark')?.classList.add('animate');
    }, 100);
  } catch (e: any) {
    error.value = e.response?.data?.error || 'Ошибка регистрации';
  } finally {
    loading.value = false;
  }
}

onUnmounted(() => {
  if (resendTimer) clearInterval(resendTimer);
});
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
.auth-decor__circle--1 { width: 500px; height: 500px; background: rgba(211,84,0,0.04); top: -200px; right: -100px; animation: floatCircle 15s ease-in-out infinite alternate; }
.auth-decor__circle--2 { width: 400px; height: 400px; background: rgba(243,156,18,0.03); bottom: -150px; left: -100px; animation: floatCircle 12s ease-in-out infinite alternate-reverse; }
.auth-decor__circle--3 { width: 200px; height: 200px; background: rgba(232,69,69,0.03); top: 50%; left: 50%; transform: translate(-50%, -50%); animation: pulseCircle 8s ease-in-out infinite; }
@keyframes floatCircle {
  from { transform: translate(0, 0) scale(1); }
  to { transform: translate(30px, -20px) scale(1.1); }
}
@keyframes pulseCircle {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
  50% { transform: translate(-50%, -50%) scale(1.3); opacity: 1; }
}

.auth-decor__wheat { position: absolute; width: 80px; height: 160px; opacity: 0.6; }
.auth-decor__wheat--left { left: 10%; top: 20%; transform: rotate(-15deg); animation: wheatSway 8s ease-in-out infinite; }
.auth-decor__wheat--right { right: 10%; bottom: 25%; transform: rotate(15deg) scaleX(-1); animation: wheatSway 8s ease-in-out infinite reverse; }
@keyframes wheatSway { 0%, 100% { transform: rotate(-15deg); } 50% { transform: rotate(-5deg); } }

.auth-progress { margin-bottom: 20px; }
.auth-progress__steps { display: flex; align-items: center; justify-content: center; gap: 0; }
.auth-progress__step { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.auth-progress__circle { width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--color-border); display: flex; align-items: center; justify-content: center; font-family: var(--font-heading); font-weight: 700; font-size: 13px; color: var(--color-text-muted); transition: all 0.3s ease; }
.auth-progress__step.active .auth-progress__circle { border-color: var(--color-primary); color: var(--color-primary); background: var(--color-primary-soft); }
.auth-progress__step.done .auth-progress__circle { background: var(--color-primary); border-color: var(--color-primary); color: #fff; }
.auth-progress__label { font-family: var(--font-body); font-size: 11px; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 500; }
.auth-progress__step.active .auth-progress__label { color: var(--color-primary); font-weight: 600; }
.auth-progress__line { width: 60px; height: 2px; background: var(--color-border); margin: 0 8px; margin-bottom: 24px; transition: background 0.3s ease; border-radius: 2px; }
.auth-progress__line.filled { background: var(--color-primary); }

.auth-card { background: var(--color-surface); border-radius: var(--radius-xl); padding: 40px 44px; width: 100%; max-width: 440px; border: 1px solid var(--color-border); box-shadow: var(--shadow-xl); position: relative; z-index: 1; animation: cardFloat 0.6s ease; }
@keyframes cardFloat { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }

.auth-header { text-align: center; margin-bottom: 24px; }
.auth-logo { display: inline-block; text-decoration: none; margin-bottom: 8px; }
.auth-logo__text { font-family: var(--font-display); font-size: 36px; background: linear-gradient(135deg, var(--color-primary), var(--color-accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.auth-title { font-family: var(--font-heading); font-weight: 700; font-size: 24px; color: var(--color-text); margin-bottom: 4px; }
.auth-subtitle { font-family: var(--font-body); font-size: 14px; color: var(--color-text-muted); }

.auth-form { display: flex; flex-direction: column; gap: 16px; }
.input-group { position: relative; display: flex; align-items: center; }
.input-group__icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--color-text-muted); z-index: 2; pointer-events: none; transition: color 0.2s ease; }
.input-group:focus-within .input-group__icon { color: var(--color-primary); }
.input-group__input { width: 100%; padding: 16px 44px 16px 46px; border: 1px solid var(--color-border); border-radius: var(--radius-md); font-family: var(--font-body); font-size: 15px; background: var(--color-background); color: var(--color-text); transition: all 0.2s ease; position: relative; z-index: 1; }
.input-group__input:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(232,69,69,0.08); background: var(--color-surface); }
.input-group__input::placeholder { color: transparent; }
.input-group__input.input--valid { border-color: #10b981; background: #f0fdf4; }
.input-group__input.input--invalid { border-color: #ef4444; background: #fef2f2; }
.input-group__label { position: absolute; left: 46px; top: 50%; transform: translateY(-50%); font-family: var(--font-body); font-size: 15px; color: var(--color-text-muted); pointer-events: none; transition: all 0.2s ease; z-index: 2; padding: 0 2px; }
.input-group:focus-within .input-group__label, .label--up { top: 0; transform: translateY(-50%); font-size: 11px; color: var(--color-primary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; background: var(--color-surface); }
.input-group__toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--color-text-muted); padding: 6px; border-radius: var(--radius-sm); transition: all 0.2s ease; z-index: 2; }
.input-group__toggle:hover { color: var(--color-text); background: var(--color-border-light); }
.input-group__check { position: absolute; right: 46px; top: 50%; transform: translateY(-50%); color: #10b981; font-weight: 700; font-size: 16px; z-index: 2; animation: popIn 0.3s ease; }
.input-group__cross { position: absolute; right: 46px; top: 50%; transform: translateY(-50%); color: #ef4444; font-weight: 700; font-size: 16px; z-index: 2; animation: popIn 0.3s ease; }
.input-group__error-msg { position: absolute; bottom: -18px; left: 46px; font-family: var(--font-body); font-size: 11px; color: #ef4444; font-weight: 500; white-space: nowrap; z-index: 2; animation: fadeInUp 0.2s ease; }
@keyframes popIn { 0% { transform: translateY(-50%) scale(0); } 50% { transform: translateY(-50%) scale(1.3); } 100% { transform: translateY(-50%) scale(1); } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

.password-strength { display: flex; align-items: center; gap: 10px; }
.password-strength__bars { display: flex; gap: 4px; flex: 1; }
.strength-segment { height: 4px; flex: 1; border-radius: 4px; background: var(--color-border-light); transition: all 0.3s ease; }
.segment--weak { background: #ef4444; }
.segment--medium { background: #f59e0b; }
.segment--strong { background: #10b981; }
.segment--very-strong { background: #059669; }
.password-strength__text { font-family: var(--font-body); font-size: 11px; font-weight: 600; white-space: nowrap; min-width: 80px; text-align: right; }
.text--weak { color: #ef4444; }
.text--medium { color: #f59e0b; }
.text--strong { color: #10b981; }
.text--very-strong { color: #059669; }

.match-indicator { font-family: var(--font-body); font-size: 12px; font-weight: 500; padding: 4px 0; animation: fadeInUp 0.3s ease; }
.match-indicator.match { color: #10b981; }
.match-indicator.no-match { color: #ef4444; }

.alert { padding: 12px 16px; border-radius: var(--radius-md); font-family: var(--font-body); font-size: 13px; text-align: center; animation: shake 0.4s ease; }
.alert--error { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; }
@keyframes shake { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-8px); } 40% { transform: translateX(8px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }

.btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 14px; border-radius: var(--radius-full); font-family: var(--font-heading); font-weight: 700; font-size: 16px; border: none; cursor: pointer; transition: all 0.25s ease; }
.btn--primary { background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark)); color: #fff; box-shadow: 0 4px 14px rgba(211,84,0,0.3); }
.btn--primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(211,84,0,0.4); }
.btn--primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn--outline { background: none; border: 1px solid var(--color-border); color: var(--color-text-secondary); }
.btn--outline:hover { border-color: var(--color-primary); color: var(--color-primary); }
.btn-loading { display: flex; align-items: center; gap: 8px; }
.spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Code Step */
.code-step { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 8px 0; }
.code-step__icon { font-size: 48px; margin-bottom: 4px; }
.code-step__title { font-family: var(--font-heading); font-weight: 700; font-size: 22px; color: var(--color-text); text-align: center; }
.code-step__text { font-family: var(--font-body); font-size: 14px; color: var(--color-text-secondary); text-align: center; line-height: 1.5; }
.code-step__text strong { color: var(--color-text); }
.code-input-wrap { width: 100%; max-width: 220px; }
.code-input { width: 100%; padding: 16px; border: 2px solid var(--color-border); border-radius: var(--radius-lg); font-family: monospace; font-size: 32px; font-weight: 700; letter-spacing: 8px; text-align: center; background: var(--color-background); color: var(--color-text); transition: all 0.2s ease; outline: none; }
.code-input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(232,69,69,0.08); }
.code-input--error { border-color: #ef4444; }
.code-step__resend { margin-top: 4px; }

/* Confirm Step */
.confirm-step { display: flex; flex-direction: column; gap: 20px; }
.confirm-step__summary { background: var(--color-border-light); border-radius: var(--radius-lg); padding: 20px; display: flex; flex-direction: column; gap: 12px; }
.confirm-step__row { display: flex; justify-content: space-between; align-items: center; }
.confirm-step__label { font-family: var(--font-body); font-size: 13px; color: var(--color-text-muted); }
.confirm-step__value { font-family: var(--font-heading); font-weight: 600; font-size: 15px; color: var(--color-text); }
.confirm-step__value--success { color: #10b981; }
.confirm-step__actions { display: flex; gap: 12px; }
.confirm-step__actions .btn { flex: 1; }

/* Success Step */
.success-step { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 20px 0; }
.success-step__icon-wrap { margin-bottom: 8px; }
.success-step__circle { stroke-dasharray: 160; stroke-dashoffset: 160; transition: stroke-dashoffset 0.6s ease; }
.success-step__circle.animate { stroke-dashoffset: 0; }
.success-step__checkmark { stroke-dasharray: 30; stroke-dashoffset: 30; transition: stroke-dashoffset 0.4s ease 0.4s; }
.success-step__checkmark.animate { stroke-dashoffset: 0; }
.success-step__title { font-family: var(--font-heading); font-weight: 700; font-size: 24px; color: var(--color-text); text-align: center; }
.success-step__text { font-family: var(--font-body); font-size: 15px; color: var(--color-text-secondary); text-align: center; line-height: 1.6; }
.success-step .btn { margin-top: 12px; max-width: 280px; }

/* Terms Checkbox */
.terms-checkbox { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; font-size: 13px; line-height: 1.4; padding: 4px 0; }
.terms-checkbox__input { position: absolute; opacity: 0; width: 0; height: 0; }
.terms-checkbox__custom { width: 20px; height: 20px; border: 2px solid var(--color-border); border-radius: 4px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s ease; margin-top: 1px; }
.terms-checkbox__input:checked + .terms-checkbox__custom { background: var(--color-primary); border-color: var(--color-primary); }
.terms-checkbox__input:checked + .terms-checkbox__custom::after { content: '✓'; color: #fff; font-size: 12px; font-weight: 700; }
.terms-checkbox__text { font-family: var(--font-body); color: var(--color-text-secondary); }
.terms-checkbox__link { color: var(--color-primary); text-decoration: none; font-weight: 500; }
.terms-checkbox__link:hover { text-decoration: underline; }
.terms-checkbox:hover .terms-checkbox__custom { border-color: var(--color-primary-light); }

/* Footer */
.auth-footer { margin-top: 24px; text-align: center; }
.auth-footer p { font-family: var(--font-body); font-size: 14px; color: var(--color-text-muted); }
.link { color: var(--color-primary); text-decoration: none; font-weight: 600; transition: color 0.2s ease; }
.link:hover { text-decoration: underline; color: var(--color-primary-dark); }

/* Policy Modal */
.policy-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.5); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 3000; padding: 20px; }
.policy-modal { background: var(--color-surface); border-radius: var(--radius-xl); padding: 36px; width: 100%; max-width: 640px; max-height: 85vh; overflow-y: auto; position: relative; box-shadow: var(--shadow-xl); }
.policy-close { position: absolute; top: 16px; right: 16px; background: var(--color-border-light); border: none; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--color-text-muted); transition: all 0.2s ease; }
.policy-close:hover { background: var(--color-border); color: var(--color-text); }
.policy-title { font-family: var(--font-heading); font-weight: 700; font-size: 24px; color: var(--color-text); margin-bottom: 20px; padding-right: 40px; }
.policy-content { font-family: var(--font-body); font-size: 14px; line-height: 1.7; color: var(--color-text-secondary); }
.policy-content h3 { font-family: var(--font-heading); font-weight: 600; font-size: 16px; color: var(--color-text); margin-top: 20px; margin-bottom: 8px; }
.policy-content p { margin-bottom: 12px; }
.policy-accept-btn { margin-top: 20px; width: 100%; }
.policy-fade-enter-active { animation: policyIn 0.3s ease; }
.policy-fade-leave-active { animation: policyIn 0.25s ease reverse; }
@keyframes policyIn { from { opacity: 0; } to { opacity: 1; } }
.policy-fade-enter-active .policy-modal { animation: policySlide 0.3s ease; }
.policy-fade-leave-active .policy-modal { animation: policySlide 0.25s ease reverse; }
@keyframes policySlide { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }

@media (max-width: 480px) {
  .auth-card { padding: 28px 20px; }
  .auth-title { font-size: 22px; }
  .auth-logo__text { font-size: 28px; }
  .auth-decor__wheat { display: none; }
  .auth-progress__line { width: 40px; }
}
</style>