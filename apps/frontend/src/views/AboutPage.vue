<template>
  <div class="about-page">
    <!-- Hero секция -->
    <section class="section about-hero">
      <div class="about-hero__bg">
        <img src="/images/about-bg.jpg" alt="" class="about-hero__bg-img">
        <div class="about-hero__overlay"></div>
        <div class="about-hero__gradient"></div>
        <div class="about-hero__particles">
          <span class="particle particle--1">🥖</span>
          <span class="particle particle--2">🥛</span>
          <span class="particle particle--3">🥕</span>
          <span class="particle particle--4">🌾</span>
          <span class="particle particle--5">✨</span>
          <span class="particle particle--6">🍯</span>
        </div>
        <div class="about-hero__pattern"></div>
      </div>
      <div class="container">
        <div class="about-hero__grid">
          <div class="about-hero__text">
            <div class="about-hero__badge">О нас</div>
            <h1 class="about-hero__title">Магазин <span class="text-accent">Славянка</span></h1>
            <p class="about-hero__lead">Ваш уютный продуктовый магазин в самом сердце деревни Курилово</p>
            <p class="about-hero__desc">Мы открылись с простой идеей: чтобы у каждого жителя всегда были свежие, качественные и доступные продукты. Без исключений.</p>
            <div class="about-hero__stats">
              <div class="hero-stat">
                <span class="hero-stat__value">{{ animatedYears }}+</span>
                <span class="hero-stat__label">лет работы</span>
              </div>
              <div class="hero-stat">
                <span class="hero-stat__value">{{ animatedProducts }}+</span>
                <span class="hero-stat__label">товаров</span>
              </div>
              <div class="hero-stat">
                <span class="hero-stat__value">7/7</span>
                <span class="hero-stat__label">дней в неделю</span>
              </div>
              <div class="hero-stat">
                <span class="hero-stat__value">{{ animatedClients }}+</span>
                <span class="hero-stat__label">клиентов</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Наша история (Timeline) -->
    <section class="section about-timeline">
      <div class="container">
        <h2 class="section-title">Наша история</h2>
        <div class="timeline">
          <div
            v-for="(event, index) in timelineEvents"
            :key="event.year"
            class="timeline-item"
            :class="{ 'timeline-item--right': index % 2 === 1 }"
          >
            <div class="timeline-dot">
              <span class="timeline-dot__inner">{{ event.icon }}</span>
            </div>
            <div class="timeline-card" @click="openTimelineModal(event)">
              <span class="timeline-card__year">{{ event.year }}</span>
              <h3 class="timeline-card__title">{{ event.title }}</h3>
              <p class="timeline-card__desc">{{ event.short }}</p>
              <span class="timeline-card__hint">Читать подробнее →</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Миссия — кликабельные карточки -->
    <section class="section about-mission">
      <div class="container">
        <h2 class="section-title">Наши ценности</h2>
        <p class="mission-subtitle">Нажмите на карточку, чтобы узнать подробнее</p>
        <div class="mission-grid">
          <div
            v-for="(value, index) in values"
            :key="value.id"
            class="mission-card"
            :style="{ animationDelay: `${0.06 + index * 0.06}s` }"
            :class="{ 'mission-card--active': selectedValue?.id === value.id }"
            @click="openValueModal(value)"
          >
            <div class="mission-card__icon-wrap">
              <span class="mission-card__icon">{{ value.icon }}</span>
            </div>
            <h3 class="mission-card__title">{{ value.title }}</h3>
            <p class="mission-card__text">{{ value.short }}</p>
            <span class="mission-card__hint">Нажмите для подробностей →</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Что у нас есть -->
    <section class="section about-products">
      <div class="container">
        <h2 class="section-title">Что у нас есть</h2>
        <p class="products-subtitle">Нажмите на категорию, чтобы посмотреть товары</p>
        <div class="products-grid">
          <router-link to="/catalog?category=bakery" class="product-feature product-feature--bakery">
            <div class="product-feature__bg"></div>
            <div class="product-feature__icon-wrap"><span class="product-feature__icon">🥖</span></div>
            <div class="product-feature__text">
              <h4 class="product-feature__name">Свежая выпечка</h4>
              <p class="product-feature__desc">Хлеб, булочки и батоны от местной пекарни — каждый день с пылу с жару</p>
              <span class="product-feature__hint">Смотреть товары →</span>
            </div>
          </router-link>
          <router-link to="/catalog?category=dairy" class="product-feature product-feature--dairy">
            <div class="product-feature__bg"></div>
            <div class="product-feature__icon-wrap"><span class="product-feature__icon">🥛</span></div>
            <div class="product-feature__text">
              <h4 class="product-feature__name">Молочная продукция</h4>
              <p class="product-feature__desc">Молоко, творог, сметана и яйца от фермеров из соседних хозяйств</p>
              <span class="product-feature__hint">Смотреть товары →</span>
            </div>
          </router-link>
          <router-link to="/catalog?category=vegetables" class="product-feature product-feature--veg">
            <div class="product-feature__bg"></div>
            <div class="product-feature__icon-wrap"><span class="product-feature__icon">🥕</span></div>
            <div class="product-feature__text">
              <h4 class="product-feature__name">Овощи и фрукты</h4>
              <p class="product-feature__desc">Сезонные овощи, свежие фрукты и зелень — всё самое полезное для вашего стола</p>
              <span class="product-feature__hint">Смотреть товары →</span>
            </div>
          </router-link>
          <router-link to="/catalog?category=household" class="product-feature product-feature--home">
            <div class="product-feature__bg"></div>
            <div class="product-feature__icon-wrap"><span class="product-feature__icon">🏠</span></div>
            <div class="product-feature__text">
              <h4 class="product-feature__name">Товары для дома</h4>
              <p class="product-feature__desc">Бытовая химия, чистящие средства, хозяйственные товары и всё для уюта</p>
              <span class="product-feature__hint">Смотреть товары →</span>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Контактный баннер -->
    <section class="section about-cta">
      <div class="container">
        <div class="cta-card">
          <div class="cta-card__bg">
            <div class="cta-card__circle cta-card__circle--1"></div>
            <div class="cta-card__circle cta-card__circle--2"></div>
            <div class="cta-card__circle cta-card__circle--3"></div>
          </div>
          <div class="cta-card__content">
            <div class="cta-card__icon">🏪</div>
            <h2 class="cta-card__title">Приходите в гости!</h2>
            <p class="cta-card__text">Мы всегда рады новым и постоянным покупателям. Заходите за свежими продуктами — мы работаем для вас без выходных.</p>
            <div class="cta-card__info">
              <span class="cta-card__info-item">
                <svg class="cta-card__info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Молодёжная ул., 1В, д. Курилово
              </span>
              <span class="cta-card__info-item">
                <svg class="cta-card__info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
                Ежедневно с 8:00 до 22:00
              </span>
            </div>
            <div class="cta-card__actions">
              <router-link to="/contacts" class="btn btn--primary">Посмотреть на карте</router-link>
              <router-link to="/catalog" class="btn btn--outline-white">Перейти в каталог</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Модальное окно истории -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedEvent" class="modal-overlay" @click.self="selectedEvent = null">
          <div class="modal-card" @click.stop>
            <button class="modal-close" @click="selectedEvent = null" aria-label="Закрыть">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            <div class="modal-event">
              <div class="modal-event__icon-wrap">
                <span class="modal-event__icon">{{ selectedEvent.icon }}</span>
              </div>
              <div class="modal-event__year">{{ selectedEvent.year }}</div>
              <h2 class="modal-event__title">{{ selectedEvent.title }}</h2>
              <p class="modal-event__detail">{{ selectedEvent.detail }}</p>
              <div class="modal-event__actions">
                <router-link to="/catalog" class="btn btn--primary" @click="selectedEvent = null">
                  Смотреть каталог
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Модальное окно ценности -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedValue" class="modal-overlay" @click.self="selectedValue = null">
          <div class="modal-card" @click.stop>
            <button class="modal-close" @click="selectedValue = null" aria-label="Закрыть">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            <div class="modal-value">
              <div class="modal-value__icon-ring">
                <span class="modal-value__icon">{{ selectedValue.icon }}</span>
              </div>
              <h2 class="modal-value__title">{{ selectedValue.title }}</h2>
              <p class="modal-value__detail">{{ selectedValue.detail }}</p>
              <div class="modal-value__actions">
                <router-link to="/catalog" class="btn btn--primary" @click="selectedValue = null">
                  Смотреть товары
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </router-link>
                <router-link to="/contacts" class="btn btn--outline" @click="selectedValue = null">
                  Связаться с нами
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface ValueItem {
  id: string;
  icon: string;
  title: string;
  short: string;
  detail: string;
}

interface TimelineEvent {
  year: string;
  icon: string;
  title: string;
  short: string;
  detail: string;
}

const selectedValue = ref<ValueItem | null>(null);
const selectedEvent = ref<TimelineEvent | null>(null);

// Анимация счётчиков
const animatedYears = ref(0);
const animatedProducts = ref(0);
const animatedClients = ref(0);
let animFrame: number | null = null;

function animateCounters() {
  if (animFrame) cancelAnimationFrame(animFrame);
  const duration = 1200;
  const start = performance.now();
  const targets = { years: 6, products: 500, clients: 2000 };

  function step(now: number) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    animatedYears.value = Math.round(targets.years * easeOut);
    animatedProducts.value = Math.round(targets.products * easeOut);
    animatedClients.value = Math.round(targets.clients * easeOut);
    if (progress < 1) {
      animFrame = requestAnimationFrame(step);
    }
  }
  animFrame = requestAnimationFrame(step);
}

onMounted(() => {
  animateCounters();
});

const values: ValueItem[] = [
  {
    id: 'quality',
    icon: '⭐',
    title: 'Качество',
    short: 'Тщательно отбираем поставщиков. Каждый продукт на полке — проверен. Свежесть гарантирована.',
    detail: 'Мы лично отбираем каждого поставщика. Хлеб — только от местной пекарни, которая работает уже 20 лет. Молоко и яйца — от проверенных фермеров из соседних хозяйств. Каждый продукт проходит контроль свежести перед тем, как попасть на полку. Мы не продаём то, что не купили бы сами. Если у вас есть сомнения — спросите, и мы расскажем, откуда приехал товар и когда он был произведён.',
  },
  {
    id: 'price',
    icon: '💰',
    title: 'Доступность',
    short: 'Честные цены без наценок. Продукты первой необходимости всегда в наличии по разумной стоимости.',
    detail: 'Мы верим, что качественные продукты должны быть доступны каждому. Никаких накруток и скрытых комиссий. Мы работаем напрямую с местными производителями, поэтому можем держать цены ниже, чем в сетевых магазинах. Сравните наши цены — вы удивитесь. А для пенсионеров и многодетных семей у нас всегда найдётся дополнительная скидка. Просто спросите на кассе.',
  },
  {
    id: 'care',
    icon: '🤝',
    title: 'Забота',
    short: 'Знаем каждого покупателя в лицо. Всегда поможем с выбором, подскажем и выслушаем.',
    detail: 'Для нас вы — не просто покупатель. Мы знаем ваши предпочтения, помним любимые продукты и всегда готовы помочь с выбором. Если нужного товара нет на полке — мы закажем его специально для вас к следующему дню. У нас можно оставить заявку на редкий продукт, и мы постараемся его найти. А если вы не можете прийти сами — позвоните, и мы организуем доставку по деревне.',
  },
];

const timelineEvents: TimelineEvent[] = [
  {
    year: '2018', icon: '🏪', title: 'Открытие магазина',
    short: 'Магазин "Славянка" распахнул свои двери для первых покупателей. Небольшой ассортимент, но только самые свежие продукты.',
    detail: 'В 2018 году мы открыли небольшой продуктовый магазин в самом центре деревни Курилово. На тот момент ассортимент был скромным — всего несколько десятков наименований: хлеб, молоко, крупы, консервы и сладости. Но мы сделали ставку на качество: каждый продукт проходил проверку, а хлеб мы возили из лучшей пекарни района. Первые покупатели оценили наш подход — свежесть продуктов и приветливое отношение. К концу года у нас появились первые постоянные клиенты, которые заходили каждый день. Мы запоминали их предпочтения и старались, чтобы нужные товары всегда были на полках.',
  },
  {
    year: '2022', icon: '🌾', title: 'Сотрудничество с фермерами',
    short: 'Начали прямые поставки от местных фермеров. Молоко, яйца, овощи и мясо — всё от производителей деревни Курилово.',
    detail: 'В 2022 году мы сделали важный шаг — начали прямые поставки от местных фермеров. Молоко и кисломолочные продукты теперь привозят с соседней фермы — всего 3 километра от магазина. Овощи и зелень поступают от хозяйства «Солнечная долина», которое использует только органические удобрения. Яйца — от кур, которые гуляют на свободном выгуле. Также мы начали сотрудничать с местной пасекой — мёд, воск и прополис теперь всегда в наличии. Покупатели сразу оценили разницу: домашние продукты оказались вкуснее и полезнее магазинных аналогов. Мы гордимся тем, что поддерживаем местных производителей.',
  },
  {
    year: '2025', icon: '📦', title: 'Расширение ассортимента',
    short: 'Добавили новые категории: товары для дома, консервацию и домашние заготовки. Ассортимент — более 100 наименований.',
    detail: 'К 2025 году мы значительно расширили ассортимент. По просьбам покупателей добавили категорию товаров для дома: моющие средства, губки, пакеты для мусора и другие хозяйственные мелочи. Также появился отдел домашних заготовок — варенье, компоты, соленья от местных производителей. Ассортимент — более 100 наименований. Мы заключили договоры с новыми поставщиками, что позволило снизить цены на многие товары. Несмотря на сложный год, мы не закрывались ни на день — работали стабильно, соблюдая все меры безопасности.',
  },
  {
    year: '2026', icon: '📱', title: 'Запуск онлайн-заказов',
    short: 'Теперь можно заказать продукты онлайн с доставкой по деревне. Мы стали ближе к каждому покупателю!',
    detail: 'В 2026 году мы запустили онлайн-заказы через наш сайт. Теперь жители Курилово и ближайших деревень могут заказать продукты не выходя из дома. Доставка работает ежедневно с 10:00 до 20:00. Минимальная сумма заказа — всего 300 рублей. Мы принимаем оплату наличными, картой или по QR-коду. Особенно удобно это для пожилых людей и молодых мам — им не нужно тратить время на поход в магазин. За первый месяц мы доставили более 200 заказов и получили много тёплых отзывов. Мы продолжаем развивать сервис и планируем расширить зону доставки.',
  },
];

function openValueModal(value: ValueItem) {
  selectedValue.value = value;
}

function openTimelineModal(event: TimelineEvent) {
  selectedEvent.value = event;
}
</script>

<style scoped>
/* ============================
   ABOUT PAGE — MODERN WHITE
   ============================ */
.about-page {
  position: relative;
  min-height: 100vh;
  background: #ffffff;
}

.section {
  position: relative;
  z-index: 1;
  padding: 80px 20px;
}

/* ============ Section Title ============ */
.section-title {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 40px;
  letter-spacing: -0.02em;
  color: #1a1a2e;
  text-align: center;
  margin-bottom: 48px;
  position: relative;
}

.section-title::after {
  content: '';
  display: block;
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-accent) 100%);
  margin: 16px auto 0;
  border-radius: var(--radius-full);
}

/* ============ Hero ============ */
.about-hero {
  background: linear-gradient(135deg, #fef3e8 0%, #ffedd5 30%, #fef3e8 60%, #fff7ed 100%);
  min-height: 520px;
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.about-hero__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.about-hero__bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.about-hero__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.55);
}

.about-hero__gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.2), transparent 50%);
}

.about-hero__pattern {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 25% 40%, rgba(211, 84, 0, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 75% 60%, rgba(243, 156, 18, 0.04) 0%, transparent 50%),
    radial-gradient(circle at 50% 85%, rgba(211, 84, 0, 0.04) 0%, transparent 50%);
}

.about-hero__particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  font-size: 30px;
  opacity: 0.2;
  animation: floatParticle 10s ease-in-out infinite;
}
.particle--1 { top: 12%; left: 8%; animation-delay: 0s; transform: rotate(-10deg); }
.particle--2 { top: 18%; right: 12%; animation-delay: 2s; font-size: 24px; }
.particle--3 { bottom: 22%; left: 10%; animation-delay: 4s; font-size: 26px; }
.particle--4 { bottom: 28%; right: 8%; animation-delay: 6s; font-size: 22px; }
.particle--5 { top: 45%; right: 5%; animation-delay: 1s; font-size: 20px; }
.particle--6 { bottom: 10%; left: 45%; animation-delay: 3s; }

@keyframes floatParticle {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
  50% { transform: translateY(-25px) rotate(12deg); opacity: 0.3; }
}

.about-hero__grid {
  max-width: 720px;
  width: 100%;
}

.about-hero__text {
  position: relative;
  z-index: 2;
  animation: fadeInUp 0.7s ease-out both;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

.about-hero__badge {
  display: inline-block;
  padding: 6px 16px;
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

.about-hero__title {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: clamp(36px, 5vw, 52px);
  color: #fff;
  margin-bottom: 20px;
  line-height: 1.15;
  text-shadow: 0 2px 12px rgba(0,0,0,0.3);
}

.text-accent {
  color: #fca5a5;
  font-family: var(--font-display);
}

.about-hero__lead {
  font-weight: 500;
  font-size: 20px;
  color: rgba(255,255,255,0.9);
  line-height: 1.5;
  margin-bottom: 16px;
  max-width: 540px;
  text-shadow: 0 1px 6px rgba(0,0,0,0.2);
}

.about-hero__desc {
  font-size: 16px;
  color: rgba(255,255,255,0.75);
  line-height: 1.7;
  margin-bottom: 36px;
  max-width: 520px;
  text-shadow: 0 1px 4px rgba(0,0,0,0.15);
}

.about-hero__stats {
  display: flex;
  gap: 36px;
}
.hero-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.hero-stat__value {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 34px;
  color: #fff;
  line-height: 1;
  margin-bottom: 4px;
  text-shadow: 0 1px 8px rgba(0,0,0,0.2);
}
.hero-stat__label {
  font-size: 12px;
  color: rgba(255,255,255,0.7);
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

/* ============ Timeline ============ */
.about-timeline {
  padding: 80px 20px 60px;
  background: #ffffff;
}

.timeline {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px 0;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, transparent, var(--color-primary-light), var(--color-primary), var(--color-primary-light), transparent);
  transform: translateX(-50%);
}

.timeline-item {
  position: relative;
  width: 50%;
  padding: 20px 40px 20px 0;
}

.timeline-item--right {
  margin-left: 50%;
  padding: 20px 0 20px 40px;
}

.timeline-dot {
  position: absolute;
  right: -16px;
  top: 28px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid var(--color-primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(211, 84, 0, 0.1);
}

.timeline-item--right .timeline-dot {
  right: auto;
  left: -16px;
}

.timeline-dot__inner {
  font-size: 14px;
}

.timeline-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #f0ebe3;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all var(--transition-normal);
  cursor: pointer;
}

.timeline-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  border-color: var(--color-primary-light);
  transform: translateY(-3px);
}

.timeline-card__year {
  display: inline-block;
  padding: 2px 12px;
  background: var(--color-primary-soft);
  color: var(--color-primary);
  border-radius: var(--radius-full);
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.timeline-card__title {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 18px;
  color: #1a1a2e;
  margin-bottom: 6px;
}

.timeline-card__desc {
  font-size: 14px;
  color: #5a6170;
  line-height: 1.55;
  margin-bottom: 8px;
}

.timeline-card__hint {
  display: inline-block;
  font-size: 12px;
  color: #94a3b8;
  font-weight: 600;
  opacity: 0;
  transform: translateY(4px);
  transition: all var(--transition-fast);
}

.timeline-card:hover .timeline-card__hint {
  opacity: 1;
  transform: translateY(0);
  color: var(--color-primary);
}

/* ============ Mission Cards ============ */
.about-mission {
  background: #ffffff;
  padding: 80px 20px;
}

.mission-subtitle {
  text-align: center;
  font-size: 14px;
  color: #94a3b8;
  margin-top: -28px;
  margin-bottom: 32px;
}

.mission-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 900px;
  margin: 0 auto;
}

.mission-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 40px 28px 28px;
  text-align: center;
  border: 1px solid #f0ebe3;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  transition: all var(--transition-bounce);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.mission-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.mission-card:hover::before {
  opacity: 1;
}

.mission-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
  border-color: var(--color-primary-light);
}

.mission-card__icon-wrap {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: linear-gradient(135deg, #fef3e8 0%, #ffedd5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  transition: transform var(--transition-bounce);
}

.mission-card:hover .mission-card__icon-wrap {
  transform: scale(1.1) rotate(-5deg);
}

.mission-card__icon { font-size: 34px; }
.mission-card__title {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 20px;
  color: #1a1a2e;
  margin-bottom: 10px;
}
.mission-card__text {
  font-size: 14px;
  line-height: 1.6;
  color: #5a6170;
  margin-bottom: 10px;
}
.mission-card__hint {
  display: inline-block;
  font-size: 12px;
  color: #94a3b8;
  opacity: 0;
  transform: translateY(4px);
  transition: all var(--transition-fast);
}
.mission-card:hover .mission-card__hint {
  opacity: 1;
  transform: translateY(0);
  color: var(--color-primary);
}

/* ============ Products ============ */
.about-products {
  background: #ffffff;
  padding: 80px 20px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.products-subtitle {
  text-align: center;
  font-size: 14px;
  color: #94a3b8;
  margin-top: -28px;
  margin-bottom: 32px;
}

.product-feature {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  background: #ffffff;
  border-radius: 18px;
  padding: 28px;
  border: 1px solid #f0ebe3;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  transition: all var(--transition-normal);
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

.product-feature__bg {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity var(--transition-normal);
  border-radius: 18px;
}

.product-feature--bakery .product-feature__bg { background: linear-gradient(135deg, #fef3e8 0%, transparent 60%); }
.product-feature--dairy .product-feature__bg { background: linear-gradient(135deg, #e0f2fe 0%, transparent 60%); }
.product-feature--veg .product-feature__bg { background: linear-gradient(135deg, #dcfce7 0%, transparent 60%); }
.product-feature--home .product-feature__bg { background: linear-gradient(135deg, #fef3c7 0%, transparent 60%); }

.product-feature:hover .product-feature__bg { opacity: 1; }
.product-feature:hover {
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.06);
  transform: translateY(-4px);
}

.product-feature__icon-wrap {
  width: 60px; height: 60px;
  border-radius: 16px;
  background: #fef3e8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  transition: transform var(--transition-bounce);
}

.product-feature--bakery .product-feature__icon-wrap { background: #fef3e8; }
.product-feature--dairy .product-feature__icon-wrap { background: #e0f2fe; }
.product-feature--veg .product-feature__icon-wrap { background: #dcfce7; }
.product-feature--home .product-feature__icon-wrap { background: #fef3c7; }

.product-feature:hover .product-feature__icon-wrap { transform: scale(1.12); }
.product-feature__icon { font-size: 28px; }

.product-feature__text { flex: 1; position: relative; z-index: 1; }
.product-feature__name {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 17px;
  color: #1a1a2e;
  margin-bottom: 6px;
}
.product-feature__desc {
  font-size: 13px;
  line-height: 1.5;
  color: #5a6170;
  margin-bottom: 6px;
}
.product-feature__hint {
  display: inline-block;
  font-size: 13px;
  color: var(--color-primary);
  font-weight: 600;
  opacity: 0;
  transform: translateY(4px);
  transition: all var(--transition-fast);
}
.product-feature:hover .product-feature__hint { opacity: 1; transform: translateY(0); }

/* ============ CTA Banner ============ */
.about-cta {
  padding-bottom: 100px;
  background: #ffffff;
}

.cta-card {
  background: linear-gradient(135deg, var(--color-primary) 0%, #a04000 50%, #872e00 100%);
  border-radius: 28px;
  padding: 56px 48px;
  text-align: center;
  color: #fff;
  box-shadow: 0 12px 48px rgba(211, 84, 0, 0.2);
  position: relative;
  overflow: hidden;
  max-width: 800px;
  margin: 0 auto;
}

.cta-card__bg { position: absolute; inset: 0; pointer-events: none; }

.cta-card__circle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
}

.cta-card__circle--1 { width: 300px; height: 300px; top: -80px; right: -60px; }
.cta-card__circle--2 { width: 200px; height: 200px; bottom: -50px; left: -40px; }
.cta-card__circle--3 {
  width: 120px; height: 120px; top: 50%; left: 20%;
  animation: pulseCircle 4s ease-in-out infinite;
}

@keyframes pulseCircle {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.3); opacity: 0.15; }
}

.cta-card__content { position: relative; z-index: 1; }
.cta-card__icon { font-size: 52px; margin-bottom: 12px; display: block; }
.cta-card__title {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 36px;
  margin-bottom: 12px;
}
.cta-card__text {
  font-size: 16px;
  opacity: 0.9;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto 24px;
}
.cta-card__info {
  display: flex;
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;
  font-size: 15px;
  opacity: 0.85;
  margin-bottom: 32px;
}
.cta-card__info-item { display: inline-flex; align-items: center; gap: 8px; }
.cta-card__info-icon { width: 18px; height: 18px; flex-shrink: 0; }
.cta-card__actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

/* ============ Buttons ============ */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 14px 32px;
  border-radius: var(--radius-full);
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 15px;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: all var(--transition-bounce);
}
.btn--primary { background: #fff; color: var(--color-primary); }
.btn--primary:hover { background: #fff5ed; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
.btn--outline-white {
  background: transparent;
  border: 2px solid rgba(255,255,255,0.35);
  color: #fff;
}
.btn--outline-white:hover { border-color: #fff; background: rgba(255,255,255,0.08); transform: translateY(-2px); }
.btn--outline { background: transparent; border: 1px solid #e8e0d4; color: #5a6170; }
.btn--outline:hover { border-color: var(--color-primary); color: var(--color-primary); }

/* ============ Modals ============ */
.modal-overlay {
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
.modal-card {
  background: #ffffff;
  border-radius: 24px;
  padding: 48px 40px 40px;
  width: 100%;
  max-width: 540px;
  position: relative;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.12);
  border: 1px solid #f0ebe3;
}
.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #f5f0e8;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #94a3b8;
  transition: all var(--transition-fast);
}
.modal-close:hover { background: var(--color-error); color: #fff; transform: scale(1.1); }

/* Modal for Timeline Event */
.modal-event { text-align: center; }
.modal-event__icon-wrap {
  width: 80px; height: 80px;
  border-radius: 24px;
  background: linear-gradient(135deg, #fef3e8 0%, #ffedd5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}
.modal-event__icon { font-size: 36px; }
.modal-event__year {
  display: inline-block;
  padding: 3px 14px;
  background: var(--color-primary-soft);
  color: var(--color-primary);
  border-radius: var(--radius-full);
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}
.modal-event__title {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 26px;
  color: #1a1a2e;
  margin-bottom: 16px;
}
.modal-event__detail {
  font-size: 15px;
  line-height: 1.8;
  color: #5a6170;
  text-align: left;
  margin-bottom: 28px;
  padding: 0 8px;
}
.modal-event__actions { display: flex; gap: 12px; justify-content: center; }
.modal-event__actions .btn--primary { background: var(--color-primary); color: #fff; }
.modal-event__actions .btn--primary:hover { background: var(--color-primary-dark); box-shadow: 0 8px 24px rgba(211, 84, 0, 0.25); }

/* Modal for Value */
.modal-value { text-align: center; }
.modal-value__icon-ring {
  width: 88px; height: 88px;
  border-radius: 24px;
  background: linear-gradient(135deg, #fef3e8 0%, #ffedd5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}
.modal-value__icon { font-size: 40px; }
.modal-value__title {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 28px;
  color: #1a1a2e;
  margin-bottom: 16px;
}
.modal-value__detail {
  font-size: 16px;
  line-height: 1.75;
  color: #5a6170;
  text-align: left;
  margin-bottom: 28px;
  padding: 0 16px;
}
.modal-value__actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
.modal-value__actions .btn--primary { background: var(--color-primary); color: #fff; }
.modal-value__actions .btn--primary:hover { background: var(--color-primary-dark); box-shadow: 0 8px 24px rgba(211, 84, 0, 0.25); }

/* Modal transitions */
.modal-enter-active, .modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-active .modal-card, .modal-leave-active .modal-card { transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-card { transform: scale(0.9) translateY(20px); }
.modal-leave-to .modal-card { transform: scale(0.9) translateY(20px); }

/* ============ Responsive ============ */
@media (max-width: 900px) {
  .about-hero__grid { text-align: center; }
  .about-hero__lead, .about-hero__desc { max-width: 100%; }
  .about-hero__stats { justify-content: center; }

  .mission-grid { grid-template-columns: 1fr; max-width: 400px; }
  .products-grid { grid-template-columns: 1fr; }

  .timeline::before { left: 20px; }
  .timeline-item { width: 100%; padding: 20px 0 20px 50px; }
  .timeline-item--right { margin-left: 0; padding: 20px 0 20px 50px; }
  .timeline-dot { right: auto; left: 4px; }
  .timeline-item--right .timeline-dot { left: 4px; }

  .cta-card { padding: 40px 24px; }
  .cta-card__title { font-size: 28px; }
  .cta-card__info { flex-direction: column; gap: 10px; align-items: center; }
  .modal-value__actions { flex-direction: column; align-items: center; }
  .modal-card { padding: 36px 24px 28px; }
}

@media (max-width: 480px) {
  .section { padding: 50px 16px; }
  .about-hero__stats { gap: 20px; flex-wrap: wrap; }
  .hero-stat__value { font-size: 26px; }
  .cta-card { padding: 32px 20px; }
  .modal-card { padding: 28px 18px 22px; }
  .modal-event__title { font-size: 22px; }
  .modal-value__title { font-size: 24px; }
  .modal-event__detail { font-size: 14px; }
  .modal-value__detail { font-size: 15px; padding: 0 8px; }
}
</style>
