<template>
  <div id="app">
    <AppHeader />
    <main class="main">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth.store';
import AppHeader from './components/layout/AppHeader.vue';
import AppFooter from './components/layout/AppFooter.vue';

const authStore = useAuthStore();

onMounted(async () => {
  // Загружаем данные пользователя если есть токен
  if (authStore.token) {
    await authStore.fetchUser();
  }
});
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  padding-top: 100px;
}
</style>