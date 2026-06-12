<template>
  <div class="contacts-page">
    <!-- ====== HERO ====== -->
    <section class="contacts-hero" ref="heroRef">
      <div class="contacts-hero__bg">
        <img src="/images/contacts-bg.jpg" alt="" class="contacts-hero__bg-img">
        <div class="contacts-hero__overlay"></div>
        <div class="contacts-hero__gradient"></div>
        <div class="contacts-hero__particles">
          <span class="hero-particle hero-particle--1">📍</span>
          <span class="hero-particle hero-particle--2">📞</span>
          <span class="hero-particle hero-particle--3">✉️</span>
          <span class="hero-particle hero-particle--4">🏪</span>
          <span class="hero-particle hero-particle--5">✨</span>
          <span class="hero-particle hero-particle--6">🕐</span>
        </div>
        <div class="contacts-hero__pattern"></div>
        <div class="contacts-hero__glow contacts-hero__glow--1"></div>
        <div class="contacts-hero__glow contacts-hero__glow--2"></div>
      </div>
      <div class="container">
        <div class="contacts-hero__content">
          <div class="contacts-hero__badge">Свяжитесь с нами</div>
          <h1 class="contacts-hero__title">Контакты</h1>
          <p class="contacts-hero__subtitle">Мы всегда рады помочь и ответить на ваши вопросы</p>
          <div class="contacts-hero__actions">
            <button class="hero-btn hero-btn--primary" @click="showPhoneModal = true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Позвонить
            </button>
            <a href="https://wa.me/79254831291" target="_blank" rel="noopener noreferrer" class="hero-btn hero-btn--outline">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              WhatsApp
            </a>
          </div>
          <div class="contacts-hero__breadcrumbs">
            <router-link to="/" class="breadcrumb-link">Главная</router-link>
            <span class="breadcrumb-sep">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
            </span>
            <span class="breadcrumb-current">Контакты</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ====== КАРТОЧКИ КОНТАКТОВ ====== -->
    <section class="section section--cards">
      <div class="container">
        <div class="contacts-cards">
          <div
            class="contact-card reveal reveal--left"
            style="animation-delay: 0.06s"
            @click="scrollToMap"
          >
            <div class="contact-card__glow"></div>
            <div class="contact-card__icon-wrap" style="background:linear-gradient(135deg,#fef3e8,#ffedd5);color:var(--color-primary)">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <h3 class="contact-card__title">Адрес</h3>
            <p class="contact-card__text">Молодёжная ул., 1В, д. Курилово</p>
            <p class="contact-card__hint">Владимирская область, Собинский район</p>
            <span class="contact-card__action">Показать на карте →</span>
          </div>
          <div
            class="contact-card reveal reveal--scale"
            style="animation-delay: 0.18s"
            @click="showPhoneModal = true"
          >
            <div class="contact-card__glow"></div>
            <div class="contact-card__icon-wrap" style="background:linear-gradient(135deg,#fef3c7,#fde68a);color:#d97706">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <h3 class="contact-card__title">Телефон</h3>
            <p class="contact-card__text">+7 (925) 483 12 91</p>
            <p class="contact-card__hint">Звоните с 8:00 до 21:00</p>
            <span class="contact-card__action">Показать номер →</span>
          </div>
          <div
            class="contact-card reveal reveal--right"
            style="animation-delay: 0.30s"
            @click="scrollToForm"
          >
            <div class="contact-card__glow"></div>
            <div class="contact-card__icon-wrap" style="background:linear-gradient(135deg,#dbeafe,#bfdbfe);color:#2563eb">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <h3 class="contact-card__title">Email</h3>
            <p class="contact-card__text">info@slavyanka.ru</p>
            <p class="contact-card__hint">Ответим в течение дня</p>
            <span class="contact-card__action">Написать нам →</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ====== РАСПИСАНИЕ + ФОРМА ====== -->
    <section class="section section--schedule">
      <div class="container">
        <div class="schedule-grid">
          <!-- Расписание -->
          <div class="schedule-block reveal reveal--left" style="animation-delay: 0.1s">
            <div class="schedule-header">
              <h2 class="block-title">Режим работы</h2>
              <div class="open-indicator" :class="{ 'open-indicator--closed': !isOpenNow }">
                <span class="open-indicator__dot"></span>
                <span class="open-indicator__text">{{ isOpenNow ? 'Открыто сейчас' : 'Закрыто' }}</span>
              </div>
            </div>
            <div class="schedule-table">
              <div
                v-for="(day, idx) in schedule"
                :key="day.label"
                class="schedule-row"
                :class="{ 'schedule-row--today': idx === todayIndex }"
              >
                <div class="schedule-row__left">
                  <span v-if="idx === todayIndex" class="schedule-row__badge">Сегодня</span>
                  <span class="schedule-day" :class="{ 'schedule-day--today': idx === todayIndex }">{{ day.label }}</span>
                </div>
                <span class="schedule-time">{{ day.time }}</span>
              </div>
            </div>
            <div class="schedule-note">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              <span>Приходите в удобное для вас время!</span>
            </div>
          </div>

          <!-- Форма -->
          <div class="form-block reveal reveal--right" style="animation-delay: 0.1s" ref="formRef">
            <h2 class="block-title">Оставьте отзыв</h2>
            <form class="contact-form" @submit.prevent="handleSubmit">
              <div class="form-field" :class="{ 'form-field--filled': form.name, 'form-field--error': errors.name }">
                <input
                  v-model="form.name"
                  type="text"
                  class="form-input"
                  placeholder=" "
                  maxlength="30"
                  required
                  @blur="validateField('name')"
                  @input="onNameInputContact"
                  id="field-name"
                />
                <label for="field-name" class="form-label">Ваше имя</label>
                <span class="form-field__bar"></span>
                <span v-if="errors.name" class="form-field__error">{{ errors.name }}</span>
                <span v-else-if="form.name && !errors.name" class="form-field__check">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg>
                </span>
              </div>
              <div class="form-row--double">
                <div class="form-field" :class="{ 'form-field--filled': form.email, 'form-field--error': errors.email }">
                  <input
                    v-model="form.email"
                    type="email"
                    class="form-input"
                    placeholder=" "
                    required
                    @blur="validateField('email')"
                    @input="clearError('email')"
                    id="field-email"
                  />
                  <label for="field-email" class="form-label">Email</label>
                  <span class="form-field__bar"></span>
                  <span v-if="errors.email" class="form-field__error">{{ errors.email }}</span>
                  <span v-else-if="form.email && !errors.email" class="form-field__check">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg>
                  </span>
                </div>
                <div class="form-field">
                  <input
                    v-model="form.phone"
                    type="tel"
                    class="form-input"
                    maxlength="18"
                    placeholder=" "
                    id="field-phone"
                    @input="onPhoneInput"
                    @blur="onPhoneBlur"
                  />
                  <label for="field-phone" class="form-label">Телефон (необяз.)</label>
                  <span class="form-field__bar"></span>
                  <span v-if="errors.phone" class="form-field__error">{{ errors.phone }}</span>
                </div>
              </div>
              <div class="form-field form-field--select">
                <select id="field-topic" v-model="form.topic" class="form-input form-select">
                  <option value="" disabled selected hidden></option>
                  <option value="feedback">Отзыв о магазине</option>
                  <option value="question">Вопрос по товару</option>
                  <option value="complaint">Жалоба / предложение</option>
                  <option value="delivery">Вопрос по доставке</option>
                  <option value="other">Другое</option>
                </select>
                <label for="field-topic" class="form-label">Тема обращения</label>
                <span class="form-field__bar"></span>
              </div>
              <div class="form-field form-field--textarea" :class="{ 'form-field--filled': form.message, 'form-field--error': errors.message }">
                <textarea
                  v-model="form.message"
                  class="form-input form-textarea"
                  placeholder=" "
                  rows="4"
                  maxlength="1000"
                  required
                  @blur="validateField('message')"
                  @input="clearError('message')"
                  id="field-message"
                ></textarea>
                <label for="field-message" class="form-label">Ваш отзыв</label>
                <span class="form-field__bar"></span>
                <span v-if="errors.message" class="form-field__error">{{ errors.message }}</span>
              </div>
              <button type="submit" class="form-btn" :disabled="isSending">
                <span class="form-btn__content" v-if="!isSending">
                  Отправить отзыв
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </span>
                <span class="form-btn__loader" v-else>
                  <svg class="form-btn__spinner" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-dasharray="31.4 31.4" stroke-linecap="round"/></svg>
                  Отправка...
                </span>
              </button>
            </form>
            <Transition name="success-pop">
              <div v-if="isSent" class="form-success">
                <div class="form-success__icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <div class="form-success__text">
                  <strong>Спасибо!</strong> Ваш отзыв отправлен.
                </div>
                <div class="form-success__confetti">
                  <span>🎉</span><span>✨</span><span>🌟</span><span>🎊</span>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>

    <!-- ====== FAQ ====== -->
    <section class="section section--faq">
      <div class="container">
        <h2 class="block-title block-title--center">Часто задаваемые вопросы</h2>
        <div class="faq-list">
          <div
            v-for="(faq, idx) in faqItems"
            :key="idx"
            class="faq-item"
            :class="{ 'faq-item--open': faq.open }"
          >
            <button class="faq-question" @click="toggleFaq(idx)">
              <span class="faq-question__text">{{ faq.question }}</span>
              <span class="faq-question__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
              </span>
            </button>
            <div class="faq-answer" :style="{ maxHeight: faq.open ? faq.answerHeight + 'px' : '0' }" :ref="el => { if (el && 'scrollHeight' in el) faq.answerHeight = (el as HTMLElement).scrollHeight }">
              <p class="faq-answer__text">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ====== СОЦИАЛЬНЫЕ СЕТИ ====== -->
    <section class="section section--social">
      <div class="container">
        <div class="social-block reveal reveal--scale" style="animation-delay: 0.1s">
          <h2 class="block-title block-title--center">Мы в соцсетях</h2>
          <p class="social-subtitle">Подписывайтесь и будьте в курсе новинок и акций</p>
          <div class="social-links">
            <a
              v-for="(s, idx) in socials"
              :key="s.name"
              :href="s.url"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              :class="'social-link--' + s.name.toLowerCase()"
              :title="s.name"
              :style="{ animationDelay: 0.08 + idx * 0.08 + 's' }"
            >
              <span class="social-link__bg"></span>
              <span class="social-link__icon" v-html="s.icon"></span>
            </a>
          </div>
          <p class="social-count">100+ подписчиков в соцсетях</p>
        </div>
      </div>
    </section>

    <!-- ====== КАРТА ====== -->
    <section class="section section--map" ref="mapRef">
      <div class="map-wrapper reveal reveal--scale" style="animation-delay: 0.1s">
        <div class="map-container">
          <iframe
            src="https://yandex.ru/map-widget/v1/?um=constructor%3A1234567890abcdef&source=constructor&ll=39.972625%2C56.092848&z=20&pt=39.971952%2C56.093047%2Cpm2rdm"
            width="100%"
            height="420"
            frameborder="0"
            class="map-iframe"
            allowfullscreen
          ></iframe>
          <div class="map-overlay">
            <a
              href="https://yandex.ru/maps/?pt=39.971952,56.093047&z=20&l=map"
              target="_blank"
              rel="noopener noreferrer"
              class="map-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Проложить маршрут
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ====== МОДАЛКА ТЕЛЕФОНА ====== -->
    <Teleport to="body">
      <Transition name="phone-modal">
        <div v-if="showPhoneModal" class="phone-overlay" @click.self="showPhoneModal = false">
          <div class="phone-modal" @click.stop>
            <button class="phone-modal__close" @click="showPhoneModal = false" aria-label="Закрыть">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            <div class="phone-modal__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <h2 class="phone-modal__title">Позвоните нам</h2>
            <p class="phone-modal__number">+7 (925) 483 12 91</p>
            <p class="phone-modal__hint">Мы работаем с 8:00 до 21:00</p>
            <div class="phone-modal__actions">
              <a :href="'tel:+79254831291'" class="phone-btn phone-btn--call">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                Позвонить
              </a>
              <button class="phone-btn phone-btn--copy" @click="copyPhone">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                {{ copied ? 'Скопировано!' : 'Копировать' }}
              </button>
            </div>
            <Transition name="copy-toast">
              <div v-if="copied" class="phone-modal__toast">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg>
                Номер скопирован в буфер обмена
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useChatStore } from '../stores/chat.store';
import { isValidEmail, isValidWhitelistedEmail, isValidRussianName, sanitizeRussianName, sanitizeInput, formatPhone, isValidPhone, getRussianNameError, getWhitelistedEmailError } from '../utils/validation';
import { contactMessagesApi } from '../api/contact-messages.api';

const chatStore = useChatStore();
const isSending = ref(false);
const isSent = ref(false);
const mapRef = ref<HTMLElement | null>(null);
const formRef = ref<HTMLElement | null>(null);
const heroRef = ref<HTMLElement | null>(null);

/* ---------- Phone Modal ---------- */
const showPhoneModal = ref(false);
const copied = ref(false);

function copyPhone() {
  navigator.clipboard.writeText('+79254831291').then(() => {
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  });
}

/* ---------- Form ---------- */
const form = reactive({
  name: '',
  email: '',
  phone: '',
  topic: '',
  message: '',
});

const errors = reactive({
  name: '',
  email: '',
  phone: '',
  message: '',
});

function validateField(field: 'name' | 'email' | 'message') {
  const value = form[field].trim();
  if (!value) {
    errors[field] = field === 'name' ? 'Введите имя' : field === 'email' ? 'Введите email' : 'Напишите отзыв';
    return;
  }
  if (field === 'name') {
    errors.name = getRussianNameError(value) || '';
    return;
  }
  if (field === 'email') {
    errors.email = getWhitelistedEmailError(value) || '';
    return;
  }
  errors[field] = '';
}

function clearError(field: 'name' | 'email' | 'message') {
  errors[field] = '';
}

function onNameInputContact(e: Event) {
  const target = e.target as HTMLInputElement;
  target.value = sanitizeRussianName(target.value);
  form.name = target.value;
  errors.name = '';
}

function onPhoneInput(e: Event) {
  const input = e.target as HTMLInputElement;
  const clean = input.value.replace(/[^\d+]/g, '');
  form.phone = formatPhone(clean);
}

function onPhoneBlur() {
  if (form.phone && !isValidPhone(form.phone)) {
    errors.phone = 'Некорректный телефон';
    form.phone = '';
  } else {
    errors.phone = '';
  }
}

async function handleSubmit() {
  // Очистка от XSS
  form.name = sanitizeInput(form.name);
  form.email = sanitizeInput(form.email);
  form.phone = sanitizeInput(form.phone);
  form.message = sanitizeInput(form.message);

  validateField('name');
  validateField('email');
  validateField('message');
  if (errors.name || errors.email || errors.message || !form.name || !form.email || !form.message) return;

  isSending.value = true;
  try {
    await contactMessagesApi.create({
      name: form.name,
      email: form.email,
      phone: form.phone,
      topic: form.topic,
      message: form.message,
    });
    isSent.value = true;
    form.name = '';
    form.email = '';
    form.phone = '';
    form.topic = '';
    form.message = '';
    setTimeout(() => {
      isSent.value = false;
    }, 5000);
  } catch (error) {
    console.error('Failed to send message:', error);
    errors.message = 'Ошибка отправки. Попробуйте позже.';
  } finally {
    isSending.value = false;
  }
}

/* ---------- Schedule ---------- */
const dayNames = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];

const schedule = [
  { label: 'Понедельник — Четверг', time: '8:00 – 21:00' },
  { label: 'Пятница — Суббота', time: '8:00 – 22:00' },
  { label: 'Воскресенье', time: '8:00 – 21:00' },
];

const todayIndex = computed(() => {
  const d = new Date().getDay();
  if (d === 0) return 2;
  if (d === 5 || d === 6) return 1;
  return 0;
});

const isOpenNow = computed(() => {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const total = h * 60 + m;
  const day = now.getDay();
  if (day === 5 || day === 6) {
    return total >= 480 && total < 1320;
  }
  return total >= 480 && total < 1260;
});

/* ---------- FAQ ---------- */
interface FaqItem {
  question: string;
  answer: string;
  open: boolean;
  answerHeight: number;
}

const faqItems = reactive<FaqItem[]>([
  {
    question: 'Как до вас добраться?',
    answer: 'Мы находимся по адресу: Молодёжная ул., 1В, деревня Курилово, Собинский район, Владимирская область. Если вы едете на машине — ориентируйтесь на центр деревни, рядом с Домом культуры. Общественным транспортом: автобус №102 от автовокзала г. Собинка до остановки "Курилово", далее 5 минут пешком.',
    open: false,
    answerHeight: 0,
  },
  {
    question: 'Есть ли доставка на дом?',
    answer: 'Да! Мы доставляем заказы по деревне Курилово и ближайшим населённым пунктам. Доставка работает ежедневно с 10:00 до 20:00. Минимальная сумма заказа — 300 рублей. Вы можете оформить заказ на нашем сайте или по телефону +7 (925) 483 12 91.',
    open: false,
    answerHeight: 0,
  },
  {
    question: 'Можно ли заказать товар по телефону?',
    answer: 'Конечно! Звоните нам по номеру +7 (925) 483 12 91 с 8:00 до 21:00. Мы примем ваш заказ, подберём свежие продукты и подготовим их к выдаче. Вы можете забрать заказ самостоятельно или заказать доставку.',
    open: false,
    answerHeight: 0,
  },
  {
    question: 'Работаете ли вы в праздничные дни?',
    answer: 'В праздничные дни мы работаем по сокращённому графику — с 9:00 до 18:00. Следите за объявлениями в соцсетях и на сайте — мы всегда предупреждаем об изменениях заранее. В новогодние праздники — ежегодно с 1 по 3 января выходные, с 4 января работаем в обычном режиме.',
    open: false,
    answerHeight: 0,
  },
]);

function toggleFaq(idx: number) {
  faqItems[idx].open = !faqItems[idx].open;
}

/* ---------- Actions ---------- */
function scrollToMap() {
  if (mapRef.value) {
    mapRef.value.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function scrollToForm() {
  if (formRef.value) {
    formRef.value.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function openChat() {
  chatStore.openChat();
}

/* ---------- Socials ---------- */
const socials = [
  {
    name: 'Telegram',
    url: 'https://t.me/slavyanka',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>',
  },
  {
    name: 'WhatsApp',
    url: 'https://wa.me/79254831291',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>',
  },
  {
    name: 'VK',
    url: 'https://vk.com/slavyanka',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M15.684 0H8.316C3.726 0 0 3.726 0 8.316v7.368C0 20.274 3.726 24 8.316 24h7.368c4.59 0 8.316-3.726 8.316-8.316V8.316C24 3.726 20.274 0 15.684 0zm3.474 16.965h-1.852c-.174 0-.413-.122-.532-.274-.303-.384-.406-.477-.742-.96-.464-.665-1.057-1.113-1.406-1.113-.355 0-.557.438-.557 1.161v1.035c0 .348-.216.613-.533.613H12.57c-1.941 0-3.751-1.287-5.213-3.732C5.225 10.323 4.098 6.894 4.098 6.17c0-.261.155-.551.515-.551H6.5c.3 0 .451.184.557.43.428 1.013 1.555 3.511 2.554 4.497.271.27.535.406.776.406.271 0 .348-.182.348-.679V7.815c0-.899-.414-1.266-.836-1.426-.232-.087-.4-.26-.4-.464 0-.271.245-.426.516-.426h2.567c.413 0 .557.271.557.785v3.665c0 .367.09.536.368.536.271 0 .503-.169.777-.44.9-.941 1.813-3.055 1.813-3.055.097-.26.31-.426.58-.426h2.13c.387 0 .542.2.426.532-.174.536-1.238 2.88-2.296 4.008-.309.334-.387.503 0 .905.3.313.828.828 1.184 1.336.464.674.8 1.34.8 1.763 0 .245-.155.533-.619.533z"/></svg>',
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/slavyanka',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>',
  },
];

/* ---------- Scroll Animations ---------- */
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
});
</script>

<style scoped>
.contacts-page { position: relative; }

.reveal {
  opacity: 0;
  transform: translateY(40px) scale(0.97);
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.reveal--visible { opacity: 1; transform: translateY(0) scale(1); }
.reveal--left { transform: translateX(-40px); }
.reveal--left.reveal--visible { transform: translateX(0); }
.reveal--right { transform: translateX(40px); }
.reveal--right.reveal--visible { transform: translateX(0); }
.reveal--scale { transform: scale(0.9); }
.reveal--scale.reveal--visible { transform: scale(1); }

.contacts-hero {
  position: relative;
  min-height: 480px;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 100px 20px;
}

.contacts-hero__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.contacts-hero__bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.contacts-hero__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
}

.contacts-hero__gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 20%, rgba(211,84,0,0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(243,156,18,0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(211,84,0,0.04) 0%, transparent 50%);
}

.contacts-hero__pattern {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 25% 40%, rgba(211,84,0,0.04) 0%, transparent 50%),
    radial-gradient(circle at 75% 60%, rgba(243,156,18,0.03) 0%, transparent 50%);
}

.contacts-hero__particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.hero-particle {
  position: absolute;
  font-size: 28px;
  opacity: 0.18;
  animation: heroFloat 12s ease-in-out infinite;
}
.hero-particle--1 { top: 10%; left: 6%; animation-delay: 0s; transform: rotate(-8deg); }
.hero-particle--2 { top: 16%; right: 10%; animation-delay: 2s; font-size: 22px; }
.hero-particle--3 { bottom: 20%; left: 8%; animation-delay: 4s; font-size: 24px; }
.hero-particle--4 { bottom: 25%; right: 6%; animation-delay: 6s; font-size: 26px; }
.hero-particle--5 { top: 42%; right: 4%; animation-delay: 1s; font-size: 18px; }
.hero-particle--6 { bottom: 12%; left: 48%; animation-delay: 3.5s; font-size: 20px; }

@keyframes heroFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.18; }
  50% { transform: translateY(-22px) rotate(10deg); opacity: 0.28; }
}

.contacts-hero__glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.3;
  pointer-events: none;
}
.contacts-hero__glow--1 {
  width: 300px; height: 300px;
  background: rgba(211,84,0,0.15);
  top: -80px; right: -60px;
  animation: heroGlow 5s ease-in-out infinite alternate;
}
.contacts-hero__glow--2 {
  width: 200px; height: 200px;
  background: rgba(243,156,18,0.12);
  bottom: -60px; left: -40px;
  animation: heroGlow 7s ease-in-out infinite alternate-reverse;
}

@keyframes heroGlow {
  0% { transform: scale(1) translate(0,0); opacity: 0.3; }
  100% { transform: scale(1.3) translate(15px,-15px); opacity: 0.5; }
}

.contacts-hero__content {
  position: relative;
  z-index: 2;
  text-align: center;
  animation: heroContentFade 0.8s cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes heroContentFade {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.contacts-hero__badge {
  display: inline-block;
  padding: 6px 18px;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.contacts-hero__title {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: clamp(42px, 7vw, 60px);
  color: #fff;
  margin-bottom: 12px;
  line-height: 1.1;
  text-shadow: 0 2px 16px rgba(0,0,0,0.25);
}

.contacts-hero__subtitle {
  font-size: 17px;
  color: rgba(255,255,255,0.85);
  max-width: 500px;
  margin: 0 auto 28px;
  line-height: 1.6;
  text-shadow: 0 1px 8px rgba(0,0,0,0.15);
}

.contacts-hero__actions {
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 32px;
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: var(--radius-full);
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 15px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
}

.hero-btn--primary {
  background: var(--color-primary);
  color: #fff;
  box-shadow: 0 4px 14px rgba(211,84,0,0.3);
}
.hero-btn--primary:hover {
  background: var(--color-primary-dark);
  transform: translateY(-3px);
  box-shadow: 0 8px 28px rgba(211,84,0,0.35);
}

.hero-btn--outline {
  background: transparent;
  border: 2px solid rgba(255,255,255,0.35);
  color: #fff;
}
.hero-btn--outline:hover {
  border-color: #fff;
  background: rgba(255,255,255,0.08);
  transform: translateY(-3px);
}

.contacts-hero__breadcrumbs {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 14px;
}

.breadcrumb-link {
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  transition: color var(--transition-fast);
}
.breadcrumb-link:hover { color: #fff; }

.breadcrumb-sep {
  color: rgba(255,255,255,0.4);
  display: flex;
  align-items: center;
}
.breadcrumb-sep svg { width: 12px; height: 12px; }

.breadcrumb-current { color: rgba(255,255,255,0.9); font-weight: 500; }

.section { padding: 72px 20px; position: relative; z-index: 1; }
.section--cards { background: #f5f6f8; }
.section--schedule { background: var(--color-surface); }
.section--faq { background: #f5f6f8; }
.section--social { background: var(--color-surface); }
.section--map { padding: 0; margin-top: -2px; background: var(--color-background); padding-bottom: 0; }

.contacts-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 960px;
  margin: 0 auto;
}

.contact-card {
  position: relative;
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: 36px 28px 28px;
  text-align: center;
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-xs);
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
  overflow: hidden;
  backdrop-filter: blur(12px);
}

.contact-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%);
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.contact-card__glow {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(211,84,0,0.08) 0%, transparent 70%);
  top: -40px;
  right: -40px;
  transition: all 0.4s ease;
}

.contact-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 20px 48px rgba(0,0,0,0.06), 0 8px 16px rgba(0,0,0,0.04);
  border-color: var(--color-primary-light);
}

.contact-card:hover::before { opacity: 1; }
.contact-card:hover .contact-card__glow {
  width: 200px;
  height: 200px;
  opacity: 0.5;
}

.contact-card__icon-wrap {
  width: 68px;
  height: 68px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 18px;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  z-index: 1;
}

.contact-card:hover .contact-card__icon-wrap {
  transform: scale(1.12) rotate(-6deg);
}

.contact-card__title {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 19px;
  color: var(--color-text);
  margin-bottom: 8px;
}

.contact-card__text {
  font-size: 15px;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}

.contact-card__hint {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-bottom: 12px;
}

.contact-card__action {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-primary);
  opacity: 0;
  transform: translateY(4px);
  transition: all 0.3s ease;
}

.contact-card:hover .contact-card__action {
  opacity: 1;
  transform: translateY(0);
}

.block-title {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 28px;
  color: var(--color-text);
  margin-bottom: 24px;
  position: relative;
}

.block-title::after {
  content: '';
  display: block;
  width: 48px;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  border-radius: var(--radius-full);
  margin-top: 10px;
}

.block-title--center { text-align: center; }
.block-title--center::after { margin: 10px auto 0; }

.schedule-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 44px;
  max-width: 960px;
  margin: 0 auto;
}

.schedule-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  gap: 16px;
  flex-wrap: wrap;
}
.schedule-header .block-title { margin-bottom: 0; }

.open-indicator {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 14px;
  border-radius: var(--radius-full);
  background: rgba(16,185,129,0.08);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-success);
}

.open-indicator--closed {
  background: rgba(231,76,60,0.08);
  color: var(--color-error);
}

.open-indicator__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  animation: pulseDot 2s ease-in-out infinite;
}

@keyframes pulseDot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.8); }
}

.open-indicator--closed .open-indicator__dot {
  animation: none;
  opacity: 0.5;
}

.schedule-table {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.schedule-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  border-radius: var(--radius-md);
  background: var(--color-background);
  border: 1px solid var(--color-border-light);
  transition: all var(--transition-fast);
}

.schedule-row:hover {
  background: var(--color-primary-soft);
  border-color: var(--color-primary-light);
  transform: translateX(4px);
}

.schedule-row--today {
  border-color: var(--color-primary-light);
  background: linear-gradient(135deg, rgba(211,84,0,0.04) 0%, transparent 50%);
}

.schedule-row__left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.schedule-row__badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.schedule-day {
  font-weight: 500;
  font-size: 15px;
  color: var(--color-text);
}

.schedule-day--today {
  color: var(--color-primary);
  font-weight: 600;
}

.schedule-time {
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 15px;
  color: var(--color-primary);
  white-space: nowrap;
}

.schedule-note {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text-muted);
  font-size: 14px;
  margin-top: 16px;
}
.schedule-note svg { flex-shrink: 0; }

.form-block { position: relative; }

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-field { position: relative; transition: all var(--transition-fast); }
.form-field--select { margin-bottom: 0; }

.form-input {
  width: 100%;
  padding: 16px 16px 8px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--color-text);
  background: var(--color-background);
  transition: all var(--transition-fast);
  outline: none;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(211,84,0,0.08);
}

.form-input:focus ~ .form-field__bar { transform: scaleX(1); }
.form-input::placeholder { color: transparent; }

.form-label {
  position: absolute;
  left: 16px;
  top: 14px;
  font-size: 14px;
  color: var(--color-text-muted);
  pointer-events: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--color-background);
  padding: 0 4px;
}

.form-input:focus ~ .form-label,
.form-field--filled .form-label {
  top: -8px;
  font-size: 11px;
  color: var(--color-primary);
  font-weight: 600;
}

.form-field__bar {
  position: absolute;
  bottom: 0;
  left: 16px;
  right: 16px;
  height: 2px;
  background: var(--color-primary);
  transform: scaleX(0);
  transition: transform 0.2s ease;
  border-radius: 0 0 2px 2px;
}

.form-field__error {
  display: block;
  font-size: 11px;
  color: var(--color-error);
  margin-top: 4px;
  padding-left: 4px;
  animation: shakeField 0.3s ease;
}

@keyframes shakeField {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.form-field__check {
  position: absolute;
  right: 14px;
  top: 14px;
  color: var(--color-success);
  animation: checkPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes checkPop {
  0% { transform: scale(0); }
  60% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

.form-field--error .form-input {
  border-color: var(--color-error);
  box-shadow: 0 0 0 3px rgba(231,76,60,0.08);
}

.form-row--double {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 40px;
  cursor: pointer;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  padding: 20px 16px 8px;
}
.form-field--textarea .form-label { top: 16px; }
.form-field--textarea .form-input:focus ~ .form-label,
.form-field--textarea.form-field--filled .form-label { top: -8px; }

.form-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 28px;
  border: none;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: #fff;
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  width: 100%;
  overflow: hidden;
}

.form-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(211,84,0,0.3);
}

.form-btn:active:not(:disabled) { transform: translateY(0); }
.form-btn:disabled { opacity: 0.7; cursor: not-allowed; }

.form-btn__loader { display: inline-flex; align-items: center; gap: 8px; }

.form-btn__spinner { animation: spinLoader 1s linear infinite; }

@keyframes spinLoader { to { transform: rotate(360deg); } }

.form-btn__content { display: inline-flex; align-items: center; gap: 8px; }

.form-success {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  color: #065f46;
  border-radius: var(--radius-lg);
  font-size: 14px;
  position: relative;
  overflow: hidden;
}

.form-success__icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #065f46;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.form-success__text { flex: 1; }
.form-success__text strong { display: block; margin-bottom: 2px; }

.form-success__confetti {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.form-success__confetti span {
  position: absolute;
  font-size: 16px;
  animation: confettiFall 2s ease-out forwards;
  opacity: 0;
}
.form-success__confetti span:nth-child(1) { left: 10%; top: -10%; animation-delay: 0s; }
.form-success__confetti span:nth-child(2) { left: 35%; top: -10%; animation-delay: 0.2s; }
.form-success__confetti span:nth-child(3) { left: 60%; top: -10%; animation-delay: 0.4s; }
.form-success__confetti span:nth-child(4) { left: 85%; top: -10%; animation-delay: 0.6s; }

@keyframes confettiFall {
  0% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
  100% { opacity: 0; transform: translateY(300px) rotate(360deg) scale(0.5); }
}

.success-pop-enter-active { animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.success-pop-leave-active { animation: popOut 0.25s ease; }
@keyframes popIn { 0% { opacity: 0; transform: scale(0.8) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
@keyframes popOut { 0% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(0.9); } }

.faq-list {
  max-width: 740px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.faq-item {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  overflow: hidden;
  transition: all var(--transition-fast);
}
.faq-item:hover { border-color: var(--color-primary-light); }
.faq-item--open { border-color: var(--color-primary-light); box-shadow: 0 4px 16px rgba(211,84,0,0.06); }

.faq-question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 18px 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 15px;
  color: var(--color-text);
  text-align: left;
  transition: color var(--transition-fast);
}
.faq-item--open .faq-question { color: var(--color-primary); }

.faq-question__icon {
  display: flex;
  align-items: center;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  color: var(--color-text-muted);
  flex-shrink: 0;
}
.faq-item--open .faq-question__icon { transform: rotate(180deg); color: var(--color-primary); }

.faq-answer { overflow: hidden; transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.faq-answer__text { padding: 0 24px 20px; font-size: 14px; line-height: 1.7; color: var(--color-text-secondary); }

.social-block { text-align: center; max-width: 600px; margin: 0 auto; }
.social-subtitle { font-size: 15px; color: var(--color-text-muted); margin-bottom: 28px; }
.social-links { display: flex; justify-content: center; gap: 18px; }

.social-link {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: var(--color-text-secondary);
  background: var(--color-background);
  border: 1.5px solid var(--color-border-light);
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
  animation: socialFade 0.5s ease-out both;
}

@keyframes socialFade { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }

.social-link__bg {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.social-link__icon {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.social-link:hover .social-link__icon { transform: scale(1.15) rotate(-8deg); }

.social-link:hover {
  transform: translateY(-4px) scale(1.08);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.social-link--telegram:hover .social-link__bg { background: linear-gradient(135deg, #0088cc, #0077b5); opacity: 1; }
.social-link--whatsapp:hover .social-link__bg { background: linear-gradient(135deg, #25D366, #128C7E); opacity: 1; }
.social-link--vk:hover .social-link__bg { background: linear-gradient(135deg, #4a76a8, #3a6696); opacity: 1; }
.social-link--instagram:hover .social-link__bg { background: linear-gradient(135deg, #f58529, #dd2a7b, #8134af); opacity: 1; }

.social-count { margin-top: 20px; font-size: 13px; color: var(--color-text-muted); }

.map-wrapper { max-width: 960px; margin: 0 auto; padding: 0 20px 40px; }
.map-container { position: relative; border-radius: var(--radius-xl); overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.06); border: 1px solid var(--color-border-light); }
.map-iframe { display: block; width: 100%; }
.map-overlay { position: absolute; bottom: 20px; right: 20px; z-index: 2; }

.map-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: var(--radius-full);
  color: var(--color-primary);
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 13px;
  text-decoration: none;
  transition: all var(--transition-fast);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.map-btn:hover { background: #fff; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); color: var(--color-primary-dark); }

.phone-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 20px;
}

.phone-modal {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: 48px 36px 36px;
  width: 100%;
  max-width: 420px;
  position: relative;
  box-shadow: 0 25px 60px rgba(0,0,0,0.12);
  border: 1px solid var(--color-border-light);
  text-align: center;
  animation: phoneModalIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes phoneModalIn { from { opacity: 0; transform: scale(0.85) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }

.phone-modal__close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-border-light);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-text-muted);
  transition: all var(--transition-fast);
}
.phone-modal__close:hover { background: var(--color-error); color: #fff; transform: scale(1.1); }

.phone-modal__icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fef3e8, #ffedd5);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  animation: phonePulse 2s ease-in-out infinite;
}

@keyframes phonePulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }

.phone-modal__title { font-family: var(--font-heading); font-weight: 700; font-size: 22px; color: var(--color-text); margin-bottom: 12px; }
.phone-modal__number { font-family: var(--font-heading); font-weight: 800; font-size: 32px; color: var(--color-primary); letter-spacing: 1px; margin-bottom: 8px; }
.phone-modal__hint { font-size: 14px; color: var(--color-text-muted); margin-bottom: 28px; }
.phone-modal__actions { display: flex; gap: 12px; justify-content: center; }

.phone-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: var(--radius-full);
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.phone-btn--call { background: var(--color-primary); color: #fff; box-shadow: 0 4px 14px rgba(211,84,0,0.3); }
.phone-btn--call:hover { background: var(--color-primary-dark); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(211,84,0,0.35); }
.phone-btn--copy { background: var(--color-border-light); color: var(--color-text); }
.phone-btn--copy:hover { background: var(--color-primary-soft); color: var(--color-primary); transform: translateY(-2px); }

.phone-modal__toast {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 16px;
  padding: 8px 16px;
  background: rgba(16,185,129,0.1);
  color: var(--color-success);
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: 500;
}

.phone-modal-enter-active { transition: opacity 0.3s ease; }
.phone-modal-leave-active { transition: opacity 0.2s ease; }
.phone-modal-enter-from, .phone-modal-leave-to { opacity: 0; }

.copy-toast-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.copy-toast-leave-active { transition: all 0.2s ease; }
.copy-toast-enter-from { opacity: 0; transform: translateY(8px); }
.copy-toast-leave-to { opacity: 0; transform: translateY(-8px); }

@media (max-width: 900px) {
  .contacts-cards { grid-template-columns: 1fr; max-width: 420px; }
  .schedule-grid { grid-template-columns: 1fr; gap: 36px; }
  .form-row--double { grid-template-columns: 1fr; }
  .contacts-hero { min-height: 400px; padding: 80px 16px; }
  .section { padding: 56px 16px; }
  .schedule-header { flex-direction: column; align-items: flex-start; }
  .map-overlay { bottom: 12px; right: 12px; }
  .map-btn { font-size: 12px; padding: 8px 16px; }
}

@media (max-width: 480px) {
  .social-links { gap: 12px; }
  .social-link { width: 52px; height: 52px; }
  .faq-question { padding: 14px 18px; font-size: 14px; }
  .faq-answer__text { padding: 0 18px 16px; font-size: 13px; }
  .form-success { flex-direction: column; text-align: center; padding: 14px; }
  .map-wrapper { padding: 0 12px 24px; }
  .phone-modal { padding: 36px 24px 28px; }
  .phone-modal__number { font-size: 26px; }
  .phone-modal__actions { flex-direction: column; align-items: center; }
}
</style>