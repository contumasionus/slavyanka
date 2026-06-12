<template>
  <div class="admin-products">
    <div class="admin-header">
      <h1 class="admin-title">Управление товарами</h1>
      <button @click="showForm = true" class="btn btn--primary">+ Добавить товар</button>
    </div>

    <div v-if="error" class="alert alert--error">{{ error }}</div>

    <div class="admin-list">
      <div v-for="product in products" :key="product.id" class="admin-item">
        <div class="admin-item__img-wrap">
          <img :src="product.imageUrl || '/images/products/placeholder.svg'" :alt="product.name" class="admin-item__img">
        </div>
        <div class="admin-item__info">
          <h3 class="admin-item__name">{{ product.name }}</h3>
          <span class="admin-item__price">{{ product.price }}₽</span>
          <span v-if="product.discountPrice" class="tag tag--discount">Скидка: {{ product.discountPrice }}₽</span>
          <span :class="product.inStock ? 'tag tag--green' : 'tag tag--red'">
            {{ product.inStock ? 'В наличии' : 'Нет в наличии' }}
          </span>
        </div>
        <div class="admin-item__actions">
          <button @click="editProduct(product)" class="btn btn--sm btn--outline">Редактировать</button>
          <button @click="deleteProduct(product.id)" class="btn btn--sm btn--danger">Удалить</button>
        </div>
      </div>
    </div>

    <!-- Модалка формы -->
    <teleport to="body">
      <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
        <div class="modal-card">
          <h2 class="modal-title">{{ editingProduct ? 'Редактировать товар' : 'Добавить товар' }}</h2>
          <form @submit.prevent="saveProduct" class="admin-form">
            <div class="form-group">
              <label>Название *</label>
              <input v-model="form.name" required placeholder="Название товара">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Цена *</label>
                <input v-model="form.price" type="number" step="any" required placeholder="0">
              </div>
              <div class="form-group">
                <label>Вес / объем</label>
                <input v-model="form.weight" placeholder="500 г">
              </div>
            </div>
            <div class="form-group">
              <label>Категория *</label>
              <select v-model="form.categoryId" required>
                <option value="">Выберите категорию</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Описание</label>
              <textarea v-model="form.description" rows="3" placeholder="Описание товара..."></textarea>
            </div>
            <div class="form-group">
              <label>Состав</label>
              <input v-model="form.composition" placeholder="Состав и ингредиенты">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Производитель</label>
                <input v-model="form.manufacturer" placeholder="Производитель">
              </div>
              <div class="form-group">
                <label>Страна</label>
                <input v-model="form.country" placeholder="Страна происхождения">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Срок годности</label>
                <input v-model="form.shelfLife" placeholder="Например: 12 месяцев">
              </div>
            </div>
            <div class="form-section">
              <h3 class="form-section__title">Пищевая ценность (на 100 г)</h3>
              <div class="form-row">
                <div class="form-group">
                  <label>Калории (ккал)</label>
                  <input v-model.number="form.calories" type="number" placeholder="0">
                </div>
                <div class="form-group">
                  <label>Белки (г)</label>
                  <input v-model.number="form.proteins" type="number" step="0.1" placeholder="0">
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Жиры (г)</label>
                  <input v-model.number="form.fats" type="number" step="0.1" placeholder="0">
                </div>
                <div class="form-group">
                  <label>Углеводы (г)</label>
                  <input v-model.number="form.carbohydrates" type="number" step="0.1" placeholder="0">
                </div>
              </div>
            </div>

            <!-- Секция скидок и акций -->
            <div class="form-section">
              <h3 class="form-section__title">🏷️ Скидки и акции</h3>
              <div class="form-row">
                <div class="form-group">
                  <label>Цена со скидкой</label>
                  <input v-model="form.discountPrice" type="number" step="any" placeholder="Оставьте пустым без скидки">
                </div>
                <div class="form-group">
                  <label>Скидка до</label>
                  <input v-model="form.discountUntil" type="date">
                </div>
              </div>
              <div class="form-group form-group--checkbox">
                <label><input type="checkbox" v-model="form.isPromo"> Отметить как «Акция»</label>
              </div>
            </div>

            <div class="form-group">
              <label>Изображение</label>
              <div class="image-tabs">
                <button type="button" :class="['btn btn--tab', { active: imageTab === 'upload' }]" @click="imageTab = 'upload'">Загрузить с ПК</button>
                <button type="button" :class="['btn btn--tab', { active: imageTab === 'gallery' }]" @click="openGallery">Выбрать из папки</button>
              </div>
              <div v-if="imageTab === 'upload'" class="image-upload">
                <input type="file" @change="handleImageUpload" accept="image/*" class="file-input">
                <span v-if="uploading" class="upload-status">Загрузка...</span>
              </div>
              <div v-if="imagePreview" class="image-preview">
                <img :src="imagePreview" alt="Предпросмотр">
                <button type="button" @click="removeImage" class="btn btn--sm btn--danger">✕ Удалить</button>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Дата поставки</label>
                <input v-model="form.deliveryDate" type="date">
              </div>
              <div class="form-group form-group--checkbox">
                <label><input type="checkbox" v-model="form.inStock"> В наличии</label>
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

    <!-- Галерея -->
    <teleport to="body">
      <div v-if="showGallery" class="modal-overlay" @click.self="closeGallery">
        <div class="modal-card gallery-modal">
          <div class="gallery-header">
            <h2>Изображения на сервере</h2>
            <button @click="closeGallery" class="btn btn--sm btn--outline">✕ Закрыть</button>
          </div>
          <div v-if="galleryLoading" class="gallery-loading">Загрузка...</div>
          <div v-else-if="galleryFiles.length === 0" class="gallery-empty">
            <p>Изображений пока нет</p>
          </div>
          <div v-else class="gallery-grid">
            <div
              v-for="file in galleryFiles" :key="file.filename"
              class="gallery-item" :class="{ selected: form.imageUrl === file.url }"
              @click="selectFromGallery(file)"
            >
              <img :src="file.url" :alt="file.filename" class="gallery-img">
              <div class="gallery-item-overlay"><span class="gallery-check">✓</span></div>
              <span class="gallery-name">{{ file.filename }}</span>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { productsApi } from '../../api/products.api';
import { categoriesApi } from '../../api/categories.api';
import { uploadApi } from '../../api/upload.api';

interface Product { id: string; name: string; price: number; weight?: string; imageUrl?: string; categoryId: string; description?: string; inStock: boolean; deliveryDate?: string; composition?: string; manufacturer?: string; country?: string; shelfLife?: string; calories?: number; proteins?: number; fats?: number; carbohydrates?: number; discountPrice?: number; discountUntil?: string; isPromo?: boolean; }
interface Category { id: string; name: string; slug: string; }
interface GalleryFile { filename: string; url: string; size: number; uploadedAt: string; }

const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const showForm = ref(false);
const editingProduct = ref<Product | null>(null);
const imagePreview = ref('');
const imageTab = ref<'upload' | 'gallery'>('upload');
const uploading = ref(false);
const error = ref('');
const showGallery = ref(false);
const galleryLoading = ref(false);
const galleryFiles = ref<GalleryFile[]>([]);

const form = ref({ name: '', price: 0, weight: '', categoryId: '', description: '', inStock: true, deliveryDate: '', imageUrl: '', composition: '', manufacturer: '', country: '', shelfLife: '', calories: null as number | null, proteins: null as number | null, fats: null as number | null, carbohydrates: null as number | null, discountPrice: null as number | null, discountUntil: '', isPromo: false });

onMounted(async () => {
  await loadProducts();
  categories.value = await categoriesApi.getAll();
});

async function loadProducts() { products.value = await productsApi.getAll(); }

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
    imageUrl: product.imageUrl || '',
    composition: product.composition || '',
    manufacturer: product.manufacturer || '',
    country: product.country || '',
    shelfLife: product.shelfLife || '',
    calories: product.calories ?? null,
    proteins: product.proteins ?? null,
    fats: product.fats ?? null,
    carbohydrates: product.carbohydrates ?? null,
    discountPrice: product.discountPrice ?? null,
    discountUntil: product.discountUntil ? product.discountUntil.slice(0, 10) : '',
    isPromo: product.isPromo ?? false,
  };
  imagePreview.value = product.imageUrl || '';
  showForm.value = true;
}

async function saveProduct() {
  error.value = '';
  if (!form.value.name.trim()) { error.value = 'Название обязательно'; return; }
  if (!form.value.categoryId) { error.value = 'Выберите категорию'; return; }
  if (form.value.price <= 0) { error.value = 'Цена должна быть больше 0'; return; }
  try {
    const data: any = { name: form.value.name.trim(), price: Number(form.value.price), categoryId: form.value.categoryId, inStock: form.value.inStock };
    if (form.value.description?.trim()) data.description = form.value.description.trim();
    if (form.value.weight?.trim()) data.weight = form.value.weight.trim();
    if (form.value.imageUrl) data.imageUrl = form.value.imageUrl;
    if (!form.value.inStock && form.value.deliveryDate) data.deliveryDate = new Date(form.value.deliveryDate).toISOString();
    else data.deliveryDate = null;
    if (form.value.composition?.trim()) data.composition = form.value.composition.trim();
    if (form.value.manufacturer?.trim()) data.manufacturer = form.value.manufacturer.trim();
    if (form.value.country?.trim()) data.country = form.value.country.trim();
    if (form.value.shelfLife?.trim()) data.shelfLife = form.value.shelfLife.trim();
    if (form.value.calories != null) data.calories = form.value.calories;
    if (form.value.proteins != null) data.proteins = form.value.proteins;
    if (form.value.fats != null) data.fats = form.value.fats;
    if (form.value.carbohydrates != null) data.carbohydrates = form.value.carbohydrates;
    if (form.value.discountPrice != null && form.value.discountPrice > 0) data.discountPrice = Number(form.value.discountPrice);
    else data.discountPrice = null;
    if (form.value.discountUntil?.trim()) data.discountUntil = new Date(form.value.discountUntil).toISOString();
    else data.discountUntil = null;
    data.isPromo = form.value.isPromo;
    if (editingProduct.value) await productsApi.update(editingProduct.value.id, data);
    else await productsApi.create(data);
    await loadProducts();
    closeForm();
  } catch (e: any) { error.value = e.response?.data?.error || 'Ошибка сохранения'; }
}

async function deleteProduct(id: string) {
  if (!confirm('Удалить товар?')) return;
  error.value = '';
  try { await productsApi.delete(id); await loadProducts(); }
  catch (e: any) { error.value = e.response?.data?.error || 'Ошибка удаления'; }
}

function closeForm() {
  showForm.value = false; editingProduct.value = null; imagePreview.value = ''; imageTab.value = 'upload';
  form.value = { name: '', price: 0, weight: '', categoryId: '', description: '', inStock: true, deliveryDate: '', imageUrl: '', composition: '', manufacturer: '', country: '', shelfLife: '', calories: null, proteins: null, fats: null, carbohydrates: null, discountPrice: null, discountUntil: '', isPromo: false };
}

async function handleImageUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  if (file.size > 10 * 1024 * 1024) { alert('Максимум 10MB'); return; }
  if (!file.type.startsWith('image/')) { alert('Только изображения'); return; }
  uploading.value = true;
  try {
    const result = await uploadApi.uploadFile(file);
    if (result.success) { imagePreview.value = result.url; form.value.imageUrl = result.url; }
    else alert('Ошибка загрузки');
  } catch { alert('Ошибка загрузки'); }
  finally { uploading.value = false; (event.target as HTMLInputElement).value = ''; }
}

async function openGallery() {
  showGallery.value = true; galleryLoading.value = true;
  try { const result = await uploadApi.listUploads(); galleryFiles.value = result.files || []; }
  catch { galleryFiles.value = []; }
  finally { galleryLoading.value = false; }
}
function closeGallery() { showGallery.value = false; }
function selectFromGallery(file: GalleryFile) { imagePreview.value = file.url; form.value.imageUrl = file.url; imageTab.value = 'upload'; closeGallery(); }
function removeImage() { imagePreview.value = ''; form.value.imageUrl = ''; }
</script>

<style scoped>
.admin-products { padding: 24px; }
.admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.admin-title { font-family: var(--font-heading); font-weight: 700; font-size: 28px; color: var(--color-text); }

/* Alert */
.alert { padding: 12px 16px; border-radius: var(--radius-md); margin-bottom: 16px; font-family: var(--font-body); font-size: 14px; }
.alert--error { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; }

/* List */
.admin-list { display: flex; flex-direction: column; gap: 12px; }
.admin-item { display: flex; align-items: center; gap: 16px; background: var(--color-surface); border-radius: var(--radius-lg); padding: 16px 20px; border: 1px solid var(--color-border); box-shadow: var(--shadow-xs); }
.admin-item__img-wrap { width: 72px; height: 72px; border-radius: var(--radius-md); overflow: hidden; background: var(--color-border-light); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.admin-item__img { width: 100%; height: 100%; object-fit: contain; }
.admin-item__info { flex: 1; }
.admin-item__name { font-family: var(--font-heading); font-weight: 600; font-size: 16px; color: var(--color-text); margin-bottom: 4px; }
.admin-item__price { font-family: var(--font-heading); font-weight: 700; font-size: 18px; color: var(--color-primary); display: block; margin-bottom: 4px; }
.tag { display: inline-block; padding: 2px 10px; border-radius: var(--radius-full); font-size: 12px; font-weight: 500; }
.tag--green { background: #d1fae5; color: #065f46; }
.tag--red { background: #fee2e2; color: #991b1b; }
.tag--discount { background: #fef3cd; color: #92400e; margin-left: 4px; }
.admin-item__actions { display: flex; gap: 8px; }

/* Common buttons */
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 20px; border-radius: var(--radius-full); font-family: var(--font-heading); font-weight: 600; font-size: 14px; border: none; cursor: pointer; text-decoration: none; transition: all var(--transition-fast); }
.btn--primary { background: var(--color-primary); color: #fff; }
.btn--primary:hover { background: var(--color-primary-dark); }
.btn--outline { background: none; border: 1px solid var(--color-border); color: var(--color-text-secondary); }
.btn--outline:hover { border-color: var(--color-primary); color: var(--color-primary); }
.btn--danger { background: #fef2f2; color: var(--color-error); border: 1px solid #fecaca; }
.btn--danger:hover { background: #fecaca; }
.btn--sm { padding: 6px 14px; font-size: 13px; }
.btn--tab { border-radius: 0; border: none; background: var(--color-border-light); color: var(--color-text-secondary); font-size: 13px; }
.btn--tab:hover { background: var(--color-border); }
.btn--tab.active { background: var(--color-primary); color: #fff; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 16px; }
.modal-card { background: var(--color-surface); border-radius: var(--radius-xl); padding: 28px; width: 100%; max-width: 540px; max-height: 90vh; overflow-y: auto; }
.modal-title { font-family: var(--font-heading); font-weight: 700; font-size: 22px; color: var(--color-text); margin-bottom: 20px; }
.gallery-modal { max-width: 680px; }

.admin-form { display: flex; flex-direction: column; gap: 14px; }
.form-group { display: flex; flex-direction: column; gap: 4px; }
.form-group label { font-family: var(--font-heading); font-weight: 500; font-size: 13px; color: var(--color-text-secondary); }
.form-group input, .form-group select, .form-group textarea {
  padding: 10px 12px; border: 1px solid var(--color-border); border-radius: var(--radius-md);
  font-family: var(--font-body); font-size: 14px; background: var(--color-background);
  color: var(--color-text); transition: all var(--transition-fast);
}
.form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: none; border-color: var(--color-primary); }
.form-row { display: flex; gap: 12px; }
.form-row .form-group { flex: 1; }
.form-group--checkbox { justify-content: flex-end; align-items: flex-end; }
.form-group--checkbox label { display: flex; align-items: center; gap: 6px; cursor: pointer; }

.image-tabs { display: flex; border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden; }
.image-upload { margin-top: 8px; }
.file-input { font-size: 13px; }
.upload-status { font-size: 12px; color: var(--color-primary); margin-left: 8px; }
.image-preview { margin-top: 8px; display: flex; align-items: center; gap: 10px; }
.image-preview img { width: 80px; height: 80px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--color-border); }
.form-section { background: var(--color-background); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 14px; }
.form-section__title { font-family: var(--font-heading); font-weight: 600; font-size: 14px; color: var(--color-text); margin: 0 0 10px 0; }

.modal-actions { display: flex; gap: 10px; margin-top: 6px; }

/* Gallery */
.gallery-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.gallery-header h2 { font-size: 20px; margin: 0; }
.gallery-loading, .gallery-empty { text-align: center; padding: 40px; color: var(--color-text-muted); }
.gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 10px; }
.gallery-item { position: relative; border: 2px solid var(--color-border); border-radius: var(--radius-sm); overflow: hidden; cursor: pointer; transition: all var(--transition-fast); aspect-ratio: 1; }
.gallery-item:hover { border-color: var(--color-primary); transform: translateY(-2px); }
.gallery-item.selected { border-color: var(--color-primary); box-shadow: 0 0 0 2px var(--color-primary); }
.gallery-img { width: 100%; height: 100%; object-fit: cover; }
.gallery-item-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.3); opacity: 0; transition: opacity var(--transition-fast); }
.gallery-item:hover .gallery-item-overlay, .gallery-item.selected .gallery-item-overlay { opacity: 1; }
.gallery-check { color: #fff; font-size: 28px; font-weight: bold; }
.gallery-name { font-size: 10px; color: var(--color-text-muted); text-align: center; display: block; padding: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

@media (max-width: 768px) {
  .admin-header { flex-direction: column; gap: 12px; align-items: flex-start; }
  .admin-item { flex-wrap: wrap; }
  .admin-item__actions { width: 100%; justify-content: flex-end; }
  .form-row { flex-direction: column; }
}
</style>