<template>
  <div id="app">
    <template v-if="!isAdminRoute">
      <AppHeader />
      <main id="main-content" class="main">
        <router-view v-slot="{ Component, route }">
          <transition name="page" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </main>
      <AppFooter />
      <ScrollToTop />
      <ProductModal :product="searchProduct" :is-open="searchModalOpen" @close="searchModalOpen = false" />
      <ChatWidget />
    </template>
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, provide } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from './stores/auth.store';
import { useChatStore } from './stores/chat.store';
import AppHeader from './components/layout/AppHeader.vue';
import AppFooter from './components/layout/AppFooter.vue';
import ScrollToTop from './components/ui/ScrollToTop.vue';
import ChatWidget from './components/chat/ChatWidget.vue';
import ProductModal from './components/product/ProductModal.vue';

const route = useRoute();
const authStore = useAuthStore();
const chatStore = useChatStore();

const isAdminRoute = computed(() => route.path.startsWith('/admin'));

// Модалка товара из поиска
const searchProduct = ref<any>(null);
const searchModalOpen = ref(false);

function openProductFromSearch(product: any) {
  searchProduct.value = product;
  searchModalOpen.value = true;
}
provide('openProductFromSearch', openProductFromSearch);

onMounted(async () => {
  if (authStore.token) {
    await authStore.fetchUser();
  }

  // Инициализируем чат в фоне для авторизованного пользователя
  // (чтобы polling работал и уведомления от админа доходили)
  chatStore.initSession();

  // Ripple effect на все кнопки
  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest('button, .btn, [data-ripple]');
    if (!target) return;
    const btn = target as HTMLElement;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});
</script>

<style>
/* Ripple effect global */
.ripple-effect {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  animation: ripple 0.6s ease-out;
  pointer-events: none;
  z-index: 10;
}
@keyframes ripple {
  from { transform: scale(0); opacity: 0.6; }
  to { transform: scale(4); opacity: 0; }
}

button, .btn, [data-ripple] {
  position: relative;
  overflow: hidden;
}
</style>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  padding-top: 80px;
}

@media (max-width: 768px) {
  .main { padding-top: 64px; }
}
@media (max-width: 480px) {
  .main { padding-top: 60px; }
}
</style>