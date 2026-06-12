<template>
  <div class="admin-categories">
    <div class="admin-header">
      <h1 class="admin-title">Управление категориями</h1>
      <button @click="showForm = true" class="btn btn--primary">+ Добавить категорию</button>
    </div>

    <div v-if="error" class="alert alert--error">{{ error }}</div>

    <div class="admin-list">
      <div v-for="category in categories" :key="category.id" class="admin-item">
        <div class="admin-item__img-wrap">
          <img :src="category.imageUrl || '/images/categories/placeholder.svg'" :alt="category.name" class="admin-item__img">
        </div>
        <div class="admin-item__info">
          <h3 class="admin-item__name">{{ category.name }}</h3>
          <p class="admin-item__desc">{{ category.description }}</p>
          <span class="admin-item__slug">slug: {{ category.slug }}</span>
        </div>
        <div class="admin-item__actions">
          <button @click="editCategory(category)" class="btn btn--sm btn--outline">Редактировать</button>
          <button @click="deleteCategory(category.id)" class="btn btn--sm btn--danger">Удалить</button>
        </div>
      </div>
    </div>

    <!-- Модалка -->
    <teleport to="body">
      <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
        <div class="modal-card">
          <h2 class="modal-title">{{ editingCategory ? 'Редактировать категорию' : 'Добавить категорию' }}</h2>
          <form @submit.prevent="saveCategory" class="admin-form">
            <div class="form-group">
              <label>Название *</label>
              <input v-model="form.name" required placeholder="Название категории">
            </div>
            <div class="form-group">
              <label>Slug *</label>
              <input v-model="form.slug" required placeholder="bakery">
              <span class="form-hint">Латинскими буквами, например: dairy, bakery</span>
            </div>
            <div class="form-group">
              <label>Описание</label>
              <textarea v-model="form.description" rows="2" placeholder="Описание..."></textarea>
            </div>
            <div class="form-group">
              <label>Изображение</label>
              <div class="image-upload">
                <input type="file" @change="handleImageUpload" accept="image/*" class="file-input">
              </div>
              <div v-if="imagePreview" class="image-preview">
                <img :src="imagePreview" alt="Предпросмотр">
                <button type="button" @click="removeImage" class="btn btn--sm btn--danger">✕ Удалить</button>
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" @click="closeForm" class="btn btn--outline">Отмена</button>
              <button type="submit" class="btn btn--primary">Сохранить</button>
            </div>
          </form>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { categoriesApi } from '../../api/categories.api';

interface Category {
  id: string; name: string; slug: string; description?: string; imageUrl?: string;
}

const categories = ref<Category[]>([]);
const showForm = ref(false);
const editingCategory = ref<Category | null>(null);
const imagePreview = ref('');
const error = ref('');

const form = ref({ name: '', slug: '', description: '', imageUrl: '' });

onMounted(async () => { await loadCategories(); });
async function loadCategories() { categories.value = await categoriesApi.getAll(); }

function editCategory(category: Category) {
  editingCategory.value = category;
  form.value = { name: category.name, slug: category.slug, description: category.description || '', imageUrl: category.imageUrl || '' };
  imagePreview.value = category.imageUrl || '';
  showForm.value = true;
}

async function saveCategory() {
  error.value = '';
  if (!form.value.name.trim()) { error.value = 'Название обязательно'; return; }
  if (!form.value.slug.trim()) { error.value = 'Slug обязателен'; return; }
  try {
    if (editingCategory.value) {
      await categoriesApi.update(editingCategory.value.id, form.value);
    } else {
      await categoriesApi.create(form.value);
    }
    await loadCategories();
    closeForm();
  } catch (e: any) { error.value = e?.response?.data?.error || 'Ошибка сохранения'; }
}

async function deleteCategory(id: string) {
  if (!confirm('Удалить категорию?')) return;
  error.value = '';
  try { await categoriesApi.delete(id); await loadCategories(); }
  catch (e: any) { error.value = e?.response?.data?.error || 'Ошибка удаления'; }
}

function closeForm() {
  showForm.value = false; editingCategory.value = null; imagePreview.value = '';
  form.value = { name: '', slug: '', description: '', imageUrl: '' };
}

function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { alert('Максимум 5MB'); return; }
  if (!file.type.startsWith('image/')) { alert('Только изображения'); return; }
  const reader = new FileReader();
  reader.onload = (e) => {
    const result = e.target?.result as string;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const maxWidth = 800; const maxHeight = 600;
      let { width, height } = img;
      if (width > height) { if (width > maxWidth) { height = (height * maxWidth) / width; width = maxWidth; } }
      else { if (height > maxHeight) { width = (width * maxHeight) / height; height = maxHeight; } }
      canvas.width = width; canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL('image/jpeg', 0.8);
      imagePreview.value = compressed; form.value.imageUrl = compressed;
    };
    img.src = result;
  };
  reader.readAsDataURL(file);
  target.value = '';
}

function removeImage() { imagePreview.value = ''; form.value.imageUrl = ''; }
</script>

<style scoped>
.admin-categories { padding: 24px; }
.admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.admin-title { font-family: var(--font-heading); font-weight: 700; font-size: 28px; color: var(--color-text); }

.alert { padding: 12px 16px; border-radius: var(--radius-md); margin-bottom: 16px; font-family: var(--font-body); font-size: 14px; }
.alert--error { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; }

.admin-list { display: flex; flex-direction: column; gap: 12px; }
.admin-item { display: flex; align-items: center; gap: 16px; background: var(--color-surface); border-radius: var(--radius-lg); padding: 16px 20px; border: 1px solid var(--color-border); box-shadow: var(--shadow-xs); }
.admin-item__img-wrap { width: 72px; height: 72px; border-radius: var(--radius-md); overflow: hidden; background: var(--color-border-light); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.admin-item__img { width: 100%; height: 100%; object-fit: contain; }
.admin-item__info { flex: 1; }
.admin-item__name { font-family: var(--font-heading); font-weight: 600; font-size: 16px; color: var(--color-text); margin-bottom: 2px; }
.admin-item__desc { font-size: 14px; color: var(--color-text-muted); margin-bottom: 2px; }
.admin-item__slug { font-size: 11px; color: var(--color-text-muted); font-family: var(--font-mono, monospace); background: var(--color-border-light); padding: 1px 6px; border-radius: var(--radius-sm); }
.admin-item__actions { display: flex; gap: 8px; }

.btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 20px; border-radius: var(--radius-full); font-family: var(--font-heading); font-weight: 600; font-size: 14px; border: none; cursor: pointer; text-decoration: none; transition: all var(--transition-fast); }
.btn--primary { background: var(--color-primary); color: #fff; }
.btn--primary:hover { background: var(--color-primary-dark); }
.btn--outline { background: none; border: 1px solid var(--color-border); color: var(--color-text-secondary); }
.btn--outline:hover { border-color: var(--color-primary); color: var(--color-primary); }
.btn--danger { background: #fef2f2; color: var(--color-error); border: 1px solid #fecaca; }
.btn--danger:hover { background: #fecaca; }
.btn--sm { padding: 6px 14px; font-size: 13px; }

.modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 16px; }
.modal-card { background: var(--color-surface); border-radius: var(--radius-xl); padding: 28px; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; }
.modal-title { font-family: var(--font-heading); font-weight: 700; font-size: 22px; color: var(--color-text); margin-bottom: 20px; }
.admin-form { display: flex; flex-direction: column; gap: 14px; }
.form-group { display: flex; flex-direction: column; gap: 4px; }
.form-group label { font-family: var(--font-heading); font-weight: 500; font-size: 13px; color: var(--color-text-secondary); }
.form-group input, .form-group textarea {
  padding: 10px 12px; border: 1px solid var(--color-border); border-radius: var(--radius-md);
  font-family: var(--font-body); font-size: 14px; background: var(--color-background);
  color: var(--color-text); transition: all var(--transition-fast);
}
.form-group input:focus, .form-group textarea:focus { outline: none; border-color: var(--color-primary); }
.form-hint { font-size: 11px; color: var(--color-text-muted); }
.image-upload { margin-top: 4px; }
.file-input { font-size: 13px; }
.image-preview { margin-top: 8px; display: flex; align-items: center; gap: 10px; }
.image-preview img { width: 80px; height: 80px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--color-border); }
.modal-actions { display: flex; gap: 10px; margin-top: 6px; }
.modal-actions .btn { flex: 1; }

@media (max-width: 768px) {
  .admin-header { flex-direction: column; gap: 12px; align-items: flex-start; }
  .admin-item { flex-wrap: wrap; }
  .admin-item__actions { width: 100%; justify-content: flex-end; }
}
</style>