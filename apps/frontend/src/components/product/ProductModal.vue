<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click="closeModal">
        <div class="modal-container" @click.stop>
          <button class="modal-close" @click="closeModal" aria-label="Закрыть">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          
          <div class="modal-content">
            <div class="modal-image-section">
              <div class="modal-image-wrapper">
                <img :src="product?.imageUrl || '/images/products/placeholder.svg'" :alt="product?.name" class="modal-image">
              </div>
            </div>
            
            <div class="modal-info-section">
              <h2 class="modal-title">{{ product?.name }}</h2>
              
              <div class="modal-price">{{ formatPrice(product?.price || 0) }}</div>
              
              <div class="modal-description">
                <h3>Описание</h3>
                <p>{{ product?.description || 'Вкусный и качественный продукт от лучших производителей.' }}</p>
              </div>
              
              <div class="modal-nutrition">
                <h3>Пищевая ценность (на 100г)</h3>
                <div class="nutrition-grid">
                  <div class="nutrition-item">
                    <span class="nutrition-label">Калории</span>
                    <span class="nutrition-value">{{ product?.calories || '120' }} ккал</span>
                  </div>
                  <div class="nutrition-item">
                    <span class="nutrition-label">Белки</span>
                    <span class="nutrition-value">{{ product?.proteins || '5.2' }}г</span>
                  </div>
                  <div class="nutrition-item">
                    <span class="nutrition-label">Жиры</span>
                    <span class="nutrition-value">{{ product?.fats || '3.8' }}г</span>
                  </div>
                  <div class="nutrition-item">
                    <span class="nutrition-label">Углеводы</span>
                    <span class="nutrition-value">{{ product?.carbohydrates || '15.6' }}г</span>
                  </div>
                </div>
              </div>
              
              <div class="modal-stock">
                <div class="stock-indicator" :class="{ 'low-stock': !product?.inStock }">
                  <span class="stock-icon">📦</span>
                  <span class="stock-text">
                    {{ product?.inStock ? 'Товар в наличии' : 'Товар временно отсутствует' }}
                    <template v-if="!product?.inStock && product?.deliveryDate">
                      <br>Ожидается: {{ formatDate(product.deliveryDate) }}
                    </template>
                  </span>
                </div>
                
                <button 
                  v-if="!product?.inStock && authStore.isAuthenticated"
                  @click="handleNotificationClick"
                  class="modal-notify-btn"
                  :class="{ 'subscribed': isSubscribed }"
                >
                  {{ isSubscribed ? '✓ Подписка оформлена' : 'Сообщить когда появится' }}
                </button>
              </div>
              
              <div class="modal-weight" v-if="product?.weight">
                <span class="weight-label">Вес/объем:</span>
                <span class="weight-value">{{ product.weight }}</span>
              </div>
              
              <div class="modal-manufacturer" v-if="product?.manufacturer">
                <span class="manufacturer-label">Производитель:</span>
                <span class="manufacturer-value">{{ product.manufacturer }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useAuthStore } from '../../stores/auth.store';
import { notificationsApi } from '../../api/notifications.api';

interface CatalogProduct {
  id: string;
  name: string;
  price: number;
  weight?: string;
  calories?: number;
  proteins?: number;
  fats?: number;
  carbohydrates?: number;
  manufacturer?: string;
  description?: string;
  imageUrl?: string;
  inStock: boolean;
  deliveryDate?: string;
}

const props = defineProps<{
  product: CatalogProduct | null;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const authStore = useAuthStore();
const isSubscribed = ref(false);

watch(() => props.product, async (newProduct) => {
  if (newProduct && authStore.isAuthenticated && !newProduct.inStock) {
    try {
      const result = await notificationsApi.checkSubscription(newProduct.id.toString());
      isSubscribed.value = result.isSubscribed;
    } catch (error) {
      console.error('Failed to check subscription:', error);
    }
  }
}, { immediate: true });

function formatPrice(price: number): string {
  return `${price.toLocaleString('ru-RU')}₽`;
}

function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split('T')[0].split('-');
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const monthNames = [
    'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня',
    'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'
  ];
  return `${date.getDate()} ${monthNames[date.getMonth()]}`;
}

function closeModal() {
  emit('close');
}

async function handleNotificationClick() {
  if (!authStore.isAuthenticated || !props.product) {
    return;
  }

  try {
    if (isSubscribed.value) {
      await notificationsApi.unsubscribe(props.product.id.toString());
      isSubscribed.value = false;
    } else {
      await notificationsApi.subscribe(props.product.id.toString());
      isSubscribed.value = true;
    }
  } catch (error) {
    console.error('Failed to toggle notification:', error);
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-container {
  background-color: var(--color-white);
  border-radius: 20px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: var(--color-primary);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-white);
  transition: all 0.3s ease;
  z-index: 10;
}

.modal-close:hover {
  background: #8B0000;
  transform: scale(1.1);
}

.modal-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding: 40px;
}

.modal-image-section {
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-image-wrapper {
  width: 100%;
  height: 400px;
  background-color: #f5f5f5;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 10px;
}

.modal-info-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-title {
  font-family: var(--font-kurale);
  font-size: 32px;
  color: var(--color-primary);
  margin: 0;
  line-height: 1.2;
  padding-right: 60px;
}

.modal-price {
  font-family: var(--font-inter);
  font-weight: 800;
  font-size: 36px;
  color: #000000;
}

.modal-description h3,
.modal-nutrition h3 {
  font-family: var(--font-inter);
  font-weight: 700;
  font-size: 18px;
  color: #333333;
  margin: 0 0 10px 0;
}

.modal-description p {
  font-family: var(--font-inter);
  font-weight: 400;
  font-size: 16px;
  line-height: 1.5;
  color: #666666;
  margin: 0;
}

.nutrition-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.nutrition-item {
  background-color: #f8f8f8;
  border-radius: 10px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.nutrition-label {
  font-family: var(--font-inter);
  font-weight: 400;
  font-size: 14px;
  color: #666666;
}

.nutrition-value {
  font-family: var(--font-inter);
  font-weight: 700;
  font-size: 16px;
  color: #333333;
}

.modal-stock {
  margin-top: 10px;
}

.stock-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background-color: #e8f5e9;
  border-radius: 10px;
  border: 1px solid #4caf50;
}

.stock-indicator.low-stock {
  background-color: #fff3e0;
  border-color: #ff9800;
}

.stock-icon {
  font-size: 20px;
}

.stock-text {
  font-family: var(--font-inter);
  font-weight: 500;
  font-size: 16px;
  color: #2e7d32;
}

.stock-indicator.low-stock .stock-text {
  color: #e65100;
}

.modal-notify-btn {
  width: 100%;
  height: 45px;
  background-color: #ff9800;
  border: none;
  border-radius: 8px;
  font-family: var(--font-inter);
  font-weight: 500;
  font-size: 16px;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 15px;
}

.modal-notify-btn:hover {
  background-color: #e68900;
}

.modal-notify-btn.subscribed {
  background-color: #4caf50;
}

.modal-notify-btn.subscribed:hover {
  background-color: #45a049;
}

.modal-weight,
.modal-manufacturer {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
}

.weight-label,
.manufacturer-label {
  font-family: var(--font-inter);
  font-weight: 500;
  font-size: 16px;
  color: #666666;
}

.weight-value,
.manufacturer-value {
  font-family: var(--font-inter);
  font-weight: 700;
  font-size: 16px;
  color: #333333;
}

/* Анимации */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(-20px);
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: all 0.3s ease;
}

/* Адаптивность */
@media (max-width: 768px) {
  .modal-content {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 20px;
  }
  
  .modal-image-wrapper {
    height: 250px;
  }
  
  .modal-title {
    font-size: 24px;
  }
  
  .modal-price {
    font-size: 28px;
  }
  
  .nutrition-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  
  .nutrition-item {
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: 10px;
  }
  
  .modal-container {
    border-radius: 15px;
  }
  
  .modal-close {
    top: 10px;
    right: 10px;
    width: 35px;
    height: 35px;
  }
  
  .modal-content {
    padding: 15px;
  }
  
  .modal-image-wrapper {
    height: 200px;
  }
  
  .modal-title {
    font-size: 20px;
  }
  
  .modal-price {
    font-size: 24px;
  }
  
  .nutrition-grid {
    grid-template-columns: 1fr;
  }
}
</style>