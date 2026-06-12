<template>
  <div class="search-wrap" ref="searchRef">
    <!-- Поле поиска -->
    <div class="search-input-wrap" :class="{ focused: isFocused || query }">
      <svg class="search-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        v-model="query"
        @focus="isFocused = true"
        @input="onInput"
        @keydown.escape="closeResults"
        @keydown.down.prevent="highlightNext"
        @keydown.up.prevent="highlightPrev"
        @keydown.enter="goToHighlighted"
        type="text"
        placeholder="Поиск товаров..."
        maxlength="100"
        class="search-input"
      />
      <button v-if="query" @click="clearQuery" class="search-clear">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>

    <!-- Выпадающий список результатов -->
    <transition name="search-drop">
      <div v-if="showResults" class="search-results">
        <div v-if="loading" class="search-loading">
          <span class="search-spinner"></span>
          <span>Поиск...</span>
        </div>
        <template v-else-if="results.length > 0">
          <div
            v-for="(item, index) in results"
            :key="item.id"
            class="search-result-item"
            :class="{ highlighted: index === highlightedIndex }"
            @mouseenter="highlightedIndex = index"
            @mousedown.prevent="selectProduct(item)"
          >
            <img :src="item.imageUrl || '/images/products/placeholder.svg'" :alt="item.name" class="search-result-img">
            <div class="search-result-info">
              <span class="search-result-name" v-html="highlightText(item.name)"></span>
              <span class="search-result-price">{{ formatPrice(item.discountPrice || item.price) }}</span>
            </div>
          </div>
          <div class="search-result-all">
            <router-link :to="'/catalog?q=' + encodeURIComponent(query)" @click="closeResults" class="search-all-link">
              Все результаты для "{{ query }}"
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </router-link>
          </div>
        </template>
        <div v-else class="search-empty">
          <span>🔍</span>
          <span>Ничего не найдено</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick, inject } from 'vue';
import { useRouter } from 'vue-router';
import { productsApi } from '../../api/products.api';

const router = useRouter();
const openProductFromSearch = inject<(product: any) => void>('openProductFromSearch', (product: any) => {
  router.push(`/catalog?product=${product.id}`);
});
const searchRef = ref<HTMLElement | null>(null);
const query = ref('');
const isFocused = ref(false);
const showResults = ref(false);
const results = ref<any[]>([]);
const loading = ref(false);
const highlightedIndex = ref(-1);

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function formatPrice(p: number) { return `${p.toLocaleString('ru-RU')}₽`; }

function highlightText(text: string) {
  if (!query.value.trim()) return text;
  const regex = new RegExp(`(${query.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

function onInput() {
  if (debounceTimer) clearTimeout(debounceTimer);
  query.value = query.value.trim().slice(0, 100);
  if (!query.value) {
    results.value = [];
    showResults.value = false;
    return;
  }
  debounceTimer = setTimeout(async () => {
    loading.value = true;
    showResults.value = true;
    try {
      results.value = await productsApi.search(query.value);
      highlightedIndex.value = -1;
    } catch {
      results.value = [];
    }
    loading.value = false;
  }, 300);
}

function clearQuery() {
  query.value = '';
  results.value = [];
  showResults.value = false;
  isFocused.value = false;
}

function closeResults() {
  showResults.value = false;
  isFocused.value = false;
}

function highlightNext() {
  if (results.value.length === 0) return;
  highlightedIndex.value = (highlightedIndex.value + 1) % results.value.length;
}
function highlightPrev() {
  if (results.value.length === 0) return;
  highlightedIndex.value = highlightedIndex.value <= 0 ? results.value.length - 1 : highlightedIndex.value - 1;
}

function goToHighlighted() {
  if (highlightedIndex.value >= 0 && results.value[highlightedIndex.value]) {
    selectProduct(results.value[highlightedIndex.value]);
  } else {
    router.push('/catalog?q=' + encodeURIComponent(query.value));
    closeResults();
  }
}

function selectProduct(product: any) {
  openProductFromSearch(product);
  closeResults();
}

function handleClickOutside(e: MouseEvent) {
  if (searchRef.value && !searchRef.value.contains(e.target as Node)) {
    closeResults();
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
  if (debounceTimer) clearTimeout(debounceTimer);
});
</script>

<style scoped>
.search-wrap {
  position: relative;
  flex: 1;
  max-width: 520px;
  min-width: 180px;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  background: var(--color-border-light);
  border-radius: var(--radius-full);
  padding: 0 12px;
  border: 2px solid transparent;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.search-input-wrap:hover {
  background: var(--color-background);
  border-color: var(--color-border);
}

.search-input-wrap.focused {
  background: var(--color-surface);
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(211, 84, 0, 0.08), 0 4px 12px rgba(0,0,0,0.04);
}

.search-input-icon {
  flex-shrink: 0;
  color: var(--color-text-muted);
  margin-right: 8px;
  transition: color 0.2s;
}

.search-input-wrap.focused .search-input-icon {
  color: var(--color-primary);
}

.search-input {
  flex: 1;
  height: 42px;
  border: none;
  background: transparent;
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--color-text);
  outline: none;
}

.search-input::placeholder {
  color: var(--color-text-muted);
}

.search-clear {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-text-muted);
  transition: all 0.2s;
}

.search-clear:hover {
  background: var(--color-text-muted);
  color: var(--color-surface);
}

/* Dropdown */
.search-results {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: 0 12px 40px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.06);
  border: 1px solid var(--color-border);
  z-index: 2000;
  overflow: hidden;
  max-height: 420px;
  overflow-y: auto;
}

.search-drop-enter-active {
  animation: dropIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.search-drop-leave-active {
  animation: dropIn 0.15s cubic-bezier(0.4, 0, 0.2, 1) reverse;
}
@keyframes dropIn {
  from { opacity: 0; transform: translateY(-6px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.search-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px;
  justify-content: center;
  color: var(--color-text-muted);
  font-size: 14px;
}

.search-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.search-result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.15s;
}

.search-result-item:hover,
.search-result-item.highlighted {
  background: var(--color-primary-soft);
}

.search-result-img {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  object-fit: contain;
  background: #fff;
  border: 1px solid var(--color-border-light);
  flex-shrink: 0;
}

.search-result-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.search-result-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-result-name :deep(mark) {
  background: rgba(211, 84, 0, 0.15);
  color: var(--color-primary-dark);
  padding: 0 2px;
  border-radius: 2px;
}

.search-result-price {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary);
}

.search-result-all {
  border-top: 1px solid var(--color-border);
  padding: 10px 16px;
}

.search-all-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-primary);
  text-decoration: none;
  transition: gap 0.2s;
}

.search-all-link:hover { gap: 10px; }

.search-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  color: var(--color-text-muted);
  font-size: 14px;
}

@media (max-width: 768px) {
  .search-wrap {
    max-width: 100%;
  }
}
</style>