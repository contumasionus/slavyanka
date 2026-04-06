<template>
  <header class="header">
    <div class="header__container">
      <nav class="header__nav-left">
        <router-link to="/" class="header__link">Главная</router-link>
        <span class="header__divider">|</span>
        <router-link to="/catalog" class="header__link">Каталог</router-link>
      </nav>
      
      <div class="header__logo">
        <img src="/left.jpg" alt="Колос" class="header__wheat header__wheat--left">
        <div class="header__logo-text">
          <h1 class="header__title">Славянка</h1>
          <span class="header__subtitle">Продуктовый магазин</span>
        </div>
        <img src="/right.jpg" alt="Колос" class="header__wheat header__wheat--right">
      </div>
      
      <nav class="header__nav-right">
        <router-link to="/about" class="header__link">О нас</router-link>
        <span class="header__divider">|</span>
        <router-link to="/contacts" class="header__link">Контакты</router-link>
        <span class="header__divider">|</span>
        <div class="header__user-menu">
          <button @click="toggleUserMenu" class="header__user-btn" title="Аккаунт">
            <span class="header__user-icon">👤</span>
          </button>
          <div v-if="userMenuOpen" class="header__dropdown">
            <template v-if="authStore.isAuthenticated">
              <router-link to="/profile" class="header__dropdown-item" @click="closeUserMenu">
                <span class="header__dropdown-icon">👤</span>
                Профиль
              </router-link>
              <button @click="handleLogout" class="header__dropdown-item header__dropdown-logout">
                <span class="header__dropdown-icon">🚪</span>
                Выйти
              </button>
            </template>
            <template v-else>
              <router-link to="/login" class="header__dropdown-item" @click="closeUserMenu">
                <span class="header__dropdown-icon">🔑</span>
                Войти
              </router-link>
              <router-link to="/register" class="header__dropdown-item" @click="closeUserMenu">
                <span class="header__dropdown-icon">👤</span>
                Регистрация
              </router-link>
            </template>
          </div>
        </div>
      </nav>
      
      <button class="header__menu-btn" @click="toggleMenu" aria-label="Меню">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
    <nav v-if="menuOpen" class="header__mobile-nav">
      <router-link to="/" class="header__mobile-link" @click="closeMenu">Главная</router-link>
      <router-link to="/catalog" class="header__mobile-link" @click="closeMenu">Каталог</router-link>
      <router-link to="/about" class="header__mobile-link" @click="closeMenu">О нас</router-link>
      <router-link to="/contacts" class="header__mobile-link" @click="closeMenu">Контакты</router-link>
      <template v-if="authStore.isAuthenticated">
        <router-link to="/profile" class="header__mobile-link header__mobile-link--icon" @click="closeMenu">
          <span class="header__mobile-icon">👤</span>
          <span>Профиль</span>
        </router-link>
        <button @click="handleLogout" class="header__mobile-link header__mobile-link--icon header__logout-btn">
          <span class="header__mobile-icon">🚪</span>
          <span>Выйти</span>
        </button>
      </template>
      <template v-else>
        <router-link to="/login" class="header__mobile-link header__mobile-link--icon" @click="closeMenu">
          <span class="header__mobile-icon">🔑</span>
          <span>Войти</span>
        </router-link>
        <router-link to="/register" class="header__mobile-link header__mobile-link--icon" @click="closeMenu">
          <span class="header__mobile-icon">👤</span>
          <span>Регистрация</span>
        </router-link>
      </template>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();
const menuOpen = ref(false);
const userMenuOpen = ref(false);

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

function closeMenu() {
  menuOpen.value = false;
}

function toggleUserMenu() {
  userMenuOpen.value = !userMenuOpen.value;
}

function closeUserMenu() {
  userMenuOpen.value = false;
}

function handleLogout() {
  authStore.logout();
  router.push('/');
  closeMenu();
  closeUserMenu();
}

function handleClickOutside(event: Event) {
  const target = event.target as HTMLElement;
  if (!target.closest('.header__user-menu')) {
    closeUserMenu();
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: var(--color-primary);
  z-index: 1000;
}

.header__container {
  max-width: 1920px;
  margin: 0 auto;
  height: 85px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 50px;
}

.header__logo {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header__wheat {
  width: 60px;
  height: 60px;
}

.header__wheat--right {
  /* Removed transform to show original image */
}

.header__logo-text {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header__title {
  font-family: var(--font-kurale);
  font-size: 56px;
  color: var(--color-white);
  line-height: 1.1;
  text-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  margin: 0;
}

.header__subtitle {
  font-family: var(--font-kurale);
  font-size: 18px;
  color: var(--color-white);
  display: block;
  margin-top: 0;
}

.header__nav-left {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-right: auto;
  padding-left: 30px;
}

.header__nav-right {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-left: auto;
  padding-right: 30px;
}

.header__link {
  font-family: var(--font-oswald);
  font-weight: 400;
  font-size: 24px;
  color: var(--color-white);
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  transition: opacity 0.3s;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
}

.header__link:hover {
  opacity: 0.8;
}

.header__link.router-link-active {
  text-decoration: underline;
}

.header__link--icon {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 24px;
}

.header__icon {
  font-size: 20px;
}

.header__link-text {
  font-size: 24px;
}

.header__logout-btn {
  font-family: var(--font-oswald);
  font-weight: 400;
  font-size: 36px;
  color: var(--color-white);
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.header__logout-btn:hover {
  opacity: 0.8;
}

.header__divider {
  font-family: var(--font-oswald);
  font-size: 24px;
  color: var(--color-white);
  opacity: 0.5;
}

.header__user-menu {
  position: relative;
}

.header__user-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.header__user-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.header__user-icon {
  font-size: 24px;
  display: block;
}

.header__dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: var(--color-white);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 160px;
  z-index: 1001;
  overflow: hidden;
}

.header__dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  color: var(--color-text);
  text-decoration: none;
  transition: background-color 0.3s;
  border: none;
  background: none;
  width: 100%;
  cursor: pointer;
  font-family: var(--font-inter);
  font-size: 14px;
}

.header__dropdown-item:hover {
  background-color: var(--color-background);
}

.header__dropdown-icon {
  font-size: 16px;
}

.header__dropdown-logout {
  color: #e74c3c;
}

.header__dropdown-logout:hover {
  background-color: #ffeaea;
}

.header__menu-btn {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
}

.header__menu-btn span {
  width: 30px;
  height: 3px;
  background-color: var(--color-white);
  border-radius: 2px;
}

.header__mobile-nav {
  display: none;
  flex-direction: column;
  padding: 20px;
  background-color: var(--color-primary);
}

.header__mobile-link {
  font-family: var(--font-oswald);
  font-weight: 700;
  font-size: 24px;
  color: var(--color-white);
  padding: 15px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
}

.header__mobile-link:hover {
  opacity: 0.8;
}

.header__mobile-link--icon {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header__mobile-icon {
  font-size: 20px;
}


@media (max-width: 1200px) {
  .header__container {
    padding: 0 30px;
    height: 80px;
  }
  
  .header__title {
    font-size: 46px;
  }
  
  .header__subtitle {
    font-size: 15px;
  }
  
  .header__link {
    font-size: 20px;
  }
  
  .header__divider {
    font-size: 20px;
  }
  
  .header__nav-left {
    gap: 20px;
    margin-right: auto;
  }
  
  .header__nav-right {
    gap: 20px;
    margin-left: auto;
  }
}

@media (max-width: 768px) {
  .header__container {
    height: 72px;
    padding: 0 20px;
  }
  
  .header__wheat {
    width: 45px;
    height: 45px;
  }
  
  .header__title {
    font-size: 36px;
  }
  
  .header__subtitle {
    font-size: 13px;
  }
  
  .header__nav-left,
  .header__nav-right {
    display: none;
  }
  
  .header__menu-btn {
    display: flex;
  }
  
  .header__mobile-nav {
    display: flex;
  }
}

@media (max-width: 480px) {
  .header__container {
    height: 65px;
    padding: 0 15px;
  }
  
  .header__wheat {
    width: 35px;
    height: 35px;
  }
  
  .header__title {
    font-size: 28px;
  }
  
  .header__subtitle {
    font-size: 11px;
  }
}
</style>