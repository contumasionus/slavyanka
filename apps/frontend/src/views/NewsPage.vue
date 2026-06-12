<template>
  <div class="news-page">
    <!-- Hero секция -->
    <section class="news-hero">
      <div class="news-hero__bg">
        <img src="/images/news-bg.jpg" alt="" class="news-hero__bg-img">
        <div class="news-hero__overlay"></div>
        <div class="news-hero__gradient"></div>
        <div class="news-hero__pattern"></div>
        <div class="news-hero__particles">
          <span class="particle particle--1">📰</span>
          <span class="particle particle--2">✨</span>
          <span class="particle particle--3">📬</span>
          <span class="particle particle--4">⭐</span>
        </div>
      </div>
      <div class="container">
        <div class="news-hero__content">
          <div class="news-hero__badge">Наш блог</div>
          <h1 class="news-hero__title">Новости магазина</h1>
          <p class="news-hero__subtitle">Будьте в курсе новых поступлений, акций и событий</p>
        </div>
      </div>
    </section>

    <!-- Фильтр по тегам -->
    <section class="section section--tags">
      <div class="container">
        <div class="tags-filter">
          <button
            class="tag-btn"
            :class="{ 'tag-btn--active': activeTag === null }"
            @click="activeTag = null"
          >Все новости</button>
          <button
            v-for="tag in availableTags"
            :key="tag"
            class="tag-btn"
            :class="{
              'tag-btn--active': activeTag === tag,
              'tag-btn--action': tag === 'акция',
              'tag-btn--new': tag === 'новинка',
              'tag-btn--important': tag === 'важное',
              'tag-btn--info': tag === 'полезное',
            }"
            @click="activeTag = tag"
          >{{ getTagLabel(tag) }}</button>
        </div>
      </div>
    </section>

    <section class="section section--news">
      <div class="container">

        <!-- Загрузка -->
        <div v-if="loading" class="news-grid">
          <div v-for="n in 6" :key="'sk-' + n" class="news-card news-card--skeleton">
            <div class="news-card__image-wrap skeleton skeleton--image"></div>
            <div class="news-card__body">
              <div class="skeleton skeleton--tag" style="width: 80px; height: 22px;"></div>
              <div class="skeleton skeleton--title" style="width: 80%;"></div>
              <div class="skeleton skeleton--text" style="width: 60%;"></div>
              <div class="skeleton skeleton--text" style="width: 40%;"></div>
            </div>
          </div>
        </div>

        <!-- Ошибка -->
        <div v-else-if="error" class="empty-state">
          <div class="empty-state__icon-wrap">
            <span class="empty-state__icon">😔</span>
          </div>
          <h3 class="empty-state__title">Не удалось загрузить новости</h3>
          <p class="empty-state__desc">{{ error }}</p>
          <button @click="loadNews" class="btn--retry">Повторить</button>
        </div>

        <!-- Список новостей -->
        <template v-else>
          <!-- Первая (главная) новость -->
          <div v-if="featuredNews" class="news-grid">
            <div class="news-card news-card--featured" @click="openArticle(featuredNews.slug)">
              <div class="news-card__image-wrap">
                <img :src="featuredNews.imageUrl || '/images/products/placeholder.svg'" :alt="featuredNews.title" class="news-card__image" loading="lazy">
                <div class="news-card__image-overlay">
                  <span class="news-card__read-time">{{ featuredNews.readTime || '3 мин' }} чтения</span>
                </div>
              </div>
              <div class="news-card__body">
                <div class="news-card__meta">
                  <span class="news-card__tag" :class="'tag--' + featuredNews.tag">{{ getTagLabel(featuredNews.tag) }}</span>
                  <span class="news-card__date">{{ formatDate(featuredNews.date) }}</span>
                </div>
                <h3 class="news-card__title news-card__title--lg">{{ featuredNews.title }}</h3>
                <p class="news-card__excerpt">{{ truncate(featuredNews.excerpt || featuredNews.content, 160) }}</p>
                <div class="news-card__footer">
                  <span class="news-card__author" v-if="featuredNews.author">
                    <span class="author-avatar">{{ featuredNews.author.charAt(0) }}</span>
                    {{ featuredNews.author }}
                  </span>
                  <span class="news-card__link">
                    Читать далее
                    <svg class="link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Остальные новости -->
          <div v-if="paginatedNews.length" class="news-grid">
            <div
              v-for="(item, idx) in paginatedNews"
              :key="item.id"
              class="news-card"
              :class="{ 'news-card--hidden': featuredNews && idx === 0 }"
              @click="openArticle(item.slug)"
            >
              <div class="news-card__image-wrap">
                <img :src="item.imageUrl || '/images/products/placeholder.svg'" :alt="item.title" class="news-card__image" loading="lazy">
                <div class="news-card__image-overlay">
                  <span class="news-card__read-time">{{ item.readTime || '3 мин' }} чтения</span>
                </div>
              </div>
              <div class="news-card__body">
                <div class="news-card__meta">
                  <span class="news-card__tag" :class="'tag--' + item.tag">{{ getTagLabel(item.tag) }}</span>
                  <span class="news-card__date">{{ formatDate(item.date) }}</span>
                </div>
                <h3 class="news-card__title">{{ item.title }}</h3>
                <p class="news-card__excerpt">{{ truncate(item.excerpt || item.content, 120) }}</p>
                <div class="news-card__footer">
                  <span class="news-card__author" v-if="item.author">
                    <span class="author-avatar">{{ item.author.charAt(0) }}</span>
                    {{ item.author }}
                  </span>
                  <span class="news-card__link">
                    Читать далее
                    <svg class="link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Ещё новости / Пагинация -->
          <div v-if="hasMore" class="news-counter">
            <p class="news-counter__text">Показано {{ displayedCount }} из {{ filteredNews.length }} новостей</p>
            <button @click="showMore" class="btn--load-more">Загрузить ещё</button>
          </div>
        </template>

      </div>
    </section>

    <!-- Подписка на новости -->
    <section class="section section--subscribe">
      <div class="container">
        <div class="subscribe-card">
          <div class="subscribe-card__content">
            <h3 class="subscribe-card__title">Подпишитесь на новости</h3>
            <p class="subscribe-card__desc">Получайте уведомления о новых акциях, поступлениях и событиях магазина</p>
            <form @submit.prevent="handleSubscribe" class="subscribe-form">
              <div class="subscribe-form__row">
                <input v-model="subscribeEmail" type="email" placeholder="Ваш email" required class="subscribe-form__input">
                <button type="submit" :disabled="subscribing" class="subscribe-form__btn">{{ subscribing ? '...' : 'Подписаться' }}</button>
              </div>
              <p v-if="subscribeSuccess" class="subscribe-form__success">✓ Вы подписались на новости!</p>
            </form>
          </div>
          <div class="subscribe-card__decor">📬</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { newsApi } from '../api/news.api';

const router = useRouter();

const allNews = ref<any[]>([]);
const loading = ref(true);
const error = ref('');
const activeTag = ref<string | null>(null);
const visibleCount = ref(9);
const subscribeEmail = ref('');
const subscribing = ref(false);
const subscribeSuccess = ref(false);

const availableTags = computed(() => {
  const tags = new Set<string>();
  allNews.value.forEach(n => { if (n.tag) tags.add(n.tag); });
  return ['акция', 'новинка', 'важное', 'полезное'].filter(t => tags.has(t));
});

const filteredNews = computed(() => {
  if (!activeTag.value) return allNews.value;
  return allNews.value.filter(n => n.tag === activeTag.value);
});

const featuredNews = computed(() => {
  return filteredNews.value.length > 0 ? filteredNews.value[0] : null;
});

const paginatedNews = computed(() => {
  // Если featuredNews есть, его не дублируем в сетке
  const start = featuredNews.value ? 1 : 0;
  return filteredNews.value.slice(start, visibleCount.value + (featuredNews.value ? 1 : 0));
});

const hasMore = computed(() => visibleCount.value < filteredNews.value.length - (featuredNews.value ? 1 : 0));
const displayedCount = computed(() => paginatedNews.value.length);

function showMore() { visibleCount.value += 6; }
function getTagLabel(tag: string) {
  const map: Record<string, string> = { 'акция': '🔥 Акция', 'новинка': '✨ Новинка', 'важное': '⚠️ Важное', 'полезное': '💡 Полезное' };
  return map[tag] || tag;
}
function formatDate(dateStr: string) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}
function truncate(text: string, max: number) { return text && text.length > max ? text.slice(0, max) + '…' : text; }
function openArticle(slug: string) { router.push(`/news/${slug}`); }
function formatDateForSort(dateStr: string) { return dateStr ? new Date(dateStr).getTime() : 0; }

interface NewsItem {
  id: string; slug: string; title: string; content: string; excerpt?: string;
  date: string; tag?: string; imageUrl?: string; author?: string; readTime?: string;
}

async function loadNews() {
  loading.value = true;
  error.value = '';
  try {
    const data: NewsItem[] = await newsApi.getAll();
    allNews.value = data.sort((a, b) => formatDateForSort(b.date) - formatDateForSort(a.date));
  } catch (e: any) {
    error.value = e.response?.data?.error || 'Ошибка загрузки новостей';
  } finally {
    loading.value = false;
  }
}

async function handleSubscribe() {
  if (!subscribeEmail.value) return;
  subscribing.value = true;
  try {
    // await newsApi.subscribe(subscribeEmail.value);
    await new Promise(r => setTimeout(r, 600));
    subscribeSuccess.value = true;
    subscribeEmail.value = '';
  } catch { /* ignore */ }
  finally { subscribing.value = false; }
}

loadNews();
</script>

<style scoped>

/* ===== NEWS PAGE ===== */
.news-page {
  overflow-x: hidden;
}

/* ===== HERO ===== */
.news-hero {
  position: relative;
  padding: 140px 20px 100px;
  overflow: hidden;
}
.news-hero__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.news-hero__bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
.news-hero__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.45);
}
.news-hero__gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.4));
}
.news-hero__pattern,
.news-hero__particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}
.news-hero__pattern {
  opacity: 0.05;
  background-image: repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 40px);
}

.news-hero__particles .particle {
  position: absolute;
  font-size: 24px;
  opacity: 0.2;
  animation: particleFloat 12s ease-in-out infinite;
}
.news-hero__particles .particle--1 { top: 10%; left: 15%; animation-delay: 0s; }
.news-hero__particles .particle--2 { top: 20%; right: 20%; animation-delay: 2s; }
.news-hero__particles .particle--3 { bottom: 30%; left: 10%; animation-delay: 4s; }
.news-hero__particles .particle--4 { bottom: 20%; right: 15%; animation-delay: 6s; }

@keyframes particleFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  33% { transform: translateY(-20px) rotate(5deg); }
  66% { transform: translateY(10px) rotate(-3deg); }
}

.news-hero__content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
}
.news-hero__badge {
  display: inline-block;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.2);
  padding: 8px 20px;
  border-radius: var(--radius-full);
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 13px;
  color: #fff;
  margin-bottom: 20px;
  animation: badgeIn 0.6s ease-out backwards;
  letter-spacing: 0.5px;
}
@keyframes badgeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.news-hero__title {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: clamp(36px, 7vw, 56px);
  color: #fff;
  margin-bottom: 16px;
  line-height: 1.15;
  text-shadow: 0 2px 16px rgba(0,0,0,0.25);
  animation: heroFade 0.7s ease-out 0.15s backwards;
}

.news-hero__subtitle {
  font-family: var(--font-body);
  font-size: 17px;
  color: rgba(255,255,255,0.85);
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
  text-shadow: 0 1px 8px rgba(0,0,0,0.15);
  animation: heroFade 0.7s ease-out 0.3s backwards;
}

@keyframes heroFade { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

/* ===== TAGS FILTER ===== */
.section {
  padding: 48px 20px;
  background: #ffffff;
}
.section--tags {
  padding: 24px 20px;
  background: #f9fafb;
  border-bottom: 1px solid #f1f3f5;
}

.tags-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.tag-btn {
  padding: 8px 20px;
  border-radius: var(--radius-full);
  border: 1px solid #e2e8f0;
  background: #ffffff;
  font-family: var(--font-heading);
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-btn:hover {
  border-color: var(--color-primary-light);
  color: var(--color-primary);
  background: #fff5ed;
}

.tag-btn--active {
  background: var(--color-primary);
  color: #ffffff;
  border-color: var(--color-primary);
  box-shadow: 0 2px 8px rgba(211, 84, 0, 0.2);
}

.tag-btn--action { border-color: #fecaca; color: #dc2626; }
.tag-btn--action.tag-btn--active { background: #dc2626; border-color: #dc2626; color: #fff; }
.tag-btn--new { border-color: #bbf7d0; color: #16a34a; }
.tag-btn--new.tag-btn--active { background: #16a34a; border-color: #16a34a; color: #fff; }
.tag-btn--important { border-color: #fed7aa; color: #ea580c; }
.tag-btn--important.tag-btn--active { background: #ea580c; border-color: #ea580c; color: #fff; }
.tag-btn--info { border-color: #bfdbfe; color: #2563eb; }
.tag-btn--info.tag-btn--active { background: #2563eb; border-color: #2563eb; color: #fff; }

/* ===== NEWS GRID ===== */
.section--news {
  background: #f9fafb;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

/* ===== NEWS CARD ===== */
.news-card {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #f1f3f5;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}

.news-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.03);
  border-color: #e2e8f0;
}

.news-card--hidden { display: none; }

/* Featured card */
.news-card--featured {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
}

.news-card--featured .news-card__image-wrap {
  min-height: 320px;
  height: 100%;
}

/* Image */
.news-card__image-wrap {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: #f1f3f5;
}

.news-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.news-card:hover .news-card__image {
  transform: scale(1.06);
}

.news-card__image-overlay {
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.news-card:hover .news-card__image-overlay {
  opacity: 1;
}

.news-card__read-time {
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(4px);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
}

/* Body */
.news-card__body {
  padding: 20px 22px 22px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.news-card__meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.news-card__tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tag--акция { background: #fef2f2; color: #dc2626; }
.tag--новинка { background: #f0fdf4; color: #16a34a; }
.tag--важное { background: #fff7ed; color: #ea580c; }
.tag--полезное { background: #eff6ff; color: #2563eb; }

.news-card__date {
  font-size: 13px;
  color: #94a3b8;
}

.news-card__title {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 18px;
  color: #1a1a2e;
  margin-bottom: 8px;
  line-height: 1.35;
  transition: color 0.2s ease;
}

.news-card:hover .news-card__title {
  color: var(--color-primary);
}

.news-card__title--lg {
  font-size: 22px;
}

.news-card__excerpt {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 16px;
  flex: 1;
}

.news-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: auto;
}

.news-card__author {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #64748b;
}

.author-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
}

.news-card__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 14px;
  color: var(--color-primary);
  text-decoration: none;
  transition: gap var(--transition-fast);
  margin-top: auto;
}

.news-card__link:hover {
  gap: 10px;
}

.link-arrow {
  width: 16px;
  height: 16px;
  transition: transform var(--transition-fast);
}

/* Skeleton */
.news-card--skeleton .news-card__body {
  padding: 20px 22px 22px;
}

/* ---------- EMPTY STATE ---------- */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  max-width: 400px;
  margin: 0 auto;
}

.empty-state__icon-wrap {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #fef3e8;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.empty-state__icon {
  font-size: 36px;
}

.empty-state__title {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 22px;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.empty-state__desc {
  font-size: 15px;
  color: #94a3b8;
  margin-bottom: 24px;
}

/* ---------- COUNTER ---------- */
.news-counter {
  text-align: center;
  margin-top: 48px;
}

.news-counter__text {
  font-size: 13px;
  color: #94a3b8;
}

/* ---------- SUBSCRIBE (фирменный красный) ---------- */
.section--subscribe {
  padding: 0 20px 80px;
  background: #ffffff;
}

.subscribe-card {
  max-width: 700px;
  margin: 0 auto;
  background: linear-gradient(135deg, var(--color-primary) 0%, #a04000 50%, #872e00 100%);
  border-radius: 24px;
  padding: 48px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  border: none;
  box-shadow: 0 8px 32px rgba(211, 84, 0, 0.25);
}

.subscribe-card__content {
  flex: 1;
}

.subscribe-card__title {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 24px;
  color: #ffffff;
  margin-bottom: 8px;
}

.subscribe-card__desc {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 20px;
}

.subscribe-form__row {
  display: flex;
  gap: 10px;
}

.subscribe-form__input {
  flex: 1;
  padding: 12px 18px;
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-radius: var(--radius-md);
  font-size: 15px;
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  outline: none;
  transition: all var(--transition-fast);
  backdrop-filter: blur(4px);
}

.subscribe-form__input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.subscribe-form__input:focus {
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.2);
}

.subscribe-form__btn {
  padding: 12px 28px;
  background: #ffffff;
  color: var(--color-primary);
  border: none;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.subscribe-form__btn:hover {
  background: #fff5ed;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}
.subscribe-form__btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.subscribe-form__success {
  margin-top: 12px;
  color: #6ee7b7;
  font-size: 14px;
  font-weight: 500;
}

.subscribe-card__decor {
  font-size: 56px;
  opacity: 0.3;
  flex-shrink: 0;
  animation: floatNews 6s ease-in-out infinite;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.2));
}

/* ---------- RESPONSIVE ---------- */
@media (max-width: 768px) {
  .news-hero {
    padding: 100px 16px 60px;
  }

  .news-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .news-card--featured {
    grid-template-columns: 1fr;
  }

  .news-card--featured .news-card__image-wrap {
    height: 200px;
    min-height: auto;
  }

  .news-card__image-wrap {
    height: 180px;
  }

  .subscribe-card {
    flex-direction: column;
    text-align: center;
    padding: 32px 24px;
  }

  .subscribe-form__row {
    flex-direction: column;
  }

  .subscribe-card__decor {
    display: none;
  }
}

@media (max-width: 480px) {
  .news-hero {
    padding: 80px 12px 48px;
  }

  .news-card__body {
    padding: 16px 18px;
  }
}
</style>