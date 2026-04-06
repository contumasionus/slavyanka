<template>
  <div class="catalog">
    <section class="catalog__section">
      <h2 class="section-title">У нас всегда есть</h2>
      
      <!-- Список категорий -->
      <div v-if="!selectedCategory" class="catalog__grid">
        <article 
          v-for="category in categories" 
          :key="category.id" 
          class="category-card"
          @click="selectCategory(category)"
        >
          <div class="category-card__image-wrapper">
            <img :src="getCategoryImage(category.name)" :alt="category.name" class="category-card__image">
          </div>
          <div class="category-card__content">
            <h3 class="category-card__title">{{ category.name }}</h3>
            <p class="category-card__description">{{ category.description }}</p>
          </div>
        </article>
      </div>

      <!-- Товары выбранной категории -->
      <div v-else class="category-products">
        <div class="category-header">
          <button class="back-button" @click="goBack">
            <span class="back-icon">←</span>
            Назад к категориям
          </button>
          <h3 class="category-title">{{ selectedCategory.name }}</h3>
          <p class="category-description">{{ selectedCategory.description }}</p>
        </div>

        <div class="products-list">
          <div 
            v-for="product in categoryProducts" 
            :key="product.id" 
            class="product-item"
            :class="{ 'out-of-stock': !product.inStock }"
          >
            <div class="product-image-wrapper">
              <img :src="product.imageUrl || '/images/products/placeholder.svg'" :alt="product.name" class="product-image">
              <div v-if="!product.inStock" class="stock-overlay">
                <span class="stock-badge">Нет в наличии</span>
              </div>
            </div>
            
            <div class="product-info">
              <h4 class="product-name">{{ product.name }}</h4>
              <p v-if="product.weight" class="product-weight">{{ product.weight }}</p>
              <p v-if="product.description" class="product-description">{{ product.description }}</p>
              
              <div class="product-price-row">
                <span class="product-price">{{ formatPrice(product.price) }}</span>
                <button 
                  v-if="product.inStock"
                  class="details-button"
                  @click="openProductModal(product)"
                >
                  Подробнее
                </button>
              </div>

              <div v-if="!product.inStock && product.deliveryDate" class="restock-info">
                <span class="restock-icon">📦</span>
                <span class="restock-text">Данный товар закончился, товар пополнится {{ product.deliveryDate }}</span>
              </div>
              
              <button 
                v-if="!product.inStock && authStore.isAuthenticated"
                @click="handleNotificationClick(product)"
                class="notify-button"
              >
                Сообщить когда появится
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Модальное окно товара -->
    <ProductModal 
      :product="selectedProduct"
      :is-open="isModalOpen"
      @close="closeProductModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { categoriesApi } from '../api/categories.api';
import { productsApi } from '../api/products.api';
import { notificationsApi } from '../api/notifications.api';
import { useAuthStore } from '../stores/auth.store';
import ProductModal from '../components/product/ProductModal.vue';

const route = useRoute();
const router = useRouter();

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

interface CatalogProduct {
  id: string;
  name: string;
  price: number;
  weight?: string;
  description?: string;
  imageUrl: string;
  inStock: boolean;
  deliveryDate?: string;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

const categories = ref<Category[]>([]);
const selectedCategory = ref<Category | null>(null);
const categoryProducts = ref<CatalogProduct[]>([]);
const selectedProduct = ref<CatalogProduct | null>(null);
const isModalOpen = ref(false);
const authStore = useAuthStore();

const categoryImages: Record<string, string> = {
  'Хлебобулочные': '/images/categories/category-bakery.png',
  'Овощи': '/images/categories/category-vegetables.png',
  'Фрукты': '/images/categories/category-fruits.png',
  'Молочка': '/images/categories/category-dairy.png',
  'Консервы и сухофрукты': '/images/categories/category-conserves.png',
  'Домашнее': '/images/categories/category-homemade.png',
  'Рекомендуемые': '/images/categories/category-featured.svg'
};

function getCategoryImage(categoryName: string): string {
  // Сначала ищем категорию в загруженных данных
  const category = categories.value.find(cat => cat.name === categoryName);
  if (category?.imageUrl) {
    return category.imageUrl;
  }
  
  // Если не нашли, используем захардкоженные URL-адреса
  return categoryImages[categoryName] || '/images/categories/placeholder.svg';
}

function formatPrice(price: number): string {
  return `${price.toLocaleString('ru-RU')}₽`;
}

async function selectCategory(category: Category) {
  selectedCategory.value = category;
  router.push(`/catalog/${category.slug}`);
  try {
    categoryProducts.value = await productsApi.getByCategory(category.slug);
  } catch (error) {
    console.error('Failed to load products:', error);
    categoryProducts.value = [];
  }
}

function goBack() {
  selectedCategory.value = null;
  categoryProducts.value = [];
  router.push('/catalog');
}

async function loadCategoryFromUrl() {
  const categoryId = route.params.categoryId as string;
  if (categoryId && categories.value.length > 0) {
    const category = categories.value.find(cat => cat.slug === categoryId);
    if (category) {
      selectedCategory.value = category;
      try {
        categoryProducts.value = await productsApi.getByCategory(category.slug);
      } catch (error) {
        console.error('Failed to load products:', error);
        categoryProducts.value = [];
      }
    }
  }
}

watch(() => route.params.categoryId, () => {
  loadCategoryFromUrl();
});

function openProductModal(product: CatalogProduct) {
  selectedProduct.value = product;
  isModalOpen.value = true;
}

function closeProductModal() {
  isModalOpen.value = false;
  selectedProduct.value = null;
}

async function handleNotificationClick(product: CatalogProduct) {
  if (!authStore.isAuthenticated) {
    return;
  }

  try {
    await notificationsApi.subscribe(product.id.toString());
    alert('Вы подписались на уведомление о появлении товара');
  } catch (error) {
    console.error('Failed to subscribe:', error);
  }
}

onMounted(async () => {
  try {
    const allCategories = await categoriesApi.getAll();
    // Фильтруем категорию "Рекомендуемые" (featured), чтобы она не отображалась в каталоге
    categories.value = allCategories.filter((cat: Category) => cat.slug !== 'featured');
    // Загружаем категорию из URL, если есть
    await loadCategoryFromUrl();
  } catch (error) {
    console.error('Failed to load categories:', error);
  }
});
</script>

<style scoped>
.catalog {
  padding: 40px 20px;
  max-width: 1920px;
  margin: 0 auto;
}

.catalog__section .section-title {
  text-shadow: 
    -1px -1px 0 #000000,
    1px -1px 0 #000000,
    -1px 1px 0 #000000,
    1px 1px 0 #000000;
}

.catalog__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  justify-items: center;
}

.category-card {
  width: 415px;
  height: 362px;
  background-color: var(--color-white);
  border-radius: 20px;
  border: 1px solid #000000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.category-card__image-wrapper {
  height: 202px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  background-color: #f5f5f5;
}

.category-card__image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 10px;
}

.category-card__content {
  padding: 0 55px 21px;
  text-align: center;
}

.category-card__title {
  font-family: var(--font-inter);
  font-weight: 700;
  font-size: 24px;
  line-height: 1.21;
  color: var(--color-primary);
  margin-bottom: 21px;
}

.category-card__description {
  font-family: var(--font-inter);
  font-weight: 300;
  font-size: 16px;
  line-height: 1.21;
  color: #000000;
  text-align: center;
}

/* Стили для товаров категории */
.category-products {
  max-width: 1200px;
  margin: 0 auto;
}

.category-header {
  margin-bottom: 30px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 20px;
  font-family: var(--font-inter);
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.back-button:hover {
  background: #8B0000;
  transform: translateX(-5px);
}

.back-icon {
  font-size: 18px;
}

.category-title {
  font-family: var(--font-kurale);
  font-size: 36px;
  color: var(--color-primary);
  margin: 0 0 10px 0;
}

.category-description {
  font-family: var(--font-inter);
  font-weight: 400;
  font-size: 18px;
  color: #666666;
  margin: 0;
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-item {
  display: flex;
  gap: 20px;
  background: white;
  border-radius: 15px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.product-item:hover {
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.product-item.out-of-stock {
  opacity: 0.7;
  background: #f9f9f9;
}

.product-image-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 10px;
  background-color: #f5f5f5;
}

.stock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stock-badge {
  background: #ff4444;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-family: var(--font-inter);
  font-weight: 600;
  font-size: 12px;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-family: var(--font-inter);
  font-weight: 600;
  font-size: 18px;
  color: #333333;
  margin: 0 0 5px 0;
}

.product-weight {
  font-family: var(--font-inter);
  font-weight: 400;
  font-size: 14px;
  color: #666666;
  margin: 0 0 5px 0;
}

.product-calories {
  font-family: var(--font-inter);
  font-weight: 400;
  font-size: 14px;
  color: #888888;
  margin: 0 0 10px 0;
}

.product-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.product-price {
  font-family: var(--font-inter);
  font-weight: 800;
  font-size: 24px;
  color: #000000;
}

.details-button {
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-family: var(--font-inter);
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.details-button:hover {
  background: #8B0000;
  transform: scale(1.05);
}

.restock-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background: #fff3e0;
  border-radius: 8px;
  border: 1px solid #ff9800;
}

.restock-icon {
  font-size: 16px;
}

.restock-text {
  font-family: var(--font-inter);
  font-weight: 500;
  font-size: 14px;
  color: #e65100;
}

.notify-button {
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
  margin-top: 10px;
}

.notify-button:hover {
  background-color: #e68900;
}


/* Адаптивность */
@media (max-width: 1200px) {
  .catalog__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .catalog__grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .category-card {
    width: 100%;
    max-width: 415px;
    height: auto;
    min-height: 300px;
    margin: 0 auto;
  }
  
  .category-card__image-wrapper {
    height: 180px;
    padding: 10px;
  }
  
  .category-card__image {
    width: 100%;
    height: 180px;
  }
  
  .category-card__content {
    padding: 15px 20px;
  }
  
  .category-card__title {
    font-size: 20px;
    margin-bottom: 15px;
  }
  
  .category-card__description {
    font-size: 14px;
  }

  .product-item {
    flex-direction: column;
    gap: 15px;
  }

  .product-image-wrapper {
    width: 100%;
    height: 200px;
  }

  .product-price-row {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .details-button {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .catalog {
    padding: 20px 15px;
  }
  
  .category-card {
    max-width: 100%;
  }
  
  .category-card__image-wrapper {
    height: 150px;
  }
  
  .category-card__image {
    height: 150px;
  }
  
  .category-card__title {
    font-size: 18px;
  }
  
  .category-card__description {
    font-size: 13px;
  }

  .category-title {
    font-size: 28px;
  }

  .category-description {
    font-size: 16px;
  }

  .product-name {
    font-size: 16px;
  }

  .product-price {
    font-size: 20px;
  }
}
</style>