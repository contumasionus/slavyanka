<template>
  <article class="product-card">
    <div class="product-card__image-wrapper">
      <img :src="product.imageUrl || '/images/products/placeholder.svg'" :alt="product.name" class="product-card__image">
        <div v-if="!product.inStock" class="product-card__out-of-stock">
          <span class="out-of-stock-badge">
            Нет в наличии
            <template v-if="product.deliveryDate">
              <br>Ожидается: {{ formatDate(product.deliveryDate) }}
            </template>
          </span>
        </div>
    </div>
    <div class="product-card__content">
      <h3 class="product-card__title">{{ product.name }}<br v-if="product.weight">{{ product.weight }}</h3>
      <span class="product-card__price">{{ formatPrice(product.price) }}</span>
      
      <div class="product-card__actions">
        <a href="#" class="product-card__btn" @click="handleDetailsClick">Подробнее</a>
        
        <button 
          v-if="!product.inStock && authStore.isAuthenticated"
          @click="handleNotificationClick"
          class="product-card__notify-btn"
          :class="{ 'subscribed': isSubscribed }"
        >
          {{ isSubscribed ? '✓ Подписка оформлена' : 'Сообщить когда появится' }}
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth.store';
import { notificationsApi } from '../../api/notifications.api';

interface Product {
  id: string;
  name: string;
  price: number;
  weight?: string;
  imageUrl?: string;
  inStock: boolean;
  description?: string;
  categoryId: string;
  deliveryDate?: string;
}

const props = defineProps<{
  product: Product;
}>();

const emit = defineEmits<{
  'open-modal': [product: Product];
}>();

const authStore = useAuthStore();
const isSubscribed = ref(false);

function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split('T')[0].split('-');
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const monthNames = [
    'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня',
    'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'
  ];
  return `${date.getDate()} ${monthNames[date.getMonth()]}`;
}

onMounted(async () => {
  if (authStore.isAuthenticated && !props.product.inStock) {
    try {
      const result = await notificationsApi.checkSubscription(props.product.id);
      isSubscribed.value = result.isSubscribed;
    } catch (error) {
      console.error('Failed to check subscription:', error);
    }
  }
});

function formatPrice(price: number): string {
  return `${price.toLocaleString('ru-RU')}₽`;
}

function handleDetailsClick(event: Event) {
  event.preventDefault();
  emit('open-modal', props.product);
}

async function handleNotificationClick() {
  if (!authStore.isAuthenticated) {
    return;
  }

  try {
    if (isSubscribed.value) {
      await notificationsApi.unsubscribe(props.product.id);
      isSubscribed.value = false;
    } else {
      await notificationsApi.subscribe(props.product.id);
      isSubscribed.value = true;
    }
  } catch (error) {
    console.error('Failed to toggle notification:', error);
  }
}
</script>

<style scoped>
.product-card {
  width: 299px;
  height: 402px;
  background-color: var(--color-white);
  border-radius: 20px;
  border: 1px solid #4c4c4c;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.product-card__image-wrapper {
  height: 201px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  background-color: #f5f5f5;
  position: relative;
}

.product-card__image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 10px;
}

.product-card__out-of-stock {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
}

.out-of-stock-badge {
  background-color: #ff4444;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-family: var(--font-inter);
  font-weight: 600;
  font-size: 12px;
  display: block;
  text-align: center;
}

.product-card__content {
  padding: 6px 6px 6px 10px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.product-card__title {
  font-family: var(--font-inter);
  font-weight: 400;
  font-size: 16px;
  line-height: 1.21;
  color: #333333;
  margin-bottom: 5px;
  flex: 1;
}

.product-card__price {
  font-family: var(--font-inter);
  font-weight: 800;
  font-size: 20px;
  line-height: 1.21;
  color: #000000;
  margin-bottom: 15px;
}

.product-card__actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.product-card__btn {
  display: block;
  width: 138px;
  height: 46px;
  background-color: var(--color-primary);
  border-radius: 40px;
  font-family: var(--font-inter);
  font-weight: 400;
  font-size: 20px;
  line-height: 1.21;
  color: var(--color-white);
  text-align: center;
  line-height: 46px;
  text-decoration: none;
  margin: 0 auto;
  transition: opacity 0.3s;
}

.product-card__btn:hover {
  opacity: 0.9;
}

.product-card__notify-btn {
  width: 100%;
  height: 40px;
  background-color: #ff9800;
  border: none;
  border-radius: 8px;
  font-family: var(--font-inter);
  font-weight: 500;
  font-size: 14px;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.product-card__notify-btn:hover {
  background-color: #e68900;
}

.product-card__notify-btn.subscribed {
  background-color: #4caf50;
}

.product-card__notify-btn.subscribed:hover {
  background-color: #45a049;
}

@media (max-width: 768px) {
  .product-card {
    width: 100%;
    max-width: 299px;
    height: auto;
    min-height: 350px;
  }
  
  .product-card__image-wrapper {
    height: 180px;
    padding: 10px;
  }
  
  .product-card__image {
    width: 160px;
    height: 160px;
  }
}

@media (max-width: 480px) {
  .product-card {
    max-width: 100%;
  }
  
  .product-card__image-wrapper {
    height: 150px;
  }
  
  .product-card__image {
    width: 140px;
    height: 140px;
  }
  
  .product-card__title {
    font-size: 14px;
  }
  
  .product-card__price {
    font-size: 18px;
  }
  
  .product-card__btn {
    width: 120px;
    height: 40px;
    font-size: 16px;
    line-height: 40px;
  }
  
  .product-card__notify-btn {
    height: 35px;
    font-size: 12px;
  }
}
</style>