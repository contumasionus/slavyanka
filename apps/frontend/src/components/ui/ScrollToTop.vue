<template>
  <button class="scroll-to-top" :class="{ 'scroll-to-top--visible': show }" @click="scrollToTop" aria-label="Наверх">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const show = ref(false);

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleScroll() {
  show.value = window.scrollY > 400;
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.scroll-to-top {
  position: fixed;
  bottom: 80px;
  right: 100px;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background: var(--color-white);
  color: var(--color-primary);
  border: 1px solid var(--color-border);
  font-size: 20px;
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
  transform: translateY(16px);
  transition: all var(--transition-bounce);
  z-index: 999;
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
}

.scroll-to-top--visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.scroll-to-top:hover {
  background: var(--color-primary);
  color: var(--color-white);
  border-color: var(--color-primary);
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

@media (max-width: 480px) {
  .scroll-to-top {
    bottom: 80px;
    right: 90px;
    width: 44px;
    height: 44px;
  }
}
</style>