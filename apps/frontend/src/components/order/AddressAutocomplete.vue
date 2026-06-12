<template>
  <div class="address-autocomplete">
    <!-- Поле выбора населённого пункта -->
    <div class="settlement-field" ref="fieldRef">
      <template v-if="selectedSettlement">
        <div class="selected-settlement-wrapper">
          <div class="selected-settlement">
            <span class="settlement-text">{{ selectedSettlement.name }}</span>
            <button class="edit-btn" @click="clearSettlement" type="button" aria-label="Изменить населенный пункт">
              ✕ Изменить
            </button>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="settlement-input-wrap">
          <input
            v-model="query"
            @focus="isOpen = true"
            @input="onQueryInput"
            @keydown.down.prevent="highlightNext"
            @keydown.up.prevent="highlightPrev"
            @keydown.enter.prevent="selectHighlighted"
            @keydown.esc="isOpen = false"
            placeholder="Населенный пункт *"
            class="settlement-input"
            autocomplete="off"
          />
        </div>
      </template>

      <!-- Выпадающий список -->
      <transition name="dropdown">
        <ul v-if="isOpen && filtered.length > 0" class="settlement-dropdown">
          <li
            v-for="(s, i) in filtered"
            :key="s.name"
            @mousedown.prevent="selectSettlement(s)"
            @mouseenter="highlightIndex = i"
            class="settlement-dropdown__item"
            :class="{ 'settlement-dropdown__item--active': i === highlightIndex }"
          >
            <span class="settlement-dropdown__name">{{ s.name }}</span>
            <span class="settlement-dropdown__type">{{ typeLabel(s.type) }}</span>
          </li>
        </ul>
      </transition>
    </div>

    <!-- Детальная форма (только после выбора населённого пункта) -->
    <transition name="slide-details">
      <div v-if="selectedSettlement" class="address-details">
        <div class="address-details__field address-details__field--wide">
          <label class="address-details__label">Улица *</label>
          <input v-model="street" type="text" class="address-details__input" placeholder="ул. Молодежная" />
        </div>
        <div class="address-details__row">
          <div class="address-details__field">
            <label class="address-details__label">Дом *</label>
            <input v-model="house" type="text" class="address-details__input" placeholder="5" />
          </div>
          <div class="address-details__field">
            <label class="address-details__label">Подъезд</label>
            <input v-model="entrance" type="text" class="address-details__input" placeholder="—" />
          </div>
          <div class="address-details__field">
            <label class="address-details__label">Кв./Офис</label>
            <input v-model="apartment" type="text" class="address-details__input" placeholder="—" />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { nearbySettlements, type Settlement } from '../../data/nearbySettlements';

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const props = defineProps<{
  modelValue: string;
}>();

// Состояние
const query = ref('');
const isOpen = ref(false);
const highlightIndex = ref(0);
const selectedSettlement = ref<Settlement | null>(null);
const street = ref('');
const house = ref('');
const entrance = ref('');
const apartment = ref('');

// Фильтрация
const filtered = computed(() => {
  if (!query.value) return nearbySettlements;
  const q = query.value.toLowerCase().replace(/^[дсгп]\s*\.?\s*/, '');
  return nearbySettlements.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.name.toLowerCase().replace(/^[дсгп]\s*\.?\s*/, '').includes(q)
  );
});

// Тип населённого пункта по-русски
function typeLabel(type: string): string {
  const map: Record<string, string> = {
    village: 'деревня',
    selo: 'село',
    city: 'город',
    settlement: 'посёлок',
  };
  return map[type] || type;
}

// Выбор
function selectSettlement(s: Settlement) {
  selectedSettlement.value = s;
  query.value = s.name;
  isOpen.value = false;
  highlightIndex.value = 0;
  emitAddress();
}

// Очистка
function clearSettlement() {
  selectedSettlement.value = null;
  query.value = '';
  street.value = '';
  house.value = '';
  entrance.value = '';
  apartment.value = '';
  isOpen.value = true;
  emitAddress();
}

// Клавиши
function selectHighlighted() {
  if (filtered.value[highlightIndex.value]) {
    selectSettlement(filtered.value[highlightIndex.value]);
  }
}
function highlightNext() {
  if (highlightIndex.value < filtered.value.length - 1) highlightIndex.value++;
}
function highlightPrev() {
  if (highlightIndex.value > 0) highlightIndex.value--;
}

function onQueryInput() {
  isOpen.value = true;
  highlightIndex.value = 0;
}

// Сборка адреса
function buildAddress(): string {
  if (!selectedSettlement.value) return '';
  const parts: string[] = [selectedSettlement.value.name];
  if (street.value) parts.push(`ул. ${street.value.replace(/^(ул\.?\s*)/i, '')}`);
  if (house.value) parts.push(`д. ${house.value}`);
  if (entrance.value) parts.push(`под. ${entrance.value}`);
  if (apartment.value) parts.push(`кв. ${apartment.value}`);
  return parts.join(', ');
}

watch([street, house, entrance, apartment], () => {
  emitAddress();
});

function emitAddress() {
  emit('update:modelValue', buildAddress());
}

// Если modelValue уже есть (например при редактировании), пытаемся разобрать
watch(() => props.modelValue, (val) => {
  if (val && !selectedSettlement.value) {
    // Простая попытка парсинга — можно доработать при необходимости
  }
}, { immediate: true });
</script>

<style scoped>
.address-autocomplete {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ─── Поле населённого пункта ─── */
.settlement-field {
  position: relative;
  width: 100%;
}

.settlement-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.settlement-input {
  width: 100%;
  padding: 18px 16px 6px;
  border: 1px solid var(--color-border, #e0d6cc);
  border-radius: 12px;
  font-size: 15px;
  background: var(--color-background, #FDF8F3);
  color: var(--color-text, #2c2c2c);
  transition: all 0.2s ease;
  font-family: inherit;
}

.settlement-input:focus {
  outline: none;
  border-color: #E67E22;
  box-shadow: 0 0 0 3px rgba(230, 126, 34, 0.12);
}

.settlement-input::placeholder {
  color: var(--color-text-muted, #a0978f);
}

/* Выбранный населённый пункт */
.selected-settlement-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 16px;
  border: 1px solid #E67E22;
  border-radius: 12px;
  background: rgba(230, 126, 34, 0.04);
}

.selected-settlement {
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
}

.settlement-text {
  flex: 1;
  text-align: center;
  font-weight: 500;
  font-size: 15px;
  color: #1A1A2E;
}

.edit-btn {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-text-muted, #a0978f);
  font-size: 12px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 8px;
  transition: all 0.15s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 4px;
}

.edit-btn:hover {
  color: #E67E22;
  background: rgba(230, 126, 34, 0.08);
}

/* ─── Выпадающий список ─── */
.settlement-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border: 1px solid var(--color-border, #e0d6cc);
  max-height: 260px;
  overflow-y: auto;
  z-index: 10;
  list-style: none;
  margin: 0;
  padding: 4px;
}

.settlement-dropdown__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.12s ease;
}

.settlement-dropdown__item:hover,
.settlement-dropdown__item--active {
  background: #FFF5EB;
}

.settlement-dropdown__name {
  font-family: var(--font-heading, inherit);
  font-weight: 600;
  font-size: 14px;
  color: var(--color-text, #2c2c2c);
}

.settlement-dropdown__type {
  font-size: 11px;
  color: var(--color-text-muted, #a0978f);
  background: var(--color-border-light, #f0ebe5);
  padding: 2px 8px;
  border-radius: 6px;
}

/* ─── Детальная форма ─── */
.address-details {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.address-details__field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.address-details__field--wide {
  flex: 0 0 auto;
}

.address-details__label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary, #6b5f55);
  padding-left: 2px;
}

.address-details__input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--color-border, #e0d6cc);
  border-radius: 10px;
  font-size: 14px;
  background: var(--color-background, #FDF8F3);
  color: var(--color-text, #2c2c2c);
  transition: all 0.2s ease;
  font-family: inherit;
  box-sizing: border-box;
}

.address-details__input:focus {
  outline: none;
  border-color: #E67E22;
  box-shadow: 0 0 0 3px rgba(230, 126, 34, 0.12);
}

.address-details__input::placeholder {
  color: var(--color-text-muted, #a0978f);
}

.address-details__row {
  display: flex;
  gap: 10px;
}

/* ─── Анимации ─── */
.dropdown-enter-active {
  animation: dropFadeIn 0.15s ease;
}
.dropdown-leave-active {
  animation: dropFadeIn 0.1s ease reverse;
}
@keyframes dropFadeIn {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}

.slide-details-enter-active {
  animation: slideDown 0.25s ease;
  overflow: hidden;
}
.slide-details-leave-active {
  animation: slideDown 0.2s ease reverse;
  overflow: hidden;
}
@keyframes slideDown {
  from { opacity: 0; max-height: 0; margin-top: 0; }
  to { opacity: 1; max-height: 300px; margin-top: 12px; }
}

/* ─── Responsive ─── */
@media (max-width: 768px) {
  .address-details__row {
    flex-direction: column;
    gap: 10px;
  }
}
</style>