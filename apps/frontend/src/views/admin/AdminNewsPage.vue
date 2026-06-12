<template>
  <div class="admin-news">
    <h2 class="admin-page-title">Управление новостями</h2>
    <button @click="showEditor = true; editItem = null" class="admin-btn admin-btn--primary">+ Создать новость</button>

    <table class="admin-table" v-if="news.length > 0">
      <thead>
        <tr>
          <th>Заголовок</th>
          <th>Слаг</th>
          <th>Статус</th>
          <th>Дата</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in news" :key="item.id">
          <td>{{ item.title }}</td>
          <td><code>{{ item.slug }}</code></td>
          <td><span class="status-badge" :class="item.published ? 'published' : 'draft'">{{ item.published ? 'Опубликовано' : 'Черновик' }}</span></td>
          <td>{{ formatDate(item.createdAt) }}</td>
          <td class="actions">
            <button @click="editItem = { ...item }; showEditor = true" class="admin-btn admin-btn--sm">✏️</button>
            <button @click="deleteNews(item.id)" class="admin-btn admin-btn--sm admin-btn--danger">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="empty-text">Новостей пока нет</p>

    <!-- Editor Modal -->
    <teleport to="body">
      <div v-if="showEditor" class="modal-overlay" @click.self="showEditor = false">
        <div class="modal-content">
          <h3>{{ editItem?.id ? 'Редактировать' : 'Создать' }} новость</h3>
          <form @submit.prevent="saveNews">
            <div class="form-group">
              <label>Заголовок</label>
              <input v-model="form.title" required placeholder="Заголовок новости">
            </div>
            <div class="form-group">
              <label>Слаг (URL)</label>
              <input v-model="form.slug" required placeholder="novaya-postupka">
            </div>
            <div class="form-group">
              <label>Краткое описание</label>
              <input v-model="form.excerpt" placeholder="Краткое описание для карточки">
            </div>
            <div class="form-group">
              <label>Теги (через запятую: акция, новинка, важное, полезное)</label>
              <input v-model="form.tags" placeholder="акция, новинка">
            </div>
            <div class="form-group">
              <label>Изображение (URL)</label>
              <input v-model="form.imageUrl" placeholder="https://...">
            </div>
            <div class="form-group">
              <label>Текст новости</label>
              <textarea v-model="form.content" rows="6" required placeholder="Полный текст новости..."></textarea>
            </div>
            <div class="form-group checkbox-group">
              <label>
                <input type="checkbox" v-model="form.published">
                Опубликовать
              </label>
            </div>
            <div class="modal-actions">
              <button type="button" @click="showEditor = false" class="admin-btn">Отмена</button>
              <button type="submit" class="admin-btn admin-btn--primary" :disabled="saving">
                {{ saving ? 'Сохранение...' : 'Сохранить' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { newsApi } from '../../api/news.api';

const news = ref<any[]>([]);
const showEditor = ref(false);
const editItem = ref<any>(null);
const saving = ref(false);

const form = reactive({
  title: '',
  slug: '',
  excerpt: '',
  tags: '',
  imageUrl: '',
  content: '',
  published: false,
});

watch(editItem, (val) => {
  if (val) {
    form.title = val.title || '';
    form.slug = val.slug || '';
    form.excerpt = val.excerpt || '';
    form.tags = val.tags || '';
    form.imageUrl = val.imageUrl || '';
    form.content = val.content || '';
    form.published = val.published || false;
  } else {
    form.title = '';
    form.slug = '';
    form.excerpt = '';
    form.tags = '';
    form.imageUrl = '';
    form.content = '';
    form.published = false;
  }
});

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('ru-RU');
}

async function fetchNews() {
  try {
    news.value = await newsApi.adminGetAll();
  } catch { /* ignore */ }
}

async function saveNews() {
  saving.value = true;
  try {
    if (editItem.value?.id) {
      await newsApi.update(editItem.value.id, form);
    } else {
      await newsApi.create(form);
    }
    showEditor.value = false;
    await fetchNews();
  } catch (e) { /* ignore */ }
  saving.value = false;
}

async function deleteNews(id: string) {
  if (!confirm('Удалить новость?')) return;
  try {
    await newsApi.delete(id);
    await fetchNews();
  } catch { /* ignore */ }
}

onMounted(fetchNews);
</script>

<style scoped>
.admin-news { padding: 24px; }
.admin-page-title { font-family: var(--font-heading); font-weight: 700; font-size: 24px; margin-bottom: 20px; }
.admin-btn { padding: 8px 16px; border: 1px solid var(--color-border); border-radius: var(--radius-md); background: #fff; cursor: pointer; font-family: var(--font-body); font-size: 14px; transition: all var(--transition-fast); }
.admin-btn:hover { background: var(--color-border-light); }
.admin-btn--primary { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }
.admin-btn--primary:hover { background: var(--color-primary-dark); }
.admin-btn--sm { padding: 4px 8px; font-size: 12px; }
.admin-btn--danger { color: var(--color-error); }
.admin-btn--danger:hover { background: #fef2f2; }
.admin-table { width: 100%; border-collapse: collapse; margin-top: 16px; }
.admin-table th, .admin-table td { text-align: left; padding: 12px; border-bottom: 1px solid var(--color-border); font-size: 14px; }
.admin-table th { font-weight: 600; background: var(--color-surface); }
.actions { display: flex; gap: 6px; }
.status-badge { padding: 2px 8px; border-radius: var(--radius-sm); font-size: 12px; font-weight: 600; }
.status-badge.published { background: #d1fae5; color: #065f46; }
.status-badge.draft { background: #fef3c7; color: #92400e; }
.empty-text { color: var(--color-text-muted); margin-top: 16px; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000; }
.modal-content { background: #fff; border-radius: var(--radius-xl); padding: 28px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; }
.modal-content h3 { font-family: var(--font-heading); font-weight: 700; font-size: 20px; margin-bottom: 20px; }
.form-group { margin-bottom: 14px; }
.form-group label { display: block; font-weight: 500; font-size: 14px; margin-bottom: 4px; }
.form-group input, .form-group textarea { width: 100%; padding: 10px; border: 1px solid var(--color-border); border-radius: var(--radius-md); font-size: 14px; color: var(--color-text); }
.form-group textarea { resize: vertical; }
.checkbox-group label { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.checkbox-group input { width: auto; }
.modal-actions { display: flex; gap: 12px; margin-top: 20px; }
</style>