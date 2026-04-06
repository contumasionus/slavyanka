<template>
  <div class="products-admin">
    <div class="products-admin__header">
      <h1>Управление товарами</h1>
      <button @click="showForm = true" class="products-admin__add-btn">Добавить товар</button>
    </div>
    
    <div v-if="error" class="products-admin__error">
      {{ error }}
    </div>
    
    <div class="products-admin__list">
      <div v-for="product in products" :key="product.id" class="products-admin__item">
        <img :src="product.imageUrl || '/images/products/placeholder.svg'" :alt="product.name" class="products-admin__image">
        <div class="products-admin__info">
          <h3>{{ product.name }}</h3>
          <p>{{ product.price }}₽</p>
          <span :class="product.inStock ? 'in-stock' : 'out-of-stock'">
            {{ product.inStock ? 'В наличии' : 'Нет в наличии' }}
          </span>
        </div>
        <div class="products-admin__actions">
          <button @click="editProduct(product)" class="products-admin__edit">Редактировать</button>
          <button @click="deleteProduct(product.id)" class="products-admin__delete">Удалить</button>
        </div>
      </div>
    </div>
    
    <div v-if="showForm" class="products-admin__modal">
      <div class="products-admin__modal-content">
        <h2>{{ editingProduct ? 'Редактировать товар' : 'Добавить товар' }}</h2>
        <form @submit.prevent="saveProduct">
          <input v-model="form.name" placeholder="Название" required>
          <input v-model="form.price" type="number" step="any" placeholder="Цена" required>
          <input v-model="form.weight" placeholder="Вес">
          <select v-model="form.categoryId" required>
            <option value="">Выберите категорию</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
          <textarea v-model="form.description" placeholder="Описание"></textarea>
          
          <div class="form-group">
            <label>Изображение товара:</label>
            <input 
              type="file" 
              @change="handleImageUpload" 
              accept="image/*"
              class="file-input"
            >
            <div v-if="imagePreview" class="image-preview">
              <img :src="imagePreview" alt="Предпросмотр">
              <button type="button" @click="removeImage" class="remove-image-btn">✕</button>
            </div>
          </div>
          
          <input 
            v-model="form.deliveryDate" 
            type="date" 
            placeholder="Дата поставки"
          >
          
          <label>
            <input type="checkbox" v-model="form.inStock"> В наличии
          </label>
          <div class="products-admin__modal-actions">
            <button type="submit">Сохранить</button>
            <button type="button" @click="closeForm">Отмена</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { productsApi } from '../../api/products.api';
import { categoriesApi } from '../../api/categories.api';

interface Product {
  id: string;
  name: string;
  price: number;
  weight?: string;
  imageUrl?: string;
  categoryId: string;
  description?: string;
  inStock: boolean;
  deliveryDate?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const showForm = ref(false);
const editingProduct = ref<Product | null>(null);
const imagePreview = ref<string>('');
const error = ref<string>('');

const form = ref({
  name: '',
  price: 0,
  weight: '',
  categoryId: '',
  description: '',
  inStock: true,
  deliveryDate: '',
  imageUrl: ''
});

onMounted(async () => {
  await loadProducts();
  categories.value = await categoriesApi.getAll();
});

async function loadProducts() {
  products.value = await productsApi.getAll();
}

function editProduct(product: Product) {
  editingProduct.value = product;
  form.value = {
    name: product.name,
    price: product.price,
    weight: product.weight || '',
    categoryId: product.categoryId,
    description: product.description || '',
    inStock: product.inStock,
    deliveryDate: product.deliveryDate || '',
    imageUrl: product.imageUrl || ''
  };
  imagePreview.value = product.imageUrl || '';
  showForm.value = true;
}

async function saveProduct() {
  error.value = '';
  
  // Валидация обязательных полей
  if (!form.value.name.trim()) {
    error.value = 'Название товара обязательно';
    return;
  }
  
  if (!form.value.categoryId) {
    error.value = 'Выберите категорию';
    return;
  }
  
  if (form.value.price <= 0) {
    error.value = 'Цена должна быть больше 0';
    return;
  }
  
  try {
    // Преобразуем данные перед отправкой
    const dataToSend: any = {
      name: form.value.name.trim(),
      price: Number(form.value.price),
      categoryId: form.value.categoryId,
      inStock: form.value.inStock,
    };
    
    // Добавляем опциональные поля только если они заполнены
    if (form.value.description?.trim()) {
      dataToSend.description = form.value.description.trim();
    }
    
    if (form.value.weight?.trim()) {
      dataToSend.weight = form.value.weight.trim();
    }
    
    if (form.value.imageUrl) {
      dataToSend.imageUrl = form.value.imageUrl;
    }
    
    // Конвертируем deliveryDate из строки в ISO формат или null
    if (form.value.deliveryDate) {
      dataToSend.deliveryDate = new Date(form.value.deliveryDate).toISOString();
    } else {
      dataToSend.deliveryDate = null;
    }
    
    if (editingProduct.value) {
      await productsApi.update(editingProduct.value.id, dataToSend);
    } else {
      await productsApi.create(dataToSend);
    }
    await loadProducts();
    closeForm();
  } catch (e: any) {
    console.error('Failed to save product:', e);
    if (e.response?.status === 401) {
      error.value = 'Ошибка авторизации. Пожалуйста, войдите через /admin/login';
    } else if (e.response?.status === 403) {
      error.value = 'Нет прав администратора. Пожалуйста, войдите через /admin/login';
    } else {
      error.value = e.response?.data?.error || 'Ошибка сохранения товара';
    }
  }
}

async function deleteProduct(id: string) {
  if (confirm('Удалить товар?')) {
    error.value = '';
    try {
      await productsApi.delete(id);
      await loadProducts();
    } catch (e: any) {
      console.error('Failed to delete product:', e);
      if (e.response?.status === 401) {
        error.value = 'Ошибка авторизации. Пожалуйста, войдите через /admin/login';
      } else if (e.response?.status === 403) {
        error.value = 'Нет прав администратора. Пожалуйста, войдите через /admin/login';
      } else {
        error.value = e.response?.data?.error || 'Ошибка удаления товара';
      }
    }
  }
}

function closeForm() {
  showForm.value = false;
  editingProduct.value = null;
  imagePreview.value = '';
  form.value = { 
    name: '', 
    price: 0, 
    weight: '', 
    categoryId: '', 
    description: '', 
    inStock: true,
    deliveryDate: '',
    imageUrl: ''
  };
}

function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    // Проверяем размер файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Файл слишком большой. Максимальный размер: 5MB');
      return;
    }
    
    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      alert('Можно загружать только изображения');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      
      // Создаем Image для сжатия
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Максимальные размеры
        const maxWidth = 800;
        const maxHeight = 600;
        
        let { width, height } = img;
        
        // Пропорциональное масштабирование
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Конвертируем в base64 с качеством 0.8
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        
        imagePreview.value = compressedBase64;
        form.value.imageUrl = compressedBase64;
      };
      
      img.src = result;
    };
    reader.readAsDataURL(file);
  }
}

function removeImage() {
  imagePreview.value = '';
  form.value.imageUrl = '';
}
</script>

<style scoped>
.products-admin {
  padding: 20px;
}

.products-admin__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.products-admin__header h1 {
  font-family: var(--font-inter);
  font-weight: 700;
  font-size: 32px;
  color: var(--color-text);
}

.products-admin__add-btn {
  background-color: var(--color-primary);
  color: var(--color-white);
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-family: var(--font-inter);
  font-weight: 600;
  cursor: pointer;
}

.products-admin__error {
  background-color: #fee;
  border: 1px solid #fcc;
  color: #c00;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-family: var(--font-inter);
  font-size: 14px;
}

.products-admin__list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.products-admin__item {
  display: flex;
  align-items: center;
  gap: 20px;
  background-color: var(--color-white);
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.products-admin__image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.products-admin__info {
  flex: 1;
}

.products-admin__info h3 {
  font-family: var(--font-inter);
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 5px;
}

.products-admin__info p {
  font-family: var(--font-inter);
  font-weight: 700;
  font-size: 18px;
  color: var(--color-primary);
  margin-bottom: 5px;
}

.in-stock {
  color: #27ae60;
  font-size: 14px;
}

.out-of-stock {
  color: #e74c3c;
  font-size: 14px;
}

.products-admin__actions {
  display: flex;
  gap: 10px;
}

.products-admin__edit,
.products-admin__delete {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-family: var(--font-inter);
  font-size: 14px;
  cursor: pointer;
}

.products-admin__edit {
  background-color: #3498db;
  color: white;
}

.products-admin__delete {
  background-color: #e74c3c;
  color: white;
}

.products-admin__modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.products-admin__modal-content {
  background-color: var(--color-white);
  border-radius: 12px;
  padding: 30px;
  width: 100%;
  max-width: 500px;
}

.products-admin__modal-content h2 {
  font-family: var(--font-inter);
  font-weight: 700;
  font-size: 24px;
  margin-bottom: 20px;
}

.products-admin__modal-content form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.products-admin__modal-content input,
.products-admin__modal-content select,
.products-admin__modal-content textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: var(--font-inter);
  font-size: 14px;
}

.products-admin__modal-content textarea {
  min-height: 100px;
  resize: vertical;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-family: var(--font-inter);
  font-weight: 500;
  font-size: 14px;
  color: var(--color-text);
}

.file-input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: var(--font-inter);
  font-size: 14px;
}

.image-preview {
  margin-top: 10px;
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-image-btn:hover {
  background: #c0392b;
}

.products-admin__modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.products-admin__modal-actions button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-family: var(--font-inter);
  font-weight: 600;
  cursor: pointer;
}

.products-admin__modal-actions button[type="submit"] {
  background-color: var(--color-primary);
  color: white;
}

.products-admin__modal-actions button[type="button"] {
  background-color: #95a5a6;
  color: white;
}

@media (max-width: 768px) {
  .products-admin__header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .products-admin__item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .products-admin__actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>