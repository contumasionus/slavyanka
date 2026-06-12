<template>
  <header class="header" :class="{ 'header--scrolled': scrolled }">
    <!-- Верхняя строка -->
    <div class="header__top">
      <div class="header__container">
        <!-- Логотип (два колоса + название) -->
        <router-link to="/" class="header__logo">
          <img src="/left.jpg" alt="Славянка" class="header__wheat header__wheat--left">
          <span class="header__name">Славянка</span>
          <img src="/right.jpg" alt="" class="header__wheat header__wheat--right" aria-hidden="true">
        </router-link>

        <!-- Поиск -->
        <SearchOverlay />

        <!-- Правая группа -->
        <div class="header__actions">
          <!-- Избранное -->
          <router-link to="/profile?tab=favorites" class="action-btn" title="Избранное">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <span v-if="favCount > 0" class="action-badge">{{ favCount }}</span>
          </router-link>

          <!-- Корзина -->
          <router-link to="/cart" class="action-btn" title="Корзина">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <span v-if="cartCount > 0" class="action-badge action-badge--cart">{{ cartCount }}</span>
          </router-link>

          <!-- Профиль: иконка + имя/Гость -->
          <div class="header__user">
            <button @click="toggleUserMenu" class="action-btn user-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span class="user-label">{{ authStore.isAuthenticated ? (authStore.user?.name || 'Профиль') : 'Гость' }}</span>
            </button>
            <!-- Дропдаун -->
            <transition name="dropdown">
              <div v-if="userMenuOpen" class="header__dropdown">
                <template v-if="authStore.isAuthenticated">
                  <div class="dropdown-userinfo">
                    <span class="dropdown-name">{{ authStore.user?.name }}</span>
                    <span class="dropdown-email">{{ authStore.user?.email }}</span>
                  </div>
                  <div class="dropdown-divider"></div>
                  <router-link to="/profile" class="dropdown-item" @click="closeUserMenu">Профиль</router-link>
                  <button @click="handleLogout" class="dropdown-item dropdown-item--danger">Выйти</button>
                </template>
                <template v-else>
                  <router-link to="/login" class="dropdown-item" @click="closeUserMenu">Войти</router-link>
                  <router-link to="/register" class="dropdown-item" @click="closeUserMenu">Регистрация</router-link>
                </template>
              </div>
            </transition>
          </div>

          <!-- Бургер -->
          <button class="header__burger" @click="mobileOpen = !mobileOpen" :class="{ active: mobileOpen }">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </div>

    <!-- Нижняя строка: навигация -->
    <nav class="header__nav">
      <div class="header__container header__nav-container">
        <!-- Каталог с выпадающим списком -->
        <div class="nav-drop" @mouseenter="catOpen = true" @mouseleave="catOpen = false">
          <router-link to="/catalog" class="nav-link" @click="catOpen = false">Каталог</router-link>
          <transition name="nav-dropdown">
            <div v-if="catOpen" class="nav-dropdown-menu">
              <router-link v-for="cat in categories" :key="cat.slug" :to="'/catalog?category=' + cat.slug" class="nav-dropdown-item" @click="catOpen = false">
                <span class="nav-drop-emoji">{{ cat.emoji }}</span>
                {{ cat.name }}
              </router-link>
            </div>
          </transition>
        </div>
        <router-link to="/promo" class="nav-link">Акции</router-link>
        <router-link to="/news" class="nav-link">Новости</router-link>
        <router-link to="/about" class="nav-link">О нас</router-link>
        <router-link to="/contacts" class="nav-link">Контакты</router-link>
      </div>
    </nav>

    <!-- Мобильное меню -->
    <transition name="mobile">
      <div v-if="mobileOpen" class="header__mobile">
        <div class="header__mobile-overlay" @click="mobileOpen = false"></div>
        <div class="header__mobile-panel">
          <div class="mobile-search"><SearchOverlay /></div>
          <router-link to="/catalog" class="mobile-link" @click="mobileOpen = false">Каталог</router-link>
          <router-link to="/promo" class="mobile-link" @click="mobileOpen = false">Акции</router-link>
          <router-link to="/news" class="mobile-link" @click="mobileOpen = false">Новости</router-link>
          <router-link to="/about" class="mobile-link" @click="mobileOpen = false">О нас</router-link>
          <router-link to="/contacts" class="mobile-link" @click="mobileOpen = false">Контакты</router-link>
          <div class="mobile-divider"></div>
          <template v-if="authStore.isAuthenticated">
            <router-link to="/profile" class="mobile-link" @click="mobileOpen = false">Профиль</router-link>
            <button @click="handleLogout" class="mobile-link mobile-link--danger">Выйти</button>
          </template>
          <template v-else>
            <router-link to="/login" class="mobile-link" @click="mobileOpen = false">Войти</router-link>
            <router-link to="/register" class="mobile-link" @click="mobileOpen = false">Регистрация</router-link>
          </template>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth.store';
import { useFavorites } from '../../stores/favorites.store';
import { useCart } from '../../stores/cart.store';
import SearchOverlay from './SearchOverlay.vue';

const router = useRouter();
const authStore = useAuthStore();
const { count: favCount } = useFavorites();
const { count: cartCount } = useCart();

const scrolled = ref(false);
const userMenuOpen = ref(false);
const mobileOpen = ref(false);
const catOpen = ref(false);

const categories = [
  { name: 'Выпечка', slug: 'bakery', emoji: '🥖' },
  { name: 'Молочка', slug: 'dairy', emoji: '🥛' },
  { name: 'Овощи', slug: 'vegetables', emoji: '🥕' },
  { name: 'Фрукты', slug: 'fruits', emoji: '🍎' },
  { name: 'Консервы', slug: 'conserves', emoji: '🥫' },
  { name: 'Соленья', slug: 'homemade', emoji: '🥒' },
  { name: 'Сладости', slug: 'sweets', emoji: '🍬' },
  { name: 'Напитки', slug: 'drinks', emoji: '🥤' },
  { name: 'Хозтовары', slug: 'household', emoji: '🏠' },
];

function toggleUserMenu() { userMenuOpen.value = !userMenuOpen.value; }
function closeUserMenu() { userMenuOpen.value = false; }
function handleLogout() { authStore.logout(); router.push('/'); closeUserMenu(); mobileOpen.value = false; }

function handleClickOutside(e: Event) {
  if (!(e.target as HTMLElement).closest('.header__user')) closeUserMenu();
}
function handleScroll() { scrolled.value = window.scrollY > 30; }

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* ============= HEADER ============= */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  border-bottom: 1px solid transparent;
  transition: background 0.6s ease, border-color 0.6s ease, box-shadow 0.6s ease;
}

.header--scrolled {
  background: rgba(255, 255, 255, 0.92);
  border-bottom-color: var(--color-border);
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}

.header__container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: center;
}

/* ============= Верхняя строка ============= */
.header__top {
  height: 64px;
  display: flex;
  align-items: center;
}
.header__top .header__container {
  gap: 24px;
  height: 100%;
}

/* Логотип — два колоса */
.header__logo {
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  flex-shrink: 0;
}
.header__wheat {
  width: 28px;
  height: 28px;
  filter: drop-shadow(0 2px 4px rgba(211,84,0,0.15));
  transition: transform 0.4s ease;
}
.header__wheat--left { transform-origin: bottom center; }
.header__wheat--right { transform-origin: bottom center; }
.header__logo:hover .header__wheat--left { transform: rotate(-12deg) scale(1.1); }
.header__logo:hover .header__wheat--right { transform: rotate(12deg) scale(1.1); }
.header__name {
  font-family: var(--font-display);
  font-size: 22px;
  color: var(--color-primary);
  line-height: 1;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

/* ============= Правая группа ============= */
.header__actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.action-btn {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 40px;
  padding: 0 10px;
  border-radius: var(--radius-md);
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  text-decoration: none;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.action-btn:hover {
  background: var(--color-border-light);
  color: var(--color-primary);
  transform: translateY(-1px);
}

.action-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 18px;
  height: 18px;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  box-shadow: 0 2px 6px rgba(211,84,0,0.35);
  animation: badgePop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.action-badge--cart { background: var(--color-accent); box-shadow: 0 2px 6px rgba(243,156,18,0.35); }

@keyframes badgePop {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

/* Профиль с именем */
.user-btn { gap: 6px; }
.user-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
  max-width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.action-btn:hover .user-label { color: var(--color-primary); }

/* User dropdown */
.header__user { position: relative; }
.header__dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--color-border);
  min-width: 200px;
  z-index: 1001;
  overflow: hidden;
  padding: 6px;
}
.dropdown-userinfo { padding: 10px 12px; display: flex; flex-direction: column; gap: 2px; }
.dropdown-name { font-weight: 600; font-size: 14px; color: var(--color-text); }
.dropdown-email { font-size: 12px; color: var(--color-text-muted); }
.dropdown-divider { height: 1px; background: var(--color-border); margin: 4px 0; }
.dropdown-item {
  display: block;
  width: 100%;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  color: var(--color-text);
  text-decoration: none;
  transition: background 0.15s;
  border: none;
  background: none;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
}
.dropdown-item:hover { background: var(--color-border-light); }
.dropdown-item--danger { color: var(--color-error); }
.dropdown-item--danger:hover { background: #fef2f2; }

.dropdown-enter-active { animation: dropIn 0.2s ease; }
.dropdown-leave-active { animation: dropIn 0.15s ease reverse; }
@keyframes dropIn {
  from { opacity: 0; transform: translateY(-6px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* Burger */
.header__burger {
  display: none;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 4px;
}
.header__burger span {
  display: block;
  width: 20px;
  height: 2.5px;
  background: var(--color-text);
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: center;
}
.header__burger.active span:nth-child(1) { transform: rotate(45deg) translate(4px, 4px); }
.header__burger.active span:nth-child(2) { opacity: 0; }
.header__burger.active span:nth-child(3) { transform: rotate(-45deg) translate(4px, -4px); }

/* ============= Нижняя навигация ============= */
.header__nav {
  height: 40px;
  display: flex;
  align-items: center;
  border-top: 1px solid var(--color-border);
}
.header__nav-container { gap: 32px; height: 100%; justify-content: center; }
.nav-link {
  font-family: var(--font-heading);
  font-weight: 500;
  font-size: 14px;
  color: var(--color-text-secondary);
  text-decoration: none;
  white-space: nowrap;
  padding: 8px 0;
  position: relative;
  transition: color 0.2s;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--color-primary);
  border-radius: 2px;
  transition: all 0.3s ease;
}
.nav-link:hover { color: var(--color-primary); }
.nav-link:hover::after { width: 100%; left: 0; }
.nav-link.router-link-active { color: var(--color-primary); }
.nav-link.router-link-active::after { width: 100%; left: 0; }

/* Выпадающий список категорий */
.nav-drop {
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
}
.nav-dropdown-menu {
  position: absolute;
  top: 100%;
  left: -12px;
  min-width: 200px;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: 0 16px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06);
  border: 1px solid var(--color-border);
  padding: 6px;
  z-index: 1001;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
}
.nav-dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text);
  text-decoration: none;
  transition: background 0.15s;
  white-space: nowrap;
}
.nav-dropdown-item:hover { background: var(--color-primary-soft); color: var(--color-primary-dark); }
.nav-drop-emoji { font-size: 16px; }

.nav-dropdown-enter-active { animation: ddIn 0.2s ease; }
.nav-dropdown-leave-active { animation: ddIn 0.15s ease reverse; }
@keyframes ddIn {
  from { opacity: 0; transform: translateY(-6px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* ============= Mobile ============= */
.header__mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.4);
  backdrop-filter: blur(4px);
  z-index: 999;
}
.header__mobile-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 320px;
  height: 100vh;
  background: var(--color-surface);
  z-index: 1000;
  padding: 24px;
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.mobile-search { margin-bottom: 16px; }
.mobile-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 12px;
  border-radius: var(--radius-md);
  font-family: var(--font-heading);
  font-weight: 500;
  font-size: 16px;
  color: var(--color-text);
  text-decoration: none;
  transition: background 0.15s;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  width: 100%;
}
.mobile-link:hover { background: var(--color-border-light); }
.mobile-link--danger { color: var(--color-error); }
.mobile-divider { height: 1px; background: var(--color-border); margin: 8px 0; }

.mobile-enter-active .header__mobile-panel { animation: slideIn 0.3s ease; }
.mobile-leave-active .header__mobile-panel { animation: slideIn 0.25s ease reverse; }
@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
.mobile-enter-active .header__mobile-overlay { animation: fadeIn 0.3s ease; }
.mobile-leave-active .header__mobile-overlay { animation: fadeIn 0.25s ease reverse; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

/* ============= Responsive ============= */
@media (max-width: 992px) {
  .header__top .header__container { gap: 12px; padding: 0 16px; }
  .header__actions { gap: 4px; }
  .action-btn { padding: 0 6px; }
  .user-btn .user-label { display: none; }
}

@media (max-width: 768px) {
  .header__top { height: 56px; }
  .header__top .header__container { gap: 8px; padding: 0 12px; }
  .header__name { font-size: 18px; }
  .header__wheat { width: 24px; height: 24px; }
  .header__logo { margin-right: auto; }
  .action-btn { height: 36px; padding: 0 6px; }
  .header__top .search-wrap { display: none; }
  .header__nav { display: none; }
  .header__burger { display: flex; }
}

@media (max-width: 480px) {
  .header__top .header__container { padding: 0 8px; }
  .header__actions { gap: 2px; }
}
</style>