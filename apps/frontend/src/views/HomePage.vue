<template>
  <div class="home">
    <section class="hero">
      <h2 class="section-title">Товары на расхват</h2>
      <div class="products-grid">
        <ProductCard 
          v-for="product in products" 
          :key="product.id" 
          :product="product"
          @open-modal="openProductModal"
        />
      </div>
    </section>
    
    <ProductModal 
      :product="selectedProduct"
      :is-open="isModalOpen"
      @close="closeProductModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ProductCard from '../components/product/ProductCard.vue';
import ProductModal from '../components/product/ProductModal.vue';
import { productsApi } from '../api/products.api';

interface Product {
  id: string;
  name: string;
  price: number;
  weight?: string;
  imageUrl?: string;
  inStock: boolean;
  description?: string;
  categoryId: string;
}

const products = ref<Product[]>([]);
const selectedProduct = ref<Product | null>(null);
const isModalOpen = ref(false);

onMounted(async () => {
  try {
    // Загружаем товары из категории "featured" для главной страницы
    products.value = await productsApi.getByCategory('featured');
  } catch (error) {
    console.error('Failed to load products:', error);
  }
});

function openProductModal(product: Product) {
  selectedProduct.value = product;
  isModalOpen.value = true;
}

function closeProductModal() {
  isModalOpen.value = false;
  selectedProduct.value = null;
}
</script>

<style scoped>
.home {
  padding: 40px 20px;
  max-width: 1920px;
  margin: 0 auto;
}

.home .section-title {
  text-shadow: 
    -1px -1px 0 #000000,
    1px -1px 0 #000000,
    -1px 1px 0 #000000,
    1px 1px 0 #000000;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(299px, 1fr));
  gap: 30px;
  justify-items: center;
}

@media (max-width: 768px) {
  .home {
    padding: 20px 15px;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}
</style>