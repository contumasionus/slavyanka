<template>
  <div class="article-page">
    <!-- Прогресс-бар чтения -->
    <div class="reading-progress" ref="progressBar">
      <div class="reading-progress__bar" :style="{ width: readingProgress + '%' }"></div>
    </div>

    <article v-if="article" class="article">
      <!-- Hero изображение -->
      <div class="article__hero" v-if="article.imageUrl">
        <img :src="article.imageUrl" :alt="article.title" class="article__hero-img">
        <div class="article__hero-overlay"></div>
        <div class="article__hero-content">
          <time class="article__hero-date">{{ formatDate(article.createdAt) }}</time>
          <h1 class="article__hero-title">{{ article.title }}</h1>
        </div>
        <router-link to="/news" class="article__back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/></svg>
          Все новости
        </router-link>
      </div>

      <!-- Без изображения -->
      <div class="article__body" v-if="article">
        <template v-if="!article.imageUrl">
          <router-link to="/news" class="article__back-link">← Все новости</router-link>
          <time class="article__date">{{ formatDate(article.createdAt) }}</time>
          <h1 class="article__title">{{ article.title }}</h1>
        </template>

        <!-- Мета-информация -->
        <div class="article__meta" v-if="!article.imageUrl">
          <span class="article__reading-time">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
            {{ readingTime }} мин чтения
          </span>
          <span class="article__views">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            {{ views }}
          </span>
        </div>

        <!-- Теги -->
        <div class="article__tags" v-if="article.tags">
          <span
            v-for="tag in article.tags.split(',')"
            :key="tag"
            class="article__tag"
            :class="{
              'tag--action': tag.trim() === 'акция',
              'tag--new': tag.trim() === 'новинка',
              'tag--important': tag.trim() === 'важное',
              'tag--info': tag.trim() === 'полезное',
            }"
          >{{ getTagLabel(tag) }}</span>
        </div>

        <!-- Контент -->
        <div class="article__content" v-html="renderContent(article.content)"></div>

        <!-- Кнопки "Поделиться" -->
        <div class="article__share">
          <span class="article__share-label">Поделиться:</span>
          <button class="share-btn" @click="shareUrl" title="Скопировать ссылку">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16,6 12,2 8,6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
            Скопировать
          </button>
          <a :href="'https://t.me/share/url?url=' + currentUrl + '&text=' + article.title" target="_blank" class="share-btn" title="Поделиться в Telegram">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
          </a>
          <a :href="'https://vk.com/share.php?url=' + currentUrl" target="_blank" class="share-btn" title="Поделиться ВКонтакте">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.684 0H8.316C3.064 0 0 3.064 0 8.316v7.368C0 20.936 3.064 24 8.316 24h7.368C20.936 24 24 20.936 24 15.684V8.316C24 3.064 20.936 0 15.684 0zm3.432 16.488h-1.656c-.684 0-.888-.528-2.112-1.788-1.068-1.068-1.536-1.212-1.8-1.212-.372 0-.48.144-.48.84v1.272c0 .48-.156.744-1.392.744-2.052 0-4.332-1.272-5.916-3.624-2.448-3.456-3.108-6.036-3.108-6.564 0-.264.108-.528.552-.528h1.656c.444 0 .624.204.792.672.828 2.292 2.16 4.308 2.712 4.308.204 0 .312-.108.312-.636V9.168c-.084-1.14-.672-1.236-.672-1.632 0-.204.156-.408.408-.408h2.568c.372 0 .504.204.504.636v3.396c0 .372.168.504.264.504.216 0 .384-.132.588-.336 1.056-1.176 1.848-3.06 1.848-3.06.108-.264.312-.408.744-.408h1.656c.504 0 .624.264.504.636-.228.744-2.544 4.14-2.544 4.14-.204.336-.144.48 0 .78.132.264.9 1.116 1.368 1.632.732.804 1.308 1.464 1.308 1.896 0 .24-.144.48-.624.48z"/></svg>
          </a>
        </div>

        <!-- Сообщение о копировании -->
        <Transition name="fade">
          <div v-if="copied" class="article__copied">✓ Ссылка скопирована!</div>
        </Transition>

        <!-- Навигация -->
        <div class="article__nav">
          <router-link to="/news" class="article__nav-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/></svg>
            Все новости
          </router-link>
        </div>
      </div>
    </article>

    <!-- Загрузка -->
    <div v-else-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Загрузка новости...</p>
    </div>

    <!-- 404 -->
    <div v-else class="error-state">
      <div class="error-state__icon">📭</div>
      <h2 class="error-state__title">Новость не найдена</h2>
      <p class="error-state__desc">Возможно, она была удалена или ссылка неверна</p>
      <router-link to="/news" class="btn btn--primary">Все новости</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { newsApi } from '../api/news.api';

const route = useRoute();
const article = ref<any>(null);
const loading = ref(true);
const readingProgress = ref(0);
const copied = ref(false);
const views = ref(Math.floor(Math.random() * 200) + 50);

const progressBar = ref<HTMLElement | null>(null);

const currentUrl = computed(() => encodeURIComponent(window.location.href));

const readingTime = computed(() => {
  if (!article.value?.content) return 1;
  const wordCount = article.value.content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
});

const tagLabels: Record<string, string> = {
  'акция': '🎯 Акция',
  'новинка': '✨ Новинка',
  'важное': '📌 Важное',
  'полезное': '💡 Полезное',
};

function getTagLabel(tag: string): string {
  return tagLabels[tag.trim()] || tag.trim();
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function renderContent(content: string) {
  // Разбиваем на параграфы для лучшего отображения
  return content
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return '<div class="article__spacer"></div>';
      return `<p class="article__paragraph">${trimmed}</p>`;
    })
    .join('');
}

async function shareUrl() {
  try {
    await navigator.clipboard.writeText(window.location.href);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch {
    // fallback
    const textarea = document.createElement('textarea');
    textarea.value = window.location.href;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  }
}

function handleScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (docHeight > 0) {
    readingProgress.value = Math.min(100, Math.round((scrollTop / docHeight) * 100));
  }
}

onMounted(async () => {
  try {
    article.value = await newsApi.getBySlug(route.params.slug as string);
  } catch {
    /* ignore */
  }
  loading.value = false;

  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* ============================
   ARTICLE PAGE — MODERN WHITE
   ============================ */
.article-page {
  min-height: 70vh;
  background: #ffffff;
  position: relative;
}

/* ---------- PROGRESS BAR ---------- */
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #f0ebe3;
  z-index: 1000;
}

.reading-progress__bar {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  transition: width 0.1s linear;
  border-radius: 0 2px 2px 0;
}

/* ---------- HERO ---------- */
.article__hero {
  position: relative;
  height: 400px;
  overflow: hidden;
}

.article__hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article__hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 60%, transparent 100%);
}

.article__hero-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32px 40px;
  color: #ffffff;
}

.article__hero-date {
  font-size: 14px;
  opacity: 0.85;
  display: block;
  margin-bottom: 8px;
}

.article__hero-title {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: clamp(28px, 4vw, 44px);
  line-height: 1.15;
  max-width: 800px;
}

.article__back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(8px);
  border-radius: var(--radius-full);
  color: #1a1a2e;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: background var(--transition-fast);
}

.article__back-btn svg {
  width: 16px;
  height: 16px;
}

.article__back-btn:hover {
  background: #ffffff;
}

/* ---------- BODY ---------- */
.article__body {
  max-width: 720px;
  margin: 0 auto;
  padding: 40px 24px 64px;
  background: #ffffff;
}

/* Back link (when no hero) */
.article__back-link {
  display: inline-block;
  font-weight: 600;
  font-size: 14px;
  color: var(--color-primary);
  text-decoration: none;
  margin-bottom: 20px;
}

.article__back-link:hover {
  text-decoration: underline;
}

/* Date & Title (no hero) */
.article__date {
  font-size: 14px;
  color: #94a3b8;
}

.article__title {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: clamp(28px, 4vw, 40px);
  color: #1a1a2e;
  margin: 8px 0 16px;
  line-height: 1.15;
}

/* Meta */
.article__meta {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.article__reading-time,
.article__views {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #94a3b8;
}

.article__reading-time svg,
.article__views svg {
  width: 15px;
  height: 15px;
}

/* Tags */
.article__tags {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.article__tag {
  padding: 4px 14px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.tag--action { background: #d1fae5; color: #065f46; }
.tag--new { background: #fef3c7; color: #92400e; }
.tag--important { background: #fee2e2; color: #991b1b; }
.tag--info { background: #dbeafe; color: #1e40af; }

/* ---------- CONTENT ---------- */
.article__content {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.75;
  color: #1a1a2e;
}

.article__paragraph {
  margin-bottom: 12px;
}

.article__spacer {
  height: 8px;
}

/* ---------- SHARE ---------- */
.article__share {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 40px;
  padding-top: 28px;
  border-top: 1px solid #f0ebe3;
}

.article__share-label {
  font-size: 14px;
  font-weight: 600;
  color: #5a6170;
  margin-right: 4px;
}

.share-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1.5px solid #e8e0d4;
  border-radius: var(--radius-full);
  background: #ffffff;
  color: #5a6170;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: all var(--transition-fast);
}

.share-btn svg {
  width: 16px;
  height: 16px;
}

.share-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: #fef3e8;
}

.article__copied {
  margin-top: 12px;
  color: #059669;
  font-size: 14px;
  font-weight: 500;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ---------- NAV ---------- */
.article__nav {
  margin-top: 40px;
}

.article__nav-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 15px;
  color: var(--color-primary);
  text-decoration: none;
  transition: gap var(--transition-fast);
}

.article__nav-link svg {
  width: 18px;
  height: 18px;
}

.article__nav-link:hover {
  gap: 10px;
}

/* ---------- LOADING ---------- */
.loading-state {
  text-align: center;
  padding: 120px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #f0ebe3;
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ---------- ERROR ---------- */
.error-state {
  text-align: center;
  padding: 120px 20px;
}

.error-state__icon {
  font-size: 56px;
  margin-bottom: 16px;
}

.error-state__title {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 28px;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.error-state__desc {
  font-size: 16px;
  color: #94a3b8;
  margin-bottom: 28px;
}

/* ---------- RESPONSIVE ---------- */
@media (max-width: 768px) {
  .article__hero {
    height: 280px;
  }

  .article__hero-content {
    padding: 24px 20px;
  }

  .article__body {
    padding: 28px 16px 48px;
  }

  .article__share {
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .article__hero {
    height: 220px;
  }

  .article__body {
    padding: 20px 12px 40px;
  }
}
</style>
