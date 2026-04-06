<template>
  <article class="category-card">
    <div class="category-card__image-wrapper">
      <img :src="category.imageUrl || '/images/categories/placeholder.svg'" :alt="category.name" class="category-card__image">
    </div>
    <div class="category-card__content">
      <h3 class="category-card__title">{{ category.name }}</h3>
      <p class="category-card__description">{{ category.description }}</p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { Category } from '@slavyanka/shared-types';

defineProps<{
  category: Category;
}>();
</script>

<style scoped>
.category-card {
  width: 415px;
  height: 362px;
  background-color: var(--color-white);
  border-radius: 20px;
  border: 1px solid #000000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.category-card__image-wrapper {
  height: 202px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 8px 21px;
}

.category-card__image {
  width: 400px;
  height: 202px;
  object-fit: cover;
  border-radius: 0;
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

@media (max-width: 768px) {
  .category-card {
    width: 100%;
    max-width: 415px;
    height: auto;
    min-height: 300px;
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
}

@media (max-width: 480px) {
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
}
</style>