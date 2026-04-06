<template>
  <div class="categories-admin">
    <div class="categories-admin__header">
      <h1>Управление категориями</h1>
      <button @click="showForm = true" class="categories-admin__add-btn">Добавить категорию</button>
    </div>
    
    <div class="categories-admin__list">
      <div v-for="category in categories" :key="category.id" class="categories-admin__item">
        <img :src="category.imageUrl || '/images/categories/placeholder.svg'" :alt="category.name" class="categories-admin__image">
        <div class="categories-admin__info">
          <h3>{{ category.name }}</h3>
          <p>{{ category.description }}</p>
        </div>
        <div class="categories-admin__actions">
          <button @click="editCategory(category)" class="categories-admin__edit">Редактировать</button>
          <button @click="deleteCategory(category.id)" class="categories-admin__delete">Удалить</button>
        </div>
      </div>
    </div>
    
    <div v-if="showForm" class="categories-admin__modal">
      <div class="categories-admin__modal-content">
        <h2>{{ editingCategory ? 'Редактировать категорию' : 'Добавить категорию' }}</h2>
        <form @submit.prevent="saveCategory">
          <input v-model="form.name" placeholder="Название" required>
          <input v-model="form.slug" placeholder="Slug (например: bakery)" required>
          <textarea v-model="form.description" placeholder="Описание"></textarea>
          
          <div class="form-group">
            <label>Изображение категории:</label>
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
          
          <div class="categories-admin__modal-actions">
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
import { categoriesApi } from '../../api/categories.api';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

const categories = ref<Category[]>([]);
const showForm = ref(false);
const editingCategory = ref<Category | null>(null);
const imagePreview = ref<string>('');

const form = ref({
  name: '',
  slug: '',
  description: '',
  imageUrl: ''
});

onMounted(async () => {
  await loadCategories();
});

async function loadCategories() {
  categories.value = await categoriesApi.getAll();
}

function editCategory(category: Category) {
  editingCategory.value = category;
  form.value = {
    name: category.name,
    slug: category.slug,
    description: category.description || '',
    imageUrl: category.imageUrl || ''
  };
  imagePreview.value = category.imageUrl || '';
  showForm.value = true;
}

async function saveCategory() {
  try {
    if (editingCategory.value) {
      await categoriesApi.update(editingCategory.value.id, form.value);
    } else {
      await categoriesApi.create(form.value);
    }
    await loadCategories();
    closeForm();
  } catch (error) {
    console.error('Failed to save category:', error);
  }
}

async function deleteCategory(id: string) {
  if (confirm('Удалить категорию?')) {
    await categoriesApi.delete(id);
    await loadCategories();
  }
}

function closeForm() {
  showForm.value = false;
  editingCategory.value = null;
  imagePreview.value = '';
  form.value = { name: '', slug: '', description: '', imageUrl: '' };
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
.categories-admin {
  padding: 20px;
}

.categories-admin__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.categories-admin__header h1 {
  font-family: var(--font-inter);
  font-weight: 700;
  font-size: 32px;
  color: var(--color-text);
}

.categories-admin__add-btn {
  background-color: var(--color-primary);
  color: var(--color-white);
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-family: var(--font-inter);
  font-weight: 600;
  cursor: pointer;
}

.categories-admin__list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.categories-admin__item {
  display: flex;
  align-items: center;
  gap: 20px;
  background-color: var(--color-white);
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.categories-admin__image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.categories-admin__info {
  flex: 1;
}

.categories-admin__info h3 {
  font-family: var(--font-inter);
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 5px;
}

.categories-admin__info p {
  font-family: var(--font-inter);
  font-size: 14px;
  color: var(--color-text-light);
}

.categories-admin__actions {
  display: flex;
  gap: 10px;
}

.categories-admin__edit,
.categories-admin__delete {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-family: var(--font-inter);
  font-size: 14px;
  cursor: pointer;
}

.categories-admin__edit {
  background-color: #3498db;
  color: white;
}

.categories-admin__delete {
  background-color: #e74c3c;
  color: white;
}

.categories-admin__modal {
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

.categories-admin__modal-content {
  background-color: var(--color-white);
  border-radius: 12px;
  padding: 30px;
  width: 100%;
  max-width: 500px;
}

.categories-admin__modal-content h2 {
  font-family: var(--font-inter);
  font-weight: 700;
  font-size: 24px;
  margin-bottom: 20px;
}

.categories-admin__modal-content form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.categories-admin__modal-content input,
.categories-admin__modal-content textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: var(--font-inter);
  font-size: 14px;
}

.categories-admin__modal-content textarea {
  min-height: 100px;
  resize: vertical;
}

.categories-admin__modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.categories-admin__modal-actions button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-family: var(--font-inter);
  font-weight: 600;
  cursor: pointer;
}

.categories-admin__modal-actions button[type="submit"] {
  background-color: var(--color-primary);
  color: white;
}

.categories-admin__modal-actions button[type="button"] {
  background-color: #95a5a6;
  color: white;
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
  position: relative;
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

@media (max-width: 768px) {
  .categories-admin__header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .categories-admin__item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .categories-admin__actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>