<template>
  <section class="promo-banner">
    <div class="promo-banner__gift-icon">🎁</div>
    <div class="promo-banner__decoration promo-banner__decoration--1"></div>
    <div class="promo-banner__decoration promo-banner__decoration--2"></div>

    <div class="promo-banner__content">
      <!-- Состояние: форма ввода -->
      <template v-if="state === 'idle' || state === 'loading'">
        <h2 class="promo-banner__title">Получи промокод на скидку!</h2>
        <p class="promo-banner__subtitle">Подпишитесь на наши новости и получите персональный промокод на скидку 10%</p>
        <form class="promo-banner__form" @submit.prevent="handleSubmit">
          <div class="promo-banner__input-wrap">
            <svg class="promo-banner__input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <input
              v-model="email"
              type="email"
              placeholder="Введите ваш email"
              class="promo-banner__input"
              :class="{ 'input--error': validationError }"
              @input="validationError = ''"
              :disabled="state === 'loading'"
            />
          </div>
          <button type="submit" class="promo-banner__btn" :disabled="state === 'loading'">
            <span v-if="state === 'loading'" class="promo-banner__spinner"></span>
            <span v-else>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              Получить промокод
            </span>
          </button>
        </form>
        <p v-if="validationError" class="promo-banner__error">{{ validationError }}</p>
      </template>

      <!-- Состояние: успех (новый промокод) -->
      <template v-if="state === 'success'">
        <div class="promo-banner__result">
          <div class="promo-banner__check-icon">🎉</div>
          <h2 class="promo-banner__title promo-banner__title--success">Промокод сгенерирован!</h2>
          <p class="promo-banner__subtitle">{{ promoMessage }}</p>
          <div class="promo-banner__code-wrap">
            <div class="promo-banner__code" ref="codeRef">{{ promoCode }}</div>
            <button class="promo-banner__copy-btn" @click="copyCode">
              <svg v-if="!copied" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>{{ copied ? 'Скопировано' : 'Копировать' }}</span>
            </button>
          </div>
          <p class="promo-banner__expires">Срок действия: {{ expiresIn }}</p>
          <p class="promo-banner__hint">Промокод скопирован! Используйте его в корзине</p>
        </div>
      </template>

      <!-- Состояние: уже использован -->
      <template v-if="state === 'already_used'">
        <div class="promo-banner__result">
          <div class="promo-banner__check-icon promo-banner__check-icon--info">ℹ️</div>
          <h2 class="promo-banner__title">Вы уже получали промокод</h2>
          <p class="promo-banner__subtitle">{{ promoMessage }}</p>
          <div class="promo-banner__code-wrap">
            <div class="promo-banner__code promo-banner__code--existing" ref="codeRef">{{ promoCode }}</div>
            <button class="promo-banner__copy-btn" @click="copyCode">
              <svg v-if="!copied" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>{{ copied ? 'Скопировано' : 'Копировать' }}</span>
            </button>
          </div>
          <p class="promo-banner__expires">Срок действия: {{ expiresIn }}</p>
        </div>
      </template>

      <!-- Состояние: ошибка -->
      <template v-if="state === 'error'">
        <div class="promo-banner__result">
          <div class="promo-banner__check-icon promo-banner__check-icon--error">❌</div>
          <h2 class="promo-banner__title">Что-то пошло не так</h2>
          <p class="promo-banner__subtitle">{{ errorMessage }}</p>
          <button class="promo-banner__btn promo-banner__btn--retry" @click="resetForm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            Попробовать снова
          </button>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { promoApi } from '../../api/promo.api';

type PromoState = 'idle' | 'loading' | 'success' | 'already_used' | 'error';

const email = ref('');
const state = ref<PromoState>('idle');
const promoCode = ref('');
const promoMessage = ref('');
const expiresIn = ref('30 дней');
const validationError = ref('');
const errorMessage = ref('');
const copied = ref(false);
const codeRef = ref<HTMLElement | null>(null);

function isValidEmail(val: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

async function handleSubmit() {
  validationError.value = '';

  if (!email.value.trim()) {
    validationError.value = 'Введите email адрес';
    return;
  }

  if (!isValidEmail(email.value.trim())) {
    validationError.value = 'Введите корректный email адрес';
    return;
  }

  state.value = 'loading';

  try {
    const result = await promoApi.generate(email.value.trim());

    promoCode.value = result.promoCode;
    promoMessage.value = result.message;
    expiresIn.value = result.expiresIn;

    if (result.alreadyUsed) {
      state.value = 'already_used';
    } else {
      state.value = 'success';
    }
  } catch (error: any) {
    state.value = 'error';
    errorMessage.value = error.response?.data?.error || 'Произошла ошибка. Попробуйте позже.';
  }
}

async function copyCode() {
  if (!promoCode.value) return;

  try {
    await navigator.clipboard.writeText(promoCode.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2500);
  } catch {
    // Fallback для старых браузеров
    const textArea = document.createElement('textarea');
    textArea.value = promoCode.value;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2500);
  }
}

function resetForm() {
  state.value = 'idle';
  email.value = '';
  validationError.value = '';
  errorMessage.value = '';
  promoCode.value = '';
  copied.value = false;
}
</script>

<style scoped>
.promo-banner {
  position: relative;
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 40%, #e67e22 100%);
  border-radius: 20px;
  padding: 48px 40px;
  margin: 32px auto;
  max-width: 1100px;
  overflow: hidden;
  box-shadow:
    0 8px 32px rgba(211, 84, 0, 0.2),
    0 2px 8px rgba(0, 0, 0, 0.06);
  animation: bannerFadeIn 0.6s ease-out both;
}

@keyframes bannerFadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.promo-banner__gift-icon {
  position: absolute;
  top: 16px;
  right: 24px;
  font-size: 56px;
  opacity: 0.2;
  pointer-events: none;
  animation: giftFloat 3s ease-in-out infinite;
}

@keyframes giftFloat {
  0%, 100% { transform: translateY(0) rotate(-5deg); }
  50% { transform: translateY(-8px) rotate(5deg); }
}

.promo-banner__decoration {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.promo-banner__decoration--1 {
  width: 240px;
  height: 240px;
  background: rgba(255, 255, 255, 0.06);
  top: -80px;
  left: -60px;
}

.promo-banner__decoration--2 {
  width: 180px;
  height: 180px;
  background: rgba(255, 255, 255, 0.04);
  bottom: -60px;
  right: -40px;
}

.promo-banner__content {
  position: relative;
  z-index: 1;
  max-width: 640px;
  margin: 0 auto;
  text-align: center;
}

.promo-banner__title {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 30px;
  color: #fff;
  margin-bottom: 8px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.promo-banner__title--success {
  font-size: 26px;
}

.promo-banner__subtitle {
  font-family: var(--font-body);
  font-size: 15px;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 24px;
  line-height: 1.5;
}

/* Форма */
.promo-banner__form {
  display: flex;
  gap: 10px;
  max-width: 520px;
  margin: 0 auto;
}

.promo-banner__input-wrap {
  flex: 1;
  position: relative;
}

.promo-banner__input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
}

.promo-banner__input {
  width: 100%;
  padding: 14px 14px 14px 44px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 14px;
  font-family: var(--font-body);
  font-size: 15px;
  background: rgba(255, 255, 255, 0.95);
  color: var(--color-text);
  transition: all 0.25s ease;
  outline: none;
}

.promo-banner__input:focus {
  border-color: #fff;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
  background: #fff;
}

.promo-banner__input.input--error {
  border-color: #fca5a5;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

.promo-banner__input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.promo-banner__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 28px;
  background: #fff;
  color: var(--color-primary);
  border: none;
  border-radius: 14px;
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  white-space: nowrap;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.promo-banner__btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.promo-banner__btn:active {
  transform: translateY(0) scale(0.97);
}

.promo-banner__btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.promo-banner__btn--retry {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.promo-banner__btn--retry:hover {
  background: rgba(255, 255, 255, 0.3);
}

.promo-banner__spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-primary);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.promo-banner__error {
  font-family: var(--font-body);
  font-size: 13px;
  color: #fca5a5;
  margin-top: 10px;
  text-align: left;
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
}

/* Результат */
.promo-banner__result {
  animation: resultFadeIn 0.5s ease-out both;
}

@keyframes resultFadeIn {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.promo-banner__check-icon {
  font-size: 48px;
  margin-bottom: 8px;
  animation: iconPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.promo-banner__check-icon--info {
  font-size: 44px;
}

.promo-banner__check-icon--error {
  font-size: 44px;
}

@keyframes iconPop {
  0% { opacity: 0; transform: scale(0); }
  100% { opacity: 1; transform: scale(1); }
}

.promo-banner__code-wrap {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 14px;
  padding: 6px 6px 6px 20px;
  margin: 8px 0 12px;
  animation: codeSlide 0.5s 0.2s ease-out both;
}

@keyframes codeSlide {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.promo-banner__code {
  font-family: 'Courier New', monospace;
  font-weight: 800;
  font-size: 22px;
  color: #fff;
  letter-spacing: 2px;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  user-select: all;
}

.promo-banner__code--existing {
  font-size: 20px;
}

.promo-banner__copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 10px;
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 13px;
  color: var(--color-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.promo-banner__copy-btn:hover {
  background: #fff;
  transform: scale(1.03);
}

.promo-banner__copy-btn:active {
  transform: scale(0.97);
}

.promo-banner__expires {
  font-family: var(--font-body);
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 4px;
}

.promo-banner__hint {
  font-family: var(--font-body);
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  background: rgba(255, 255, 255, 0.1);
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  margin-top: 4px;
  animation: hintPulse 2s ease-in-out infinite;
}

@keyframes hintPulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

/* Responsive */
@media (max-width: 768px) {
  .promo-banner {
    padding: 36px 24px;
    margin: 24px 16px;
    border-radius: 16px;
  }

  .promo-banner__gift-icon {
    font-size: 40px;
    top: 12px;
    right: 16px;
  }

  .promo-banner__title {
    font-size: 24px;
  }

  .promo-banner__form {
    flex-direction: column;
  }

  .promo-banner__btn {
    width: 100%;
    padding: 12px 20px;
  }

  .promo-banner__code {
    font-size: 18px;
  }

  .promo-banner__code-wrap {
    flex-direction: column;
    padding: 14px;
    gap: 10px;
  }

  .promo-banner__copy-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .promo-banner {
    padding: 28px 18px;
    margin: 20px 12px;
    border-radius: 14px;
  }

  .promo-banner__title {
    font-size: 20px;
  }

  .promo-banner__subtitle {
    font-size: 13px;
    margin-bottom: 16px;
  }

  .promo-banner__input {
    padding: 12px 12px 12px 40px;
    font-size: 14px;
  }

  .promo-banner__code {
    font-size: 16px;
  }

  .promo-banner__check-icon {
    font-size: 36px;
  }
}
</style>